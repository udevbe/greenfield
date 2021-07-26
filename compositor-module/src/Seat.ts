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
  WlTouchResource,
} from 'westfield-runtime-server'

import { capabilities } from './browser/capabilities'
import DataDevice from './DataDevice'
import { CompositorSeat } from './index'
import Keyboard from './Keyboard'

import Pointer from './Pointer'
import Session from './Session'
import Touch from './Touch'

const { keyboard, pointer, touch } = WlSeatCapability

class Seat implements WlSeatRequests, CompositorSeat {
  static create(session: Session): Seat {
    const dataDevice = DataDevice.create()
    const keyboard = Keyboard.create(session, dataDevice)
    const pointer = Pointer.create(session, dataDevice)
    const touch = Touch.create()
    const hasTouch = capabilities.hasTouch

    const seat = new Seat(dataDevice, pointer, keyboard, touch, hasTouch)
    dataDevice.seat = seat
    keyboard.seat = seat
    pointer.seat = seat
    touch.seat = seat

    return seat
  }

  serial = 0
  private _global?: Global
  private readonly _seatName: 'browser-seat0' = 'browser-seat0'
  private _keyboardResourceListeners: ((wlKeyboardResource: WlKeyboardResource) => void)[] = []

  private constructor(
    public readonly dataDevice: DataDevice,
    public readonly pointer: Pointer,
    public readonly keyboard: Keyboard,
    public readonly touch: Touch,
    public readonly hasTouch: boolean,
  ) {}

  registerGlobal(registry: Registry): void {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlSeatResource.protocolName, 6, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal(): void {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = undefined
  }

  bindClient(client: Client, id: number, version: number): void {
    const wlSeatResource = new WlSeatResource(client, id, version)
    if (this._global) {
      wlSeatResource.implementation = this

      this.emitCapabilities(wlSeatResource)
      this.emitName(wlSeatResource)
    } else {
      // no global present and still receiving a bind can happen when there is a race between the compositor
      // unregistering the global and a client binding to it. As such we handle it here.
      wlSeatResource.implementation = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getKeyboard(): void {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getPointer(): void {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getTouch(): void {},
        release: (resource) => resource.destroy(),
      }
    }
  }

  private emitCapabilities(wlSeatResource: WlSeatResource) {
    if (!this._global) {
      return
    }

    let caps = pointer | keyboard
    if (this.hasTouch) {
      caps |= touch
    }
    wlSeatResource.capabilities(caps)
  }

  private emitName(wlSeatResource: WlSeatResource) {
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

  getPointer(resource: WlSeatResource, id: number): void {
    const wlPointerResource = new WlPointerResource(resource.client, id, resource.version)

    if (this._global) {
      wlPointerResource.implementation = this.pointer
      this.pointer.resources = [...this.pointer.resources, wlPointerResource]
      wlPointerResource.onDestroy().then(() => {
        this.pointer.resources = this.pointer.resources.filter((otherResource) => otherResource !== wlPointerResource)
      })
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlPointerResource.implementation = {
        release(resource: WlPointerResource): void {
          resource.destroy()
        },
        setCursor(): void {},
      }
    }
  }

  getKeyboard(resource: WlSeatResource, id: number): void {
    const wlKeyboardResource = new WlKeyboardResource(resource.client, id, resource.version)
    if (this._global) {
      wlKeyboardResource.implementation = this.keyboard
      this.keyboard.resources = [...this.keyboard.resources, wlKeyboardResource]
      wlKeyboardResource.onDestroy().then(() => {
        this.keyboard.resources = this.keyboard.resources.filter(
          (otherResource) => otherResource !== wlKeyboardResource,
        )
      })

      this.keyboard.emitKeymap(wlKeyboardResource)
      this.keyboard.emitKeyRepeatInfo(wlKeyboardResource)
      this._keyboardResourceListeners.forEach((listener) => listener(wlKeyboardResource))
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlKeyboardResource.implementation = {
        release(resource: WlKeyboardResource): void {
          resource.destroy()
        },
      }
    }
  }

  addKeyboardResourceListener(listener: (wlKeyboardResource: WlKeyboardResource) => void): void {
    this._keyboardResourceListeners = [...this._keyboardResourceListeners, listener]
  }

  removeKeyboardResourceListener(listener: (wlKeyboardResource: WlKeyboardResource) => void): void {
    this._keyboardResourceListeners = this._keyboardResourceListeners.filter(
      (otherListener) => otherListener !== listener,
    )
  }

  getTouch(resource: WlSeatResource, id: number): void {
    const wlTouchResource = new WlTouchResource(resource.client, id, resource.version)

    if (this.hasTouch && this._global) {
      this.touch.resources = [...this.touch.resources, wlTouchResource]
      wlTouchResource.implementation = this.touch
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlTouchResource.implementation = {
        release(resource: WlTouchResource): void {
          resource.destroy()
        },
      }
    }
  }

  release(resource: WlSeatResource): void {
    resource.destroy()
  }
}

export default Seat
