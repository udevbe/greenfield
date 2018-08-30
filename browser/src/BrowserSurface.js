'use strict'

import { GrCallback, GrOutput, GrSurface } from './protocol/greenfield-browser-protocol'
import BrowserSurfaceView from './BrowserSurfaceView'
import BrowserCallback from './BrowserCallback'
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
import BrowserRegion from './BrowserRegion'
import BrowserSurfaceChild from './BrowserSurfaceChild'
import Renderer from './render/Renderer'
import BrowserRtcBufferFactory from './BrowserRtcBufferFactory'
import Point from './math/Point'

/**
 * @type {{transformation: Mat4, inverseTransformation:Mat4}[]}
 */
const bufferTransformations = [
  {transformation: NORMAL, inverseTransformation: NORMAL.invert()}, // 0
  {transformation: _90, inverseTransformation: _90.invert()}, // 1
  {transformation: _180, inverseTransformation: _180.invert()}, // 2
  {transformation: _270, inverseTransformation: _270.invert()}, // 3
  {transformation: FLIPPED, inverseTransformation: FLIPPED.invert()}, // 4
  {transformation: FLIPPED_90, inverseTransformation: FLIPPED_90.invert()}, // 5
  {transformation: FLIPPED_180, inverseTransformation: FLIPPED_180.invert()}, // 6
  {transformation: FLIPPED_270, inverseTransformation: FLIPPED_270.invert()} // 7
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
 *            purpose of a gr_surface. Examples of roles are a cursor for a
 *            pointer (as set by gr_pointer.set_cursor), a drag icon
 *            (gr_data_device.start_drag), a sub-surface
 *            (gr_subcompositor.get_subsurface), and a window as defined by a
 *            shell protocol (e.g. gr_shell.get_shell_surface).
 *
 *            A surface can have only one role at a time. Initially a
 *            gr_surface does not have a role. Once a gr_surface is given a
 *            role, it is set permanently for the whole lifetime of the
 *            gr_surface object. Giving the current role again is allowed,
 *            unless explicitly forbidden by the relevant interface
 *            specification.
 *
 *            Surface roles are given by requests in other interfaces such as
 *            gr_pointer.set_cursor. The request should explicitly mention
 *            that this request gives a role to a gr_surface. Often, this
 *            request also creates a new protocol object that represents the
 *            role and adds additional functionality to gr_surface. When a
 *            client wants to destroy a gr_surface, they must destroy this 'role
 *            object' before the gr_surface.
 *
 *            Destroying the role object does not remove the role from the
 *            gr_surface, but it may stop the gr_surface from "playing the role".
 *            For instance, if a gr_subsurface object is destroyed, the gr_surface
 *            it was created for will be unmapped and forget its position and
 *            z-order. It is allowed to create a gr_subsurface for the same
 *            gr_surface again, but it is not allowed to use the gr_surface as
 *            a cursor (cursor is a different role than sub-surface, and role
 *            switching is not allowed).
 *
 */
export default class BrowserSurface {
  /**
   * @param {!GrSurface} grSurfaceResource
   * @param {!Renderer} renderer
   * @param {!BrowserSeat} browserSeat
   * @param {!BrowserSession} browserSession
   * @returns {!BrowserSurface}
   */
  static create (grSurfaceResource, renderer, browserSeat, browserSession) {
    const bufferDamage = BrowserRegion.createPixmanRegion()
    const opaquePixmanRegion = BrowserRegion.createPixmanRegion()
    const inputPixmanRegion = BrowserRegion.createPixmanRegion()
    const surfacePixmanRegion = BrowserRegion.createPixmanRegion()

    BrowserRegion.initInfinite(bufferDamage)
    BrowserRegion.initInfinite(opaquePixmanRegion)
    BrowserRegion.initInfinite(inputPixmanRegion)

    const browserSurface = new BrowserSurface(grSurfaceResource, renderer, browserSeat, browserSession, bufferDamage, opaquePixmanRegion, inputPixmanRegion, surfacePixmanRegion)
    grSurfaceResource.implementation = browserSurface
    grSurfaceResource.onDestroy().then(() => {
      BrowserRegion.destroyPixmanRegion(bufferDamage)
      BrowserRegion.destroyPixmanRegion(opaquePixmanRegion)
      BrowserRegion.destroyPixmanRegion(inputPixmanRegion)
      BrowserRegion.destroyPixmanRegion(surfacePixmanRegion)
      browserSurface._handleDestruction()
    })

    return browserSurface
  }

  /**
   * Use BrowserSurface.create(grSurfaceResource) instead.
   * @private
   * @param {!GrSurface} grSurfaceResource
   * @param {!Renderer} renderer
   * @param {!BrowserSeat} browserSeat
   * @param {!BrowserSession} browserSession
   * @param {!number} bufferDamage
   * @param {!number} opaquePixmanRegion
   * @param {!number} inputPixmanRegion
   * @param {!number} surfacePixmanRegion
   */
  constructor (grSurfaceResource, renderer, browserSeat, browserSession, bufferDamage, opaquePixmanRegion, inputPixmanRegion, surfacePixmanRegion) {
    /**
     * @type {!GrSurface}
     * @const
     */
    this.resource = grSurfaceResource
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
     * @type {!{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: BrowserCallback[], roleState: *}}
     */
    this.state = {
      /**
       * @type {{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null}
       */
      bufferContents: null,
      /**
       * @type {Array<Rect>}
       */
      bufferDamageRects: [],
      /**
       * @type{number}
       */
      opaquePixmanRegion: opaquePixmanRegion,
      /**
       * @type{number}
       */
      inputPixmanRegion: inputPixmanRegion,
      /**
       * @type{number}
       */
      dx: 0,
      /**
       * @type{number}
       */
      dy: 0,
      /**
       * @type{number}
       */
      bufferTransform: 0,
      /**
       * @type{number}
       */
      bufferScale: 1,
      /**
       * @type {BrowserCallback[]}
       */
      frameCallbacks: [],
      /**
       * @type {*}
       */
      roleState: {}
    }
    /**
     * @type {?GrBuffer}
     */
    this.pendingGrBuffer = null
    /**
     * @type {!function}
     */
    this.pendingBrowserBufferDestroyListener = () => {
      this.pendingGrBuffer = null
    }
    /**
     * @type {!Array<Rect>}
     * @private
     */
    this._pendingDamageRects = []
    /**
     * @type {!Array<Number>}
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
     * @type {!Array<BrowserSurfaceView>}
     */
    this.browserSurfaceViews = []
    /**
     * @type {!BrowserSeat}
     * @const
     */
    this.browserSeat = browserSeat
    /**
     * @type {!BrowserSession}
     * @const
     */
    this.browserSession = browserSession
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
     * @type {?BrowserSurfaceRole}
     */
    this.role = null
    /**
     * @type {!BrowserSurfaceChild}
     * @const
     */
    this.browserSurfaceChildSelf = BrowserSurfaceChild.create(this)
    /**
     * All child surfaces of this BrowserSurface + this browser surface. This allows for child surfaces to be displayed
     * below it's parent, as the order of this list determines the zOrder between parent & children.
     * @type {!Array<BrowserSurfaceChild>}
     */
    this._browserSurfaceChildren = []
    /**
     * @type {!Array<BrowserSurfaceChild>}
     */
    this.browserSubsurfaceChildren = [this.browserSurfaceChildSelf]
    /**
     * @type {!Array<BrowserSurfaceChild>}
     */
    this.pendingBrowserSubsurfaceChildren = [this.browserSurfaceChildSelf]
    /**
     * @type {!Array<BrowserCallback>}
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

    this._count = 0
    this._total = 0
    this._start = 0
    this._bufferCompletionTotal = 0
    this._postRenderTotal = 0
    this._bufferSizeTotal = 0
  }

  /**
   * @return {Array<BrowserSurfaceChild>}
   */
  get browserSurfaceChildren () {
    return this.browserSubsurfaceChildren.concat(this._browserSurfaceChildren)
  }

  /**
   * @param {Point}surfacePoint
   * @return boolean
   */
  isWithinInputRegion (surfacePoint) {
    const withinInput = BrowserRegion.contains(this.state.inputPixmanRegion, surfacePoint)
    const withinSurface = BrowserRegion.contains(this.pixmanRegion, surfacePoint)
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
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
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
      BrowserRegion.fini(this.pixmanRegion)
      BrowserRegion.initRect(this.pixmanRegion, Rect.create(0, 0, this.size.w, this.size.h))

      this._applyBufferTransformWithPositionCorrection(newState.bufferTransform, bufferTransformation)
    }
  }

  updateChildViewsZIndexes () {
    let parentPosition = this.browserSurfaceChildren.indexOf(this.browserSurfaceChildSelf)
    this.browserSurfaceViews.forEach(view => {
      const parentViewZIndex = view.zIndex
      // Children can be displayed below their parent, therefor we have to subtract the parent position from it's zIndex
      // to get the starting zIndexOffset
      const zIndexOffset = parentViewZIndex - parentPosition
      this._updateZIndex(view, zIndexOffset)
    })
  }

  /**
   * @param {BrowserSurfaceView}parentView
   * @param {number}zIndexOffset
   * @return {number}
   * @private
   */
  _updateZIndex (parentView, zIndexOffset) {
    let newZIndex = 0
    let newZIndexOffset = zIndexOffset
    this.browserSurfaceChildren.forEach((browserSurfaceChild, index) => {
      newZIndex = newZIndexOffset + index
      if (browserSurfaceChild.browserSurface === this) {
        parentView.zIndex = newZIndex
      } else {
        const childView = browserSurfaceChild.browserSurface.browserSurfaceViews.find(view => {
          return view.parent === parentView
        })
        if (childView) {
          newZIndexOffset = browserSurfaceChild.browserSurface._updateZIndex(childView, newZIndex)
        }
      }
    })
    return newZIndex
  }

  /**
   * @param {BrowserSurfaceView}browserSurfaceView
   */
  onViewCreated (browserSurfaceView) {}

  /**
   * @return {BrowserSurfaceView}
   */
  createView () {
    const bufferSize = this.state.bufferContents ? this.state.bufferContents.size : Size.create(0, 0)
    const browserSurfaceView = BrowserSurfaceView.create(this, bufferSize.w, bufferSize.h)
    if (this.browserSurfaceViews.length === 0) {
      browserSurfaceView.primary = true
    }
    this.browserSurfaceViews.push(browserSurfaceView)

    browserSurfaceView.onDestroy().then(() => {
      const idx = this.browserSurfaceViews.indexOf(browserSurfaceView)
      if (idx > -1) {
        this.browserSurfaceViews.splice(idx, 1)
      }
    })

    this.browserSurfaceChildren.forEach(browserSurfaceChild => {
      this._ensureChildView(browserSurfaceChild, browserSurfaceView)
    })

    this.updateChildViewsZIndexes()
    this.onViewCreated(browserSurfaceView)

    return browserSurfaceView
  }

  /**
   * @param {BrowserSurfaceChild}browserSurfaceChild
   * @param {BrowserSurfaceView}browserSurfaceView
   * @return {BrowserSurfaceView|null}
   * @private
   */
  _ensureChildView (browserSurfaceChild, browserSurfaceView) {
    if (browserSurfaceChild.browserSurface === this) {
      return null
    }

    const childView = browserSurfaceChild.browserSurface.createView()
    const zIndexOrder = this.browserSurfaceChildren.indexOf(browserSurfaceChild)
    childView.zIndex = browserSurfaceView.zIndex + zIndexOrder
    childView.parent = browserSurfaceView

    return childView
  }

  /**
   * Returns all newly created child views
   * @param {BrowserSurfaceChild}browserSurfaceChild
   * @return {BrowserSurfaceView[]}
   */
  addSubsurface (browserSurfaceChild) {
    const childViews = this._addChild(browserSurfaceChild, this.browserSubsurfaceChildren)
    this.pendingBrowserSubsurfaceChildren.push(browserSurfaceChild)

    browserSurfaceChild.browserSurface.resource.onDestroy().then(() => {
      this.removeSubsurface(browserSurfaceChild)
    })

    return childViews
  }

  /**
   * @param {BrowserSurfaceChild}browserSurfaceChild
   */
  removeSubsurface (browserSurfaceChild) {
    this._removeChild(browserSurfaceChild, this.browserSubsurfaceChildren)
    this._removeChild(browserSurfaceChild, this.pendingBrowserSubsurfaceChildren)
  }

  /**
   * Returns all newly created child views
   * @param {BrowserSurfaceChild}browserSurfaceChild
   * @return {BrowserSurfaceView[]}
   */
  addChild (browserSurfaceChild) {
    return this._addChild(browserSurfaceChild, this._browserSurfaceChildren)
  }

  /**
   * @param {BrowserSurfaceChild}browserSurfaceChild
   */
  addToplevelChild (browserSurfaceChild) {
    this._browserSurfaceChildren.push(browserSurfaceChild)

    const primaryChildView = browserSurfaceChild.browserSurface.browserSurfaceViews.find((view) => view.primary)
    const primaryView = this.browserSurfaceViews.find((view) => view.primary)

    const zIndexOrder = this.browserSurfaceChildren.indexOf(browserSurfaceChild)
    primaryChildView.zIndex = primaryView.zIndex + zIndexOrder
    primaryChildView.parent = primaryView

    browserSurfaceChild.browserSurface.resource.onDestroy().then(() => {
      this.removeChild(browserSurfaceChild)
    })
    this.updateChildViewsZIndexes()
  }

  /**
   * @param {BrowserSurfaceChild}browserSurfaceChild
   */
  removeChild (browserSurfaceChild) {
    this._removeChild(browserSurfaceChild, this._browserSurfaceChildren)
  }

  /**
   * @param {BrowserSurfaceChild}browserSurfaceChild
   * @param {BrowserSurfaceChild[]}siblings
   * @return {BrowserSurfaceView[]}
   * @private
   */
  _addChild (browserSurfaceChild, siblings) {
    siblings.push(browserSurfaceChild)

    const childViews = []
    this.browserSurfaceViews.forEach((browserSurfaceView) => {
      const childView = this._ensureChildView(browserSurfaceChild, browserSurfaceView)
      if (childView) {
        childViews.push(childView)
      }
    })
    browserSurfaceChild.browserSurface.resource.onDestroy().then(() => {
      this.removeChild(browserSurfaceChild)
    })
    this.updateChildViewsZIndexes()
    return childViews
  }

  /**
   * @param {BrowserSurfaceChild}browserSurfaceChild
   * @param {BrowserSurfaceChild[]}siblings
   * @private
   */
  _removeChild (browserSurfaceChild, siblings) {
    const index = siblings.indexOf(browserSurfaceChild)
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
   * @param {GrSurface} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    // this._handleDestruction()
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
    this.browserSurfaceViews.forEach(browserSurfaceView => {
      delete browserSurfaceView.browserSurface
      browserSurfaceView.destroy()
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
   *                Surface contents are double-buffered state, see GrSurface.commit.
   *
   *                The initial surface contents are void; there is no content.
   *                GrSurface.attach assigns the given GrBuffer as the pending
   *                GrBuffer. GrSurface.commit makes the pending GrBuffer the new
   *                surface contents, and the size of the surface becomes the size
   *                calculated from the GrBuffer, as described above. After commit,
   *                there is no pending buffer until the next attach.
   *
   *                Committing a pending GrBuffer allows the compositor to read the
   *                pixels in the GrBuffer. The compositor may access the pixels at
   *                any time after the GrSurface.commit request. It may take some
   *                time for the contents to arrive at the compositor if they have
   *                not been transferred already. The compositor will continue using
   *                old surface content and state until the new content has arrived.
   *                See also GrBuffer.complete.
   *
   *                If it is possible to re-use a GrBuffer or update its
   *                contents, the respective buffer factory shall define how that
   *                works.
   *
   *                Destroying the GrBuffer after GrBuffer.complete does not change
   *                the surface contents. However, if the client destroys the
   *                GrBuffer before receiving the GrBuffer.complete event, the surface
   *                contents become undefined immediately.
   *
   *                If GrSurface.attach is sent with a NULL GrBuffer, the
   *                following GrSurface.commit will remove the surface content.
   *
   *
   * @param {GrSurface} resource
   * @param {GrBuffer|null} buffer undefined
   * @param {Number} x undefined
   * @param {Number} y undefined
   *
   * @since 1
   *
   */
  attach (resource, buffer, x, y) {
    this._pendingDx = x
    this._pendingDy = y

    if (this.pendingGrBuffer) {
      this.pendingGrBuffer.removeDestroyListener(this.pendingBrowserBufferDestroyListener)
    }

    this.pendingGrBuffer = buffer
    // buffer can be null
    if (this.pendingGrBuffer) {
      this.pendingGrBuffer.addDestroyListener(this.pendingBrowserBufferDestroyListener)
    }
  }

  /**
   *
   *                This request is used to describe the regions where the pending
   *                buffer is different from the current surface contents, and where
   *                the surface therefore needs to be repainted. The compositor
   *                ignores the parts of the damage that fall outside of the surface.
   *
   *                Damage is double-buffered state, see GrSurface.commit.
   *
   *                The damage rectangle is specified in surface local coordinates.
   *
   *                The initial value for pending damage is empty: no damage.
   *                GrSurface.damage adds pending damage: the new pending damage
   *                is the union of old pending damage and the given rectangle.
   *
   *                GrSurface.commit assigns pending damage as the current damage,
   *                and clears pending damage. The server will clear the current
   *                damage as it repaints the surface.
   *
   *                Alternatively, damage can be posted with GrSurface.damageBuffer
   *                which uses buffer co-ordinates instead of surface co-ordinates,
   *                and is probably the preferred and intuitive way of doing this.
   *
   *                The factory behind the the GrBuffer might imply full surface
   *                damage, overriding this request. This is common when the factory
   *                uses a video encoder, where regions outside the original changes
   *                may improve in quality.
   *
   *
   * @param {GrSurface} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
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
   *                When a client is animating on a GrSurface, it can use the 'frame'
   *                request to get notified when it is a good time to draw and commit the
   *                next frame of animation. If the client commits an update earlier than
   *                that, it is likely that some updates will not make it to the display,
   *                and the client is wasting resources by drawing too often.
   *
   *                The frame request will take effect on the next GrSurface.commit.
   *                The notification will only be posted for one frame unless
   *                requested again. For a GrSurface, the notifications are posted in
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
   * @param {GrSurface} resource
   * @param {number} callback id
   *
   *
   * @since 1
   *
   */
  frame (resource, callback) {
    this._pendingFrameCallbacks.push(BrowserCallback.create(new GrCallback(resource.client, callback, 1)))
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
   *                Opaque region is double-buffered state, see GrSurface.commit.
   *
   *                GrSurface.setOpaqueRegion changes the pending opaque region.
   *                GrSurface.commit copies the pending region to the current region.
   *                Otherwise, the pending and current regions are never changed.
   *
   *                The initial value for opaque region is empty. Setting the pending
   *                opaque region has copy semantics, and the GrRegion object can be
   *                destroyed immediately. A NULL GrRegion causes the pending opaque
   *                region to be set to empty.
   *
   *
   * @param {GrSurface} resource
   * @param {GrRegion|null} region undefined
   *
   * @since 1
   *
   */
  setOpaqueRegion (resource, region) {
    this._pendingOpaqueRegion = BrowserRegion.createPixmanRegion()
    if (region) {
      const browserRegion = /** @type BrowserRegion */(region.implementation)
      BrowserRegion.copyTo(this._pendingOpaqueRegion, browserRegion.pixmanRegion)
    } else {
      BrowserRegion.initInfinite(this._pendingOpaqueRegion)
    }
    // this._opaqueRegionChanged = true
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
   *                Input region is double-buffered state, see GrSurface.commit.
   *
   *                GrSurface.setInputRegion changes the pending input region.
   *                GrSurface.commit copies the pending region to the current region.
   *                Otherwise the pending and current regions are never changed,
   *                except cursor and icon surfaces are special cases, see
   *                GrPointer.setCursor and GrDataDevice.startDrag.
   *
   *                The initial value for input region is infinite. That means the
   *                whole surface will accept input. Setting the pending input region
   *                has copy semantics, and the GrRegion object can be destroyed
   *                immediately. A NULL GrRegion causes the input region to be set
   *                to infinite.
   *
   *
   * @param {GrSurface} resource
   * @param {GrRegion|null} region undefined
   *
   * @since 1
   *
   */
  setInputRegion (resource, region) {
    this._pendingInputRegion = BrowserRegion.createPixmanRegion()
    if (region) {
      const browserRegion = /** @type BrowserRegion */(region.implementation)
      BrowserRegion.copyTo(this._pendingInputRegion, browserRegion.pixmanRegion)
    } else {
      // 'infinite' region
      BrowserRegion.initInfinite(this._pendingInputRegion)
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
   *                On commit, a pending GrBuffer is applied first, all other state
   *                second. This means that all coordinates in double-buffered state are
   *                relative to the new GrBuffer coming into use, except for
   *                GrSurface.attach itself. If there is no pending GrBuffer, the
   *                coordinates are relative to the current surface contents.
   *
   *                All requests that need a commit to become effective are documented
   *                to affect double-buffered state.
   *
   *                Other interfaces may add further double-buffered surface state.
   *
   *
   * @param {GrSurface} resource
   *
   * @since 1
   *
   */
  async commit (resource) {
    this._start = Date.now()
    this._count++
    if (this.pendingGrBuffer) {
      this.pendingGrBuffer.removeDestroyListener(this.pendingBrowserBufferDestroyListener)
    }

    const pendingGrBuffer = this.pendingGrBuffer
    const newState = await this._captureState(pendingGrBuffer)

    if (this.role && typeof this.role.onCommit === 'function') {
      const animationFrame = Renderer.createRenderFrame()
      await this.role.onCommit(this, animationFrame, newState)
      if (newState.inputPixmanRegion) {
        BrowserRegion.destroyPixmanRegion(newState.inputPixmanRegion)
      }
      if (newState.opaquePixmanRegion) {
        BrowserRegion.destroyPixmanRegion(newState.opaquePixmanRegion)
      }
    }
  }

  /**
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
   * @param {boolean=}skipDraw
   */
  async render (renderFrame, newState, skipDraw) {
    if (skipDraw == null) {
      skipDraw = false
    }

    renderFrame.then((timestamp) => {
      this.state.frameCallbacks.forEach((frameCallback) => {
        frameCallback.done(timestamp & 0x7fffffff)
      })
      this.state.frameCallbacks = []
    })

    if (this.browserSubsurfaceChildren.length > 1) {
      this.browserSubsurfaceChildren = this.pendingBrowserSubsurfaceChildren.slice()
      this.updateChildViewsZIndexes()

      this.browserSubsurfaceChildren.forEach((browserSurfaceChild) => {
        const siblingBrowserSurface = browserSurfaceChild.browserSurface
        if (siblingBrowserSurface !== this) {
          const siblingSubsurface = /** @type BrowserSubsurface */ (siblingBrowserSurface.role)
          // cascade scene update to subsurface children
          if (siblingSubsurface.pendingPosition) {
            browserSurfaceChild.position = siblingSubsurface.pendingPosition
            siblingSubsurface.pendingPosition = null
          }
          siblingSubsurface.onParentCommit(this, renderFrame)
        }
      })
    }

    if (!skipDraw) {
      await this.renderer.render(this, newState)
    }
    const postRenderStart = Date.now()

    const {w: oldWidth, h: oldHeight} = this.size
    this._updateDerivedState(newState)
    BrowserSurface.mergeState(this.state, newState)
    if (this.role && this.role.setRoleState) {
      this.role.setRoleState(newState.roleState)
    }

    if (newState.inputPixmanRegion || oldWidth !== this.size.w || oldHeight !== this.size.h) {
      this.browserSurfaceViews.forEach(browserSurfaceView => {
        browserSurfaceView.updateInputRegion()
      })
    }

    this.browserSurfaceViews.forEach(browserSurfaceView => {
      browserSurfaceView.swapBuffers(renderFrame)
    })

    const now = Date.now()
    this._postRenderTotal += (now - postRenderStart)
    this._total += (now - this._start)
    DEBUG && console.log('post-render avg', this._postRenderTotal / this._count)
    DEBUG && console.log('---> commit avg', this._total / this._count)
  }

  /**
   * This will invalidate the source state.
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}targetState
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}sourceState
   */
  static mergeState (targetState, sourceState) {
    targetState.dx = sourceState.dx
    targetState.dy = sourceState.dy

    BrowserRegion.copyTo(targetState.inputPixmanRegion, sourceState.inputPixmanRegion)
    BrowserRegion.copyTo(targetState.opaquePixmanRegion, sourceState.opaquePixmanRegion)
    targetState.bufferDamageRects = sourceState.bufferDamageRects.slice()

    targetState.bufferTransform = sourceState.bufferTransform
    targetState.bufferScale = sourceState.bufferScale

    targetState.bufferContents = sourceState.bufferContents
    targetState.frameCallbacks = targetState.frameCallbacks.concat(sourceState.frameCallbacks)
  }

  /**
   * @return {Promise<{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}>}
   * @private
   */
  async _captureState (pendingGrBuffer) {
    const self = this
    /**
     * @type {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}
     */
    const newState = {
      /**
       * @type {BrowserEncodedFrame|null}
       */
      bufferContents: null,
      /**
       * @type {Array<Rect>}
       */
      bufferDamageRects: [],
      /**
       * @type{number}
       */
      opaquePixmanRegion: self._pendingOpaqueRegion,
      /**
       * @type{number}
       */
      inputPixmanRegion: self._pendingInputRegion,
      /**
       * @type{number}
       */
      dx: self._pendingDx,
      /**
       * @type{number}
       */
      dy: self._pendingDy,
      /**
       * @type{number}
       */
      bufferTransform: self._pendingBufferTransform,
      /**
       * @type{number}
       */
      bufferScale: self._pendingBufferScale,
      /**
       * @type {BrowserCallback[]}
       */
      frameCallbacks: self._pendingFrameCallbacks,
      /**
       * @type {*}
       */
      roleState: {}
    }
    this._pendingFrameCallbacks = []

    this._pendingInputRegion = 0
    this._pendingOpaqueRegion = 0

    newState.bufferDamageRects = this._pendingDamageRects.map(rect => this.bufferTransformation.timesRect(rect)).concat(this._pendingBufferDamageRects)
    this._pendingDamageRects = []
    this._pendingBufferDamageRects = []

    if (this.role && this.role.captureRoleState) {
      newState.roleState = this.role.captureRoleState()
    }

    const bufferReceiveStart = Date.now()
    if (pendingGrBuffer) {
      const browserRtcDcBuffer = BrowserRtcBufferFactory.get(pendingGrBuffer)
      newState.bufferContents = await browserRtcDcBuffer.whenComplete()

      const bufferCompletion = Date.now() - bufferReceiveStart
      this._bufferCompletionTotal += bufferCompletion
      DEBUG && console.log(
        'buffer completion avg', this._bufferCompletionTotal / this._count,
        'current', bufferCompletion
      )
      let bufferSize = 0
      newState.bufferContents.fragments.forEach(fragment => {
        bufferSize += fragment.opaque.byteLength
        bufferSize += fragment.alpha.byteLength
      })
      this._bufferSizeTotal += bufferSize
      DEBUG && console.log(
        'buffer transfer avg (kb/s)', (this._bufferSizeTotal / 1024) / (this._bufferCompletionTotal / 1000),
        'current', (bufferSize / 1024) / (bufferCompletion / 1000)
      )
    } else {
      newState.bufferContents = null
    }

    return newState
  }

  /**
   *
   *                This request sets an optional transformation on how the compositor
   *                interprets the contents of the buffer attached to the surface. The
   *                accepted values for the transform parameter are the values for
   *                GrOutput.transform.
   *
   *                Buffer transform is double-buffered state, see GrSurface.commit.
   *
   *                A newly created surface has its buffer transformation set to normal.
   *
   *                GrSurface.setBufferTransform changes the pending buffer
   *                transformation. GrSurface.commit copies the pending buffer
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
   *                GrOutput.transform enum the invalidTransform protocol error
   *                is raised.
   *
   *
   * @param {GrSurface} resource
   * @param {Number} transform undefined
   *
   * @since 2
   *
   */
  setBufferTransform (resource, transform) {
    if (Object.values(GrOutput.Transform).includes(transform)) {
      this._pendingBufferTransform = transform
    } else {
      resource.postError(GrSurface.Error.invalidTransform, 'Buffer transform value is invalid.')
      DEBUG && console.log('Protocol error. Buffer transform value is invalid.')
    }
  }

  /**
   *
   *                This request sets an optional scaling factor on how the compositor
   *                interprets the contents of the buffer attached to the window.
   *
   *                Buffer scale is double-buffered state, see GrSurface.commit.
   *
   *                A newly created surface has its buffer scale set to 1.
   *
   *                GrSurface.setBufferScale changes the pending buffer scale.
   *                GrSurface.commit copies the pending buffer scale to the current one.
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
   * @param {GrSurface} resource
   * @param {Number} scale undefined
   *
   * @since 3
   *
   */
  setBufferScale (resource, scale) {
    if (scale < 1) {
      resource.postError(GrSurface.Error.invalidScale, 'Buffer scale value is invalid.')
      DEBUG && console.log('Protocol error. Buffer scale value is invalid.')
      return
    }
    this._pendingBufferScale = scale
  }

  /**
   *
   *                This request is used to describe the regions where the pending
   *                buffer is different from the current surface contents, and where
   *                the surface therefore needs to be repainted. The compositor
   *                ignores the parts of the damage that fall outside of the surface.
   *
   *                Damage is double-buffered state, see GrSurface.commit.
   *
   *                The damage rectangle is specified in buffer coordinates.
   *
   *                The initial value for pending damage is empty: no damage.
   *                GrSurface.damageBuffer adds pending damage: the new pending
   *                damage is the union of old pending damage and the given rectangle.
   *
   *                GrSurface.commit assigns pending damage as the current damage,
   *                and clears pending damage. The server will clear the current
   *                damage as it repaints the surface.
   *
   *                This request differs from GrSurface.damage in only one way - it
   *                takes damage in buffer co-ordinates instead of surface local
   *                co-ordinates. While this generally is more intuitive than surface
   *                co-ordinates, it is especially desirable when using wpViewport
   *                or when a drawing library (like EGL) is unaware of buffer scale
   *                and buffer transform.
   *
   *                Note: Because buffer transformation changes and damage requests may
   *                be interleaved in the protocol stream, It is impossible to determine
   *                the actual mapping between surface and buffer damage until
   *                GrSurface.commit time. Therefore, compositors wishing to take both
   *                kinds of damage into account will have to accumulate damage from the
   *                two requests separately and only transform from one to the other
   *                after receiving the GrSurface.commit.
   *
   *
   * @param {GrSurface} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 4
   *
   */
  damageBuffer (resource, x, y, width, height) {
    this._pendingBufferDamageRects.push(Rect.create(x, y, x + width, y + height))
  }
}
