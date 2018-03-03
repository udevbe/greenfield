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
    // TODO these listeners should be added on document level as they are send to the grabbed surface, and not on the focussed surface
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
     * @type {HTMLCanvasElement}
     */
    this.focus = null
    /**
     * @type {HTMLCanvasElement}
     */
    this.grab = null
    /**
     * @type {number}
     */
    this.x = 0
    /**
     * @type {number}
     */
    this.y = 0
    /**
     * @type {Function}
     * @param {GrSurface}resource
     * @private
     */
    this._focusDestroyListener = (resource) => {
      if (this.focus && resource.implementation.defaultView !== this.focus.view) {
        return
      }
      const surfaceResource = this.focus.view.browserSurface.resource
      surfaceResource.removeDestroyListener(this._focusDestroyListener)
      this.focus = null
      this.grab = null
      // recalculate focus and consequently enter event
      const focusElement = document.elementFromPoint(this.x, this.y)
      if (focusElement.view) {
        this.mouseEnterInternal(focusElement)
      }
    }
    /**
     * @type {BrowserSurface}
     * @private
     */
    this._cursorSurface = null
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
     * @type {number}
     */
    this.zOrderCounter = 1

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

    browserSurface.defaultSurfaceView.onDraw().then(() => {
      if (browserSurface.role) {
        this._uploadCursor(browserSurface.defaultSurfaceView, hotspotX, hotspotY)
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
    const currentFocus = this.calculateFocus()

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
      const surfaceResource = this.focus.view.browserSurface.resource
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

    const surfaceResource = this.focus.view.browserSurface.resource
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.button(this._nextButtonSerial(), event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.released)
    })
  }

  /**
   * @param {MouseEvent}event
   */
  onMouseDown (event) {
    if (this.focus === null) {
      return
    }

    if (this.grab === null) {
      this.grab = this.focus
      this._browserKeyboard.focusGained(this.grab)
      // elements with a same zIndex will be display in document order, to avoid a previously grabbed canvas being shown below another,
      // we need to assign it an absolute zIndex greater than the last one.
      this.grab.view.bufferedCanvas.zIndex = ++this.zOrderCounter
    }

    this._btnDwnCount++
    const surfaceResource = this.focus.view.browserSurface.resource
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.button(this._nextButtonSerial(), event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.pressed)
    })
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @return {Point}
   * @private
   */
  _calculateSurfacePoint (canvas) {
    const mousePoint = Point.create(this.x, this.y)
    return canvas.view.toSurfaceSpace(mousePoint)
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @return {Boolean}
   * @private
   */
  _isPointerWithinInputRegion (canvas) {
    if (canvas.view) {
      if (canvas.view.browserSurface.inputPixmanRegion) {
        // FIXME clip surface point to surface boundaries, this is needed to properly handle input regions that
        // exceed the surface they are set on
        const surfacePoint = this._calculateSurfacePoint(canvas)
        return BrowserRegion.contains(canvas.view.browserSurface.inputPixmanRegion, surfacePoint)
      } else {
        return true
      }
    } else {
      return false
    }
  }

  /**
   * @return {HTMLCanvasElement | null}
   */
  calculateFocus () {
    const focusCandidates = window.document.elementsFromPoint(this.x, this.y)

    let zOrder = -1
    let focus = null
    focusCandidates.forEach(focusCandidate => {
      if (this._isPointerWithinInputRegion(focusCandidate) && window.parseInt(focusCandidate.style.zIndex) > zOrder) {
        zOrder = focusCandidate.style.zIndex
        focus = focusCandidate
      }
    })

    return focus
  }

  /**
   * @param {HTMLCanvasElement}newFocus
   */
  setFocus (newFocus) {
    this.focus = newFocus
    const surfaceResource = this.focus.view.browserSurface.resource
    surfaceResource.addDestroyListener(this._focusDestroyListener)

    const surfacePoint = this._calculateSurfacePoint(newFocus)
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.enter(this._nextFocusSerial(), surfaceResource, greenfield.parseFixed(surfacePoint.x), greenfield.parseFixed(surfacePoint.y))
    })
  }

  unsetFocus () {
    if (this.focus) {
      const surfaceResource = this.focus.view.browserSurface.resource
      surfaceResource.removeDestroyListener(this._focusDestroyListener)

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
