import RGBASurfaceShader from './canvas/RGBASurfaceShader'
import YUVSurfaceShader from './canvas/YUVSurfaceShader'
import H264ViewState from './H264ViewState'
import BrowserDcBufferFactory from '../../BrowserDcBufferFactory'

export default class BrowserRenderer {
  static create (canvas) {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      window.alert('This browser doesn\'t support WebGL!')
      return
    }

    const glConstants = {}
    for (let propertyName in this.gl) {
      if (typeof this.gl[propertyName] === 'number') {
        glConstants[this.gl[propertyName]] = propertyName
      }
    }

    this._initViewport(gl, canvas)
    const viewTransform = [
      2.0 / canvas.width, 0, 0, -1,
      0, 2.0 / -canvas.height, 0, 1,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]

    const rgbaSurfaceShader = RGBASurfaceShader.create(gl)
    const yuvSurfaceShader = YUVSurfaceShader.create(gl)

    return new BrowserRenderer(gl, glConstants, viewTransform, rgbaSurfaceShader, yuvSurfaceShader)
  }

  static _initViewport (gl, canvas) {
    const width = canvas.width
    const height = canvas.height

    // first time render for this output, clear it.
    gl.viewport(0, 0, width, height)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  constructor (gl, glConstants, viewTransform, rgbaSurfaceShader, yuvSurfaceShader) {
    this.gl = gl
    this.glConstants = glConstants
    this.viewTransform = viewTransform
    this.rgbaSurfaceShader = rgbaSurfaceShader
    this.yuvSurfaceShader = yuvSurfaceShader
  }

  /**
   *
   * @param {BrowserSurfaceView} view
   */
  drawView (view) {
    let state = view.state
    if (!state) {
      state = this._initState(view)
    }
  }

  /**
   *
   * @param {BrowserSurfaceView} view
   * @private
   */
  _initState (view) {
    const browserBuffer = view.browserSurface.browserBuffer
    const browserRtcDcBuffer = BrowserDcBufferFactory.get(browserBuffer.grBufferResource)

    H264ViewState.create(this.gl,)
  }
}
