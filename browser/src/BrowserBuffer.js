export default class BrowserBuffer {
  static create (grBufferResource) {
    const browserBuffer = new BrowserBuffer(grBufferResource)
    grBufferResource.implementation = browserBuffer
    return browserBuffer
  }

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
