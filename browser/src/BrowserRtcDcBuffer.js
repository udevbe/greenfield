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
     * @type {RtcDcBuffer}
     */
    this.resource = rtcDcBufferResource
    /**
     * @type {GrBlobTransfer}
     * @private
     */
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
     * 'jpeg' or 'png'
     * @type {string|null}
     * @private
     */
    this._type = null
    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._pngImage = null
    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._content = null
    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._alphaContent = null
  }

  /**
   * @return {{type: string, syncSerial: number, geo: Size, pngImage: HTMLImageElement, content: HTMLImageElement, alphaContent: HTMLImageElement}}
   * @private
   */
  get _bufferContents () {
    return {
      type: this._type,
      syncSerial: this._syncSerial,
      geo: this._geo,
      content: this._content,
      alphaContent: this._alphaContent,
      pngImage: this._pngImage
    }
  }

  /**
   * @param {number}serial
   * @private
   */
  _onComplete (serial) {
    if (serial < this._lastCompleteSerial) {
      return
    }
    const frameState = this._frameStates[serial]
    frameState.state = 'complete'
    this._geo = frameState._geo
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

    frameState.completionResolve(this._bufferContents)
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

    if (frame.type === 'jpeg') {
      this._decodeJpeg(frame, serial)
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

    if (frameChunk.chunks[chunkIdx]) {
      // chunk already received, we're probably dealing with a resend
      return null
    }
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
      type: type === 1 ? 'png' : 'jpeg'
    }
  }

  _decodePNG (frame, serial) {
    // decode might not be the best name, as we're not doing any decoding.

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

  _decodeJpeg (frame, serial) {
    this._type = 'jpeg'

    const hasAlpha = frame.alpha !== null

    const jpegImg = new window.Image()
    const jpegArray = frame.opaque
    const jpegBlob = new window.Blob([jpegArray], {'type': 'image/jpeg'})
    jpegImg.src = window.URL.createObjectURL(jpegBlob)
    this._content = jpegImg

    if (hasAlpha) {
      const jpegAlphaImg = new window.Image()
      const jpegAlphaArray = frame.alpha
      const jpegAlphaBlob = new window.Blob([jpegAlphaArray], {'type': 'image/jpeg'})
      jpegAlphaImg.src = window.URL.createObjectURL(jpegAlphaBlob)
      this._alphaContent = jpegAlphaImg

      let opaqueComplete = false
      let alphaComplete = false

      if (jpegImg.complete && jpegImg.naturalHeight !== 0) {
        opaqueComplete = true
      } else {
        jpegImg.onload = () => {
          opaqueComplete = true
          if (opaqueComplete && alphaComplete) {
            this._onComplete(serial)
          }
        }
      }

      if (jpegAlphaImg.complete && jpegAlphaImg.naturalHeight !== 0) {
        alphaComplete = true
        if (opaqueComplete && alphaComplete) {
          this._onComplete(serial)
        }
      } else {
        jpegAlphaImg.onload = () => {
          alphaComplete = true
          if (opaqueComplete && alphaComplete) {
            this._onComplete(serial)
          }
        }
      }
    } else {
      if (jpegImg.complete && jpegImg.naturalHeight !== 0) {
        this._onComplete(serial)
      } else {
        jpegImg.onload = () => {
          this._onComplete(serial)
        }
      }
    }
  }

  destroy () {
    this._blobTransferResource.release()
    this.resource = null
  }
}
