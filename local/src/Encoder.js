'use strict'

const H264Encoder = require('./H264Encoder')
const PNGEncoder = require('./PNGEncoder')

module.exports = class Encoder {
  static create () {
    return new Encoder()
  }

  constructor () {
    this._h264Encoder = null
    this._pngEncoder = null
  }

  encodeBuffer (pixelBuffer, bufferWidth, bufferHeight, synSerial) {
    if (bufferWidth <= 128 || bufferHeight <= 128) {
      if (this._h264Encoder) {
        this._h264Encoder = null
      }
      return this._encodeBufferPNG(pixelBuffer, bufferWidth, bufferHeight, synSerial)
    } else {
      if (this._pngEncoder) {
        this._pngEncoder = null
      }
      return this._encodeBufferH264(pixelBuffer, bufferWidth, bufferHeight, synSerial)
    }
  }

  // TODO codepaths for png & h264 are near identical, except for the alpha part. Implement a path that unifies
  // both in a generic way.
  _encodeBufferPNG (pixelBuffer, bufferWidth, bufferHeight, synSerial) {
    return new Promise((resolve, reject) => {
      if (!this._pngEncoder) {
        this._pngEncoder = PNGEncoder.create(bufferWidth, bufferHeight)
        // FIXME derive fromat from actual shm format
        this._pngEncoder.src.setCapsFromString('video/x-raw,format=BGRA,width=' + bufferWidth + ',height=' + bufferHeight)
        this._pngEncoder.pipeline.play()
      }

      this._pngEncoder.src.push(pixelBuffer)

      const frame = {
        type: 1, // png
        width: bufferWidth,
        height: bufferHeight,
        synSerial: synSerial,
        opaque: null, // only use opaque, as png has build in alpha channel
        alpha: Buffer.allocUnsafe(0) // alloc empty buffer to avoid null errors
      }

      this._pngEncoder.sink.pull((pngImage) => {
        if (pngImage) {
          frame.opaque = pngImage
          resolve(frame)
        } else {
          // TODO error?
          console.log('pulled empty buffer')
        }
      })
    })
  }

  _encodeBufferH264 (pixelBuffer, bufferWidth, bufferHeight, synSerial) {
    return new Promise((resolve, reject) => {
      // TODO how to dynamically update the pipeline video resolution?
      if (!this._h264Encoder || this._h264Encoder.width !== bufferWidth || this._h264Encoder.height !== bufferHeight) {
        this._h264Encoder = H264Encoder.create(bufferWidth, bufferHeight)
        // FIXME derive fromat from actual shm format
        this._h264Encoder.src.setCapsFromString('video/x-raw,format=BGRA,width=' + bufferWidth + ',height=' + bufferHeight)
        this._h264Encoder.pipeline.play()
      }

      this._h264Encoder.src.push(pixelBuffer)

      const frame = {
        type: 0, // h264
        width: bufferWidth,
        height: bufferHeight,
        synSerial: synSerial,
        opaque: null,
        alpha: null
      }

      // FIXME check buffer format if alpha is required. If not, use an empty buffer instead.

      this._h264Encoder.sink.pull((opaqueH264Nal) => {
        if (opaqueH264Nal) {
          frame.opaque = opaqueH264Nal
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          // TODO error?
          console.log('pulled empty buffer')
        }
      })

      this._h264Encoder.alpha.pull((alphaH264Nal) => {
        if (alphaH264Nal) {
          frame.alpha = alphaH264Nal
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          // TODO error?
          console.log('pulled empty buffer')
        }
      })
    })
  }
}
