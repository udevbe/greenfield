'use strict'
import WlSurfaceRequests from './protocol/WlSurfaceRequests'
import WlCallbackResource from './protocol/WlCallbackResource'
import WlSurfaceResource from './protocol/WlSurfaceResource'
import WlOutputResource from './protocol/WlOutputResource'

import View from './View'
import Callback from './Callback'
import Rect from './math/Rect'
import Mat4 from './math/Mat4'
import {
  NORMAL,
  _90,
  _180,
  _270,
  FLIPPED,
  FLIPPED_90,
  FLIPPED_180,
  FLIPPED_270
} from './math/Transformations'
import Size from './Size'
import Region from './Region'
import SurfaceChild from './SurfaceChild'
import Renderer from './render/Renderer'
import Point from './math/Point'
import SurfaceState from './SurfaceState'

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
 * @implements WlSurfaceRequests
 */
export default class Surface extends WlSurfaceRequests {
  /**
   * @param {!WlSurfaceResource} wlSurfaceResource
   * @param {!Renderer} renderer
   * @param {!Seat} seat
   * @param {!Session} session
   * @returns {!Surface}
   */
  static create (wlSurfaceResource, renderer, seat, session) {
    const bufferDamage = Region.createPixmanRegion()
    const opaquePixmanRegion = Region.createPixmanRegion()
    const inputPixmanRegion = Region.createPixmanRegion()
    const surfacePixmanRegion = Region.createPixmanRegion()

    Region.initInfinite(bufferDamage)
    Region.initInfinite(opaquePixmanRegion)
    Region.initInfinite(inputPixmanRegion)

    const surface = new Surface(wlSurfaceResource, renderer, seat, session, bufferDamage, opaquePixmanRegion, inputPixmanRegion, surfacePixmanRegion)
    wlSurfaceResource.implementation = surface
    wlSurfaceResource.onDestroy().then(() => {
      Region.destroyPixmanRegion(bufferDamage)
      Region.destroyPixmanRegion(opaquePixmanRegion)
      Region.destroyPixmanRegion(inputPixmanRegion)
      Region.destroyPixmanRegion(surfacePixmanRegion)
      surface._handleDestruction()
    })

    return surface
  }

  /**
   * Use Surface.create(wlSurfaceResource) instead.
   * @private
   * @param {!WlSurfaceResource} wlSurfaceResource
   * @param {!Renderer} renderer
   * @param {!Seat} seat
   * @param {!Session} session
   * @param {!number} bufferDamage
   * @param {!number} opaquePixmanRegion
   * @param {!number} inputPixmanRegion
   * @param {!number} surfacePixmanRegion
   */
  constructor (wlSurfaceResource, renderer, seat, session, bufferDamage, opaquePixmanRegion, inputPixmanRegion, surfacePixmanRegion) {
    super()
    /**
     * @type {!WlSurfaceResource}
     * @const
     */
    this.resource = wlSurfaceResource
    /**
     * @type {boolean}
     */
    this.destroyed = false
    /**
     * @type {!Renderer}
     * @const
     */
    this.renderer = renderer
    /**
     * @type {?RenderState}
     */
    this.renderState = null
    /**
     * @type {SurfaceState}
     */
    this.state = SurfaceState.create(
      null,
      null,
      [],
      opaquePixmanRegion,
      inputPixmanRegion,
      0,
      0,
      0,
      1,
      [],
      {}
    )
    /**
     * @type {?WlBufferResource}
     */
    this.pendingWlBuffer = null
    /**
     * @type {!function}
     */
    this.pendingBufferDestroyListener = () => {
      this.pendingWlBuffer = null
    }
    /**
     * @type {!Array<Rect>}
     * @private
     */
    this._pendingDamageRects = []
    /**
     * @type {!Array<Rect>}
     * @private
     */
    this._pendingBufferDamageRects = []
    /**
     * @type {!number}
     * @private
     */
    this._pendingOpaqueRegion = 0
    /**
     * @type {!number}
     * @private
     */
    this._pendingInputRegion = 0
    /**
     * @type {!number}
     * @private
     */
    this._pendingDx = 0
    /**
     * @type {!number}
     * @private
     */
    this._pendingDy = 0
    /**
     * @type {!number}
     * @private
     */
    this._pendingBufferTransform = 0
    /**
     * @type {!number}
     * @private
     */
    this._pendingBufferScale = 1
    /**
     * @type {!Array<View>}
     */
    this.views = []
    /**
     * @type {!Seat}
     * @const
     */
    this.seat = seat
    /**
     * @type {!Session}
     * @const
     */
    this.session = session
    /**
     * @type {!boolean}
     */
    this.hasKeyboardInput = true
    /**
     * @type {!boolean}
     */
    this.hasPointerInput = true
    /**
     * @type {!boolean}
     */
    this.hasTouchInput = true
    /**
     * @type {?SurfaceRole}
     */
    this.role = null
    /**
     * @type {!SurfaceChild}
     * @const
     */
    this.surfaceChildSelf = SurfaceChild.create(this)
    /**
     * All child surfaces + this surface. This allows for child surfaces to be displayed
     * below it's parent, as the order of this list determines the zOrder between parent & children.
     * @type {!Array<SurfaceChild>}
     */
    this._surfaceChildren = []
    /**
     * @type {!Array<SurfaceChild>}
     */
    this.subsurfaceChildren = [this.surfaceChildSelf]
    /**
     * @type {!Array<SurfaceChild>}
     */
    this.pendingSubsurfaceChildren = [this.surfaceChildSelf]
    /**
     * @type {!Array<Callback>}
     * @private
     */
    this._pendingFrameCallbacks = []

    // derived states below ->
    /**
     * buffer2surface
     * @type {!Mat4}
     */
    this.inverseBufferTransformation = Mat4.IDENTITY()
    /**
     * surface2buffer
     * @type {!Mat4}
     */
    this.bufferTransformation = Mat4.IDENTITY()
    /**
     * A pixman region in surface coordinates, representing the entire surface.
     * @type {!number}
     */
    this.pixmanRegion = surfacePixmanRegion
    /**
     * @type {!Size}
     */
    this.size = Size.create(0, 0)
    // <- derived states above
  }

  /**
   * @return {Array<SurfaceChild>}
   */
  get children () {
    return this.subsurfaceChildren.concat(this._surfaceChildren)
  }

  /**
   * @param {Point}surfacePoint
   * @return boolean
   */
  isWithinInputRegion (surfacePoint) {
    const withinInput = Region.contains(this.state.inputPixmanRegion, surfacePoint)
    const withinSurface = Region.contains(this.pixmanRegion, surfacePoint)
    return withinSurface && withinInput
  }

  /**
   * @param {number}newBufferTransform
   * @param {Mat4}bufferTransformation
   * @private
   */
  _applyBufferTransformWithPositionCorrection (newBufferTransform, bufferTransformation) {
    switch (newBufferTransform) {
      case 3: // 270
      case 4: { // flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(this.size.w, 0).invert())
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 2: // 180
      case 5: { // 90 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(this.size.w, this.size.h).invert())
        this.inverseBufferTransformation = this.bufferTransformation.invert()
        break
      }
      case 1: // 90
      case 6: { // 180 flipped
        this.bufferTransformation = bufferTransformation.timesMat4(Mat4.translation(0, this.size.h).invert())
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

  /**
   * @param {SurfaceState}newState
   * @private
   */
  _updateDerivedState (newState) {
    const oldBufferSize = this.state.bufferContents ? this.state.bufferContents.size : Size.create(0, 0)
    const newBufferSize = newState.bufferContents ? newState.bufferContents.size : Size.create(0, 0)

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

  updateChildViewsZIndexes () {
    let parentPosition = this.children.indexOf(this.surfaceChildSelf)
    this.views.forEach(view => {
      const parentViewZIndex = view.zIndex
      // Children can be displayed below their parent, therefor we have to subtract the parent position from it's zIndex
      // to get the starting zIndexOffset
      const zIndexOffset = parentViewZIndex - parentPosition
      this._updateZIndex(view, zIndexOffset)
    })
  }

  /**
   * @param {View}parentView
   * @param {number}zIndexOffset
   * @return {number}
   * @private
   */
  _updateZIndex (parentView, zIndexOffset) {
    let newZIndex = 0
    let newZIndexOffset = zIndexOffset
    this.children.forEach((surfaceChild, index) => {
      newZIndex = newZIndexOffset + index
      if (surfaceChild.surface === this) {
        parentView.zIndex = newZIndex
      } else {
        const childView = surfaceChild.surface.views.find(view => {
          return view.parent === parentView
        })
        if (childView) {
          newZIndexOffset = surfaceChild.surface._updateZIndex(childView, newZIndex)
        }
      }
    })
    return newZIndex
  }

  /**
   * @param {View}view
   */
  onViewCreated (view) {}

  /**
   * @return {View}
   */
  createView () {
    const bufferSize = this.state.bufferContents ? this.state.bufferContents.size : Size.create(0, 0)
    const view = View.create(this, bufferSize.w, bufferSize.h)
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

    this.children.forEach(surfaceChild => {
      this._ensureChildView(surfaceChild, view)
    })

    this.updateChildViewsZIndexes()
    this.onViewCreated(view)

    return view
  }

  /**
   * @param {SurfaceChild}surfaceChild
   * @param {View}view
   * @return {?View}
   * @private
   */
  _ensureChildView (surfaceChild, view) {
    if (surfaceChild.surface === this) {
      return null
    }

    const childView = surfaceChild.surface.createView()
    const zIndexOrder = this.children.indexOf(surfaceChild)
    childView.zIndex = view.zIndex + zIndexOrder
    childView.parent = view

    return childView
  }

  /**
   * Returns all newly created child views
   * @param {SurfaceChild}surfaceChild
   * @return {Array<View>}
   */
  addSubsurface (surfaceChild) {
    const childViews = this._addChild(surfaceChild, this.subsurfaceChildren)
    this.pendingSubsurfaceChildren.push(surfaceChild)

    surfaceChild.surface.resource.onDestroy().then(() => {
      this.removeSubsurface(surfaceChild)
    })

    return childViews
  }

  /**
   * @param {SurfaceChild}surfaceChild
   */
  removeSubsurface (surfaceChild) {
    this._removeChild(surfaceChild, this.subsurfaceChildren)
    this._removeChild(surfaceChild, this.pendingSubsurfaceChildren)
  }

  /**
   * Returns all newly created child views
   * @param {SurfaceChild}surfaceChild
   * @return {Array<View>}
   */
  addChild (surfaceChild) {
    return this._addChild(surfaceChild, this._surfaceChildren)
  }

  /**
   * @param {SurfaceChild}surfaceChild
   */
  addToplevelChild (surfaceChild) {
    this._surfaceChildren.push(surfaceChild)

    const primaryChildView = surfaceChild.surface.views.find((view) => view.primary)
    const primaryView = this.views.find((view) => view.primary)

    const zIndexOrder = this.children.indexOf(surfaceChild)
    primaryChildView.zIndex = primaryView.zIndex + zIndexOrder
    primaryChildView.parent = primaryView

    surfaceChild.surface.resource.onDestroy().then(() => {
      this.removeChild(surfaceChild)
    })
    this.updateChildViewsZIndexes()
  }

  /**
   * @param {SurfaceChild}surfaceChild
   */
  removeChild (surfaceChild) {
    this._removeChild(surfaceChild, this._surfaceChildren)
  }

  /**
   * @param {SurfaceChild}surfaceChild
   * @param {SurfaceChild[]}siblings
   * @return {Array<View>}
   * @private
   */
  _addChild (surfaceChild, siblings) {
    siblings.push(surfaceChild)

    const childViews = []
    this.views.forEach((view) => {
      const childView = this._ensureChildView(surfaceChild, view)
      if (childView) {
        childViews.push(childView)
      }
    })
    surfaceChild.surface.resource.onDestroy().then(() => {
      this.removeChild(surfaceChild)
    })
    this.updateChildViewsZIndexes()
    return childViews
  }

  /**
   * @param {SurfaceChild}surfaceChild
   * @param {Array<SurfaceChild>}siblings
   * @private
   */
  _removeChild (surfaceChild, siblings) {
    const index = siblings.indexOf(surfaceChild)
    if (index > -1) {
      siblings.splice(index, 1)
      this.updateChildViewsZIndexes()
    }
  }

  /**
   *
   * Deletes the surface and invalidates its object ID.
   *
   *
   * @param {WlSurfaceResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    // this._handleDestruction()
    this.destroyed = true
    resource.destroy()
    if (this.renderState) {
      this.renderState.destroy()
      this.renderState = null
    }
  }

  /**
   * @private
   */
  _handleDestruction () {
    this.views.forEach(view => {
      delete view.surface
      view.destroy()
    })
  }

  /**
   *
   *                Set a buffer as the content of this surface.
   *
   *                The new size of the surface is calculated based on the buffer
   *                size transformed by the inverse bufferTransform and the
   *                inverse bufferScale. This means that the supplied buffer
   *                must be an integer multiple of the bufferScale.
   *
   *                The x and y arguments specify the location of the new pending
   *                buffer's upper left corner, relative to the current buffer's upper
   *                left corner, in surface local coordinates. In other words, the
   *                x and y, combined with the new surface size define in which
   *                directions the surface's size changes.
   *
   *                Surface contents are double-buffered state, see WlSurface.commit.
   *
   *                The initial surface contents are void; there is no content.
   *                WlSurface.attach assigns the given WlBuffer as the pending
   *                WlBuffer. WlSurface.commit makes the pending WlBuffer the new
   *                surface contents, and the size of the surface becomes the size
   *                calculated from the WlBuffer, as described above. After commit,
   *                there is no pending buffer until the next attach.
   *
   *                Committing a pending WlBuffer allows the compositor to read the
   *                pixels in the WlBuffer. The compositor may access the pixels at
   *                any time after the WlSurface.commit request. It may take some
   *                time for the contents to arrive at the compositor if they have
   *                not been transferred already. The compositor will continue using
   *                old surface content and state until the new content has arrived.
   *                See also WlBuffer.complete.
   *
   *                If it is possible to re-use a WlBuffer or update its
   *                contents, the respective buffer factory shall define how that
   *                works.
   *
   *                Destroying the WlBuffer after WlBuffer.complete does not change
   *                the surface contents. However, if the client destroys the
   *                WlBuffer before receiving the WlBuffer.complete event, the surface
   *                contents become undefined immediately.
   *
   *                If WlSurface.attach is sent with a NULL WlBuffer, the
   *                following WlSurface.commit will remove the surface content.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {?WlBufferResource} buffer undefined
   * @param {number} x undefined
   * @param {number} y undefined
   *
   * @since 1
   * @override
   */
  attach (resource, buffer, x, y) {
    this._pendingDx = x
    this._pendingDy = y

    if (this.pendingWlBuffer) {
      this.pendingWlBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
    }

    this.pendingWlBuffer = buffer
    // buffer can be null
    if (this.pendingWlBuffer) {
      this.pendingWlBuffer.addDestroyListener(this.pendingBufferDestroyListener)
    }
  }

  /**
   *
   *                This request is used to describe the regions where the pending
   *                buffer is different from the current surface contents, and where
   *                the surface therefore needs to be repainted. The compositor
   *                ignores the parts of the damage that fall outside of the surface.
   *
   *                Damage is double-buffered state, see WlSurface.commit.
   *
   *                The damage rectangle is specified in surface local coordinates.
   *
   *                The initial value for pending damage is empty: no damage.
   *                WlSurface.damage adds pending damage: the new pending damage
   *                is the union of old pending damage and the given rectangle.
   *
   *                WlSurface.commit assigns pending damage as the current damage,
   *                and clears pending damage. The server will clear the current
   *                damage as it repaints the surface.
   *
   *                Alternatively, damage can be posted with WlSurface.damageBuffer
   *                which uses buffer co-ordinates instead of surface co-ordinates,
   *                and is probably the preferred and intuitive way of doing this.
   *
   *                The factory behind the the WlBuffer might imply full surface
   *                damage, overriding this request. This is common when the factory
   *                uses a video encoder, where regions outside the original changes
   *                may improve in quality.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {number} x undefined
   * @param {number} y undefined
   * @param {number} width undefined
   * @param {number} height undefined
   *
   * @since 1
   * @override
   */
  damage (resource, x, y, width, height) {
    this._pendingDamageRects.push(Rect.create(x, y, x + width, y + height))
  }

  /**
   *
   *                Request a notification when it is a good time start drawing a new
   *                frame, by creating a frame callback. This is useful for throttling
   *                redrawing operations, and driving animations.
   *
   *                When a client is animating on a WlSurface, it can use the 'frame'
   *                request to get notified when it is a good time to draw and commit the
   *                next frame of animation. If the client commits an update earlier than
   *                that, it is likely that some updates will not make it to the display,
   *                and the client is wasting resources by drawing too often.
   *
   *                The frame request will take effect on the next WlSurface.commit.
   *                The notification will only be posted for one frame unless
   *                requested again. For a WlSurface, the notifications are posted in
   *                the order the frame requests were committed.
   *
   *                The server must send the notifications so that a client
   *                will not send excessive updates, while still allowing
   *                the highest possible update rate for clients that wait for the reply
   *                before drawing again. The server should give some time for the client
   *                to draw and commit after sending the frame callback events to let them
   *                hit the next output refresh.
   *
   *                A server should avoid signalling the frame callbacks if the
   *                surface is not visible in any way, e.g. the surface is off-screen,
   *                or completely obscured by other opaque surfaces.
   *
   *                The object returned by this request will be destroyed by the
   *                compositor after the callback is fired and as such the client must not
   *                attempt to use it after that point.
   *
   *                The callbackData passed in the callback is the current time, in
   *                milliseconds, with an undefined base.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {number} callback id
   *
   *
   * @since 1
   * @override
   */
  frame (resource, callback) {
    this._pendingFrameCallbacks.push(Callback.create(new WlCallbackResource(resource.client, callback, 1)))
  }

  /**
   *
   *                This request sets the region of the surface that contains
   *                opaque content.
   *
   *                The opaque region is an optimization hint for the compositor
   *                that lets it optimize out redrawing of content behind opaque
   *                regions.  Setting an opaque region is not required for correct
   *                behaviour, but marking transparent content as opaque will result
   *                in repaint artifacts.
   *
   *                The opaque region is specified in surface local coordinates.
   *
   *                The compositor ignores the parts of the opaque region that fall
   *                outside of the surface.
   *
   *                Opaque region is double-buffered state, see WlSurface.commit.
   *
   *                WlSurface.setOpaqueRegion changes the pending opaque region.
   *                WlSurface.commit copies the pending region to the current region.
   *                Otherwise, the pending and current regions are never changed.
   *
   *                The initial value for opaque region is empty. Setting the pending
   *                opaque region has copy semantics, and the WlRegion object can be
   *                destroyed immediately. A NULL WlRegion causes the pending opaque
   *                region to be set to empty.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {?WlRegionResource} regionResource undefined
   *
   * @since 1
   * @override
   */
  setOpaqueRegion (resource, regionResource) {
    this._pendingOpaqueRegion = Region.createPixmanRegion()
    if (regionResource) {
      const region = /** @type Region */ regionResource.implementation
      Region.copyTo(this._pendingOpaqueRegion, region.pixmanRegion)
    } else {
      Region.initInfinite(this._pendingOpaqueRegion)
    }
  }

  /**
   *
   *                This request sets the region of the surface that can receive
   *                pointer and touch events.
   *
   *                Input events happening outside of this region will try the next
   *                surface in the server surface stack. The compositor ignores the
   *                parts of the input region that fall outside of the surface.
   *
   *                The input region is specified in surface local coordinates.
   *
   *                Input region is double-buffered state, see WlSurface.commit.
   *
   *                WlSurface.setInputRegion changes the pending input region.
   *                WlSurface.commit copies the pending region to the current region.
   *                Otherwise the pending and current regions are never changed,
   *                except cursor and icon surfaces are special cases, see
   *                WlPointer.setCursor and WlDataDevice.startDrag.
   *
   *                The initial value for input region is infinite. That means the
   *                whole surface will accept input. Setting the pending input region
   *                has copy semantics, and the WlRegion object can be destroyed
   *                immediately. A NULL WlRegion causes the input region to be set
   *                to infinite.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {?WlRegionResource} regionResource undefined
   *
   * @since 1
   * @override
   */
  setInputRegion (resource, regionResource) {
    this._pendingInputRegion = Region.createPixmanRegion()
    if (regionResource) {
      const region = /** @type Region */(regionResource.implementation)
      Region.copyTo(this._pendingInputRegion, region.pixmanRegion)
    } else {
      // 'infinite' region
      Region.initInfinite(this._pendingInputRegion)
    }
  }

  /**
   * @param {Point}bufferPoint
   * @return {Point}
   */
  toSurfaceSpace (bufferPoint) {
    return this.inverseBufferTransformation.timesPoint(bufferPoint)
  }

  /**
   *
   *                Surface state (input, opaque, and damage regions, attached buffers,
   *                etc.) is double-buffered. Protocol requests modify the pending
   *                state, as opposed to current state in use by the compositor. Commit
   *                request atomically applies all pending state, replacing the current
   *                state. After commit, the new pending state is as documented for each
   *                related request.
   *
   *                On commit, a pending WlBuffer is applied first, all other state
   *                second. This means that all coordinates in double-buffered state are
   *                relative to the new WlBuffer coming into use, except for
   *                WlSurface.attach itself. If there is no pending WlBuffer, the
   *                coordinates are relative to the current surface contents.
   *
   *                All requests that need a commit to become effective are documented
   *                to affect double-buffered state.
   *
   *                Other interfaces may add further double-buffered surface state.
   *
   *
   * @param {WlSurfaceResource} resource
   *
   * @param {number} serial serial number of the commit
   * @since 1
   * @override
   */
  async commit (resource, serial) {
    if (this.state.wlBuffer) {
      (/** @type{BufferImplementation} */this.state.wlBuffer.implementation).release()
    }
    let bufferContents = null

    if (this.pendingWlBuffer) {
      this.pendingWlBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
      const buffer = /** @type{BufferImplementation} */this.pendingWlBuffer.implementation
      bufferContents = await buffer.getContents(serial)
    }
    if (this.destroyed) {
      return
    }

    const newState = this._captureState(resource, bufferContents)

    if (newState && this.role && typeof this.role.onCommit === 'function') {
      const animationFrame = Renderer.createRenderFrame()
      await this.role.onCommit(this, animationFrame, newState)
      if (newState.inputPixmanRegion) {
        Region.destroyPixmanRegion(newState.inputPixmanRegion)
      }
      if (newState.opaquePixmanRegion) {
        Region.destroyPixmanRegion(newState.opaquePixmanRegion)
      }
    }
  }

  /**
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @param {boolean=}skipDraw
   */
  async render (renderFrame, newState, skipDraw) {
    if (skipDraw == null) {
      skipDraw = false
    }

    renderFrame.then((timestamp) => {
      this.state.frameCallbacks.forEach(frameCallback => frameCallback.done(timestamp & 0x7fffffff))
      this.state.frameCallbacks = []
    })

    if (this.subsurfaceChildren.length > 1) {
      this.subsurfaceChildren = this.pendingSubsurfaceChildren.slice()
      this.updateChildViewsZIndexes()

      this.subsurfaceChildren.forEach((surfaceChild) => {
        const siblingSurface = surfaceChild.surface
        if (siblingSurface !== this) {
          const siblingSubsurface = /** @type Subsurface */ siblingSurface.role
          // cascade scene update to subsurface children
          if (siblingSubsurface.pendingPosition) {
            surfaceChild.position = siblingSubsurface.pendingPosition
            siblingSubsurface.pendingPosition = null
          }
          siblingSubsurface.onParentCommit(this, renderFrame)
        }
      })
    }

    if (!skipDraw) {
      await this.renderer.render(this, newState)
    }
    const { w: oldWidth, h: oldHeight } = this.size
    this._updateDerivedState(newState)
    Surface.mergeState(this.state, newState)
    if (this.role && this.role.setRoleState) {
      this.role.setRoleState(newState.roleState)
    }

    if (newState.inputPixmanRegion || oldWidth !== this.size.w || oldHeight !== this.size.h) {
      this.views.forEach(view => {
        view.updateInputRegion()
      })
    }

    this.views.forEach(view => view.swapBuffers(renderFrame))
  }

  /**
   * This will invalidate the source state.
   * @param {SurfaceState}targetState
   * @param {SurfaceState}sourceState
   */
  static mergeState (targetState, sourceState) {
    targetState.wlBuffer = sourceState.wlBuffer
    targetState.dx = sourceState.dx
    targetState.dy = sourceState.dy

    Region.copyTo(targetState.inputPixmanRegion, sourceState.inputPixmanRegion)
    Region.copyTo(targetState.opaquePixmanRegion, sourceState.opaquePixmanRegion)
    targetState.bufferDamageRects = sourceState.bufferDamageRects.slice()

    targetState.bufferTransform = sourceState.bufferTransform
    targetState.bufferScale = sourceState.bufferScale

    targetState.bufferContents = sourceState.bufferContents
    targetState.frameCallbacks = targetState.frameCallbacks.concat(sourceState.frameCallbacks)
  }

  /**
   * @param {WlSurfaceResource} resource
   * @param {?BufferContents}bufferContents
   * @return {SurfaceState}
   * @private
   */
  _captureState (resource, bufferContents) {
    if (this._pendingBufferScale < 1) {
      resource.postError(WlSurfaceResource.Error.invalidScale, 'Buffer scale value is invalid.')
      DEBUG && console.log('[client-protocol-error] - Buffer scale value is invalid.')
      return null
    }

    if (!Object.values(WlOutputResource.Transform).includes(this._pendingBufferTransform)) {
      resource.postError(WlSurfaceResource.Error.invalidTransform, 'Buffer transform value is invalid.')
      DEBUG && console.log('[client-protocol-error] - Buffer transform value is invalid.')
      return null
    }

    const newState = SurfaceState.create(
      this.pendingWlBuffer,
      bufferContents,
      this._pendingDamageRects.map(rect => this.bufferTransformation.timesRect(rect)).concat(this._pendingBufferDamageRects),
      this._pendingOpaqueRegion,
      this._pendingInputRegion,
      this._pendingDx,
      this._pendingDy,
      this._pendingBufferTransform,
      this._pendingBufferScale,
      this._pendingFrameCallbacks,
      {}
    )
    this._pendingFrameCallbacks = []
    this._pendingInputRegion = 0
    this._pendingOpaqueRegion = 0
    this._pendingDamageRects = []
    this._pendingBufferDamageRects = []

    if (this.role && this.role.captureRoleState) {
      newState.roleState = this.role.captureRoleState()
    }

    return newState
  }

  /**
   *
   *                This request sets an optional transformation on how the compositor
   *                interprets the contents of the buffer attached to the surface. The
   *                accepted values for the transform parameter are the values for
   *                WlOutput.transform.
   *
   *                Buffer transform is double-buffered state, see WlSurface.commit.
   *
   *                A newly created surface has its buffer transformation set to normal.
   *
   *                WlSurface.setBufferTransform changes the pending buffer
   *                transformation. WlSurface.commit copies the pending buffer
   *                transformation to the current one. Otherwise, the pending and current
   *                values are never changed.
   *
   *                The purpose of this request is to allow clients to render content
   *                according to the output transform, thus permitting the compositor to
   *                use certain optimizations even if the display is rotated. Using
   *                hardware overlays and scanning out a client buffer for fullscreen
   *                surfaces are examples of such optimizations. Those optimizations are
   *                highly dependent on the compositor implementation, so the use of this
   *                request should be considered on a case-by-case basis.
   *
   *                Note that if the transform value includes 90 or 270 degree rotation,
   *                the width of the buffer will become the surface height and the height
   *                of the buffer will become the surface width.
   *
   *                If transform is not one of the values from the
   *                WlOutput.transform enum the invalidTransform protocol error
   *                is raised.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {number} transform undefined
   *
   * @since 2
   * @override
   */
  setBufferTransform (resource, transform) {
    this._pendingBufferTransform = transform
  }

  /**
   *
   *                This request sets an optional scaling factor on how the compositor
   *                interprets the contents of the buffer attached to the window.
   *
   *                Buffer scale is double-buffered state, see WlSurface.commit.
   *
   *                A newly created surface has its buffer scale set to 1.
   *
   *                WlSurface.setBufferScale changes the pending buffer scale.
   *                WlSurface.commit copies the pending buffer scale to the current one.
   *                Otherwise, the pending and current values are never changed.
   *
   *                The purpose of this request is to allow clients to supply higher
   *                resolution buffer data for use on high resolution outputs. Its
   *                intended that you pick the same  buffer scale as the scale of the
   *                output that the surface is displayed on.This means the compositor
   *                can avoid scaling when rendering the surface on that output.
   *
   *                Note that if the scale is larger than 1, then you have to attach
   *                a buffer that is larger (by a factor of scale in each dimension)
   *                than the desired surface size.
   *
   *                If scale is not positive the invalidScale protocol error is
   *                raised.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {number} scale undefined
   *
   * @since 3
   * @override
   */
  setBufferScale (resource, scale) {
    this._pendingBufferScale = scale
  }

  /**
   *
   *                This request is used to describe the regions where the pending
   *                buffer is different from the current surface contents, and where
   *                the surface therefore needs to be repainted. The compositor
   *                ignores the parts of the damage that fall outside of the surface.
   *
   *                Damage is double-buffered state, see WlSurface.commit.
   *
   *                The damage rectangle is specified in buffer coordinates.
   *
   *                The initial value for pending damage is empty: no damage.
   *                WlSurface.damageBuffer adds pending damage: the new pending
   *                damage is the union of old pending damage and the given rectangle.
   *
   *                WlSurface.commit assigns pending damage as the current damage,
   *                and clears pending damage. The server will clear the current
   *                damage as it repaints the surface.
   *
   *                This request differs from WlSurface.damage in only one way - it
   *                takes damage in buffer co-ordinates instead of surface local
   *                co-ordinates. While this generally is more intuitive than surface
   *                co-ordinates, it is especially desirable when using wpViewport
   *                or when a drawing library (like EGL) is unaware of buffer scale
   *                and buffer transform.
   *
   *                Note: Because buffer transformation changes and damage requests may
   *                be interleaved in the protocol stream, It is impossible to determine
   *                the actual mapping between surface and buffer damage until
   *                WlSurface.commit time. Therefore, compositors wishing to take both
   *                kinds of damage into account will have to accumulate damage from the
   *                two requests separately and only transform from one to the other
   *                after receiving the WlSurface.commit.
   *
   *
   * @param {WlSurfaceResource} resource
   * @param {number} x undefined
   * @param {number} y undefined
   * @param {number} width undefined
   * @param {number} height undefined
   *
   * @since 4
   * @override
   */
  damageBuffer (resource, x, y, width, height) {
    this._pendingBufferDamageRects.push(Rect.create(x, y, x + width, y + height))
  }
}
