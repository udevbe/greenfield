export default class BrowserRenderer {
  static create (browserScene) {
    return new BrowserRenderer()
  }

  constructor () {
    // TODO create an offscreen canvas
    // TODO enable webgl on it
    // TODO create a webworker
  }

  /**
   *
   * @param {Array<BrowserSurfaceView>} browserSurfaceViewStack
   */
  render (browserSurfaceViewStack) {
    browserSurfaceViewStack.forEach((browserSurfaceView) => {
      this.update(browserSurfaceView)
    })
  }

  update (browserSurfaceView) {
    // TODO get contents of buffer & add it to video buffer
    // TODO reposition gl texture based on view position
  }
}
