import { Display, WlCompositorProxy, WebShmProxy } from 'westfield-runtime-client'
import WebFS from '../../compositor/web/src/WebFS'

/**
 * @implements WlRegistryEvents
 * @implements WebShmEvents
 */
export default class SimpleWebShm {
  /**
   * @param {Display}display
   * @return {SimpleWebShm}
   */
  static create (display) {
    // TODO receive client uuid from server?
    const webFS = WebFS.create(this._uuidv4())
    const registry = display.getRegistry()
    const window = new SimpleWebShm(webFS, display, registry)
    registry.listener = window
    return window
  }

  /**
   * @returns {string}
   * @private
   */
  static _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  /**
   * @param {WebFS}webFS
   * @param {Display}display
   * @param {WlRegistryProxy}registry
   */
  constructor (webFS, display, registry) {
    /**
     * @type {WebFS}
     * @protected
     */
    this._webFS = webFS
    /**
     * @type {Display}
     * @protected
     */
    this._display = display
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
    if (interface_ === 'wl_compositor') {
      this._compositor = this._registry.bind(name, interface_, WlCompositorProxy.constructor, version)
    }

    if (interface_ === 'web_shm') {
      this._webShm = this._registry.bind(name, interface_, WebShmProxy.constructor, version)
    }

    // Wait for all incoming events to be processed before we attempt to draw something
    if (!this._syncPromise) {
      this._syncPromise = this._sync().then(() => {
        if (!this._shmBuffers.length) {
          throw new Error('No xrgb8888 shm format.')
        }

        if (!this._compositor) {
          throw new Error('No compositor global.')
        }

        this._draw(0)
      })
    }
  }

  /**
   * @return {Promise<number>}
   * @private
   */
  _sync () {
    return new Promise(resolve => { this._display.sync().listener.done = resolve })
  }

  /**
   * @param {number}timestamp
   * @private
   */
  _draw (timestamp) {

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

      const shmBufferWebFD0 = this._webFS.fromArrayBuffer(new ArrayBuffer(size))
      const shmBufferWebFD1 = this._webFS.fromArrayBuffer(new ArrayBuffer(size))

      this._shmBuffers[0] = this._webShm.createWebArrayBuffer(shmBufferWebFD0, bufWidth, bufHeight, bufStride, format)
      this._shmBuffers[1] = this._webShm.createWebArrayBuffer(shmBufferWebFD1, bufWidth, bufHeight, bufStride, format)
    }
  }
}

function main () {
  SimpleWebShm.create(new Display())
}

main()
