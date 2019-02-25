import WebShmRequests from '../protocol/WebShmRequests'
import WebShmResource from '../protocol/WebShmResource'
import WebShmPoolResource from '../protocol/WebShmPoolResource'
import WebShmPool from './WebShmPool'

const { argb8888, xrgb8888 } = WebShmResource.Format

/**
 * @implements WebShmRequests
 */
export default class WebShm extends WebShmRequests {
  /**
   * @param {!Session} session
   */
  static create (session) {
    return new WebShm(session)
  }

  /**
   * @param {!Session} session
   */
  constructor (session) {
    super()
    /**
     * @type {!Session}
     * @private
     */
    this._session = session
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
    webShmResource.format(argb8888)
    webShmResource.format(xrgb8888)
  }

  addShmFormat (format) {
    this._resources.forEach(resource => resource.format(format))
  }

  /**
   *
   *                Create a new web_shm_pool object.
   *
   *                The pool can be used to create shared memory based buffer
   *                objects. The server will mmap size bytes of the passed file
   *                descriptor, to use as backing memory for the pool.
   *
   *
   * @param {WebShmResource} resource
   * @param {number} id pool to create
   * @param {WebFD} fd file descriptor for the pool
   * @param {number} size pool size, in bytes
   *
   * @since 1
   *
   */
  async createPool (resource, id, fd, size) {
    const shm = await /** @type {SharedArrayBuffer} */ fd.getTransferable()
    const webShmPoolResource = new WebShmPoolResource(resource.client, id, resource.version)
    WebShmPool.create(webShmPoolResource, shm)
  }
}
