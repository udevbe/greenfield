// Copyright 2020 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import {
  Client,
  Global,
  Registry,
  WlKeyboardResource,
  WlPointerResource,
  WlSeatCapability,
  WlSeatRequests,
  WlSeatResource,
  WlTouchResource
} from 'westfield-runtime-server'

import { capabilities } from './browser/capabilities'
import DataDevice from './DataDevice'
import { CompositorSeat, CompositorSeatState } from './index'
import Keyboard from './Keyboard'

import Pointer from './Pointer'
import Session from './Session'
import Touch from './Touch'

const { keyboard, pointer, touch } = WlSeatCapability

/**
 *
 *            A seat is a group of keyboards, pointer and touch devices. This
 *            object is published as a global during start up, or when such a
 *            device is hot plugged.  A seat typically has a pointer and
 *            maintains a keyboard focus and a pointer focus.
 *
 */
class Seat implements WlSeatRequests, CompositorSeat {
  readonly dataDevice: DataDevice
  readonly pointer: Pointer
  readonly keyboard: Keyboard
  readonly touch: Touch
  readonly hasTouch: boolean
  serial: number = 0
  private _compositorSeatState: CompositorSeatState
  private _global?: Global
  private readonly _seatName: 'browser-seat0' = 'browser-seat0'
  private _keyboardResourceListeners: ((wlKeyboardResource: WlKeyboardResource) => void)[] = []

  static create(session: Session): Seat {
    const dataDevice = DataDevice.create()
    const keyboard = Keyboard.create(session, dataDevice)
    const pointer = Pointer.create(session, dataDevice)
    const touch = Touch.create()
    const hasTouch = capabilities.hasTouch

    const userSeatState = { pointerGrab: undefined, keyboardFocus: undefined }

    const seat = new Seat(session, dataDevice, pointer, keyboard, touch, hasTouch, userSeatState)
    dataDevice.seat = seat
    keyboard.seat = seat
    pointer.seat = seat
    touch.seat = seat

    return seat
  }

  private constructor(private session: Session, dataDevice: DataDevice, pointer: Pointer, keyboard: Keyboard, touch: Touch, hasTouch: boolean, userSeatState: CompositorSeatState) {
    this.dataDevice = dataDevice
    this.pointer = pointer
    this.keyboard = keyboard
    this.touch = touch
    this.hasTouch = hasTouch
    this._compositorSeatState = userSeatState
  }

  set compositorSeatState(compositorSeatState: CompositorSeatState) {
    const { keyboardFocus, pointerGrab } = compositorSeatState
    const equals = keyboardFocus?.id === this._compositorSeatState.keyboardFocus?.id
      && keyboardFocus?.clientId === this._compositorSeatState.keyboardFocus?.clientId
      && pointerGrab?.id === this._compositorSeatState.pointerGrab?.id
      && pointerGrab?.clientId === this._compositorSeatState.pointerGrab?.clientId

    this._compositorSeatState = compositorSeatState
    if (!equals) {
      this.session.userShell.events.updateUserSeat?.(compositorSeatState)
    }
  }

  registerGlobal(registry: Registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlSeatResource.protocolName, 6, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal() {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = undefined
  }

  bindClient(client: Client, id: number, version: number) {
    const wlSeatResource = new WlSeatResource(client, id, version)
    if (this._global) {
      wlSeatResource.implementation = this

      this._emitCapabilities(wlSeatResource)
      this._emitName(wlSeatResource)
    } else {
      // no global present and still receiving a bind can happen when there is a race between the compositor
      // unregistering the global and a client binding to it. As such we handle it here.
      wlSeatResource.implementation = {
        getKeyboard(): void {
        },
        getPointer(): void {
        },
        getTouch(): void {
        },
        release: resource => resource.destroy()
      }
    }
  }

  private _emitCapabilities(wlSeatResource: WlSeatResource) {
    if (!this._global) {
      return
    }

    let caps = pointer | keyboard
    if (this.hasTouch) {
      caps |= touch
    }
    wlSeatResource.capabilities(caps)
  }

  private _emitName(wlSeatResource: WlSeatResource) {
    if (wlSeatResource.version >= 2) {
      wlSeatResource.name(this._seatName)
    }
  }

  nextSerial(): number {
    return ++this.serial
  }

  isValidInputSerial(serial: number): boolean {
    return serial === this.serial
  }

  getPointer(resource: WlSeatResource, id: number) {
    const wlPointerResource = new WlPointerResource(resource.client, id, resource.version)

    if (this._global) {
      wlPointerResource.implementation = this.pointer
      this.pointer.resources = [...this.pointer.resources, wlPointerResource]
      wlPointerResource.onDestroy().then(() => {
        this.pointer.resources = this.pointer.resources.filter(otherResource => otherResource !== wlPointerResource)
      })
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlPointerResource.implementation = {
        release(resource: WlPointerResource): void {
          resource.destroy()
        },
        setCursor(): void {
        }
      }
    }
  }

  getKeyboard(resource: WlSeatResource, id: number) {
    const wlKeyboardResource = new WlKeyboardResource(resource.client, id, resource.version)
    if (this._global) {
      wlKeyboardResource.implementation = this.keyboard
      this.keyboard.resources = [...this.keyboard.resources, wlKeyboardResource]
      wlKeyboardResource.onDestroy().then(() => {
        this.keyboard.resources = this.keyboard.resources.filter(otherResource => otherResource !== wlKeyboardResource)
      })

      this.keyboard.emitKeymap(wlKeyboardResource)
      this.keyboard.emitKeyRepeatInfo(wlKeyboardResource)
      this._keyboardResourceListeners.forEach((listener) => listener(wlKeyboardResource))
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlKeyboardResource.implementation = {
        release(resource: WlKeyboardResource): void {
          resource.destroy()
        }
      }
    }
  }

  addKeyboardResourceListener(listener: (wlKeyboardResource: WlKeyboardResource) => void) {
    this._keyboardResourceListeners = [...this._keyboardResourceListeners, listener]
  }

  removeKeyboardResourceListener(listener: (wlKeyboardResource: WlKeyboardResource) => void) {
    this._keyboardResourceListeners = this._keyboardResourceListeners.filter(otherListener => otherListener !== listener)
  }

  getTouch(resource: WlSeatResource, id: number) {
    const wlTouchResource = new WlTouchResource(resource.client, id, resource.version)

    if (this.hasTouch && this._global) {
      this.touch.resources = [...this.touch.resources, wlTouchResource]
      wlTouchResource.implementation = this.touch
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlTouchResource.implementation = {
        release(resource: WlTouchResource): void {
          resource.destroy()
        }
      }
    }
  }

  release(resource: WlSeatResource) {
    resource.destroy()
  }
}

export default Seat
