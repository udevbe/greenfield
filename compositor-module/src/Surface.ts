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
  WlSurfaceRequests,
  WlSurfaceResource,
  WlSurfaceError
} from 'westfield-runtime-server'
import BufferContents from './BufferContents'
import BufferImplementation from './BufferImplementation'
import Callback from './Callback'
import Mat4 from './math/Mat4'
import Point from './math/Point'
import Rect from './math/Rect'
import {
  _180,
  _270,
  _90,
  FLIPPED,
  FLIPPED_180,
  FLIPPED_270,
  FLIPPED_90,
  NORMAL
} from './math/Transformations'
import Region from './Region'
import H264BufferContentDecoder from './render/H264BufferContentDecoder'
import Renderer from './render/Renderer'
import Scene from './render/Scene'
import Session from './Session'
import Size from './Size'
import Subsurface from './Subsurface'
import { SurfaceChild, createSurfaceChild } from './SurfaceChild'
import SurfaceRole from './SurfaceRole'
import { createSurfaceState, SurfaceState } from './SurfaceState'

import View from './View'

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
  { transformation: FLIPPED_270, inverseTransformation: FLIPPED_270.invert() } // 7
]

let surfaceH264DecodeId = 0

/**
 *
 *            A surface is a rectangular area that is displayed on the screen.
 *            It has a location, size and pixel contents.
 *
 *            The size of a surface (and relative positions on it) is described
 *            in surface-local coordinates, which may differ from the buffer
 *            coordinates of the pixel content, in case a buffer_transform
 *            or a buffer_scale is used.
 *
 *            A surface without a "role" is fairly useless: a compositor does
 *            not know where, when or how to present it. The role is the
 *            purpose of a wl_surface. Examples of roles are a cursor for a
 *            pointer (as set by wl_pointer.set_cursor), a drag icon
 *            (wl_data_device.start_drag), a sub-surface
 *            (wl_subcompositor.get_subsurface), and a window as defined by a
 *            shell protocol (e.g. wl_shell.get_shell_surface).
 *
 *            A surface can have only one role at a time. Initially a
 *            wl_surface does not have a role. Once a wl_surface is given a
 *            role, it is set permanently for the whole lifetime of the
 *            wl_surface object. Giving the current role again is allowed,
 *            unless explicitly forbidden by the relevant interface
 *            specification.
 *
 *            Surface roles are given by requests in other interfaces such as
 *            wl_pointer.set_cursor. The request should explicitly mention
 *            that this request gives a role to a wl_surface. Often, this
 *            request also creates a new protocol object that represents the
 *            role and adds additional functionality to wl_surface. When a
 *            client wants to destroy a wl_surface, they must destroy this 'role
 *            object' before the wl_surface.
 *
 *            Destroying the role object does not remove the role from the
 *            wl_surface, but it may stop the wl_surface from "playing the role".
 *            For instance, if a wl_subsurface object is destroyed, the wl_surface
 *            it was created for will be unmapped and forget its position and
 *            z-order. It is allowed to create a wl_subsurface for the same
 *            wl_surface again, but it is not allowed to use the wl_surface as
 *            a cursor (cursor is a different role than sub-surface, and role
 *            switching is not allowed).
 */
class Surface implements WlSurfaceRequests {
  readonly session: Session
  readonly resource: WlSurfaceResource
  readonly renderer: Renderer
  readonly surfaceChildSelf: SurfaceChild = createSurfaceChild(this)
  readonly pendingBufferDestroyListener = () => {
    this.pendingWlBuffer = undefined
  }
  destroyed: boolean = false
  state: SurfaceState
  pendingWlBuffer?: WlBufferResource
  views: View[] = []
  hasKeyboardInput: boolean = true
  hasPointerInput: boolean = true
  hasTouchInput: boolean = true
  role?: SurfaceRole<any>
  subsurfaceChildren: SurfaceChild[] = [this.surfaceChildSelf]
  pendingSubsurfaceChildren: SurfaceChild[] = [this.surfaceChildSelf]
  bufferTransformation: Mat4 = Mat4.IDENTITY()
  inverseBufferTransformation: Mat4 = Mat4.IDENTITY()
  pixmanRegion: number
  onViewCreated?: (view: View) => void
  size?: Size

  private readonly _surfaceChildren: SurfaceChild[] = []
  private _pendingDamageRects: Rect[] = []
  private _pendingBufferDamageRects: Rect[] = []
  private _pendingOpaqueRegion: number
  _pendingInputRegion: number
  private _pendingDx?: number
  private _pendingDy?: number
  private _pendingBufferTransform: number = 0
  private _pendingBufferScale?: number
  private _pendingFrameCallbacks: Callback[] = []
  private _h264BufferContentDecoder?: H264BufferContentDecoder

  static create(wlSurfaceResource: WlSurfaceResource, session: Session): Surface {
    const opaquePixmanRegion = Region.createPixmanRegion()
    const inputPixmanRegion = Region.createPixmanRegion()
    const surfacePixmanRegion = Region.createPixmanRegion()

    Region.initInfinite(opaquePixmanRegion)
    Region.initInfinite(inputPixmanRegion)
    Region.initRect(surfacePixmanRegion, Rect.create(0, 0, 0, 0))

    const surface = new Surface(wlSurfaceResource, session.renderer, session, opaquePixmanRegion, inputPixmanRegion, surfacePixmanRegion)
    wlSurfaceResource.implementation = surface

    wlSurfaceResource.onDestroy().then(() => {
      Region.destroyPixmanRegion(opaquePixmanRegion)
      Region.destroyPixmanRegion(inputPixmanRegion)
      Region.destroyPixmanRegion(surfacePixmanRegion)

      surface.pixmanRegion = 0
      surface.state.opaquePixmanRegion = 0
      surface.state.inputPixmanRegion = 0
      surface._handleDestruction()
    })

    return surface
  }

  private constructor(
    wlSurfaceResource: WlSurfaceResource,
    renderer: Renderer,
    session: Session,
    opaquePixmanRegion: number,
    inputPixmanRegion: number,
    surfacePixmanRegion: number
  ) {
    this.session = session
    this.resource = wlSurfaceResource
    this.renderer = renderer
    this._pendingOpaqueRegion = opaquePixmanRegion
    this._pendingInputRegion = inputPixmanRegion

    this.pixmanRegion = surfacePixmanRegion

    this.state = createSurfaceState(
      [],
      opaquePixmanRegion,
      inputPixmanRegion,
      0,
      0,
      0,
      1,
      []
    )
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
    return this.subsurfaceChildren.concat(this._surfaceChildren)
  }

  isWithinInputRegion(surfacePoint: Point): boolean {
    const withinInput = Region.contains(this.state.inputPixmanRegion, surfacePoint)
    const withinSurface = Region.contains(this.pixmanRegion, surfacePoint)
    return withinSurface && withinInput
  }

  private _applyBufferTransformWithPositionCorrection(newBufferTransform: number, bufferTransformation: Mat4) {
    switch (newBufferTransform) {
      case 3: // 270
      case 4: { // flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(this.size?.w ?? 0, 0).invert())
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 2: // 180
      case 5: { // 90 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(this.size?.w ?? 0, this.size?.h ?? 0).invert())
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 1: // 90
      case 6: { // 180 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(0, this.size?.h ?? 0).invert())
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 0: // normal
      case 7: { // 270 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(0, 0))
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
    }
  }

  updateDerivedState(newState: SurfaceState) {
    const oldBufferSize = this.state.bufferContents?.size ?? Size.create(0, 0)
    this.state.bufferContents?.validateSize?.()
    const newBufferSize = newState.bufferContents?.size ?? Size.create(0, 0)

    if (newState.bufferScale !== this.state.bufferScale ||
      newState.bufferTransform !== this.state.bufferTransform ||
      oldBufferSize.w !== newBufferSize.w ||
      oldBufferSize.h !== newBufferSize.h) {
      const transformations = bufferTransformations[newState.bufferTransform]
      const bufferTransformation = newState.bufferScale === 1 ? transformations.transformation : transformations.transformation.timesMat4(Mat4.scalar(newState.bufferScale))
      const inverseBufferTransformation = newState.bufferScale === 1 ? transformations.inverseTransformation : bufferTransformation.invert()

      const surfacePoint = inverseBufferTransformation.timesPoint(Point.create(newBufferSize.w, newBufferSize.h))
      this.size = Size.create(Math.abs(surfacePoint.x), Math.abs(surfacePoint.y))
      Region.fini(this.pixmanRegion)
      Region.initRect(this.pixmanRegion, Rect.create(0, 0, this.size.w, this.size.h))

      this._applyBufferTransformWithPositionCorrection(newState.bufferTransform, bufferTransformation)
    }
  }

  createTopLevelView(scene: Scene): View {
    const topLevelView = this.createView(scene)
    scene.topLevelViews = [...scene.topLevelViews, topLevelView]
    topLevelView.onDestroy().then(() => {
      scene.topLevelViews = scene.topLevelViews.filter(view => view !== topLevelView)
      if (scene.pointerView === topLevelView) {
        scene.pointerView = undefined
      }
      scene.render()
    })

    return topLevelView
  }

  createView(scene: Scene): View {
    const bufferSize = this.state.bufferContents ? this.state.bufferContents.size : Size.create(0, 0)
    const view = View.create(this, bufferSize.w, bufferSize.h, scene)
    if (this.views.length === 0) {
      view.primary = true
    }
    this.views.push(view)

    view.onDestroy().then(() => {
      const idx = this.views.indexOf(view)
      if (idx > -1) {
        this.views.splice(idx, 1)
      }
    })

    this.children.forEach(surfaceChild => this._ensureChildView(surfaceChild, view))
    this.onViewCreated?.(view)

    return view
  }

  private _ensureChildView(surfaceChild: SurfaceChild, view: View): View | undefined {
    if (surfaceChild.surface === this) {
      return undefined
    }

    const childView = surfaceChild.surface.createView(view.scene)
    childView.parent = view

    return childView
  }

  addSubsurface(surfaceChild: SurfaceChild): View[] {
    const childViews = this._addChild(surfaceChild, this.subsurfaceChildren)
    this.pendingSubsurfaceChildren.push(surfaceChild)

    surfaceChild.surface.resource.onDestroy().then(() => {
      this.removeSubsurface(surfaceChild)
    })

    return childViews
  }

  removeSubsurface(surfaceChild: SurfaceChild) {
    this._removeChild(surfaceChild, this.subsurfaceChildren)
    this._removeChild(surfaceChild, this.pendingSubsurfaceChildren)
  }

  addChild(surfaceChild: SurfaceChild): View[] {
    return this._addChild(surfaceChild, this._surfaceChildren)
  }

  addToplevelChild(surfaceChild: SurfaceChild) {
    this._surfaceChildren.push(surfaceChild)

    const primaryChildView = surfaceChild.surface.views.find(view => view.primary)
    const primaryView = this.views.find(view => view.primary)

    if (primaryChildView && primaryView) {
      primaryChildView.parent = primaryView
      surfaceChild.surface.resource.onDestroy().then(() => this.removeChild(surfaceChild))
    }
  }

  removeChild(surfaceChild: SurfaceChild) {
    this._removeChild(surfaceChild, this._surfaceChildren)
  }

  private _addChild(surfaceChild: SurfaceChild, siblings: SurfaceChild[]): View[] {
    siblings.push(surfaceChild)

    const childViews: View[] = []
    this.views.forEach(view => {
      const childView = this._ensureChildView(surfaceChild, view)
      if (childView) {
        childViews.push(childView)
      }
    })
    surfaceChild.surface.resource.onDestroy().then(() => this.removeChild(surfaceChild))
    return childViews
  }

  private _removeChild(surfaceChild: SurfaceChild, siblings: SurfaceChild[]) {
    const index = siblings.indexOf(surfaceChild)
    if (index > -1) {
      siblings.splice(index, 1)
    }
  }

  destroy(resource: WlSurfaceResource) {
    // this._handleDestruction()
    this.destroyed = true
    resource.destroy()
  }

  private _handleDestruction() {
    this.destroyed = true
    this.views.forEach(view => {
      view.destroy()
    })
    this._h264BufferContentDecoder?.destroy()
  }

  attach(resource: WlSurfaceResource, buffer: WlBufferResource | undefined, x: number, y: number) {
    this._pendingDx = x
    this._pendingDy = y

    this.pendingWlBuffer?.removeDestroyListener(this.pendingBufferDestroyListener)
    this.pendingWlBuffer = buffer
    this.pendingWlBuffer?.addDestroyListener(this.pendingBufferDestroyListener)
  }

  damage(resource: WlSurfaceResource, x: number, y: number, width: number, height: number) {
    this._pendingDamageRects.push(Rect.create(x, y, x + width, y + height))
  }

  frame(resource: WlSurfaceResource, callback: number) {
    this._pendingFrameCallbacks.push(Callback.create(new WlCallbackResource(resource.client, callback, 1)))
  }

  setOpaqueRegion(resource: WlSurfaceResource, regionResource: WlRegionResource | undefined) {
    this._pendingOpaqueRegion = Region.createPixmanRegion()
    if (regionResource) {
      const region = regionResource.implementation as Region
      Region.copyTo(this._pendingOpaqueRegion, region.pixmanRegion)
    } else {
      Region.initInfinite(this._pendingOpaqueRegion)
    }
  }

  setInputRegion(resource: WlSurfaceResource, regionResource: WlRegionResource | undefined) {
    this._pendingInputRegion = Region.createPixmanRegion()
    if (regionResource) {
      const region = regionResource.implementation as Region
      Region.copyTo(this._pendingInputRegion, region.pixmanRegion)
    } else {
      // 'infinite' region
      Region.initInfinite(this._pendingInputRegion)
    }
  }

  toSurfaceSpace(bufferPoint: Point): Point {
    return this.inverseBufferTransformation.timesPoint(bufferPoint)
  }

  async commit(resource: WlSurfaceResource, serial?: number) {
    // const startCommit = Date.now()
    let bufferContents: any = null

    if (this.state.bufferResource) {
      const bufferImplementation = this.state.bufferResource.implementation as BufferImplementation<any>
      if (bufferImplementation.captured) {
        bufferImplementation.release()
      }
    }

    if (this.pendingWlBuffer) {
      const bufferImplementation = this.pendingWlBuffer.implementation as BufferImplementation<any>
      bufferImplementation.capture()
      this.pendingWlBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
      // const startBufferContents = Date.now()
      try {
        // console.log('|- Awaiting buffer contents.')
        bufferContents = await bufferImplementation.getContents(this, serial)
        // console.log(`|--> Buffer contents took ${Date.now() - startBufferContents}ms`)
      } catch (e) {
        console.warn(`[surface: ${resource.id}] - Failed to receive buffer contents.`, e.toString())
      }
    }

    if (this.destroyed) {
      return
    }

    const newState = this._captureState(resource, this.pendingWlBuffer, bufferContents)

    if (newState && this.role && typeof this.role.onCommit === 'function') {
      // console.log('|- Awaiting surface role commit.')
      // const startFrameCommit = Date.now()
      this.role.onCommit(this, newState)
      // console.log(`|--> Role commit took ${Date.now() - startFrameCommit}ms`)
      if (newState.inputPixmanRegion) {
        Region.destroyPixmanRegion(newState.inputPixmanRegion)
      }
      if (newState.opaquePixmanRegion) {
        Region.destroyPixmanRegion(newState.opaquePixmanRegion)
      }
    }

    const frameCallbacks = this.state.frameCallbacks
    this.state.frameCallbacks = []

    // console.log('|- Awaiting scene render.')
    // const startSceneRender = Date.now()
    this.scheduleRender().then(() => {
      frameCallbacks.forEach(frameCallback => frameCallback.done(Date.now() & 0x7fffffff))
      this.session.flush()
      // console.log(`|--> Scene render took ${Date.now() - startSceneRender}ms.`)
    })
    // console.log(`-------> total commit took ${Date.now() - startCommit}`)
  }

  scheduleRender(): Promise<void[]> {
    return Promise.all(
      this.views
        .map(view => {
          view.damaged = true
          return view
        })
        .map(view => view.scene)
        .map(scene => scene.render()))
  }

  updateState(newState: SurfaceState) {
    if (this.subsurfaceChildren.length > 1) {
      this.subsurfaceChildren = this.pendingSubsurfaceChildren.slice()

      this.subsurfaceChildren.map(async (surfaceChild) => {
        const siblingSurface = surfaceChild.surface
        if (siblingSurface !== this) {
          const siblingSubsurface = siblingSurface.role as Subsurface
          // cascade scene update to subsurface children
          if (siblingSubsurface.pendingPosition) {
            surfaceChild.position = siblingSubsurface.pendingPosition
            siblingSubsurface.pendingPosition = undefined
          }
          await siblingSubsurface.onParentCommit(this)
        }
      })
    }

    this.updateDerivedState(newState)
    Surface.mergeState(this.state, newState)
    this.role?.setRoleState?.(newState.roleState)
  }

  // TODO export as stand-alone function
  /**
   * This will invalidate the source state.
   */
  static mergeState(targetState: SurfaceState, sourceState: SurfaceState) {
    targetState.dx = sourceState.dx
    targetState.dy = sourceState.dy

    if (sourceState.inputPixmanRegion) {
      Region.copyTo(targetState.inputPixmanRegion, sourceState.inputPixmanRegion)
    }
    if (sourceState.opaquePixmanRegion) {
      Region.copyTo(targetState.opaquePixmanRegion, sourceState.opaquePixmanRegion)
    }
    targetState.bufferDamageRects = sourceState.bufferDamageRects.slice()

    targetState.bufferTransform = sourceState.bufferTransform
    targetState.bufferScale = sourceState.bufferScale

    targetState.bufferResource = sourceState.bufferResource
    targetState.bufferContents = sourceState.bufferContents
    targetState.frameCallbacks = targetState.frameCallbacks.concat(sourceState.frameCallbacks)
  }

  private _captureState(resource: WlSurfaceResource, bufferResource: WlBufferResource | undefined, bufferContents: BufferContents<any> | undefined): SurfaceState | undefined {
    if ((this._pendingBufferScale ?? 1) < 1) {
      resource.postError(WlSurfaceError.invalidScale, 'Buffer scale value is invalid.')
      console.log('[client-protocol-error] - Buffer scale value is invalid.')
      return undefined
    }

    if (!(this._pendingBufferTransform in WlOutputTransform)) {
      resource.postError(WlSurfaceError.invalidTransform, 'Buffer transform value is invalid.')
      console.log('[client-protocol-error] - Buffer transform value is invalid.')
      return undefined
    }

    const newState = createSurfaceState(
      this._pendingDamageRects.map(rect => this.bufferTransformation.timesRect(rect)).concat(this._pendingBufferDamageRects),
      this._pendingOpaqueRegion,
      this._pendingInputRegion,
      this._pendingDx ?? 0,
      this._pendingDy ?? 0,
      this._pendingBufferTransform ?? 1,
      this._pendingBufferScale ?? 1,
      this._pendingFrameCallbacks,
      bufferResource,
      bufferContents
    )
    this._pendingFrameCallbacks = []
    this._pendingInputRegion = 0
    this._pendingOpaqueRegion = 0
    this._pendingDamageRects = []
    this._pendingBufferDamageRects = []

    newState.roleState = this.role?.captureRoleState?.()

    return newState
  }

  setBufferTransform(resource: WlSurfaceResource, transform: number) {
    this._pendingBufferTransform = transform
  }

  setBufferScale(resource: WlSurfaceResource, scale: number) {
    this._pendingBufferScale = scale
  }

  damageBuffer(resource: WlSurfaceResource, x: number, y: number, width: number, height: number) {
    this._pendingBufferDamageRects.push(Rect.create(x, y, x + width, y + height))
  }
}

export default Surface
