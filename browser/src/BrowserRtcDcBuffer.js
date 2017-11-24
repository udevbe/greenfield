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
    this.state = 'pending' // or 'pending_alpha' or 'pending_opaque' or 'complete'
    this._pendingGeo = Size.create(0, 0) // becomes geo after decode
    this.geo = Size.create(0, 0)

    this._completionPromise = null
    this._completionResolve = null
    this._completionReject = null
    this._completionPromise = new Promise((resolve, reject) => {
      this._completionResolve = resolve
      this._completionReject = reject
    })

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
    this.state = 'complete'
    this.geo = this._pendingGeo
    this._completionResolve(this.syncSerial)
  }

  isComplete (serial) {
    return this.state === 'complete' && this.syncSerial === serial
  }

  /**
   * Returns a promise that will resolve as soon as the buffer is in the 'complete' state.
   * @returns {Promise}
   */
  whenComplete () {
    return this._completionPromise
  }

  /**
   *
   * @param {wfs.RtcDcBuffer} resource
   * @param {Number} serial Serial of the send buffer contents
   * @since 1
   *
   */
  syn (resource, serial) {
    if (serial < this.syncSerial) {
      // TODO return an error to the client
      throw new Error('Buffer sync serial was not sequential.')
    }

    // console.log('received syn ' + serial)

    if (this.syncSerial !== 0) {
      if (this.state !== 'complete') {
        // previous state never completed, reject old promise
        // FIXME this can lead to a buffer that will never be complete if the buffer content arrival is more than one syn call behind.
        this._completionReject(new Error('Buffer contents expired ' + this.syncSerial))
      }

      this._completionPromise = new Promise((resolve, reject) => {
        this._completionResolve = resolve
        this._completionReject = reject
      })
    }

    this.syncSerial = serial
    this.state = 'pending'
    if (this._futureFrame) {
      this._checkFrame(this._futureFrame)
    }
  }

  _onOpen (event) {}

  /**
   * @param frame
   * @private
   */
  _checkFrame (frame) {
    // if serial is < than this.syncSerial than the buffer has already expired
    if (frame.synSerial < this.syncSerial) {
      // console.log('received expired buffer contents frame: ', frame.synSerial, ' syn: ', this.syncSerial)
    } else if (frame.synSerial > this.syncSerial) {
      // else if the serial is > the nal might be used in the future
      if (this._futureFrame && this._futureFrame.synSerial > frame.synSerial) {
        return
      }
      // console.log('received future frame ', frame.synSerial)
      this._futureFrame = frame
    } else if (frame.synSerial === this.syncSerial) {
      // console.log('received matching frame ', frame.synSerial)
      // We can decode the frame
      if (this._futureFrame === frame) {
        this._futureFrame = null
      }
      this._decode(frame)
    }
  }

  _onMessage (event) {
    const frame = this._parseFrameBuffer(event.data)
    if (this.resource) {
      // console.log('received frame ' + frame.synSerial)
      this.resource.ack(frame.synSerial)
    }
    this._checkFrame(frame)
  }

  _onClose (event) {}

  _onError (event) {}

  _parseFrameBuffer (frameBuffer) {
    const headerSize = 12
    const header = new DataView(frameBuffer, 0, headerSize)
    const length = header.getUint16(0, false)
    const alphaOffset = header.getUint16(2, false)
    const bufferWidth = header.getUint16(4, false)
    const bufferHeight = header.getUint16(6, false)
    const synSerial = header.getUint32(8, false)

    const opaque = new Uint8Array(frameBuffer, headerSize, alphaOffset)
    const alpha = length === alphaOffset ? null : new Uint8Array(frameBuffer, alphaOffset)

    return {
      length: length,
      alphaOffset: alphaOffset,
      bufferWidth: bufferWidth,
      bufferHeight: bufferHeight,
      synSerial: synSerial,
      opaque: opaque,
      alpha: alpha
    }
  }

  _decode (frame) {
    this._pendingGeo = Size.create(frame.bufferWidth, frame.bufferHeight)

    if (frame.alpha) {
      // create a copy of the arraybuffer so we can zero-copy the opaque part (after zero-copying, we can no longer use the underlying array in any way)
      const alphaH264Nal = new Uint8Array(frame.alpha.slice())
      this.alphaDecoder.postMessage({
        buf: alphaH264Nal.buffer,
        offset: alphaH264Nal.byteOffset,
        length: alphaH264Nal.length
      }, [alphaH264Nal.buffer])
    } else {
      this.state = 'pending_opaque'
    }

    const opaqueH264Nal = new Uint8Array(frame.opaque)
    this.decoder.postMessage({
      buf: opaqueH264Nal.buffer,
      offset: opaqueH264Nal.byteOffset,
      length: opaqueH264Nal.length
    }, [opaqueH264Nal.buffer])
  }

  _onPictureDecoded (buffer, width, height) {
    // console.log('opaque decoded: ', width, ' ', height)

    if (!buffer) { return }

    this.yuvContent = buffer
    this.yuvWidth = width
    this.yuvHeight = height

    if (this.state === 'pending_opaque') {
      this._onComplete()
    } else {
      this.state = 'pending_alpha'
    }
  }

  _onAlphaPictureDecoded (buffer, width, height) {
    // console.log('alpha decoded: ', width, ' ', height)
    if (!buffer) { return }

    this.alphaYuvContent = buffer
    this.alphaYuvWidth = width
    this.alphaYuvHeight = height

    if (this.state === 'pending_alpha') {
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
