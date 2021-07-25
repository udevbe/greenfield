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
  readonly userTransformations: Map<string, Mat4> = new Map<string, Mat4>()
  customTransformation?: Mat4
  private inverseTransformation: Mat4
  private readonly destroyPromise: Promise<void>
  // @ts-ignore
  private destroyResolve: (value?: PromiseLike<void> | void) => void
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment

  private constructor(
    public readonly surface: Surface,
    private _transformation: Mat4,
    public readonly scene: Scene,
    public renderState: RenderState,
    public positionOffset = Point.create(0, 0),
    public destroyed = false,
    private _primary = false,
    public mapped = true,
    public extraTransformations: Mat4[] = [],
  ) {
    this.inverseTransformation = this._transformation.invert()
    this.destroyPromise = new Promise<void>((resolve) => {
      this.destroyResolve = resolve
    })
  }

  private _parent?: View

  get parent(): View | undefined {
    return this._parent
  }

  set parent(parent: View | undefined) {
    if (this.destroyed) {
      return
    }

    this._parent = parent

    if (parent) {
      this.primary = parent.primary

      parent.onDestroy().then(() => {
        if (this.parent === parent) {
          this.destroy()
          this.parent = undefined
        }
      })
      // this.applyTransformations()
    }
  }

  get primary(): boolean {
    if (this._primary) {
      return true
    } else if (this.parent) {
      return this.parent.primary
    } else {
      return false
    }
  }

  set primary(primary: boolean) {
    if (this.destroyed) {
      return
    }

    this._primary = primary
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
    const renderState = RenderState.create(scene.sceneShader.gl, Size.create(width, height))
    return new View(surface, Mat4.IDENTITY(), scene, renderState)
  }

  applyTransformations(): void {
    if (this.destroyed) {
      return
    }

    this.transformation = this.calculateTransformation()
    this.applyTransformationsChild()
  }

  findChildViews(): View[] {
    return this.surface.children
      .filter((surfaceChild) => surfaceChild.surface !== this.surface)
      .map((surfaceChild) => surfaceChild.surface.views.filter((view) => view.parent === this))
      .flat()
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

  destroy() {
    if (this.renderState) {
      this.renderState.destroy()
    }

    this.destroyed = true
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }

  private applyTransformationsChild() {
    this.findChildViews().forEach((childView) => childView.applyTransformations())
  }

  private calculateTransformation(): Mat4 {
    if (this.customTransformation) {
      return this.customTransformation
    }
    // TODO we might want to keep some 'transformation dirty' flags to avoid needless matrix multiplications.
    //  For this we need to find out what the 'dependencies' are and mark the transformation dirty if they change so the transformation can be recalculated.

    // inherit parent transformation
    let parentTransformation = Mat4.IDENTITY()
    if (this._parent) {
      parentTransformation = this._parent.transformation
    }

    // position transformation
    const surfaceChild = this.surface.surfaceChildSelf
    const { x, y } = surfaceChild.position.plus(this.positionOffset)
    const positionTransformation = Mat4.translation(x, y)
    const vanillaTransformation = parentTransformation.timesMat4(positionTransformation)

    return this.extraTransformations.reduce(
      (previousValue, currentValue) => currentValue.timesMat4(previousValue),
      vanillaTransformation,
    )
  }
}
