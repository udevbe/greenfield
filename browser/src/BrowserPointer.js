'use strict'

import greenfield from './protocol/greenfield-browser-protocol'

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
   * @returns {BrowserPointer}
   */
  static create () {
    const browserPointer = new BrowserPointer()
    // TODO these listeners should be added on document level as they are send to the grabbed surface, and not on the focussed surface
    document.addEventListener('mousemove', (event) => {
      browserPointer.onMouseMove(event)
    }, true)
    document.addEventListener('mouseup', (event) => {
      browserPointer.onMouseUp(event)
    }, true)
    document.addEventListener('mousedown', (event) => {
      browserPointer.onMouseDown(event)
    }, true)
    // other mouse events are set in the browser surface view class
    return browserPointer
  }

  constructor () {
    this.resources = []
    this.focus = null
    this.grab = null
    this._focusDestroyListener = () => {
      this.grab = null
      this.onMouseLeave(this.focus)
      // TODO recalculate enter and consequently focus
    }
    this._btnDwnCount = 0
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
   * @param {MouseEvent}event
   */
  onMouseMove (event) {
    if (this.focus) {
      this._doPointerEventFor(this.focus, (pointerResource) => {
        // FIXME we need to accommodate for canvas dimensions (clientX, clientY) being possibly different than surface dimensions (which should actually be send)
        pointerResource.motion(event.timeStamp, greenfield.parseFixed(event.clientX), greenfield.parseFixed(event.clientY))
      })
    }
  }

  _doPointerEventFor (browserSurface, action) {
    this.resources.forEach(pointerResource => {
      if (pointerResource.client === browserSurface.resource.client) {
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

    this._doPointerEventFor(this.focus, (pointerResource) => {
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
    }

    this._btnDwnCount++
    this._doPointerEventFor(this.focus, (pointerResource) => {
      pointerResource.button(this._nextButtonSerial(), event.timeStamp, linuxInput[event.button], greenfield.GrPointer.ButtonState.pressed)
    })
  }

  /**
   * @param {MouseEvent}event
   * @param {BrowserSurface}browserSurface
   */
  onMouseEnter (event, browserSurface) {
    if (this.grab) {
      return
    }
    this.focus = browserSurface
    this.focus.resource.addDestroyListener(this._focusDestroyListener)

    this._doPointerEventFor(this.focus, (pointerResource) => {
      // FIXME we need to accommodate for canvas dimensions (clientX, clientY) being possibly different than surface dimensions (which should actually be send)
      pointerResource.enter(this._nextEnterSerial(), this.focus.resource, greenfield.parseFixed(event.clientX), greenfield.parseFixed(event.clientY))
    })
  }

  /**
   * @param {BrowserSurface}browserSurface
   */
  onMouseLeave (browserSurface) {
    if (this.grab) {
      return
    }

    if (this.focus === browserSurface) {
      this.focus.resource.removeDestroyListener(this._focusDestroyListener)
      this._doPointerEventFor(this.focus, (pointerResource) => {
        // FIXME we need to accommodate for canvas dimensions (clientX, clientY) being possibly different than surface dimensions (which should actually be send)
        pointerResource.leave(this._nextLeaveSerial(), this.focus.resource)
      })
      this.focus = null
    }
  }
}
