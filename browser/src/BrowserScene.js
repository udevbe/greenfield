'use strict'

export default class BrowserScene {
  static create () {
    return new BrowserScene()
  }

  constructor () {
    this.browserSurfaces = []
  }

  /**
   *
   * @return {Array<BrowserSurfaceView>}
   */
  createBrowserSurfaceViewStack () {
    let browserSurfaceViewStack = []
    this.browserSurfaces.forEach((browserSurface) => {
      browserSurfaceViewStack = browserSurfaceViewStack.concat(browserSurface.browserSurfaceViews)
    })
    return browserSurfaceViewStack
  }
}
