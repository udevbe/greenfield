'use strict'

import ViewState from './ViewState'
import BrowserRtcBufferFactory from '../BrowserRtcBufferFactory'
import YUVASurfaceShader from './YUVASurfaceShader'
import YUVSurfaceShader from './YUVSurfaceShader'
import Size from '../Size'

export default class Renderer {
  /**
   *
   * @param {BrowserSession} browserSession
   * @returns {Renderer}
   */
  static create (browserSession) {
    // create offscreen gl context
    const canvas = document.createElement('canvas')
    let gl = canvas.getContext('webgl2')
    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL2!')
    }

    gl.clearColor(0, 0, 0, 0)
    const yuvaShader = YUVASurfaceShader.create(gl)
    const yuvShader = YUVSurfaceShader.create(gl)

    return new Renderer(browserSession, gl, yuvaShader, yuvShader, canvas)
  }

  /**
   * Use Renderer.create(..) instead.
   * @private
   * @param browserSession
   * @param gl
   * @param yuvaShader
   * @param yuvShader
   * @param canvas
   */
  constructor (browserSession, gl, yuvaShader, yuvShader, canvas) {
    this.browserSession = browserSession
    this.gl = gl
    this.yuvaShader = yuvaShader
    this.yuvShader = yuvShader
    this.canvas = canvas
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return Size
   */
  surfaceSize (browserSurface) {
    const grBuffer = browserSurface.grBuffer
    const bufferSize = this.bufferSize(grBuffer)
    if (browserSurface.bufferScale === 1) {
      return bufferSize
    }
    const surfaceWidth = bufferSize.w / browserSurface.bufferScale
    const surfaceHeight = bufferSize.h / browserSurface.bufferScale
    return Size.create(surfaceWidth, surfaceHeight)
  }

  /**
   * @param {GrBuffer}grBuffer
   * @return Size
   */
  bufferSize (grBuffer) {
    if (grBuffer === null) {
      return Size.create(0, 0)
    }
    // TODO we could check for null here in case we are dealing with a different kind of buffer
    const browserRtcDcBuffer = BrowserRtcBufferFactory.get(grBuffer)
    return browserRtcDcBuffer.geo
  }

  /**
   * @param {BrowserSurface} browserSurface
   * @param {number} renderStart
   */
  render (browserSurface, renderStart) {
    window.requestAnimationFrame((frameTimeStamp) => {
      this._render(browserSurface, renderStart, frameTimeStamp)
      this.browserSession.flush()
    })
  }

  /**
   * @param {BrowserSurface} browserSurface
   * @param {number} renderStart
   * @param {number} frameTimeStamp
   * @private
   */
  _render (browserSurface, renderStart, frameTimeStamp) {
    const grBuffer = browserSurface.grBuffer
    if (grBuffer === null) {
      browserSurface.renderState = null
      return
    }

    const gl = this.gl
    // TODO we could check for null here in case we are dealing with a different kind of buffer
    const browserRtcDcBuffer = BrowserRtcBufferFactory.get(grBuffer)
    const bufferSize = this.bufferSize(grBuffer)

    if (browserRtcDcBuffer.isComplete()) {
      browserSurface.size = this.surfaceSize(browserSurface)
      browserSurface.bufferSize = bufferSize

      if (!browserSurface.renderState) {
        browserSurface.renderState = ViewState.create(gl)
      }

      // update textures
      browserSurface.renderState.update(browserRtcDcBuffer)

      // paint the textures
      if (browserRtcDcBuffer.type === 'h264') {
        this._drawH264(browserSurface, browserRtcDcBuffer)
      } else { // if (browserRtcDcBuffer.type === 'png')
        this._drawPNG(browserSurface)
      }

      const renderDuration = Date.now() - renderStart
      browserRtcDcBuffer.resource.latency(browserRtcDcBuffer.syncSerial, renderDuration)
      this._nextFrame(browserSurface, frameTimeStamp)
    } else {
      // buffer contents have not yet arrived and decoded, reschedule a scene repaint as soon as the buffer arrives.
      browserRtcDcBuffer.whenComplete().then(() => {
        this.render(browserSurface, renderStart)
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   * @private
   */
  _drawH264 (browserSurface, browserRtcDcBuffer) {
    const bufferSize = browserRtcDcBuffer.geo
    const renderState = browserSurface.renderState
    const viewPortUpdate = this.canvas.width !== bufferSize.w || this.canvas.height !== bufferSize.h
    this.canvas.width = bufferSize.w
    this.canvas.height = bufferSize.h

    if (browserRtcDcBuffer.alphaYuvContent) {
      this.yuvaShader.use()
      this.yuvaShader.draw(renderState.yTexture, renderState.uTexture, renderState.vTexture, renderState.alphaYTexture, bufferSize, viewPortUpdate)
    } else {
      this.yuvShader.use()
      this.yuvShader.draw(renderState.yTexture, renderState.uTexture, renderState.vTexture, bufferSize, viewPortUpdate)
    }

    // blit rendered texture from render canvas into view canvasses
    browserSurface.browserSurfaceViews.forEach((view) => {
      view.drawCanvas(this.canvas)
    })
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @private
   */
  _drawPNG (browserSurface) {
    browserSurface.browserSurfaceViews.forEach((view) => {
      view.drawPNG(browserSurface.renderState.pngImage)
    })
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {number}frameTimeStamp
   * @private
   */
  _nextFrame (browserSurface, frameTimeStamp) {
    if (browserSurface.frameCallback) {
      browserSurface.frameCallback.done(frameTimeStamp << 0)
      browserSurface.frameCallback = null
    }
  }
}
