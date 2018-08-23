'use strict'

import { XdgPositioner } from './protocol/xdg-shell-browser-protocol'
import Point from './math/Point'
import BrowserSurfaceRole from './BrowserSurfaceRole'

const {none, slideX, slideY, flipX, flipY, resizeX, resizeY} = XdgPositioner.ConstraintAdjustment

const inverseY = {
  /**
   * none
   * @return {number}
   */
  0: 0,
  /**
   * top
   * @return {number}
   */
  1: 2,
  /**
   * bottom
   * @return {number}
   */
  2: 1,
  /**
   * left
   * @return {number}
   */
  3: 3,
  /**
   * right
   * @return {number}
   */
  4: 4,
  /**
   * topLeft
   * @return {number}
   */
  5: 6,
  /**
   * bottomLeft
   * @return {number}
   */
  6: 5,
  /**
   * topRight
   * @return {number}
   */
  7: 8,
  /**
   * bottomRight
   * @return {number}
   */
  8: 7
}

const inverseX = {
  /**
   * none
   * @return {number}
   */
  0: 0,
  /**
   * top
   * @return {number}
   */
  1: 1,
  /**
   * bottom
   * @return {number}
   */
  2: 2,
  /**
   * left
   * @return {number}
   */
  3: 4,
  /**
   * right
   * @return {number}
   */
  4: 3,
  /**
   * topLeft
   * @return {number}
   */
  5: 7,
  /**
   * bottomLeft
   * @return {number}
   */
  6: 8,
  /**
   * topRight
   * @return {number}
   */
  7: 5,
  /**
   * bottomRight
   * @return {number}
   */
  8: 6
}

/**
 *
 *      A popup surface is a short-lived, temporary surface. It can be used to
 *      implement for example menus, popovers, tooltips and other similar user
 *      interface concepts.
 *
 *      A popup can be made to take an explicit grab. See xdg_popup.grab for
 *      details.
 *
 *      When the popup is dismissed, a popup_done event will be sent out, and at
 *      the same time the surface will be unmapped. See the xdg_popup.popup_done
 *      event for details.
 *
 *      Explicitly destroying the xdg_popup object will also dismiss the popup and
 *      unmap the surface. Clients that want to dismiss the popup when another
 *      surface of their own is clicked should dismiss the popup using the destroy
 *      request.
 *
 *      The parent surface must have either the xdg_toplevel or xdg_popup surface
 *      role.
 *
 *      A newly created xdg_popup will be stacked on top of all previously created
 *      xdg_popup surfaces associated with the same xdg_toplevel.
 *
 *      The parent of an xdg_popup must be mapped (see the xdg_surface
 *      description) before the xdg_popup itself.
 *
 *      The x and y arguments passed when creating the popup object specify
 *      where the top left of the popup should be placed, relative to the
 *      local surface coordinates of the parent surface. See
 *      xdg_surface.get_popup. An xdg_popup must intersect with or be at least
 *      partially adjacent to its parent surface.
 *
 *      The client must call wl_surface.commit on the corresponding wl_surface
 *      for the xdg_popup state to take effect.
 *
 * @implements BrowserSurfaceRole
 */
export default class BrowserXdgPopup extends BrowserSurfaceRole {
  /**
   * @param {XdgPopup}xdgPopupResource
   * @param {BrowserXdgSurface}browserXdgSurface
   * @param {XdgSurface|null}parent
   * @param {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(BrowserXdgSurface): Point), checkScreenConstraints: (function(BrowserXdgSurface, BrowserSurfaceView): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}positionerState
   * @param {BrowserSession}browserSession
   * @param {BrowserSeat}browserSeat
   * @return {BrowserXdgPopup}
   */
  static create (xdgPopupResource, browserXdgSurface, parent, positionerState, browserSession, browserSeat) {
    const browserXdgPopup = new BrowserXdgPopup(xdgPopupResource, browserXdgSurface, parent, positionerState, browserSession, browserSeat)
    xdgPopupResource.implementation = browserXdgPopup
    browserXdgSurface.grSurfaceResource.implementation.role = browserXdgPopup
    browserXdgPopup.ensureGeometryConstraints(parent, positionerState)
    browserXdgSurface.emitConfigureDone()
    return browserXdgPopup
  }

  /**
   * @param {XdgPopup}xdgPopupResource
   * @param {BrowserXdgSurface}browserXdgSurface
   * @param {XdgSurface|null}parent
   * @param {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(BrowserXdgSurface): Point), checkScreenConstraints: (function(BrowserXdgSurface, BrowserSurfaceView): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}positionerState
   * @param {BrowserSession}browserSession
   * @param {BrowserSeat}browserSeat
   */
  constructor (xdgPopupResource, browserXdgSurface, parent, positionerState, browserSession, browserSeat) {
    super()
    /**
     * @type {XdgPopup}
     */
    this.resource = xdgPopupResource
    /**
     * @type {BrowserXdgSurface}
     */
    this.browserXdgSurface = browserXdgSurface
    /**
     * @type {XdgSurface|null}
     */
    this.parent = parent
    /**
     * @type {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(BrowserXdgSurface): Point), checkScreenConstraints: (function(BrowserXdgSurface, BrowserSurfaceView): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}
     */
    this.positionerState = positionerState
    /**
     * @type {boolean}
     */
    this.mapped = false
    /**
     * @type {boolean}
     */
    this.dismissed = false
    /**
     * @type {BrowserSession}
     * @private
     */
    this._browserSession = browserSession
    /**
     * @type {BrowserSeat}
     * @private
     */
    this._browserSeat = browserSeat
  }

  /**
   * @return {{windowGeometry: Rect}}
   * @override
   */
  captureRoleState () {
    return {
      windowGeometry: this.browserXdgSurface.pendingWindowGeometry
    }
  }

  /**
   * @param {{windowGeometry: Rect}}roleState
   * @override
   */
  setRoleState (roleState) {
    this.browserXdgSurface.updateWindowGeometry(roleState.windowGeometry)
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
   * @return {Promise<void>}
   * @override
   */
  async onCommit (browserSurface, renderFrame, newState) {
    if (this.dismissed) {
      return
    }

    if (newState.bufferContents) {
      if (!this.mapped) {
        this._map(browserSurface, newState)
      }
    } else if (this.mapped) {
      this._dismiss()
    }

    await browserSurface.render(renderFrame, newState)
    renderFrame.fire()
    await renderFrame
    this._browserSession.flush()
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
   * @private
   */
  _map (browserSurface, newState) {
    // TODO check if parent is mapped

    this.mapped = true
    const parentBrowserSurface = this.parent.implementation.grSurfaceResource.implementation

    // set position based on positioner object
    browserSurface.browserSurfaceChildSelf.position = this.positionerState.surfaceSpaceAnchorPoint(this.parent.implementation).minus(newState.roleState.windowGeometry.position)
    parentBrowserSurface.addChild(browserSurface.browserSurfaceChildSelf)
  }

  _dismiss () {
    if (!this.dismissed) {
      this.dismissed = true
      if (this._browserSeat.browserPointer) {
        const popupGrab = this._browserSeat.browserPointer.findPopupGrab(this.browserXdgSurface.grSurfaceResource)
        if (popupGrab) {
          popupGrab.resolve()
        }
      }
      this.resource.popupDone()
      const parentBrowserSurface = this.parent.implementation.grSurfaceResource.implementation
      parentBrowserSurface.removeChild(this.browserXdgSurface.grSurfaceResource.implementation.browserSurfaceChildSelf)
      this._browserSeat.browserKeyboard.focusGained(parentBrowserSurface)
    }
  }

  /**
   * @private
   */
  _updatePopupKeyboardFocus () {
    this._browserSeat.browserKeyboard.focusGained(this.browserXdgSurface.grSurfaceResource.implementation)
    // if the keyboard or focus changes to a different client, we have to dismiss the popup
    this._browserSeat.browserKeyboard.onKeyboardFocusChanged().then(() => {
      if (!this._browserSeat.browserKeyboard.focus || this._browserSeat.browserKeyboard.focus.resource.client !== this.resource.client) {
        this._dismiss()
      }
    })
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
    const browserSurface = this.browserXdgSurface.grSurfaceResource.implementation
    for (const browserSurfaceChild of browserSurface.browserSurfaceChildren) {
      if (browserSurfaceChild !== browserSurface.browserSurfaceChildSelf &&
        browserSurfaceChild.browserSurface.role instanceof BrowserXdgPopup) {
        // TODO raise protocol error
        return
      }
    }

    this._dismiss()
    resource.destroy()
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
   * @param {GrSeat} seat the wl_seat of the user event
   * @param {Number} serial the serial of the user event
   *
   * @since 1
   *
   */
  async grab (resource, seat, serial) {
    const browserSeat = seat.implementation
    const browserPointer = browserSeat.browserPointer

    // FIXME keep track of pointer button serial, keyboard key serials & touch serials separately and adjust all code accordingly.
    // if (serial !== browserSeat.serial) {
    //  this._dismiss()
    //  return
    // }

    const parentGrSurface = this.parent.implementation.grSurfaceResource
    if (parentGrSurface.implementation.role instanceof BrowserXdgPopup) {
      if (!browserPointer.findPopupGrab(parentGrSurface)) {
        // TODO throw protocol error
        return
      }
    }

    this._updatePopupKeyboardFocus()
    await browserPointer.popupGrab(this.browserXdgSurface.grSurfaceResource)
    this._dismiss()
  }

  /**
   * @param {number}serial
   */
  ackConfigure (serial) {
    // TODO what to do here?
  }

  /**
   * @param {XdgSurface|null}parent
   * @param {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(BrowserXdgSurface): Point), checkScreenConstraints: (function(BrowserXdgSurface, BrowserSurfaceView): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}positionerState
   */
  ensureGeometryConstraints (parent, positionerState) {
    // TODO we can probably rewrite & make this method better using libpixman
    if (positionerState.constraintAdjustment === none) {
      // we can't even
      return
    }

    const parentBrowserXdgSurface = parent.implementation
    const parentBrowserSurface = parentBrowserXdgSurface.grSurfaceResource.implementation
    const parentBrowserSurfaceView = parentBrowserSurface.browserSurfaceViews.find(parentBrowserSurfaceView => parentBrowserSurfaceView.primary)

    let violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)

    if (!(violations.topViolation || violations.rightViolation || violations.bottomViolation || violations.leftViolation)) {
      // all fine, no need to reconfigure
      return
    }

    const canFlipX = (positionerState.constraintAdjustment | flipX) !== 0
    const canFlipY = (positionerState.constraintAdjustment | flipY) !== 0
    const canSlideX = (positionerState.constraintAdjustment | slideX) !== 0
    const canSlideY = (positionerState.constraintAdjustment | slideY) !== 0
    const canResizeX = (positionerState.constraintAdjustment | resizeX) !== 0
    const canResizeY = (positionerState.constraintAdjustment | resizeY) !== 0

    // X-Axis:
    // we can't use slide or flip if if the height is greater than the screen height
    if ((violations.leftViolation || violations.rightViolation) &&
      positionerState.size.width < window.document.body.clientWidth) {
      if (canFlipX) {
        // TODO try flipping
        const oldAnchor = positionerState.anchor
        const oldGravity = positionerState.gravity

        positionerState.anchor = inverseX[oldAnchor]
        positionerState.gravity = inverseX[oldGravity]

        violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)
        if (violations.leftViolation || violations.rightViolation) {
          // still violating, revert
          positionerState.anchor = oldAnchor
          positionerState.gravity = oldGravity
        }
      }

      // check for violations in case the flip caused the violations to disappear
      violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)
      if ((violations.leftViolation || violations.rightViolation) && canSlideX) {
        // try sliding
        const newXDeltaOffset = violations.rightViolation ? -violations.rightViolation : violations.leftViolation
        const oldOffset = positionerState.offset
        positionerState.offset = Point.create(oldOffset.x + newXDeltaOffset, oldOffset.y)
        // no need to check if there is still a X violation as we already ensured the width < max width
      }
    }

    // check for violations in case the flip or slide caused the violations to disappear
    violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)
    if ((violations.leftViolation || violations.rightViolation) && canResizeX) {
      if (violations.leftViolation) {
        const oldOffset = positionerState.offset
        positionerState.offset = Point.create(oldOffset.x + violations.leftViolation, oldOffset.y)
        positionerState.size.x1 = positionerState.size.x1 - violations.leftViolation
      }

      if (violations.rightViolation) {
        positionerState.size.x1 = positionerState.size.x1 - violations.rightViolation
      }
    }

    // Y-Axis:
    // we can't use slide or flip if if the height is greater than the screen height
    violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)
    if ((violations.topViolation || violations.bottomViolation) &&
      positionerState.size.height < window.document.body.clientHeight) {
      if (canFlipY) {
        const oldAnchor = positionerState.anchor
        const oldGravity = positionerState.gravity

        positionerState.anchor = inverseY[oldAnchor]
        positionerState.gravity = inverseY[oldGravity]

        violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)
        if (violations.topViolation || violations.bottomViolation) {
          // still violating, revert
          positionerState.anchor = oldAnchor
          positionerState.gravity = oldGravity
        }
      }

      // check for violations in case the flip caused the violations to disappear
      violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)
      if ((violations.topViolation || violations.bottomViolation) && canSlideY) {
        // try sliding
        const newYDeltaOffset = violations.bottomViolation ? -violations.bottomViolation : violations.topViolation
        const oldOffset = positionerState.offset
        positionerState.offset = Point.create(oldOffset.x, oldOffset.y + newYDeltaOffset)
        // no need to check if there is still a Y violation as we already ensured the height < max height
      }
    }

    // check for violations in case the flip or slide caused the violations to disappear
    violations = positionerState.checkScreenConstraints(parentBrowserXdgSurface, parentBrowserSurfaceView)
    if ((violations.topViolation || violations.bottomViolation) && canResizeY) {
      if (violations.topViolation) {
        const oldOffset = positionerState.offset
        positionerState.offset = Point.create(oldOffset.x, oldOffset.y + violations.topViolation)
        positionerState.size.y1 = positionerState.size.y1 - violations.topViolation
      }

      if (violations.bottomViolation) {
        positionerState.size.y1 = positionerState.size.y1 - violations.bottomViolation
      }
    }

    const {x0: x, y0: y, width, height} = positionerState.size
    this.resource.configure(x, y, width, height)
  }
}
