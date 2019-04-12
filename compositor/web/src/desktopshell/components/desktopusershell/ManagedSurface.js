// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

/**
 * @implements UserShellSurface
 */
class ManagedSurface {
  /**
   * @param {Surface}surface
   */
  constructor (surface) {
    this.surface = surface
    this.view = surface.createView()

    /**
     * @type {Array<function(string):void>}
     */
    this.onTitle = []
    /**
     * @type {Array<function(string):void>}
     */
    this.onAppId = []
    /**
     * @type {Array<function(boolean):void>}
     */
    this.onMapped = []
    /**
     * @type {Array<function(boolean):void>}
     */
    this.onUnresponsive = []
    /**
     * @type {Array<function():void>}
     */
    this.onActivation = []
    /**
     * @type {Array<function():void>}
     */
    this.onMinimize = []

    /**
     * @type {function():void|null}
     */
    this.requestActivation = null
    /**
     * @type {function():void|null}
     */
    this.deactivate = null

    /**
     * @type {string}
     * @private
     */
    this._title = ''
    /**
     * @type {string}
     * @private
     */
    this._appId = ''
    /**
     * @type {boolean}
     * @private
     */
    this._mapped = false

    /**
     * @type {WlKeyboardResource|null}
     */
    this.wlKeyboardResource = null
  }

  giveKeyboardFocus () {
    if (this.wlKeyboardResource && this.wlKeyboardResource.implementation.focus !== this.view.surface) {
      const keyboard = /** @typ{Keyboard} */this.wlKeyboardResource.implementation
      keyboard.focusGained(this.surface)
    }
  }

  /**
   * The title of the surface
   * @param {string} title
   */
  set title (title) {
    this.onTitle.forEach(f => f(title))
    this._title = title
  }

  /**
   * @return {string}
   */
  get title () {
    return this._title
  }

  /**
   * The id of the application. Can be used to group surfaces.
   * @param {string}appId
   */
  set appId (appId) {
    this.onAppId.forEach(f => f(appId))
    this._appId = appId
  }

  /**
   * @return {string}
   */
  get appId () {
    return this._appId
  }

  /**
   * Indicates if the surface contents can be displayed on screen.
   * @param {boolean}mapped
   */
  set mapped (mapped) {
    this.onMapped.forEach(f => f(mapped))
    this._mapped = mapped
  }

  /**
   * @return {boolean}
   */
  get mapped () {
    return this._mapped
  }

  /**
   * Indicates if the application is responding.
   * @param {boolean}unresponsive
   */
  set unresponsive (unresponsive) {
    this.onUnresponsive.forEach(f => f(unresponsive))
    this._unresponsive = unresponsive
  }

  /**
   * @return {boolean}
   */
  get unresponsive () {
    return this._unresponsive
  }

  /**
   * Registers a callback that will be fired when the user shell wants to make a surface active (ie give it input)
   * @param {function():void}activeCallback
   */
  set onActivationRequest (activeCallback) {
    this.requestActivation = activeCallback
  }

  /**
   * Registers callback that notifies if a surface is no longer active (ie no longer receives input)
   * @param {function():void}inactiveCallback
   */
  set onInactive (inactiveCallback) {
    this.deactivate = inactiveCallback
  }

  /**
   * Confirms that the user shell can give the surface input.
   */
  activation () {
    this.onActivation.forEach(f => f())
  }

  /**
   * Notifies the user shell that the surface should no longer be displayed. If the surface is still mapped then the
   * surface contents can still be displayed ie in a live updating tile.
   */
  minimize () {
    this.onMinimize.forEach(f => f())
  }
}

export default ManagedSurface
