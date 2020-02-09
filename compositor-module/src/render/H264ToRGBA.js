import YUVA2RGBAShader from './YUVA2RGBAShader'
import YUV2RGBShader from './YUV2RGBShader'
import Texture from './Texture'
import H264BufferContentDecoder from './H264BufferContentDecoder'
import Size from '../Size'

class H264ToRGBA {
  static create (gl) {
    gl.clearColor(0, 0, 0, 0)

    const yTexture = Texture.create(gl, gl.LUMINANCE)
    const uTexture = Texture.create(gl, gl.LUMINANCE)
    const vTexture = Texture.create(gl, gl.LUMINANCE)
    const alphaTexture = Texture.create(gl, gl.LUMINANCE)

    const yuvaSurfaceShader = YUVA2RGBAShader.create(gl)
    const yuvSurfaceShader = YUV2RGBShader.create(gl)

    const framebuffer = gl.createFramebuffer()

    const h264BufferContentDecoder = H264BufferContentDecoder.create()

    return new H264ToRGBA(
      gl,
      yuvaSurfaceShader,
      yuvSurfaceShader,
      framebuffer,
      yTexture,
      uTexture,
      vTexture,
      alphaTexture,
      h264BufferContentDecoder
    )
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @param {YUVA2RGBAShader}yuvaSurfaceShader
   * @param {YUV2RGBShader}yuvSurfaceShader
   * @param {number}framebuffer
   * @param {Texture}yTexture
   * @param {Texture}uTexture
   * @param {Texture}vTexture
   * @param {Texture}alphaTexture
   * @param {H264BufferContentDecoder}h264BufferContentDecoder
   */
  constructor (
    gl,
    yuvaSurfaceShader,
    yuvSurfaceShader,
    framebuffer,
    yTexture,
    uTexture,
    vTexture,
    alphaTexture,
    h264BufferContentDecoder
  ) {
    /**
     * @type {Texture}
     */
    this.yTexture = yTexture
    /**
     * @type {Texture}
     */
    this.uTexture = uTexture
    /**
     * @type {Texture}
     */
    this.vTexture = vTexture
    /**
     * @type {Texture}
     */
    this.alphaTexture = alphaTexture
    /**
     * @type {H264BufferContentDecoder}
     */
    this.h264BufferContentDecoder = h264BufferContentDecoder
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {number}
     */
    this.framebuffer = framebuffer
    /**
     * @type {YUVA2RGBAShader}
     */
    this.yuvaSurfaceShader = yuvaSurfaceShader
    /**
     * @type {YUV2RGBShader}
     */
    this.yuvSurfaceShader = yuvSurfaceShader
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @param {Texture}targetTexture
   * @return {Promise<void>}
   * @override
   */
  async decodeInto (encodedFrame, targetTexture) {
    // const start = Date.now()
    const { alpha, opaque } = await this.h264BufferContentDecoder.decode(encodedFrame)
    // window.GREENFIELD_DEBUG && console.log(`|- Decoding took ${Date.now() - start}ms`)

    // the width & height returned are actually padded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueBuffer = opaque.buffer
    const opaqueStride = opaque.width // stride
    const opaqueHeight = opaque.height // padded with filler rows

    const maxXTexCoord = encodedFrame.size.w / opaqueStride
    const maxYTexCoord = encodedFrame.size.h / opaqueHeight

    const lumaSize = opaqueStride * opaqueHeight
    const chromaSize = lumaSize >> 2

    const yBuffer = opaqueBuffer.subarray(0, lumaSize)
    const uBuffer = opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize)
    const vBuffer = opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize))

    const isSubImage = this.decodedSize.w === opaqueStride && this.decodedSize.h === opaqueHeight

    const chromaHeight = opaqueHeight >> 1
    const chromaStride = opaqueStride >> 1

    // we upload the entire image, including stride padding & filler rows. The actual visible image will be mapped
    // from texture coordinates as to crop out stride padding & filler rows.
    if (isSubImage) {
      this.yTexture.subImage2dBuffer(yBuffer, 0, 0, opaqueStride, opaqueHeight)
      this.uTexture.subImage2dBuffer(uBuffer, 0, 0, chromaStride, chromaHeight)
      this.vTexture.subImage2dBuffer(vBuffer, 0, 0, chromaStride, chromaHeight)
    } else {
      this.decodedSize = Size.create(opaqueStride, opaqueHeight)
      this.yTexture.image2dBuffer(yBuffer, opaqueStride, opaqueHeight)
      this.uTexture.image2dBuffer(uBuffer, chromaStride, chromaHeight)
      this.vTexture.image2dBuffer(vBuffer, chromaStride, chromaHeight)
    }

    if (alpha) {
      const alphaStride = alpha.width // stride
      const alphaHeight = alpha.height // padded with filler rows
      const alphaLumaSize = alphaStride * alphaHeight

      const alphaBuffer = alpha.buffer.subarray(0, alphaLumaSize)
      if (isSubImage) {
        this.alphaTexture.subImage2dBuffer(alphaBuffer, 0, 0, alphaStride, alphaHeight)
      } else {
        this.alphaTexture.image2dBuffer(alphaBuffer, alphaStride, alphaHeight)
      }

      this._yuva2rgba(targetTexture, encodedFrame.size, maxXTexCoord, maxYTexCoord)
    } else {
      this._yuv2rgb(targetTexture, encodedFrame.size, maxXTexCoord, maxYTexCoord)
    }
  }

  /**
   * @param {Texture}targetTexture
   * @param {Size}encodedFrameSize
   * @param {number}maxXTexCoord
   * @param {number}maxYTexCoord
   * @private
   */
  _yuv2rgb (targetTexture, encodedFrameSize, maxXTexCoord, maxYTexCoord) {
    this.yuvSurfaceShader.use()

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    const attachmentPoint = this.gl.COLOR_ATTACHMENT0
    const level = 0
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, targetTexture, level)

    this.yuvSurfaceShader.setTexture(this.yTexture, this.uTexture, this.vTexture)
    this.yuvSurfaceShader.updateShaderData(encodedFrameSize, maxXTexCoord, maxYTexCoord)
    this.yuvSurfaceShader.draw()
    this.yuvaSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  /**
   * @param {Texture}targetTexture
   * @param {Size}encodedFrameSize
   * @param {number}maxXTexCoord
   * @param {number}maxYTexCoord
   * @private
   */
  _yuva2rgba (targetTexture, encodedFrameSize, maxXTexCoord, maxYTexCoord) {
    this.yuvaSurfaceShader.use()

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    const attachmentPoint = this.gl.COLOR_ATTACHMENT0
    const level = 0
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, targetTexture, level)

    this.yuvaSurfaceShader.setTexture(this.yTexture, this.uTexture, this.vTexture, this.alphaTexture)
    this.yuvaSurfaceShader.updateShaderData(encodedFrameSize, maxXTexCoord, maxYTexCoord)
    this.yuvaSurfaceShader.draw()
    this.yuvaSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }
}

export default H264ToRGBA
