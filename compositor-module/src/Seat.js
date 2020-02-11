// Copyright 2019 Erik De Rijcke
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
  WlKeyboardResource,
  WlPointerResource,
  WlSeatRequests,
  WlSeatResource,
  WlTouchResource
} from 'westfield-runtime-server'

import Pointer from './Pointer'
import Keyboard from './Keyboard'
import Touch from './Touch'
import DataDevice from './DataDevice'

const { keyboard, pointer, touch } = WlSeatResource.Capability

/**
 *
 *            A seat is a group of keyboards, pointer and touch devices. This
 *            object is published as a global during start up, or when such a
 *            device is hot plugged.  A seat typically has a pointer and
 *            maintains a keyboard focus and a pointer focus.
 *
 */
class Seat extends WlSeatRequests {
  /**
   * @param {Session} session
   * @returns {Seat}
   */
  static create (session) {
    const dataDevice = DataDevice.create()
    const keyboard = Keyboard.create(session, dataDevice)
    const pointer = Pointer.create(session, dataDevice)
    const touch = Touch.create()
    const hasTouch = 'ontouchstart' in document.documentElement

    const userSeatState = { pointerGrab: null, keyboardFocus: null }

    const seat = new Seat(dataDevice, pointer, keyboard, touch, hasTouch, userSeatState)
    dataDevice.seat = seat

    keyboard.seat = seat
    pointer.seat = seat
    touch.seat = seat

    return seat
  }

  /**
   * @param {!DataDevice} dataDevice
   * @param {Pointer} pointer
   * @param {Keyboard} keyboard
   * @param {Touch} touch
   * @param {boolean} hasTouch
   * @param {UserSeatState}userSeatState
   * @private
   */
  constructor (dataDevice, pointer, keyboard, touch, hasTouch, userSeatState) {
    super()
    /**
     * @type {!DataDevice}
     * @const
     */
    this.dataDevice = dataDevice
    /**
     * @type {!Pointer}
     * @const
     */
    this.pointer = pointer
    /**
     * @type {!Keyboard}
     * @const
     */
    this.keyboard = keyboard
    /**
     * @type {!Touch}
     * @const
     */
    this.touch = touch
    /**
     * @type {boolean}
     */
    this.hasTouch = hasTouch
    /**
     * @type {Global}
     * @private
     */
    this._global = null
    /**
     * @type {string}
     * @private
     * @const
     */
    this._seatName = 'browser-seat0'

    /**
     * @type {number}
     */
    this.serial = 0
    /**
     * @type {Array<function(WlKeyboardResource):void>}
     * @private
     */
    this._keyboardResourceListeners = []
    /**
     * @type {UserSeatState}
     */
    this.userSeatState = userSeatState
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlSeatResource.protocolName, 6, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal () {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = null
  }

  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const wlSeatResource = new WlSeatResource(client, id, version)
    if (this._global) {
      wlSeatResource.implementation = this

      this._emitCapabilities(wlSeatResource)
      this._emitName(wlSeatResource)
    } else {
      // no global present and still receiving a bind can happen when there is a race between the compositor
      // unregistering the global and a client binding to it. As such we handle it here.
      wlSeatResource.implementation = new WlSeatRequests()
      wlSeatResource.implementation.release = resource => resource.destroy()
    }
  }

  /**
   * @param {WlSeatResource}wlSeatResource
   * @private
   */
  _emitCapabilities (wlSeatResource) {
    if (!this._global) {
      return
    }

    let caps = pointer | keyboard
    if (this.hasTouch) {
      caps |= touch
    }
    wlSeatResource.capabilities(caps)
  }

  /**
   * @param {WlSeatResource}wlSeatResource
   * @private
   */
  _emitName (wlSeatResource) {
    if (wlSeatResource.version >= 2) {
      wlSeatResource.name(this._seatName)
    }
  }

  /**
   * @return {number}
   */
  nextSerial () {
    return ++this.serial
  }

  /**
   * @param {number}serial
   * @return {boolean}
   */
  isValidInputSerial (serial) {
    return serial === this.serial
  }

  /**
   *
   *                The ID provided will be initialized to the wl_pointer interface
   *                for this seat.
   *
   *                This request only takes effect if the seat has the pointer
   *                capability, or has had the pointer capability in the past.
   *                It is a protocol violation to issue this request on a seat that has
   *                never had the pointer capability.
   *
   *
   * @param {WlSeatResource} resource
   * @param {number} id seat pointer
   *
   * @since 1
   * @override
   */
  getPointer (resource, id) {
    const wlPointerResource = new WlPointerResource(resource.client, id, resource.version)
    wlPointerResource.implementation = this.pointer
    this.pointer.resources.push(wlPointerResource)
    wlPointerResource.onDestroy().then(() => {
      const idx = this.pointer.resources.indexOf(wlPointerResource)
      if (idx > -1) {
        this.pointer.resources.splice(idx, 1)
      }
    })
  }

  /**
   *
   *                The ID provided will be initialized to the wl_keyboard interface
   *                for this seat.
   *
   *                This request only takes effect if the seat has the keyboard
   *                capability, or has had the keyboard capability in the past.
   *                It is a protocol violation to issue this request on a seat that has
   *                never had the keyboard capability.
   *
   *
   * @param {WlSeatResource} resource
   * @param {number} id seat keyboard
   *
   * @since 1
   * @override
   */
  getKeyboard (resource, id) {
    const wlKeyboardResource = new WlKeyboardResource(resource.client, id, resource.version)
    wlKeyboardResource.implementation = this.keyboard
    this.keyboard.resources.push(wlKeyboardResource)
    wlKeyboardResource.onDestroy().then(() => {
      const idx = this.keyboard.resources.indexOf(wlKeyboardResource)
      if (idx > -1) {
        this.keyboard.resources.splice(idx, 1)
      }
    })

    this.keyboard.emitKeymap(wlKeyboardResource)
    this.keyboard.emitKeyRepeatInfo(wlKeyboardResource)
    this._keyboardResourceListeners.forEach((listener) => listener(wlKeyboardResource))
  }

  /**
   * @param {function(WlKeyboardResource):void}listener
   */
  addKeyboardResourceListener (listener) {
    this._keyboardResourceListeners.push(listener)
  }

  /**
   * @param {function(WlKeyboardResource):void}listener
   */
  removeKeyboardResourceListener (listener) {
    const idx = this._keyboardResourceListeners.indexOf(listener)
    if (idx > -1) {
      this._keyboardResourceListeners.splice(idx, 1)
    }
  }

  /**
   *
   *                The ID provided will be initialized to the wl_touch interface
   *                for this seat.
   *
   *                This request only takes effect if the seat has the touch
   *                capability, or has had the touch capability in the past.
   *                It is a protocol violation to issue this request on a seat that has
   *                never had the touch capability.
   *
   *
   * @param {WlSeatResource} resource
   * @param {number} id seat touch interface
   *
   * @since 1
   * @override
   */
  getTouch (resource, id) {
    const wlTouchResource = new WlTouchResource(resource.client, id, resource.version)
    this.touch.resources.push(wlTouchResource)

    if (this.hasTouch) {
      wlTouchResource.implementation = this.touch
    }
  }

  /**
   *
   *                Using this request a client can tell the server that it is not going to
   *                use the seat object anymore.
   *
   *
   * @param {WlSeatResource} resource
   *
   * @since 5
   * @override
   */
  release (resource) {
    resource.destroy()
  }
}

export default Seat
