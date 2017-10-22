'use strict'

import ViewState from './ViewState'
import BrowserDcBufferFactory from '../BrowserDcBufferFactory'

export default class Renderer {
  /**
   *
   * @param browserScene
   * @param browserSession
   * @returns {Renderer}
   */
  static create (browserScene, browserSession) {
    return new Renderer(browserScene, browserSession)
  }

  /**
   *
   * @param browserScene
   * @param browserSession
   */
  constructor (browserScene, browserSession) {
    this.browserScene = browserScene
    this.browserSession = browserSession
    this._renderBusy = false

    this._timeOffset = new Date().getTime()

    // TODO introduce a cursor layer and handle blob images that are placed above the rendered canvas. This allows
    // to implement a mouse cursor that can be moved without the main canvas scene to be updated
  }

  renderAll () {
    if (!this._renderBusy) {
      this._renderBusy = true
      window.requestAnimationFrame(() => {
        this._renderBusy = false
        const browserSurfaceViewStack = this.browserScene.createBrowserSurfaceViewStack()
        browserSurfaceViewStack.forEach((view) => {
          this._render(view)
        })

        this.browserSession.flush()
      })
    }
  }

  /**
   *
   * @param {BrowserSurfaceView} view
   */
  _render (view) {
    const grBuffer = view.browserSurface.browserBuffer
    if (grBuffer === null) {
      return
    }
    const browserRtcDcBuffer = BrowserDcBufferFactory.get(grBuffer)

    const drawSyncSerial = browserRtcDcBuffer.syncSerial

    if (browserRtcDcBuffer.isComplete(drawSyncSerial)) {
      const bufferSize = browserRtcDcBuffer.geo
      if (!view.renderState) {
        view.renderState = ViewState.create(view, bufferSize)
      } else if (view.renderState.size.w !== bufferSize.w || view.renderState.size.h !== bufferSize.h) {
        view.renderState.init(view, bufferSize)
      }
      // we have all required information to draw the view
      view.renderState.update(browserRtcDcBuffer.yuvContent, browserRtcDcBuffer.yuvWidth, browserRtcDcBuffer.yuvHeight)
      if (view.browserSurface.frameCallback) {
        const time = new Date().getTime() - this._timeOffset
        view.browserSurface.frameCallback.done(time)
        view.browserSurface.frameCallback = null
      }
    } else {
      // buffer contents have not yet arrived, reschedule a scene repaint as soon as the buffer arrives.
      // The old state will be used to draw the view
      browserRtcDcBuffer.whenComplete(drawSyncSerial).then(() => {
        this.renderAll()
      }).catch((error) => {
        console.log(error)
      })
    }

    // paint the textures
    if (view.renderState) {
      view.renderState.paint()
    }
  }
}
