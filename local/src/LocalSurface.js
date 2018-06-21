'use strict'

module.exports = class LocalSurface {
  static create () {
    return new LocalSurface()
  }

  constructor () {
    this.resource = null
  }

  enter (output) {
    const outputResource = output.listener.resource
    this.resource.enter(outputResource)
  }

  /**
   *
   *                This is emitted whenever a surface's creation, movement, or resizing
   *                results in it no longer having any part of it within the scanout region
   *                of an output.
   *
   *
   * @param {*} output undefined
   *
   * @since 1
   *
   */
  leave (output) {
    if (output == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
    const outputResource = output.listener.resource
    this.resource.leave(outputResource)
  }
}
