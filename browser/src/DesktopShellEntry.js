'use strict'

export default class DesktopShellEntry {
  /**
   * @param {BrowserKeyboard}browserKeyboard
   * @param {BrowserSurface}browserSurface
   * @return {DesktopShellEntry}
   */
  static create (browserKeyboard, browserSurface) {
    // create a mainView and attach it to the scene
    const mainView = browserSurface.createView()
    this.fadeOutViewOnDestroy(mainView)
    mainView.attachTo(document.body)
    mainView.raise()

    // destroy the mainView if the shell-surface is destroyed
    browserSurface.resource.onDestroy().then(() => {
      mainView.destroy()
    })

    const entry = document.createElement('div')
    entry.classList.add('entry')
    this.fadeOutEntryOnDestroy(mainView, entry)

    const desktopShellEntry = new DesktopShellEntry(browserKeyboard, browserSurface, mainView, entry)

    entry.addEventListener('click', () => {
      desktopShellEntry.onClick()
    })

    return desktopShellEntry
  }

  static fadeOutEntryOnDestroy (view, entry) {
    view.onDestroy().then(() => {
      if (entry.parentElement) {
        entry.addEventListener('transitionend', () => {
          entry.parentElement.removeChild(entry)
        })
        entry.classList.add('entry-removed')
      }
    })
  }

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
   * @param {BrowserKeyboard}browserKeyboard
   * @param {BrowserSurface}browserSurface
   * @param {BrowserSurfaceView}mainView
   * @param {HTMLDivElement}entry
   * @private
   */
  constructor (browserKeyboard, browserSurface, mainView, entry) {
    this.browserKeyboard = browserKeyboard
    this.browserSurface = browserSurface
    this.mainView = mainView
    this.entry = entry
  }

  onClick () {
    this.mainView.raise()
    this.browserKeyboard.focusGained(this.mainView)
  }

  /**
   * @param {String}title
   */
  updateTitle (title) {
    this.entry.textContent = title
  }

  onKeyboardFocusLost () {
    this.entry.classList.remove('entry-focus')
  }

  onKeyboardFocusGained () {
    this.entry.classList.add('entry-focus')
  }
}
