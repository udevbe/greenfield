import { display, webFS, WlCompositorProxy, WebShmProxy } from 'westfield-runtime-client'

/**
 * @implements WlRegistryEvents
 * @implements WebShmEvents
 */
export default class Window {
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
     * @type {Array<WebArrayBufferProxy>}
     * @protected
     */
    this._shmBuffers = [null, null]
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
    }

    if (interface_ === WebShmProxy.protocolName) {
      this._webShm = this._registry.bind(name, interface_, WebShmProxy, version)
      this._webShm.listener = this
    }
  }

  /**
   * @param {number}timestamp
   */
  draw (timestamp) {

    // TODO draw
  }

  /**
   * @param {number}name
   */
  globalRemove (name) {
    // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
  }

  /**
   *
   *                Informs the client about a valid pixel format that
   *                can be used for buffers. Known formats include
   *                argb8888 and xrgb8888.
   *
   *
   * @param {number} format buffer pixel format
   *
   * @since 1
   *
   */
  format (format) {
    if (format === WebShmProxy.Format.xrgb8888) {
      const bufWidth = 250
      const bufHeight = 250
      const bufStride = 250
      const size = bufStride * bufHeight
      const format = WebShmProxy.Format.xrgb8888

      const shmBufferWebFD0 = webFS.fromArrayBuffer(new ArrayBuffer(size))
      const shmBufferWebFD1 = webFS.fromArrayBuffer(new ArrayBuffer(size))

      this._shmBuffers[0] = this._webShm.createWebArrayBuffer(shmBufferWebFD0, bufWidth, bufHeight, bufStride, format)
      this._shmBuffers[1] = this._webShm.createWebArrayBuffer(shmBufferWebFD1, bufWidth, bufHeight, bufStride, format)
    }
  }
}

function main () {
  // create a new window with some buffers
  const window = Window.create()

  // Wait for all outgoing window creation requests to be processed before we attempt to draw something
  new Promise(resolve => { display.sync().listener = { done: resolve } }).then(() => {
    if (!window._shmBuffers.length) {
      throw new Error('No xrgb8888 shm format.')
    }

    if (!window._compositor) {
      throw new Error('No compositor global.')
    }

    window.draw(0)
  })

  // flush piled up window creation requests to the display
  display.connection.flush()
}

main()
