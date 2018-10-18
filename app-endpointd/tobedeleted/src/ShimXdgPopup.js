'use strict'

const XdgPopupRequests = require('./protocol/wayland/XdgPopupRequests')

module.exports = class ShimXdgPopup extends XdgPopupRequests {
  /**
   * @param {XdgPopup}xdgPopupProxy
   * @return {ShimXdgPopup}
   */
  static create (xdgPopupProxy) {
    return new ShimXdgPopup(xdgPopupProxy)
  }

  /**
   * @param {XdgPopup}xdgPopupProxy
   * @private
   */
  constructor (xdgPopupProxy) {
    super()
    /**
     * @type {XdgPopup}
     */
    this.proxy = xdgPopupProxy
  }

  /**
   *
   *  This destroys the popup. Explicitly destroying the xdg_popup
   *  object will also dismiss the popup, and unmap the surface.
   *
   *  If this xdg_popup is not the "topmost" popup, a protocol error
   *  will be sent.
   *
   *
   * @param {XdgPopup} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    resource.destroy()
    this.proxy.destroy()
  }

  /**
   *
   *  This request makes the created popup take an explicit grab. An explicit
   *  grab will be dismissed when the user dismisses the popup, or when the
   *  client destroys the xdg_popup. This can be done by the user clicking
   *  outside the surface, using the keyboard, or even locking the screen
   *  through closing the lid or a timeout.
   *
   *  If the compositor denies the grab, the popup will be immediately
   *  dismissed.
   *
   *  This request must be used in response to some sort of user action like a
   *  button press, key press, or touch down event. The serial number of the
   *  event should be passed as 'serial'.
   *
   *  The parent of a grabbing popup must either be an xdg_toplevel surface or
   *  another xdg_popup with an explicit grab. If the parent is another
   *  xdg_popup it means that the popups are nested, with this popup now being
   *  the topmost popup.
   *
   *  Nested popups must be destroyed in the reverse order they were created
   *  in, e.g. the only popup you are allowed to destroy at all times is the
   *  topmost one.
   *
   *  When compositors choose to dismiss a popup, they may dismiss every
   *  nested grabbing popup as well. When a compositor dismisses popups, it
   *  will follow the same dismissing order as required from the client.
   *
   *  The parent of a grabbing popup must either be another xdg_popup with an
   *  active explicit grab, or an xdg_popup or xdg_toplevel, if there are no
   *  explicit grabs already taken.
   *
   *  If the topmost grabbing popup is destroyed, the grab will be returned to
   *  the parent of the popup, if that parent previously had an explicit grab.
   *
   *  If the parent is a grabbing popup which has already been dismissed, this
   *  popup will be immediately dismissed. If the parent is a popup that did
   *  not take an explicit grab, an error will be raised.
   *
   *  During a popup grab, the client owning the grab will receive pointer
   *  and touch events for all their surfaces as normal (similar to an
   *  "owner-events" grab in X11 parlance), while the top most grabbing popup
   *  will always have keyboard focus.
   *
   *
   * @param {XdgPopup} resource
   * @param {WlSeat} seat the wl_seat of the user event
   * @param {Number} serial the serial of the user event
   *
   * @since 1
   *
   */
  grab (resource, seat, serial) {
    this.proxy.grab(seat.implementation.proxy, serial)
  }
}
