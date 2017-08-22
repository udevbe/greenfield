'use strict'

import Decoder from '../lib/broadway/Decoder.js'
import Texture from './Texture'

export default class H264ViewState {

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {Size} size
   * @returns {H264ViewState}
   */
  static create (gl, size) {
    const decoder = new Decoder()

    const YTexture = Texture.create(gl, size, gl.LUMINANCE)
    const UTexture = Texture.create(gl, size.getHalfSize(), gl.LUMINANCE)
    const VTexture = Texture.create(gl, size.getHalfSize(), gl.LUMINANCE)

    const h264ViewState = new H264ViewState(decoder, YTexture, UTexture, VTexture, size)
    decoder.onPictureDecoded = h264ViewState._onPictureDecoded.bind(h264ViewState)

    return h264ViewState
  }

  /**
   *
   * @param decoder
   * @param {Texture} YTexture
   * @param {Texture}UTexture
   * @param {Texture}VTexture
   * @param {Size} size
   */
  constructor (decoder, YTexture, UTexture, VTexture, size) {
    this.decoder = decoder
    this.YTexture = YTexture
    this.UTexture = UTexture
    this.VTexture = VTexture
    this.size = size
    // TODO We might also want to introduce blob images (ie png) that can be rendered either directly without the need
    // of gl or decoders (functional similar to hw planes) or the RGBASurfaceShader can be used.
    this.type = 'h264'
  }

  /**
   *
   * @param {Uint8Array} h264Nal
   */
  decode (h264Nal) {
    this.decoder.decode(h264Nal)
  }

  _onPictureDecoded (buffer, width, height) {
    if (!buffer) { return }

    const lumaSize = width * height
    const chromaSize = lumaSize >> 2

    this.YTexture.fill(buffer.subarray(0, lumaSize))
    this.UTexture.fill(buffer.subarray(lumaSize, lumaSize + chromaSize))
    this.VTexture.fill(buffer.subarray(lumaSize + chromaSize, lumaSize + 2 * chromaSize))
  }

  onDecode () {}

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
