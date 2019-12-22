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

import { WlSubsurfaceRequests, WlSubsurfaceResource } from 'westfield-runtime-server'

import Point from './math/Point'
import Surface from './Surface'

/**
 *
 *            An additional interface to a wl_surface object, which has been
 *            made a sub-surface. A sub-surface has one parent surface. A
 *            sub-surface's size and position are not limited to that of the parent.
 *            Particularly, a sub-surface is not automatically clipped to its
 *            parent's area.
 *
 *            A sub-surface becomes mapped, when a non-NULL wl_buffer is applied
 *            and the parent surface is mapped. The order of which one happens
 *            first is irrelevant. A sub-surface is hidden if the parent becomes
 *            hidden, or if a NULL wl_buffer is applied. These rules apply
 *            recursively through the tree of surfaces.
 *
 *            The behaviour of a wl_surface.commit request on a sub-surface
 *            depends on the sub-surface's mode. The possible modes are
 *            synchronized and desynchronized, see methods
 *            wl_subsurface.set_sync and wl_subsurface.set_desync. Synchronized
 *            mode caches the wl_surface state to be applied when the parent's
 *            state gets applied, and desynchronized mode applies the pending
 *            wl_surface state directly. A sub-surface is initially in the
 *            synchronized mode.
 *
 *            Sub-surfaces have also other kind of state, which is managed by
 *            wl_subsurface requests, as opposed to wl_surface requests. This
 *            state includes the sub-surface position relative to the parent
 *            surface (wl_subsurface.set_position), and the stacking order of
 *            the parent and its sub-surfaces (wl_subsurface.place_above and
 *            .place_below). This state is applied when the parent surface's
 *            wl_surface state is applied, regardless of the sub-surface's mode.
 *            As the exception, set_sync and set_desync are effective immediately.
 *
 *            The main surface can be thought to be always in desynchronized mode,
 *            since it does not have a parent in the sub-surfaces sense.
 *
 *            Even if a sub-surface is in desynchronized mode, it will behave as
 *            in synchronized mode, if its parent surface behaves as in
 *            synchronized mode. This rule is applied recursively throughout the
 *            tree of surfaces. This means, that one can set a sub-surface into
 *            synchronized mode, and then assume that all its child and grand-child
 *            sub-surfaces are synchronized, too, without explicitly setting them.
 *
 *            If the wl_surface associated with the wl_subsurface is destroyed, the
 *            wl_subsurface object becomes inert. Note, that destroying either object
 *            takes effect immediately. If you need to synchronize the removal
 *            of a sub-surface to the parent surface update, unmap the sub-surface
 *            first by attaching a NULL wl_buffer, update parent, and then destroy
 *            the sub-surface.
 *
 *            If the parent wl_surface object is destroyed, the sub-surface is
 *            unmapped.
 *
 * @implements SurfaceRole
 * @implements WlSubsurfaceRequests
 */
export default class Subsurface extends WlSubsurfaceRequests {
  /**
   * @param {WlSurfaceResource}parentWlSurfaceResource
   * @param {WlSurfaceResource}wlSurfaceResource
   * @param {WlSubsurfaceResource}wlSubsurfaceResource
   * @return {Subsurface}
   */
  static create (parentWlSurfaceResource, wlSurfaceResource, wlSubsurfaceResource) {
    const subsurface = new Subsurface(parentWlSurfaceResource, wlSurfaceResource, wlSubsurfaceResource)
    wlSubsurfaceResource.implementation = subsurface

    wlSurfaceResource.onDestroy().then(() => {
      subsurface._inert = true
    })

    parentWlSurfaceResource.onDestroy().then(() => {
      // TODO unmap
    })

    // TODO sync viewable/hidden state with parent

    wlSurfaceResource.implementation.role = subsurface

    return subsurface
  }

  /**
   * Use Subsurface.create(..) instead.
   * @param {WlSurfaceResource}parentWlSurfaceResource
   * @param {WlSurfaceResource}wlSurfaceResource
   * @param {WlSubsurfaceResource}wlSubsurfaceResource
   * @private
   */
  constructor (parentWlSurfaceResource, wlSurfaceResource, wlSubsurfaceResource) {
    super()
    /**
     * @type {WlSurfaceResource}
     */
    this.parentWlSurfaceResource = parentWlSurfaceResource
    /**
     * @type {WlSurfaceResource}
     */
    this.wlSurfaceResource = wlSurfaceResource
    /**
     * @type {WlSubsurfaceResource}
     */
    this.resource = wlSubsurfaceResource
    /**
     * @type {boolean}
     * @private
     */
    this._sync = true
    /**
     * @type {Point}
     */
    this.pendingPosition = Point.create(0, 0)
    /**
     * @type {SurfaceState}
     */
    this._cachedState = wlSurfaceResource.implementation.state
    /**
     * @type {boolean}
     * @private
     */
    this._inert = false
  }

  /**
   * @param {Surface}parentSurface
   * @param {RenderFrame}renderFrame
   */
  async onParentCommit (parentSurface, renderFrame) {
    if (this._inert) {
      return
    }

    const surface = /** @type {Surface} */this.wlSurfaceResource.implementation
    // sibling stacking order & position is committed by the parent itself so no need to do it here.

    if (this._effectiveSync && this._cachedState) {
      await surface.render(renderFrame, this._cachedState, false)
    }
  }

  /**
   * @param {Surface}surface
   * @param {SurfaceState}newState
   * @return {Promise<void>}
   * @override
   */
  async onCommit (surface, newState) {
    if (this._inert) {
      return
    }

    if (this._effectiveSync) {
      if (!this._cachedState) {
        this._cachedState = surface.state
      }
      Surface.mergeState(this._cachedState, newState)
    } else {
      let renderState = newState
      if (this._cachedState) {
        Surface.mergeState(this._cachedState, newState)
        renderState = this._cachedState
        // TODO if we throw away cached state, we need to free the pixman regions in it
        this._cachedState = null
      }
      await surface.render(surface.renderFrame, renderState)
    }
  }

  /**
   *
   *                The sub-surface interface is removed from the wl_surface object
   *                that was turned into a sub-surface with a
   *                wl_subcompositor.get_subsurface request. The wl_surface's association
   *                to the parent is deleted, and the wl_surface loses its role as
   *                a sub-surface. The wl_surface is unmapped.
   *
   *
   * @param {WlSubsurfaceResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    resource.destroy()
  }

  /**
   *
   *                This schedules a sub-surface position change.
   *                The sub-surface will be moved so that its origin (top left
   *                corner pixel) will be at the location x, y of the parent surface
   *                coordinate system. The coordinates are not restricted to the parent
   *                surface area. Negative values are allowed.
   *
   *                The scheduled coordinates will take effect whenever the state of the
   *                parent surface is applied. When this happens depends on whether the
   *                parent surface is in synchronized mode or not. See
   *                wl_subsurface.set_sync and wl_subsurface.set_desync for details.
   *
   *                If more than one set_position request is invoked by the client before
   *                the commit of the parent surface, the position of a new request always
   *                replaces the scheduled position from any previous request.
   *
   *                The initial position is 0, 0.
   *
   *
   * @param {WlSubsurfaceResource} resource
   * @param {Number} x x coordinate in the parent surface
   * @param {Number} y y coordinate in the parent surface
   *
   * @since 1
   * @override
   */
  setPosition (resource, x, y) {
    if (this._inert) {
      return
    }

    this.pendingPosition = Point.create(x, y)
  }

  /**
   *
   *                This sub-surface is taken from the stack, and put back just
   *                above the reference surface, changing the z-order of the sub-surfaces.
   *                The reference surface must be one of the sibling surfaces, or the
   *                parent surface. Using any other surface, including this sub-surface,
   *                will cause a protocol error.
   *
   *                The z-order is double-buffered. Requests are handled in order and
   *                applied immediately to a pending state. The final pending state is
   *                copied to the active state the next time the state of the parent
   *                surface is applied. When this happens depends on whether the parent
   *                surface is in synchronized mode or not. See wl_subsurface.set_sync and
   *                wl_subsurface.set_desync for details.
   *
   *                A new sub-surface is initially added as the top-most in the stack
   *                of its siblings and parent.
   *
   *
   * @param {WlSubsurfaceResource} resource
   * @param {WlSurfaceResource} sibling the reference surface
   *
   * @since 1
   * @override
   */
  placeAbove (resource, sibling) {
    const parentSurface = /** @type {Surface} */ this.parentWlSurfaceResource.implementation
    const siblingSurface = /** @type {Surface} */ sibling.implementation
    const siblingSurfaceChildSelf = siblingSurface.surfaceChildSelf
    if (!parentSurface.subsurfaceChildren.includes(siblingSurfaceChildSelf) ||
      siblingSurface === parentSurface) {
      resource.postError(WlSubsurfaceResource.Error.badSurface, 'Surface is not a sibling or the parent.')
      window.GREENFIELD_DEBUG && console.log('[client-protocol-error] - Surface is not a sibling or the parent.')
      return
    }

    if (this._inert) {
      return
    }

    const surface = /** @type {Surface} */this.wlSurfaceResource.implementation

    const currentIdx = parentSurface.pendingSubsurfaceChildren.indexOf(surface.surfaceChildSelf)
    parentSurface.pendingSubsurfaceChildren.splice(currentIdx, 1)

    const siblingIdx = parentSurface.pendingSubsurfaceChildren.indexOf(siblingSurfaceChildSelf)
    const newIdx = siblingIdx + 1
    parentSurface.pendingSubsurfaceChildren.splice(newIdx, 0, surface.surfaceChildSelf)
  }

  /**
   *
   *                The sub-surface is placed just below the reference surface.
   *                See wl_subsurface.place_above.
   *
   *
   * @param {WlSubsurfaceResource} resource
   * @param {WlSurfaceResource} sibling the reference surface
   *
   * @since 1
   * @override
   */
  placeBelow (resource, sibling) {
    if (this._inert) {
      return
    }

    const parentSurface = /** @type {Surface} */this.parentWlSurfaceResource.implementation
    const surface = /** @type {Surface} */this.wlSurfaceResource.implementation

    const currentIdx = parentSurface.pendingSubsurfaceChildren.indexOf(surface.surfaceChildSelf)
    parentSurface.pendingSubsurfaceChildren.splice(currentIdx, 1)

    const siblingSurface = /** @type {Surface} */ sibling.implementation
    const newIdx = parentSurface.pendingSubsurfaceChildren.indexOf(siblingSurface.surfaceChildSelf)
    parentSurface.pendingSubsurfaceChildren.splice(newIdx, 0, surface.surfaceChildSelf)
  }

  /**
   * @return {boolean}
   * @private
   */
  get _effectiveSync () {
    return this._sync || this._parentEffectiveSync
  }

  /**
   * @return {boolean}
   * @private
   */
  get _parentEffectiveSync () {
    let parentEffectiveSync = false

    const parentSurface = /** @type {Surface} */this.parentWlSurfaceResource.implementation
    const parentRole = parentSurface.role
    if (parentRole && parentRole instanceof Subsurface) {
      parentEffectiveSync = parentRole._effectiveSync
    }

    return parentEffectiveSync
  }

  /**
   *
   *                Change the commit behaviour of the sub-surface to synchronized
   *                mode, also described as the parent dependent mode.
   *
   *                In synchronized mode, wl_surface.commit on a sub-surface will
   *                accumulate the committed state in a cache, but the state will
   *                not be applied and hence will not change the compositor output.
   *                The cached state is applied to the sub-surface immediately after
   *                the parent surface's state is applied. This ensures atomic
   *                updates of the parent and all its synchronized sub-surfaces.
   *                Applying the cached state will invalidate the cache, so further
   *                parent surface commits do not (re-)apply old state.
   *
   *                See wl_subsurface for the recursive effect of this mode.
   *
   *
   * @param {WlSubsurfaceResource} resource
   *
   * @since 1
   * @override
   */
  setSync (resource) {
    if (this._inert) {
      return
    }

    this._sync = true
  }

  /**
   *
   *                Change the commit behaviour of the sub-surface to desynchronized
   *                mode, also described as independent or freely running mode.
   *
   *                In desynchronized mode, wl_surface.commit on a sub-surface will
   *                apply the pending state directly, without caching, as happens
   *                normally with a wl_surface. Calling wl_surface.commit on the
   *                parent surface has no effect on the sub-surface's wl_surface
   *                state. This mode allows a sub-surface to be updated on its own.
   *
   *                If cached state exists when wl_surface.commit is called in
   *                desynchronized mode, the pending state is added to the cached
   *                state, and applied as a whole. This invalidates the cache.
   *
   *                Note: even if a sub-surface is set to desynchronized, a parent
   *                sub-surface may override it to behave as synchronized. For details,
   *                see wl_subsurface.
   *
   *                If a surface's parent surface behaves as desynchronized, then
   *                the cached state is applied on set_desync.
   *
   *
   * @param {WlSubsurfaceResource} resource
   *
   * @since 1
   * @override
   */
  async setDesync (resource) {
    if (this._inert) {
      return
    }

    this._sync = false
  }

  /**
   * @override
   */
  captureRoleState () {}

  /**
   * @param roleState
   * @override
   */
  setRoleState (roleState) {}
}
