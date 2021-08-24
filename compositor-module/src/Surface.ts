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

import {
  WlBufferResource,
  WlCallbackResource,
  WlOutputTransform,
  WlRegionResource,
  WlSurfaceError,
  WlSurfaceRequests,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import BufferContents from './BufferContents'
import BufferImplementation from './BufferImplementation'
import Callback from './Callback'
import Mat4 from './math/Mat4'
import Point from './math/Point'
import Rect from './math/Rect'
import { _180, _270, _90, FLIPPED, FLIPPED_180, FLIPPED_270, FLIPPED_90, NORMAL } from './math/Transformations'
import Region, {
  copyTo,
  init,
  fini,
  createPixmanRegion,
  initInfinite,
  initRect,
  destroyPixmanRegion,
  contains,
} from './Region'
import H264BufferContentDecoder from './render/H264BufferContentDecoder'
import Renderer from './render/Renderer'
import Session from './Session'
import Size from './Size'
import Subsurface from './Subsurface'
import { createSurfaceChild, SurfaceChild } from './SurfaceChild'
import SurfaceRole from './SurfaceRole'

export interface SurfaceState {
  damageRects: Rect[]
  bufferDamageRects: Rect[]
  readonly opaquePixmanRegion: number
  readonly inputPixmanRegion: number
  dx: number
  dy: number
  bufferTransform: number
  bufferScale: number

  bufferResourceDestroyListener: () => void
  buffer?: WlBufferResource
  bufferContents?: BufferContents<unknown>

  subsurfaceChildren: SurfaceChild[]

  frameCallbacks: Callback[]
}

export function mergeSurfaceState(targetState: SurfaceState, sourceState: SurfaceState): void {
  targetState.dx = sourceState.dx
  targetState.dy = sourceState.dy

  fini(targetState.inputPixmanRegion)
  init(targetState.inputPixmanRegion)
  copyTo(targetState.inputPixmanRegion, sourceState.inputPixmanRegion)

  fini(targetState.opaquePixmanRegion)
  init(targetState.opaquePixmanRegion)
  copyTo(targetState.opaquePixmanRegion, sourceState.opaquePixmanRegion)

  targetState.bufferDamageRects = [...sourceState.bufferDamageRects]

  targetState.bufferTransform = sourceState.bufferTransform
  targetState.bufferScale = sourceState.bufferScale

  targetState.buffer?.removeDestroyListener(targetState.bufferResourceDestroyListener)
  targetState.buffer = sourceState.buffer
  targetState.buffer?.addDestroyListener(targetState.bufferResourceDestroyListener)

  targetState.bufferContents = sourceState.bufferContents

  targetState.subsurfaceChildren = [...sourceState.subsurfaceChildren]

  targetState.frameCallbacks = [...sourceState.frameCallbacks, ...targetState.frameCallbacks]
}

/**
 * @type {{transformation: Mat4, inverseTransformation:Mat4}[]}
 */
const bufferTransformations = [
  { transformation: NORMAL, inverseTransformation: NORMAL.invert() }, // 0
  { transformation: _90, inverseTransformation: _90.invert() }, // 1
  { transformation: _180, inverseTransformation: _180.invert() }, // 2
  { transformation: _270, inverseTransformation: _270.invert() }, // 3
  { transformation: FLIPPED, inverseTransformation: FLIPPED.invert() }, // 4
  { transformation: FLIPPED_90, inverseTransformation: FLIPPED_90.invert() }, // 5
  { transformation: FLIPPED_180, inverseTransformation: FLIPPED_180.invert() }, // 6
  { transformation: FLIPPED_270, inverseTransformation: FLIPPED_270.invert() }, // 7
]

let surfaceH264DecodeId = 0

class Surface implements WlSurfaceRequests {
  private _parent?: Surface
  readonly surfaceChildSelf: SurfaceChild = createSurfaceChild(this)
  destroyed = false
  damaged = false
  readonly state: SurfaceState = {
    bufferContents: undefined,
    buffer: undefined,
    damageRects: [],
    bufferDamageRects: [],
    bufferScale: 1,
    bufferTransform: 0,
    dx: 0,
    dy: 0,
    inputPixmanRegion: createPixmanRegion(),
    opaquePixmanRegion: createPixmanRegion(),
    subsurfaceChildren: [this.surfaceChildSelf],
    frameCallbacks: [],
    bufferResourceDestroyListener: () => {
      this.state.buffer = undefined
      this.state.bufferContents = undefined
    },
  }
  pendingState: SurfaceState = {
    bufferContents: undefined,
    buffer: undefined,
    damageRects: [],
    bufferDamageRects: [],
    bufferScale: 1,
    bufferTransform: 0,
    dx: 0,
    dy: 0,
    inputPixmanRegion: createPixmanRegion(),
    opaquePixmanRegion: createPixmanRegion(),
    subsurfaceChildren: [this.surfaceChildSelf],
    frameCallbacks: [],
    bufferResourceDestroyListener: () => {
      this.pendingState.buffer = undefined
      this.pendingState.bufferContents = undefined
    },
  }
  hasKeyboardInput = true
  hasPointerInput = true
  hasTouchInput = true
  role?: SurfaceRole

  bufferTransformation: Mat4 = Mat4.IDENTITY()
  inverseBufferTransformation: Mat4 = Mat4.IDENTITY()

  readonly pixmanRegion: number = createPixmanRegion()
  size?: Size

  private readonly _surfaceChildren: SurfaceChild[] = []
  private _h264BufferContentDecoder?: H264BufferContentDecoder

  static create(wlSurfaceResource: WlSurfaceResource, session: Session): Surface {
    const surface = new Surface(wlSurfaceResource, session.renderer, session)
    initInfinite(surface.state.opaquePixmanRegion)
    initInfinite(surface.state.inputPixmanRegion)
    initInfinite(surface.pendingState.opaquePixmanRegion)
    initInfinite(surface.pendingState.inputPixmanRegion)
    initRect(surface.pixmanRegion, Rect.create(0, 0, 0, 0))
    wlSurfaceResource.implementation = surface

    wlSurfaceResource.onDestroy().then(() => {
      fini(surface.state.opaquePixmanRegion)
      fini(surface.state.inputPixmanRegion)
      fini(surface.pendingState.opaquePixmanRegion)
      fini(surface.pendingState.inputPixmanRegion)
      fini(surface.pixmanRegion)

      destroyPixmanRegion(surface.state.opaquePixmanRegion)
      destroyPixmanRegion(surface.state.inputPixmanRegion)
      destroyPixmanRegion(surface.pendingState.opaquePixmanRegion)
      destroyPixmanRegion(surface.pendingState.inputPixmanRegion)
      destroyPixmanRegion(surface.pixmanRegion)

      surface._handleDestruction()
    })

    return surface
  }

  private constructor(
    public readonly resource: WlSurfaceResource,
    public readonly renderer: Renderer,
    public readonly session: Session,
  ) {}

  get parent(): Surface | undefined {
    return this._parent
  }

  private set parent(parent: Surface | undefined) {
    if (this._parent !== parent) {
      this._parent = parent
      this.role?.view.markDirty()
    }
  }

  get h264BufferContentDecoder(): H264BufferContentDecoder {
    if (this._h264BufferContentDecoder === undefined) {
      this._h264BufferContentDecoder = H264BufferContentDecoder.create(`${surfaceH264DecodeId++}`)
      return this._h264BufferContentDecoder
    } else {
      return this._h264BufferContentDecoder
    }
  }

  get children(): SurfaceChild[] {
    return this.state.subsurfaceChildren.concat(this._surfaceChildren)
  }

  isWithinInputRegion(surfacePoint: Point): boolean {
    const withinInput = contains(this.state.inputPixmanRegion, surfacePoint)
    const withinSurface = contains(this.pixmanRegion, surfacePoint)
    return withinSurface && withinInput
  }

  private _applyBufferTransformWithPositionCorrection(newBufferTransform: number, bufferTransformation: Mat4) {
    switch (newBufferTransform) {
      case 3: // 270
      case 4: {
        // flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(this.size?.w ?? 0, 0).invert())
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 2: // 180
      case 5: {
        // 90 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(
          Mat4.translation(this.size?.w ?? 0, this.size?.h ?? 0).invert(),
        )
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 1: // 90
      case 6: {
        // 180 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(0, this.size?.h ?? 0).invert())
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 0: // normal
      case 7: {
        // 270 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(0, 0))
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
    }
  }

  /**
   * Called during commit
   * @private
   */
  private calculateDerivedPendingState() {
    const oldBufferSize = this.state.bufferContents?.size ?? Size.create(0, 0)
    this.state.bufferContents?.validateSize?.()
    const newBufferSize = this.pendingState.bufferContents?.size ?? Size.create(0, 0)

    if (
      this.pendingState.bufferScale !== this.state.bufferScale ||
      this.pendingState.bufferTransform !== this.state.bufferTransform ||
      oldBufferSize.w !== newBufferSize.w ||
      oldBufferSize.h !== newBufferSize.h
    ) {
      const transformations = bufferTransformations[this.pendingState.bufferTransform]
      const bufferTransformation =
        this.pendingState.bufferScale === 1
          ? transformations.transformation
          : transformations.transformation.timesMat4(Mat4.scalar(this.pendingState.bufferScale))
      const inverseBufferTransformation =
        this.pendingState.bufferScale === 1 ? transformations.inverseTransformation : bufferTransformation.invert()

      const surfacePoint = inverseBufferTransformation.timesPoint(Point.create(newBufferSize.w, newBufferSize.h))
      const newSisze = Size.create(Math.abs(surfacePoint.x), Math.abs(surfacePoint.y))
      if (this.role && this.size && !this.size.equals(newSisze)) {
        this.role.view.markDirty()
      }
      this.size = Size.create(Math.abs(surfacePoint.x), Math.abs(surfacePoint.y))
      fini(this.pixmanRegion)
      initRect(this.pixmanRegion, Rect.create(0, 0, this.size.w, this.size.h))
      this._applyBufferTransformWithPositionCorrection(this.pendingState.bufferTransform, bufferTransformation)
    }
  }

  addSubsurface(surfaceChild: SurfaceChild): void {
    this._addChild(surfaceChild, this.state.subsurfaceChildren)
    this.pendingState.subsurfaceChildren.push(surfaceChild)

    surfaceChild.surface.resource.onDestroy().then(() => {
      this.removeSubsurface(surfaceChild)
    })
  }

  private removeChildFromList(surfaceChild: SurfaceChild, siblings: SurfaceChild[]): void {
    const index = siblings.indexOf(surfaceChild)
    if (index > -1) {
      siblings.splice(index, 1)
    }
    if (surfaceChild.surface.parent === this) {
      surfaceChild.surface.parent = undefined
    }
  }

  private removeSubsurface(surfaceChild: SurfaceChild): void {
    this.removeChildFromList(surfaceChild, this.state.subsurfaceChildren)
    this.removeChildFromList(surfaceChild, this.pendingState.subsurfaceChildren)
  }

  addChild(surfaceChild: SurfaceChild): void {
    return this._addChild(surfaceChild, this._surfaceChildren)
  }

  removeChild(surfaceChild: SurfaceChild): void {
    this.removeChildFromList(surfaceChild, this._surfaceChildren)
  }

  private _addChild(surfaceChild: SurfaceChild, siblings: SurfaceChild[]) {
    siblings.push(surfaceChild)
    surfaceChild.surface.parent = this
    surfaceChild.surface.resource.onDestroy().then(() => {
      this.removeChild(surfaceChild)
    })
    this.resource.onDestroy().then(() => {
      this.removeChild(surfaceChild)
    })
  }

  destroy(resource: WlSurfaceResource): void {
    // this._handleDestruction()
    this.destroyed = true
    resource.destroy()
  }

  private _handleDestruction() {
    this.destroyed = true
    this.role?.view?.destroy()
    this._h264BufferContentDecoder?.destroy()
  }

  attach(resource: WlSurfaceResource, buffer: WlBufferResource | undefined, x: number, y: number): void {
    this.pendingState.dx = x
    this.pendingState.dy = y

    this.pendingState.buffer?.removeDestroyListener(this.pendingState.bufferResourceDestroyListener)
    this.pendingState.bufferContents = undefined
    this.pendingState.buffer = buffer
    this.pendingState.buffer?.addDestroyListener(this.pendingState.bufferResourceDestroyListener)
  }

  damage(resource: WlSurfaceResource, x: number, y: number, width: number, height: number): void {
    this.pendingState.damageRects.push(Rect.create(x, y, x + width, y + height))
  }

  frame(resource: WlSurfaceResource, callback: number): void {
    this.pendingState.frameCallbacks.push(Callback.create(new WlCallbackResource(resource.client, callback, 1)))
  }

  setOpaqueRegion(resource: WlSurfaceResource, regionResource: WlRegionResource | undefined): void {
    fini(this.pendingState.opaquePixmanRegion)
    if (regionResource) {
      const region = regionResource.implementation as Region
      init(this.pendingState.opaquePixmanRegion)
      copyTo(this.pendingState.opaquePixmanRegion, region.pixmanRegion)
    } else {
      initInfinite(this.pendingState.opaquePixmanRegion)
    }
  }

  setInputRegion(resource: WlSurfaceResource, regionResource: WlRegionResource | undefined): void {
    fini(this.pendingState.inputPixmanRegion)
    if (regionResource) {
      const region = regionResource.implementation as Region
      init(this.pendingState.inputPixmanRegion)
      copyTo(this.pendingState.inputPixmanRegion, region.pixmanRegion)
    } else {
      initInfinite(this.pendingState.inputPixmanRegion)
    }
  }

  toSurfaceSpace(bufferPoint: Point): Point {
    return this.inverseBufferTransformation.timesPoint(bufferPoint)
  }

  async commit(resource: WlSurfaceResource, serial?: number): Promise<void> {
    // const startCommit = Date.now()
    const bufferImplementation = this.pendingState.buffer?.implementation as
      | BufferImplementation<BufferContents<unknown> | Promise<BufferContents<unknown>>>
      | undefined
    if (bufferImplementation && this.pendingState.bufferContents === undefined) {
      try {
        // console.log('|- Awaiting buffer contents.')
        // const startBufferContents = Date.now()
        this.pendingState.bufferContents = await bufferImplementation.getContents(this, serial)
        // console.log(`|--> Buffer contents took ${Date.now() - startBufferContents}ms`)
        if (this.destroyed) {
          return
        }
      } catch (e) {
        // console.warn(`[surface: ${resource.id}] - Failed to receive buffer contents.`, e.toString())
      }
    }
    this.role?.onCommit(this)
  }

  /**
   * Called during commit
   */
  commitPending(): void {
    if (this.state.subsurfaceChildren.length > 1) {
      this.state.subsurfaceChildren = this.pendingState.subsurfaceChildren.slice()

      this.state.subsurfaceChildren.map((surfaceChild) => {
        const siblingSurface = surfaceChild.surface
        if (siblingSurface !== this) {
          const siblingSubsurface = siblingSurface.role as Subsurface
          // cascade scene update to subsurface children
          if (siblingSubsurface.pendingPosition) {
            surfaceChild.position = siblingSubsurface.pendingPosition
            siblingSubsurface.pendingPosition = undefined
          }
          siblingSubsurface.onParentCommit()
        }
      })
    }

    this.calculateDerivedPendingState()
    // release old buffer if we're replacing it and it hasn't been released yet
    if (this.state.buffer && this.state.buffer?.id !== this.pendingState.buffer?.id) {
      const bufferImplementation = this.state.buffer.implementation as BufferImplementation<any>
      if (!bufferImplementation.released) {
        bufferImplementation.release()
        this.resource.client.connection.flush()
      }
    }
    mergeSurfaceState(this.state, this.pendingState)
    this.damaged = true
    if (this.state.buffer) {
      const bufferImplementation = this.state.buffer.implementation as BufferImplementation<any>
      bufferImplementation.released = false
    }
    this.pendingState.damageRects = []
    this.pendingState.bufferDamageRects = []
    this.pendingState.frameCallbacks = []
  }

  setBufferTransform(resource: WlSurfaceResource, transform: number): void {
    if (!(transform in WlOutputTransform)) {
      resource.postError(WlSurfaceError.invalidTransform, 'Buffer transform value is invalid.')
      console.log('[client-protocol-error] - Buffer transform value is invalid.')
      return undefined
    }

    this.pendingState.bufferTransform = transform
  }

  setBufferScale(resource: WlSurfaceResource, scale: number): void {
    if (scale < 1) {
      resource.postError(WlSurfaceError.invalidScale, 'Buffer scale value is invalid.')
      console.log('[client-protocol-error] - Buffer scale value is invalid.')
    }

    this.pendingState.bufferScale = scale
  }

  damageBuffer(resource: WlSurfaceResource, x: number, y: number, width: number, height: number): void {
    this.pendingState.bufferDamageRects.push(Rect.create(x, y, x + width, y + height))
  }
}

export default Surface
