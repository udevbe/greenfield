import GrWebGlBufferRequests from '../protocol/GrWebGlBufferRequests'
import WebGLFrame from './WebGLFrame'

/**
 * @implements {GrWebGlBufferRequests}
 * @implements {WlBufferRequests}
 * @implements BufferImplementation
 */
export default class WebGLBuffer extends GrWebGlBufferRequests {
  /**
   * @param {GrWebGlBufferResource}resource
   * @param {WlBufferResource}bufferResource
   * @return {WebGLBuffer}
   */
  static create (resource, bufferResource) {
    const webGLFrame = WebGLFrame.create()
    return new WebGLBuffer(resource, bufferResource, webGLFrame)
  }

  /**
   * @param {GrWebGlBufferResource}resource
   * @param {WlBufferResource}bufferResource
   * @param {WebGLFrame}webGLFrame
   */
  constructor (resource, bufferResource, webGLFrame) {
    super()
    /**
     * @type {GrWebGlBufferResource}
     */
    this.resource = resource
    /**
     * @type {WlBufferResource}
     */
    this.bufferResource = bufferResource
    /**
     * @type {WebGLFrame}
     * @private
     */
    this._webGLFrame = webGLFrame
  }

  /**
   *
   *                Transfer the associated HTML5 web gl buffer contents to the compositor.
   *
   *
   * @param {GrWebGlBufferResource} resource
   * @param {WebFD} contents HTML5 web gl image bitmap to transfer to the compositor.
   *
   * @since 1
   *
   */
  async transfer (resource, contents) {
    const imageBitmap = /** @type {ImageBitmap} */ await contents.getTransferable()
    this._webGLFrame.update(imageBitmap)
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
   *
   */
  destroy (resource) {
    this.resource.destroy()
    this.bufferResource.destroy()
    // TODO what more to do here?
  }

  /**
   * @param serial
   * @return {Promise<WebGLFrame>}
   */
  async getContents (serial) {
    return this._webGLFrame
  }

  release () {
    this.bufferResource.release()
  }
}
