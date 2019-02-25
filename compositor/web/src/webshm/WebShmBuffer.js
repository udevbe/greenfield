import WlBufferRequests from '../protocol/WlBufferRequests'

/**
 * @implements WlBufferRequests
 */
export default class WebShmBuffer extends WlBufferRequests {
  /**
   * @param {WlBufferResource}bufferResource
   * @param {Uint8Array}data
   * @param {number}stride
   * @param {number}format
   * @param {number}width
   * @param {number}height
   */
  static create (bufferResource, data, stride, format, width, height) {
    return new WebShmBuffer(bufferResource, data, stride, format, width, height)
  }

  /**
   * @param {WlBufferResource}resource
   * @param {Uint8Array}data
   * @param {number}stride
   * @param {number}format
   * @param {number}width
   * @param {number}height
   */
  constructor (resource, data, stride, format, width, height) {
    super()
    /**
     * @type {WlBufferResource}
     */
    this.resource = resource
    /**
     * @type {Uint8Array}
     * @const
     * @private
     */
    this._data = data
    /**
     * @type {number}
     * @const
     * @private
     */
    this._stride = stride
    /**
     * @type {number}
     * @const
     * @private
     */
    this._format = format
    /**
     * @type {number}
     * @const
     * @private
     */
    this._width = width
    /**
     * @type {number}
     * @const
     * @private
     */
    this._height = height
  }

  /**
   * @return {Uint8Array}
   */
  get data () {
    return this._data
  }

  /**
   * @return {number}
   */
  get stride () {
    return this._stride
  }

  /**
   * @return {number}
   */
  get format () {
    return this._format
  }

  /**
   * @return {number}
   */
  get width () {
    return this._width
  }

  /**
   * @return {number}
   */
  get height () {
    return this._height
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
}
