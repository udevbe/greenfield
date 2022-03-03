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

import { IDENTITY, invert, Mat4, timesMat4, timesPoint, timesRectToBoundingBox, translation } from './math/Mat4'
import { minusPoint, ORIGIN, plusPoint, Point } from './math/Point'
import { RectWithInfo, withSizeAndPosition } from './math/Rect'
import { copyTo, createPixmanRegion, destroyPixmanRegion, fini, initRect, intersect, notEmpty } from './Region'
import RenderState from './render/RenderState'
import { Scene } from './render/Scene'
import Surface from './Surface'

export default class View {
  readonly pixmanRegion: number = createPixmanRegion()
  relevantScene?: Scene
  regionRect: RectWithInfo = withSizeAndPosition({
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
  })
  prepareRender?: (renderState: RenderState) => void
  private inverseTransformation: Mat4
  private readonly destroyPromise: Promise<void>
  // @ts-ignore
  private destroyResolve: (value?: PromiseLike<void> | void) => void

  private constructor(
    public readonly surface: Surface,
    private _transformation: Mat4 = IDENTITY,
    public renderStates: { [sceneId: string]: RenderState } = {},
    private _positionOffset: Point = { x: 0, y: 0 },
    public destroyed = false,
    public mapped = true,
    private _dirty: boolean = true,
    public transformationUpdatedListeners: ((transformation: Mat4) => void)[] = [],
  ) {
    this.inverseTransformation = invert(this._transformation)
    this.destroyPromise = new Promise<void>((resolve) => {
      this.destroyResolve = resolve
    })
  }

  get parent(): View | undefined {
    return this.surface.parent?.role?.view
  }

  get dirty(): boolean {
    return this.parent?.dirty || this._dirty
  }

  get positionOffset(): Point {
    return this._positionOffset
  }

  set positionOffset(positionOffset: Point) {
    if (this._positionOffset.x === positionOffset.x && this._positionOffset.y === positionOffset.y) {
      return
    }
    this._positionOffset = positionOffset
    this.markDirty()
  }

  get transformation(): Mat4 {
    return this._transformation
  }

  private set transformation(transformation: Mat4) {
    if (this.destroyed) {
      return
    }

    this._transformation = transformation
    this.inverseTransformation = invert(transformation)
  }

  static create(surface: Surface): View {
    return new View(surface)
  }

  markDirty(): void {
    this._dirty = true
  }

  applyTransformations(): void {
    if (this.destroyed) {
      return
    }

    if (this.dirty) {
      this.transformation = this.calculateTransformation()
      this.updateRegion()
      this.applyTransformationsChild()
      this._dirty = false
      this.transformationUpdatedListeners.forEach((listener) => listener(this.transformation))
    }
  }

  sceneToViewSpace(scenePoint: Point): Point {
    return timesPoint(this.inverseTransformation, scenePoint)
  }

  viewToSceneSpace(viewPoint: Point): Point {
    return timesPoint(this.transformation, viewPoint)
  }

  destroy(): void {
    if (this.renderStates) {
      Object.values(this.renderStates).forEach((renderState) => renderState.destroy())
      this.renderStates = {}
    }

    this.destroyed = true
    this.destroyResolve()
  }

  onDestroy(): Promise<void> {
    return this.destroyPromise
  }

  setInitialPosition(): void {
    if (this.parent) {
      // TODO center of parent
    } else {
      // TODO set position center of the screen within surface geometry & size constraints
      this.positionOffset = minusPoint(ORIGIN, this.surface.geometry.position)
    }
  }

  private findChildViews(): View[] {
    return this.surface.children
      .filter((surfaceChild) => surfaceChild.surface !== this.surface)
      .map((surfaceChild) => surfaceChild.surface.role?.view)
      .filter((view): view is View => view !== undefined)
  }

  private applyTransformationsChild() {
    this.findChildViews().forEach((childView) => childView.applyTransformations())
  }

  private updateRegion() {
    const x0 = 0
    const y0 = 0
    const x1 = this.surface.size?.width ?? 0
    const y1 = this.surface.size?.height ?? 0

    this.regionRect = withSizeAndPosition(timesRectToBoundingBox(this.transformation, { x0, y0, x1, y1 }))

    fini(this.pixmanRegion)
    initRect(this.pixmanRegion, this.regionRect)

    this.ensureRenderStatesForMatchingScenes()
  }

  private ensureRenderStatesForMatchingScenes() {
    // find visible region for scenes where this view is visible
    const scenesWithVisibleRegion = Object.values(this.surface.session.renderer.scenes)
      .map((scene) => {
        const visibleRegion = createPixmanRegion()
        intersect(visibleRegion, this.pixmanRegion, scene.region)
        return [scene.id, { scene, visibleRegion }] as const
      })
      .filter(([, { visibleRegion }]) => {
        return notEmpty(visibleRegion)
      })

    // update & add new renderstates for scenes where this view is visible
    scenesWithVisibleRegion.forEach(([sceneId, { scene, visibleRegion }]) => {
      const renderState = this.renderStates[sceneId]
      if (renderState === undefined) {
        const bufferSize = this.surface.state.bufferContents
          ? this.surface.state.bufferContents.size
          : { width: 0, height: 0 }
        const { width, height } = bufferSize
        this.renderStates[sceneId] = RenderState.create(scene.sceneShader.gl, { width, height }, scene, visibleRegion)
      } else {
        copyTo(renderState.visibleSceneRegion, visibleRegion)
        fini(visibleRegion)
        destroyPixmanRegion(visibleRegion)
      }
    })

    // cleanup renderstates of scenes where this view is no longer visible on
    const visibleRegionBySceneId = Object.fromEntries(scenesWithVisibleRegion)
    Object.entries(this.renderStates).forEach(([sceneId, renderState]) => {
      const visibleRegion = visibleRegionBySceneId[renderState.scene.id]
      if (visibleRegion === undefined) {
        renderState.destroy()
        delete this.renderStates[sceneId]
      }
    })

    // TODO use scene with most visible coverage as relevant scene
    this.relevantScene = Object.values(this.renderStates)[0]?.scene
  }

  private calculateTransformation(): Mat4 {
    const startingTransformation = this.parent ? this.parent.transformation : IDENTITY

    // position transformation
    const { x, y } = plusPoint(this.surface.surfaceChildSelf.position, this._positionOffset)
    const positionTransformation = translation(x, y)
    return timesMat4(startingTransformation, positionTransformation)
  }
}
