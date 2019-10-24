// Copyright 2019 Erik De Rijcke
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict'

import {
  display,
  frame,
  WlCompositorProxy,
  GrWebGlProxy,
  WlShellProxy,
  WlSeatProxy,
  WlPointerProxy
} from 'westfield-runtime-client'

import { initDraw, drawScene } from './webgl-demo'

/**
 * @implements GrWebGLBufferEvents
 * @implements WlBufferEvents
 */
class GLBuffer {
  /**
   * @param {GrWebGlProxy}webGL
   * @param {GLBufferPool}glBufferPool
   * @return {GLBuffer}
   */
  static create (webGL) {
    const proxy = webGL.createWebGlBuffer()
    const bufferProxy = webGL.createBuffer(proxy)

    const glBuffer = new GLBuffer(proxy, bufferProxy)

    proxy.listener = glBuffer
    bufferProxy.listener = glBuffer

    return glBuffer
  }

  /**
   * @param {GrWebGLBufferProxy}proxy
   * @param {WlBufferProxy}bufferProxy
   */
  constructor (proxy, bufferProxy) {
    /**
     * @type {GrWebGLBufferProxy}
     */
    this.proxy = proxy
    /**
     * @type {WlBufferProxy}
     */
    this.bufferProxy = bufferProxy
    /**
     * @type {OffscreenCanvas}
     * @private
     */
    this.canvas = null
  }

  /**
   * @param {WebFD}canvas
   */
  async offscreenCanvas (canvas) {
    this.canvas = await canvas.getTransferable()
  }

  /**
   *
   *  Sent when this wl_buffer is no longer used by the compositor.
   *  The client is now free to reuse or destroy this buffer and its
   *  backing storage.
   *
   *  If a client receives a release event before the frame callback
   *  requested in the same wl_surface.commit that attaches this
   *  wl_buffer to a surface, then the client is immediately free to
   *  reuse the buffer and its backing storage, and does not need a
   *  second buffer for the next surface content update. Typically
   *  this is possible, when the compositor maintains a copy of the
   *  wl_surface contents, e.g. as a GL texture. This is an important
   *  optimization for GL(ES) compositors with wl_shm clients.
   *
   *
   *
   * @since 1
   *
   */
  release () { /* NOOP */ }
}

/**
 * @implements WlRegistryEvents
 * @implements WlShellSurfaceEvents
 * @implements WlSeatEvents
 * @implements WlPointerEvents
 */
class Window {
  /**
   * @return {Window}
   */
  static create () {
    const registry = display.getRegistry()
    const window = new Window(registry)
    registry.listener = window
    return window
  }

  /**
   * @param {WlRegistryProxy}registry
   */
  constructor (registry) {
    /**
     * @type {WlRegistryProxy}
     * @protected
     */
    this._registry = registry
    /**
     * @type {WebGLRenderingContext}
     * @protected
     */
    this._gl = null
    /**
     * @type {GrWebGlProxy|null}
     * @private
     */
    this._webGL = null
    /**
     * @type {WlCompositorProxy|null}
     * @private
     */
    this._compositor = null
    /**
     * @type {WlShellProxy|null}
     * @private
     */
    this._shell = null
    /**
     * @type {WlSeatProxy}
     * @private
     */
    this._seat = null
    /**
     * @type {WlSurfaceProxy|null}
     * @private
     */
    this._surface = null
    /**
     * @type {WlShellSurfaceProxy|null}
     * @private
     */
    this._shellSurface = null
    /**
     * @type {GLBuffer}
     * @private
     */
    this._glBuffer = null
    this._lastFrameRenderTime = Date.now()
    this._frameCount = 0
  }

  /**
   *
   *  Notify the client of global objects.
   *
   *  The event notifies the client that a global object with
   *  the given name is now available, and it implements the
   *  given version of the given interface.
   *
   *
   * @param {number} name numeric name of the global object
   * @param {string} interface_ interface implemented by the object
   * @param {number} version interface version
   *
   * @since 1
   *
   */
  global (name, interface_, version) {
    switch (interface_) {
      case WlCompositorProxy.protocolName: {
        this._compositor = this._registry.bind(name, WlCompositorProxy.protocolName, WlCompositorProxy, version)
        this._surface = this._compositor.createSurface()
        this._onFrame = frame(this._surface)
        break
      }

      case GrWebGlProxy.protocolName: {
        this._webGL = this._registry.bind(name, GrWebGlProxy.protocolName, GrWebGlProxy, version)
        this._glBuffer = GLBuffer.create(this._webGL)
        break
      }

      case WlShellProxy.protocolName: {
        this._shell = this._registry.bind(name, WlShellProxy.protocolName, WlShellProxy, version)
        break
      }

      case WlSeatProxy.protocolName: {
        this._seat = this._registry.bind(name, WlSeatProxy.protocolName, WlSeatProxy, version)
        this._seat.listener = this
      }
    }
  }

  /**
   * @param {number}width
   * @param {number}height
   */
  async init (width, height) {
    this._shellSurface = this._shell.getShellSurface(this._surface)
    this._shellSurface.listener = this
    this._shellSurface.setToplevel()
    this._shellSurface.setTitle('Simple WebGL')

    const syncPromise = display.sync()
    display.flush()
    await syncPromise

    this._glBuffer.canvas.width = width
    this._glBuffer.canvas.height = height
    this._gl = /** @type {WebGLRenderingContext} */this._glBuffer.canvas.getContext('webgl')

    this._drawState = initDraw(this._gl)
    setInterval(() => {
      console.log(`Simpl-WebGL: ${this._frameCount} fps`)
      this._frameCount = 0
    }, 1000)
  }

  /**
   * @param {number}time
   */
  async draw (time) {
    drawScene(this._gl, this._drawState, time)

    this._surface.attach(this._glBuffer.bufferProxy, 0, 0)
    this._surface.damage(0, 0, this._glBuffer.canvas.width, this._glBuffer.canvas.height)

    // Wait for the compositor to signal that we can draw the next frame.
    // Note that using 'await' here would result in a deadlock as the event loop would be blocked, and the event
    // that resolves the await state would never be picked up by the blocked event loop.
    this._onFrame().then(time => this.draw(time))

    // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
    this._surface.commit(0)
    display.flush()

    this._frameCount++
  }

  /**
   * @param {number}name
   */
  globalRemove (name) {
    // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
  }

  /**
   *
   *  The configure event asks the client to resize its surface.
   *
   *  The size is a hint, in the sense that the client is free to
   *  ignore it if it doesn't resize, pick a smaller size (to
   *  satisfy aspect ratio or resize in steps of NxM pixels).
   *
   *  The edges parameter provides a hint about how the surface
   *  was resized. The client may use this information to decide
   *  how to adjust its content to the new size (e.g. a scrolling
   *  area might adjust its content position to leave the viewable
   *  content unmoved).
   *
   *  The client is free to dismiss all but the last configure
   *  event it received.
   *
   *  The width and height arguments specify the size of the window
   *  in surface-local coordinates.
   *
   *
   * @param {number} edges how the surface was resized
   * @param {number} width new width of the surface
   * @param {number} height new height of the surface
   *
   * @since 1
   *
   */
  configure (edges, width, height) { /* NOOP */ }

  /**
   *
   *  Ping a client to check if it is receiving events and sending
   *  requests. A client is expected to reply with a pong request.
   *
   *
   * @param {number} serial serial number of the ping
   *
   * @since 1
   *
   */
  ping (serial) {
    this._shellSurface.pong(serial)
  }

  /**
   *
   *  The popup_done event is sent out when a popup grab is broken,
   *  that is, when the user clicks a surface that doesn't belong
   *  to the client owning the popup surface.
   *
   *
   *
   * @since 1
   *
   */
  popupDone () { /* NOOP */ }

  /**
   *
   *  This is emitted whenever a seat gains or loses the pointer,
   *  keyboard or touch capabilities.  The argument is a capability
   *  enum containing the complete set of capabilities this seat has.
   *
   *  When the pointer capability is added, a client may create a
   *  wl_pointer object using the wl_seat.get_pointer request. This object
   *  will receive pointer events until the capability is removed in the
   *  future.
   *
   *  When the pointer capability is removed, a client should destroy the
   *  wl_pointer objects associated with the seat where the capability was
   *  removed, using the wl_pointer.release request. No further pointer
   *  events will be received on these objects.
   *
   *  In some compositors, if a seat regains the pointer capability and a
   *  client has a previously obtained wl_pointer object of version 4 or
   *  less, that object may start sending pointer events again. This
   *  behavior is considered a misinterpretation of the intended behavior
   *  and must not be relied upon by the client. wl_pointer objects of
   *  version 5 or later must not send events if created before the most
   *  recent event notifying the client of an added pointer capability.
   *
   *  The above behavior also applies to wl_keyboard and wl_touch with the
   *  keyboard and touch capabilities, respectively.
   *
   *
   * @param {number} capabilities capabilities of the seat
   *
   * @since 1
   *
   */
  capabilities (capabilities) {
    if (capabilities & WlSeatProxy.Capability.pointer) {
      this._pointer = this._seat.getPointer()
      this._pointer.listener = this
    } else if (this._pointer) {
      this._pointer.release()
      this._pointer = null
    }
  }

  /**
   *
   *  In a multiseat configuration this can be used by the client to help
   *  identify which physical devices the seat represents. Based on
   *  the seat configuration used by the compositor.
   *
   *
   * @param {string} name seat identifier
   *
   * @since 2
   *
   */
  name (name) { /* NOOP */ }

  axis (time, axis, value) { /* NOOP */ }

  axisDiscrete (axis, discrete) { /* NOOP */ }

  axisSource (axisSource) { /* NOOP */ }

  axisStop (time, axis) { /* NOOP */ }

  button (serial, time, button, state) {
    if (state & WlPointerProxy.ButtonState.pressed) {
      this._shellSurface.move(this._seat, serial)
    }
  }

  enter (serial, surface, surfaceX, surfaceY) { /* NOOP */ }

  frame () { /* NOOP */ }

  leave (serial, surface) { /* NOOP */ }

  motion (time, surfaceX, surfaceY) { /* NOOP */ }
}

async function main () {
  // create a new window with some buffers
  const window = Window.create(800, 600)

  // create a sync promise
  const syncPromise = display.sync()

  // flush out window creation & sync requests to the compositor
  display.flush()

  // wait for compositor to have processed all our outgoing requests
  await syncPromise

  // Now begin drawing after the compositor is done processing all our requests
  await window.init(800, 600)
  window.draw(0)
  display.flush()

  // wait for the display connection to close
  try {
    await display.onClose()
    console.log('Application exit.')
  } catch (e) {
    console.error('Application terminated with error.')
    console.error(e.stackTrace)
  }
}

main()
