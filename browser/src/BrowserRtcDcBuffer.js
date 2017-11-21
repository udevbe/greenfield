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
    const alphaDecoder = new window.Worker('./lib/broadway/Decoder.js')
    const browserRtcDcBuffer = new BrowserRtcDcBuffer(decoder, alphaDecoder, rtcDcBufferResource, dataChannel)

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
    alphaDecoder.addEventListener('message', function (e) {
      const data = e.data
      if (data.consoleLog) {
        console.log(data.consoleLog)
        return
      }
      browserRtcDcBuffer._onAlphaPictureDecoded(new Uint8Array(data.buf, 0, data.length), data.width, data.height)
    }, false)
    alphaDecoder.postMessage({
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
   * @param {wfs.RtcDcBuffer} rtcDcBufferResource
   * @param {RTCDataChannel} dataChannel
   */
  constructor (decoder, alphaDecoder, rtcDcBufferResource, dataChannel) {
    this.decoder = decoder
    this.alphaDecoder = alphaDecoder

    this.resource = rtcDcBufferResource
    this.dataChannel = dataChannel
    this.syncSerial = 0
    this._futureFrame = null
    this._futureFrameSerial = 0
    this.state = 'pending' // or 'pending_alpha' or 'pending_opaque' or 'complete'
    this.geo = null
    this._oneShotCompletionListeners = []

    this.yuvContent = null
    this.yuvWidth = 0
    this.yuvHeight = 0

    this.alphaYuvContent = null
    this.alphaYuvWidth = 0
    this.alphaYuvHeight = 0
  }

  /**
   *
   * @private
   */
  _onComplete () {
    // resolve matching promises
    this._oneShotCompletionListeners = this._oneShotCompletionListeners.filter((listener) => { return listener(this.syncSerial) })
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
    this._checkFrame(this._futureFrameSerial, this._futureFrame)
  }

  _onOpen (event) {}

  /**
   *
   * @param {number} h264NalSerial
   * @param {ArrayBuffer} frame
   * @private
   */
  _checkFrame (h264NalSerial, frame) {
    // if serial is < than this.syncSerial than the buffer has already expired
    if (h264NalSerial < this.syncSerial) {
    } else if (h264NalSerial > this.syncSerial) {
      // else if the serial is > the nal might be used in the future
      this._futureFrame = frame
      this._futureFrameSerial = h264NalSerial
    } else if (h264NalSerial === this.syncSerial) {
      this._decode(frame)
    }
  }

  _onMessage (event) {
    // get first int as serial, and replace it with 0x00 00 00 01 (H.264/AVC video coding standard byte stream h264NalHeader)
    const h264NalHeader = new Uint32Array(event.data, 4, 1)
    const h264NalSerial = h264NalHeader[0]
    if (this.resource) {
      this.resource.ack(h264NalSerial)
    }
    this._checkFrame(h264NalSerial, event.data)
  }

  _onClose (event) {}

  _onError (event) {}

  _decode (frame) {
    const header = new DataView(frame, 0, 4)
    const hasAlpha = header.getUint8(0) !== 0
    const opaqueLength = header.getUint16(2, false)

    if (hasAlpha) {
      const alphaH264NalHeader = new DataView(frame, 4 + opaqueLength, 4)
      alphaH264NalHeader.setUint32(0, 1, false)
      // create a copy of the arraybuffer so we can zero-copy the opaque part
      const alphaH264Nal = new Uint8Array(frame.slice(4 + opaqueLength))
      this.alphaDecoder.postMessage({
        buf: alphaH264Nal.buffer,
        offset: alphaH264Nal.byteOffset,
        length: alphaH264Nal.length
      }, [alphaH264Nal.buffer])
    } else {
      this.state = 'pending_opaque'
    }

    const opaqueH264NalHeader = new DataView(frame, 4, 4)
    opaqueH264NalHeader.setUint32(0, 1, false) // all nals must begin with this code
    const opaqueH264Nal = new Uint8Array(frame, 4, opaqueLength)
    this.decoder.postMessage({
      buf: opaqueH264Nal.buffer,
      offset: opaqueH264Nal.byteOffset,
      length: opaqueH264Nal.length
    }, [opaqueH264Nal.buffer])
  }

  _onPictureDecoded (buffer, width, height) {
    if (!buffer) { return }

    this.yuvContent = buffer
    this.yuvWidth = width
    this.yuvHeight = height

    if (this.state === 'pending_opaque') {
      this.state = 'complete'
      this._onComplete()
    } else {
      this.state = 'pending_alpha'
    }
  }

  _onAlphaPictureDecoded (buffer, width, height) {
    if (!buffer) { return }

    this.alphaYuvContent = buffer
    this.alphaYuvWidth = width
    this.alphaYuvHeight = height

    if (this.state === 'pending_alpha') {
      this.state = 'complete'
      this._onComplete()
    } else {
      this.state = 'pending_opaque'
    }
  }

  destroy () {
    this.dataChannel = null
    this.resource = null
  }
}
