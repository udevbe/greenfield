'use strict'

import Size from './Size'

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
    this.syncSerial = 0
    this.h264Nal = null
    this._futureH264Nal = null
    this._futureH264NalSerial = 0
    this.state = 'pending' // or 'complete'
    this.geo = null
    this._oneShotCompletionListeners = []
  }

  /**
   *
   * @private
   */
  _onStateChanged () {
    if (this.state === 'complete') {
      // resolve all pending promises
      this._oneShotCompletionListeners.forEach((listener) => {
        listener(this.syncSerial)
      })
      this._oneShotCompletionListeners = []
    }
  }

  // TODO add timeout argument(?)
  /**
   * Returns a promise that will resolve as soon as the buffer is in the 'complete' state with the given serial.
   * @param {number} serial
   * @returns {Promise}
   */
  whenComplete (serial) {
    return new Promise((resolve, reject) => {
      if (serial < this.syncSerial) {
        reject(new Error('Buffer contents expired.'))
      } else if (this.state === 'complete' && this.syncSerial === serial) {
        resolve()
      } else {
        this._oneShotCompletionListeners.push(() => {
          if (serial === this.syncSerial) {
            resolve()
            // don't keep the listener after it has been fired (=false)
          } else if (serial < this.syncSerial) {
            reject(new Error('Buffer contents expired.'))
          }
        })
      }
    })
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
    if (serial < this.syncSerial) {
      // TODO return an error to the client
      throw new Error('Buffer sync serial was not sequential.')
    }

    this.syncSerial = serial
    this.state = 'pending'
    this._onStateChanged(this.state)
    this._checkNal(this._futureH264NalSerial, this._futureH264Nal)
  }

  size (resource, width, height) {
    this.geo = new Size(width, height)
  }

  _onOpen (event) {}

  /**
   *
   * @param {number} h264NalSerial
   * @param {Uint8Array} h264Nal
   * @private
   */
  _checkNal (h264NalSerial, h264Nal) {
    // if serial is < than this.syncSerial than the buffer has already expired
    if (h264NalSerial < this.syncSerial) {

    } else if (h264NalSerial > this.syncSerial) {
      // else if the serial is > the nal might be used in the future
      this._futureH264Nal = h264Nal
      this._futureH264NalSerial = h264NalSerial
    } else if (h264NalSerial === this.syncSerial) {
      // else it matches what is expected and thus makes this buffer complete
      this.h264Nal = h264Nal
      if (this.size) {
        this.state = 'complete'
        this._onStateChanged(this.state)
        this.rtcDcBufferResource.ack(h264NalSerial)
      }
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
