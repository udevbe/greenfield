'use strict'

import greenfield from './protocol/greenfield-browser-protocol'
import Point from './math/Point'

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
   * @returns {BrowserPointer}
   */
  static create (browserSession) {
    const browserPointer = new BrowserPointer()
    // TODO these listeners should be added on document level as they are send to the grabbed surface, and not on the focussed surface
    document.addEventListener('mousemove', browserSession.eventSource((event) => {
      browserPointer.onMouseMove(event)
    }), true)
    document.addEventListener('mouseup', browserSession.eventSource((event) => {
      browserPointer.onMouseUp(event)
    }), true)
    document.addEventListener('mousedown', browserSession.eventSource((event) => {
      browserPointer.onMouseDown(event)
    }), true)
    // other mouse events are set in the browser surface view class
    return browserPointer
  }

  /**
   * @private
   */
  constructor () {
    this.resources = []
    this.focus = null
    this.grab = null
    this.x = 0
    this.y = 0
    this._focusDestroyListener = () => {
      const surfaceResource = this.focus.view.browserSurface.resource
      surfaceResource.removeDestroyListener(this._focusDestroyListener)
      this.focus = null
      this.grab = null
      // recalculate focus and consequently enter event
      const focusElement = document.elementFromPoint(this.x, this.y)
      if (focusElement.view) {
        this._updateFocus(focusElement)
      }
    }
    this._btnDwnCount = 0
    this.buttonSerial = 0
    this.focusSerial = 0

    this.zOrderCounter = 1

    this._mouseMoveListeners = []
    this.view = null
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
   * @param {?*} surface pointer surface
   * @param {Number} hotspotX surface-local x coordinate
   * @param {Number} hotspotY surface-local y coordinate
   *
   * @since 1
   *
   */
  setCursor (resource, serial, surface, hotspotX, hotspotY) {
    if (serial !== this.focusSerial) {
      return
    }

    if (surface) {
      const browserSurface = surface.implementation
      if (browserSurface.role && browserSurface.role !== this) {
        // TODO raise protocol error
        return
      }

      browserSurface.role = this

      if (browserSurface.browserSurfaceViews.length === 0) {
        this.view = browserSurface.createView()
      } else {
        this.view = browserSurface.browserSurfaceViews[0]
      }

      this._scaleCursor(browserSurface)

      this.focus.style.cursor = 'url("' + this.view.canvas.toDataURL() + '") ' + hotspotX + ' ' + hotspotY + ' , pointer'
      this.view.addDrawListener((browserSurfaceView) => {
        if (browserSurfaceView === this.view) {
          this.focus.style.cursor = 'url("' + this.view.canvas.toDataURL() + '") ' + hotspotX + ' ' + hotspotY + ' , pointer'
        }
      })
    } else {
      this.focus.style.cursor = 'none'
    }
  }

  onCommit (browserSurface) {
    this._scaleCursor(browserSurface)
  }

  _scaleCursor (browserSurface) {
    if (this.view.browserSurface === browserSurface) {
      this.view.canvas.width = browserSurface.bufferSize.w > 32 ? 32 : browserSurface.bufferSize.w
      this.view.canvas.height = browserSurface.bufferSize.h > 32 ? 32 : browserSurface.bufferSize.h
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

  addMouseMoveListener (func) {
    this._mouseMoveListeners.push(func)
  }

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
    this.x = event.clientX
    this.y = event.clientY

    this._mouseMoveListeners.forEach(listener => listener())

    if (this.focus) {
      const elementRect = this.focus.getBoundingClientRect()
      const canvasPoint = Point.create(this.x - elementRect.x, this.y - elementRect.y)
      const surfacePoint = this.focus.view.toSurfaceSpace(canvasPoint)

      const surfaceResource = this.focus.view.browserSurface.resource
      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        pointerResource.motion(event.timeStamp, greenfield.parseFixed(surfacePoint.x >> 0), greenfield.parseFixed(surfacePoint.y >> 0))
      })
    }
  }

  /**
   * @param {GrSurface} surfaceResource
   * @param action
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
    if (this.focus === null || this.grab === null) {
      return
    }

    const surfaceResource = this.focus.view.browserSurface.resource
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      // console.log('button( %f, %f, %f, %s )', this.buttonSerial + 1, event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.released)
      pointerResource.button(this._nextButtonSerial(), event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.released)
    })
    this._btnDwnCount--
    if (this._btnDwnCount === 0) {
      this.grab = null
    }
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
      // elements with a same zIndex will be display in document order, to avoid a previously grabbed canvas being shown below another,
      // we need to assign it an absolute zIndex greater than the last one.
      this.grab.style.zIndex = ++this.zOrderCounter
    }

    this._btnDwnCount++
    const surfaceResource = this.focus.view.browserSurface.resource
    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      // console.log('button( %f, %f, %f, %s )', this.buttonSerial + 1, event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.pressed)
      pointerResource.button(this._nextButtonSerial(), event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.pressed)
    })
  }

  /**
   * @param {MouseEvent}event
   */
  onMouseEnter (event) {
    if (this.grab) {
      return
    }

    this._updateFocus(event.target)
  }

  _updateFocus (newFocus) {
    this.focus = newFocus
    const surfaceResource = this.focus.view.browserSurface.resource
    surfaceResource.addDestroyListener(this._focusDestroyListener)

    const elementRect = this.focus.getBoundingClientRect()
    const canvasPoint = Point.create(this.x - (elementRect.x - 1), this.y - (elementRect.y - 1))
    const surfacePoint = this.focus.view.toSurfaceSpace(canvasPoint)

    this._doPointerEventFor(surfaceResource, (pointerResource) => {
      pointerResource.enter(this._nextFocusSerial(), surfaceResource, greenfield.parseFixed((surfacePoint.x)), greenfield.parseFixed((surfacePoint.y)))
    })
  }

  /**
   * @param {MouseEvent}event
   */
  onMouseLeave (event) {
    if (this.grab) {
      return
    }

    if (this.focus === event.target) {
      const surfaceResource = this.focus.view.browserSurface.resource
      surfaceResource.removeDestroyListener(this._focusDestroyListener)

      this._doPointerEventFor(surfaceResource, (pointerResource) => {
        // console.log('leave( %f, %s )', this.leaveSerial + 1, surfaceResource)
        pointerResource.leave(this._nextFocusSerial(), surfaceResource)
      })
      this.focus.style.cursor = 'auto'
      this.focus = null
    }
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
