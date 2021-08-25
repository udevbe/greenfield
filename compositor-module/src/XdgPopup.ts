// Copyright 2020 Erik De Rijcke
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

import {
  WlSeatResource,
  XdgPopupError,
  XdgPopupRequests,
  XdgPopupResource,
  XdgPositionerConstraintAdjustment,
  XdgSurfaceResource,
  XdgWmBaseError,
} from 'westfield-runtime-server'
import { clientHeight, clientWidth } from './browser/attributes'

import { minusPoint, PointRO } from './math/Point'
import { RectRO, withInfo } from './math/Rect'
import Seat from './Seat'
import Surface from './Surface'
import SurfaceRole from './SurfaceRole'
import View from './View'
import { XdgPositionerState } from './XdgPositioner'
import XdgSurface from './XdgSurface'

const { none, slideX, slideY, flipX, flipY, resizeX, resizeY } = XdgPositionerConstraintAdjustment

const inverseY = {
  /**
   * none
   */
  0: 0,
  /**
   * top
   */
  1: 2,
  /**
   * bottom
   */
  2: 1,
  /**
   * left
   */
  3: 3,
  /**
   * right
   */
  4: 4,
  /**
   * topLeft
   */
  5: 6,
  /**
   * bottomLeft
   */
  6: 5,
  /**
   * topRight
   */
  7: 8,
  /**
   * bottomRight
   */
  8: 7,
} as const

const inverseX = {
  /**
   * none
   */
  0: 0,
  /**
   * top
   */
  1: 1,
  /**
   * bottom
   */
  2: 2,
  /**
   * left
   */
  3: 4,
  /**
   * right
   */
  4: 3,
  /**
   * topLeft
   */
  5: 7,
  /**
   * bottomLeft
   */
  6: 8,
  /**
   * topRight
   */
  7: 5,
  /**
   * bottomRight
   */
  8: 6,
} as const

export default class XdgPopup implements XdgPopupRequests, SurfaceRole {
  static create(
    xdgPopupResource: XdgPopupResource,
    xdgSurface: XdgSurface,
    parent: XdgSurfaceResource,
    positionerState: XdgPositionerState,
    seat: Seat,
  ): XdgPopup {
    const surface = xdgSurface.wlSurfaceResource.implementation as Surface
    const view = View.create(surface)
    const xdgPopup = new XdgPopup(xdgPopupResource, xdgSurface, parent, positionerState, seat, view)
    xdgPopupResource.implementation = xdgPopup
    surface.role = xdgPopup
    xdgPopup.ensureGeometryConstraints(parent, positionerState)
    xdgSurface.emitConfigureDone()
    return xdgPopup
  }

  mapped = false
  dismissed = false

  private constructor(
    public readonly resource: XdgPopupResource,
    public readonly xdgSurface: XdgSurface,
    public readonly parent: XdgSurfaceResource,
    public readonly positionerState: XdgPositionerState,
    private readonly seat: Seat,
    public readonly view: View,
  ) {}

  onCommit(surface: Surface): void {
    if (this.dismissed) {
      return
    }
    surface.commitPending()
    this.xdgSurface.commitWindowGeometry()

    if (surface.state.bufferContents) {
      if (!this.mapped) {
        this.map(surface)
      }
    } else if (this.mapped) {
      this.dismiss()
    }

    surface.session.renderer.render()
  }

  private map(surface: Surface) {
    // TODO check if parent is mapped
    for (const surfaceChild of surface.children) {
      if (surfaceChild !== surface.surfaceChildSelf && surfaceChild.surface.role instanceof XdgPopup) {
        this.resource.postError(XdgWmBaseError.notTheTopmostPopup, 'Client tried to map a non-topmost popup')
        console.log('[client-protocol-error] - Client tried to map a non-topmost popup.')
        return
      }
    }

    this.mapped = true
    const parentXdgSurface = this.parent.implementation as XdgSurface

    // set position based on positioner object
    const surfaceSpaceAnchorPoint = this.positionerState.surfaceSpaceAnchorPoint(parentXdgSurface)
    if (surfaceSpaceAnchorPoint) {
      surface.surfaceChildSelf.position = minusPoint(surfaceSpaceAnchorPoint, this.xdgSurface.windowGeometry.position)
    }
  }

  private dismiss() {
    if (!this.dismissed) {
      this.dismissed = true
      if (this.seat.pointer) {
        const popupGrab = this.seat.pointer.findPopupGrab(this.xdgSurface.wlSurfaceResource)
        if (popupGrab) {
          popupGrab.resolve()
        }
      }
      this.resource.popupDone()
      const parentXdgSurface = this.parent.implementation as XdgSurface
      const parentSurface = parentXdgSurface.wlSurfaceResource.implementation as Surface
      const surface = this.xdgSurface.wlSurfaceResource.implementation as Surface
      parentSurface.removeChild(surface.surfaceChildSelf)
      this.seat.keyboard.focusGained(parentSurface)
    }
  }

  private _updatePopupKeyboardFocus() {
    this.seat.keyboard.focusGained(this.xdgSurface.wlSurfaceResource.implementation as Surface)
    // if the keyboard or focus changes to a different client, we have to dismiss the popup
    this.seat.keyboard.onKeyboardFocusChanged().then(() => {
      if (!this.seat.keyboard.focus || this.seat.keyboard.focus.resource.client !== this.resource.client) {
        this.dismiss()
      }
    })
  }

  destroy(resource: XdgPopupResource): void {
    const surface = this.xdgSurface.wlSurfaceResource.implementation as Surface
    for (const surfaceChild of surface.children) {
      if (surfaceChild !== surface.surfaceChildSelf && surfaceChild.surface.role instanceof XdgPopup) {
        resource.postError(XdgWmBaseError.notTheTopmostPopup, 'Client tried to destroy a non-topmost popup')
        console.log('[client-protocol-error] - Client tried to destroy a non-topmost popup.')
        return
      }
    }

    this.dismiss()
    resource.destroy()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  grab(resource: XdgPopupResource, wlSeatResource: WlSeatResource, serial: number): void {
    const seat = wlSeatResource.implementation as Seat
    const pointer = seat.pointer

    // Gtk3 doesn't give us the latest input serial, but the latest button press. Other compositors seem to ignore the serial.
    // if (!seat.isValidInputSerial(serial)) {
    //   this._dismiss()
    //   // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Popup grab input serial mismatch. Ignoring.')
    //   return
    // }

    if (this.mapped) {
      resource.postError(XdgPopupError.invalidGrab, 'Client tried to grab popup after it being mapped.')
      console.error('[client-protocol-error] Client tried to grab popup after it being mapped.')
      return
    }

    const parentXdgSurface = this.parent.implementation as XdgSurface
    const parentWlSurfaceResource = parentXdgSurface.wlSurfaceResource
    const parentSurface = parentWlSurfaceResource.implementation as Surface
    const parentRole = parentSurface.role as SurfaceRole
    if (parentRole instanceof XdgPopup) {
      if (parentRole.dismissed) {
        this.dismiss()
        return
      } else if (!pointer.findPopupGrab(parentWlSurfaceResource)) {
        resource.postError(
          XdgWmBaseError.invalidPopupParent,
          'Popup parent is a popup that did not take an explicit grab.',
        )
        console.error('[client-protocol-error]  Popup parent is a popup that did not take an explicit grab.')
        return
      }
    }

    this._updatePopupKeyboardFocus()
    pointer.popupGrab(this.xdgSurface.wlSurfaceResource).then(() => this.dismiss())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ackConfigure(serial: number): void {
    // TODO what to do here?
  }

  ensureGeometryConstraints(parent: XdgSurfaceResource, positionerState: XdgPositionerState): void {
    // TODO we can probably rewrite & make this method better using libpixman(?)
    if (positionerState.constraintAdjustment === none) {
      // we can't even
      return
    }

    const parentXdgSurface = parent.implementation as XdgSurface
    const parentSurface = parentXdgSurface.wlSurfaceResource.implementation as Surface
    const parentView = parentSurface.role?.view
    if (parentView) {
      let violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
      if (violations && positionerState.sizeRect) {
        if (
          !(
            violations.topViolation ||
            violations.rightViolation ||
            violations.bottomViolation ||
            violations.leftViolation
          )
        ) {
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
        if (
          (violations.leftViolation || violations.rightViolation) &&
          positionerState.sizeRect.size.width < clientWidth()
        ) {
          if (canFlipX) {
            // TODO try flipping
            const oldAnchor = positionerState.anchor
            const oldGravity = positionerState.gravity

            positionerState.anchor = inverseX[oldAnchor]
            positionerState.gravity = inverseX[oldGravity]

            violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
            if (violations && (violations.leftViolation || violations.rightViolation)) {
              // still violating, revert
              positionerState.anchor = oldAnchor
              positionerState.gravity = oldGravity
            }
          }

          // check for violations in case the flip caused the violations to disappear
          violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
          if (violations && (violations.leftViolation || violations.rightViolation) && canSlideX) {
            // try sliding
            const newXDeltaOffset = violations.rightViolation ? -violations.rightViolation : violations.leftViolation
            const oldOffset = positionerState.offset
            positionerState.offset = { x: oldOffset.x + newXDeltaOffset, y: oldOffset.y }
            // no need to check if there is still a X violation as we already ensured the width < max width
          }
        }

        // check for violations in case the flip or slide caused the violations to disappear
        violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
        if (violations && (violations.leftViolation || violations.rightViolation) && canResizeX) {
          if (violations.leftViolation) {
            const oldOffset = positionerState.offset
            positionerState.offset = { x: oldOffset.x + violations.leftViolation, y: oldOffset.y }
            const x1 = positionerState.sizeRect.x1 - violations.leftViolation
            const { x0, y0, y1 } = positionerState.sizeRect
            positionerState.sizeRect = withInfo({ x0, y0, x1, y1 })
          }

          if (violations.rightViolation) {
            const x1 = positionerState.sizeRect.x1 - violations.rightViolation
            const { x0, y0, y1 } = positionerState.sizeRect
            positionerState.sizeRect = withInfo({ x0, y0, x1, y1 })
          }
        }

        // Y-Axis:
        // we can't use slide or flip if if the height is greater than the screen height
        violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
        if (
          violations &&
          (violations.topViolation || violations.bottomViolation) &&
          positionerState.sizeRect.size.height < clientHeight()
        ) {
          if (canFlipY) {
            const oldAnchor = positionerState.anchor
            const oldGravity = positionerState.gravity

            positionerState.anchor = inverseY[oldAnchor]
            positionerState.gravity = inverseY[oldGravity]

            violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
            if (violations && (violations.topViolation || violations.bottomViolation)) {
              // still violating, revert
              positionerState.anchor = oldAnchor
              positionerState.gravity = oldGravity
            }
          }

          // check for violations in case the flip caused the violations to disappear
          violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
          if (violations && (violations.topViolation || violations.bottomViolation) && canSlideY) {
            // try sliding
            const newYDeltaOffset = violations.bottomViolation ? -violations.bottomViolation : violations.topViolation
            const oldOffset = positionerState.offset
            positionerState.offset = { x: oldOffset.x, y: oldOffset.y + newYDeltaOffset }
            // no need to check if there is still a Y violation as we already ensured the height < max height
          }
        }

        // check for violations in case the flip or slide caused the violations to disappear
        violations = positionerState.checkScreenConstraints(parentXdgSurface, parentView)
        if (violations && (violations.topViolation || violations.bottomViolation) && canResizeY) {
          if (violations.topViolation) {
            const oldOffset = positionerState.offset
            positionerState.offset = { x: oldOffset.x, y: oldOffset.y + violations.topViolation }
            const y1 = positionerState.sizeRect.y1 - violations.topViolation
            const { x0, y0, x1 } = positionerState.sizeRect
            positionerState.sizeRect = withInfo({ x0, y0, x1, y1 })
          }

          if (violations.bottomViolation) {
            const y1 = positionerState.sizeRect.y1 - violations.bottomViolation
            const { x0, y0, x1 } = positionerState.sizeRect
            positionerState.sizeRect = withInfo({ x0, y0, x1, y1 })
          }
        }

        const {
          position: { x, y },
          size: { width, height },
        } = positionerState.sizeRect
        this.resource.configure(x, y, width, height)
      }
    }
  }
}
