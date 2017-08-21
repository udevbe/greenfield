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
    const browserSurfaceViewStack = []
    this.browserSurfaces.forEach((browserSurface) => {
      browserSurfaceViewStack.concat(browserSurface.browserSurfaceViews)
    })
    return browserSurfaceViewStack
  }
}