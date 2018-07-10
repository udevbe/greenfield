'use strict'

/**
 * @implements UserShellSurface
 */
export default class DesktopUserShellSurface {
  /**
   * @param {BrowserSurface}browserSurface
   * @param {BrowserSeat}browserSeat
   * @return {DesktopUserShellSurface}
   */
  static create (browserSurface, browserSeat) {
    // create a mainView and attach it to the scene
    const mainView = browserSurface.createView()
    this._fadeOutAndDetachViewOnDestroy(mainView)
    mainView.attachTo(document.body)

    const divElement = document.createElement('div')
    // divElement will become visible once surface is mapped
    divElement.style.display = 'none'
    divElement.classList.add('entry')
    this._fadeOutAndDetachEntryOnDestroy(mainView, divElement)

    const desktopUserShellSurface = new DesktopUserShellSurface(mainView, divElement, browserSeat)
    desktopUserShellSurface._activateOnPointerButton()

    divElement.addEventListener('mousedown', () => {
      desktopUserShellSurface._activeCallback()
    })
    // destroy the mainView if the shell-surface is destroyed
    browserSurface.resource.onDestroy().then(() => {
      desktopUserShellSurface.destroy()
    })

    DesktopUserShellSurface.desktopUserShellSurfaces.push(desktopUserShellSurface)

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
   * @param {BrowserSeat}browserSeat
   * @private
   */
  constructor (mainView, divElement, browserSeat) {
    /**
     * @type {BrowserSurfaceView}
     */
    this.mainView = mainView
    /**
     * @type {HTMLDivElement}
     */
    this.divElement = divElement
    /**
     * @type {Function|null}
     * @private
     */
    this._activeCallback = null
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
    /**
     * @type {BrowserSeat}
     * @private
     */
    this._browserSeat = browserSeat
  }

  /**
   * @private
   */
  _activateOnPointerButton () {
    this._browserSeat.browserPointer.onButtonPress().then(() => {
      if (this.mainView.destroyed) {
        return
      }

      if (!this.active &&
        this._browserSeat.browserPointer.focus &&
        this._browserSeat.browserPointer.focus.browserSurface === this.mainView.browserSurface) {
        this._activeCallback()
      }

      this._activateOnPointerButton()
    })
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
      this.active = true

      this.mainView.show()
      this.mainView.raise()
      this.divElement.classList.add('entry-focus')

      if (this._grKeyboard) {
        this._giveKeyboardFocus()
      }

      DesktopUserShellSurface.desktopUserShellSurfaces.forEach((desktopUserShellSurface) => {
        if (desktopUserShellSurface !== this) {
          desktopUserShellSurface._deactivate()
        }
      })
    }
  }

  /**
   * @param {GrKeyboard}grKeyboard
   */
  set grKeyboard (grKeyboard) {
    if (this.mainView.destroyed) {
      return
    }

    if (this.active && this._grKeyboard && this._grKeyboard.implementation.focus !== this.mainView.browserSurface) {
      this._giveKeyboardFocus()
    }
    this._grKeyboard = grKeyboard
    this._grKeyboard.onDestroy().then(() => {
      this._grKeyboard = null
    })
  }

  /**
   * @private
   */
  _giveKeyboardFocus () {
    const browserKeyboard = this._grKeyboard.implementation
    browserKeyboard.focusGained(this.mainView.browserSurface)
  }

  /**
   * @private
   */
  _deactivate () {
    if (this.active) {
      this.active = false
      this.divElement.classList.remove('entry-focus')
      this._inactivateCallback()
    }
  }

  /**
   * Indicates if the surface contents can be displayed on screen.
   * @param {boolean}mapped
   * @override
   */
  set mapped (mapped) {
    // TODO we probably want to use a style class here instead of display = ..
    if (mapped) {
      this.divElement.style.display = 'inline'
      this.divElement.classList.remove('entry-removed')
    } else {
      this.divElement.addEventListener('transitionend', () => {
        this.divElement.style.display = 'none'
      })
      this.divElement.classList.add('entry-removed')
    }
  }

  /**
   * Registers a callback that will be fired when the user shell wants to make a surface active (ie give it input)
   * @param {function}activeCallback
   */
  set onActivationRequest (activeCallback) {
    this._activeCallback = activeCallback
    if (!this.active) {
      this._activeCallback()
    }
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
   * @override
   */
  destroy () {
    const idx = DesktopUserShellSurface.desktopUserShellSurfaces.indexOf(this)
    if (idx > -1) {
      DesktopUserShellSurface.desktopUserShellSurfaces.splice(idx, 1)
    }
  }
}

/**
 * @type {Array<DesktopUserShellSurface>}
 */
DesktopUserShellSurface.desktopUserShellSurfaces = []
