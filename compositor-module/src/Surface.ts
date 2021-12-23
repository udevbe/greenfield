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
import { withSizeAndPosition } from './math/Rect'
import BufferContents from './BufferContents'
import BufferImplementation from './BufferImplementation'
import Callback from './Callback'
import { IDENTITY, invert, Mat4, scalar, timesMat4, timesPoint, translation } from './math/Mat4'
import { Point } from './math/Point'
import { createRect, Rect, RectWithInfo } from './math/Rect'
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
import { FrameDecoder, H264DecoderContext } from './remotestreaming/buffer-decoder'
import Renderer from './render/Renderer'
import Session from './Session'
import { sizeEquals, Size } from './math/Size'
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

const bufferTransformations = [
  { transformation: NORMAL, inverseTransformation: invert(NORMAL) } as const, // 0
  { transformation: _90, inverseTransformation: invert(_90) } as const, // 1
  { transformation: _180, inverseTransformation: invert(_180) } as const, // 2
  { transformation: _270, inverseTransformation: invert(_270) } as const, // 3
  { transformation: FLIPPED, inverseTransformation: invert(FLIPPED) } as const, // 4
  { transformation: FLIPPED_90, inverseTransformation: invert(FLIPPED_90) } as const, // 5
  { transformation: FLIPPED_180, inverseTransformation: invert(FLIPPED_180) } as const, // 6
  { transformation: FLIPPED_270, inverseTransformation: invert(FLIPPED_270) } as const, // 7
] as const

let surfaceH264DecodeId = 0

class Surface implements WlSurfaceRequests {
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
  bufferTransformation: Mat4 = IDENTITY
  inverseBufferTransformation: Mat4 = IDENTITY
  readonly pixmanRegion: number = createPixmanRegion()
  size?: Size
  _geometry?: RectWithInfo
  hasGeometry = false
  private _surfaceChildren: SurfaceChild[] = []
  mapped = false

  private constructor(
    public readonly resource: WlSurfaceResource,
    public readonly renderer: Renderer,
    public readonly session: Session,
  ) {}

  private _parent?: Surface

  get parent(): Surface | undefined {
    return this._parent
  }

  private set parent(parent: Surface | undefined) {
    if (this._parent !== parent) {
      this._parent = parent
      this.role?.view.markDirty()
    }
  }

  private h264DecoderContext?: H264DecoderContext

  getH264DecoderContext(frameDecoder: FrameDecoder): H264DecoderContext {
    if (this.h264DecoderContext === undefined) {
      this.h264DecoderContext = frameDecoder.createH264DecoderContext(this, `${surfaceH264DecodeId++}`)
      return this.h264DecoderContext
    } else {
      return this.h264DecoderContext
    }
  }

  get children(): SurfaceChild[] {
    return [...this.state.subsurfaceChildren, ...this._surfaceChildren]
  }

  static create(wlSurfaceResource: WlSurfaceResource, session: Session): Surface {
    const surface = new Surface(wlSurfaceResource, session.renderer, session)
    initInfinite(surface.state.opaquePixmanRegion)
    initInfinite(surface.state.inputPixmanRegion)
    initInfinite(surface.pendingState.opaquePixmanRegion)
    initInfinite(surface.pendingState.inputPixmanRegion)
    initRect(surface.pixmanRegion, { x0: 0, y0: 0, x1: 0, y1: 0 })
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

  isWithinInputRegion(surfacePoint: Point): boolean {
    const withinInput = contains(this.state.inputPixmanRegion, surfacePoint)
    const withinSurface = contains(this.pixmanRegion, surfacePoint)
    return withinSurface && withinInput
  }

  addSubsurface(surfaceChild: SurfaceChild): void {
    this._addChild(surfaceChild, this.state.subsurfaceChildren)
    this.pendingState.subsurfaceChildren.push(surfaceChild)

    surfaceChild.surface.resource.onDestroy().then(() => {
      this.removeSubsurface(surfaceChild)
    })
  }

  addChild(surfaceChild: SurfaceChild): void {
    return this._addChild(surfaceChild, this._surfaceChildren)
  }

  removeChild(surfaceChild: SurfaceChild): void {
    this._surfaceChildren = this.removeChildFromList(surfaceChild, this._surfaceChildren)
  }

  destroy(resource: WlSurfaceResource): void {
    // this._handleDestruction()
    this.destroyed = true
    resource.destroy()
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
    this.pendingState.damageRects.push(createRect({ x, y }, { width, height }))
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
    return timesPoint(this.inverseBufferTransformation, bufferPoint)
  }

  async commit(resource: WlSurfaceResource, serial?: number): Promise<void> {
    const bufferImplementation = this.pendingState.buffer?.implementation as
      | BufferImplementation<BufferContents<unknown> | Promise<BufferContents<unknown>>>
      | undefined
    if (bufferImplementation && this.pendingState.bufferContents === undefined) {
      try {
        this.session.logger.trace(`|- Awaiting buffer contents with serial: ${serial ?? 'NO SERIAL'}`)
        const startBufferContents = Date.now()
        this.pendingState.bufferContents = await bufferImplementation.getContents(this, serial)
        this.session.logger.trace(
          `|--> Buffer contents with serial: ${serial ?? 'NO SERIAL'} took ${Date.now() - startBufferContents}ms`,
        )
        if (this.destroyed) {
          return
        }
      } catch (e: any) {
        this.session.logger.warn(`[surface: ${resource.id}] - Failed to receive buffer contents.`, e.toString())
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
      this.session.logger.warn('[client-protocol-error] - Buffer transform value is invalid.')
      return
    }

    this.pendingState.bufferTransform = transform
  }

  setBufferScale(resource: WlSurfaceResource, scale: number): void {
    if (scale < 1) {
      resource.postError(WlSurfaceError.invalidScale, 'Buffer scale value is invalid.')
      this.session.logger.warn('[client-protocol-error] - Buffer scale value is invalid.')
      return
    }

    this.pendingState.bufferScale = scale
  }

  damageBuffer(resource: WlSurfaceResource, x: number, y: number, width: number, height: number): void {
    this.pendingState.bufferDamageRects.push(createRect({ x, y }, { width, height }))
  }

  private _applyBufferTransformWithPositionCorrection(newBufferTransform: number, bufferTransformation: Mat4) {
    switch (newBufferTransform) {
      case 3: // 270
      case 4: {
        // flipped
        this.bufferTransformation = timesMat4(bufferTransformation, invert(translation(this.size?.width ?? 0, 0)))
        this.inverseBufferTransformation = invert(this.bufferTransformation)
        break
      }
      case 2: // 180
      case 5: {
        // 90 flipped
        this.bufferTransformation = timesMat4(
          bufferTransformation,
          invert(translation(this.size?.width ?? 0, this.size?.height ?? 0)),
        )
        this.inverseBufferTransformation = invert(this.bufferTransformation)
        break
      }
      case 1: // 90
      case 6: {
        // 180 flipped
        this.bufferTransformation = timesMat4(bufferTransformation, invert(translation(0, this.size?.height ?? 0)))
        this.inverseBufferTransformation = invert(this.bufferTransformation)
        break
      }
      case 0: // normal
      case 7: {
        // 270 flipped
        this.bufferTransformation = timesMat4(bufferTransformation, translation(0, 0))
        this.inverseBufferTransformation = invert(this.bufferTransformation)
        break
      }
    }
  }

  /**
   * Called during commit
   * @private
   */
  private calculateDerivedPendingState() {
    const oldBufferSize = this.state.bufferContents?.size ?? { width: 0, height: 0 }
    this.state.bufferContents?.validateSize?.()
    const newBufferSize = this.pendingState.bufferContents?.size ?? { width: 0, height: 0 }

    if (
      this.pendingState.bufferScale !== this.state.bufferScale ||
      this.pendingState.bufferTransform !== this.state.bufferTransform ||
      oldBufferSize.width !== newBufferSize.width ||
      oldBufferSize.height !== newBufferSize.height
    ) {
      const transformations = bufferTransformations[this.pendingState.bufferTransform]
      const bufferTransformation =
        this.pendingState.bufferScale === 1
          ? transformations.transformation
          : timesMat4(transformations.transformation, scalar(this.pendingState.bufferScale))
      const inverseBufferTransformation =
        this.pendingState.bufferScale === 1 ? transformations.inverseTransformation : invert(bufferTransformation)

      const surfacePoint = timesPoint(inverseBufferTransformation, {
        x: newBufferSize.width,
        y: newBufferSize.height,
      })
      const newSize = { width: Math.abs(surfacePoint.x), height: Math.abs(surfacePoint.y) }
      if ((this.role && !this.size) || (this.role && this.size && !sizeEquals(this.size, newSize))) {
        this.role.view.markDirty()
      }
      this.size = newSize
      fini(this.pixmanRegion)
      initRect(this.pixmanRegion, { x0: 0, y0: 0, x1: this.size.width, y1: this.size.height })
      this._applyBufferTransformWithPositionCorrection(this.pendingState.bufferTransform, bufferTransformation)
    }
  }

  private removeChildFromList(surfaceChild: SurfaceChild, siblings: SurfaceChild[]): SurfaceChild[] {
    if (surfaceChild.surface.parent === this) {
      surfaceChild.surface.parent = undefined
    }
    return siblings.filter((sibling) => sibling !== surfaceChild)
  }

  private removeSubsurface(surfaceChild: SurfaceChild): void {
    this.state.subsurfaceChildren = this.removeChildFromList(surfaceChild, this.state.subsurfaceChildren)
    this.pendingState.subsurfaceChildren = this.removeChildFromList(surfaceChild, this.pendingState.subsurfaceChildren)
  }

  private _addChild(surfaceChild: SurfaceChild, siblings: SurfaceChild[]) {
    siblings.push(surfaceChild)
    surfaceChild.surface.parent = this
  }

  private _handleDestruction() {
    this.parent?.removeChild(this.surfaceChildSelf)
    this.destroyed = true
    this.role?.view?.destroy()
    this.h264DecoderContext?.destroy()
  }

  get geometry(): RectWithInfo {
    if (this.hasGeometry && this._geometry) {
      return this._geometry
    } else {
      return withSizeAndPosition(this.boundingRectangle())
    }
  }

  updateGeometry(rect: Rect): void {
    this.hasGeometry = true
    this._geometry = withSizeAndPosition(rect)
  }

  boundingRectangle(): Rect {
    const xs = [0]
    const ys = [0]

    const size = this.size
    if (size) {
      xs.push(size.width)
      ys.push(size.height)

      this.state.subsurfaceChildren.forEach((subsurfaceChild) => {
        const subsurfacePosition = subsurfaceChild.position
        const subsurfaceSize = subsurfaceChild.surface.size
        if (subsurfaceSize) {
          xs.push(subsurfacePosition.x)
          ys.push(subsurfacePosition.y)
          xs.push(subsurfacePosition.x + subsurfaceSize.width)
          ys.push(subsurfacePosition.y + subsurfaceSize.height)
        }
      })

      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)

      return { x0: minX, y0: minY, x1: maxX, y1: maxY }
    } else {
      return { x0: 0, y0: 0, x1: 0, y1: 0 }
    }
  }

  /**
   * Finds the parent surface that is not a subsurface
   */
  getMainSurface(): Surface {
    if (this.role instanceof Subsurface) {
      return this.role.parent.getMainSurface()
    } else {
      return this
    }
  }

  unmap(): void {
    this.mapped = false
    if (this.role?.view) {
      // FIXME trigger rerender?
      this.role.view.mapped = false
    }
  }
}

export default Surface
