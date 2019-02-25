import WebShmPoolRequests from '../protocol/WebShmPoolRequests'
import WlBufferResource from '../protocol/WlBufferResource'
import WebShmBuffer from './WebShmBuffer'

/**
 * @implements WebShmPoolRequests
 */
export default class WebShmPool extends WebShmPoolRequests {
  /**
   * @param {WebShmPoolResource} webShmPoolResource
   * @param {SharedArrayBuffer}shm
   */
  static create (webShmPoolResource, shm) {
    return new WebShmPool(webShmPoolResource, shm)
  }

  /**
   * @param {WebShmPoolResource}resource
   * @param {SharedArrayBuffer}shm
   */
  constructor (resource, shm) {
    super()
    /**
     * @type {WebShmPoolResource}
     */
    this.resource = resource
    /**
     * @type {SharedArrayBuffer}
     */
    this.shm = shm
  }

  /**
   *
   *                Create a wl_buffer object from the pool.
   *
   *                The buffer is created offset bytes into the pool and has
   *                width and height as specified. The stride argument specifies
   *                the number of bytes from the beginning of one row to the beginning
   *                of the next. The format is the pixel format of the buffer and
   *                must be one of those advertised through the web_shm.format event.
   *
   *                A buffer will keep a reference to the pool it was created from
   *                so it is valid to destroy the pool immediately after creating
   *                a buffer from it.
   *
   *
   * @param {WebShmPoolResource} resource
   * @param {number} id buffer to create
   * @param {number} offset buffer byte offset within the pool
   * @param {number} width buffer width, in pixels
   * @param {number} height buffer height, in pixels
   * @param {number} stride number of bytes from the beginning of one row to the beginning of the next row
   * @param {number} format buffer pixel format
   *
   * @since 1
   * @override
   *
   */
  createBuffer (resource, id, offset, width, height, stride, format) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)
    WebShmBuffer.create(wlBufferResource, new Uint8Array(this.shm, offset, stride * height), stride, format, width, height)
  }

  /**
   *
   *                Destroy the shared memory pool.
   *
   *                The mmapped memory will be released when all
   *                buffers that have been created from this pool
   *                are gone.
   *
   *
   * @param {WebShmPoolResource} resource
   *
   * @since 1
   * @override
   *
   */
  destroy (resource) {
    resource.destroy()
  }
}
