'use strict'

class LocalXdgSurface {
  /**
   * @return {LocalXdgSurface}
   */
  static create () {
    return new LocalXdgSurface()
  }

  /**
   * @private
   */
  constructor () {
    /**
     * @type {XdgSurface}
     */
    this.resource = null
  }

  /**
   *
   *  The configure event marks the end of a configure sequence. A configure
   *  sequence is a set of one or more events configuring the state of the
   *  xdg_surface, including the final xdg_surface.configure event.
   *
   *  Where applicable, xdg_surface surface roles will during a configure
   *  sequence extend this event as a latched state sent as events before the
   *  xdg_surface.configure event. Such events should be considered to make up
   *  a set of atomically applied configuration states, where the
   *  xdg_surface.configure commits the accumulated state.
   *
   *  Clients should arrange their surface for the new states, and then send
   *  an ack_configure request with the serial sent in this configure event at
   *  some point before committing the new surface.
   *
   *  If the client receives multiple configure events before it can respond
   *  to one, it is free to discard all but the last event it received.
   *
   *
   * @param {Number} serial serial of the configure event
   *
   * @since 1
   *
   */
  configure (serial) {
    this.resource.configure(serial)
  }
}

module.exports = LocalXdgSurface
