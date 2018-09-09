'use strict'

import GrSeatRequests from './protocol/GrSeatRequests'
import GrSeatResource from './protocol/GrSeatResource'
import GrPointerResource from './protocol/GrPointerResource'
import GrKeyboardResource from './protocol/GrKeyboardResource'
import GrTouchResource from './protocol/GrTouchResource'

import Pointer from './Pointer'
import Keyboard from './Keyboard'
import Touch from './Touch'
import DataDevice from './DataDevice'

const {keyboard, pointer, touch} = GrSeatResource.Capability

/**
 *
 *            A seat is a group of keyboards, pointer and touch devices. This
 *            object is published as a global during start up, or when such a
 *            device is hot plugged.  A seat typically has a pointer and
 *            maintains a keyboard focus and a pointer focus.
 *
 */
class Seat extends GrSeatRequests {
  /**
   * @param {Session} session
   * @returns {Seat}
   */
  static create (session) {
    const dataDevice = DataDevice.create()
    const keyboard = Keyboard.create(session, dataDevice)
    const pointer = Pointer.create(session, dataDevice, keyboard)
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
   * @param {DataDevice} dataDevice
   * @param {Pointer} pointer
   * @param {Keyboard} keyboard
   * @param {Touch} touch
   * @param {boolean} hasTouch
   * @private
   */
  constructor (dataDevice, pointer, keyboard, touch, hasTouch) {
    super()
    /**
     * @type {DataDevice}
     */
    this.dataDevice = dataDevice
    /**
     * @type {Pointer}
     */
    this.pointer = pointer
    /**
     * @type {Keyboard}
     */
    this.keyboard = keyboard
    /**
     * @type {Touch}
     */
    this.touch = touch
    /**
     * @type {boolean}
     */
    this.hasTouch = hasTouch
    this.resources = []
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
     * @type {Array<function(GrKeyboardResource):void>}
     * @private
     */
    this._keyboardResourceListeners = []
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    registry.createGlobal(this, GrSeatResource.name, 6, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const grSeatResource = new GrSeatResource(client, id, version)
    grSeatResource.implementation = this
    this.resources.push(grSeatResource)

    grSeatResource.onDestroy().then((resource) => {
      const index = this.resources.indexOf(resource)
      this.resources.splice(index, 1)
    })

    this._emitCapabilities(grSeatResource)
    this._emitName(grSeatResource)
  }

  /**
   * @param {GrSeatResource}grSeatResource
   * @private
   */
  _emitCapabilities (grSeatResource) {
    let caps = pointer | keyboard
    if (this.hasTouch) {
      caps |= touch
    }
    grSeatResource.capabilities(caps)
  }

  /**
   * @param {GrSeatResource}grSeatResource
   * @private
   */
  _emitName (grSeatResource) {
    if (grSeatResource.version >= 2) {
      grSeatResource.name(this._seatName)
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
   *                The ID provided will be initialized to the gr_pointer interface
   *                for this seat.
   *
   *                This request only takes effect if the seat has the pointer
   *                capability, or has had the pointer capability in the past.
   *                It is a protocol violation to issue this request on a seat that has
   *                never had the pointer capability.
   *
   *
   * @param {GrSeatResource} resource
   * @param {number} id seat pointer
   *
   * @since 1
   *
   */
  getPointer (resource, id) {
    const grPointerResource = new GrPointerResource(resource.client, id, resource.version)
    grPointerResource.implementation = this.pointer
    this.pointer.resources.push(grPointerResource)
    grPointerResource.onDestroy().then(() => {
      const idx = this.pointer.resources.indexOf(grPointerResource)
      if (idx > -1) {
        this.pointer.resources.splice(idx, 1)
      }
    })
  }

  /**
   *
   *                The ID provided will be initialized to the gr_keyboard interface
   *                for this seat.
   *
   *                This request only takes effect if the seat has the keyboard
   *                capability, or has had the keyboard capability in the past.
   *                It is a protocol violation to issue this request on a seat that has
   *                never had the keyboard capability.
   *
   *
   * @param {GrSeatResource} resource
   * @param {number} id seat keyboard
   *
   * @since 1
   *
   */
  getKeyboard (resource, id) {
    const grKeyboardResource = new GrKeyboardResource(resource.client, id, resource.version)
    grKeyboardResource.implementation = this.keyboard
    this.keyboard.resources.push(grKeyboardResource)
    grKeyboardResource.onDestroy().then(() => {
      const idx = this.keyboard.resources.indexOf(grKeyboardResource)
      if (idx > -1) {
        this.keyboard.resources.splice(idx, 1)
      }
    })

    this.keyboard.emitKeymap(grKeyboardResource)
    this.keyboard.emitKeyRepeatInfo(grKeyboardResource)
    this._keyboardResourceListeners.forEach((listener) => listener(grKeyboardResource))
  }

  /**
   * @param {function(GrKeyboardResource):void}listener
   */
  addKeyboardResourceListener (listener) {
    this._keyboardResourceListeners.push(listener)
  }

  /**
   * @param {function(GrKeyboardResource):void}listener
   */
  removeKeyboardResourceListener (listener) {
    const idx = this._keyboardResourceListeners.indexOf(listener)
    if (idx > -1) {
      this._keyboardResourceListeners.splice(idx, 1)
    }
  }

  /**
   *
   *                The ID provided will be initialized to the gr_touch interface
   *                for this seat.
   *
   *                This request only takes effect if the seat has the touch
   *                capability, or has had the touch capability in the past.
   *                It is a protocol violation to issue this request on a seat that has
   *                never had the touch capability.
   *
   *
   * @param {GrSeatResource} resource
   * @param {number} id seat touch interface
   *
   * @since 1
   *
   */
  getTouch (resource, id) {
    const grTouchResource = new GrTouchResource(resource.client, id, resource.version)
    this.touch.resources.push(grTouchResource)

    if (this.hasTouch) {
      grTouchResource.implementation = this.touch
    }
  }

  /**
   *
   *                Using this request a client can tell the server that it is not going to
   *                use the seat object anymore.
   *
   *
   * @param {GrSeatResource} resource
   *
   * @since 5
   *
   */
  release (resource) {
    resource.destroy()
    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
  }
}

export default Seat
