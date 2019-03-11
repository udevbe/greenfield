import GrWebGlRequests from '../protocol/GrWebGlRequests'
import GrWebGlResource from '../protocol/GrWebGlResource'
import GrWebGlBufferResource from '../protocol/GrWebGlBufferResource'
import WlBufferResource from '../protocol/WlBufferResource'
import WebGLBuffer from './WebGLBuffer'

/**
 * @implements GrWebGlRequests
 */
export default class WebGL extends GrWebGlRequests {
  static create () {
    return new WebGL()
  }

  constructor () {
    super()
    /**
     * @type {Global}
     * @private
     */
    this._global = null
    /**
     * @type {Array<GrWebGlResource>}
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
    this._global = registry.createGlobal(this, GrWebGlResource.protocolName, 1, (client, id, version) => {
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
    const webGlResource = new GrWebGlResource(client, id, version)
    webGlResource.implementation = this
    this._resources.push(webGlResource)
  }

  createBuffer (resource, id, grWebGlBuffer) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)

    const webGLBuffer = WebGLBuffer.create()

    grWebGlBuffer.implementation = webGLBuffer
    wlBufferResource.implementation = webGLBuffer
  }

  createWebGlBuffer (resource, id) {
    const grWebGlBufferResource = new GrWebGlBufferResource(resource.client, id, resource.version)
    // FIXME use protocol error instead of exception
    grWebGlBufferResource.implementation = { transfer: () => { throw new Error('web gl buffer not wrapped.') } }
  }
}
