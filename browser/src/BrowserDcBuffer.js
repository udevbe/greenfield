export default class BrowserDcBuffer {

  /**
   *
   * @param {wfs.GrBuffer} grBuffer
   * @param {wfs.DcBuffer} dcBuffer
   * @param {
   * @returns {BrowserDcBuffer}
   */
  static create (grBuffer, dcBuffer, dataChannel) {
    const browserDcBuffer = new BrowserDcBuffer(grBuffer, dcBuffer, dataChannel)
    dcBuffer.implementation = browserDcBuffer
    grBuffer.implementation.dcBuffer = browserDcBuffer

    dataChannel.onopen = browserDcBuffer._onOpen.bind(browserDcBuffer)
    dataChannel.onmessage = browserDcBuffer._onMessage.bind(browserDcBuffer)
    dataChannel.onclose = browserDcBuffer._onClose.bind(browserDcBuffer)
    dataChannel.onerror = browserDcBuffer._onError.bind(browserDcBuffer)

    return browserDcBuffer
  }

  constructor (grBuffer, dcBuffer, dataChannel) {
    this.grBuffer = grBuffer
    this.dcBuffer = dcBuffer
    this.dataChannel = dataChannel
  }

  /**
   *
   * @param {DcBuffer} resource
   * @param {Number} serial Serial of the send buffer contents
   *
   * @since 1
   *
   */
  syn (resource, serial) {}

  _onOpen (event) {}

  _onMessage (event) {}

  _onClose (event) {}

  _onError (event) {}
}
