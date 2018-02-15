'use strict'

module.exports = class LocalRtcDcBuffer {
  /**
   *
   * @param {wfc.GrBuffer} grBufferProxy
   * @param {wfc.RtcDcBuffer} rtcDcBufferProxy
   * @param {LocalRtcBlobTransfer} localRtcBlobTransfer
   *
   * @return {LocalRtcDcBuffer}
   */
  static create (grBufferProxy, rtcDcBufferProxy, localRtcBlobTransfer) {
    return new LocalRtcDcBuffer(grBufferProxy, rtcDcBufferProxy, localRtcBlobTransfer)
  }

  /**
   * @private
   * @param grBufferProxy
   * @param rtcDcBufferProxy
   * @param {LocalRtcBlobTransfer} localRtcBlobTransfer
   */
  constructor (grBufferProxy, rtcDcBufferProxy, localRtcBlobTransfer) {
    this.grBufferProxy = grBufferProxy
    this.rtcDcBufferProxy = rtcDcBufferProxy
    this.localRtcBlobTransfer = localRtcBlobTransfer
  }

  destroy () {
    this.grBufferProxy.destroy()
    this.rtcDcBufferProxy.destroy()

    this.grBufferProxy = null
    this.rtcDcBufferProxy = null
  }

  /**
   *
   * @param {Number} serial Serial of the received buffer contents
   *
   * @since 1
   *
   */
  ack (serial) {
    // implemented in ShimSurface
  }

  /**
   *
   * @param {Number} serial Serial of the buffer contents that was decoded
   * @param {Number} duration Time it took to decode the buffer.
   *
   * @since 1
   *
   */
  latency (serial, duration) {
    // implemented in ShimSurface
  }
}
