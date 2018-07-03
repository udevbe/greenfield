'use strict'

import UserShellSurface from '../UserShellSurface'

export default class DesktopUserShellSurface extends UserShellSurface {
  /**
   * @param {BrowserSurface}browserSurface
   * @return {DesktopUserShellSurface}
   */
  static create (browserSurface) {
    // create a mainView and attach it to the scene
    const mainView = browserSurface.createView()
    this._fadeOutAndDetachViewOnDestroy(mainView)
    mainView.attachTo(document.body)

    const divElement = document.createElement('div')
    divElement.classList.add('entry')
    this._fadeOutAndDetachEntryOnDestroy(mainView, divElement)

    const desktopUserShellSurface = new DesktopUserShellSurface(mainView, divElement)

    divElement.addEventListener('mousedown', () => {
      desktopUserShellSurface._activeCallback()
    })
    // destroy the mainView if the shell-surface is destroyed
    browserSurface.resource.onDestroy().then(() => {
      desktopUserShellSurface.destroy()
    })

    DesktopUserShellSurface._desktopUserShellSurfaces.push(desktopUserShellSurface)

    return desktopUserShellSurface
  }

  /**
   * @param {BrowserSurfaceView}view
   * @param {HTMLElement}entry
   * @private
   */
  static _fadeOutAndDetachEntryOnDestroy (view, entry) {
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
   * @private
   */
  static _fadeOutAndDetachViewOnDestroy (view) {
    // play a nice fade out animation if the view is destroyed
    view.onDestroy().then(() => {
      // after the animation has ended, detach the view from the scene
      view.bufferedCanvas.containerDiv.addEventListener('transitionend', () => {
        view.detach()
      })
      // play the animation
      view.fadeOut()
    })
  }

  /**
   * Use DesktopShellEntry.create(..) instead.
   * @param {BrowserSurfaceView}mainView
   * @param {HTMLDivElement}divElement
   * @private
   */
  constructor (mainView, divElement) {
    super()
    /**
     * @type {BrowserSurfaceView}
     */
    this.mainView = mainView
    /**
     * @type {HTMLDivElement}
     */
    this.divElement = divElement
    /**
     * @type {function}
     * @private
     */
    this._activeCallback = () => {}
    /**
     * @type {function}
     * @private
     */
    this._inactivateCallback = () => {}
    /**
     *
     * @type {GrKeyboard|null}
     * @private
     */
    this._grKeyboard = null
    /**
     * @type {boolean}
     */
    this.active = false
  }

  /**
   * Confirms that the user shell can give the surface input.
   * @override
   */
  activationAck () {
    if (this.mainView.destroyed) {
      return
    }

    if (!this.active) {
      this.mainView.show()
      this.mainView.raise()
      this.divElement.classList.add('entry-focus')

      if (this._grKeyboard) {
        this._giveKeyboardFocus()
      }

      this.active = true
    }
  }

  set grKeyboard (grKeyboard) {
    if (grKeyboard && this.active) {
      this._giveKeyboardFocus()
    }
  }

  _giveKeyboardFocus () {
    const browserKeyboard = this._grKeyboard.implementation
    browserKeyboard.focusGained(this.mainView.browserSurface)
    browserKeyboard.onKeyboardFocusChanged().then(() => {
      if (browserKeyboard.focus !== this.mainView.browserSurface) {
        this.deactivate()
      }
    })
  }

  deactivate () {
    if (this.active) {
      this.divElement.classList.remove('entry-focus')
      this.active = false
      this._inactivateCallback()
    }
  }

  /**
   * Indicates of the surface contents can be displayed on screen.
   * @param {boolean}mapped
   * @override
   */
  set mapped (mapped) {
    if (mapped) {
      this._activeCallback()
    }
  }

  /**
   * Registers a callback that will be fired when the user shell wants to make a surface active (ie give it input)
   * @param {function}activeCallback
   */
  set onActivationRequest (activeCallback) {
    this._activeCallback = activeCallback
  }

  /**
   * Registers callback that notifies if a surface is no longer active (ie no longer receives input)
   * @param {function}inactivateCallback
   * @override
   */
  set onInactive (inactivateCallback) {
    this._inactivateCallback = inactivateCallback
  }

  /**
   * The id of the application. Can be used to group surfaces.
   * @param {string}appId
   * @override
   */
  set appId (appId) {
    // TODO implement application surface grouping
  }

  /**
   * The title of the surface
   * @param {string} title
   * @override
   */
  set title (title) {
    this.divElement.textContent = title
  }

  /**
   * Notifies the user shell that the surface should no longer be displayed. If a surface is still mapped then the
   * surface contents can still be displayed ie in a live updating tile.
   * @override
   */
  minimize () {
    if (this.mainView.destroyed) {
      return
    }
    this.mainView.fadeOut()
  }

  /**
   * Notifies the user shell that it should destroy all resources associated with the surface
   */
  destroy () {
    if (this.mainView.destroyed) {
      return
    }
    // the view destroy listener will detach the html elements we create earlier on
    this.mainView.destroy()
    const idx = DesktopUserShellSurface._desktopUserShellSurfaces.indexOf(this)
    if (idx > -1) {
      DesktopUserShellSurface._desktopUserShellSurfaces.splice(idx, 1)
    }
  }
}

/**
 * @type {Array<DesktopUserShellSurface>}
 * @private
 */
DesktopUserShellSurface._desktopUserShellSurfaces = []
