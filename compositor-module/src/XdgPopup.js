// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import { XdgPopupRequests, XdgPopupResource, XdgPositionerResource, XdgWmBaseResource } from 'westfield-runtime-server'

import Point from './math/Point'

const { none, slideX, slideY, flipX, flipY, resizeX, resizeY } = XdgPositionerResource.ConstraintAdjustment

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
 * @implements {SurfaceRole}
 * @implements {XdgPopupRequests}
 */
export default class XdgPopup extends XdgPopupRequests {
  /**
   * @param {XdgPopupResource}xdgPopupResource
   * @param {XdgSurface}xdgSurface
   * @param {XdgSurfaceResource|null}parent
   * @param {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(XdgSurface): Point), checkScreenConstraints: (function(XdgSurface, View): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}positionerState
   * @param {Seat}seat
   * @return {XdgPopup}
   */
  static create (xdgPopupResource, xdgSurface, parent, positionerState, seat) {
    const xdgPopup = new XdgPopup(xdgPopupResource, xdgSurface, parent, positionerState, seat)
    xdgPopupResource.implementation = xdgPopup
    const surface = /** @type {Surface} */xdgSurface.wlSurfaceResource.implementation
    surface.role = xdgPopup
    xdgPopup.ensureGeometryConstraints(parent, positionerState)
    xdgSurface.emitConfigureDone()
    return xdgPopup
  }

  /**
   * @param {XdgPopupResource}xdgPopupResource
   * @param {XdgSurface}xdgSurface
   * @param {XdgSurfaceResource|null}parent
   * @param {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(XdgSurface): Point), checkScreenConstraints: (function(XdgSurface, View): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}positionerState
   * @param {Seat}seat
   */
  constructor (xdgPopupResource, xdgSurface, parent, positionerState, seat) {
    super()
    /**
     * @type {XdgPopupResource}
     */
    this.resource = xdgPopupResource
    /**
     * @type {XdgSurface}
     */
    this.xdgSurface = xdgSurface
    /**
     * @type {XdgSurfaceResource|null}
     */
    this.parent = parent
    /**
     * @type {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(XdgSurface): Point), checkScreenConstraints: (function(XdgSurface, View): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}
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
     * @type {Seat}
     * @private
     */
    this._seat = seat
  }

  /**
   * @return {{windowGeometry: Rect}}
   * @override
   */
  captureRoleState () {
    return {
      windowGeometry: this.xdgSurface.pendingWindowGeometry
    }
  }

  /**
   * @param {{windowGeometry: Rect}}roleState
   * @override
   */
  setRoleState (roleState) {
    this.xdgSurface.updateWindowGeometry(roleState.windowGeometry)
  }

  /**
   * @param {Surface}surface
   * @param {SurfaceState}newState
   * @override
   */
  onCommit (surface, newState) {
    if (this.dismissed) {
      return
    }

    if (newState.bufferContents) {
      if (!this.mapped) {
        this._map(surface, newState)
      }
    } else if (this.mapped) {
      this._dismiss()
    }

    surface.updateState(newState)
  }

  /**
   * @param {Surface}surface
   * @param {SurfaceState}newState
   * @private
   */
  _map (surface, newState) {
    // TODO check if parent is mapped
    for (const surfaceChild of surface.children) {
      if (surfaceChild !== surface.surfaceChildSelf &&
        surfaceChild.surface.role instanceof XdgPopup) {
        this.resource.postError(XdgWmBaseResource.Error.notTheTopmostPopup, 'Client tried to map a non-topmost popup')
        // window.GREENFIELD_DEBUG && console.log('[client-protocol-error] - Client tried to map a non-topmost popup.')
        return
      }
    }

    this.mapped = true
    const parentXdgSurface = /** @type {XdgSurface} */this.parent.implementation
    const parentSurface = /** @type {Surface} */parentXdgSurface.wlSurfaceResource.implementation

    // set position based on positioner object
    surface.surfaceChildSelf.position = this.positionerState.surfaceSpaceAnchorPoint(parentXdgSurface).minus(newState.roleState.windowGeometry.position)
    parentSurface.addChild(surface.surfaceChildSelf)
  }

  /**
   * @private
   */
  _dismiss () {
    if (!this.dismissed) {
      this.dismissed = true
      if (this._seat.pointer) {
        const popupGrab = this._seat.pointer.findPopupGrab(this.xdgSurface.wlSurfaceResource)
        if (popupGrab) {
          popupGrab.resolve()
        }
      }
      this.resource.popupDone()
      const parentXdgSurface = /** @type {XdgSurface} */this.parent.implementation
      const parentSurface = /** @type {Surface} */parentXdgSurface.wlSurfaceResource.implementation
      const surface = /** @type {Surface} */this.xdgSurface.wlSurfaceResource.implementation
      parentSurface.removeChild(surface.surfaceChildSelf)
      this._seat.keyboard.focusGained(parentSurface)
    }
  }

  /**
   * @private
   */
  _updatePopupKeyboardFocus () {
    this._seat.keyboard.focusGained(/** @type {Surface} */this.xdgSurface.wlSurfaceResource.implementation)
    // if the keyboard or focus changes to a different client, we have to dismiss the popup
    this._seat.keyboard.onKeyboardFocusChanged().then(() => {
      if (!this._seat.keyboard.focus || this._seat.keyboard.focus.resource.client !== this.resource.client) {
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
   * @param {XdgPopupResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    const surface = /** @type {Surface} */this.xdgSurface.wlSurfaceResource.implementation
    for (const surfaceChild of surface.children) {
      if (surfaceChild !== surface.surfaceChildSelf &&
        surfaceChild.surface.role instanceof XdgPopup) {
        resource.postError(XdgWmBaseResource.Error.notTheTopmostPopup, 'Client tried to destroy a non-topmost popup')
        // window.GREENFIELD_DEBUG && console.log('[client-protocol-error] - Client tried to destroy a non-topmost popup.')
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
   * @param {XdgPopupResource} resource
   * @param {WlSeatResource} wlSeatResource the wl_seat of the user event
   * @param {number} serial the serial of the user event
   *
   * @since 1
   * @override
   */
  async grab (resource, wlSeatResource, serial) {
    const seat = /** @type {Seat} */ wlSeatResource.implementation
    const pointer = seat.pointer

    // Gtk3 doesn't give us the latest input serial, but the latest button press. Other compositors seem to ignore the serial.
    // if (!seat.isValidInputSerial(serial)) {
    //   this._dismiss()
    //   // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Popup grab input serial mismatch. Ignoring.')
    //   return
    // }

    if (this.mapped) {
      resource.postError(XdgPopupResource.Error.invalidGrab, 'Client tried to grab popup after it being mapped.')
      // window.GREENFIELD_DEBUG && console.error('[client-protocol-error] Client tried to grab popup after it being mapped.')
      return
    }

    const parentXdgSurface = /** @type {XdgSurface} */this.parent.implementation
    const parentWlSurfaceResource = parentXdgSurface.wlSurfaceResource
    const parentSurface = /** type {Surface} */parentWlSurfaceResource.implementation
    const parentRole = parentSurface.role
    if (parentRole instanceof XdgPopup) {
      if (parentRole.dismissed) {
        this._dismiss()
        return
      } else if (!pointer.findPopupGrab(parentWlSurfaceResource)) {
        resource.postError(XdgWmBaseResource.Error.invalidPopupParent, 'Popup parent is a popup that did not take an explicit grab.')
        // window.GREENFIELD_DEBUG && console.error('[client-protocol-error]  Popup parent is a popup that did not take an explicit grab.')
        return
      }
    }

    this._updatePopupKeyboardFocus()
    pointer.popupGrab(this.xdgSurface.wlSurfaceResource).then(() => this._dismiss())
  }

  /**
   * @param {number}serial
   */
  ackConfigure (serial) {
    // TODO what to do here?
  }

  /**
   * @param {XdgSurfaceResource|null}parent
   * @param {{size: Rect, anchorRect: Rect, anchor: number, gravity: number, constraintAdjustment: number, offset: Point, surfaceSpaceAnchorPoint: (function(XdgSurface): Point), checkScreenConstraints: (function(XdgSurface, View): {topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number})}}positionerState
   */
  ensureGeometryConstraints (parent, positionerState) {
    // TODO we can probably rewrite & make this method better using libpixman(?)
    if (positionerState.constraintAdjustment === none) {
      // we can't even
      return
    }

    const parentXdgSurface = /** @type {XdgSurface} */parent.implementation
    const parentSurface = /** @type {Surface} */parentXdgSurface.wlSurfaceResource.implementation
    const primaryParentView = parentSurface.views.find(parentView => parentView.primary)

    let violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)

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

        violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)
        if (violations.leftViolation || violations.rightViolation) {
          // still violating, revert
          positionerState.anchor = oldAnchor
          positionerState.gravity = oldGravity
        }
      }

      // check for violations in case the flip caused the violations to disappear
      violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)
      if ((violations.leftViolation || violations.rightViolation) && canSlideX) {
        // try sliding
        const newXDeltaOffset = violations.rightViolation ? -violations.rightViolation : violations.leftViolation
        const oldOffset = positionerState.offset
        positionerState.offset = Point.create(oldOffset.x + newXDeltaOffset, oldOffset.y)
        // no need to check if there is still a X violation as we already ensured the width < max width
      }
    }

    // check for violations in case the flip or slide caused the violations to disappear
    violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)
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
    violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)
    if ((violations.topViolation || violations.bottomViolation) &&
      positionerState.size.height < window.document.body.clientHeight) {
      if (canFlipY) {
        const oldAnchor = positionerState.anchor
        const oldGravity = positionerState.gravity

        positionerState.anchor = inverseY[oldAnchor]
        positionerState.gravity = inverseY[oldGravity]

        violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)
        if (violations.topViolation || violations.bottomViolation) {
          // still violating, revert
          positionerState.anchor = oldAnchor
          positionerState.gravity = oldGravity
        }
      }

      // check for violations in case the flip caused the violations to disappear
      violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)
      if ((violations.topViolation || violations.bottomViolation) && canSlideY) {
        // try sliding
        const newYDeltaOffset = violations.bottomViolation ? -violations.bottomViolation : violations.topViolation
        const oldOffset = positionerState.offset
        positionerState.offset = Point.create(oldOffset.x, oldOffset.y + newYDeltaOffset)
        // no need to check if there is still a Y violation as we already ensured the height < max height
      }
    }

    // check for violations in case the flip or slide caused the violations to disappear
    violations = positionerState.checkScreenConstraints(parentXdgSurface, primaryParentView)
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

    const { x0: x, y0: y, width, height } = positionerState.size
    this.resource.configure(x, y, width, height)
  }
}
