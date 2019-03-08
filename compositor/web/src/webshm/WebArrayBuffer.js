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
   * @param {WlBufferResource}bufferResource
   * @param {number}width
   * @param {number}height
   */
  static async create (resource, bufferResource, width, height) {
    const shmFrame = ShmFrame.create(width, height)
    const webArrayBuffer = new WebArrayBuffer(resource, bufferResource, shmFrame)
    resource.implementation = webArrayBuffer
    return webArrayBuffer
  }

  /**
   * @param {WebArrayBufferResource}resource
   * @param {WlBufferResource}bufferResource
   * @param {ShmFrame}shmFrame
   */
  constructor (resource, bufferResource, shmFrame) {
    super()
    /**
     * @type {WebArrayBufferResource}
     */
    this.resource = resource
    /**
     * @type {WlBufferResource}
     */
    this.bufferResource = bufferResource
    /**
     * @type {WebFD|null}
     * @private
     */
    this._pixelContent = null
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
   *
   *
   * @param {WebArrayBufferResource} resource
   * @param {WebFD} pixelContent HTML5 array buffer to attach to the compositor.
   *
   * @since 1
   *
   */
  async attach (resource, pixelContent) {
    this._pixelContent = pixelContent
    await this._shmFrame.attach(pixelContent)
  }

  /**
   * @param {number}serial
   * @return {Promise<ShmFrame>}
   */
  async getContents (serial) {
    return Promise.resolve(this._shmFrame)
  }

  release () {
    this.resource.detach(this._pixelContent)
    this.bufferResource.release()
  }
}
