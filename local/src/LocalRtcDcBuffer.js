'use strict'

module.exports = class LocalRtcDcBuffer {
  /**
   *
   * @param {wfc.GrBuffer} grBufferProxy
   * @param {wfc.RtcDcBuffer} rtcDcBufferProxy
   *
   * @return {LocalRtcDcBuffer}
   */
  static create (grBufferProxy, rtcDcBufferProxy) {
    return new LocalRtcDcBuffer(grBufferProxy, rtcDcBufferProxy)
  }

  constructor (grBufferProxy, rtcDcBufferProxy) {
    this.grBufferProxy = grBufferProxy
    this.rtcDcBufferProxy = rtcDcBufferProxy
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
  }
}
