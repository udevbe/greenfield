'use strict'

import { XdgToplevel } from './protocol/xdg-shell-browser-protocol'
import Point from './math/Point'
import Size from './Size'
import Renderer from './render/Renderer'

const {none, bottom, bottomLeft, bottomRight, left, right, top, topLeft, topRight} = XdgToplevel.ResizeEdge
const {fullscreen, activated, maximized, resizing} = XdgToplevel.State

/**
 *
 *      This interface defines an xdg_surface role which allows a surface to,
 *      among other things, set window-like properties such as maximize,
 *      fullscreen, and minimize, set application-specific metadata like title and
 *      id, and well as trigger user interactive operations such as interactive
 *      resize and move.
 *
 *      Unmapping an xdg_toplevel means that the surface cannot be shown
 *      by the compositor until it is explicitly mapped again.
 *      All active operations (e.g., move, resize) are canceled and all
 *      attributes (e.g. title, state, stacking, ...) are discarded for
 *      an xdg_toplevel surface when it is unmapped.
 *
 *      Attaching a null buffer to a toplevel unmaps the surface.
 *
 */
export default class BrowserXdgToplevel {
  /**
   * @param {XdgToplevel}xdgToplevelResource
   * @param {BrowserXdgSurface}browserXdgSurface
   * @param {BrowserSession} browserSession
   * @param {UserShell}userShell
   */
  static create (xdgToplevelResource, browserXdgSurface, browserSession, userShell) {
    const userShellSurface = userShell.manage(browserXdgSurface.grSurfaceResource.implementation)
    const browserXdgToplevel = new BrowserXdgToplevel(xdgToplevelResource, browserXdgSurface, browserSession, userShellSurface)
    xdgToplevelResource.implementation = browserXdgToplevel
    browserXdgSurface.grSurfaceResource.implementation.role = browserXdgToplevel
    xdgToplevelResource.onDestroy().then(() => {
      if (browserXdgToplevel._userShellSurface) {
        browserXdgToplevel._userShellSurface.destroy()
      }
    })

    userShellSurface.onActivationRequest = () => {
      if (!browserXdgToplevel._activationRequested) {
        browserXdgToplevel._activationRequested = true
        browserXdgToplevel._emitConfigure(xdgToplevelResource, 0, 0, [activated], none)
      }
    }
    userShellSurface.onInactive = () => {
      browserXdgToplevel._emitConfigure(xdgToplevelResource, 0, 0, [], none)
    }

    return browserXdgToplevel
  }

  /**
   * Use BrowserXdgToplevel.create(..) instead.
   * @param {XdgToplevel}xdgToplevelResource
   * @param {BrowserXdgSurface}browserXdgSurface
   * @param {BrowserSession} browserSession
   * @param {UserShellSurface} userShellSurface
   * @private
   */
  constructor (xdgToplevelResource, browserXdgSurface, browserSession, userShellSurface) {
    /**
     * @type {XdgToplevel}
     */
    this.resource = xdgToplevelResource
    /**
     * @type {BrowserXdgSurface}
     */
    this.browserXdgSurface = browserXdgSurface
    /**
     * @type {BrowserSession}
     * @private
     */
    this._browserSession = browserSession
    /**
     * @type {UserShellSurface}
     * @private
     */
    this._userShellSurface = userShellSurface
    /**
     * @type {XdgToplevel|null}
     * @private
     */
    this._parent = null
    /**
     * @type {string}
     * @private
     */
    this._title = ''
    /**
     * @type {string}
     * @private
     */
    this._appId = ''
    /**
     * @type {Point}
     * @private
     */
    this._pendingMaxSize = Point.create(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    /**
     * @type {Point}
     */
    this._maxSize = Point.create(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    /**
     * @type {Point}
     * @private
     */
    this._pendingMinSize = Point.create(0, 0)
    /**
     * @type {Point}
     */
    this._minSize = Point.create(0, 0)
    /**
     * @type {Array<{serial: number, state: number[], width: number, height: number, resizeEdge: number}>}
     */
    this._pendingConfigureStates = []
    /**
     * @type {{state: number[], width: number, height: number}|null}
     * @private
     */
    this._unfullscreenConfigureState = null

    /**
     * @type {{serial: number, state: number[], width: number, height: number}}
     * @private
     */
    this._ackedConfigureState = {serial: 0, state: [], width: 0, height: 0, resizeEdge: 0}
    /**
     * @type {{serial: number, state: number[], width: number, height: number}}
     * @private
     */
    this._configureState = {serial: 0, state: [], width: 0, height: 0, resizeEdge: 0}
    /**
     * @type {Rect|Null}
     * @private
     */
    this._previousGeometry = null
    /**
     * @type {boolean}
     */
    this.mapped = false
    /**
     * @type {boolean}
     * @private
     */
    this._activationRequested = false
  }

  /**
   * @return {{windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}
   */
  captureRoleState () {
    return {
      windowGeometry: this.browserXdgSurface.pendingWindowGeometry,
      maxSize: this._pendingMaxSize,
      minSize: this._pendingMinSize,
      configureState: this._ackedConfigureState
    }
  }

  /**
   * @param {{windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}roleState
   */
  setRoleState (roleState) {
    this._maxSize = roleState.maxSize
    this._minSize = roleState.minSize
    this._configureState = roleState.configureState
    this.browserXdgSurface.updateWindowGeometry(roleState.windowGeometry)

    if (this._activationRequested && this._configureState.state.includes(activated)) {
      this._activationRequested = false
      this._userShellSurface.activationAck()
    }
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamage: Number, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: BrowserCallback[], roleState: {windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}}newState
   * @return {Promise<void>}
   */
  async onCommit (browserSurface, renderFrame, newState) {
    if (newState.bufferContents) {
      if (!this.mapped) {
        this._map(browserSurface)
      }
      if (newState.roleState.configureState.state.includes(resizing)) {
        this._resizingCommit(browserSurface, renderFrame, newState)
      } else if (newState.roleState.configureState.state.includes(maximized)) {
        this._maximizedCommit(browserSurface, renderFrame, newState)
      } else if (newState.roleState.configureState.state.includes(fullscreen)) {
        this._fullscreenCommit(browserSurface, renderFrame, newState)
      } else if (newState.roleState.configureState.state.includes(activated)) {
        this._normalCommit(browserSurface, renderFrame, newState)
      }
    } else if (this.mapped) {
      this._unmap()
    }

    browserSurface.render(renderFrame, newState)

    renderFrame.fire()
    await renderFrame
    this._browserSession.flush()
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @private
   */
  _map (browserSurface) {
    this.mapped = true
    this._userShellSurface.mapped = true
  }

  _unmap () {
    this.mapped = false
    this._configureState = {state: [], width: 0, height: 0, resizeEdge: 0}
    this._userShellSurface.mapped = false
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamage: Number, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: BrowserCallback[], roleState: {windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}}newState
   * @private
   */
  _resizingCommit (browserSurface, renderFrame, newState) {
    const roleState = newState.roleState
    const {w: newSurfaceWidth, h: newSurfaceHeight} = roleState.windowGeometry.size

    if (newSurfaceWidth > roleState.configureState.width || newSurfaceHeight > roleState.configureState.height) {
      // TODO raise protocol error
      throw new Error('TODO protocol error')
    }
    const {w: oldSurfaceWidth, h: oldSurfaceHeight} = this.browserXdgSurface.windowGeometry.size

    let dx = 0
    let dy = 0
    const edges = this._configureState.resizeEdge
    switch (edges) {
      case topRight:
      case top: {
        dy = oldSurfaceHeight - newSurfaceHeight
        break
      }
      case bottomLeft:
      case left: {
        dx = oldSurfaceWidth - newSurfaceWidth
        break
      }
      case topLeft: {
        dx = oldSurfaceWidth - newSurfaceWidth
        dy = oldSurfaceHeight - newSurfaceHeight
        break
      }
      default: {
        break
      }
    }

    if (dx || dy) {
      const {x, y} = browserSurface.browserSurfaceChildSelf.position
      browserSurface.browserSurfaceChildSelf.position = Point.create(x + dx, y + dy)
      browserSurface.browserSurfaceViews.forEach(value => {
        value.applyTransformations(renderFrame)
      })
    }
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamage: Number, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: BrowserCallback[], roleState: {windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}}newState
   * @private
   */
  _maximizedCommit (browserSurface, renderFrame, newState) {
    const roleState = newState.roleState
    const {w: newSurfaceWidth, h: newSurfaceHeight} = roleState.windowGeometry.size

    if (newSurfaceWidth !== roleState.configureState.width || newSurfaceHeight !== roleState.configureState.height) {
      // TODO raise protocol error
      throw new Error('TODO protocol error')
    }

    if (!this._previousGeometry) {
      this._storePreviousGeometry()
    }
    if (this._unfullscreenConfigureState) {
      this._unfullscreenConfigureState = null
    }
    const x = 0
    const {y} = document.getElementById('workspace').getBoundingClientRect()
    const windowGeoPositionOffset = newState.roleState.windowGeometry.position

    browserSurface.browserSurfaceChildSelf.position = Point.create(x - windowGeoPositionOffset.x, y - windowGeoPositionOffset.y)
    browserSurface.browserSurfaceViews.forEach(value => {
      value.applyTransformations(renderFrame)
    })
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamage: Number, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: BrowserCallback[], roleState: {windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}}newState
   * @private
   */
  _fullscreenCommit (browserSurface, renderFrame, newState) {
    const bufferSize = newState.bufferContents.geo
    const {x: newSurfaceWidth, y: newSurfaceHeight} = browserSurface.toSurfaceSpace(Point.create(bufferSize.w, bufferSize.h))
    if (newSurfaceWidth > this._configureState.width || newSurfaceHeight > this._configureState.height) {
      // TODO raise protocol error
      return
    }

    if (!this._unfullscreenConfigureState) {
      this._unfullscreenConfigureState = this._configureState
    }
    if (!this._previousGeometry) {
      this._storePreviousGeometry()
    }

    const x = (window.innerWidth - newSurfaceWidth) / 2
    const y = (window.innerHeight - newSurfaceHeight) / 2

    browserSurface.browserSurfaceChildSelf.position = Point.create(x, y)
    browserSurface.browserSurfaceViews.forEach(value => {
      value.applyTransformations(renderFrame)
    })
    // TODO put an opaque black fullscreen div behind the fullscreened application
    // TODO make sure z-order is always the highest
    // TODO also do this for BrowserShellSurface
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamage: Number, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: BrowserCallback[], roleState: {windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}}newState
   * @private
   */
  _normalCommit (browserSurface, renderFrame, newState) {
    if (this._previousGeometry) {
      // restore position (we came from a fullscreen or maximize and must restore the position)
      const browserSurface = this.browserXdgSurface.grSurfaceResource.implementation
      browserSurface.browserSurfaceChildSelf.position = this._previousGeometry.position
      browserSurface.browserSurfaceViews.forEach(value => {
        value.applyTransformations(renderFrame)
      })
      this._previousGeometry = null
    }
    if (this._unfullscreenConfigureState) {
      this._unfullscreenConfigureState = null
    }
  }

  /**
   * @param {number}serial
   */
  ackConfigure (serial) {
    this._pendingConfigureStates = this._pendingConfigureStates.filter((pendingConfigureState) => {
      if (pendingConfigureState.serial < serial) {
        return false
      } else if (pendingConfigureState.serial === serial) {
        this._ackedConfigureState = pendingConfigureState
        return false
      }
      return true
    })
  }

  _storePreviousGeometry () {
    this._previousGeometry = this.browserXdgSurface.windowGeometry
  }

  /**
   *
   *  This request destroys the role surface and unmaps the surface;
   *  see "Unmapping" behavior in interface section for details.
   *
   *
   * @param {XdgToplevel} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    this._unmap()
    resource.destroy()
  }

  /**
   *
   *  Set the "parent" of this surface. This surface should be stacked
   *  above the parent surface and all other ancestor surfaces.
   *
   *  Parent windows should be set on dialogs, toolboxes, or other
   *  "auxiliary" surfaces, so that the parent is raised when the dialog
   *  is raised.
   *
   *  Setting a null parent for a child window removes any parent-child
   *  relationship for the child. Setting a null parent for a window which
   *  currently has no parent is a no-op.
   *
   *  If the parent is unmapped then its children are managed as
   *  though the parent of the now-unmapped parent has become the
   *  parent of this surface. If no parent exists for the now-unmapped
   *  parent then the children are managed as though they have no
   *  parent surface.
   *
   *
   * @param {XdgToplevel} resource
   * @param {?XdgToplevel} parent
   *
   * @since 1
   *
   */
  setParent (resource, parent) {
    // TODO

    // if (this._parent) {
    //   const oldParentBrowserXdgSurface = this._parent.implementation.browserXdgSurface
    //   const oldParentBrowserSurface = oldParentBrowserXdgSurface.grSurfaceResource.implementation
    //   const browserSurface = this.browserXdgSurface.grSurfaceResource.implementation
    //   oldParentBrowserSurface.removeChild(browserSurface.browserSurfaceChildSelf)
    // }

    // FIXME this causes multiple views to be created
    // if (parent) {
    //   const parentBrowserXdgSurface = parent.implementation.browserXdgSurface
    //   const parentBrowserSurface = parentBrowserXdgSurface.grSurfaceResource.implementation
    //   const browserSurface = this.browserXdgSurface.grSurfaceResource.implementation
    //   parentBrowserSurface.addChild(browserSurface.browserSurfaceChildSelf)
    // }

    this._parent = parent
  }

  /**
   *
   *  Set a short title for the surface.
   *
   *  This string may be used to identify the surface in a task bar,
   *  window list, or other user interface elements provided by the
   *  compositor.
   *
   *  The string must be encoded in UTF-8.
   *
   *
   * @param {XdgToplevel} resource
   * @param {string} title undefined
   *
   * @since 1
   *
   */
  setTitle (resource, title) {
    this._title = title
    this._userShellSurface.title = title
  }

  /**
   *
   *  Set an application identifier for the surface.
   *
   *  The app ID identifies the general class of applications to which
   *  the surface belongs. The compositor can use this to group multiple
   *  surfaces together, or to determine how to launch a new application.
   *
   *  For D-Bus activatable applications, the app ID is used as the D-Bus
   *  service name.
   *
   *  The compositor shell will try to group application surfaces together
   *  by their app ID. As a best practice, it is suggested to select app
   *  ID's that match the basename of the application's .desktop file.
   *  For example, "org.freedesktop.FooViewer" where the .desktop file is
   *  "org.freedesktop.FooViewer.desktop".
   *
   *  See the desktop-entry specification [0] for more details on
   *  application identifiers and how they relate to well-known D-Bus
   *  names and .desktop files.
   *
   *  [0] http://standards.freedesktop.org/desktop-entry-spec/
   *
   *
   * @param {XdgToplevel} resource
   * @param {string} appId undefined
   *
   * @since 1
   *
   */
  setAppId (resource, appId) {
    this._appId = appId
    this._userShellSurface.appId = appId
  }

  /**
   *
   *  Clients implementing client-side decorations might want to show
   *  a context menu when right-clicking on the decorations, giving the
   *  user a menu that they can use to maximize or minimize the window.
   *
   *  This request asks the compositor to pop up such a window menu at
   *  the given position, relative to the local surface coordinates of
   *  the parent surface. There are no guarantees as to what menu items
   *  the window menu contains.
   *
   *  This request must be used in response to some sort of user action
   *  like a button press, key press, or touch down event.
   *
   *
   * @param {XdgToplevel} resource
   * @param {GrSeat} seat the wl_seat of the user event
   * @param {Number} serial the serial of the user event
   * @param {Number} x the x position to pop up the window menu at
   * @param {Number} y the y position to pop up the window menu at
   *
   * @since 1
   *
   */
  showWindowMenu (resource, seat, serial, x, y) {
    const browserSeat = seat.implementation

    if (serial !== browserSeat.serial) {
      return
    }

    this._showWindowMenuAt(Point.create(x, y))
  }

  /**
   * @param {Point}point
   * @private
   */
  _showWindowMenuAt (point) {
    // TODO
  }

  /**
   *
   *  Start an interactive, user-driven move of the surface.
   *
   *  This request must be used in response to some sort of user action
   *  like a button press, key press, or touch down event. The passed
   *  serial is used to determine the type of interactive move (touch,
   *  pointer, etc).
   *
   *  The server may ignore move requests depending on the state of
   *  the surface (e.g. fullscreen or maximized), or if the passed serial
   *  is no longer valid.
   *
   *  If triggered, the surface will lose the focus of the device
   *  (wl_pointer, wl_touch, etc) used for the move. It is up to the
   *  compositor to visually indicate that the move is taking place, such as
   *  updating a pointer cursor, during the move. There is no guarantee
   *  that the device focus will return when the move is completed.
   *
   *
   * @param {XdgToplevel} resource
   * @param {GrSeat} seat the wl_seat of the user event
   * @param {Number} serial the serial of the user event
   *
   * @since 1
   *
   */
  move (resource, seat, serial) {
    if (this._configureState.state.includes(fullscreen) || this._configureState.state.includes(maximized)) {
      return
    }

    const browserSeat = seat.implementation

    // FIXME implement input serials
    // if (serial !== browserSeat.serial) {
    //   return
    // }

    const browserPointer = browserSeat.browserPointer
    const browserSurface = this.browserXdgSurface.grSurfaceResource.implementation
    const browserSurfaceChildSelf = browserSurface.browserSurfaceChildSelf
    const origPosition = browserSurfaceChildSelf.position

    const pointerX = browserPointer.x
    const pointerY = browserPointer.y

    const moveListener = () => {
      if (!this.mapped) {
        browserPointer.removeMouseMoveListener(moveListener)
        return
      }

      const deltaX = browserPointer.x - pointerX
      const deltaY = browserPointer.y - pointerY

      browserSurfaceChildSelf.position = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)

      const renderFrame = Renderer.createRenderFrame()
      browserSurface.browserSurfaceViews.forEach((view) => {
        view.applyTransformations(renderFrame)
      })
      renderFrame.fire()
    }

    browserPointer.onButtonRelease().then(() => {
      this.browserXdgSurface.grSurfaceResource.implementation.hasPointerInput = true
      browserPointer.removeMouseMoveListener(moveListener)
      browserPointer.setDefaultCursor()
    })

    this.browserXdgSurface.grSurfaceResource.implementation.hasPointerInput = false
    browserPointer.unsetFocus()
    browserPointer.addMouseMoveListener(moveListener)
    window.document.body.style.cursor = 'move'
  }

  /**
   *
   *  Start a user-driven, interactive resize of the surface.
   *
   *  This request must be used in response to some sort of user action
   *  like a button press, key press, or touch down event. The passed
   *  serial is used to determine the type of interactive resize (touch,
   *  pointer, etc).
   *
   *  The server may ignore resize requests depending on the state of
   *  the surface (e.g. fullscreen or maximized).
   *
   *  If triggered, the client will receive configure events with the
   *  "resize" state enum value and the expected sizes. See the "resize"
   *  enum value for more details about what is required. The client
   *  must also acknowledge configure events using "ack_configure". After
   *  the resize is completed, the client will receive another "configure"
   *  event without the resize state.
   *
   *  If triggered, the surface also will lose the focus of the device
   *  (wl_pointer, wl_touch, etc) used for the resize. It is up to the
   *  compositor to visually indicate that the resize is taking place,
   *  such as updating a pointer cursor, during the resize. There is no
   *  guarantee that the device focus will return when the resize is
   *  completed.
   *
   *  The edges parameter specifies how the surface should be resized,
   *  and is one of the values of the resize_edge enum. The compositor
   *  may use this information to update the surface position for
   *  example when dragging the top left corner. The compositor may also
   *  use this information to adapt its behavior, e.g. choose an
   *  appropriate cursor image.
   *
   *
   * @param {XdgToplevel} resource
   * @param {GrSeat} seat the wl_seat of the user event
   * @param {Number} serial the serial of the user event
   * @param {Number} edges which edge or corner is being dragged
   *
   * @since 1
   *
   */
  resize (resource, seat, serial, edges) {
    if (this._configureState.state.includes(fullscreen) || this._configureState.state.includes(maximized)) {
      return
    }

    const browserSeat = seat.implementation
    const browserPointer = browserSeat.browserPointer

    // FIXME implement input serial
    // if (browserSeat.serial !== serial) {
    //   return
    // }
    // assigned in switch statement
    let sizeAdjustment = (width, height, deltaX, deltaY) => {}

    switch (edges) {
      case bottomRight: {
        window.document.body.style.cursor = 'nwse-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width + deltaX, h: height + deltaY}
        }
        break
      }
      case top: {
        window.document.body.style.cursor = 'ns-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width, h: height - deltaY}
        }
        break
      }
      case bottom: {
        window.document.body.style.cursor = 'ns-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width, h: height + deltaY}
        }
        break
      }
      case left: {
        window.document.body.style.cursor = 'ew-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width - deltaX, h: height}
        }
        break
      }
      case topLeft: {
        window.document.body.style.cursor = 'nwse-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width - deltaX, h: height - deltaY}
        }
        break
      }
      case bottomLeft: {
        window.document.body.style.cursor = 'nesw-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width - deltaX, h: height + deltaY}
        }
        break
      }
      case right: {
        window.document.body.style.cursor = 'ew-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width + deltaX, h: height}
        }
        break
      }
      case topRight: {
        window.document.body.style.cursor = 'nesw-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width + deltaX, h: height - deltaY}
        }
        break
      }
      case none:
      default: {
        browserPointer.setDefaultCursor()
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width, h: height}
        }
        break
      }
    }

    const pointerX = browserPointer.x
    const pointerY = browserPointer.y
    const {width: windowGeometryWidth, height: windowGeometryHeight} = this.browserXdgSurface.windowGeometry

    const sizeCalculation = () => {
      const deltaX = browserPointer.x - pointerX
      const deltaY = browserPointer.y - pointerY

      const size = sizeAdjustment(windowGeometryWidth, windowGeometryHeight, deltaX, deltaY)
      const width = Math.max(this._minSize.x, Math.min(size.w, this._maxSize.x))
      const height = Math.max(this._minSize.y, Math.min(size.h, this._maxSize.y))

      return Size.create(width, height)
    }

    const resizeListener = () => {
      if (!this.mapped) {
        browserPointer.removeMouseMoveListener(resizeListener)
        return
      }

      const {w: width, h: height} = sizeCalculation()
      this._emitConfigure(resource, width, height, [activated, resizing], edges)
    }

    browserPointer.onButtonRelease().then(() => {
      this.browserXdgSurface.grSurfaceResource.implementation.hasPointerInput = true
      browserPointer.removeMouseMoveListener(resizeListener)
      browserPointer.setDefaultCursor()

      const {w: width, h: height} = sizeCalculation()
      this._emitConfigure(resource, width, height, [activated], none)
    })

    this.browserXdgSurface.grSurfaceResource.implementation.hasPointerInput = false
    browserPointer.unsetFocus()
    browserPointer.addMouseMoveListener(resizeListener)
  }

  /**
   * @param {XdgToplevel} resource
   * @param {number}width
   * @param {number}height
   * @param {number[]}states
   * @param {number}resizeEdge
   * @private
   */
  _emitConfigure (resource, width, height, states, resizeEdge) {
    resource.configure(width, height, Uint32Array.from(states))
    this.browserXdgSurface.emitConfigureDone()
    this._pendingConfigureStates.push({
      serial: this.browserXdgSurface.configureSerial,
      state: states,
      width: width,
      height: height,
      resizeEdge: resizeEdge
    })
  }

  /**
   *
   *  Set a maximum size for the window.
   *
   *  The client can specify a maximum size so that the compositor does
   *  not try to configure the window beyond this size.
   *
   *  The width and height arguments are in window geometry coordinates.
   *  See xdg_surface.set_window_geometry.
   *
   *  Values set in this way are double-buffered. They will get applied
   *  on the next commit.
   *
   *  The compositor can use this information to allow or disallow
   *  different states like maximize or fullscreen and draw accurate
   *  animations.
   *
   *  Similarly, a tiling window manager may use this information to
   *  place and resize client windows in a more effective way.
   *
   *  The client should not rely on the compositor to obey the maximum
   *  size. The compositor may decide to ignore the values set by the
   *  client and request a larger size.
   *
   *  If never set, or a value of zero in the request, means that the
   *  client has no expected maximum size in the given dimension.
   *  As a result, a client wishing to reset the maximum size
   *  to an unspecified state can use zero for width and height in the
   *  request.
   *
   *  Requesting a maximum size to be smaller than the minimum size of
   *  a surface is illegal and will result in a protocol error.
   *
   *  The width and height must be greater than or equal to zero. Using
   *  strictly negative values for width and height will result in a
   *  protocol error.
   *
   *
   * @param {XdgToplevel} resource
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
   */
  setMaxSize (resource, width, height) {
    if (width < 0 || height < 0 || width < this._minSize.x || height < this._minSize.y) {
      // TODO raise protocol error
      return
    }
    this._pendingMaxSize = Point.create(
      width === 0 ? Number.MAX_SAFE_INTEGER : width,
      height === 0 ? Number.MAX_SAFE_INTEGER : height
    )
  }

  /**
   *
   *  Set a minimum size for the window.
   *
   *  The client can specify a minimum size so that the compositor does
   *  not try to configure the window below this size.
   *
   *  The width and height arguments are in window geometry coordinates.
   *  See xdg_surface.set_window_geometry.
   *
   *  Values set in this way are double-buffered. They will get applied
   *  on the next commit.
   *
   *  The compositor can use this information to allow or disallow
   *  different states like maximize or fullscreen and draw accurate
   *  animations.
   *
   *  Similarly, a tiling window manager may use this information to
   *  place and resize client windows in a more effective way.
   *
   *  The client should not rely on the compositor to obey the minimum
   *  size. The compositor may decide to ignore the values set by the
   *  client and request a smaller size.
   *
   *  If never set, or a value of zero in the request, means that the
   *  client has no expected minimum size in the given dimension.
   *  As a result, a client wishing to reset the minimum size
   *  to an unspecified state can use zero for width and height in the
   *  request.
   *
   *  Requesting a minimum size to be larger than the maximum size of
   *  a surface is illegal and will result in a protocol error.
   *
   *  The width and height must be greater than or equal to zero. Using
   *  strictly negative values for width and height will result in a
   *  protocol error.
   *
   *
   * @param {XdgToplevel} resource
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
   */
  setMinSize (resource, width, height) {
    if (width < 0 || height < 0 || width > this._maxSize.x || height > this._maxSize.y) {
      // TODO raise protocol error
      return
    }
    this._pendingMinSize = Point.create(width, height)
  }

  /**
   *
   *  Maximize the surface.
   *
   *  After requesting that the surface should be maximized, the compositor
   *  will respond by emitting a configure event with the "maximized" state
   *  and the required window geometry. The client should then update its
   *  content, drawing it in a maximized state, i.e. without shadow or other
   *  decoration outside of the window geometry. The client must also
   *  acknowledge the configure when committing the new content (see
   *  ack_configure).
   *
   *  It is up to the compositor to decide how and where to maximize the
   *  surface, for example which output and what region of the screen should
   *  be used.
   *
   *  If the surface was already maximized, the compositor will still emit
   *  a configure event with the "maximized" state.
   *
   *  If the surface is in a fullscreen state, this request has no direct
   *  effect. It will alter the state the surface is returned to when
   *  unmaximized if not overridden by the compositor.
   *
   *
   * @param {XdgToplevel} resource
   *
   * @since 1
   *
   */
  setMaximized (resource) {
    if (this._configureState.state.includes(resizing)) {
      return
    }

    const {width: workspaceWidth, height: workspaceHeight} = document.getElementById('workspace').getBoundingClientRect()
    const maxWidth = Math.round(workspaceWidth)
    const maxHeight = Math.round(workspaceHeight)

    if (this._configureState.state.includes(fullscreen)) {
      this._unfullscreenConfigureState = {
        state: [maximized, activated],
        width: maxWidth,
        height: maxHeight
      }
    } else {
      this._emitConfigure(resource, maxWidth, maxHeight, [maximized, activated], none)
    }
  }

  /**
   *
   *  Unmaximize the surface.
   *
   *  After requesting that the surface should be unmaximized, the compositor
   *  will respond by emitting a configure event without the "maximized"
   *  state. If available, the compositor will include the window geometry
   *  dimensions the window had prior to being maximized in the configure
   *  event. The client must then update its content, drawing it in a
   *  regular state, i.e. potentially with shadow, etc. The client must also
   *  acknowledge the configure when committing the new content (see
   *  ack_configure).
   *
   *  It is up to the compositor to position the surface after it was
   *  unmaximized; usually the position the surface had before maximizing, if
   *  applicable.
   *
   *  If the surface was already not maximized, the compositor will still
   *  emit a configure event without the "maximized" state.
   *
   *  If the surface is in a fullscreen state, this request has no direct
   *  effect. It will alter the state the surface is returned to when
   *  unmaximized if not overridden by the compositor.
   *
   *
   * @param {XdgToplevel} resource
   *
   * @since 1
   *
   */
  unsetMaximized (resource) {
    if (this._configureState.state.includes(resizing)) {
      return
    }

    if (this._configureState.state.includes(fullscreen) && this._previousGeometry) {
      this._unfullscreenConfigureState = {
        state: [activated],
        width: this._previousGeometry.width,
        height: this._previousGeometry.height
      }
    } else if (this._configureState.state.includes(maximized) && this._previousGeometry) {
      this._emitConfigure(resource, this._previousGeometry.width, this._previousGeometry.height, [activated], none)
    } else {
      this._emitConfigure(resource, 0, 0, [activated], none)
    }
  }

  /**
   *
   *  Make the surface fullscreen.
   *
   *  After requesting that the surface should be fullscreened, the
   *  compositor will respond by emitting a configure event with the
   *  "fullscreen" state and the fullscreen window geometry. The client must
   *  also acknowledge the configure when committing the new content (see
   *  ack_configure).
   *
   *  The output passed by the request indicates the client's preference as
   *  to which display it should be set fullscreen on. If this value is NULL,
   *  it's up to the compositor to choose which display will be used to map
   *  this surface.
   *
   *  If the surface doesn't cover the whole output, the compositor will
   *  position the surface in the center of the output and compensate with
   *  with border fill covering the rest of the output. The content of the
   *  border fill is undefined, but should be assumed to be in some way that
   *  attempts to blend into the surrounding area (e.g. solid black).
   *
   *  If the fullscreened surface is not opaque, the compositor must make
   *  sure that other screen content not part of the same surface tree (made
   *  up of subsurfaces, popups or similarly coupled surfaces) are not
   *  visible below the fullscreened surface.
   *
   *
   * @param {XdgToplevel} resource
   * @param {?GrOutput} output undefined
   *
   * @since 1
   *
   */
  setFullscreen (resource, output) {
    this._emitConfigure(resource, window.innerWidth, window.innerHeight, [fullscreen, activated], none)
  }

  /**
   *
   *  Make the surface no longer fullscreen.
   *
   *  After requesting that the surface should be unfullscreened, the
   *  compositor will respond by emitting a configure event without the
   *  "fullscreen" state.
   *
   *  Making a surface unfullscreen sets states for the surface based on the following:
   *  * the state(s) it may have had before becoming fullscreen
   *  * any state(s) decided by the compositor
   *  * any state(s) requested by the client while the surface was fullscreen
   *
   *  The compositor may include the previous window geometry dimensions in
   *  the configure event, if applicable.
   *
   *  The client must also acknowledge the configure when committing the new
   *  content (see ack_configure).
   *
   *
   * @param {XdgToplevel} resource
   *
   * @since 1
   *
   */
  unsetFullscreen (resource) {
    if (this._configureState.state.includes(fullscreen)) {
      if (this._unfullscreenConfigureState) {
        this._emitConfigure(resource, this._unfullscreenConfigureState.width, this._unfullscreenConfigureState.height, this._unfullscreenConfigureState.state, none)
      } else if (this._previousGeometry) {
        this._emitConfigure(resource, this._previousGeometry.width, this._previousGeometry.height, [activated], none)
      } else {
        this._emitConfigure(resource, 0, 0, [activated], none)
      }
    }
  }

  /**
   *
   *  Request that the compositor minimize your surface. There is no
   *  way to know if the surface is currently minimized, nor is there
   *  any way to unset minimization on this surface.
   *
   *  If you are looking to throttle redrawing when minimized, please
   *  instead use the wl_surface.frame event for this, as this will
   *  also work with live previews on windows in Alt-Tab, Expose or
   *  similar compositor features.
   *
   *
   * @param {XdgToplevel} resource
   *
   * @since 1
   *
   */
  setMinimized (resource) {
    this._userShellSurface.minimize()
  }
}
