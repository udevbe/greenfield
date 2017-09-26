'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'

export default class BrowserSeat extends westfield.Global {
  static create (server) {
    const browserSeat = new BrowserSeat()
    server.registry.register(browserSeat)
    return browserSeat
  }

  constructor () {
    super(greenfield.GrSeat.name, 6)
  }

  bindClient (client, id, version) {
    const grSeatResource = new greenfield.GrSeat(client, id, version)
    grSeatResource.implementation = this
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
  getPointer (resource, id) {}

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
  getKeyboard (resource, id) {}

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
  getTouch (resource, id) {}

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
  release (resource) {}
}
