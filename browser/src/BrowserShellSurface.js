'use strict'

const SurfaceStates = {
  TOP_LEVEL: 'toplevel',
  MAXIMIZED: 'maximized',
  TRANSIENT: 'transient',
  FULLSCREEN: 'fullscreen',
  POPUP: 'popup'
}

export default class BrowserShellSurface {
  /**
   * @param {GrShellSurface}grShellSurfaceResource
   * @param {GrSurface}grSurfaceResource
   * @return {BrowserShellSurface}
   */
  static create (grShellSurfaceResource, grSurfaceResource) {
    const browserSurface = grSurfaceResource.implementation
    const browserSurfaceView = browserSurface.createView()
    browserSurfaceView.enableMouseListeners()
    document.body.appendChild(browserSurfaceView.canvas)

    const browserShellSurface = new BrowserShellSurface(grShellSurfaceResource, grSurfaceResource, browserSurfaceView)
    browserShellSurface.implementation = browserShellSurface

    grSurfaceResource.onDestroy().then(() => {
      grShellSurfaceResource.destroy()
    })

    browserSurface.role = browserShellSurface
    return browserShellSurface
  }

  /**
   * @private
   * @param {GrShellSurface}grShellSurfaceResource
   * @param {GrSurface}grSurfaceResource
   * @param {BrowserSurfaceView}browserSurfaceView
   */
  constructor (grShellSurfaceResource, grSurfaceResource, browserSurfaceView) {
    this.resource = grShellSurfaceResource
    this.grSurfaceResource = grSurfaceResource
    this.title = ''
    this.clazz = ''
    this.view = browserSurfaceView
    this.state = SurfaceStates.TOP_LEVEL
  }

  /**
   *
   *                A client must respond to a ping event with a pong request or
   *                the client may be deemed unresponsive.
   *
   *
   * @param {GrShellSurface} resource
   * @param {Number} serial serial number of the ping event
   *
   * @since 1
   *
   */
  pong (resource, serial) {
    window.setTimeout(() => resource.ping(), 3000)
  }

  onCommit () {
    this.view.canvas.width = this.grSurfaceResource.implementation.bufferSize.w
    this.view.canvas.height = this.grSurfaceResource.implementation.bufferSize.h
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
   * @param {GrShellSurface} resource
   * @param {*} seat seat whose pointer is used
   * @param {Number} serial serial number of the implicit grab on the pointer
   *
   * @since 1
   *
   */
  move (resource, seat, serial) {
    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }
    const browserSeat = seat.implementation
    const browserPointer = browserSeat.browserPointer
    if (browserPointer.buttonSerial === serial) {
      const canvasX = parseInt(this.view.canvas.style.left, 10)
      const canvasY = parseInt(this.view.canvas.style.top, 10)

      const pointerX = browserPointer.x
      const pointerY = browserPointer.y

      const moveListener = () => {
        if (browserPointer.grab && browserPointer.grab.view.browserSurface === this.grSurfaceResource.implementation) {
          const deltaX = browserPointer.x - pointerX
          const deltaY = browserPointer.y - pointerY

          this.view.canvas.style.left = (canvasX + deltaX) + 'px'
          this.view.canvas.style.top = (canvasY + deltaY) + 'px'
        } else {
          browserPointer.removeMouseMoveListener(moveListener)
        }
      }
      browserPointer.addMouseMoveListener(moveListener)
    }
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
   * @param {GrShellSurface} resource
   * @param {*} seat seat whose pointer is used
   * @param {Number} serial serial number of the implicit grab on the pointer
   * @param {Number} edges which edge or corner is being dragged
   *
   * @since 1
   *
   */
  resize (resource, seat, serial, edges) {}

  /**
   *
   *                Map the surface as a toplevel surface.
   *
   *                A toplevel surface is not fullscreen, maximized or transient.
   *
   *
   * @param {GrShellSurface} resource
   *
   * @since 1
   *
   */
  setToplevel (resource) {
    this.state = SurfaceStates.TOP_LEVEL
    document.body.appendChild(this.view.canvas)
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
   * @param {GrShellSurface} resource
   * @param {*} parent parent surface
   * @param {Number} x surface-local x coordinate
   * @param {Number} y surface-local y coordinate
   * @param {Number} flags transient surface behavior
   *
   * @since 1
   *
   */
  setTransient (resource, parent, x, y, flags) {

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
   * @param {GrShellSurface} resource
   * @param {Number} method method for resolving size conflict
   * @param {Number} framerate framerate in mHz
   * @param {?*} output output on which the surface is to be fullscreen
   *
   * @since 1
   *
   */
  setFullscreen (resource, method, framerate, output) {}

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
   * @param {GrShellSurface} resource
   * @param {*} seat seat whose pointer is used
   * @param {Number} serial serial number of the implicit grab on the pointer
   * @param {*} parent parent surface
   * @param {Number} x surface-local x coordinate
   * @param {Number} y surface-local y coordinate
   * @param {Number} flags transient surface behavior
   *
   * @since 1
   *
   */
  setPopup (resource, seat, serial, parent, x, y, flags) {}

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
   * @param {GrShellSurface} resource
   * @param {?*} output output on which the surface is to be maximized
   *
   * @since 1
   *
   */
  setMaximized (resource, output) {}

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
   * @param {GrShellSurface} resource
   * @param {string} title surface title
   *
   * @since 1
   *
   */
  setTitle (resource, title) {
    this.title = title
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
   * @param {GrShellSurface} resource
   * @param {string} clazz surface class
   *
   * @since 1
   *
   */
  setClass (resource, clazz) {
    this.clazz = clazz
  }
}
