'use strict'

import WlPointerRequests from './protocol/WlPointerRequests'
import WlPointerResource from './protocol/WlPointerResource'
import { Fixed } from 'westfield-runtime-server'

import Point from './math/Point'
import EncodingOptions from './EncodingOptions'
import Region from './Region'

const { pressed, released } = WlPointerResource.ButtonState
const { horizontalScroll, verticalScroll } = WlPointerResource.Axis
const { wheel } = WlPointerResource.AxisSource

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
 *            The wl_pointer interface represents one or more input devices,
 *            such as mice, which control the pointer location and pointer_focus
 *            of a seat.
 *
 *            The wl_pointer interface generates motion, enter and leave
 *            events for the surfaces that the pointer is located over,
 *            and button and axis events for button presses, button releases
 *            and scrolling.
 *            @implements {SurfaceRole}
 *            @implements {WlPointerRequests}
 *
 */
export default class Pointer extends WlPointerRequests {
  /**
   * @param {!Session} session
   * @param {!DataDevice} dataDevice
   * @returns {!Pointer}
   */
  static create (session, dataDevice) {
    const pointer = new Pointer(dataDevice)
    document.addEventListener('mousemove', (event) => {
      const mouseEvent = /** @type {MouseEvent} */ event
      if (pointer._handleMouseMove(mouseEvent)) {
        mouseEvent.preventDefault()
        mouseEvent.stopPropagation()
        session.flush()
      }
    })
    document.addEventListener('mouseup', (event) => {
      const mouseEvent = /** @type {MouseEvent} */ event
      if (pointer._handleMouseUp(mouseEvent)) {
        mouseEvent.preventDefault()
        mouseEvent.stopPropagation()
        session.flush()
      }
    })
    document.addEventListener('mousedown', (event) => {
      const mouseEvent = /** @type {MouseEvent} */ event
      if (pointer._handleMouseDown(mouseEvent)) {
        mouseEvent.preventDefault()
        mouseEvent.stopPropagation()
        session.flush()
      }
    })
    document.addEventListener('wheel', (event) => {
      const wheelEvent = /** @type {WheelEvent} */ event
      if (pointer._handleWheel(wheelEvent)) {
        wheelEvent.preventDefault()
        wheelEvent.stopPropagation()
        session.flush()
      }
    })
    // other mouse events are set in the surface view class
    return pointer
  }

  /**
   * Use Pointer.create(..) instead.
   * @private
   * @param {!DataDevice} dataDevice
   */
  constructor (dataDevice) {
    super()
    /**
     * @type {!DataDevice}
     * @const
     * @private
     */
    this._dataDevice = dataDevice
    /**
     * @type {!Array<WlPointerResource>}
     */
    this.resources = []
    /**
     * @type {?View}
     */
    this.focus = null
    /**
     * Currently active surface grab (if any)
     * @type {?View}
     */
    this.grab = null
    /**
     * @type {!Array<{popup: WlSurfaceResource, resolve: function():void, promise: Promise<void>}>}
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
     * @type {?WlSurfaceResource}
     * @private
     */
    this._cursorSurface = null
    /**
     * @type {?View}
     * @private
     */
    this._view = null
    /**
     * @type {!function():void}
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
     * @type {?Seat}
     */
    this.seat = null
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
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @return {Promise<void>}
   * @override
   */
  async onCommit (surface, renderFrame, newState) {
    this.hotspotX -= newState.dx
    this.hotspotY -= newState.dy

    const hotspotX = this.hotspotX
    const hotspotY = this.hotspotY

    if (this._cursorSurface && this._cursorSurface.implementation === surface) {
      if (newState.bufferContents) {
        const fullFrame = EncodingOptions.fullFrame(newState.bufferContents.encodingOptions)
        const splitAlpha = EncodingOptions.splitAlpha(newState.bufferContents.encodingOptions)
        if (fullFrame && !splitAlpha) {
          await surface.render(renderFrame, newState, true)
          const imageBlob = new Blob([newState.bufferContents.fragments[0].opaque], { 'type': newState.bufferContents.encodingType })
          window.document.body.style.cursor = `url("${URL.createObjectURL(imageBlob)}") ${hotspotX} ${hotspotY}, pointer`

          renderFrame.fire()
          await renderFrame
        } else {
          await surface.render(renderFrame, newState)

          const dataURL = this._view.bufferedCanvas.frontContext.canvas.toDataURL()
          window.document.body.style.cursor = `url("${dataURL}") ${hotspotX} ${hotspotY}, pointer`

          renderFrame.fire()
          await renderFrame
        }
      }
    }

    surface.session.flush()
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
   *                wl_surface.commit as usual.
   *
   *                The hotspot can also be updated by passing the currently set
   *                pointer surface to this request with new values for hotspot_x
   *                and hotspot_y.
   *
   *                The current and pending input regions of the wl_surface are
   *                cleared, and wl_surface.set_input_region is ignored until the
   *                wl_surface is no longer used as the cursor. When the use as a
   *                cursor ends, the current and pending input regions become
   *                undefined, and the wl_surface is unmapped.
   *
   *
   * @param {WlPointerResource} resource
   * @param {number} serial serial number of the enter event
   * @param {WlSurfaceResource|null} surfaceResource pointer surface
   * @param {number} hotspotX surface-local x coordinate
   * @param {number} hotspotY surface-local y coordinate
   *
   * @since 1
   *
   */
  setCursor (resource, serial, surfaceResource, hotspotX, hotspotY) {
    if (surfaceResource) {
      const surface = /** @type {Surface} */surfaceResource.implementation
      if (surface.role && surface.role !== this) {
        resource.postError(WlPointerResource.Error.role, 'Given surface has another role.')
        DEBUG && console.log('Protocol error. Given surface has another role')
        return
      }
    }

    if (this._dataDevice.dndSourceClient) {
      return
    }
    if (serial !== this.seat.enterSerial) {
      return
    }
    this.setCursorInternal(surfaceResource, hotspotX, hotspotY)
  }

  /**
   * @param {WlSurfaceResource}popup
   * @return {Promise<void>}
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
   * @param {WlSurfaceResource}popup
   * @return {{popup: WlSurfaceResource, resolve: Function, promise: Promise} | null}
   */
  findPopupGrab (popup) {
    const popupGrab = this._popupStack.find((popupGrab) => {
      return popupGrab.popup === popup
    })
    // do the OR, else we're returning 'undefined'
    return popupGrab || null
  }

  /**
   * @param {?WlSurfaceResource}surfaceResource
   * @param {number} hotspotX surface-local x coordinate
   * @param {number} hotspotY surface-local y coordinate
   */
  setCursorInternal (surfaceResource, hotspotX, hotspotY) {
    this.hotspotX = hotspotX
    this.hotspotY = hotspotY

    if (this._cursorSurface) {
      this._cursorSurface.removeDestroyListener(this._cursorDestroyListener)
      this._cursorSurface.implementation.role = null
    }
    this._cursorSurface = surfaceResource

    if (surfaceResource) {
      const surface = /** @type {Surface} */surfaceResource.implementation
      if (this._view) {
        this._view.destroy()
      }
      this._view = surface.createView()
      surface.resource.addDestroyListener(this._cursorDestroyListener)
      surface.role = this
      surface.state.inputPixmanRegion = Region.createPixmanRegion()
      surface._pendingInputRegion = Region.createPixmanRegion()
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
   *                wl_pointer_destroy() after using this request.
   *
   *
   * @param {WlPointerResource} resource
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
   * @param {function}func
   */
  addMouseMoveListener (func) {
    this._mouseMoveListeners.push(func)
  }

  /**
   * @param {function}func
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
      focusCandidate.view.surface &&
      focusCandidate.view.surface.hasPointerInput) {
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
      currentFocus.surface.resource.client !== this._popupStack[nroPopups - 1].popup.client) {
      currentFocus = null
    }

    if (this._dataDevice.dndSourceClient) {
      this._dataDevice.onMouseMotion(currentFocus)
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

    if (this.focus && this.focus.surface) {
      consumed = true
      const surfacePoint = this._calculateSurfacePoint(this.focus)
      const surfaceResource = this.focus.surface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.motion(event.timeStamp, Fixed.parse(surfacePoint.x), Fixed.parse(surfacePoint.y))
        if (pointerResource.version >= 5) {
          pointerResource.frame()
        }
      })
    }

    return consumed
  }

  /**
   * @param {WlSurfaceResource} surfaceResource
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
    if (this._dataDevice.dndSourceClient) {
      this._dataDevice.onMouseUp()
      return true
    }

    const nroPopups = this._popupStack.length

    if (this.focus && this.focus.surface) {
      consumed = true

      if (this.grab || nroPopups) {
        const surfaceResource = this.focus.surface.resource
        this._doPointerEventFor(surfaceResource, (pointerResource) => {
          pointerResource.button(this.seat.nextButtonSerial(false), event.timeStamp, linuxInput[event.button], released)
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
      if (!focus || (popupGrab.popup.implementation.state.bufferContents && focus.surface.resource.client !== popupGrab.popup.client)) {
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

    if (this.focus && this.focus.surface) {
      consumed = true
      if (this.grab === null && this._popupStack.length === 0) {
        this.grab = this.focus
      }

      if (!this._popupStack.length) {
        this._btnDwnCount++
      }

      const surfaceResource = this.focus.surface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.button(this.seat.nextButtonSerial(true), event.timeStamp, linuxInput[event.button], pressed)
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
   * @param {View}view
   * @return {Point}
   * @private
   */
  _calculateSurfacePoint (view) {
    const mousePoint = Point.create(this.x, this.y)
    return view.toSurfaceSpace(mousePoint)
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @return {Boolean}
   * @private
   */
  _isPointerWithinInputRegion (canvas) {
    if (canvas.view) {
      const view = canvas.view
      const surfacePoint = this._calculateSurfacePoint(view)
      return view.surface.isWithinInputRegion(surfacePoint)
    } else {
      return false
    }
  }

  /**
   * @return {View | null}
   */
  calculateFocus () {
    const focusCandidates = window.document.elementsFromPoint(this.x, this.y)

    let zOrder = -1
    let focus = { view: null }
    focusCandidates.forEach(focusCandidate => {
      if (focusCandidate.view &&
        !focusCandidate.view.destroyed &&
        focusCandidate.view.surface &&
        focusCandidate.view.surface.hasPointerInput &&
        this._isPointerWithinInputRegion(focusCandidate) &&
        window.parseInt(focusCandidate.style.zIndex) > zOrder) {
        zOrder = focusCandidate.style.zIndex
        focus = focusCandidate
      }
    })

    return focus.view
  }

  /**
   * @param {View}newFocus
   */
  setFocus (newFocus) {
    this.focus = newFocus
    const surfaceResource = this.focus.surface.resource
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
      pointerResource.enter(this.seat.nextEnterSerial(), surfaceResource, Fixed.parse(surfacePoint.x), Fixed.parse(surfacePoint.y))
    })
  }

  unsetFocus () {
    if (this.focus && !this.focus.destroyed && this.focus.surface) {
      const surfaceResource = this.focus.surface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.leave(this.seat.nextSerial(), surfaceResource)
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
    if (this.focus && this.focus.surface) {
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
              return delta * this.focus.surface.size.h
            } else { // horizontalScroll
              return delta * this.focus.surface.size.w
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

      const surfaceResource = this.focus.surface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        const deltaX = event.deltaX
        if (deltaX) {
          const xAxis = horizontalScroll
          if (pointerResource.version >= 5) {
            pointerResource.axisDiscrete(xAxis, deltaX)
          }
          const scrollAmount = deltaTransform(deltaX, xAxis)
          pointerResource.axis(event.timeStamp, xAxis, Fixed.parse(scrollAmount))
        }
        const deltaY = event.deltaY
        if (deltaY) {
          const yAxis = verticalScroll
          if (pointerResource.version >= 5) {
            pointerResource.axisDiscrete(yAxis, deltaY)
          }
          const scrollAmount = deltaTransform(deltaY, yAxis)
          pointerResource.axis(event.timeStamp, yAxis, Fixed.parse(scrollAmount))
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
