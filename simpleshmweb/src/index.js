import {
  display,
  webFS,
  WlCompositorProxy,
  WebShmProxy,
  WlShellProxy
} from 'westfield-runtime-client'

/**
 * @implements WebArrayBufferEvents
 * @implements WlBufferEvents
 */
class WebArrayBuffer {
  /**
   * @param {WebShmProxy}webShm
   * @param {number}width
   * @param {number}height
   * @return {WebArrayBuffer}
   */
  static create (webShm, width, height) {
    const arrayBuffer = new ArrayBuffer(height * width * Uint32Array.BYTES_PER_ELEMENT)
    const shmBufferWebFD = webFS.fromArrayBuffer(arrayBuffer)

    return new WebArrayBuffer(webShm, shmBufferWebFD, arrayBuffer, width, height)
  }

  /**
   * @param {WebShmProxy}webShm
   * @param {WebFD}shmBufferWebFD
   * @param {ArrayBuffer}arrayBuffer
   * @param {number}width
   * @param {number}height
   */
  constructor (webShm, shmBufferWebFD, arrayBuffer, width, height) {
    /**
     * @type {WebShmProxy}
     * @private
     */
    this._webShm = webShm
    /**
     * @type {WebArrayBufferProxy|null}
     */
    this.proxy = null
    /**
     * @type {WlBufferProxy|null}
     */
    this.bufferProxy = null
    /**
     * @type {WebFD}
     * @private
     */
    this._shmBufferWebFD = shmBufferWebFD
    /**
     * @type {ArrayBuffer}
     */
    this.arrayBuffer = arrayBuffer
    /**
     * @type {number}
     */
    this.width = width
    /**
     * @type {number}
     */
    this.height = height
  }

  seal () {
    if (this.proxy) {
      this.proxy.attach(this._shmBufferWebFD)
    } else {
      this.proxy = this._webShm.createWebArrayBuffer(this._shmBufferWebFD, this.width, this.height)
      this.bufferProxy = this._webShm.createBuffer(this.proxy)

      this.proxy.listener = this
      this.bufferProxy.listener = this
    }
  }

  /**
   *
   *                Detaches the associated HTML5 array buffer from the compositor and returns it to the client.
   *                No action is expected for this event. It merely functions as a HTML5 array buffer ownership
   *                transfer from main thread to web-worker.
   *
   *
   * @param {WebFD} arrayBuffer HTML5 array buffer to detach from the compositor
   *
   * @since 1
   *
   */
  detach (arrayBuffer) {}

  release () {}
}

/**
 * @implements WlRegistryEvents
 * @implements WebShmEvents
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
    const window = new Window(registry, width, height)
    registry.listener = window
    return window
  }

  /**
   * @param {WlRegistryProxy}registry
   * @param {number}width
   * @param {number}height
   */
  constructor (registry, width, height) {
    /**
     * @type {WlRegistryProxy}
     * @protected
     */
    this._registry = registry
    /**
     * @type {number}
     */
    this.width = width
    /**
     * @type {number}
     */
    this.height = height
    /**
     * @type {WlCompositorProxy|null}
     * @private
     */
    this._compositor = null
    /**
     * @type {WebShmProxy|null}
     * @private
     */
    this._webShm = null
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
    /**
     * @type {Array<WebArrayBuffer>}
     * @protected
     */
    this._buffers = []
    /**
     * @type {number}
     * @protected
     */
    this._nextBufferIdx = 0
    /**
     * @type {Promise<number>}
     * @private
     */
    this._syncPromise = null
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
    }

    if (interface_ === WebShmProxy.protocolName) {
      this._webShm = this._registry.bind(name, interface_, WebShmProxy, version)
      this._webShm.listener = this

      this._buffers[0] = WebArrayBuffer.create(this._webShm, this.width, this.height)
      this._buffers[1] = WebArrayBuffer.create(this._webShm, this.width, this.height)
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

  /**
   * @param {WebArrayBuffer}buffer
   * @param {number}timestamp
   * @private
   */
  _paintPixels (buffer, timestamp) {
    const halfh = buffer.width / 2
    const halfw = buffer.height / 2
    let ir
    let or
    const image = new Uint32Array(buffer.arrayBuffer)

    /* squared radii thresholds */
    or = (halfw < halfh ? halfw : halfh) - 8
    ir = or - 32
    or = or * or
    ir = ir * ir

    let offset = 0
    for (let y = 0; y < buffer.height; y++) {
      const y2 = (y - halfh) * (y - halfh)

      for (let x = 0; x < buffer.width; x++) {
        let v

        const r2 = (x - halfw) * (x - halfw) + y2

        if (r2 < ir) {
          v = (r2 / 32 + timestamp / 64) * 0x8040100
        } else if (r2 < or) {
          v = (y + timestamp / 32) * 0x8040100
        } else {
          v = (x + timestamp / 16) * 0x8040100
        }
        v &= 0x0ffffff00

        if (Math.abs(x - y) > 6 && Math.abs(x + y - buffer.height) > 6) {
          v |= 0x000000ff
        }

        image[offset++] = v
      }
    }
  }

  /**
   * @param {number}timestamp
   */
  draw (timestamp) {
    const webArrayBuffer = this._buffers[this._nextBufferIdx++ % 2]

    this._paintPixels(webArrayBuffer, timestamp)
    webArrayBuffer.seal()

    this._surface.attach(webArrayBuffer.bufferProxy, 0, 0)
    this._surface.damage(0, 0, webArrayBuffer.width, webArrayBuffer.height)

    // wait for the compositor to signal that we can draw the next frame
    new Promise(resolve => { this._surface.frame().listener = { done: resolve } }).then(timestamp => this.draw(timestamp))

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
  configure (edges, width, height) {
    // NOOP
  }

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
    this._shellSurface.pong()
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
  popupDone () {
    // NOOP
  }
}

function main () {
  // create a new window with some buffers
  const window = Window.create(250, 250)
  // Wait for all outgoing window creation requests to be processed before we attempt to draw something
  new Promise(resolve => { display.sync().listener = { done: resolve } }).then(() => {
    window.init()
    window.draw(0)
  })
  // flush piled up window creation requests to the display
  display.connection.flush()
}

main()
