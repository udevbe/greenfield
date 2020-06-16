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
  XdgPositionerRequests,
  XdgPositionerResource,
  XdgPositionerError
} from 'westfield-runtime-server'
import Point from './math/Point'

import Rect from './math/Rect'
import View from './View'
import XdgSurface from './XdgSurface'

interface AnchorCalculation {
  0: (rect: Rect) => Point
  1: (rect: Rect) => Point
  2: (rect: Rect) => Point
  3: (rect: Rect) => Point
  4: (rect: Rect) => Point
  5: (rect: Rect) => Point
  6: (rect: Rect) => Point
  7: (rect: Rect) => Point
  8: (rect: Rect) => Point
}

const anchorCalculation: AnchorCalculation = {
  /**
   * none
   */
  0: (anchorRect) => {
    // calculate center
    const x = Math.round((anchorRect.x0 + anchorRect.width) / 2)
    const y = Math.round((anchorRect.y0 + anchorRect.height) / 2)
    return Point.create(x, y)
  },
  /**
   * top
   */
  1: (anchorRect) => {
    const x = Math.round((anchorRect.x0 + anchorRect.width) / 2)
    const y = anchorRect.y0
    return Point.create(x, y)
  },
  /**
   * bottom
   */
  2: (anchorRect) => {
    const x = Math.round((anchorRect.x0 + anchorRect.width) / 2)
    const y = anchorRect.y1
    return Point.create(x, y)
  },
  /**
   * left
   */
  3: (anchorRect) => {
    const x = anchorRect.x0
    const y = Math.round((anchorRect.y0 + anchorRect.height) / 2)
    return Point.create(x, y)
  },
  /**
   * right
   */
  4: (anchorRect) => {
    const x = anchorRect.x1
    const y = Math.round((anchorRect.y0 + anchorRect.height) / 2)
    return Point.create(x, y)
  },
  /**
   * topLeft
   */
  5: (anchorRect) => {
    const x = anchorRect.x0
    const y = anchorRect.y0
    return Point.create(x, y)
  },
  /**
   * bottomLeft
   */
  6: (anchorRect) => {
    const x = anchorRect.x0
    const y = anchorRect.y1
    return Point.create(x, y)
  },
  /**
   * topRight
   */
  7: (anchorRect) => {
    const x = anchorRect.x1
    const y = anchorRect.y0
    return Point.create(x, y)
  },
  /**
   * bottomRight
   */
  8: (anchorRect) => {
    const x = anchorRect.x1
    const y = anchorRect.y1
    return Point.create(x, y)
  }
}

interface OffsetCalculation {
  0: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  1: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  2: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  3: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  4: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  5: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  6: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  7: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
  8: (anchor: Point, offset: Point, windowGeometry: Rect) => Point
}

const offsetCalculation: OffsetCalculation = {
  /**
   * none
   */
  0: (anchor, offset, windowGeometry) => {
    const x = Math.round(windowGeometry.x0 + (windowGeometry.width) / 2)
    const y = Math.round(windowGeometry.y0 + (windowGeometry.height) / 2)
    return anchor.minus(Point.create(x, y))
  },
  /**
   * top
   */
  1: (anchor, offset, windowGeometry) => {
    const x = Math.round(windowGeometry.x0 + (windowGeometry.width / 2))
    const y = windowGeometry.y1
    return anchor.minus(Point.create(x, y)).minus(Point.create(0, offset.y))
  },
  /**
   * bottom
   */
  2: (anchor, offset, windowGeometry) => {
    const x = Math.round(windowGeometry.x0 + (windowGeometry.width / 2))
    const y = windowGeometry.y0
    return anchor.minus(Point.create(x, y)).plus(Point.create(0, offset.y))
  },
  /**
   * left
   */
  3: (anchor, offset, windowGeometry) => {
    const x = windowGeometry.x1
    const y = Math.round(windowGeometry.y0 + (windowGeometry.height) / 2)
    return anchor.minus(Point.create(x, y)).minus(Point.create(offset.x, 0))
  },
  /**
   * right
   */
  4: (anchor, offset, windowGeometry) => {
    const x = windowGeometry.x0
    const y = Math.round(windowGeometry.y0 + (windowGeometry.height) / 2)
    return anchor.minus(Point.create(x, y)).plus(Point.create(offset.x, 0))
  },
  /**
   * topLeft
   */
  5: (anchor, offset, windowGeometry) => {
    const x = windowGeometry.x1
    const y = windowGeometry.y1
    return anchor.minus(Point.create(x, y)).minus(offset)
  },
  /**
   * bottomLeft
   */
  6: (anchor, offset, windowGeometry) => {
    const x = windowGeometry.x1
    const y = windowGeometry.y0
    return anchor.minus(Point.create(x, y)).plus(Point.create(-offset.x, offset.y))
  },
  /**
   * topRight
   */
  7: (anchor, offset, windowGeometry) => {
    const x = windowGeometry.x0
    const y = windowGeometry.y1
    return anchor.minus(Point.create(x, y)).plus(Point.create(offset.x, -offset.y))
  },
  /**
   * bottomRight
   */
  8: (anchor, offset, windowGeometry) => {
    const x = windowGeometry.x0
    const y = windowGeometry.y0
    return anchor.minus(Point.create(x, y)).plus(Point.create(offset.x, offset.y))
  }
}

export interface XdgPositionerState {
  size?: Rect
  anchorRect?: Rect
  anchor: keyof AnchorCalculation
  gravity: keyof OffsetCalculation
  constraintAdjustment: number
  offset: Point

  surfaceSpaceAnchorPoint(xdgSurface: XdgSurface): Point | undefined

  checkScreenConstraints(xdgSurface: XdgSurface, view: View): { topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number } | undefined
}

/**
 *
 *      The xdg_positioner provides a collection of rules for the placement of a
 *      child surface relative to a parent surface. Rules can be defined to ensure
 *      the child surface remains within the visible area's borders, and to
 *      specify how the child surface changes its position, such as sliding along
 *      an axis, or flipping around a rectangle. These positioner-created rules are
 *      constrained by the requirement that a child surface must intersect with or
 *      be at least partially adjacent to its parent surface.
 *
 *      See the various requests for details about possible rules.
 *
 *      At the time of the request, the compositor makes a copy of the rules
 *      specified by the xdg_positioner. Thus, after the request is complete the
 *      xdg_positioner object can be destroyed or reused; further changes to the
 *      object will have no effect on previous usages.
 *
 *      For an xdg_positioner object to be considered complete, it must have a
 *      non-zero size set by set_size, and a non-zero anchor rectangle set by
 *      set_anchor_rect. Passing an incomplete xdg_positioner object when
 *      positioning a surface raises an error.
 *
 */
export default class XdgPositioner implements XdgPositionerRequests {
  readonly xdgPositionerResource: XdgPositionerResource
  size?: Rect
  anchorRect?: Rect
  anchor: keyof AnchorCalculation = 0
  gravity: keyof OffsetCalculation = 0
  constraintAdjustment: number = 0
  offset: Point = Point.create(0, 0)

  static create(xdgPositionerResource: XdgPositionerResource): XdgPositioner {
    const xdgPositioner = new XdgPositioner(xdgPositionerResource)
    xdgPositionerResource.implementation = xdgPositioner
    return xdgPositioner
  }

  constructor(xdgPositionerResource: XdgPositionerResource) {
    this.xdgPositionerResource = xdgPositionerResource
  }

  destroy(resource: XdgPositionerResource) {
    resource.destroy()
  }

  setSize(resource: XdgPositionerResource, width: number, height: number) {
    if (width <= 0 || height <= 0) {
      resource.postError(XdgPositionerError.invalidInput, 'Size width or height of positioner can not be negative.')
      console.log('[client-protocol-error]. Size width or height of positioner can not be negative.')
      return
    }
    this.size = Rect.create(0, 0, width, height)
  }

  setAnchorRect(resource: XdgPositionerResource, x: number, y: number, width: number, height: number) {
    if (width <= 0 || height <= 0) {
      resource.postError(XdgPositionerError.invalidInput, 'Anchor rect width or height of positioner can not be negative.')
      console.log('[client-protocol-error] - Anchor rect width or height of positioner can not be negative.')
      return
    }
    this.anchorRect = Rect.create(x, y, x + width, y + height)
  }

  setAnchor(resource: XdgPositionerResource, anchor: number) {
    if (anchor in Object.keys(anchorCalculation)) {
      this.anchor = anchor as keyof AnchorCalculation
    } else {
      resource.postError(XdgPositionerError.invalidInput, `Invalid anchor: ${anchor}`)
    }
  }

  setGravity(resource: XdgPositionerResource, gravity: number) {
    if (gravity in Object.keys(offsetCalculation)) {
      this.gravity = gravity as keyof OffsetCalculation
    } else {
      resource.postError(XdgPositionerError.invalidInput, `Invalid gravity: ${gravity}`)
    }
  }

  setConstraintAdjustment(resource: XdgPositionerResource, constraintAdjustment: number) {
    this.constraintAdjustment = constraintAdjustment
  }

  setOffset(resource: XdgPositionerResource, x: number, y: number) {
    this.offset = Point.create(x, y)
  }

  createStateCopy(): XdgPositionerState {
    const selfSize = this.size
    const selfAnchorRect = this.anchorRect
    const selfAnchor = this.anchor
    const selfGravity = this.gravity
    const selfConstraintAdjustment = this.constraintAdjustment
    const selfOffset = this.offset
    const resource = this.xdgPositionerResource
    return {
      size: selfSize,
      anchorRect: selfAnchorRect,
      anchor: selfAnchor,
      gravity: selfGravity,
      constraintAdjustment: selfConstraintAdjustment,
      offset: selfOffset,
      surfaceSpaceAnchorPoint(parent: XdgSurface): Point | undefined {
        if (this.anchorRect && this.size) {
          const parentWindowGeometry = parent.windowGeometry
          const surfaceSpaceAnchorRectPosition = parentWindowGeometry.position.plus(this.anchorRect.position)
          const { x, y } = surfaceSpaceAnchorRectPosition
          const surfaceSpaceAnchorRect = Rect.create(x, y, x + this.anchorRect.width, y + this.anchorRect.height)
          const surfaceSpaceAnchorPoint = anchorCalculation[this.anchor](surfaceSpaceAnchorRect)
          return offsetCalculation[this.gravity](surfaceSpaceAnchorPoint, this.offset, this.size)
        } else {
          resource.postError(XdgPositionerError.invalidInput, `Positioner not fully configured.`)
          return undefined
        }
      },
      checkScreenConstraints(parent: XdgSurface, parentView: View): { topViolation: number, rightViolation: number, bottomViolation: number, leftViolation: number } | undefined {
        const surfaceSpaceAnchorPoint = this.surfaceSpaceAnchorPoint(parent)
        if (surfaceSpaceAnchorPoint && this.size) {
          const surfaceSpaceWinGeoMin = surfaceSpaceAnchorPoint.plus(this.size.position)
          const surfaceSpaceWinGeoMax = surfaceSpaceAnchorPoint.plus(Point.create(this.size.x1, this.size.y1))

          const surfaceSpaceMinBound = parentView.toSurfaceSpace(Point.create(0, 0))
          const surfaceSpaceMaxBound = parentView.toSurfaceSpace(Point.create(window.document.documentElement.clientWidth, document.documentElement.clientHeight))

          let topViolation = 0
          let rightViolation = 0
          let bottomViolation = 0
          let leftViolation = 0

          if (surfaceSpaceWinGeoMin.x < surfaceSpaceMinBound.x) {
            leftViolation = Math.abs(surfaceSpaceMinBound.x - surfaceSpaceWinGeoMin.x)
          }
          if (surfaceSpaceWinGeoMin.y < surfaceSpaceMinBound.y) {
            topViolation = Math.abs(surfaceSpaceMinBound.y - surfaceSpaceWinGeoMin.y)
          }

          if (surfaceSpaceWinGeoMax.x > surfaceSpaceMaxBound.x) {
            rightViolation = surfaceSpaceWinGeoMax.x - surfaceSpaceMaxBound.x
          }

          if (surfaceSpaceWinGeoMax.y > surfaceSpaceMaxBound.y) {
            bottomViolation = surfaceSpaceWinGeoMax.y - surfaceSpaceMaxBound.y
          }

          return {
            topViolation: topViolation,
            rightViolation: rightViolation,
            bottomViolation: bottomViolation,
            leftViolation: leftViolation
          }
        } else {
          resource.postError(XdgPositionerError.invalidInput, `Positioner not fully configured.`)
          return undefined
        }
      }
    }
  }
}
