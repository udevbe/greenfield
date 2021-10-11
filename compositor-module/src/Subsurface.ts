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
  WlSubsurfaceError,
  WlSubsurfaceRequests,
  WlSubsurfaceResource,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import BufferImplementation from './BufferImplementation'

import { Point } from './math/Point'
import { createPixmanRegion } from './Region'
import Session from './Session'
import Surface, { mergeSurfaceState, SurfaceState } from './Surface'
import SurfaceRole from './SurfaceRole'
import View from './View'

export default class Subsurface implements WlSubsurfaceRequests, SurfaceRole {
  static create(
    session: Session,
    parentWlSurfaceResource: WlSurfaceResource,
    wlSurfaceResource: WlSurfaceResource,
    wlSubsurfaceResource: WlSubsurfaceResource,
  ): Subsurface {
    const surface = wlSurfaceResource.implementation as Surface
    const parent = parentWlSurfaceResource.implementation as Surface

    const view = View.create(wlSurfaceResource.implementation as Surface)
    const subsurface = new Subsurface(session, parent, surface, wlSubsurfaceResource, view)
    wlSubsurfaceResource.implementation = subsurface

    wlSurfaceResource.onDestroy().then(() => {
      subsurface.inert = true
    })

    parentWlSurfaceResource.onDestroy().then(() => {
      // TODO unmap
    })

    // TODO sync viewable/hidden state with parent
    ;(wlSurfaceResource.implementation as Surface).role = subsurface

    return subsurface
  }

  pendingPosition?: Point = { x: 0, y: 0 }
  private sync = true
  private cacheDirty = false
  private readonly cachedState: SurfaceState = {
    damageRects: [],
    bufferDamageRects: [],
    bufferScale: 1,
    bufferTransform: 0,
    dx: 0,
    dy: 0,
    inputPixmanRegion: createPixmanRegion(),
    opaquePixmanRegion: createPixmanRegion(),
    subsurfaceChildren: [],
    frameCallbacks: [],
    bufferResourceDestroyListener: () => {
      this.cachedState.buffer = undefined
      // this.cachedState.bufferContents = undefined
    },
  }
  private inert = false

  private constructor(
    private readonly session: Session,
    public readonly parent: Surface,
    public readonly surface: Surface,
    public readonly resource: WlSubsurfaceResource,
    public readonly view: View,
  ) {
    mergeSurfaceState(this.cachedState, surface.state)
  }

  private commitCache(surface: Surface) {
    mergeSurfaceState(surface.pendingState, this.cachedState)
    this.cachedState.damageRects = []
    this.cachedState.bufferDamageRects = []
    this.cachedState.frameCallbacks = []
    this.cacheDirty = false
    surface.commitPending()
    this.session.renderer.render()
  }

  onParentCommit(): void {
    if (this.inert) {
      return
    }
    // sibling stacking order & position is committed by the parent itself so no need to do it here.
    if (this.effectiveSync && this.cacheDirty) {
      this.commitCache(this.surface)
    }
    // render triggered by parent.
  }

  private commitPendingToCache(surface: Surface) {
    const { dx, dy } = this.cachedState

    if (this.cacheDirty && this.cachedState.buffer && this.cachedState.buffer?.id !== surface.pendingState.buffer?.id) {
      const bufferImplementation = this.cachedState.buffer.implementation as BufferImplementation<any>
      if (!bufferImplementation.released) {
        bufferImplementation.release()
      }
    }
    mergeSurfaceState(this.cachedState, surface.pendingState)
    if (this.cachedState.buffer) {
      const bufferImplementation = this.cachedState.buffer.implementation as BufferImplementation<any>
      bufferImplementation.released = false
    }

    surface.pendingState.damageRects = []
    surface.pendingState.bufferDamageRects = []
    surface.pendingState.frameCallbacks = []
    this.cachedState.dx = dx + surface.pendingState.dx
    this.cachedState.dy = dy + surface.pendingState.dy
    this.cacheDirty = true
  }

  onCommit(surface: Surface): void {
    if (this.inert) {
      return
    }

    if (this.effectiveSync) {
      this.commitPendingToCache(surface)
    } else if (this.cacheDirty) {
      this.commitPendingToCache(surface)
      this.commitCache(surface)
    } else {
      surface.commitPending()
      this.session.renderer.render()
    }
  }

  destroy(resource: WlSubsurfaceResource): void {
    resource.destroy()
  }

  setPosition(resource: WlSubsurfaceResource, x: number, y: number): void {
    if (this.inert) {
      return
    }

    this.pendingPosition = { x, y }
  }

  placeAbove(resource: WlSubsurfaceResource, sibling: WlSurfaceResource): void {
    const siblingSurface = sibling.implementation as Surface
    const siblingSurfaceChildSelf = siblingSurface.surfaceChildSelf
    if (!this.parent.state.subsurfaceChildren.includes(siblingSurfaceChildSelf) || siblingSurface === this.parent) {
      resource.postError(WlSubsurfaceError.badSurface, 'Surface is not a sibling or the parent.')
      this.session.logger.warn('[client-protocol-error] - Surface is not a sibling or the parent.')
      return
    }

    if (this.inert) {
      return
    }

    const currentIdx = this.parent.pendingState.subsurfaceChildren.indexOf(this.surface.surfaceChildSelf)
    this.parent.pendingState.subsurfaceChildren.splice(currentIdx, 1)

    const siblingIdx = this.parent.pendingState.subsurfaceChildren.indexOf(siblingSurfaceChildSelf)
    const newIdx = siblingIdx + 1
    this.parent.pendingState.subsurfaceChildren.splice(newIdx, 0, this.surface.surfaceChildSelf)
  }

  placeBelow(resource: WlSubsurfaceResource, sibling: WlSurfaceResource): void {
    if (this.inert) {
      return
    }

    const currentIdx = this.parent.pendingState.subsurfaceChildren.indexOf(this.surface.surfaceChildSelf)
    this.parent.pendingState.subsurfaceChildren.splice(currentIdx, 1)

    const siblingSurface = sibling.implementation as Surface
    const newIdx = this.parent.pendingState.subsurfaceChildren.indexOf(siblingSurface.surfaceChildSelf)
    this.parent.pendingState.subsurfaceChildren.splice(newIdx, 0, this.surface.surfaceChildSelf)
  }

  private get effectiveSync(): boolean {
    return this.sync || this.parentEffectiveSync
  }

  private get parentEffectiveSync(): boolean {
    let parentEffectiveSync = false

    const parentRole = this.parent.role
    if (parentRole && parentRole instanceof Subsurface) {
      parentEffectiveSync = parentRole.effectiveSync
    }

    return parentEffectiveSync
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSync(resource: WlSubsurfaceResource): void {
    if (this.inert) {
      return
    }

    this.sync = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDesync(resource: WlSubsurfaceResource): void {
    if (this.inert) {
      return
    }

    this.sync = false
    this.onCommit(this.surface)
  }
}
