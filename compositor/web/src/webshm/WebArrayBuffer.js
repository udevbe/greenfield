import WebArrayBufferRequests from '../protocol/WebArrayBufferRequests'
import ShmFrame from '../ShmFrame'

/**
 * @implements WlBufferRequests
 * @implements WebArrayBufferRequests
 * @implements BufferImplementation
 */
export default class WebArrayBuffer extends WebArrayBufferRequests {
  /**
   * @param {WebArrayBufferResource}resource
   * @param {ArrayBuffer}arrayBuffer
   * @param {number}width
   * @param {number}height
   */
  static create (resource, arrayBuffer, width, height) {
    const shmFrame = ShmFrame.create(arrayBuffer, width, height)
    const webArrayBuffer = new WebArrayBuffer(resource, shmFrame)
    resource.implementation = webArrayBuffer
    return webArrayBuffer
  }

  /**
   * @param {WebArrayBufferResource}resource
   * @param {ShmFrame}shmFrame
   */
  constructor (resource, shmFrame) {
    super()
    /**
     * @type {WebArrayBufferResource}
     */
    this.resource = resource
    /**
     * @type {ShmFrame}
     */
    this._shmFrame = shmFrame
  }

  /**
   *
   *  Destroy a buffer. If and how you need to release the backing
   *  storage is defined by the buffer factory interface.
   *
   *  For possible side-effects to a surface, see wl_surface.attach.
   *
   *
   * @param {WlBufferResource} resource
   *
   * @since 1
   * @override
   *
   */
  destroy (resource) {
    // TODO what to do here?
    resource.destroy()
  }

  /**
   *
   *                Attaches the associated HTML5 array buffer to the compositor. The array buffer should be the same
   *                object as the one used to create this buffer. No action is expected for this request. It merely
   *                functions as a HTML5 array buffer ownership transfer from web-worker to main thread.
   *
   *
   * @param {WebArrayBufferResource} resource
   * @param {WebFD} arrayBuffer HTML5 array buffer to attach to the compositor.
   *
   * @since 1
   *
   */
  attach (resource, arrayBuffer) {}

  /**
   * @param {number}serial
   * @return {Promise<ShmFrame>}
   */
  async getContents (serial) {
    return Promise.resolve(this._shmFrame)
  }
}
