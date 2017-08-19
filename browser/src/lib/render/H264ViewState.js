import Decoder from './broadway/Decoder.js'
import Texture from './canvas/Texture'

export default class H264ViewState {
  static create (gl, size) {
    const decoder = new Decoder()

    const YTexture = new Texture(gl, size)
    const UTexture = new Texture(gl, size.getHalfSize())
    const VTexture = new Texture(gl, size.getHalfSize())

    const transformM4 = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]

    const h264ViewState = new H264ViewState(decoder, transformM4, YTexture, UTexture, VTexture)
    decoder.onPictureDecoded = h264ViewState.onPictureDecoded

    return h264ViewState
  }

  constructor (decoder, transformM4, YTexture, UTexture, VTexture) {
    this.decoder = decoder
    this.transformM4 = transformM4
    this.YTexture = YTexture
    this.UTexture = UTexture
    this.VTexture = VTexture
  }

  decode (h264Nal) {
    this.decoder.decode(h264Nal)
  }

  setPosition (globalX, globalY) {
    this.positionV4[3] = globalX
    this.positionV4[7] = globalY
  }

  onPictureDecoded (buffer, width, height) {
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
