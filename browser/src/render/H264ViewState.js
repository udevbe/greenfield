'use strict'

import Decoder from '../lib/broadway/Decoder.js'
import Texture from './Texture'

export default class H264ViewState {
  static create (gl, size) {
    const decoder = new Decoder()

    const YTexture = new Texture(gl, size)
    const UTexture = new Texture(gl, size.getHalfSize())
    const VTexture = new Texture(gl, size.getHalfSize())

    const h264ViewState = new H264ViewState(decoder, YTexture, UTexture, VTexture, size)
    decoder.onPictureDecoded = h264ViewState._onPictureDecoded

    return h264ViewState
  }

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

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
