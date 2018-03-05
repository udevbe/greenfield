'use strict'

import greenfield from './protocol/greenfield-browser-protocol'
import Point from './math/Point'
import BrowserRegion from './BrowserRegion'

// translates between browser button codes & kernel code as expected by wayland protocol
const linuxInput = {
  // left
  0: 0x110,
  // middle
  1: 0x112,
  // right
  2: 0x111,
  // browser back
  3: 0x116,
  // browser forward
  4: 0x115
}

export default class BrowserPointer {
  /**
   * @param {BrowserSession} browserSession
   * @param {BrowserDataDevice} browserDataDevice
   * @param {BrowserKeyboard} browserKeyboard
   * @returns {BrowserPointer}
   */
  static create (browserSession, browserDataDevice, browserKeyboard) {
    const browserPointer = new BrowserPointer(browserDataDevice, browserKeyboard)
    document.addEventListener('mousemove', browserSession.eventSource((event) => {
      event.preventDefault()
      browserPointer.onMouseMove(event)
    }), true)
    document.addEventListener('mouseup', browserSession.eventSource((event) => {
      event.preventDefault()
      browserPointer.onMouseUp(event)
    }), true)
    document.addEventListener('mousedown', browserSession.eventSource((event) => {
      event.preventDefault()
      browserPointer.onMouseDown(event)
    }), true)
    // other mouse events are set in the browser surface view class
    return browserPointer
  }

  /**
   * Use BrowserPointer.create(..) instead.
   * @private
   * @param {BrowserDataDevice} browserDataDevice
   * @param {BrowserKeyboard} browserKeyboard
   */
  constructor (browserDataDevice, browserKeyboard) {
    /**
     * @type {BrowserDataDevice}
     * @private
     */
    this._browserDataDevice = browserDataDevice
    /**
     * @type {BrowserKeyboard}
     * @private
     */
    this._browserKeyboard = browserKeyboard
    this.resources = []
    /**
     * @type {BrowserSurfaceView}
     */
    this.focus = null
    /**
     * @type {BrowserSurfaceView}
     */
    this.grab = null
    /**
     * @type {GrSurface}
     * @private
     */
    this._popup = null
    /**
     * @type {Function}
     * @private
     */
    this._popupGrabEndResolve = null
    /**
     * @type {Promise}
     * @private
     */
    this._popupGrabEndPromise = null
    /**
     * @type {number}
     */
    this.x = 0
    /**
     * @type {number}
     */
    this.y = 0
    /**
     * @type {BrowserSurface}
     * @private
     */
    this._cursorSurface = null
    /**
     * @type {BrowserSurfaceView}
     * @private
     */
    this._view = null
    /**
     * @type {Function}
     * @private
     */
    this._cursorDestroyListener = () => {
      this._cursorSurface = null
      this.setDefaultCursor()
    }
    this._btnDwnCount = 0
    /**
     * @type {number}
     */
    this.buttonSerial = 0
    /**
     * @type {number}
     */
    this.focusSerial = 0
    /**
     * @type {Function[]}
     * @private
     */
    this._mouseMoveListeners = []
    /**
     * @type {number}
     */
    this.hotspotX = 0
    /**
     * @type {number}
     */
    this.hotspotY = 0
  }

  /**
   * @param {BrowserSurface}browserSurface
   */
  onCommit (browserSurface) {
    this.hotspotX -= browserSurface.dx
    this.hotspotY -= browserSurface.dy

    const hotspotX = this.hotspotX
    const hotspotY = this.hotspotY

    this._view.onDraw().then(() => {
      if (this._cursorSurface && this._cursorSurface.implementation === browserSurface) {
        this._uploadCursor(this._view, hotspotX, hotspotY)
      }
    })
  }

  /**
   *
   *                Set the pointer surface, i.e., the surface that contains the
   *                pointer image (cursor). This request gives the surface the role
   *                of a cursor. If the surface already has another role, it raises
   *                a protocol error.
   *
   *                The cursor actually changes only if the pointer
   *                focus for this device is one of the requesting client's surfaces
   *                or the surface parameter is the current pointer surface. If
   *                there was a previous surface set with this request it is
   *                replaced. If surface is NULL, the pointer image is hidden.
   *
   *                The parameters hotspot_x and hotspot_y define the position of
   *                the pointer surface relative to the pointer location. Its
   *                top-left corner is always at (x, y) - (hotspot_x, hotspot_y),
   *                where (x, y) are the coordinates of the pointer location, in
   *                surface-local coordinates.
   *
   *                On surface.attach requests to the pointer surface, hotspot_x
   *                and hotspot_y are decremented by the x and y parameters
   *                passed to the request. Attach must be confirmed by
   *                gr_surface.commit as usual.
   *
   *                The hotspot can also be updated by passing the currently set
   *                pointer surface to this request with new values for hotspot_x
   *                and hotspot_y.
   *
   *                The current and pending input regions of the gr_surface are
   *                cleared, and gr_surface.set_input_region is ignored until the
   *                gr_surface is no longer used as the cursor. When the use as a
   *                cursor ends, the current and pending input regions become
   *                undefined, and the gr_surface is unmapped.
   *
   *
   * @param {GrPointer} resource
   * @param {Number} serial serial number of the enter event
   * @param {GrSurface|null} surface pointer surface
   * @param {Number} hotspotX surface-local x coordinate
   * @param {Number} hotspotY surface-local y coordinate
   *
   * @since 1
   *
   */
  setCursor (resource, serial, surface, hotspotX, hotspotY) {
    if (this._browserDataDevice.dndSourceClient) {
      return
    }
    if (serial !== this.focusSerial) {
      return
    }
    this.setCursorInternal(surface, hotspotX, hotspotY)
  }

  /**
   * @param {GrSurface}popup
   * @return {Promise}
   */
  popupGrab (popup) {
    // release any previous active popup grab
    if (!this._popupGrabEndPromise) {
      this._popupGrabEndPromise = new Promise((resolve) => {
        this._popup = popup
        this._popupGrabEndResolve = resolve

        popup.onDestroy().then(() => {
          if (this._popup === popup) {
            this._popupGrabEndResolve()
          }
        })
      }).then(() => {
        this._popup = null
        this._popupGrabEndResolve = null
        this._popupGrabEndPromise = null
        const focus = this.calculateFocus()
        if (focus) {
          this.setFocus(focus)
        } else {
          this.unsetFocus()
        }
      })
    }

    return this._popupGrabEndPromise
  }

  /**
   * @param {GrSurface|null}surface
   * @param {Number} hotspotX surface-local x coordinate
   * @param {Number} hotspotY surface-local y coordinate
   */
  setCursorInternal (surface, hotspotX, hotspotY) {
    this.hotspotX = hotspotX
    this.hotspotY = hotspotY

    if (this._cursorSurface) {
      this._cursorSurface.removeDestroyListener(this._cursorDestroyListener)
      this._cursorSurface.implementation.role = null
    }
    this._cursorSurface = surface

    if (surface) {
      const browserSurface = surface.implementation
      if (browserSurface.role && browserSurface.role !== this) {
        // TODO raise protocol error
        return
      }

      if (this._view) {
        this._view.destroy()
      }
      this._view = browserSurface.createView()
      browserSurface.resource.addDestroyListener(this._cursorDestroyListener)
      browserSurface.role = this
      browserSurface.inputRegion = null
      browserSurface._pendingInputRegion = null
    } else {
      window.document.body.style.cursor = 'none'
    }
  }

  _uploadCursor (cursorSurfaceView, hotspotX, hotspotY) {
    const dataURL = cursorSurfaceView.bufferedCanvas.frontContext.canvas.toDataURL()
    window.document.body.style.cursor = 'url("' + dataURL + '") ' + (hotspotX) + ' ' + (hotspotY) + ', pointer'
  }

  /**
   *
   *                Using this request a client can tell the server that it is not going to
   *                use the pointer object anymore.
   *
   *                This request destroys the pointer proxy object, so clients must not call
   *                gr_pointer_destroy() after using this request.
   *
   *
   * @param {GrPointer} resource
   *
   * @since 3
   *
   */
  release (resource) {
    resource.destroy()
    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
  }

  /**
   * @param {Function}func
   */
  addMouseMoveListener (func) {
    this._mouseMoveListeners.push(func)
  }

  /**
   * @param {Function}func
   */
  removeMouseMoveListener (func) {
    const index = this._mouseMoveListeners.indexOf(func)
    if (index > -1) {
      this._mouseMoveListeners.splice(index, 1)
    }
  }

  /**
   * @param {MouseEvent}event
   */
  onMouseMove (event) {
    this.x = event.clientX < 0 ? 0 : event.clientX
    this.y = event.clientY < 0 ? 0 : event.clientY
    let currentFocus = this.calculateFocus()
    if (this._popup && currentFocus && currentFocus.browserSurface.resource.client !== this._popup.client) {
      currentFocus = null
    }

    if (this._browserDataDevice.dndSourceClient) {
      this._browserDataDevice.onMouseMotion(currentFocus)
      return
    }

    // if we don't have a grab, update the focus
    if (!this.grab) {
      if (currentFocus !== this.focus) {
        this.unsetFocus()
        if (currentFocus) {
          this.setFocus(currentFocus)
        } else {
          this.setDefaultCursor()
        }
      }
    }

    this._mouseMoveListeners.forEach(listener => listener(this.focus))

    if (this.focus) {
      const surfacePoint = this._calculateSurfacePoint(this.focus)
      const surfaceResource = this.focus.browserSurface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.motion(event.timeStamp, greenfield.parseFixed(surfacePoint.x >> 0), greenfield.parseFixed(surfacePoint.y >> 0))
      })
    }
  }

  /**
   * @param {GrSurface} surfaceResource
   * @param {Function}action
   * @private
   */
  _doPointerEventFor (surfaceResource, action) {
    this.resources.forEach(pointerResource => {
      if (pointerResource.client === surfaceResource.client) {
        action(pointerResource)
      }
    })
  }

  /**
   * @param {MouseEvent}event
   */
  onMouseUp (event) {
    if (this._browserDataDevice.dndSourceClient) {
      this._browserDataDevice.onMouseUp()
      return
    }

    if (this.focus === null || this.grab === null) {
      return
    }

    this._btnDwnCount--
    if (this._btnDwnCount === 0) {
      this.grab = null
    }

    const surfaceResource = this.focus.browserSurface.resource
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.button(this._nextButtonSerial(), event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.released)
    })
  }

  /**
   * @param {MouseEvent}event
   */
  onMouseDown (event) {
    if (this._popupGrabEndResolve) {
      const focus = this.calculateFocus()
      // popup grab ends when user clicks on another client's surface
      if (focus && focus.browserSurface.resource.client !== this._popup.client) {
        this._popupGrabEndResolve()
        this._popupGrabEndResolve = null
      }
    }

    if (this.focus === null) {
      return
    }

    if (this.grab === null) {
      this.grab = this.focus
      this._browserKeyboard.focusGained(this.grab)
    }

    this._btnDwnCount++
    const surfaceResource = this.focus.browserSurface.resource
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.button(this._nextButtonSerial(), event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.pressed)
    })
  }

  /**
   * @param {BrowserSurfaceView}browserSurfaceView
   * @return {Point}
   * @private
   */
  _calculateSurfacePoint (browserSurfaceView) {
    const mousePoint = Point.create(this.x, this.y)
    return browserSurfaceView.toSurfaceSpace(mousePoint)
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @return {Boolean}
   * @private
   */
  _isPointerWithinInputRegion (canvas) {
    if (canvas.view) {
      const browserSurfaceView = canvas.view
      if (browserSurfaceView.browserSurface.inputPixmanRegion) {
        // FIXME clip surface point to surface boundaries, this is needed to properly handle input regions that
        // exceed the surface they are set on
        const surfacePoint = this._calculateSurfacePoint(browserSurfaceView)
        return BrowserRegion.contains(browserSurfaceView.browserSurface.inputPixmanRegion, surfacePoint)
      } else {
        return true
      }
    } else {
      return false
    }
  }

  /**
   * @return {BrowserSurfaceView | null}
   */
  calculateFocus () {
    const focusCandidates = window.document.elementsFromPoint(this.x, this.y)

    let zOrder = -1
    let focus = {view: null}
    focusCandidates.forEach(focusCandidate => {
      if (focusCandidate.view &&
        focusCandidate.view.browserSurface.hasPointerInput &&
        this._isPointerWithinInputRegion(focusCandidate) &&
        window.parseInt(focusCandidate.style.zIndex) > zOrder &&
        !focusCandidate.view.destroyed) {
        zOrder = focusCandidate.style.zIndex
        focus = focusCandidate
      }
    })

    return focus.view
  }

  /**
   * @param {BrowserSurfaceView}newFocus
   */
  setFocus (newFocus) {
    this.focus = newFocus
    const surfaceResource = this.focus.browserSurface.resource
    surfaceResource.onDestroy().then((resource) => {
      if (!this.focus) {
        return
      }
      const surfaceResource = this.focus.browserSurface.resource
      if (resource !== surfaceResource) {
        return
      }
      // recalculate focus and consequently enter event
      const focus = this.calculateFocus()
      if (focus) {
        this.setFocus(focus)
      } else {
        this.unsetFocus()
      }
    })

    const surfacePoint = this._calculateSurfacePoint(newFocus)
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.enter(this._nextFocusSerial(), surfaceResource, greenfield.parseFixed(surfacePoint.x), greenfield.parseFixed(surfacePoint.y))
    })
  }

  unsetFocus () {
    if (this.focus) {
      const surfaceResource = this.focus.browserSurface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.leave(this._nextFocusSerial(), surfaceResource)
      })
    }

    this.focus = null
    this.grab = null
    this.view = null
    this._btnDwnCount = 0
    if (this._cursorSurface) {
      this._cursorSurface.implementation.role = null
      this._cursorSurface = null
    }
  }

  setDefaultCursor () {
    window.document.body.style.cursor = 'auto'
  }

  _nextButtonSerial () {
    this.buttonSerial++
    return this.buttonSerial
  }

  _nextFocusSerial () {
    this.focusSerial++
    return this.focusSerial
  }
}
