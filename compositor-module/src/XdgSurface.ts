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
  XdgPopupResource,
  XdgPositionerConstraintAdjustment,
  XdgPositionerResource,
  XdgSurfaceError,
  XdgSurfaceRequests,
  XdgSurfaceResource,
  XdgToplevelResource,
  XdgWmBaseError,
} from 'westfield-runtime-server'
import { clientHeight, clientWidth } from './browser/attributes'
import { queueCancellableMicrotask } from './Loop'
import { minusPoint } from './math/Point'
import { createRect, RectWithInfo, withSizeAndPosition } from './math/Rect'
import { Seat } from './Seat'
import Session from './Session'
import Surface from './Surface'
import XdgPopup from './XdgPopup'
import XdgPositioner, { XdgPositionerState } from './XdgPositioner'

import XdgToplevel, { ToplevelXdgConfigure } from './XdgToplevel'

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

export type XdgConfigure = {
  readonly serial: number
}

export default class XdgSurface implements XdgSurfaceRequests {
  configureList: XdgConfigure[] = []
  nextGeometry?: RectWithInfo
  hasNextGeometry = false
  configured = false
  configureIdle?: () => void
  configureSerial = 0

  constructor(
    public readonly resource: XdgSurfaceResource,
    public readonly surface: Surface,
    private readonly session: Session,
    private readonly seat: Seat,
  ) {}

  static create(resource: XdgSurfaceResource, surface: Surface, session: Session, seat: Seat): XdgSurface {
    const xdgSurface = new XdgSurface(resource, surface, session, seat)
    resource.implementation = xdgSurface
    surface.hasKeyboardInput = true
    surface.hasPointerInput = true
    surface.hasTouchInput = true
    return xdgSurface
  }

  destroy(resource: XdgSurfaceResource): void {
    this.configureIdle?.()
    this.configureList = []
    resource.destroy()
  }

  getToplevel(resource: XdgSurfaceResource, id: number): void {
    if (this.surface.role) {
      resource.postError(XdgWmBaseError.role, 'Given surface has another role.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }
    const xdgToplevelResource = new XdgToplevelResource(resource.client, id, resource.version)
    const xdgToplevel = XdgToplevel.create(xdgToplevelResource, this, this.session)
    xdgToplevelResource.implementation = xdgToplevel
    this.ackConfigure = (resource, serial) => {
      const configure = this.handleAckConfigure(resource, serial)
      if (configure) {
        xdgToplevel.ackConfigure(serial, configure as ToplevelXdgConfigure)
      }
    }
  }

  getPopup(
    resource: XdgSurfaceResource,
    id: number,
    parent: XdgSurfaceResource,
    positioner: XdgPositionerResource,
  ): void {
    if (this.surface.role) {
      resource.postError(XdgWmBaseError.role, 'Given surface has another role.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }
    if (parent === undefined) {
      resource.postError(XdgWmBaseError.invalidPopupParent, 'Client protocol error. Popup parent must be non-null.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }

    const xdgPositioner = positioner.implementation as XdgPositioner
    const parentXdgSurface = parent.implementation as XdgSurface

    const positionerState = xdgPositioner.createStateCopy()
    if (positionerState.sizeRect === undefined) {
      resource.postError(XdgWmBaseError.invalidPositioner, 'Client provided an invalid positioner. Size is NULL.')
      this.session.logger.warn('[client-protocol-error] - Client provided an invalid positioner. Size is NULL.')
      return
    }

    if (xdgPositioner.anchorRect === undefined) {
      resource.postError(XdgWmBaseError.invalidPositioner, 'Client provided an invalid positioner. AnchorRect is NULL.')
      this.session.logger.warn('[client-protocol-error] - Client provided an invalid positioner. AnchorRect is NULL.')
      return
    }

    const geometry = ensureGeometryConstraints(parentXdgSurface, positionerState) ?? positionerState.sizeRect

    const xdgPopupResource = new XdgPopupResource(resource.client, id, resource.version)
    XdgPopup.create(this.session, xdgPopupResource, this, parentXdgSurface, positionerState, this.seat, geometry)
    this.ackConfigure = (resource, serial) => this.handleAckConfigure(resource, serial)

    const surfaceSpaceAnchorPoint = positionerState.surfaceSpaceAnchorPoint(parentXdgSurface)
    if (surfaceSpaceAnchorPoint) {
      this.surface.surfaceChildSelf.position = minusPoint(surfaceSpaceAnchorPoint, this.surface.geometry.position)
    }
    parentXdgSurface.surface.addChild(this.surface.surfaceChildSelf)
  }

  setWindowGeometry(resource: XdgSurfaceResource, x: number, y: number, width: number, height: number): void {
    this.nextGeometry = createRect({ x, y }, { width, height })
    this.hasNextGeometry = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ackConfigure(resource: XdgSurfaceResource, serial: number): void {
    throw new Error('BUG. This call must be implemented by a subclass.')
  }

  private handleAckConfigure(resource: XdgSurfaceResource, serial: number): XdgConfigure | undefined {
    const configure = this.configureList.find((configure) => configure.serial === serial)
    this.configureList = this.configureList.filter((configure) => configure.serial > serial)

    if (configure === undefined) {
      this.session.logger.warn(`Client protocol error. Wrong configure serial ${serial}`)
      resource.postError(XdgWmBaseError.invalidSurfaceState, `Client protocol error. Wrong configure serial ${serial}`)
      return undefined
    }

    this.configured = true
    return configure
  }

  commit(): boolean {
    if (this.surface.state.buffer && !this.configured) {
      this.session.logger.warn('Client protocol error. xdg_surface has never been configured.')
      this.resource.postError(
        XdgSurfaceError.unconfiguredBuffer,
        'Client protocol error. xdg_surface has never been configured.',
      )
      return true
    }

    if (this.hasNextGeometry && this.nextGeometry) {
      this.surface.updateGeometry(this.nextGeometry)
      this.hasNextGeometry = false
    }

    return false
  }

  scheduleConfigure(pendingSame: boolean, sendConfigure: () => XdgConfigure): void {
    if (this.configureIdle !== undefined) {
      if (!pendingSame) {
        return
      }
      this.configureIdle()
      this.configureIdle = undefined
    } else {
      if (pendingSame) {
        return
      }

      this.configureIdle = queueCancellableMicrotask(() => this.sendConfigure(sendConfigure))
    }
  }

  private sendConfigure(sendConfigure: () => XdgConfigure) {
    this.configureIdle = undefined
    const configure = sendConfigure()
    this.configureList.push(configure)
    this.resource.configure(configure.serial)
  }
}

function ensureGeometryConstraints(
  parentXdgSurface: XdgSurface,
  positionerState: XdgPositionerState,
): RectWithInfo | undefined {
  if (positionerState.constraintAdjustment === none) {
    // we can't even
    return
  }

  const parentView = parentXdgSurface.surface.role?.view
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
          positionerState.sizeRect = withSizeAndPosition({ x0, y0, x1, y1 })
        }

        if (violations.rightViolation) {
          const x1 = positionerState.sizeRect.x1 - violations.rightViolation
          const { x0, y0, y1 } = positionerState.sizeRect
          positionerState.sizeRect = withSizeAndPosition({ x0, y0, x1, y1 })
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
          positionerState.sizeRect = withSizeAndPosition({ x0, y0, x1, y1 })
        }

        if (violations.bottomViolation) {
          const y1 = positionerState.sizeRect.y1 - violations.bottomViolation
          const { x0, y0, x1 } = positionerState.sizeRect
          positionerState.sizeRect = withSizeAndPosition({ x0, y0, x1, y1 })
        }
      }

      return positionerState.sizeRect
    }
  }
}
