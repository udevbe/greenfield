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

import Mat4 from './math/Mat4'
import Vec4 from './math/Vec4'

export default class View {
  /**
   *
   * @param {Surface} surface
   * @param {number} width width in compositor space
   * @param {number} height height in compositor space
   * @returns {View}
   */
  static create (surface, width, height) {
    return new View(surface, width, height, Mat4.IDENTITY())
  }

  /**
   * @return {number}
   * @private
   */
  static _nextTopZIndex () {
    this._topZIndex++
    return this._topZIndex
  }

  /**
   * Use View.create(..) instead.
   * @private
   * @param {Surface}surface
   * @param {number}width
   * @param {number}height
   * @param {Mat4} transformation
   */
  constructor (surface, width, height, transformation) {
    /**
     * @type {Surface}
     */
    this.surface = surface
    /**
     * @type {?Mat4}
     */
    this.customTransformation = null
    /**
     * @type {Map<string, Mat4>}
     */
    this.userTransformations = new Map()
    /**
     * @type {number}
     */
    this.width = width
    /**
     * @type {number}
     */
    this.height = height
    /**
     * @type {boolean}
     */
    this.disableInputRegion = false
    /**
     * @type {Mat4}
     */
    this._transformation = transformation
    /**
     * @type {Mat4}
     */
    this._backBufferTransformation = transformation
    /**
     * @type {Mat4}
     */
    this._inverseTransformation = transformation.invert()
    /**
     * @type {Promise}
     * @private
     */
    this._destroyPromise = new Promise(resolve => { this._destroyResolve = resolve })
    /**
     * @type {boolean}
     */
    this.destroyed = false
    /**
     * @type {View}
     * @private
     */
    this._parent = null
    /**
     * @type {boolean}
     * @private
     */
    this._primary = false
    /**
     * @type {number}
     */
    this.zIndex = View._topZIndex
    /**
     * @type {boolean}
     */
    this.mapped = true
  }

  /**
   * @param {View}parent
   */
  set parent (parent) {
    if (this.destroyed) { return }

    this._parent = parent

    if (this._parent) {
      this.primary = parent.primary

      parent.onDestroy().then(() => {
        if (this.parent === parent) {
          this.destroy()
          this.parent = null
        }
      })
      this.applyTransformations()
    }
  }

  /**
   * @param {boolean}primary
   */
  set primary (primary) {
    if (this.destroyed) { return }

    this._primary = primary
  }

  /**
   * @return {boolean}
   */
  get primary () {
    if (this._primary) {
      return true
    } else if (this.parent) {
      return this.parent.primary
    } else {
      return false
    }
  }

  /**
   * @return {View}
   */
  get parent () {
    return this._parent
  }

  /**
   * @param {Mat4}transformation
   */
  set transformation (transformation) {
    if (this.destroyed) { return }

    this._transformation = transformation
    this._inverseTransformation = transformation.invert()
  }

  /**
   * @return {Mat4}
   */
  get transformation () {
    return this._transformation
  }

  applyTransformations () {
    if (this.destroyed) { return }

    this.transformation = this._calculateTransformation()
    this._applyTransformationsChild()
  }

  _applyTransformationsChild () {
    this.findChildViews().forEach(childView => childView.applyTransformations())
  }

  /**
   * @return {View[]}
   */
  findChildViews () {
    return this.surface.children.map(surfaceChild => {
      if (surfaceChild.surface === this.surface) { return }
      return surfaceChild.surface.views.filter(view => view.parent === this)
    }).flat()
  }

  /**
   * @return {Mat4}
   * @private
   */
  _calculateTransformation () {
    if (this.customTransformation) {
      return this.customTransformation
    }
    // TODO we might want to keep some 'transformation dirty' flags to avoid needless matrix multiplications

    // inherit parent transformation
    let parentTransformation = Mat4.IDENTITY()
    if (this._parent) {
      parentTransformation = this._parent.transformation
    }

    // position transformation
    const surfaceChild = this.surface.surfaceChildSelf
    const { x, y } = surfaceChild.position
    const positionTransformation = Mat4.translation(x, y)

    return parentTransformation.timesMat4(positionTransformation)
  }

  withUserTransformations (transformation) {
    let finalTransformation = transformation
    this.userTransformations.forEach(value => { finalTransformation = transformation.timesMat4(value) })
    return finalTransformation
  }

  raise () {
    if (this.destroyed) { return }

    this.zIndex = View._nextTopZIndex()
  }

  /**
   * @param {Point} viewPoint point in view coordinates with respect to view transformations
   * @return {Point} point in browser coordinates
   */
  toCompositorSpace (viewPoint) {
    return this.transformation.timesPoint(viewPoint)
  }

  /**
   * @param {Point} browserPoint point in browser coordinates
   * @return {Point} point in view coordinates with respect to view transformations
   */
  toViewSpaceFromCompositor (browserPoint) {
    // normalize first by subtracting view offset
    return this._inverseTransformation.timesPoint(browserPoint)
  }

  toViewSpaceFromSurface (surfacePoint) {
    const { w, h } = this.surface.renderState.size
    const { h: surfaceHeight, w: surfaceWidth } = this.surface.size
    if (surfaceWidth === w && surfaceHeight === h) {
      return surfacePoint
    } else {
      return Mat4.scalarVector(Vec4.create2D(w / surfaceWidth, h / surfaceHeight)).timesPoint(surfacePoint)
    }
  }

  /**
   * @param {Point} browserPoint point in browser coordinates
   * @return {Point}
   */
  toSurfaceSpace (browserPoint) {
    const viewPoint = this.toViewSpaceFromCompositor(browserPoint)

    const surfaceSize = this.surface.size
    const surfaceWidth = surfaceSize.w
    const surfaceHeight = surfaceSize.h
    if (surfaceWidth === this.width && surfaceHeight === this.height) {
      return viewPoint
    } else {
      return Mat4.scalarVector(Vec4.create2D(surfaceWidth / this.width, surfaceHeight / this.height)).timesPoint(viewPoint)
    }
  }

  show () {
    if (this.destroyed) { return }

    this.mapped = true

    // TODO trigger scene redraw
  }

  hide () {
    if (this.destroyed) { return }

    this.mapped = false

    // TODO trigger scene redraw
  }

  destroy () {
    this.destroyed = true
    this._destroyResolve()
  }

  /**
   * @return {Promise}
   */
  onDestroy () {
    return this._destroyPromise
  }
}

/**
 * @type {number}
 * @private
 */
View._topZIndex = 20
