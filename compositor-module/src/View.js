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
import RenderState from './render/RenderState'
import Size from './Size'
import Point from './math/Point'

export default class View {
  /**
   *
   * @param {Surface} surface
   * @param {number} width width in compositor space
   * @param {number} height height in compositor space
   * @param {Scene}scene
   * @returns {View}
   */
  static create (surface, width, height, scene) {
    const renderState = RenderState.create(scene.sceneShader.gl, Size.create(width, height))
    return new View(surface, width, height, Mat4.IDENTITY(), scene, renderState)
  }

  /**
   * Use View.create(..) instead.
   * @private
   * @param {Surface}surface
   * @param {number}width
   * @param {number}height
   * @param {Mat4} transformation
   * @param {Scene}scene
   * @param {RenderState}renderState
   */
  constructor (surface, width, height, transformation, scene, renderState) {
    /**
     * @type {Surface}
     */
    this.surface = surface
    /**
     * @type {Scene}
     */
    this.scene = scene
    /**
     * @type {RenderState}
     */
    this.renderState = renderState
    /**
     * @type {?Mat4}
     */
    this.customTransformation = null
    /**
     * @type {Map<string, Mat4>}
     */
    this.userTransformations = new Map()
    /**
     * @type {Point}
     */
    this.positionOffset = Point.create(0, 0)
    /**
     * @type {Mat4}
     */
    this._transformation = transformation
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
     * @type {boolean}
     */
    this.mapped = true
    /**
     * @type {boolean}
     */
    this.damaged = true
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
      // this.applyTransformations()
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
    return this.surface.children
      .filter(surfaceChild => surfaceChild.surface !== this.surface)
      .map(surfaceChild => surfaceChild.surface.views.filter(view => view.parent === this))
      .flat()
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
    const { x, y } = surfaceChild.position.plus(this.positionOffset)
    const positionTransformation = Mat4.translation(x, y)

    return parentTransformation.timesMat4(positionTransformation)
  }

  withUserTransformations (transformation) {
    let finalTransformation = transformation
    // TODO use reduce
    this.userTransformations.forEach(value => { finalTransformation = transformation.timesMat4(value) })
    return finalTransformation
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
   * @param {Point} scenePoint point in browser coordinates
   * @return {Point}
   */
  toSurfaceSpace (scenePoint) {
    const viewPoint = this.toViewSpaceFromCompositor(scenePoint)

    const surfaceSize = this.surface.size
    const surfaceWidth = surfaceSize.w
    const surfaceHeight = surfaceSize.h
    if (surfaceWidth === this.renderState.size.w && surfaceHeight === this.renderState.size.h) {
      return viewPoint
    } else {
      return Mat4.scalarVector(Vec4.create2D(surfaceWidth / this.renderState.size.w, surfaceHeight / this.renderState.size.h)).timesPoint(viewPoint)
    }
  }

  destroy () {
    if (this.renderState) {
      this.renderState.destroy()
      this.renderState = null
    }

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
