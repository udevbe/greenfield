'use strict'

export default class DesktopShellEntry {
  /**
   * @param {BrowserSurface}browserSurface
   * @param {BrowserSeat}browserSeat
   * @return {DesktopShellEntry}
   */
  static create (browserSurface, browserSeat) {
    // create a mainView and attach it to the scene
    const mainView = browserSurface.createView()
    this.fadeOutViewOnDestroy(mainView)
    mainView.attachTo(document.body)

    // destroy the mainView if the shell-surface is destroyed
    browserSurface.resource.onDestroy().then(() => {
      mainView.destroy()
    })

    const divElement = document.createElement('div')
    divElement.classList.add('entry')
    this.fadeOutEntryOnDestroy(mainView, divElement)

    const desktopShellEntry = new DesktopShellEntry(browserSurface, mainView, divElement, browserSeat)

    divElement.addEventListener('mousedown', () => {
      desktopShellEntry.makeActive()
    })

    return desktopShellEntry
  }

  /**
   * @param {BrowserSurfaceView}view
   * @param {HTMLElement}entry
   */
  static fadeOutEntryOnDestroy (view, entry) {
    view.onDestroy().then(() => {
      entry.addEventListener('transitionend', () => {
        if (entry.parentElement) {
          entry.parentElement.removeChild(entry)
        }
      })
      entry.classList.add('entry-removed')
    })
  }

  /**
   * @param {BrowserSurfaceView}view
   */
  static fadeOutViewOnDestroy (view) {
    // play a nice fade out animation if the view is destroyed
    view.onDestroy().then(() => {
      view.bufferedCanvas.frontContext.canvas.addEventListener('transitionend', () => {
        // after the animation has ended, detach the view from the scene
        view.detach()
      }, false)
      // play the animation
      view.fadeOut()
    })
  }

  /**
   * Use DesktopShellEntry.create(..) instead.
   * @param {BrowserSurface}browserSurface
   * @param {BrowserSurfaceView}mainView
   * @param {HTMLDivElement}divElement
   * @param {BrowserSeat}browserSeat
   * @private
   */
  constructor (browserSurface, mainView, divElement, browserSeat) {
    /**
     * @type {BrowserSurface}
     */
    this.browserSurface = browserSurface
    /**
     * @type {BrowserSurfaceView}
     */
    this.mainView = mainView
    /**
     * @type {HTMLDivElement}
     */
    this.divElement = divElement
    /**
     * @type {BrowserSeat}
     * @private
     */
    this._browserSeat = browserSeat
  }

  makeActive () {
    this.mainView.show()
    this.mainView.raise()
    this._browserSeat.browserKeyboard.focusGained(this.mainView.browserSurface)
  }

  /**
   * @param {string}title
   */
  updateTitle (title) {
    this.divElement.textContent = title
  }

  onKeyboardFocusLost () {
    this.divElement.classList.remove('entry-focus')
  }

  onKeyboardFocusGained () {
    this.divElement.classList.add('entry-focus')
  }

  hide () {
    this.mainView.fadeOut()
  }
}
