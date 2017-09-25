'use strict'

module.exports = class LocalShellSurface {
  static create () {
    return new LocalShellSurface()
  }

  constructor () {
    this.resource = null
  }

  /**
   *
   *                Ping a client to check if it is receiving events and sending
   *                requests. A client is expected to reply with a pong request.
   *
   *
   * @param {Number} serial serial number of the ping
   *
   * @since 1
   *
   */
  ping (serial) {
    this.resource.ping(serial)
  }

  /**
   *
   *                The configure event asks the client to resize its surface.
   *
   *                The size is a hint, in the sense that the client is free to
   *                ignore it if it doesn't resize, pick a smaller size (to
   *                satisfy aspect ratio or resize in steps of NxM pixels).
   *
   *                The edges parameter provides a hint about how the surface
   *                was resized. The client may use this information to decide
   *                how to adjust its content to the new size (e.g. a scrolling
   *                area might adjust its content position to leave the viewable
   *                content unmoved).
   *
   *                The client is free to dismiss all but the last configure
   *                event it received.
   *
   *                The width and height arguments specify the size of the window
   *                in surface-local coordinates.
   *
   *
   * @param {Number} edges how the surface was resized
   * @param {Number} width new width of the surface
   * @param {Number} height new height of the surface
   *
   * @since 1
   *
   */
  configure (edges, width, height) {
    this.resource.configure(edges, width, height)
  }

  /**
   *
   *                The popup_done event is sent out when a popup grab is broken,
   *                that is, when the user clicks a surface that doesn't belong
   *                to the client owning the popup surface.
   *
   * @since 1
   *
   */
  popupDone () {
    this.resource.popupDone()
  }
}
