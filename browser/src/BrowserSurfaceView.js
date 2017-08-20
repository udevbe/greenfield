export default class BrowserSurfaceView {
  static create (globalX, globalY, browserSurface) {

    return new BrowserSurfaceView(globalX, globalY, browserSurface,)
  }

  /**
   *
   * @param {number} globalX
   * @param {number} globalY
   * @param {BrowserBuffer} browserSurface
   */
  constructor (globalX, globalY, browserSurface) {
    this.position = {x: globalX, y: globalY}
    this.browserSurface = browserSurface
    this.renderState = null
  }

  setPosition (position) {
    this.position = position
  }

  getTransform () {
    return [
      1, 0, 0, this.position.x,
      0, 1, 0, this.position.y,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }
}
