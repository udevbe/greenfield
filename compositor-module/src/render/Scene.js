import RenderFrame from './RenderFrame'
import SceneShader from './SceneShader'
import Size from '../Size'
import YUVAToRGBA from './YUVAToRGBA'

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
    const yuvaToRgba = YUVAToRGBA.create(gl)
    return new Scene(session, canvas, gl, sceneShader, yuvaToRgba, output)
  }

  /**
   * @param {Session}session
   * @param {HTMLCanvasElement}canvas
   * @param {WebGLRenderingContext}gl
   * @param {SceneShader}sceneShader
   * @param {YUVAToRGBA}yuvaToRgba
   * @param {Output}output
   */
  constructor (session, canvas, gl, sceneShader, yuvaToRgba, output) {
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
     * @type {YUVAToRGBA}
     */
    this._yuvaToRGBA = yuvaToRgba
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
     * @private
     */
    this._renderFrame = null
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
   * @param {View}view
   * @private
   */
  _prepareViewRenderState (view) {
    view.applyTransformations()
    const { bufferResource, bufferContents } = view.surface.state
    if (view.mapped && bufferResource && bufferContents && view.damaged) {
      this[bufferContents.mimeType](bufferContents, view)
      view.damaged = false
    }

    if (bufferResource && bufferResource.implementation.captured && view.surface.views.filter(view => view.damaged).length === 0) {
      bufferResource.implementation.release()
    }
  }

  /**
   * @return {Promise<void>}
   */
  render () {
    if (!this._renderFrame) {
      this._renderFrame = RenderFrame.create()
      this._renderFrame.then(() => {
        this._ensureResolution()
        const viewStack = this._viewStack()

        // update textures
        viewStack.forEach(view => this._prepareViewRenderState(view))
        if (this.pointerView && this.session.globals.seat.pointer.scene === this) {
          this._prepareViewRenderState(this.pointerView)
        }

        // render view texture
        this.sceneShader.use()
        this.sceneShader.updateSceneData(Size.create(this.canvas.width, this.canvas.height))
        viewStack.forEach(view => this._renderView(view))
        if (this.pointerView && this.session.globals.seat.pointer.scene === this) {
          this._renderView(this.pointerView)
        }
        this.sceneShader.release()

        this._renderFrame = null
      })
    }
    return this._renderFrame
  }

  /**
   * @param {Surface}surface
   */
  updatePointerView (surface) {
    if (this.pointerView !== null && this.pointerView.surface !== surface) {
      this.pointerView.destroy()
      this.pointerView = surface.createView(this)
    } else if (this.pointerView === null) {
      this.pointerView = surface.createView(this)
    }
  }

  destroyPointerView () {
    if (this.pointerView !== null) {
      this.pointerView.destroy()
    }
  }

  /**
   * @param {View}view
   * @param {TexImageSource}buffer
   * @private
   */
  _updateViewRenderStateWithTexImageSource (view, buffer) {
    const { texture, size: { w, h } } = view.renderState
    if (buffer.width === w && buffer.height === h) {
      texture.subImage2d(buffer, 0, 0)
    } else {
      view.renderState.size = Size.create(buffer.width, buffer.height)
      texture.image2d(buffer)
    }
  }

  /**
   * @param {View}view
   * @private
   */
  _renderView (view) {
    const { bufferResource, bufferContents } = view.surface.state
    if (view.mapped && bufferResource && bufferContents) {
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
    this.topLevelViews.forEach(topLevelView => topLevelView.destroy())
    if (this.pointerView) {
      this.pointerView.destroy()
    }
    this.topLevelViews = []
    this.pointerView = null
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

  /**
   * @param {DecodedFrame}decodedFrame
   * @param {View}view
   * @private
   */
  ['video/h264'] (decodedFrame, view) {
    this._yuvaToRGBA.convertInto(decodedFrame.pixelContent, decodedFrame.size, view)
  }

  /**
   * @param {DecodedFrame}decodedFrame
   * @param {View}view
   * @private
   */
  ['image/png'] (decodedFrame, view) {
    this._updateViewRenderStateWithTexImageSource(view, decodedFrame.pixelContent)
  }

  /**
   * @param {WebShmFrame}shmFrame
   * @param {View}view
   * @return {Promise<void>}
   */
  ['image/rgba'] (shmFrame, view) {
    this._updateViewRenderStateWithTexImageSource(view, shmFrame.pixelContent)
  }

  /**
   * @param {WebGLFrame}webGLFrame
   * @param {View}view
   * @return {Promise<void>}
   */
  ['image/canvas'] (webGLFrame, view) {
    this._updateViewRenderStateWithTexImageSource(view, webGLFrame.pixelContent)
  }
}

export default Scene
