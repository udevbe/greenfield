// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import H264NALDecoder from './H264NALDecoder'
import EncodingOptions from '../remotestreaming/EncodingOptions'

export default class H264BufferContentDecoder {
  /**
   * @return {H264BufferContentDecoder}
   */
  static create () {
    return new H264BufferContentDecoder()
  }

  constructor () {
    /**
     * @type {H264NALDecoder}
     * @private
     */
    this._decoder = null
    /**
     * @type {Promise<H264NALDecoder>}
     * @private
     */
    this._decoderFactory = null
    /**
     * @type {number[]}
     * @private
     */
    this._decodingSerialsQueue = []
    /**
     * @type {H264NALDecoder}
     * @private
     */
    this._alphaDecoder = null
    /**
     * @type {Promise<H264NALDecoder>}
     * @private
     */
    this._alphaDecoderFactory = null
    /**
     * @type {number[]}
     * @private
     */
    this._decodingAlphaSerialsQueue = []
    /**
     * @rtype {Object.<number,{serial: number, resolve:Function, state: 'pending'|'pending_opaque'|'pending_alpha'|'complete', result: {opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}}>}
     * @private
     */
    this._frameStates = {}
  }

  /**
   * @param {EncodedFrame}bufferContents
   * @return {Promise<{opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}>}
   */
  async decode (bufferContents) {
    return new Promise((resolve) => {
      this._frameStates[bufferContents.serial] = {
        serial: bufferContents.serial,
        resolve: resolve,
        state: 'pending',
        result: {
          opaque: null,
          alpha: null
        }
      }

      this._decodeH264(bufferContents)
    })
  }

  /**
   * @param {boolean}hasAlpha
   * @private
   */
  async _ensureH264Decoders (hasAlpha) {
    if (!this._decoder) {
      if (!this._decoderFactory) {
        this._decoderFactory = H264NALDecoder.create(H264BufferContentDecoder._nextDecoderId++)
      }
      const decoder = await this._decoderFactory
      decoder.onPicture = (buffer, width, height) => {
        this._onPictureDecoded(buffer, width, height)
      }
      this._decoder = decoder
    }

    if (hasAlpha && !this._alphaDecoder) {
      if (!this._alphaDecoderFactory) {
        this._alphaDecoderFactory = H264NALDecoder.create(H264BufferContentDecoder._nextDecoderId++)
      }
      const alphaDecoder = await this._alphaDecoderFactory
      alphaDecoder.onPicture = (buffer, width, height) => {
        this._onAlphaPictureDecoded(buffer, width, height)
      }
      this._alphaDecoder = alphaDecoder
    }

    if (!hasAlpha && this._alphaDecoder) {
      this._alphaDecoder.release()
      this._alphaDecoder = null
      this._alphaDecoderFactory = null
    }
  }

  /**
   * @param {EncodedFrame}bufferContents
   * @return {Promise<void>}
   * @private
   */
  async _decodeH264 (bufferContents) {
    const fullFrame = EncodingOptions.fullFrame(bufferContents.encodingOptions)
    if (!fullFrame) {
      throw new Error('h264 encoded buffers must contain the full frame.')
    }
    const hasAlpha = EncodingOptions.splitAlpha(bufferContents.encodingOptions)
    await this._ensureH264Decoders(hasAlpha)

    if (hasAlpha) {
      this._decodingAlphaSerialsQueue.push(bufferContents.serial)
      // create a copy of the arraybuffer so we can zero-copy the opaque part (after zero-copying, we can no longer use the underlying array in any way)
      const alphaPixelContent = bufferContents.pixelContent[0].alpha
      const alphaH264Nal = alphaPixelContent.slice()
      this._alphaDecoder.decode(alphaH264Nal)
    } else {
      this._frameStates[bufferContents.serial].state = 'pending_opaque'
    }

    this._decodingSerialsQueue.push(bufferContents.serial)
    const opaqueH264Nal = bufferContents.pixelContent[0].opaque
    this._decoder.decode(opaqueH264Nal)
  }

  /**
   * @param {{serial: number, resolve:Function, state: 'pending'|'pending_opaque'|'pending_alpha'|'complete', result: {opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}}}frameState
   * @private
   */
  _onComplete (frameState) {
    frameState.state = 'complete'
    delete this._frameStates[frameState.serial]
    frameState.resolve(frameState.result)
  }

  /**
   * @param {Uint8Array}buffer
   * @param {number}width
   * @param {number}height
   * @private
   */
  _onPictureDecoded (buffer, width, height) {
    const frameSerial = this._decodingSerialsQueue.shift()
    const frameState = this._frameStates[frameSerial]
    frameState.result.opaque = {
      buffer: buffer,
      width: width,
      height: height
    }

    if (frameState.state === 'pending_opaque') {
      this._onComplete(frameState)
    } else {
      frameState.state = 'pending_alpha'
    }
  }

  /**
   * @param {Uint8Array}buffer
   * @param {number}width
   * @param {number}height
   * @private
   */
  _onAlphaPictureDecoded (buffer, width, height) {
    const frameSerial = this._decodingAlphaSerialsQueue.shift()
    const frameState = this._frameStates[frameSerial]
    frameState.result.alpha = {
      buffer: buffer,
      width: width,
      height: height
    }

    if (frameState.state === 'pending_alpha') {
      this._onComplete(frameState)
    } else {
      this._frameStates[frameSerial].state = 'pending_opaque'
    }
  }

  destroy () {
    if (this._decoder) {
      this._decoder.release()
      this._decoderFactory = null
      this._decoder = null
    }
    if (this._alphaDecoder) {
      this._alphaDecoder.release()
      this._alphaDecoderFactory = null
      this._alphaDecoder = null
    }
  }
}

/**
 * @type {number}
 * @private
 */
H264BufferContentDecoder._nextDecoderId = 0
