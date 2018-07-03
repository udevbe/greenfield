import { XdgToplevel, XdgPopup } from './protocol/xdg-shell-browser-protocol'
import BrowserXdgToplevel from './BrowserXdgToplevel'
import BrowserXdgPopup from './BrowserXdgPopup'
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
 *
 */
export default class BrowserXdgSurface {
  /**
   * @param {XdgSurface}xdgSurfaceResource
   * @param {GrSurface}grSurfaceResource
   * @param {BrowserSession} browserSession
   * @param {UserShell}userShell
   * @return {BrowserXdgSurface}
   */
  static create (xdgSurfaceResource, grSurfaceResource, browserSession, userShell) {
    const browserXdgSurface = new BrowserXdgSurface(xdgSurfaceResource, grSurfaceResource, browserSession, userShell)
    xdgSurfaceResource.implementation = browserXdgSurface
    const browserSurface = grSurfaceResource.implementation
    browserSurface.hasKeyboardInput = true
    browserSurface.hasPointerInput = true
    browserSurface.hasTouchInput = true
    return browserXdgSurface
  }

  /**
   * @param {XdgSurface}xdgSurfaceResource
   * @param {GrSurface}grSurfaceResource
   * @param {BrowserSession} browserSession
   * @param {UserShell}userShell
   * @private
   */
  constructor (xdgSurfaceResource, grSurfaceResource, browserSession, userShell) {
    /**
     * @type {XdgSurface}
     */
    this.xdgSurfaceResource = xdgSurfaceResource
    /**
     * @type {GrSurface}
     */
    this.grSurfaceResource = grSurfaceResource
    /**
     * @type {BrowserSession}
     * @private
     */
    this._browserSession = browserSession
    /**
     * @type {UserShell}
     * @private
     */
    this._userShell = userShell
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
   * @param {XdgSurface} resource
   *
   * @since 1
   *
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
   * @param {XdgSurface} resource
   * @param {number} id undefined
   *
   * @since 1
   *
   */
  getToplevel (resource, id) {
    const browserSurface = this.grSurfaceResource.implementation
    if (browserSurface.role) {
      // TODO raise protocol error
      return
    }
    const xdgToplevelResource = new XdgToplevel(resource.client, id, resource.version)
    const browserXdgToplevel = BrowserXdgToplevel.create(xdgToplevelResource, this, this._browserSession, this._userShell)
    this.ackConfigure = (resource, serial) => {
      browserXdgToplevel.ackConfigure(serial)
    }
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
   * @param {XdgSurface} resource
   * @param {number} id undefined
   * @param {XdgSurface} parent undefined
   * @param {XdgPositioner} positioner undefined
   *
   * @since 1
   *
   */
  getPopup (resource, id, parent, positioner) {
    const browserSurface = this.grSurfaceResource.implementation
    if (browserSurface.role) {
      // TODO protocol error
    }

    const browserXdgPositioner = positioner.implementation
    if (browserXdgPositioner.size === null) {
      // TODO protocol error
    }

    if (browserXdgPositioner.anchorRect === null) {
      // TODO protocol error
    }

    const positionerState = browserXdgPositioner.createStateCopy()

    const xdgPopupResource = new XdgPopup(resource.client, id, resource.version)
    const browserXdgPopup = BrowserXdgPopup.create(xdgPopupResource, this, parent, positionerState, this._browserSession)
    this.ackConfigure = (resource, serial) => {
      browserXdgPopup.ackConfigure(serial)
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
      const views = parent.implementation.grSurfaceResource.implementation.addChild(browserSurface.browserSurfaceChildSelf)
      views.forEach(onNewView)
    } else {
      const view = browserSurface.createView()
      onNewView(view)
    }

    // this handles the case where a view is created later on (ie if a new parent view is created)
    browserSurface.onViewCreated = onNewView
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
   * @param {XdgSurface} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
   */
  setWindowGeometry (resource, x, y, width, height) {
    if (width <= 0 || height <= 0) {
      // TODO raise protocol error
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

    const browserSurface = this.grSurfaceResource.implementation
    const size = browserSurface.size
    xs.push(size.w)
    ys.push(size.h)

    browserSurface.browserSubsurfaceChildren.forEach((browserSubsurfaceChild) => {
      const subsurfacePosition = browserSubsurfaceChild.position
      const subsurfaceSize = browserSubsurfaceChild.browserSurface.size

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
   * @param {XdgSurface} resource
   * @param {Number} serial the serial from the configure event
   *
   * @since 1
   *
   */
  ackConfigure (resource, serial) {
    // implemented by 'subclass' interface
  }

  emitConfigureDone () {
    this.xdgSurfaceResource.configure(++this.configureSerial)
  }
}
