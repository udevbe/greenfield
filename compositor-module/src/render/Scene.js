import RenderFrame from './RenderFrame'
import SceneShader from './SceneShader'
import Size from '../Size'
import H264ToRGBA from './H264ToRGBA'

class Scene {
  /**
   * @param {Session}session
   * @param {WebGLRenderingContext}gl
   * @param {HTMLCanvasElement|OffscreenCanvas}canvas
   * @param {Output}output
   * @return {Scene}
   */
  static create (session, gl, canvas, output) {
    const sceneShader = SceneShader.create(gl)
    const h264ToRGBA = H264ToRGBA.create(gl)
    return new Scene(session, canvas, gl, sceneShader, h264ToRGBA, output)
  }

  /**
   * @param {Session}session
   * @param {HTMLCanvasElement}canvas
   * @param {WebGLRenderingContext}gl
   * @param {SceneShader}sceneShader
   * @param {H264ToRGBA}h264ToRGBA
   * @param {Output}output
   */
  constructor (session, canvas, gl, sceneShader, h264ToRGBA, output) {
    /**
     * @type {Session}
     */
    this.session = session
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas
    /**
     * @type {Size|'auto'}
     */
    this.resolution = 'auto'
    /**
     * @type {WebGLRenderingContext}
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
     * @type {View|null}
     */
    this.pointerView = null
    /**
     * @type {Promise<void>}
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

  _ensureResolution () {
    if (this.resolution === 'auto') {
      if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
      }
    } else if (this.canvas.width !== this.resolution.w || this.canvas.height !== this.resolution.h) {
      this.canvas.width = this.resolution.w
      this.canvas.height = this.resolution.h
    }
  }

  /**
   * @return {Promise<void>}
   */
  render () {
    if (!this.renderFrame) {
      this.renderFrame = RenderFrame.create()
      this.renderFrame.then(() => {
        this._ensureResolution()

        this.renderFrame = null
        this.sceneShader.use()
        this.sceneShader.updateSceneData(Size.create(this.canvas.width, this.canvas.height))
        this._viewStack().forEach(view => this._renderView(view))
        if (this.session.globals.seat.pointer.scene === this) {
          this._renderView(this.pointerView)
        }
        this.sceneShader.release()
      })
    }
    return this.renderFrame
  }

  updatePointerView (surface) {
    if (this.pointerView !== null && this.pointerView.surface !== surface) {
      this.pointerView.destroy()
      this.pointerView = surface.createTopLevelView(this)
    } else if (this.pointerView === null) {
      this.pointerView = surface.createTopLevelView(this)
    }
  }

  destroyPointerView () {
    if (this.pointerView !== null) {
      this.pointerView.destroy()
    }
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
  }

  /**
   * @param {Surface}surface
   */
  raiseSurface (surface) {
    const raisedViews = this.topLevelViews.filter(topLevelView => topLevelView.surface === surface)
    const rest = this.topLevelViews.filter(topLevelView => topLevelView.surface !== surface)
    this.topLevelViews = [...rest, ...raisedViews]
  }

  /**
   * @param {Point}scenePoint
   * @return {View|null}
   */
  pickView (scenePoint) {
    // test views from front to back
    return this._viewStack().reverse().find(view => {
      const surfacePoint = view.toSurfaceSpace(scenePoint)
      return view.surface.isWithinInputRegion(surfacePoint)
    }) || null
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

  /**
   * @param {number}width
   * @param {number}height
   */
  updateResolution (width, height) {
    if (this.resolution.w !== width || this.resolution.h !== height) {
      this.resolution = Size.create(width, height)
      this.render()
      this.output.resources.forEach(resource => this.output.emitSpecs(resource))
    }
  }

  /**
   * Stack of all views of this scene, in-order from bottom to top.
   * @private
   * @return {View[]}
   */
  _viewStack () {
    const stack = []
    this.topLevelViews.forEach(topLevelView => this._addToViewStack(stack, topLevelView))
    return stack
  }

  /**
   * @param {View[]}stack
   * @param {View}view
   * @private
   */
  _addToViewStack (stack, view) {
    stack.push(view)
    view.findChildViews().forEach(view => this._addToViewStack(stack, view))
  }
}

export default Scene
