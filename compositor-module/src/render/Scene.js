import RenderFrame from './RenderFrame'
import SceneShader from './SceneShaderRGBA'
import Size from '../Size'
import H264ToRGBA from './H264ToRGBA'

class Scene {
  /**
   * @param {WebGLRenderingContext}gl
   * @param {HTMLCanvasElement|OffscreenCanvas}canvas
   * @param {Output}output
   * @return {Scene}
   */
  static create (gl, canvas, output) {
    const sceneShader = SceneShader.create(gl)
    const h264ToRGBA = H264ToRGBA.create(gl)
    return new Scene(canvas, gl, sceneShader, h264ToRGBA, output)
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @param {WebGLRenderingContext}gl
   * @param {SceneShader}sceneShader
   * @param {H264ToRGBA}h264ToRGBA
   * @param {Output}output
   */
  constructor (canvas, gl, sceneShader, h264ToRGBA, output) {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this.canvas = canvas
    /**
     * @type {Size}
     */
    this.size = Size.create(canvas.width, canvas.height)
    /**
     * @type {WebGLRenderingContext}
     * @private
     */
    this.gl = gl
    /**
     * @type {SceneShader}
     */
    this.sceneShader = sceneShader
    /**
     * @type {H264ToRGBA}
     */
    this.h264ToRGBA = h264ToRGBA
    /**
     * @type {Output}
     */
    this.output = output
    /**
     * @type {View[]}
     */
    this.topLevelViews = []
    /**
     * @type {?RenderFrame}
     * @private
     */
    this.renderFrame = null
    /**
     * @type {function():void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise(resolve => { this._destroyResolve = resolve })
  }

  render () {
    if (!this.renderFrame) {
      this.renderFrame = RenderFrame.create()
      this.renderFrame.then(() => {
        this.renderFrame = null
        this.sceneShader.use()
        this.sceneShader.updateSceneData(this.size)
        this.topLevelViews.forEach(view => this._renderView(view))
        this.sceneShader.release()
      })
    }
    return this.renderFrame
  }

  /**
   * @param {View}view
   * @private
   */
  _renderView (view) {
    if (view.mapped) {
      this.sceneShader.updateViewData(view)
      this.sceneShader.draw()
    }

    view.findChildViews().forEach(view => this._renderView(view))
  }

  /**
   * @param point
   */
  pickSurface (point) {
    // TODO find matching surface
  }

  destroy () {
    this._destroyResolve()
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  resolution (width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.size = Size.create(this.canvas.width, this.canvas.height)

    this.render()

    this.output.resources.forEach(resource => this.output.emitSpecs(resource))
  }
}

export default Scene
