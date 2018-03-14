'use strict'

import Point from './math/Point'
import greenfield from './protocol/greenfield-browser-protocol'

const Resize = greenfield.GrShellSurface.Resize

const SurfaceStates = {
  MAXIMIZED: 'maximized',
  FULLSCREEN: 'fullscreen'
}

const SurfaceType = {
  POPUP: 'maximized',
  TRANSIENT: 'fullscreen',
  TOP_LEVEL: 'top_level'
}

export default class BrowserShellSurface {
  /**
   * @param {GrShellSurface}grShellSurfaceResource
   * @param {GrSurface}grSurfaceResource
   * @param {BrowserSession} browserSession
   * @param {DesktopShell}desktopShell
   * @return {BrowserShellSurface}
   */
  static create (grShellSurfaceResource, grSurfaceResource, browserSession, desktopShell) {
    const browserSurface = grSurfaceResource.implementation

    const browserShellSurface = new BrowserShellSurface(grShellSurfaceResource, grSurfaceResource, browserSession, desktopShell)
    browserShellSurface.implementation = browserShellSurface

    // destroy the shell-surface if the surface is destroyed.
    grSurfaceResource.onDestroy().then(() => {
      grShellSurfaceResource.destroy()
    })

    browserSurface.role = browserShellSurface
    browserShellSurface._doPing(grShellSurfaceResource)

    return browserShellSurface
  }

  /**
   * @private
   * @param {GrShellSurface}grShellSurfaceResource
   * @param {GrSurface}grSurfaceResource
   * @param {BrowserSession} browserSession
   * @param {DesktopShell}desktopShell
   */
  constructor (grShellSurfaceResource, grSurfaceResource, browserSession, desktopShell) {
    /**
     * @type {GrShellSurface}
     */
    this.resource = grShellSurfaceResource
    /**
     * @type {GrSurface}
     */
    this.grSurfaceResource = grSurfaceResource
    /**
     * @type {string}
     */
    this.title = ''
    /**
     * @type {string}
     */
    this.clazz = ''
    /**
     * @type {string}
     */
    this.state = null
    /**
     * @type {null}
     */
    this.type = null
    /**
     * @type {BrowserSession}
     */
    this.browserSession = browserSession
    /**
     * @type {DesktopShell}
     * @private
     */
    this._desktopShell = desktopShell
    /**
     * @type {boolean}
     * @private
     */
    this._pingTimeoutActive = false
    /**
     * @type {DesktopShellEntry}
     * @private
     */
    this._desktopShellEntry = null
  }

  /**
   * @param {BrowserSurface}browserSurface
   */
  onCommit (browserSurface) {
    const oldPosition = browserSurface.browserSurfaceChildSelf.position
    browserSurface.browserSurfaceChildSelf.position = Point.create(oldPosition.x + browserSurface.dx, oldPosition.y + browserSurface.dy)
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
    if (this._pingTimeoutActive) {
      this.grSurfaceResource.implementation.browserSurfaceViews.forEach((view) => {
        view.bufferedCanvas.removeCssClass('fadeToUnresponsive')
      })
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

  _doPing (resource) {
    this._timeoutTimer = window.setTimeout(() => {
      if (!this._pingTimeoutActive) {
        // ping timed out, make view gray
        this._pingTimeoutActive = true
        this.grSurfaceResource.implementation.browserSurfaceViews.forEach((view) => {
          view.bufferedCanvas.addCssClass('fadeToUnresponsive')
        })
      }
    }, 3000)
    this.grSurfaceResource.onDestroy().then(() => {
      window.clearTimeout(this._timeoutTimer)
    })
    resource.ping(0)
    this.browserSession.flush()
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
    const browserSurface = this.grSurfaceResource.implementation
    const browserSurfaceChildSelf = browserSurface.browserSurfaceChildSelf
    const origPosition = browserSurfaceChildSelf.position

    if (browserPointer.buttonSerial === serial) {
      const pointerX = browserPointer.x
      const pointerY = browserPointer.y

      const moveListener = () => {
        if (browserPointer.buttonSerial === serial) {
          const deltaX = browserPointer.x - pointerX
          const deltaY = browserPointer.y - pointerY
          browserSurfaceChildSelf.position = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)
          browserSurface.browserSurfaceViews.forEach((view) => {
            view.applyTransformations()
          })
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
  resize (resource, seat, serial, edges) {
    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }

    const browserSeat = seat.implementation
    const browserPointer = browserSeat.browserPointer
    if (browserPointer.buttonSerial === serial) {
      const pointerX = browserPointer.x
      const pointerY = browserPointer.y

      const browserSurfaceSize = this.grSurfaceResource.implementation.size

      const surfaceWidth = browserSurfaceSize.w
      const surfaceHeight = browserSurfaceSize.h

      // assigned in switch statement
      let sizeAdjustment = (width, height, deltaX, deltaY) => {}

      switch (edges) {
        case Resize.bottomRight: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width + deltaX, h: height + deltaY}
          }
          break
        }
        case Resize.top: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width, h: height - deltaY}
          }
          break
        }
        case Resize.bottom: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width, h: height + deltaY}
          }
          break
        }
        case Resize.left: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width - deltaX, h: height}
          }
          break
        }
        case Resize.topLeft: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width - deltaX, h: height - deltaY}
          }
          break
        }
        case Resize.bottomLeft: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width - deltaX, h: height + deltaY}
          }
          break
        }
        case Resize.right: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width + deltaX, h: height}
          }
          break
        }
        case Resize.topRight: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width + deltaX, h: height - deltaY}
          }
          break
        }
        case Resize.none:
        default: {
          sizeAdjustment = (width, height, deltaX, deltaY) => {
            return {w: width, h: height}
          }
          break
        }
      }
      const resizeListener = () => {
        if (browserPointer.buttonSerial === serial) {
          const deltaX = browserPointer.x - pointerX
          const deltaY = browserPointer.y - pointerY
          const size = sizeAdjustment(surfaceWidth, surfaceHeight, deltaX, deltaY)
          this.resource.configure(edges, size.w, size.h)
        } else {
          browserPointer.removeMouseMoveListener(resizeListener)
        }
      }
      browserPointer.addMouseMoveListener(resizeListener)
    }
  }

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
    if (this.type) {
      return
    }

    this.type = SurfaceType.TOP_LEVEL

    this.grSurfaceResource.implementation.hasKeyboardInput = true
    this.grSurfaceResource.implementation.hasPointerInput = true
    this.grSurfaceResource.implementation.hasTouchInput = true

    this._desktopShellEntry = this._desktopShell.manage(this.grSurfaceResource.implementation)
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
   * @param {GrSurface} parent parent surface
   * @param {Number} x surface-local x coordinate
   * @param {Number} y surface-local y coordinate
   * @param {Number} flags transient surface behavior
   *
   * @since 1
   *
   */
  setTransient (resource, parent, x, y, flags) {
    if (this.type) {
      return
    }

    this.type = SurfaceType.TRANSIENT

    const parentPosition = parent.implementation.browserSurfaceChildSelf.position

    const browserSurface = this.grSurfaceResource.implementation
    const browserSurfaceChild = browserSurface.browserSurfaceChildSelf
    // FIXME we probably want to provide a method to translate from (abstract) surface space to global space
    browserSurfaceChild.position = Point.create(parentPosition.x + x, parentPosition.y + y)

    this.grSurfaceResource.implementation.hasPointerInput = true
    this.grSurfaceResource.implementation.hasTouchInput = true
    this.grSurfaceResource.implementation.hasKeyboardInput = (flags & greenfield.GrShellSurface.Transient.inactive) === 0

    this._desktopShellEntry = this._desktopShell.manage(browserSurface)
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
  setFullscreen (resource, method, framerate, output) {
    this.state = SurfaceStates.FULLSCREEN
    // TODO fullscreen windows + optimize renderer for fullscreen
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
  async setPopup (resource, seat, serial, parent, x, y, flags) {
    if (this.type) { return }

    const browserSeat = seat.implementation
    const browserPointer = browserSeat.browserPointer
    const browserKeyboard = browserSeat.browserKeyboard
    if (browserPointer.buttonSerial === serial || browserKeyboard.keySerial === serial) {
      this.type = SurfaceType.POPUP
      const browserSurface = this.grSurfaceResource.implementation
      const browserSurfaceChild = browserSurface.browserSurfaceChildSelf
      browserSurfaceChild.position = Point.create(x, y)
      parent.implementation.addChild(browserSurfaceChild)
      // having added this shell-surface to a parent will have it create a view for each parent view
      browserSurface.browserSurfaceViews.forEach((view) => {
        view.applyTransformations()
        view.onDestroy().then(() => {
          view.detach()
        })
      })

      this.grSurfaceResource.implementation.hasPointerInput = true
      this.grSurfaceResource.implementation.hasTouchInput = true
      this.grSurfaceResource.implementation.hasKeyboardInput = (flags & greenfield.GrShellSurface.Transient.inactive) === 0

      // handle popup window grab
      await browserPointer.popupGrab(this.grSurfaceResource)
      resource.popupDone()
    }
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
   * @param {GrShellSurface} resource
   * @param {?*} output output on which the surface is to be maximized
   *
   * @since 1
   *
   */
  setMaximized (resource, output) {
    this.state = SurfaceStates.MAXIMIZED
    const browserSurface = this.grSurfaceResource.implementation

    // TODO get proper size in surface coordinates instead of assume surface space === global space
    const x = 0
    const {height: y} = this._desktopShell.panel.getBoundingClientRect()
    const {width, height} = this._desktopShell.workspace.getBoundingClientRect()

    browserSurface.browserSurfaceChildSelf.position = Point.create(x, y)
    this.resource.configure(Resize.none, width, height)
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
   * @param {GrShellSurface} resource
   * @param {string} title surface title
   *
   * @since 1
   *
   */
  setTitle (resource, title) {
    this.title = title
    if (this._desktopShellEntry) {
      this._desktopShellEntry.updateTitle(title)
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
