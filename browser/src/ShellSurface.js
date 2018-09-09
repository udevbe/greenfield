'use strict'

import GrShellSurfaceRequests from './protocol/GrShellSurfaceRequests'
import GrShellSurfaceResource from './protocol/GrShellSurfaceResource'

import Point from './math/Point'
import Renderer from './render/Renderer'

const {bottom, bottomLeft, bottomRight, left, none, right, top, topLeft, topRight} = GrShellSurfaceResource.Resize
const {inactive} = GrShellSurfaceResource.Transient

const SurfaceStates = {
  MAXIMIZED: 'maximized',
  FULLSCREEN: 'fullscreen',
  POPUP: 'popup',
  TRANSIENT: 'transient',
  TOP_LEVEL: 'top_level'
}

/**
 *
 *            An interface that may be implemented by a gr_surface, for
 *            implementations that provide a desktop-style user interface.
 *
 *            It provides requests to treat surfaces like toplevel, fullscreen
 *            or popup windows, move, resize or maximize them, associate
 *            metadata like title and class, etc.
 *
 *            On the server side the object is automatically destroyed when
 *            the related gr_surface is destroyed. On the client side,
 *            gr_shell_surface_destroy() must be called before destroying
 *            the gr_surface object.
 *
 *  @implements {SurfaceRole}
 *  @implements {GrShellSurfaceRequests}
 *
 */
export default class ShellSurface extends GrShellSurfaceRequests {
  /**
   * @param {GrShellSurfaceResource}grShellSurfaceResource
   * @param {GrSurfaceResource}grSurfaceResource
   * @param {Session} session
   * @param {UserShell}userShell
   * @return {ShellSurface}
   */
  static create (grShellSurfaceResource, grSurfaceResource, session, userShell) {
    const shellSurface = new ShellSurface(grShellSurfaceResource, grSurfaceResource, session, userShell)
    grShellSurfaceResource.implementation = shellSurface

    // destroy the shell-surface if the surface is destroyed.
    grSurfaceResource.onDestroy().then(() => {
      grShellSurfaceResource.destroy()
    })

    grSurfaceResource.implementation.role = shellSurface
    shellSurface._doPing(grShellSurfaceResource)

    grShellSurfaceResource.onDestroy().then(() => {
      shellSurface._unmap()
      shellSurface._userShellSurface.destroy()
    })

    return shellSurface
  }

  /**
   * @private
   * @param {GrShellSurfaceResource}grShellSurfaceResource
   * @param {GrSurfaceResource}grSurfaceResource
   * @param {Session} session
   * @param {UserShell}userShell
   */
  constructor (grShellSurfaceResource, grSurfaceResource, session, userShell) {
    super()
    /**
     * @type {GrShellSurfaceResource}
     */
    this.resource = grShellSurfaceResource
    /**
     * @type {GrSurfaceResource}
     */
    this.grSurfaceResource = grSurfaceResource
    /**
     * @type {string}
     * @private
     */
    this._title = ''
    /**
     * @type {string}
     * @private
     */
    this._clazz = ''
    /**
     * @type {string}
     */
    this.state = null
    /**
     * @type {Session}
     */
    this.session = session
    /**
     * @type {UserShell}
     * @private
     */
    this._userShell = userShell
    /**
     * @type {boolean}
     * @private
     */
    this._pingTimeoutActive = false
    /**
     * @type {UserShellSurface}
     * @private
     */
    this._userShellSurface = null
    /**
     * @type {number}
     * @private
     */
    this._timeoutTimer = 0
    /**
     * @type {boolean}
     * @private
     */
    this._mapped = false
  }

  /**
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: EncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<Callback>, roleState: *}}newState
   * @return {Promise<void>}
   * @override
   */
  async onCommit (surface, renderFrame, newState) {
    const oldPosition = surface.surfaceChildSelf.position
    surface.surfaceChildSelf.position = Point.create(oldPosition.x + newState.dx, oldPosition.y + newState.dy)

    if (newState.bufferContents) {
      if (!this._mapped) {
        this._map()
      }
    } else {
      if (this._mapped) {
        this._unmap()
      }
    }

    await surface.render(renderFrame, newState)
    renderFrame.fire()
    await renderFrame
    this.session.flush()
  }

  /**
   * @private
   */
  _map () {
    this._mapped = true
    if (this._userShellSurface) {
      this._userShellSurface.mapped = true
    }
  }

  /**
   * @private
   */
  _unmap () {
    this._mapped = false
    if (this._userShellSurface) {
      this._userShellSurface.mapped = false
    }
  }

  /**
   *
   *                A client must respond to a ping event with a pong request or
   *                the client may be deemed unresponsive.
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {Number} serial serial number of the ping event
   *
   * @since 1
   * @override
   */
  pong (resource, serial) {
    if (this._pingTimeoutActive) {
      this._removeClassRecursively(/** @type {Surface} */this.grSurfaceResource.implementation, 'fadeToUnresponsive')
      this._pingTimeoutActive = false
    }
    window.clearTimeout(this._timeoutTimer)
    const doPingTimer = window.setTimeout(() => {
      this._doPing(resource)
    }, 1000)
    this.grSurfaceResource.onDestroy().then(() => {
      window.clearTimeout(doPingTimer)
    })
  }

  /**
   * @param {GrShellSurfaceResource} resource
   * @private
   */
  _doPing (resource) {
    this._timeoutTimer = window.setTimeout(() => {
      if (!this._pingTimeoutActive) {
        // ping timed out, make view gray
        this._pingTimeoutActive = true
        this._addClassRecursively(this.grSurfaceResource.implementation, 'fadeToUnresponsive')
      }
    }, 3000)
    this.grSurfaceResource.onDestroy().then(() => {
      window.clearTimeout(this._timeoutTimer)
    })
    resource.ping(0)
    this.session.flush()
  }

  /**
   * @param {Surface}surface
   * @param {string}cssClass
   * @private
   */
  _removeClassRecursively (surface, cssClass) {
    surface.views.forEach((view) => {
      view.bufferedCanvas.removeCssClass(cssClass)
    })
    surface.surfaceChildren.forEach((surfaceChild) => {
      if (surfaceChild.surface !== surface) {
        this._removeClassRecursively(surfaceChild.surface, cssClass)
      }
    })
  }

  /**
   * @param {Surface}surface
   * @param {string}cssClass
   * @private
   */
  _addClassRecursively (surface, cssClass) {
    surface.views.forEach((view) => {
      view.bufferedCanvas.addCssClass(cssClass)
    })
    surface.surfaceChildren.forEach((surfaceChild) => {
      if (surfaceChild.surface !== surface) {
        this._addClassRecursively(surfaceChild.surface, cssClass)
      }
    })
  }

  /**
   *
   *                Start a pointer-driven move of the surface.
   *
   *                This request must be used in response to a button press event.
   *                The server may ignore move requests depending on the state of
   *                the surface (e.g. fullscreen or maximized).
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {GrSeatResource} grSeatResource seat whose pointer is used
   * @param {Number} serial serial number of the implicit grab on the pointer
   *
   * @since 1
   * @override
   */
  move (resource, grSeatResource, serial) {
    const seat = /** @type {Seat} */grSeatResource.implementation

    if (!seat.isValidInputSerial(serial)) {
      DEBUG && console.log('move serial mismatch. Ignoring.')
      return
    }

    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }
    const pointer = seat.pointer
    const surface = this.grSurfaceResource.implementation
    const surfaceChildSelf = surface.surfaceChildSelf
    const origPosition = surfaceChildSelf.position

    const pointerX = pointer.x
    const pointerY = pointer.y

    const moveListener = () => {
      const deltaX = pointer.x - pointerX
      const deltaY = pointer.y - pointerY

      // TODO we could try to be smart, and only apply the latest move, depending on how often the render frame fires.
      surfaceChildSelf.position = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)

      const renderFrame = Renderer.createRenderFrame()
      surface.views.forEach((view) => {
        view.applyTransformations(renderFrame)
      })
      renderFrame.fire()
    }

    pointer.onButtonRelease().then(() => {
      pointer.removeMouseMoveListener(moveListener)
    })
    pointer.addMouseMoveListener(moveListener)
  }

  /**
   *
   *                Start a pointer-driven resizing of the surface.
   *
   *                This request must be used in response to a button press event.
   *                The server may ignore resize requests depending on the state of
   *                the surface (e.g. fullscreen or maximized).
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {GrSeatResource} grSeatResource seat whose pointer is used
   * @param {number} serial serial number of the implicit grab on the pointer
   * @param {number} edges which edge or corner is being dragged
   *
   * @since 1
   * @override
   */
  resize (resource, grSeatResource, serial, edges) {
    const seat = /** @type {Seat} */grSeatResource.implementation
    if (!seat.isValidInputSerial(serial)) {
      DEBUG && console.log('resize serial mismatch. Ignoring.')
      return
    }

    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }

    const pointer = seat.pointer
    // assigned in switch statement
    let sizeAdjustment = (width, height, deltaX, deltaY) => {}

    switch (edges) {
      case bottomRight: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width + deltaX, h: height + deltaY}
        }
        break
      }
      case top: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width, h: height - deltaY}
        }
        break
      }
      case bottom: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width, h: height + deltaY}
        }
        break
      }
      case left: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width - deltaX, h: height}
        }
        break
      }
      case topLeft: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width - deltaX, h: height - deltaY}
        }
        break
      }
      case bottomLeft: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width - deltaX, h: height + deltaY}
        }
        break
      }
      case right: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width + deltaX, h: height}
        }
        break
      }
      case topRight: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width + deltaX, h: height - deltaY}
        }
        break
      }
      case none:
      default: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {w: width, h: height}
        }
        break
      }
    }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const {w: surfaceWidth, h: surfaceHeight} = this.grSurfaceResource.implementation.size

    const resizeListener = () => {
      const deltaX = pointer.x - pointerX
      const deltaY = pointer.y - pointerY

      const size = sizeAdjustment(surfaceWidth, surfaceHeight, deltaX, deltaY)
      this.resource.configure(edges, size.w, size.h)
    }
    pointer.onButtonRelease().then(() => {
      pointer.removeMouseMoveListener(resizeListener)
    })
    pointer.addMouseMoveListener(resizeListener)
  }

  /**
   * @private
   */
  _createUserShellSurface () {
    this._userShellSurface = this._userShell.manage(/** @type {Surface} */this.grSurfaceResource.implementation)
    this._userShellSurface.onActivationRequest = () => {
      this._userShellSurface.activationAck()
    }
    this._userShellSurface.onInactive = () => {
      // I don't think we need to do something here?
    }
    this._userShellSurface.title = this._title
    this._userShellSurface.appId = this._clazz
    this._userShellSurface.mapped = this._mapped
  }

  /**
   *
   *                Map the surface as a toplevel surface.
   *
   *                A toplevel surface is not fullscreen, maximized or transient.
   *
   *
   * @param {GrShellSurfaceResource} resource
   *
   * @since 1
   * @override
   */
  setToplevel (resource) {
    if (this.state === SurfaceStates.POPUP || this.state === SurfaceStates.TRANSIENT) {
      return
    }

    if (!this._userShellSurface) {
      this._createUserShellSurface()
    }
    this.state = SurfaceStates.TOP_LEVEL
  }

  /**
   *
   *                Map the surface relative to an existing surface.
   *
   *                The x and y arguments specify the location of the upper left
   *                corner of the surface relative to the upper left corner of the
   *                parent surface, in surface-local coordinates.
   *
   *                The flags argument controls details of the transient behaviour.
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {GrSurfaceResource} parent parent surface
   * @param {number} x surface-local x coordinate
   * @param {number} y surface-local y coordinate
   * @param {number} flags transient surface behavior
   *
   * @since 1
   * @override
   */
  setTransient (resource, parent, x, y, flags) {
    if (this.state === SurfaceStates.POPUP || this.state === SurfaceStates.TOP_LEVEL) {
      return
    }

    const parentPosition = parent.implementation.surfaceChildSelf.position

    const surface = this.grSurfaceResource.implementation
    const surfaceChild = surface.surfaceChildSelf
    // FIXME we probably want to provide a method to translate from (abstract) surface space to global space
    surfaceChild.position = Point.create(parentPosition.x + x, parentPosition.y + y)

    this.grSurfaceResource.implementation.hasKeyboardInput = (flags & inactive) === 0

    if (!this._userShellSurface) {
      this._createUserShellSurface()
    }
    this.state = SurfaceStates.TRANSIENT
  }

  /**
   *
   *                Map the surface as a fullscreen surface.
   *
   *                If an output parameter is given then the surface will be made
   *                fullscreen on that output. If the client does not specify the
   *                output then the compositor will apply its policy - usually
   *                choosing the output on which the surface has the biggest surface
   *                area.
   *
   *                The client may specify a method to resolve a size conflict
   *                between the output size and the surface size - this is provided
   *                through the method parameter.
   *
   *                The framerate parameter is used only when the method is set
   *                to "driver", to indicate the preferred framerate. A value of 0
   *                indicates that the client does not care about framerate.  The
   *                framerate is specified in mHz, that is framerate of 60000 is 60Hz.
   *
   *                A method of "scale" or "driver" implies a scaling operation of
   *                the surface, either via a direct scaling operation or a change of
   *                the output mode. This will override any kind of output scaling, so
   *                that mapping a surface with a buffer size equal to the mode can
   *                fill the screen independent of buffer_scale.
   *
   *                A method of "fill" means we don't scale up the buffer, however
   *                any output scale is applied. This means that you may run into
   *                an edge case where the application maps a buffer with the same
   *                size of the output mode but buffer_scale 1 (thus making a
   *                surface larger than the output). In this case it is allowed to
   *                downscale the results to fit the screen.
   *
   *                The compositor must reply to this request with a configure event
   *                with the dimensions for the output on which the surface will
   *                be made fullscreen.
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {number} method method for resolving size conflict
   * @param {number} framerate framerate in mHz
   * @param {GrOutputResource|null} output output on which the surface is to be fullscreen
   *
   * @since 1
   * @override
   */
  setFullscreen (resource, method, framerate, output) {
    this.state = SurfaceStates.FULLSCREEN
    const surface = this.grSurfaceResource.implementation
    // TODO get proper size in surface coordinates instead of assume surface space === global space
    surface.surfaceChildSelf.position = Point.create(0, 0)
    this.resource.configure(none, window.innerWidth, window.innerHeight)
  }

  /**
   *
   *                Map the surface as a popup.
   *
   *                A popup surface is a transient surface with an added pointer
   *                grab.
   *
   *                An existing implicit grab will be changed to owner-events mode,
   *                and the popup grab will continue after the implicit grab ends
   *                (i.e. releasing the mouse button does not cause the popup to
   *                be unmapped).
   *
   *                The popup grab continues until the window is destroyed or a
   *                mouse button is pressed in any other client's window. A click
   *                in any of the client's surfaces is reported as normal, however,
   *                clicks in other clients' surfaces will be discarded and trigger
   *                the callback.
   *
   *                The x and y arguments specify the location of the upper left
   *                corner of the surface relative to the upper left corner of the
   *                parent surface, in surface-local coordinates.
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {GrSeatResource} grSeatResource seat whose pointer is used
   * @param {number} serial serial number of the implicit grab on the pointer
   * @param {GrSurfaceResource} parent parent surface
   * @param {number} x surface-local x coordinate
   * @param {number} y surface-local y coordinate
   * @param {number} flags transient surface behavior
   *
   * @since 1
   * @override
   */
  async setPopup (resource, grSeatResource, serial, parent, x, y, flags) {
    const seat = /** @type {Seat} */grSeatResource.implementation
    // FIXME we can receive an older serial in case a popup is triggered from an older mouse down + mouse move
    // if (serial !== seat.inputSerial) {
    //   this._dismiss()
    //   DEBUG && console.log('Popup grab input serial mismatch. Ignoring.')
    //   return
    // }

    if (this.state) { return }

    const pointer = seat.pointer
    this.state = SurfaceStates.POPUP
    const surface = /** @type {Surface} */this.grSurfaceResource.implementation
    const surfaceChild = surface.surfaceChildSelf
    surfaceChild.position = Point.create(x, y)
    const onNewView = (view) => {
      const renderFrame = Renderer.createRenderFrame()
      view.applyTransformations(renderFrame)
      renderFrame.fire()
      view.onDestroy().then(() => {
        view.detach()
      })
    }
    // having added this shell-surface to a parent will have it create a view for each parent view
    const views = parent.implementation.addChild(surfaceChild)
    views.forEach(onNewView)
    // this handles the case where a view is created later on (ie if a new parent view is created)
    surface.onViewCreated = onNewView

    surface.hasKeyboardInput = (flags & inactive) === 0

    // handle popup window grab
    await pointer.popupGrab(this.grSurfaceResource)
    resource.popupDone()
  }

  /**
   *
   *                Map the surface as a maximized surface.
   *
   *                If an output parameter is given then the surface will be
   *                maximized on that output. If the client does not specify the
   *                output then the compositor will apply its policy - usually
   *                choosing the output on which the surface has the biggest surface
   *                area.
   *
   *                The compositor will reply with a configure event telling
   *                the expected new surface size. The operation is completed
   *                on the next buffer attach to this surface.
   *
   *                A maximized surface typically fills the entire output it is
   *                bound to, except for desktop elements such as panels. This is
   *                the main difference between a maximized shell surface and a
   *                fullscreen shell surface.
   *
   *                The details depend on the compositor implementation.
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {?*} output output on which the surface is to be maximized
   *
   * @since 1
   * @override
   */
  setMaximized (resource, output) {
    this.state = SurfaceStates.MAXIMIZED
    const surface = this.grSurfaceResource.implementation

    // TODO get proper size in surface coordinates instead of assume surface space === global space
    const x = 0
    const {height: y} = this._userShell.panel.getBoundingClientRect()
    const {width, height} = this._userShell.workspace.getBoundingClientRect()

    surface.surfaceChildSelf.position = Point.create(x, y)
    this.resource.configure(none, width, height)
  }

  /**
   *
   *                Set a short title for the surface.
   *
   *                This string may be used to identify the surface in a task bar,
   *                window list, or other user interface elements provided by the
   *                compositor.
   *
   *                The string must be encoded in UTF-8.
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {string} title surface title
   *
   * @since 1
   * @override
   */
  setTitle (resource, title) {
    this._title = title
    if (this._userShellSurface) {
      this._userShellSurface.title = title
    }
  }

  /**
   *
   *                Set a class for the surface.
   *
   *                The surface class identifies the general class of applications
   *                to which the surface belongs. A common convention is to use the
   *                file name (or the full path if it is a non-standard location) of
   *                the application's .desktop file as the class.
   *
   *
   * @param {GrShellSurfaceResource} resource
   * @param {string} clazz surface class
   *
   * @since 1
   * @override
   */
  setClass (resource, clazz) {
    this._clazz = clazz
    if (this._userShellSurface) {
      this._userShellSurface.appId = clazz
    }
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
