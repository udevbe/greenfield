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

import Mat4 from './math/Mat4'
import Point from './math/Point'
import Vec4 from './math/Vec4'
import RenderState from './render/RenderState'
import Scene from './render/Scene'
import Size from './Size'
import Surface from './Surface'

export default class View {
  private inverseTransformation: Mat4
  private readonly destroyPromise: Promise<void>
  // @ts-ignore
  private destroyResolve: (value?: PromiseLike<void> | void) => void
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment

  private constructor(
    public readonly surface: Surface,
    private _transformation: Mat4,
    public renderState: RenderState,
    private _positionOffset = Point.create(0, 0),
    public destroyed = false,
    public mapped = true,
    private _dirty: boolean = false,
    private _windowGeometryOffset = Mat4.IDENTITY(),
    public transformationUpdatedListeners: ((transformation: Mat4) => void)[] = [],
  ) {
    this.inverseTransformation = this._transformation.invert()
    this.destroyPromise = new Promise<void>((resolve) => {
      this.destroyResolve = resolve
    })
  }

  private _customTransformation?: Mat4

  get customTransformation(): Mat4 | undefined {
    return this._customTransformation
  }

  set customTransformation(customTransformation: Mat4 | undefined) {
    if (this._customTransformation === customTransformation) {
      return
    }

    this._customTransformation = customTransformation
    this._dirty = true
  }

  private _parent?: View

  get parent(): View | undefined {
    return this._parent
  }

  set parent(parent: View | undefined) {
    if (this.destroyed) {
      return
    }
    if (this._parent === parent) {
      return
    }

    this._parent = parent

    if (parent) {
      parent.onDestroy().then(() => {
        if (this.parent === parent) {
          this.destroy()
          this.parent = undefined
        }
      })
    }
    this._dirty = true
  }

  get dirty(): boolean {
    return this.parent?.dirty || this._dirty
  }

  get windowGeometryOffset(): Mat4 {
    return this._windowGeometryOffset
  }

  set windowGeometryOffset(windowGeometryOffset: Mat4) {
    this._windowGeometryOffset = windowGeometryOffset
    this._dirty = true
  }

  get positionOffset(): Point {
    return this._positionOffset
  }

  set positionOffset(positionOffset: Point) {
    if (this._positionOffset.x === positionOffset.x && this._positionOffset.y === positionOffset.y) {
      return
    }
    this._positionOffset = positionOffset
    this._dirty = true
  }

  get transformation(): Mat4 {
    return this._transformation
  }

  set transformation(transformation: Mat4) {
    if (this.destroyed) {
      return
    }

    this._transformation = transformation
    this.inverseTransformation = transformation.invert()
  }

  static create(surface: Surface, width: number, height: number, scene: Scene): View {
    const renderStates = RenderState.create(scene.sceneShader.gl, Size.create(width, height), scene)
    return new View(surface, Mat4.IDENTITY(), renderStates)
  }

  applyTransformations(): void {
    if (this.destroyed) {
      return
    }

    if (this.dirty) {
      this.transformation = this.calculateTransformation()
      this.applyTransformationsChild()
      this._dirty = false
      this.transformationUpdatedListeners.forEach((listener) => listener(this.transformation))
    }
  }

  findChildViews(): View[] {
    return this.surface.children
      .filter((surfaceChild) => surfaceChild.surface !== this.surface)
      .map((surfaceChild) => surfaceChild.surface.view)
      .filter((view): view is View => view !== undefined)
  }

  toViewSpaceFromCompositor(browserPoint: Point): Point {
    // normalize first by subtracting view offset
    return this.inverseTransformation.timesPoint(browserPoint)
  }

  toViewSpaceFromSurface(surfacePoint: Point): Point {
    const { w, h } = this.renderState.size
    if (this.surface.size) {
      const { h: surfaceHeight, w: surfaceWidth } = this.surface.size
      if (surfaceWidth === w && surfaceHeight === h) {
        return surfacePoint
      } else {
        return Mat4.scalarVector(Vec4.create2D(w / surfaceWidth, h / surfaceHeight)).timesPoint(surfacePoint)
      }
    } else {
      return surfacePoint
    }
  }

  toSurfaceSpace(scenePoint: Point): Point {
    const viewPoint = this.toViewSpaceFromCompositor(scenePoint)

    const surfaceSize = this.surface.size
    if (surfaceSize) {
      const surfaceWidth = surfaceSize.w
      const surfaceHeight = surfaceSize.h
      if (surfaceWidth === this.renderState.size.w && surfaceHeight === this.renderState.size.h) {
        return viewPoint
      } else {
        return Mat4.scalarVector(
          Vec4.create2D(surfaceWidth / this.renderState.size.w, surfaceHeight / this.renderState.size.h),
        ).timesPoint(viewPoint)
      }
    } else {
      return scenePoint
    }
  }

  destroy(): void {
    if (this.renderState) {
      this.renderState.destroy()
    }

    this.destroyed = true
    this.destroyResolve()
  }

  onDestroy(): Promise<void> {
    return this.destroyPromise
  }

  private applyTransformationsChild() {
    this.findChildViews().forEach((childView) => childView.applyTransformations())
  }

  private calculateTransformation(): Mat4 {
    if (this.customTransformation) {
      return this.customTransformation
    }

    // inherit parent transformation
    let parentTransformation = Mat4.IDENTITY()
    if (this._parent) {
      parentTransformation = this._parent.transformation
    }

    // position transformation
    const { x, y } = this.surface.surfaceChildSelf.position.plus(this._positionOffset)
    const positionTransformation = Mat4.translation(x, y)
    const vanillaTransformation = parentTransformation.timesMat4(positionTransformation)
    return this._windowGeometryOffset !== Mat4.IDENTITY()
      ? vanillaTransformation.timesMat4(this._windowGeometryOffset)
      : vanillaTransformation
  }
}
