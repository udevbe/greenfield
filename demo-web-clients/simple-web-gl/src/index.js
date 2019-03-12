import {
  display,
  webFS,
  frame,
  WlCompositorProxy,
  GrWebGLProxy,
  WlShellProxy
} from 'westfield-runtime-client'

class GLBufferPool {
  /**
   * @param {GrWebGLProxy}webGL
   * @param {number}poolSize
   * @return {GLBufferPool}
   */
  static create (webGL, poolSize) {
    const available = new Array(poolSize)
    const glBufferPool = new GLBufferPool(available)
    for (let i = 0; i < poolSize; i++) {
      available[i] = GLBuffer.create(webGL, glBufferPool)
    }
    return glBufferPool
  }

  constructor (available) {
    /**
     * @type {Array<GLBuffer>}
     * @protected
     */
    this._available = available
    /**
     * @type {Array<GLBuffer>}
     * @protected
     */
    this._busy = []
  }

  /**
   * @param {GLBuffer}glBuffer
   */
  give (glBuffer) {
    const idx = this._busy.indexOf(glBuffer)
    if (idx > -1) {
      this._busy.splice(idx, 1)
    }
    this._available.push(glBuffer)
  }

  /**
   * @return {GLBuffer|null}
   */
  take () {
    const glBuffer = this._available.shift()
    if (glBuffer != null) {
      this._busy.push(glBuffer)
      return glBuffer
    }
    return null
  }
}

/**
 * @implements GrWebGLBufferEvents
 * @implements WlBufferEvents
 */
class GLBuffer {
  /**
   * @param {GrWebGLProxy}webGL
   * @param {number}width
   * @param {number}height
   * @param {GLBufferPool}glBufferPool
   * @return {GLBuffer}
   */
  static create (webGL, offscreenCanvas, glBufferPool) {
    const proxy = webGL.createWebGLBuffer()
    const bufferProxy = webGL.createBuffer(proxy)

    const glBuffer = new GLBuffer(proxy, bufferProxy, offscreenCanvas, glBufferPool)

    proxy.listener = glBuffer
    bufferProxy.listener = glBuffer

    return glBuffer
  }

  /**
   * @param {GrWebGLBufferProxy}proxy
   * @param {WlBufferProxy}bufferProxy
   * @param {OffscreenCanvas}offscreenCanvas
   * @param {GLBufferPool}glBufferPool
   */
  constructor (proxy, bufferProxy, offscreenCanvas, glBufferPool) {
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
    this._offscreenCanvas = offscreenCanvas
    /**
     * @type {GLBufferPool}
     * @private
     */
    this._glBufferPool = glBufferPool
  }

  transfer () {
    this.proxy.transfer(this._offscreenCanvas.transferToImageBitmap())
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
  release () {
    this._glBufferPool.give(this)
  }
}

/**
 * @implements WlRegistryEvents
 * @implements WlShellSurfaceEvents
 */
class Window {
  /**
   * @param {number}width
   * @param {number}height
   * @return {Window}
   */
  static create (width, height) {
    const registry = display.getRegistry()
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const gl = /** @type {WebGLRenderingContext} */offscreenCanvas.getContext('webgl2')
    const window = new Window(registry, offscreenCanvas, gl)
    registry.listener = window
    return window
  }

  /**
   * @param {WlRegistryProxy}registry
   * @param {OffscreenCanvas} offscreenCanvas
   * @param {WebGLRenderingContext}gl
   */
  constructor (registry, offscreenCanvas, gl) {
    /**
     * @type {WlRegistryProxy}
     * @protected
     */
    this._registry = registry
    /**
     * @type {OffscreenCanvas}
     */
    this._offscreenCanvas = offscreenCanvas
    /**
     * @type {WebGLRenderingContext}
     * @private
     */
    this._gl = gl
    /**
     * @type {GrWebGLProxy|null}
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
     * @type {WlSurfaceProxy|null}
     * @private
     */
    this._surface = null
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
    if (interface_ === WlCompositorProxy.protocolName) {
      this._compositor = this._registry.bind(name, interface_, WlCompositorProxy, version)
      this._surface = this._compositor.createSurface()
      this._onFrame = frame(this._surface)
    }

    if (interface_ === GrWebGLProxy.protocolName) {
      this._webGL = this._registry.bind(name, interface_, GrWebGLProxy, version)
      this._glBufferPool = GLBufferPool.create(this._webGL, 2)
    }

    if (interface_ === WlShellProxy.protocolName) {
      this._shell = this._registry.bind(name, interface_, WlShellProxy, version)
    }
  }

  init () {
    this._shellSurface = this._shell.getShellSurface(this._surface)
    this._shellSurface.listener = this
    this._shellSurface.setToplevel()
    this._shellSurface.setTitle('Simple Shm Web')
  }

  _paintPixels (timestamp) {
    // TODO gl stuff here
  }

  /**
   * @param {number}timestamp
   */
  draw (timestamp) {
    const glBuffer = this._glBufferPool.take()
    this._paintPixels(timestamp)
    glBuffer.transfer()

    this._surface.attach(glBuffer.bufferProxy, 0, 0)
    this._surface.damage(0, 0, this._offscreenCanvas.width, this._offscreenCanvas.height)

    // Wait for the compositor to signal that we can draw the next frame.
    // Note that using 'await' here would result in a deadlock as the event loop would be blocked, and the event
    // that resolves the await state would never be picked up by the blocked event loop.
    this._onFrame().then(timestamp => this.draw(timestamp))

    // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
    this._surface.commit(0)
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
  window.init()
  window.draw(0)

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
