'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'

import BrowserPointer from './BrowserPointer'
import BrowserKeyboard from './BrowserKeyboard'
import BrowserTouch from './BrowserTouch'

export default class BrowserSeat extends westfield.Global {
  /**
   * @returns {BrowserSeat}
   */
  static create () {
    const browserPointer = BrowserPointer.create()
    const browserKeyboard = BrowserKeyboard.create()
    const browserTouch = BrowserTouch.create()
    const hasTouch = 'ontouchstart' in document.documentElement

    return new BrowserSeat(browserPointer, browserKeyboard, browserTouch, hasTouch)
  }

  /**
   * @param {BrowserPointer} browserPointer
   * @param {BrowserKeyboard} browserKeyboard
   * @param {BrowserTouch} browserTouch
   * @param {boolean} hasTouch
   */
  constructor (browserPointer, browserKeyboard, browserTouch, hasTouch) {
    super(greenfield.GrSeat.name, 6)
    this.browserPointer = browserPointer
    this.browserKeyboard = browserKeyboard
    this.browserTouch = browserTouch
    this.hasTouch = hasTouch
    this.resources = []
    this._seatName = 'browser-seat0'
  }

  bindClient (client, id, version) {
    const grSeatResource = new greenfield.GrSeat(client, id, version)
    grSeatResource.implementation = this
    this.resources.push(grSeatResource)

    grSeatResource.onDestroy().then((resource) => {
      const index = this.resources.indexOf(resource)
      this.resources.splice(index, 1)
    })

    this._emitCapabilities(grSeatResource)
    this._emitName(grSeatResource)
  }

  _emitCapabilities (grSeatResource) {
    let caps = 0 | greenfield.GrSeat.Capability.pointer | greenfield.GrSeat.Capability.keyboard
    if (this.hasTouch) {
      caps |= greenfield.GrSeat.Capability.touch
    }
    grSeatResource.capabilities(caps)
  }

  _emitName (grSeatResource) {
    if (grSeatResource.version > 1) {
      grSeatResource.name(this._seatName)
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
   * @param {GrSeat} resource
   * @param {*} id seat pointer
   *
   * @since 1
   *
   */
  getPointer (resource, id) {
    const grPointerResource = new greenfield.GrPointer(resource.client, id, resource.version)
    grPointerResource.implementation = this.browserPointer
    this.browserPointer.resources.push(grPointerResource)
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
   * @param {GrSeat} resource
   * @param {*} id seat keyboard
   *
   * @since 1
   *
   */
  getKeyboard (resource, id) {
    const grKeyboardResource = new greenfield.GrKeyboard(resource.client, id, resource.version)
    grKeyboardResource.implementation = this.browserKeyboard
    this.browserKeyboard.resources.push(grKeyboardResource)
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
   * @param {GrSeat} resource
   * @param {*} id seat touch interface
   *
   * @since 1
   *
   */
  getTouch (resource, id) {
    if (this.hasTouch) {
      const grTouchResource = new greenfield.GrTouch(resource.client, id, resource.version)
      grTouchResource.implementation = this.browserTouch
      this.browserTouch.resources.push(grTouchResource)
    } else {
      // TODO raise protocol error
    }
  }

  /**
   *
   *                Using this request a client can tell the server that it is not going to
   *                use the seat object anymore.
   *
   *
   * @param {GrSeat} resource
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
