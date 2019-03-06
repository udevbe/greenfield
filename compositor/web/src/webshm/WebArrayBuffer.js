import WebArrayBufferRequests from '../protocol/WebArrayBufferRequests'

/**
 * @implements WlBufferRequests
 * @implements WebArrayBufferRequests
 */
export default class WebArrayBuffer extends WebArrayBufferRequests {
  /**
   * @param {WebArrayBufferResource}resource
   * @param {ArrayBuffer}data
   * @param {number}stride
   * @param {number}format
   * @param {number}width
   * @param {number}height
   */
  static create (resource, data, stride, format, width, height) {
    return new WebArrayBuffer(resource, data, stride, format, width, height)
  }

  /**
   * @param {WebArrayBufferResource}resource
   * @param {ArrayBuffer}data
   * @param {number}stride
   * @param {number}format
   * @param {number}width
   * @param {number}height
   */
  constructor (resource, data, stride, format, width, height) {
    super()
    /**
     * @type {WebArrayBufferResource}
     */
    this.resource = resource
    /**
     * @type {ArrayBuffer}
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
   * @return {ArrayBuffer}
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
  async attach (resource, arrayBuffer) {
    this._data = /** @type {ArrayBuffer} */ await arrayBuffer.getTransferable()
  }
}
