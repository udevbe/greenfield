import RenderFrame from './RenderFrame'
import SceneShaderRGBA from './SceneShaderRGBA'
import Size from '../Size'

class Scene {
  /**
   * @return {Scene}
   */
  static create (gl, canvas) {
    const sceneShaderRGBA = SceneShaderRGBA.create(gl)
    return new Scene(canvas, gl, sceneShaderRGBA)
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @param {WebGLRenderingContext}gl
   * @param {SceneShaderRGBA}sceneShaderRGBA
   */
  constructor (canvas, gl, sceneShaderRGBA) {
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
     * @type {SceneShaderRGBA}
     */
    this.sceneShaderRGBA = sceneShaderRGBA
    /**
     * @type {View[]}
     */
    this.topLevelViews = []
    /**
     * @type {?RenderFrame}
     * @private
     */
    this.renderFrame = null
  }

  /**
   * @param {RenderFrame}renderFrame
   */
  render () {
    if (!this.renderFrame) {
      this.renderFrame = RenderFrame.create()
      this.renderFrame.then(() => {
        this.renderFrame = null
        this.topLevelViews.forEach(view => this._renderView(view))
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
      this.sceneShaderRGBA.use()
      this.sceneShaderRGBA.setTexture(view.surface.renderState.texture)
      this.sceneShaderRGBA.updateShaderData(
        Size.create(this.canvas.width, this.canvas.height),
        1, 1,
        view.transformation
      )
      this.sceneShaderRGBA.draw()
    }

    view.findChildViews().forEach(view => this._renderView(view))
  }

  /**
   * @param point
   */
  pickSurface (point) {
    // TODO find matching surface
  }
}

export default Scene
