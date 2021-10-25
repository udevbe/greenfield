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

import { XdgPositionerRequests, XdgPositionerResource, XdgPositionerError } from 'westfield-runtime-server'
import { minusPoint, plusPoint, Point } from './math/Point'

import { createRect, RectWithInfo } from './math/Rect'
import Session from './Session'
import View from './View'
import XdgSurface from './XdgSurface'

const anchorCalculation = {
  /**
   * none
   */
  0: (anchorRect: RectWithInfo): Point => {
    // calculate center
    const x = Math.round((anchorRect.x0 + anchorRect.size.width) / 2)
    const y = Math.round((anchorRect.y0 + anchorRect.size.height) / 2)
    return { x, y }
  },
  /**
   * top
   */
  1: (anchorRect: RectWithInfo): Point => {
    const x = Math.round((anchorRect.x0 + anchorRect.size.width) / 2)
    const y = anchorRect.y0
    return { x, y }
  },
  /**
   * bottom
   */
  2: (anchorRect: RectWithInfo): Point => {
    const x = Math.round((anchorRect.x0 + anchorRect.size.width) / 2)
    const y = anchorRect.y1
    return { x, y }
  },
  /**
   * left
   */
  3: (anchorRect: RectWithInfo): Point => {
    const x = anchorRect.x0
    const y = Math.round((anchorRect.y0 + anchorRect.size.height) / 2)
    return { x, y }
  },
  /**
   * right
   */
  4: (anchorRect: RectWithInfo): Point => {
    const x = anchorRect.x1
    const y = Math.round((anchorRect.y0 + anchorRect.size.height) / 2)
    return { x, y }
  },
  /**
   * topLeft
   */
  5: (anchorRect: RectWithInfo): Point => {
    const x = anchorRect.x0
    const y = anchorRect.y0
    return { x, y }
  },
  /**
   * bottomLeft
   */
  6: (anchorRect: RectWithInfo): Point => {
    const x = anchorRect.x0
    const y = anchorRect.y1
    return { x, y }
  },
  /**
   * topRight
   */
  7: (anchorRect: RectWithInfo): Point => {
    const x = anchorRect.x1
    const y = anchorRect.y0
    return { x, y }
  },
  /**
   * bottomRight
   */
  8: (anchorRect: RectWithInfo): Point => {
    const x = anchorRect.x1
    const y = anchorRect.y1
    return { x, y }
  },
} as const

const offsetCalculation = {
  /**
   * none
   */
  0: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = Math.round(windowGeometry.x0 + windowGeometry.size.width / 2)
    const y = Math.round(windowGeometry.y0 + windowGeometry.size.height / 2)
    return minusPoint(anchor, { x, y })
  },
  /**
   * top
   */
  1: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = Math.round(windowGeometry.x0 + windowGeometry.size.width / 2)
    const y = windowGeometry.y1
    return minusPoint(minusPoint(anchor, { x, y }), { x: 0, y: offset.y })
  },
  /**
   * bottom
   */
  2: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = Math.round(windowGeometry.x0 + windowGeometry.size.width / 2)
    const y = windowGeometry.y0
    return plusPoint(minusPoint(anchor, { x, y }), { x: 0, y: offset.y })
  },
  /**
   * left
   */
  3: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = windowGeometry.x1
    const y = Math.round(windowGeometry.y0 + windowGeometry.size.height / 2)
    return minusPoint(minusPoint(anchor, { x, y }), { x: offset.x, y: 0 })
  },
  /**
   * right
   */
  4: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = windowGeometry.x0
    const y = Math.round(windowGeometry.y0 + windowGeometry.size.height / 2)
    return plusPoint(minusPoint(anchor, { x, y }), { x: offset.x, y: 0 })
  },
  /**
   * topLeft
   */
  5: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = windowGeometry.x1
    const y = windowGeometry.y1
    return minusPoint(minusPoint(anchor, { x, y }), offset)
  },
  /**
   * bottomLeft
   */
  6: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = windowGeometry.x1
    const y = windowGeometry.y0
    return plusPoint(minusPoint(anchor, { x, y }), { x: -offset.x, y: offset.y })
  },
  /**
   * topRight
   */
  7: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = windowGeometry.x0
    const y = windowGeometry.y1
    return plusPoint(minusPoint(anchor, { x, y }), { x: offset.x, y: -offset.y })
  },
  /**
   * bottomRight
   */
  8: (anchor: Point, offset: Point, windowGeometry: RectWithInfo): Point => {
    const x = windowGeometry.x0
    const y = windowGeometry.y0
    return plusPoint(minusPoint(anchor, { x, y }), { x: offset.x, y: offset.y })
  },
} as const

export interface XdgPositionerState {
  sizeRect?: RectWithInfo
  anchorRect?: RectWithInfo
  anchor: keyof typeof anchorCalculation
  gravity: keyof typeof offsetCalculation
  constraintAdjustment: number
  offset: Point

  surfaceSpaceAnchorPoint(xdgSurface: XdgSurface): Point | undefined

  checkScreenConstraints(
    xdgSurface: XdgSurface,
    view: View,
  ): { topViolation: number; rightViolation: number; bottomViolation: number; leftViolation: number } | undefined
}

export default class XdgPositioner implements XdgPositionerRequests {
  size?: RectWithInfo
  anchorRect?: RectWithInfo
  anchor: keyof typeof anchorCalculation = 0
  gravity: keyof typeof offsetCalculation = 0
  constraintAdjustment = 0
  offset: Point = { x: 0, y: 0 }

  static create(session: Session, xdgPositionerResource: XdgPositionerResource): XdgPositioner {
    const xdgPositioner = new XdgPositioner(session, xdgPositionerResource)
    xdgPositionerResource.implementation = xdgPositioner
    return xdgPositioner
  }

  constructor(private session: Session, public readonly xdgPositionerResource: XdgPositionerResource) {}

  destroy(resource: XdgPositionerResource): void {
    resource.destroy()
  }

  setSize(resource: XdgPositionerResource, width: number, height: number): void {
    if (width <= 0 || height <= 0) {
      resource.postError(XdgPositionerError.invalidInput, 'Size width or height of positioner can not be negative.')
      this.session.logger.warn('[client-protocol-error]. Size width or height of positioner can not be negative.')
      return
    }
    this.size = createRect({ x: 0, y: 0 }, { width, height })
  }

  setAnchorRect(resource: XdgPositionerResource, x: number, y: number, width: number, height: number): void {
    if (width <= 0 || height <= 0) {
      resource.postError(
        XdgPositionerError.invalidInput,
        'Anchor rect width or height of positioner can not be negative.',
      )
      this.session.logger.warn(
        '[client-protocol-error] - Anchor rect width or height of positioner can not be negative.',
      )
      return
    }
    this.anchorRect = createRect({ x, y }, { width, height })
  }

  setAnchor(resource: XdgPositionerResource, anchor: number): void {
    if (anchor in Object.keys(anchorCalculation)) {
      this.anchor = anchor as keyof typeof anchorCalculation
    } else {
      resource.postError(XdgPositionerError.invalidInput, `Invalid anchor: ${anchor}`)
    }
  }

  setGravity(resource: XdgPositionerResource, gravity: number): void {
    if (gravity in Object.keys(offsetCalculation)) {
      this.gravity = gravity as keyof typeof offsetCalculation
    } else {
      resource.postError(XdgPositionerError.invalidInput, `Invalid gravity: ${gravity}`)
    }
  }

  setConstraintAdjustment(resource: XdgPositionerResource, constraintAdjustment: number): void {
    this.constraintAdjustment = constraintAdjustment
  }

  setOffset(resource: XdgPositionerResource, x: number, y: number): void {
    this.offset = { x, y }
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
      sizeRect: selfSize,
      anchorRect: selfAnchorRect,
      anchor: selfAnchor,
      gravity: selfGravity,
      constraintAdjustment: selfConstraintAdjustment,
      offset: selfOffset,
      surfaceSpaceAnchorPoint(parent: XdgSurface): Point | undefined {
        if (this.anchorRect && this.sizeRect) {
          const parentWindowGeometry = parent.surface.geometry
          const surfaceSpaceAnchorRectPosition = plusPoint(parentWindowGeometry.position, this.anchorRect.position)
          const { x, y } = surfaceSpaceAnchorRectPosition
          const surfaceSpaceAnchorRect = createRect(
            { x, y },
            { width: this.anchorRect.size.width, height: this.anchorRect.size.height },
          )
          const surfaceSpaceAnchorPoint = anchorCalculation[this.anchor](surfaceSpaceAnchorRect)
          return offsetCalculation[this.gravity](surfaceSpaceAnchorPoint, this.offset, this.sizeRect)
        } else {
          resource.postError(XdgPositionerError.invalidInput, `Positioner not fully configured.`)
          return undefined
        }
      },
      checkScreenConstraints(
        parent: XdgSurface,
        parentView: View,
      ): { topViolation: number; rightViolation: number; bottomViolation: number; leftViolation: number } | undefined {
        const surfaceSpaceAnchorPoint = this.surfaceSpaceAnchorPoint(parent)
        if (surfaceSpaceAnchorPoint && this.sizeRect) {
          const surfaceSpaceWinGeoMin = plusPoint(surfaceSpaceAnchorPoint, this.sizeRect.position)
          const surfaceSpaceWinGeoMax = plusPoint(surfaceSpaceAnchorPoint, { x: this.sizeRect.x1, y: this.sizeRect.y1 })

          const surfaceSpaceMinBound = parentView.sceneToViewSpace({ x: 0, y: 0 })
          const surfaceSpaceMaxBound = parentView.sceneToViewSpace({
            x: window.document.documentElement.clientWidth,
            y: document.documentElement.clientHeight,
          })

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
            leftViolation: leftViolation,
          }
        } else {
          resource.postError(XdgPositionerError.invalidInput, `Positioner not fully configured.`)
          return undefined
        }
      },
    }
  }
}
