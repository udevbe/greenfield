'use strict'

import WlSeatRequests from './protocol/WlSeatRequests'
import WlSeatResource from './protocol/WlSeatResource'
import WlPointerResource from './protocol/WlPointerResource'
import WlKeyboardResource from './protocol/WlKeyboardResource'
import WlTouchResource from './protocol/WlTouchResource'

import Pointer from './Pointer'
import Keyboard from './Keyboard'
import Touch from './Touch'
import DataDevice from './DataDevice'

const {keyboard, pointer, touch} = WlSeatResource.Capability

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

    const seat = new Seat(dataDevice, pointer, keyboard, touch, hasTouch)
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
   * @private
   */
  constructor (dataDevice, pointer, keyboard, touch, hasTouch) {
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
     * @type {number}
     */
    this.buttonPressSerial = 0
    /**
     * @type {number}
     */
    this.buttonReleaseSerial = 0
    /**
     * @type {number}
     */
    this.keyPressSerial = 0
    /**
     * @type {number}
     */
    this.keyReleaseSerial = 0
    /**
     * @type {number}
     */
    this.touchDownSerial = 0
    /**
     * @type {number}
     */
    this.touchUpSerial = 0
    /**
     * @type {number}
     */
    this.enterSerial = 0
    /**
     * @type {Array<function(WlKeyboardResource):void>}
     * @private
     */
    this._keyboardResourceListeners = []
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlSeatResource.name, 6, (client, id, version) => {
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
    wlSeatResource.implementation = this
    this._boundResources.push(wlSeatResource)

    wlSeatResource.onDestroy().then((resource) => {
      const index = this._boundResources.indexOf(resource)
      this._boundResources.splice(index, 1)
    })

    this._emitCapabilities(wlSeatResource)
    this._emitName(wlSeatResource)
  }

  /**
   * @param {WlSeatResource}wlSeatResource
   * @private
   */
  _emitCapabilities (wlSeatResource) {
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
    this.serial++
    if (this.serial & (1 << 29)) {
      this.serial = 0
    }
    return this.serial
  }

  /**
   * @param {number}serial
   * @return {boolean}
   */
  isValidInputSerial (serial) {
    return serial === this.buttonPressSerial || serial === this.buttonReleaseSerial || serial === this.keyPressSerial ||
      serial === this.keyReleaseSerial || serial === this.touchDownSerial || serial === this.touchUpSerial
  }

  /**
   * @return {number}
   */
  nextEnterSerial () {
    this.enterSerial = this.nextSerial()
    return this.enterSerial
  }

  /**
   * @param {boolean}down
   * @return {number}
   */
  nextButtonSerial (down) {
    if (down) {
      const mask = 1 << 29
      this.buttonPressSerial = this.nextSerial() | mask
      return this.buttonPressSerial
    } else {
      const mask = 2 << 29
      this.buttonReleaseSerial = this.nextSerial() | mask
      return this.buttonReleaseSerial
    }
  }

  /**
   * @param {boolean}down
   * @return {number}
   */
  nextKeySerial (down) {
    if (down) {
      const mask = 3 << 29
      this.keyPressSerial = this.nextSerial() | mask
      return this.keyPressSerial
    } else {
      const mask = 4 << 29
      this.keyReleaseSerial = this.nextSerial() | mask
      return this.keyReleaseSerial
    }
  }

  /**
   * @param {boolean}down
   * @return {number}
   */
  nextTouchSerial (down) {
    if (down) {
      const mask = 5 << 29
      this.touchDownSerial = this.nextSerial() | mask
      return this.touchDownSerial
    } else {
      const mask = 6 << 29
      this.touchUpSerial = this.nextSerial() | mask
      return this.touchUpSerial
    }
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
