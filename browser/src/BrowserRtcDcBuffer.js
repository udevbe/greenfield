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
    const decoder = new window.Worker('./lib/broadway/Decoder.js')
    const browserRtcDcBuffer = new BrowserRtcDcBuffer(decoder, grBufferResource, rtcDcBufferResource, dataChannel)

    decoder.addEventListener('message', function (e) {
      const data = e.data
      if (data.consoleLog) {
        console.log(data.consoleLog)
        return
      }
      browserRtcDcBuffer._onPictureDecoded(new Uint8Array(data.buf, 0, data.length), data.width, data.height)
    }, false)
    decoder.postMessage({
      type: 'Broadway.js - Worker init',
      options: {
        rgb: false
      }
    })

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
   * @param decoder
   * @param {wfs.GrBuffer} grBufferResource
   * @param {wfs.RtcDcBuffer} rtcDcBufferResource
   * @param {RTCDataChannel} dataChannel
   */
  constructor (decoder, grBufferResource, rtcDcBufferResource, dataChannel) {
    this.decoder = decoder

    this.grBufferResource = grBufferResource
    this.resource = rtcDcBufferResource
    this.dataChannel = dataChannel
    this.syncSerial = 0
    this._futureH264Nal = null
    this._futureH264NalSerial = 0
    this.state = 'pending' // or 'complete'
    this.geo = null
    this._oneShotCompletionListeners = []

    this.yuvContent = null
    this.yuvWidth = 0
    this.yuvHeight = 0
  }

  /**
   *
   * @private
   */
  _onStateChanged () {
    if (this.state === 'complete') {
      // resolve matching promises
      this._oneShotCompletionListeners = this._oneShotCompletionListeners.filter((listener) => { return listener(this.syncSerial) })
    }
  }

  isComplete (serial) {
    return this.state === 'complete' && this.syncSerial === serial
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
      } else if (this.isComplete(serial)) {
        resolve()
      } else {
        this._oneShotCompletionListeners.push((completionSerial) => {
          if (serial === completionSerial) {
            resolve()
            // don't keep the listener after it has been fired (=true)
            return false
          } else if (serial < completionSerial) {
            reject(new Error('Buffer contents expired.'))
            // don't keep the listener after it has been fired (=true)
            return false
          } else {
            return true
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
   * @param width
   * @param height
   * @since 1
   *
   */
  syn (resource, serial, width, height) {
    if (serial < this.syncSerial) {
      // TODO return an error to the client
      throw new Error('Buffer sync serial was not sequential.')
    }

    this.syncSerial = serial
    this.geo = new Size(width, height)
    this.state = 'pending'
    this._onStateChanged(this.state)
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
    // if serial is < than this.syncSerial than the buffer has already expired
    if (h264NalSerial < this.syncSerial) {
    } else if (h264NalSerial > this.syncSerial) {
      // else if the serial is > the nal might be used in the future
      this._futureH264Nal = h264Nal
      this._futureH264NalSerial = h264NalSerial
    } else if (h264NalSerial === this.syncSerial) {
      this._decode(h264Nal)
    }
  }

  _onMessage (event) {
    // get first int as serial, and replace it with 0x00 00 00 01 (H.264/AVC video coding standard byte stream header)
    const h264Nal = new Uint8Array(event.data)
    const header = new Uint32Array(event.data, 0, 1)
    const h264NalSerial = header[0]
    header[0] = 0x01000000 // little endian
    this.resource.ack(h264NalSerial)
    this._checkNal(h264NalSerial, h264Nal)
  }

  _onClose (event) {}

  _onError (event) {}

  _decode (h264Nal) {
    this.decoder.postMessage({
      buf: h264Nal.buffer,
      offset: h264Nal.byteOffset,
      length: h264Nal.length
    }, [h264Nal.buffer])
  }

  _onPictureDecoded (buffer, width, height) {
    if (!buffer) { return }

    this.yuvContent = buffer
    this.yuvWidth = width
    this.yuvHeight = height

    this.state = 'complete'
    this._onStateChanged(this.state)
  }
}
