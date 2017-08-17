import Decoder from './broadway/Decoder.js'
import YUVSurfaceShader from './canvas/YUVSurfaceShader'
import Size from './utils/Size'

export default class H264ViewState {
  static create (canvas, viewWidth, viewHeight) {
    const decoder = new Decoder()
    // TODO the given canvas is the target rendering canvas, it has however a different size -> accommodate for this
    const yuvSurfaceShader = new YUVSurfaceShader(canvas, new Size(viewWidth, viewHeight))
    decoder.onPictureDecoded = yuvSurfaceShader.decode

    return new H264ViewState(decoder, yuvSurfaceShader)
  }

  constructor (decoder, yuvSurfaceShader) {
    this.decoder = decoder
    this.yuvSurfaceShader = yuvSurfaceShader
  }

  decode (h264Nal) {
    this.decoder.decode(h264Nal)
  }

  position (globalX, globalY) {

  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
