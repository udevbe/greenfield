'use strict'

module.exports = class LocalXdgToplevel {
  /**
   * @return {LocalXdgToplevel}
   */
  static create () {
    return new LocalXdgToplevel()
  }

  /**
   * @private
   */
  constructor () {
    /**
     * @type {XdgToplevel}
     */
    this.resource = null
  }

  /**
   *
   *  This configure event asks the client to resize its toplevel surface or
   *  to change its state. The configured state should not be applied
   *  immediately. See xdg_surface.configure for details.
   *
   *  The width and height arguments specify a hint to the window
   *  about how its surface should be resized in window geometry
   *  coordinates. See set_window_geometry.
   *
   *  If the width or height arguments are zero, it means the client
   *  should decide its own window dimension. This may happen when the
   *  compositor needs to configure the state of the surface but doesn't
   *  have any information about any previous or expected dimension.
   *
   *  The states listed in the event specify how the width/height
   *  arguments should be interpreted, and possibly how it should be
   *  drawn.
   *
   *  Clients must send an ack_configure in response to this event. See
   *  xdg_surface.configure and xdg_surface.ack_configure for details.
   *
   *
   * @param {Number} width undefined
   * @param {Number} height undefined
   * @param {ArrayBuffer} states undefined
   *
   * @since 1
   *
   */
  configure (width, height, states) {
    this.resource.configure(width, height, states)
  }

  /**
   *
   *  The close event is sent by the compositor when the user
   *  wants the surface to be closed. This should be equivalent to
   *  the user clicking the close button in client-side decorations,
   *  if your application has any.
   *
   *  This is only a request that the user intends to close the
   *  window. The client may choose to ignore this request, or show
   *  a dialog to ask the user to save their data, etc.
   *
   * @since 1
   *
   */
  close () {
    this.resource.close()
  }
}
