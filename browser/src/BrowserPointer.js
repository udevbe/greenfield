'use strict'

import { parseFixed, GrPointer } from './protocol/greenfield-browser-protocol'
import Point from './math/Point'

const {pressed, released} = GrPointer.ButtonState
const {horizontalScroll, verticalScroll} = GrPointer.Axis
const {wheel} = GrPointer.AxisSource

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

/**
 *
 *            The gr_pointer interface represents one or more input devices,
 *            such as mice, which control the pointer location and pointer_focus
 *            of a seat.
 *
 *            The gr_pointer interface generates motion, enter and leave
 *            events for the surfaces that the pointer is located over,
 *            and button and axis events for button presses, button releases
 *            and scrolling.
 *            @implements BrowserSurfaceRole
 *
 */
export default class BrowserPointer {
  /**
   * @param {!BrowserSession} browserSession
   * @param {!BrowserDataDevice} browserDataDevice
   * @returns {!BrowserPointer}
   */
  static create (browserSession, browserDataDevice) {
    const browserPointer = new BrowserPointer(browserDataDevice)
    document.addEventListener('mousemove', (event) => {
      if (browserPointer._handleMouseMove(event)) {
        event.preventDefault()
        event.stopPropagation()
      }
      browserSession.flush()
    })
    document.addEventListener('mouseup', (event) => {
      if (browserPointer._handleMouseUp(event)) {
        event.preventDefault()
        event.stopPropagation()
      }
      browserSession.flush()
    })
    document.addEventListener('mousedown', (event) => {
      if (browserPointer._handleMouseDown(event)) {
        event.preventDefault()
        event.stopPropagation()
      }
      browserSession.flush()
    })
    document.addEventListener('wheel', (event) => {
      if (browserPointer._handleWheel(event)) {
        event.preventDefault()
        event.stopPropagation()
      }
      browserSession.flush()
    })
    // other mouse events are set in the browser surface view class
    return browserPointer
  }

  /**
   * Use BrowserPointer.create(..) instead.
   * @private
   * @param {!BrowserDataDevice} browserDataDevice
   */
  constructor (browserDataDevice) {
    /**
     * @type {!BrowserDataDevice}
     * @const
     * @private
     */
    this._browserDataDevice = browserDataDevice
    /**
     * @type {!GrPointer[]}
     */
    this.resources = []
    /**
     * @type {?BrowserSurfaceView}
     */
    this.focus = null
    /**
     * Currently active surface grab (if any)
     * @type {?BrowserSurfaceView}
     */
    this.grab = null
    /**
     * @type {!Array<{popup: GrSurface, resolve: Function, promise: Promise}>}
     * @private
     */
    this._popupStack = []
    /**
     * @type {!number}
     */
    this.x = 0
    /**
     * @type {!number}
     */
    this.y = 0
    /**
     * @type {?BrowserSurface}
     * @private
     */
    this._cursorSurface = null
    /**
     * @type {?BrowserSurfaceView}
     * @private
     */
    this._view = null
    /**
     * @type {!function}
     * @private
     */
    this._cursorDestroyListener = () => {
      this._cursorSurface = null
      this.setDefaultCursor()
    }
    /**
     * @type {!number}
     * @private
     */
    this._btnDwnCount = 0
    /**
     * @type {!Array<function>}
     * @private
     */
    this._mouseMoveListeners = []
    /**
     * @type {!number}
     */
    this.hotspotX = 0
    /**
     * @type {!number}
     */
    this.hotspotY = 0
    /**
     * @type {?Promise}
     * @private
     */
    this._buttonPressPromise = null
    /**
     * @type {?function(MouseEvent):void}
     * @private
     */
    this._buttonPressResolve = null
    /**
     * @type {?Promise}
     * @private
     */
    this._buttonReleasePromise = null
    /**
     * @type {?function(MouseEvent):void}
     * @private
     */
    this._buttonReleaseResolve = null
    /**
     * @type {?BrowserSeat}
     */
    this.browserSeat = null
  }

  onButtonPress () {
    if (!this._buttonPressPromise) {
      this._buttonPressPromise = new Promise((resolve) => {
        this._buttonPressResolve = resolve
      }).then(() => {
        this._buttonPressPromise = null
        this._buttonPressResolve = null
      })
    }
    return this._buttonPressPromise
  }

  onButtonRelease () {
    if (!this._buttonReleasePromise) {
      this._buttonReleasePromise = new Promise((resolve) => {
        this._buttonReleaseResolve = resolve
      }).then(() => {
        this._buttonReleasePromise = null
        this._buttonReleaseResolve = null
      })
    }
    return this._buttonReleasePromise
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
   * @return {Promise<void>}
   * @override
   */
  async onCommit (browserSurface, renderFrame, newState) {
    this.hotspotX -= newState.dx
    this.hotspotY -= newState.dy

    const hotspotX = this.hotspotX
    const hotspotY = this.hotspotY

    if (this._cursorSurface && this._cursorSurface.implementation === browserSurface) {
      if (newState.bufferContents) {
        if (newState.bufferContents.encodingType === 'png') { // This is a dirty shortcut. We assume that pngs always come as a single buffer
          browserSurface.render(renderFrame, newState, true)

          const imageBlob = new window.Blob([newState.bufferContents.fragments[0].opaque], {'type': 'png'})
          window.document.body.style.cursor = `url("${window.URL.createObjectURL(imageBlob)}") ${hotspotX} ${hotspotY}, pointer`

          renderFrame.fire()
          await renderFrame
        } else {
          browserSurface.render(renderFrame, newState)

          const dataURL = this._view.bufferedCanvas.frontContext.canvas.toDataURL()
          window.document.body.style.cursor = `url("${dataURL}") ${hotspotX} ${hotspotY}, pointer`

          renderFrame.fire()
          await renderFrame
        }
      }
    }

    browserSurface.browserSession.flush()
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
    if (serial !== this.browserSeat.serial) {
      return
    }
    this.setCursorInternal(surface, hotspotX, hotspotY)
  }

  /**
   * @param {GrSurface}popup
   * @return {Promise}
   */
  popupGrab (popup) {
    // check if there already is an existing grab
    let popupGrab = this.findPopupGrab(popup)
    if (this.findPopupGrab(popup)) {
      // TODO return null instead? (grabbing something already grabbed is smelly)
      return popupGrab.promise
    }

    let popupGrabEndResolve = null
    let popupGrabEndPromise = new Promise((resolve) => {
      popup.onDestroy().then(() => {
        resolve()
      })
      popupGrabEndResolve = resolve
    })

    popupGrab = {
      popup: popup,
      resolve: popupGrabEndResolve,
      promise: popupGrabEndPromise
    }
    this._popupStack.push(popupGrab)

    popupGrabEndPromise.then(() => {
      const popupGrabIdx = this._popupStack.indexOf(popupGrab)
      if (popupGrabIdx > -1) {
        const nestedPopupGrabs = this._popupStack.slice(popupGrabIdx)
        // all nested popup grabs above the resolved popup grab also need to be removed
        this._popupStack.splice(popupGrabIdx)
        // nested array includes the already closed popup, shift will remove it from the array
        nestedPopupGrabs.shift()
        nestedPopupGrabs.reverse().forEach((nestedPopupGrab) => {
          nestedPopupGrab.resolve()
        })
      }
    })

    // clear any pointer button press grab
    this.grab = null
    this._btnDwnCount = 0

    return popupGrabEndPromise
  }

  /**
   * @param {GrSurface}popup
   * @return {{popup: GrSurface, resolve: Function, promise: Promise} | null}
   */
  findPopupGrab (popup) {
    const popupGrab = this._popupStack.find((popupGrab) => {
      return popupGrab.popup === popup
    })
    // do the OR, else we're returning 'undefined'
    return popupGrab || null
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
  _focusFromEvent (event) {
    const focusCandidate = event.target

    if (focusCandidate.view &&
      !focusCandidate.view.destroyed &&
      focusCandidate.view.browserSurface &&
      focusCandidate.view.browserSurface.hasPointerInput) {
      return focusCandidate.view
    }

    return null
  }

  /**
   * @param {MouseEvent}event
   * @return {boolean}
   * @private
   */
  _handleMouseMove (event) {
    let consumed = false
    this.x = event.clientX < 0 ? 0 : event.clientX
    this.y = event.clientY < 0 ? 0 : event.clientY

    let currentFocus = this._focusFromEvent(event)

    const nroPopups = this._popupStack.length
    if (nroPopups && currentFocus &&
      currentFocus.browserSurface.resource.client !== this._popupStack[nroPopups - 1].popup.client) {
      currentFocus = null
    }

    if (this._browserDataDevice.dndSourceClient) {
      this._browserDataDevice.onMouseMotion(currentFocus)
      return true
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

    if (this.focus && this.focus.browserSurface) {
      consumed = true
      const surfacePoint = this._calculateSurfacePoint(this.focus)
      const surfaceResource = this.focus.browserSurface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.motion(event.timeStamp, parseFixed(surfacePoint.x), parseFixed(surfacePoint.y))
        if (pointerResource.version >= 5) {
          pointerResource.frame()
        }
      })
    }

    return consumed
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
   * @return {boolean}
   * @private
   */
  _handleMouseUp (event) {
    let consumed = false
    if (this._browserDataDevice.dndSourceClient) {
      this._browserDataDevice.onMouseUp()
      return true
    }

    const nroPopups = this._popupStack.length

    if (this.focus && this.focus.browserSurface) {
      consumed = true

      if (this.grab || nroPopups) {
        const surfaceResource = this.focus.browserSurface.resource
        this._doPointerEventFor(surfaceResource, (pointerResource) => {
          pointerResource.button(this.browserSeat.nextSerial(), event.timeStamp, linuxInput[event.button], released)
          if (pointerResource.version >= 5) {
            pointerResource.frame()
          }
        })
      }

      if (this.grab) {
        this._btnDwnCount--
        if (this._btnDwnCount === 0) {
          this.grab = null
        }
      }
    } else if (nroPopups) {
      const focus = this._focusFromEvent(event)
      // popup grab ends when user has clicked on another client's surface
      const popupGrab = this._popupStack[nroPopups - 1]
      if (!focus || (popupGrab.popup.implementation.state.bufferContents && focus.browserSurface.resource.client !== popupGrab.popup.client)) {
        popupGrab.resolve()
      }
    }

    if (this._buttonReleaseResolve) {
      this._buttonReleaseResolve(event)
    }

    return consumed
  }

  /**
   * @param {MouseEvent}event
   * @return {boolean}
   * @private
   */
  _handleMouseDown (event) {
    let consumed = this._handleMouseMove(event)

    if (this.focus && this.focus.browserSurface) {
      consumed = true
      if (this.grab === null && this._popupStack.length === 0) {
        this.grab = this.focus
      }

      if (!this._popupStack.length) {
        this._btnDwnCount++
      }

      const surfaceResource = this.focus.browserSurface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.button(this.browserSeat.nextSerial(), event.timeStamp, linuxInput[event.button], pressed)
        if (pointerResource.version >= 5) {
          pointerResource.frame()
        }
      })
    }

    if (this._buttonPressResolve) {
      this._buttonPressResolve(event)
    }

    return consumed
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
      const surfacePoint = this._calculateSurfacePoint(browserSurfaceView)
      return browserSurfaceView.browserSurface.isWithinInputRegion(surfacePoint)
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
        !focusCandidate.view.destroyed &&
        focusCandidate.view.browserSurface &&
        focusCandidate.view.browserSurface.hasPointerInput &&
        this._isPointerWithinInputRegion(focusCandidate) &&
        window.parseInt(focusCandidate.style.zIndex) > zOrder) {
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
    newFocus.onDestroy().then(() => {
      if (!this.focus) {
        return
      }
      if (newFocus !== this.focus) {
        return
      }
      // recalculate focus and consequently enter event
      const focus = this.calculateFocus()
      if (focus) {
        this.setFocus(focus)
      } else {
        this.unsetFocus()
        this.setDefaultCursor()
      }
    })

    const surfacePoint = this._calculateSurfacePoint(newFocus)
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.enter(this.browserSeat.nextSerial(), surfaceResource, parseFixed(surfacePoint.x), parseFixed(surfacePoint.y))
    })
  }

  unsetFocus () {
    if (this.focus && !this.focus.destroyed && this.focus.browserSurface) {
      const surfaceResource = this.focus.browserSurface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.leave(this.browserSeat.nextSerial(), surfaceResource)
        if (pointerResource.version >= 5) {
          pointerResource.frame()
        }
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

  /**
   * @param {WheelEvent}event
   * @return {boolean}
   */
  _handleWheel (event) {
    let consumed = false
    if (this.focus && this.focus.browserSurface) {
      consumed = true
      // TODO configure the scoll transform through the config menu
      /**
       * @type{Function}
       */
      let deltaTransform
      switch (event.deltaMode) {
        case event.DOM_DELTA_LINE: {
          /**
           * @param {number}delta
           * @return {number}
           */
          deltaTransform = (delta) => { return delta * 18 } // FIXME We hard code line height.
          break
        }
        case event.DOM_DELTA_PAGE: {
          /**
           * @param {number}delta
           * @param {number}axis
           * @return {number}
           */
          deltaTransform = (delta, axis) => {
            if (axis === verticalScroll) {
              return delta * this.focus.browserSurface.size.h
            } else { // horizontalScroll
              return delta * this.focus.browserSurface.size.w
            }
          }
          break
        }
        case event.DOM_DELTA_PIXEL:
        default: {
          /**
           * @param {number}delta
           * @return {number}
           */
          deltaTransform = (delta) => { return delta }
          break
        }
      }

      const surfaceResource = this.focus.browserSurface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        const deltaX = event.deltaX
        if (deltaX) {
          const xAxis = horizontalScroll
          if (pointerResource.version >= 5) {
            pointerResource.axisDiscrete(xAxis, deltaX)
          }
          const scrollAmount = deltaTransform(deltaX, xAxis)
          pointerResource.axis(event.timeStamp, xAxis, parseFixed(scrollAmount))
        }
        const deltaY = event.deltaY
        if (deltaY) {
          const yAxis = verticalScroll
          if (pointerResource.version >= 5) {
            pointerResource.axisDiscrete(yAxis, deltaY)
          }
          const scrollAmount = deltaTransform(deltaY, yAxis)
          pointerResource.axis(event.timeStamp, yAxis, parseFixed(scrollAmount))
        }
        if (pointerResource.version >= 5) {
          pointerResource.axisSource(wheel)
          pointerResource.frame()
        }
      })
    }
    return consumed
  }

  /**
   * @override
   */
  captureRoleState () {
    // NO-OP
  }

  /**
   * @param roleState
   * @override
   */
  setRoleState (roleState) {
    // NO-OP
  }
}
