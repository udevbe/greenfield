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
    this._syncSerial = 0
    this.h264Nal = null
    this._futureH264Nal = null
    this._futureH264NalSerial = 0
    this.state = 'pending' // or 'complete'
  }

  /**
   *
   * @param {string} state 'pending' or 'complete'
   */
  onStateChanged (state) {}

  /**
   *
   * @param {wfs.RtcDcBuffer} resource
   * @param {Number} serial Serial of the send buffer contents
   *
   * @since 1
   *
   */
  syn (resource, serial) {
    this._syncSerial = serial
    this.state = 'pending'
    this.onStateChanged(this.state)
    this._checkNal(this._futureH264NalSerial, this._futureH264Nal)
  }

  _onOpen (event) {}

  /**
   *
   * @param {number} h264NalSerial
   * @param {Uint8Array} h264Nal
   * @private
   */
  _checkNal (h264NalSerial, h264Nal) {
    // if serial is < than this._syncSerial than the buffer has already expired
    if (h264NalSerial < this._syncSerial) {
      return
    } else if (h264NalSerial > this._syncSerial) {
      // else if the serial is > the nal might be used in the future
      this._futureH264Nal = h264Nal
      this._futureH264NalSerial = h264NalSerial
    } else if (h264NalSerial === this._syncSerial) {
      // else it matches what is expected and thus makes this buffer complete
      this.h264Nal = h264Nal
      this.state = 'complete'
      this.onStateChanged(this.state)
      this.rtcDcBufferResource.ack(h264NalSerial)
    }
  }

  _onMessage (event) {
    // get first int as serial, and replace it with 0x00 00 00 01 (H.264/AVC video coding standard byte stream header)
    const h264Nal = new Uint8Array(event.data)
    const header = new Uint32Array(event.data, 0, 1)
    const h264NalSerial = header[0]
    header[0] = 0x00000001

    this._checkNal(h264NalSerial, h264Nal)
  }

  _onClose (event) {}

  _onError (event) {}

}
