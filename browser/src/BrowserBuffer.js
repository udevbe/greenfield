export default class BrowserBuffer {
  static create (grBuffer) {
    const browserBuffer = new BrowserBuffer(grBuffer)
    grBuffer.implementation = browserBuffer
    return browserBuffer
  }

  constructor (grBuffer) {
    this.grBuffer = grBuffer
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
