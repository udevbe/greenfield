module.exports = class LocalRtcDcBuffer {
  /**
   *
   * @param {wfc.GrBuffer} grBufferProxy
   * @param {wfc.RtcDcBuffer} rtcDcBufferProxy
   * @param {RTCDataChannel} dataChannel
   *
   * @return {LocalRtcDcBuffer}
   */
  static create (grBufferProxy, rtcDcBufferProxy, dataChannel) {
    const localRtcDcBuffer = new LocalRtcDcBuffer(grBufferProxy, rtcDcBufferProxy, dataChannel)

    dataChannel.onopen = localRtcDcBuffer._onOpen.bind(localRtcDcBuffer)
    dataChannel.onclose = localRtcDcBuffer._onClose.bind(localRtcDcBuffer)
    dataChannel.onerror = localRtcDcBuffer._onError.bind(localRtcDcBuffer)

    return localRtcDcBuffer
  }

  constructor (grBufferProxy, rtcDcBufferProxy, dataChannel) {
    this.grBufferProxy = grBufferProxy
    this.rtcDcBufferProxy = rtcDcBufferProxy
    this.dataChannel = dataChannel
  }

  /**
   *
   * @param {Number} serial Serial of the received buffer contents
   *
   * @since 1
   *
   */
  ack (serial) {
  }

  _onOpen (event) {}

  _onClose (event) {}

  _onError (event) {}
}
