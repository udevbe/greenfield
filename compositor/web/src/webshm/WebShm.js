import WebShmRequests from '../protocol/WebShmRequests'
import WebShmResource from '../protocol/WebShmResource'
import WebArrayBufferResource from '../protocol/WebArrayBufferResource'
import WebArrayBuffer from './WebArrayBuffer'
import WlBufferResource from '../protocol/WlBufferResource'

/**
 * @implements WebShmRequests
 */
export default class WebShm extends WebShmRequests {
  static create () {
    return new WebShm()
  }

  constructor () {
    super()
    /**
     * @type {Global}
     * @private
     */
    this._global = null
    /**
     * @type {Array<WebShmResource>}
     * @private
     */
    this._resources = []
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WebShmResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  /**
   *
   * Invoked when a client binds to this global.
   *
   * @param {!Client} client
   * @param {!number} id
   * @param {!number} version
   */
  bindClient (client, id, version) {
    const webShmResource = new WebShmResource(client, id, version)
    webShmResource.implementation = this
    this._resources.push(webShmResource)
  }

  /**
   *
   *                Create a wl_buffer object from a web_array_buffer so it can be used with a surface.
   *
   *
   * @param {WebShmResource} resource
   * @param {number} id buffer to create
   * @param {WebArrayBufferResource} webArrayBuffer web_array_buffer to wrap
   *
   * @since 1
   *
   */
  createBuffer (resource, id, webArrayBuffer) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)
    wlBufferResource.implementation = webArrayBuffer.implementation
  }

  /**
   *
   *                Create a web_array_buffer object.
   *
   *                The buffer is created using an HTML5 array buffer as the fd argument
   *                and width and height as specified. The stride argument specifies
   *                the number of bytes from the beginning of one row to the beginning
   *                of the next. The format is the pixel format of the buffer and
   *                must be one of those advertised through the web_shm.format event.
   *
   *                Creating a buffer with an HTML5 array buffer as the fd argument
   *                will attach the array buffer to the compositor and as such it can not be used
   *                by the client until the compositor detaches it. As such clients should
   *                wait for the compositor to emit the web_array_buffer detach event
   *                before using the array buffer again.
   *
   *                A compositor will emit the detach event in conjunction with a wl_buffer release event.
   *                Clients should therefore only create a web_array_buffer after all data is written to
   *                the HTML5 array buffer, after which it should be immediately attach+commit to a surface.
   *
   *
   * @param {WebShmResource} resource
   * @param {number} id array buffer to create
   * @param {WebFD} webFD file descriptor for shared memory of the buffer
   * @param {number} width buffer width, in pixels
   * @param {number} height buffer height, in pixels
   *
   * @since 1
   *
   */
  async createWebArrayBuffer (resource, id, webFD, width, height) {
    const arrayBuffer = /** @type {ArrayBuffer} */await webFD.getTransferable()
    const webArrayBufferResource = new WebArrayBufferResource(resource.client, id, resource.version)
    WebArrayBuffer.create(webArrayBufferResource, arrayBuffer, width, height)
  }
}
