'use strict'

/**
 * Represents a WebGL texture object.
 */
export default class Texture {
  /**
   * @param {!WebGLRenderingContext}gl
   * @param {!number}format
   * @return {!Texture}
   */
  static create (gl, format) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return new Texture(gl, format, texture)
  }

  /**
   * Use Texture.create(..) instead.
   * @param {WebGLRenderingContext}gl
   * @param {number}format
   * @param {WebGLTexture}texture
   * @private
   */
  constructor (gl, format, texture) {
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {WebGLTexture}
     */
    this.texture = texture
    /**
     * @type {number}
     */
    this.format = format
  }

  /**
   * @param {!Uint8Array}buffer
   * @param {!Rect}geo
   * @param {number}stride
   */
  subImage2dBuffer (buffer, geo, stride) {
    const gl = this.gl

    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, stride)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, geo.x0, geo.y0, geo.width, geo.height, this.format, gl.UNSIGNED_BYTE, buffer)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0)
  }

  /**
   * @param {!Uint8Array}buffer
   * @param {number}width
   * @param {number}height
   * @param {number}stride
   */
  image2dBuffer (buffer, width, height, stride) {
    const gl = this.gl

    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, stride)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, gl.UNSIGNED_BYTE, buffer)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0)
  }

  /**
   * @param {ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement}imageElement
   * @param {!Rect}geo
   */
  subImage2dElement (imageElement, geo) {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, geo.x0, geo.y0, this.format, gl.UNSIGNED_BYTE, imageElement)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  /**
   * @param {ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement}imageElement
   */
  image2dElement (imageElement) {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, gl.UNSIGNED_BYTE, imageElement)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  delete () {
    this.gl.deleteTexture(this.texture)
    this.texture = null
  }
}
