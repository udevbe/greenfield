export default class BrowserBuffer {
  /**
   *
   * @param grBufferResource
   * @return {BrowserBuffer}
   */
  static create (grBufferResource) {
    const browserBuffer = new BrowserBuffer(grBufferResource)
    grBufferResource.implementation = browserBuffer
    return browserBuffer
  }

  /**
   * Instead use BrowserBuffer.create(..)
   * @private
   * @param grBufferResource
   */
  constructor (grBufferResource) {
    this.grBufferResource = grBufferResource
  }

  /**
   *
   * @param {GrBuffer} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    resource.destroy()
  }
}
