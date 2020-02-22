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

import EncodingOptions from '../remotestreaming/EncodingOptions'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./H264NALDecoderWorker'

const opaqueWorker = new Promise(resolve => {
  const worker = new Worker()
  worker.addEventListener('message', (e) => {
    const message = /** @type {{type:string, width:number, height:number, data:ArrayBuffer, renderStateId:number}} */e.data
    switch (message.type) {
      case 'pictureReady':
        H264BufferContentDecoder._decoders[message.renderStateId]._onOpaquePictureDecoded(message)
        break
      case 'decoderReady':
        resolve(worker)
        break
    }
  })
})

const alphaWorker = new Promise(resolve => {
  const worker = new Worker()
  worker.addEventListener('message', (e) => {
    const message = /** @type {{type:string, width:number, height:number, data:ArrayBuffer, renderStateId:number}} */e.data
    switch (message.type) {
      case 'pictureReady':
        H264BufferContentDecoder._decoders[message.renderStateId]._onAlphaPictureDecoded(message)
        break
      case 'decoderReady':
        resolve(worker)
        break
    }
  })
})

class H264BufferContentDecoder {
  /**
   * @param {string}surfaceH264DecodeId
   * @return {H264BufferContentDecoder}
   */
  static create (surfaceH264DecodeId) {
    const h264BufferContentDecoder = new H264BufferContentDecoder(surfaceH264DecodeId)
    H264BufferContentDecoder._decoders[surfaceH264DecodeId] = h264BufferContentDecoder
    return h264BufferContentDecoder
  }

  /**
   * @param {string}surfaceH264DecodeId
   */
  constructor (surfaceH264DecodeId) {
    /**
     * @type {string}
     */
    this.surfaceH264DecodeId = surfaceH264DecodeId
    /**
     * @type {number[]}
     * @private
     */
    this._decodingSerialsQueue = []
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
   * @param {EncodedFrame}encodedFrame
   * @return {Promise<void>}
   * @private
   */
  _decodeH264 (encodedFrame) {
    const bufferSerial = encodedFrame.serial
    const fullFrame = EncodingOptions.fullFrame(encodedFrame.encodingOptions)
    if (!fullFrame) {
      throw new Error('h264 encoded buffers must contain the full frame.')
    }
    const hasAlpha = EncodingOptions.splitAlpha(encodedFrame.encodingOptions)

    if (hasAlpha) {
      const alphaPixelContent = encodedFrame.pixelContent[0].alpha
      const h264Nal = alphaPixelContent.slice()
      alphaWorker.then(worker => {
        this._decodingAlphaSerialsQueue = [...this._decodingAlphaSerialsQueue, bufferSerial]
        // create a copy of the arraybuffer so we can zero-copy the opaque part (after zero-copying, we can no longer use the underlying array in any way)
        worker.postMessage({
          type: 'decode',
          data: h264Nal.buffer,
          offset: h264Nal.byteOffset,
          length: h264Nal.byteLength,
          renderStateId: this.surfaceH264DecodeId
        }, [h264Nal.buffer])
      })
    } else {
      this._frameStates[bufferSerial].state = 'pending_opaque'
    }

    const h264Nal = encodedFrame.pixelContent[0].opaque
    opaqueWorker.then(worker => {
      this._decodingSerialsQueue = [...this._decodingSerialsQueue, bufferSerial]
      worker.postMessage({
        type: 'decode',
        data: h264Nal.buffer,
        offset: h264Nal.byteOffset,
        length: h264Nal.byteLength,
        renderStateId: this.surfaceH264DecodeId
      }, [h264Nal.buffer])
    })
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
   * @param {ArrayBuffer}data
   * @param {number}width
   * @param {number}height
   */
  _onOpaquePictureDecoded ({ width, height, data }) {
    const buffer = new Uint8Array(data)
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
   */
  _onAlphaPictureDecoded ({ width, height, data }) {
    const buffer = new Uint8Array(data)
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
    opaqueWorker.then(worker => worker.postMessage({ type: 'release', renderStateId: this.surfaceH264DecodeId }))
    alphaWorker.then(worker => worker.postMessage({ type: 'release', renderStateId: this.surfaceH264DecodeId }))
  }
}

/**
 * @type {Object.<string, H264BufferContentDecoder>}
 */
H264BufferContentDecoder._decoders = {}

export default H264BufferContentDecoder
