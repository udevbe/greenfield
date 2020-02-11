import RenderFrame from './RenderFrame'
import SceneShader from './SceneShaderRGBA'
import Size from '../Size'
import H264ToRGBA from './H264ToRGBA'

class Scene {
  /**
   * @return {Scene}
   */
  static create (gl, canvas) {
    const sceneShaderRGBA = SceneShader.create(gl)
    const h264ToRGBA = H264ToRGBA.create(gl)
    return new Scene(canvas, gl, sceneShaderRGBA, h264ToRGBA)
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @param {WebGLRenderingContext}gl
   * @param {SceneShader}sceneShaderRGBA
   * @param {H264ToRGBA}h264ToRGBA
   */
  constructor (canvas, gl, sceneShaderRGBA, h264ToRGBA) {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this.canvas = canvas
    /**
     * @type {WebGLRenderingContext}
     * @private
     */
    this.gl = gl
    /**
     * @type {SceneShader}
     */
    this.sceneShader = sceneShaderRGBA
    /**
     * @type {H264ToRGBA}
     */
    this.h264ToRGBA = h264ToRGBA
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
      const sceneSize = Size.create(this.canvas.width, this.canvas.height)
      this.renderFrame.then(() => {
        this.renderFrame = null
        this.sceneShader.use()
        this.sceneShader.updateSceneData(sceneSize)
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
}

export default Scene
