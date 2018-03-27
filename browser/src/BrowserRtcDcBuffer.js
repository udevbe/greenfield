'use strict'

import Size from './Size'
import BrowserH264Decoder from './BrowserH264Decoder'

export default class BrowserRtcDcBuffer {
  /**
   *
   * @param {GrBuffer} grBufferResource
   * @param {RtcDcBuffer} rtcDcBufferResource
   * @param {GrBlobTransfer} blobTransferResource
   * @returns {BrowserRtcDcBuffer}
   */
  static create (grBufferResource, rtcDcBufferResource, blobTransferResource) {
    const browserRtcDcBuffer = new BrowserRtcDcBuffer(rtcDcBufferResource, blobTransferResource)

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
   * @param {RtcDcBuffer} rtcDcBufferResource
   * @param {GrBlobTransfer} blobTransferResource
   */
  constructor (rtcDcBufferResource, blobTransferResource) {
    /**
     * @type {BrowserH264Decoder}
     * @private
     */
    this._decoder = null
    /**
     * @type {Promise<BrowserH264Decoder>}
     * @private
     */
    this._decoderFactory = null
    /**
     * @type {number[]}
     * @private
     */
    this._decodingSerialsQueue = []
    /**
     * @type {BrowserH264Decoder}
     * @private
     */
    this._alphaDecoder = null
    /**
     * @type {Promise<BrowserH264Decoder>}
     * @private
     */
    this._alphaDecoderFactory = null
    /**
     * @type {number[]}
     * @private
     */
    this._decodingAlphaSerialsQueue = []
    /**
     * @type {RtcDcBuffer}
     */
    this.resource = rtcDcBufferResource
    this._blobTransferResource = blobTransferResource
    /**
     * @type {number}
     * @private
     */
    this._syncSerial = 0
    /**
     * @type {number}
     * @private
     */
    this._lastCompleteSerial = 0
    /**
     * @type {Size}
     * @private
     */
    this._geo = Size.create(0, 0)

    this._frameStates = {} // map like object, keys are numbers
    this._frameChunks = {} // map like object, keys are numbers
    /**
     * 'h264' or 'png'
     * @type {string}
     * @private
     */
    this._type = null

    /**
     * @type {Uint8Array}
     * @private
     */
    this._yuvContent = null
    /**
     * @type {number}
     * @private
     */
    this._yuvWidth = 0
    /**
     * @type {number}
     * @private
     */
    this._yuvHeight = 0

    /**
     * @type {Uint8Array}
     * @private
     */
    this._alphaYuvContent = null
    /**
     * @type {number}
     * @private
     */
    this._alphaYuvWidth = 0
    /**
     * @type {number}
     * @private
     */
    this._alphaYuvHeight = 0

    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._pngImage = null
  }

  /**
   * @param {boolean}hasAlpha
   * @private
   */
  async _ensureH264Decoders (hasAlpha) {
    if (this._decoderFactory) {
      await this._decoderFactory
    } else {
      this._decoderFactory = BrowserH264Decoder.create()
      const decoder = await this._decoderFactory
      decoder.onPicture = (buffer, width, height) => {
        this._onPictureDecoded(buffer, width, height)
      }
      this._decoder = decoder
    }

    if (hasAlpha) {
      if (this._alphaDecoderFactory) {
        await this._alphaDecoderFactory
      } else {
        this._alphaDecoderFactory = BrowserH264Decoder.create()
        const alphaDecoder = await this._alphaDecoderFactory
        alphaDecoder.onPicture = (buffer, width, height) => {
          this._onAlphaPictureDecoded(buffer, width, height)
        }
        this._alphaDecoder = alphaDecoder
      }
    }

    if (!hasAlpha && this._alphaDecoder) {
      this._alphaDecoder.terminate()
      this._alphaDecoder = null
    }
  }

  /**
   * @return {{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}}
   * @private
   */
  get _bufferContents () {
    return {
      type: this._type,
      syncSerial: this._syncSerial,
      geo: this._geo,
      yuvContent: this._yuvContent,
      yuvWidth: this._yuvWidth,
      yuvHeight: this._yuvHeight,
      alphaYuvContent: this._alphaYuvContent,
      alphaYuvWidth: this._alphaYuvWidth,
      alphaYuvHeight: this._alphaYuvHeight,
      pngImage: this._pngImage
    }
  }

  /**
   * @param {number}serial
   * @private
   */
  _onComplete (serial) {
    this._frameStates[serial].state = 'complete'
    this._geo = this._frameStates[serial]._geo
    this._lastCompleteSerial = serial

    // remove old states
    for (const oldSerial in this._frameStates) {
      if (oldSerial < serial) {
        if (this._frameStates[serial].state !== 'complete') {
          this._frameStates[oldSerial].completionReject(new Error('Buffer contents expired ' + oldSerial))
        }
        delete this._frameStates[oldSerial]
      }
    }

    this._frameStates[serial].completionResolve(this._bufferContents)
  }

  _newFrameState (syncSerial) {
    const frameState = {
      completionPromise: null,
      completionResolve: null,
      completionReject: null,
      state: 'pending', // or 'pending_alpha' or 'pending_opaque' or 'complete'
      _geo: Size.create(0, 0),
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
   * @returns {Promise<{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}>}
   */
  whenComplete () {
    const frameState = this._frameStates[this._syncSerial]
    return frameState.completionPromise
  }

  /**
   *
   * @param {wfs.RtcDcBuffer} resource
   * @param {Number} serial Serial of the send buffer contents
   * @since 1
   *
   */
  syn (resource, serial) {
    if (serial < this._syncSerial) {
      // TODO return an error to the client
      throw new Error('Buffer sync serial was not sequential.')
    }
    this._syncSerial = serial

    if (this._frameStates[serial] && this._frameStates[serial].frame) {
      // state already exists, this means the contents arrived before this call, which means we can now decode it
      this._frameStateComplete(this._frameStates[serial].frame, serial)
    } else {
      // state does not exist yet, create a new state and wait for contents to arrive
      this._newFrameState(serial)
    }
  }

  _frameStateComplete (frame, serial) {
    this._frameStates[serial]._geo = Size.create(frame.bufferWidth, frame.bufferHeight)

    if (frame.type === 'h264') {
      this._decodeH264(frame, serial)
    } else {
      this._decodePNG(frame, serial)
    }
  }

  /**
   * @param frame
   * @private
   */
  _checkFrame (frame) {
    if (this._frameStates[frame.synSerial]) {
      // state already exists, this means the syn call arrived before this call, which means we can now decode it
      this._frameStates[frame.synSerial].frame = frame
      this._frameStateComplete(frame, frame.synSerial)
    } else if (frame.synSerial >= this._lastCompleteSerial) {
      // state does not exist yet, create a new state and wait for contents to arrive
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

  /**
   * @param {ArrayBuffer}frameBuffer
   * @return {{length: number, alphaOffset: number, bufferWidth: number, bufferHeight: number, synSerial: number, opaque: Uint8Array, alpha: *, type: string}}
   * @private
   */
  _parseFrameBuffer (frameBuffer) {
    const headerSize = 13
    const header = new DataView(frameBuffer, 0, headerSize)
    const alphaOffset = header.getUint32(0, false)
    const bufferWidth = header.getUint16(4, false)
    const bufferHeight = header.getUint16(6, false)
    const synSerial = header.getUint32(8, false)
    const type = header.getUint8(12)

    let opaque = null
    if (frameBuffer.byteLength === alphaOffset) {
      opaque = new Uint8Array(frameBuffer, headerSize)
    } else {
      opaque = new Uint8Array(frameBuffer, headerSize, alphaOffset)
    }
    const alpha = frameBuffer.byteLength === alphaOffset ? null : new Uint8Array(frameBuffer, alphaOffset)

    return {
      length: frameBuffer.byteLength,
      alphaOffset: alphaOffset,
      bufferWidth: bufferWidth,
      bufferHeight: bufferHeight,
      synSerial: synSerial,
      opaque: opaque,
      alpha: alpha,
      type: type === 0 ? 'h264' : 'png'
    }
  }

  _decodePNG (frame, serial) {
    // decode might not be the best name, as we're not doing any decoding.
    if (this._decoder) {
      // FIXME a h264 decode might still be in progress, how to properly handle this?
      this._destroyH264()
    }

    const pngImg = new window.Image()
    const pngArray = frame.opaque
    const pngBlob = new window.Blob([pngArray], {'type': 'image/png'})
    pngImg.src = window.URL.createObjectURL(pngBlob)
    this._pngImage = pngImg
    this._type = 'png'

    if (pngImg.complete && pngImg.naturalHeight !== 0) {
      this._onComplete(serial)
    } else {
      pngImg.onload = () => {
        this._onComplete(serial)
      }
    }
  }

  async _decodeH264 (frame, serial) {
    this._type = 'h264'

    const hasAlpha = frame.alpha !== null
    await this._ensureH264Decoders(hasAlpha)

    if (hasAlpha) {
      this._decodingAlphaSerialsQueue.push(serial)
      // create a copy of the arraybuffer so we can zero-copy the opaque part (after zero-copying, we can no longer use the underlying array in any way)
      const alphaH264Nal = new Uint8Array(frame.alpha.slice())
      this._alphaDecoder.decode(alphaH264Nal)
    } else {
      this._frameStates[serial].state = 'pending_opaque'
    }

    this._decodingSerialsQueue.push(serial)
    const opaqueH264Nal = new Uint8Array(frame.opaque)
    this._decoder.decode(opaqueH264Nal)
  }

  _onPictureDecoded (buffer, width, height) {
    this._yuvContent = buffer
    this._yuvWidth = width
    this._yuvHeight = height

    const frameSerial = this._decodingSerialsQueue.shift()
    if (!frameSerial || frameSerial < this._lastCompleteSerial) {
      return
    }

    if (this._frameStates[frameSerial].state === 'pending_opaque') {
      this._onComplete(frameSerial)
    } else {
      this._frameStates[frameSerial].state = 'pending_alpha'
    }
  }

  _onAlphaPictureDecoded (buffer, width, height) {
    this._alphaYuvContent = buffer
    this._alphaYuvWidth = width
    this._alphaYuvHeight = height

    const frameSerial = this._decodingAlphaSerialsQueue.shift()
    if (!frameSerial || frameSerial < this._lastCompleteSerial) {
      return
    }

    if (this._frameStates[frameSerial].state === 'pending_alpha') {
      this._onComplete(frameSerial)
    } else {
      this._frameStates[frameSerial].state = 'pending_opaque'
    }
  }

  destroy () {
    this._blobTransferResource.release()
    this.resource = null
    this._destroyH264()
  }

  _destroyH264 () {
    if (this._decoder) {
      this._decoder.terminate()
      this._decoder = null
    }
    if (this._alphaDecoder) {
      this._alphaDecoder.terminate()
      this._alphaDecoder = null
    }
    this._decodingSerialsQueue = []
    this._decodingAlphaSerialsQueue = []
  }
}
