'use strict'

import XdgSurfaceRequests from './protocol/XdgSurfaceRequests'
import XdgToplevelResource from './protocol/XdgToplevelResource'
import XdgWmBaseResource from './protocol/XdgWmBaseResource'
import XdgPopupResource from './protocol/XdgPopupResource'

import XdgToplevel from './XdgToplevel'
import XdgPopup from './XdgPopup'
import Rect from './math/Rect'
import Renderer from './render/Renderer'

/**
 *
 *      An interface that may be implemented by a wl_surface, for
 *      implementations that provide a desktop-style user interface.
 *
 *      It provides a base set of functionality required to construct user
 *      interface elements requiring management by the compositor, such as
 *      toplevel windows, menus, etc. The types of functionality are split into
 *      xdg_surface roles.
 *
 *      Creating an xdg_surface does not set the role for a wl_surface. In order
 *      to map an xdg_surface, the client must create a role-specific object
 *      using, e.g., get_toplevel, get_popup. The wl_surface for any given
 *      xdg_surface can have at most one role, and may not be assigned any role
 *      not based on xdg_surface.
 *
 *      A role must be assigned before any other requests are made to the
 *      xdg_surface object.
 *
 *      The client must call wl_surface.commit on the corresponding wl_surface
 *      for the xdg_surface state to take effect.
 *
 *      Creating an xdg_surface from a wl_surface which has a buffer attached or
 *      committed is a client error, and any attempts by a client to attach or
 *      manipulate a buffer prior to the first xdg_surface.configure call must
 *      also be treated as errors.
 *
 *      Mapping an xdg_surface-based role surface is defined as making it
 *      possible for the surface to be shown by the compositor. Note that
 *      a mapped surface is not guaranteed to be visible once it is mapped.
 *
 *      For an xdg_surface to be mapped by the compositor, the following
 *      conditions must be met:
 *      (1) the client has assigned an xdg_surface-based role to the surface
 *      (2) the client has set and committed the xdg_surface state and the
 *    role-dependent state to the surface
 *      (3) the client has committed a buffer to the surface
 *
 *      A newly-unmapped surface is considered to have met condition (1) out
 *      of the 3 required conditions for mapping a surface if its role surface
 *      has not been destroyed.
 * @implements XdgSurfaceRequests
 */
export default class XdgSurface extends XdgSurfaceRequests {
  /**
   * @param {XdgSurfaceResource}xdgSurfaceResource
   * @param {WlSurfaceResource}wlSurfaceResource
   * @param {Session} session
   * @param {UserShell}userShell
   * @param {Seat}seat
   * @return {XdgSurface}
   */
  static create (xdgSurfaceResource, wlSurfaceResource, session, userShell, seat) {
    const xdgSurface = new XdgSurface(xdgSurfaceResource, wlSurfaceResource, session, userShell, seat)
    xdgSurfaceResource.implementation = xdgSurface
    const surface = /** @type {Surface} */wlSurfaceResource.implementation
    surface.hasKeyboardInput = true
    surface.hasPointerInput = true
    surface.hasTouchInput = true
    return xdgSurface
  }

  /**
   * @param {XdgSurfaceResource}xdgSurfaceResource
   * @param {WlSurfaceResource}wlSurfaceResource
   * @param {Session} session
   * @param {UserShell}userShell
   * @param {Seat}seat
   * @private
   */
  constructor (xdgSurfaceResource, wlSurfaceResource, session, userShell, seat) {
    super()
    /**
     * @type {XdgSurfaceResource}
     */
    this.xdgSurfaceResource = xdgSurfaceResource
    /**
     * @type {WlSurfaceResource}
     */
    this.wlSurfaceResource = wlSurfaceResource
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {UserShell}
     * @private
     */
    this._userShell = userShell
    /**
     * @type {Seat}
     * @private
     */
    this._seat = seat
    /**
     * @type {Rect}
     */
    this.pendingWindowGeometry = Rect.create(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    /**
     * @type {number}
     */
    this.configureSerial = 0
    /**
     * @type {Rect}
     */
    this.windowGeometry = Rect.create(0, 0, 0, 0)
  }

  /**
   *
   *  Destroy the xdg_surface object. An xdg_surface must only be destroyed
   *  after its role object has been destroyed.
   *
   *
   * @param {XdgSurfaceResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    resource.destroy()
  }

  /**
   *
   *  This creates an xdg_toplevel object for the given xdg_surface and gives
   *  the associated wl_surface the xdg_toplevel role.
   *
   *  See the documentation of xdg_toplevel for more details about what an
   *  xdg_toplevel is and how it is used.
   *
   *
   * @param {XdgSurfaceResource} resource
   * @param {number} id
   *
   * @since 1
   * @override
   */
  getToplevel (resource, id) {
    const surface = this.wlSurfaceResource.implementation
    if (surface.role) {
      resource.postError(XdgWmBaseResource.Error.role, 'Given surface has another role.')
      DEBUG && console.log('[client-protocol-error] - Given surface has another role.')
      return
    }
    const xdgToplevelResource = new XdgToplevelResource(resource.client, id, resource.version)
    const xdgToplevel = XdgToplevel.create(xdgToplevelResource, this, this._session, this._userShell)
    xdgToplevelResource.implementation = xdgToplevel
    this.ackConfigure = (resource, serial) => xdgToplevel.ackConfigure(serial)
  }

  /**
   *
   *  This creates an xdg_popup object for the given xdg_surface and gives
   *  the associated wl_surface the xdg_popup role.
   *
   *  If null is passed as a parent, a parent surface must be specified using
   *  some other protocol, before committing the initial state.
   *
   *  See the documentation of xdg_popup for more details about what an
   *  xdg_popup is and how it is used.
   *
   *
   * @param {XdgSurfaceResource} resource
   * @param {number} id
   * @param {XdgSurfaceResource} parent
   * @param {XdgPositionerResource} positioner
   *
   * @since 1
   * @override
   */
  getPopup (resource, id, parent, positioner) {
    const surface = /** @type {Surface} */this.wlSurfaceResource.implementation
    if (surface.role) {
      resource.postError(XdgWmBaseResource.Error.role, 'Given surface has another role.')
      DEBUG && console.log('[client-protocol-error] - Given surface has another role.')
      return
    }

    const xdgPositioner = positioner.implementation
    if (xdgPositioner.size === null) {
      resource.postError(XdgWmBaseResource.Error.invalidPositioner, 'Client provided an invalid positioner. Size is NULL.')
      DEBUG && console.log('[client-protocol-error] - Client provided an invalid positioner. Size is NULL.')
      return
    }

    if (xdgPositioner.anchorRect === null) {
      resource.postError(XdgWmBaseResource.Error.invalidPositioner, 'Client provided an invalid positioner. AnchorRect is NULL.')
      DEBUG && console.log('[client-protocol-error] - Client provided an invalid positioner. AnchorRect is NULL.')
      return
    }

    const positionerState = xdgPositioner.createStateCopy()

    const xdgPopupResource = new XdgPopupResource(resource.client, id, resource.version)
    const xdgPopup = XdgPopup.create(xdgPopupResource, this, parent, positionerState, this._session, this._seat)
    this.ackConfigure = (resource, serial) => {
      xdgPopup.ackConfigure(serial)
    }

    const onNewView = (view) => {
      const renderFrame = Renderer.createRenderFrame()
      view.applyTransformations(renderFrame)
      renderFrame.fire()
      view.onDestroy().then(() => {
        view.detach()
      })
    }

    if (parent) {
      const parentXdgSurface = /** @type {XdgSurface} */parent.implementation
      const parentSurface = /** @type {Surface} */parentXdgSurface.wlSurfaceResource.implementation
      const views = parentSurface.addChild(surface.surfaceChildSelf)
      views.forEach(onNewView)
    } else {
      const view = surface.createView()
      onNewView(view)
    }

    // this handles the case where a view is created later on (ie if a new parent view is created)
    surface.onViewCreated = onNewView
  }

  /**
   *
   *  The window geometry of a surface is its "visible bounds" from the
   *  user's perspective. Client-side decorations often have invisible
   *  portions like drop-shadows which should be ignored for the
   *  purposes of aligning, placing and constraining windows.
   *
   *  The window geometry is double buffered, and will be applied at the
   *  time wl_surface.commit of the corresponding wl_surface is called.
   *
   *  When maintaining a position, the compositor should treat the (x, y)
   *  coordinate of the window geometry as the top left corner of the window.
   *  A client changing the (x, y) window geometry coordinate should in
   *  general not alter the position of the window.
   *
   *  Once the window geometry of the surface is set, it is not possible to
   *  unset it, and it will remain the same until set_window_geometry is
   *  called again, even if a new subsurface or buffer is attached.
   *
   *  If never set, the value is the full bounds of the surface,
   *  including any subsurfaces. This updates dynamically on every
   *  commit. This unset is meant for extremely simple clients.
   *
   *  The arguments are given in the surface-local coordinate space of
   *  the wl_surface associated with this xdg_surface.
   *
   *  The width and height must be greater than zero. Setting an invalid size
   *  will raise an error. When applied, the effective window geometry will be
   *  the set window geometry clamped to the bounding rectangle of the
   *  combined geometry of the surface of the xdg_surface and the associated
   *  subsurfaces.
   *
   *
   * @param {XdgSurfaceResource} resource
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   *
   * @since 1
   * @override
   */
  setWindowGeometry (resource, x, y, width, height) {
    if (width <= 0 || height <= 0) {
      resource.postError(XdgWmBaseResource.Error.invalidSurfaceState, 'Client provided negative window geometry.')
      DEBUG && console.log('[client-protocol-error] - Client provided negative window geometry.')
      return
    }
    this.pendingWindowGeometry = Rect.create(x, y, x + width, y + height)
  }

  /**
   * @param {Rect}windowGeometry
   */
  updateWindowGeometry (windowGeometry) {
    this.windowGeometry = this._createBoundingRectangle().intersect(windowGeometry)
  }

  /**
   * @return {Rect}
   * @private
   */
  _createBoundingRectangle () {
    const xs = [0]
    const ys = [0]

    const surface = /** @type {Surface} */this.wlSurfaceResource.implementation
    const size = surface.size
    xs.push(size.w)
    ys.push(size.h)

    surface.subsurfaceChildren.forEach((subsurfaceChild) => {
      const subsurfacePosition = subsurfaceChild.position
      const subsurfaceSize = subsurfaceChild.surface.size

      xs.push(subsurfacePosition.x)
      ys.push(subsurfacePosition.y)
      xs.push(subsurfacePosition.x + subsurfaceSize.w)
      ys.push(subsurfacePosition.y + subsurfaceSize.h)
    })

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    return Rect.create(minX, minY, maxX, maxY)
  }

  /**
   *
   *  When a configure event is received, if a client commits the
   *  surface in response to the configure event, then the client
   *  must make an ack_configure request sometime before the commit
   *  request, passing along the serial of the configure event.
   *
   *  For instance, for toplevel surfaces the compositor might use this
   *  information to move a surface to the top left only when the client has
   *  drawn itself for the maximized or fullscreen state.
   *
   *  If the client receives multiple configure events before it
   *  can respond to one, it only has to ack the last configure event.
   *
   *  A client is not required to commit immediately after sending
   *  an ack_configure request - it may even ack_configure several times
   *  before its next surface commit.
   *
   *  A client may send multiple ack_configure requests before committing, but
   *  only the last request sent before a commit indicates which configure
   *  event the client really is responding to.
   *
   *
   * @param {XdgSurfaceResource} resource
   * @param {Number} serial the serial from the configure event
   *
   * @since 1
   * @override
   */
  ackConfigure (resource, serial) {
    // implemented by 'subclass' interface
  }

  emitConfigureDone () {
    this.xdgSurfaceResource.configure(++this.configureSerial)
  }
}
