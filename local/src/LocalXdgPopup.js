'use strict'

module.exports = class LocalXdgPopup {
  /**
   * @return {LocalXdgPopup}
   */
  static create () {
    return new LocalXdgPopup()
  }

  /**
   * @private
   */
  constructor () {
    /**
     * @type {LocalXdgPopup}
     */
    this.resource = null
  }

  /**
   *
   *  This event asks the popup surface to configure itself given the
   *  configuration. The configured state should not be applied immediately.
   *  See xdg_surface.configure for details.
   *
   *  The x and y arguments represent the position the popup was placed at
   *  given the xdg_positioner rule, relative to the upper left corner of the
   *  window geometry of the parent surface.
   *
   *
   * @param {Number} x x position relative to parent surface window geometry
   * @param {Number} y y position relative to parent surface window geometry
   * @param {Number} width window geometry width
   * @param {Number} height window geometry height
   *
   * @since 1
   *
   */
  configure (x, y, width, height) {
    this.resource.configure(x, y, width, height)
  }

  /**
   *
   *  The popup_done event is sent out when a popup is dismissed by the
   *  compositor. The client should destroy the xdg_popup object at this
   *  point.
   *
   * @since 1
   *
   */
  popupDone () {
    this.resource.popupDone()
  }
}
