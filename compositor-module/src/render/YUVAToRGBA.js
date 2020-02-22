import YUVA2RGBAShader from './YUVA2RGBAShader'
import YUV2RGBShader from './YUV2RGBShader'
import Texture from './Texture'

class YUVAToRGBA {
  static create (gl) {
    gl.clearColor(0, 0, 0, 0)

    const yTexture = Texture.create(gl, gl.LUMINANCE)
    const uTexture = Texture.create(gl, gl.LUMINANCE)
    const vTexture = Texture.create(gl, gl.LUMINANCE)
    const alphaTexture = Texture.create(gl, gl.LUMINANCE)

    const yuvaSurfaceShader = YUVA2RGBAShader.create(gl)
    const yuvSurfaceShader = YUV2RGBShader.create(gl)

    const framebuffer = gl.createFramebuffer()

    return new YUVAToRGBA(
      gl,
      yuvaSurfaceShader,
      yuvSurfaceShader,
      framebuffer,
      yTexture,
      uTexture,
      vTexture,
      alphaTexture
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
   */
  constructor (
    gl,
    yuvaSurfaceShader,
    yuvSurfaceShader,
    framebuffer,
    yTexture,
    uTexture,
    vTexture,
    alphaTexture
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
   * @param {opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}yuva
   * @param {Size}frameSize
   * @param {View}view
   */
  convertInto (yuva, frameSize, view) {
    const { alpha, opaque } = yuva
    // const start = Date.now()
    if (view.destroyed) {
      return
    }
    const renderState = view.renderState
    // console.log(`|--> Decoding took ${Date.now() - start}ms`)

    // the width & height returned are actually padded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueBuffer = opaque.buffer
    const opaqueStride = opaque.width // stride
    const opaqueHeight = opaque.height // padded with filler rows

    const maxXTexCoord = frameSize.w / opaqueStride
    const maxYTexCoord = frameSize.h / opaqueHeight

    const lumaSize = opaqueStride * opaqueHeight
    const chromaSize = lumaSize >> 2

    const yBuffer = opaqueBuffer.subarray(0, lumaSize)
    const uBuffer = opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize)
    const vBuffer = opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize))

    const isSubImage = frameSize.w === opaqueStride && frameSize.h === opaqueHeight

    const chromaHeight = opaqueHeight >> 1
    const chromaStride = opaqueStride >> 1

    // we upload the entire image, including stride padding & filler rows. The actual visible image will be mapped
    // from texture coordinates as to crop out stride padding & filler rows.
    if (isSubImage) {
      this.yTexture.subImage2dBuffer(yBuffer, 0, 0, opaqueStride, opaqueHeight)
      this.uTexture.subImage2dBuffer(uBuffer, 0, 0, chromaStride, chromaHeight)
      this.vTexture.subImage2dBuffer(vBuffer, 0, 0, chromaStride, chromaHeight)
    } else {
      this.yTexture.image2dBuffer(yBuffer, opaqueStride, opaqueHeight)
      this.uTexture.image2dBuffer(uBuffer, chromaStride, chromaHeight)
      this.vTexture.image2dBuffer(vBuffer, chromaStride, chromaHeight)
    }

    if (!renderState.size.equals(frameSize)) {
      renderState.size = frameSize
      renderState.texture.image2dBuffer(null, frameSize.w, frameSize.h)
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

      this._yuva2rgba(renderState, maxXTexCoord, maxYTexCoord)
    } else {
      this._yuv2rgb(renderState, maxXTexCoord, maxYTexCoord)
    }
  }

  /**
   * @param {RenderState}renderState
   * @param {number}maxXTexCoord
   * @param {number}maxYTexCoord
   * @private
   */
  _yuv2rgb (renderState, maxXTexCoord, maxYTexCoord) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    const attachmentPoint = this.gl.COLOR_ATTACHMENT0
    const level = 0
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, renderState.texture.texture, level)

    this.yuvSurfaceShader.use()
    this.yuvSurfaceShader.setTexture(this.yTexture, this.uTexture, this.vTexture)
    this.yuvSurfaceShader.updateShaderData(renderState.size, maxXTexCoord, maxYTexCoord)
    this.yuvSurfaceShader.draw()
    this.yuvSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  /**
   * @param {RenderState}renderState
   * @param {number}maxXTexCoord
   * @param {number}maxYTexCoord
   * @private
   */
  _yuva2rgba (renderState, maxXTexCoord, maxYTexCoord) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    const attachmentPoint = this.gl.COLOR_ATTACHMENT0
    const level = 0
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, renderState.texture.texture, level)

    this.yuvaSurfaceShader.use()
    this.yuvaSurfaceShader.setTexture(this.yTexture, this.uTexture, this.vTexture, this.alphaTexture)
    this.yuvaSurfaceShader.updateShaderData(renderState.size, maxXTexCoord, maxYTexCoord)
    this.yuvaSurfaceShader.draw()
    this.yuvaSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }
}

export default YUVAToRGBA
