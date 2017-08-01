export default class BrowserRtcDcBuffer {
  /**
   *
   * @param {wfs.GrBuffer} grBufferResource
   * @param {wfs.RtcDcBuffer} rtcDcBufferResource
   * @param {RTCDataChannel} dataChannel
   * @returns {BrowserRtcDcBuffer}
   */
  static create (grBufferResource, rtcDcBufferResource, dataChannel) {
    const browserRtcDcBuffer = new BrowserRtcDcBuffer(grBufferResource, rtcDcBufferResource, dataChannel)
    rtcDcBufferResource.implementation = browserRtcDcBuffer
    grBufferResource.implementation.browserRtcDcBuffer = browserRtcDcBuffer

    dataChannel.onopen = browserRtcDcBuffer._onOpen.bind(browserRtcDcBuffer)
    dataChannel.onmessage = browserRtcDcBuffer._onMessage.bind(browserRtcDcBuffer)
    dataChannel.onclose = browserRtcDcBuffer._onClose.bind(browserRtcDcBuffer)
    dataChannel.onerror = browserRtcDcBuffer._onError.bind(browserRtcDcBuffer)

    return browserRtcDcBuffer
  }

  /**
   * Instead use BrowserRtcDcBuffer.create(..)
   *
   * @private
   * @param {wfs.GrBuffer} grBufferResource
   * @param {wfs.RtcDcBuffer} rtcDcBufferResource
   * @param {RTCDataChannel} dataChannel
   */
  constructor (grBufferResource, rtcDcBufferResource, dataChannel) {
    this.grBufferResource = grBufferResource
    this.rtcDcBufferResource = rtcDcBufferResource
    this.dataChannel = dataChannel
  }

  /**
   *
   * @param {wfs.RtcDcBuffer} resource
   * @param {Number} serial Serial of the send buffer contents
   *
   * @since 1
   *
   */
  syn (resource, serial) {

  }

  _onOpen (event) {}

  _onMessage (event) {
    console.log(event.data)
  }

  _onClose (event) {}

  _onError (event) {}
}
