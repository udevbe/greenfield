'use strict'

import UserShellSurface from '../UserShellSurface'

/**
 * @implements UserShellSurface
 */
class DesktopUserShellSurface extends UserShellSurface {
  /**
   * @param {Surface}surface
   * @param {Seat}seat
   * @return {DesktopUserShellSurface}
   */
  static create (surface, seat) {
    // create a mainView and attach it to the scene
    const mainView = surface.createView()
    this._fadeOutAndDetachViewOnDestroy(mainView)
    mainView.attachTo(document.body)

    const divElement = document.createElement('div')
    // divElement will become visible once surface is mapped
    divElement.style.display = 'none'
    divElement.classList.add('entry')
    this._fadeOutAndDetachEntryOnDestroy(mainView, divElement)

    const desktopUserShellSurface = new DesktopUserShellSurface(mainView, divElement, seat)
    desktopUserShellSurface._activateOnPointerButton()

    divElement.addEventListener('mousedown', () => {
      desktopUserShellSurface._activeCallback()
    })
    // destroy the mainView if the shell-surface is destroyed
    surface.resource.onDestroy().then(() => {
      desktopUserShellSurface.destroy()
    })

    DesktopUserShellSurface.desktopUserShellSurfaces.push(desktopUserShellSurface)

    seat.addKeyboardResourceListener((wlKeyboardResource) => {
      if (desktopUserShellSurface.mainView.surface.resource.client === wlKeyboardResource.client) {
        desktopUserShellSurface.wlKeyboardResource = wlKeyboardResource
      }
    })
    seat.keyboard.resources.forEach((wlKeyboardResource) => {
      if (desktopUserShellSurface.mainView.surface.resource.client === wlKeyboardResource.client) {
        desktopUserShellSurface.wlKeyboardResource = wlKeyboardResource
      }
    })

    return desktopUserShellSurface
  }

  /**
   * @param {View}view
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
   * @param {View}view
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
   * @param {View}mainView
   * @param {HTMLDivElement}divElement
   * @param {Seat}seat
   * @private
   */
  constructor (mainView, divElement, seat) {
    super()
    /**
     * @type {View}
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
     * @type {WlKeyboardResource|null}
     * @private
     */
    this._wlKeyboardResource = null
    /**
     * @type {boolean}
     */
    this.active = false
    /**
     * @type {Seat}
     * @private
     */
    this._seat = seat
  }

  /**
   * @private
   */
  _activateOnPointerButton () {
    this._seat.pointer.onButtonPress().then(() => {
      if (this.mainView.destroyed) {
        return
      }

      if (!this.active &&
        this._seat.pointer.focus &&
        this._seat.pointer.focus.surface === this.mainView.surface) {
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

      if (this._wlKeyboardResource) {
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
   * @param {WlKeyboardResource}wlKeyboardResource
   */
  set wlKeyboardResource (wlKeyboardResource) {
    if (this.mainView.destroyed) {
      return
    }

    if (this.active && this._wlKeyboardResource && this._wlKeyboardResource.implementation.focus !== this.mainView.surface) {
      this._giveKeyboardFocus()
    }
    this._wlKeyboardResource = wlKeyboardResource
    this._wlKeyboardResource.onDestroy().then(() => {
      this._wlKeyboardResource = null
    })
  }

  /**
   * @private
   */
  _giveKeyboardFocus () {
    const keyboard = /** @typ{Keyboard} */this._wlKeyboardResource.implementation
    keyboard.focusGained(this.mainView.surface)
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
   * @override
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

  /**
   * Indicates if the application is responding.
   * @param {boolean}unresponsive
   */
  set unresponsive (unresponsive) {
    // TODO
  }
}

/**
 * @type {Array<DesktopUserShellSurface>}
 */
DesktopUserShellSurface.desktopUserShellSurfaces = []

export default DesktopUserShellSurface
