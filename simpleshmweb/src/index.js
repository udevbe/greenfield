import {
  display,
  webFS,
  WlCompositorProxy,
  WebShmProxy,
  WlShellProxy
} from 'westfield-runtime-client'

class WebArrayBufferPool {
  static create (webShm, poolSize, width, height) {
    const available = new Array(poolSize)
    const webArrayBufferPool = new WebArrayBufferPool(available)
    for (let i = 0; i < poolSize; i++) {
      available[i] = WebArrayBuffer.create(webShm, width, height, webArrayBufferPool)
    }
    return webArrayBufferPool
  }

  constructor (available) {
    /**
     * @type {Array<WebArrayBuffer>}
     * @protected
     */
    this._available = available
    /**
     * @type {Array<WebArrayBuffer>}
     * @protected
     */
    this._busy = []
  }

  give (webArrayBuffer) {
    const idx = this._busy.indexOf(webArrayBuffer)
    if (idx > -1) {
      this._busy.splice(idx, 1)
    }
    this._available.push(webArrayBuffer)
  }

  take () {
    const webArrayBuffer = this._available.shift()
    if (webArrayBuffer != null) {
      this._busy.push(webArrayBuffer)
      return webArrayBuffer
    }
    return null
  }
}

/**
 * @implements WebArrayBufferEvents
 * @implements WlBufferEvents
 */
class WebArrayBuffer {
  /**
   * @param {WebShmProxy}webShm
   * @param {number}width
   * @param {number}height
   * @param {WebArrayBufferPool}webArrayBufferPool
   * @return {WebArrayBuffer}
   */
  static create (webShm, width, height, webArrayBufferPool) {
    const arrayBuffer = new ArrayBuffer(height * width * Uint32Array.BYTES_PER_ELEMENT)
    const pixelContent = webFS.fromArrayBuffer(arrayBuffer)

    const proxy = webShm.createWebArrayBuffer()
    const bufferProxy = webShm.createBuffer(proxy, width, height)

    const webArrayBuffer = new WebArrayBuffer(proxy, bufferProxy, pixelContent, arrayBuffer, width, height, webArrayBufferPool)

    proxy.listener = webArrayBuffer
    bufferProxy.listener = webArrayBuffer

    return webArrayBuffer
  }

  /**
   * @param {WebArrayBuffer}proxy
   * @param {WlBufferProxy}bufferProxy
   * @param {WebFD}pixelContent
   * @param {ArrayBuffer}arrayBuffer
   * @param {number}width
   * @param {number}height
   * @param {WebArrayBufferPool}webArrayBufferPool
   */
  constructor (proxy, bufferProxy, pixelContent, arrayBuffer, width, height, webArrayBufferPool) {
    /**
     * @type {WebArrayBufferProxy}
     */
    this.proxy = proxy
    /**
     * @type {WlBufferProxy}
     */
    this.bufferProxy = bufferProxy
    /**
     * @type {WebFD}
     * @private
     */
    this._pixelContent = pixelContent
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
    /**
     * @type {WebArrayBufferPool}
     * @private
     */
    this._webArrayBufferPool = webArrayBufferPool
  }

  attach () {
    this.proxy.attach(this._pixelContent)
  }

  async detach (pixelContent) {
    this._pixelContent = pixelContent
    this.arrayBuffer = /** @type {ArrayBuffer} */ await pixelContent.getTransferable()
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
    this._webArrayBufferPool.give(this)
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
     * @type {WebArrayBufferPool|null}
     * @private
     */
    this._webArrayBufferPool = null
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

      this._webArrayBufferPool = WebArrayBufferPool.create(this._webShm, 2, this.width, this.height)
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
    const halfh = buffer.width >> 1
    const halfw = buffer.height >> 1
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
        let w = 0xff000000

        /* squared distance from center */
        const r2 = (x - halfw) * (x - halfw) + y2

        if (r2 < ir) {
          v = ((r2 >> 5) + (timestamp >> 6)) * 0x0080401
        } else if (r2 < or) {
          v = (y + (timestamp >> 5)) * 0x0080401
        } else {
          v = (x + (timestamp >> 4)) * 0x0080401
        }
        // ARGB => ABGR (RGBA LE)
        w |= ((v & 0x00ff0000) >> 16) // R
        w |= ((v & 0x0000ff00)) // G
        w |= ((v & 0x000000ff) << 16) // B

        image[offset++] = w
      }
    }
  }

  /**
   * @param {number}timestamp
   */
  draw (timestamp) {
    const webArrayBuffer = this._webArrayBufferPool.take()
    if (webArrayBuffer) {
      this._paintPixels(webArrayBuffer, timestamp)
      webArrayBuffer.attach()

      this._surface.attach(webArrayBuffer.bufferProxy, 0, 0)
      this._surface.damage(0, 0, webArrayBuffer.width, webArrayBuffer.height)

      // wait for the compositor to signal that we can draw the next frame
      new Promise(resolve => { this._surface.frame().listener = { done: resolve } }).then(timestamp => {
        return this.draw(timestamp)
      })

      // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
      this._surface.commit(0)
    } else {
      throw new Error('All buffers occupied :s')
    }
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
