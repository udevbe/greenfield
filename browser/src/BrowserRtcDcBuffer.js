'use strict'

import Size from './Size'

export default class BrowserRtcDcBuffer {
  /**
   *
   * @param {GrBuffer} grBufferResource
   * @param {RtcDcBuffer} rtcDcBufferResource
   * @param {GrBlobTransfer} blobTransferResource
   * @returns {BrowserRtcDcBuffer}
   */
  static create (grBufferResource, rtcDcBufferResource, blobTransferResource) {
    const decoder = new window.Worker('./lib/broadway/Decoder.js')

    const alphaDecoder = new window.Worker('./lib/broadway/Decoder.js')
    const browserRtcDcBuffer = new BrowserRtcDcBuffer(decoder, alphaDecoder, rtcDcBufferResource, blobTransferResource)

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
        rgb: false,
        reuseMemory: true
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
        rgb: false,
        reuseMemory: true
      }
    })

    rtcDcBufferResource.implementation = browserRtcDcBuffer
    grBufferResource.implementation.browserRtcDcBuffer = browserRtcDcBuffer

    blobTransferResource.implementation.open().then((dataChannel) => {
      dataChannel.onmessage = browserRtcDcBuffer._onMessage.bind(browserRtcDcBuffer)
      dataChannel.onerror = browserRtcDcBuffer._onError.bind(browserRtcDcBuffer)
    })

    return browserRtcDcBuffer
  }

  /**
   * Instead use BrowserRtcDcBuffer.create(..)
   *
   * @private
   * @param decoder
   * @param alphaDecoder
   * @param {RtcDcBuffer} rtcDcBufferResource
   * @param {GrBlobTransfer} blobTransferResource
   */
  constructor (decoder, alphaDecoder, rtcDcBufferResource, blobTransferResource) {
    this.decoder = decoder
    this.alphaDecoder = alphaDecoder

    this.resource = rtcDcBufferResource
    this._blobTransferResource = blobTransferResource
    this.syncSerial = 0
    this.state = 'pending' // or 'pending_alpha' or 'pending_opaque' or 'complete'
    this._pendingGeo = Size.create(0, 0)
    this.geo = Size.create(0, 0)

    this._frameStates = {}
    this._frameChunks = {}

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
    this._frameStates[this.syncSerial].completionResolve(this.syncSerial)
  }

  isComplete (serial) {
    return this.state === 'complete' && this.syncSerial === serial
  }

  _newFrameState (syncSerial) {
    const frameState = {
      completionPromise: null,
      completionResolve: null,
      completionReject: null,
      frame: null
    }
    frameState.completionPromise = new Promise((resolve, reject) => {
      frameState.completionResolve = resolve
      frameState.completionReject = reject
    })
    this._frameStates[syncSerial] = frameState
    return frameState
  }

  /**
   * Returns a promise that will resolve as soon as the buffer is in the 'complete' state.
   * @returns {Promise}
   */
  whenComplete () {
    return this._frameStates[this.syncSerial].completionPromise
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
    this.syncSerial = serial
    this.state = 'pending'

    if (this._frameStates[serial]) {
      // state already exists, this means the contents arrived before this call, which means we can now decode it
      this._frameStateComplete(serial)
    } else {
      // state does not exist yet, create a new state and wait for contents to arrive
      this._newFrameState(serial)
    }
  }

  _frameStateComplete (serial) {
    const frame = this._frameStates[serial].frame

    // remove expired states
    for (const oldSerial in this._frameStates) {
      if (oldSerial < serial) {
        this._frameStates[oldSerial].completionReject(new Error('Buffer contents expired ' + oldSerial))
        delete this._frameStates[oldSerial]
      }
    }

    this._decode(frame)
  }

  /**
   * @param frame
   * @private
   */
  _checkFrame (frame) {
    // if serial is < than this.syncSerial than the frame has already expired
    if (frame.synSerial < this.syncSerial) {
      if (this._frameStates[frame.synSerial]) {
        this._frameStates[frame.synSerial].completionReject(new Error('Buffer contents expired ' + frame.synSerial))
        delete this._frameStates[frame.synSerial]
      } // else frame state was already deleted
      return
    }

    if (this._frameStates[frame.synSerial]) {
      // state already exists, this means the syn call arrived before this call, which means we can now decode it
      this._frameStates[frame.synSerial].frame = frame
      this._frameStateComplete(frame.synSerial)
    } else {
      // state does not exist yet, create a new state and wait for syn to arrive
      this._newFrameState(frame.synSerial).frame = frame
    }
  }

  /**
   *
   * @param {ArrayBuffer}chunk
   * @returns {ArrayBuffer}
   * @private
   */
  _checkChunk (chunk) {
    // parse chunk header
    const headerSize = 12
    const chunkHeader = new DataView(chunk, 0, headerSize)
    const synSerial = chunkHeader.getUint32(0, false)
    const nroChunks = chunkHeader.getUint32(4, false)
    const chunkIdx = chunkHeader.getUint32(8, false)

    // assign chunk to an aggregating data structure
    let frameChunk = this._frameChunks[synSerial]
    if (!frameChunk) {
      frameChunk = {
        chunks: new Array(nroChunks),
        received: 0,
        totalSize: 0
      }
      this._frameChunks[synSerial] = frameChunk
    }
    const headerlessChunk = chunk.slice(headerSize)
    frameChunk.chunks[chunkIdx] = headerlessChunk
    frameChunk.received++
    frameChunk.totalSize += headerlessChunk.byteLength

    // check if we have all required chunks & reconstruct frame buffer if so.
    const chunkSize = 16 * (1024 - 12)
    if (frameChunk.received === nroChunks) {
      const frameBuffer = new Uint8Array(frameChunk.totalSize)
      frameChunk.chunks.forEach((chunk, idx) => {
        frameBuffer.set(new Uint8Array(chunk), idx * chunkSize)
      })
      delete this._frameChunks[synSerial]
      return frameBuffer.buffer
    } else {
      return null
    }
  }

  _onMessage (event) {
    const frameBuffer = this._checkChunk(event.data)
    if (frameBuffer) {
      const frame = this._parseFrameBuffer(frameBuffer)
      if (this.resource) {
        this.resource.ack(frame.synSerial)
      }
      this._checkFrame(frame)
    }
  }

  _onError (event) {}

  _parseFrameBuffer (frameBuffer) {
    const headerSize = 12
    const header = new DataView(frameBuffer, 0, headerSize)
    const alphaOffset = header.getUint32(0, false)
    const bufferWidth = header.getUint16(4, false)
    const bufferHeight = header.getUint16(6, false)
    const synSerial = header.getUint32(8, false)

    const opaque = new Uint8Array(frameBuffer, headerSize, alphaOffset)
    const alpha = frameBuffer.byteLength === alphaOffset ? null : new Uint8Array(frameBuffer, alphaOffset)

    return {
      length: frameBuffer.byteLength,
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
    this._blobTransferResource.release()
    this.this.resource = null
  }
}
