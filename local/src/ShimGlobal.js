'use strict'

require('./protocol/greenfield-client-protocol')// needed to resolve greenfield globals
require('./protocol/xdg-shell-client-protocol')// needed to resolve xdg globals
const {Global} = require('wayland-server-bindings-runtime')
const util = require('util')

class ShimGlobal extends Global {
  /**
   * @param {WlDisplay}wlDisplay
   * @param {number}name
   * @param {string}interface_
   * @param {number}version
   * @param {LocalCompositorSession}localCompositorSession
   * @return {ShimGlobal}
   */
  static create (wlDisplay, name, interface_, version, localCompositorSession) {
    if (interface_.startsWith('Gr')) {
      return this._createGr(wlDisplay, name, interface_, version, localCompositorSession)
    } else if (interface_.startsWith('Xdg')) {
      return this._createXdg(wlDisplay, name, interface_, version, localCompositorSession)
    } else {
      throw new Error(`Can not handle global with name: ${interface_}. Expected global to start with 'Gr' or 'xdg'.`)
    }
  }

  /**
   * @param {WlDisplay}wlDisplay
   * @param {number}name
   * @param {string}interface_
   * @param {number}version
   * @param {LocalCompositorSession}localCompositorSession
   * @return {ShimGlobal}
   * @private
   */
  static _createGr (wlDisplay, name, interface_, version, localCompositorSession) {
    const wlGlobalClass = require(util.format('./protocol/wayland/%s', interface_.replace('Gr', 'Wl')))
    const localGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Local')))
    const shimGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Shim')))
    return new ShimGlobal(wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version, localCompositorSession)
  }

  /**
   * @param {WlDisplay}wlDisplay
   * @param {number}name
   * @param {string}interface_
   * @param {number}version
   * @param {LocalCompositorSession}localCompositorSession
   * @return {ShimGlobal}
   * @private
   */
  static _createXdg (wlDisplay, name, interface_, version, localCompositorSession) {
    const wlGlobalClass = require(util.format('./protocol/wayland/%s', interface_))
    const localGlobalClass = require(util.format('./%s', interface_.replace('Xdg', 'LocalXdg')))
    const shimGlobalClass = require(util.format('./%s', interface_.replace('Xdg', 'ShimXdg')))
    return new ShimGlobal(wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version, localCompositorSession)
  }

  /**
   * @param {WlDisplay}wlDisplay
   * @param {Class}wlGlobalClass
   * @param {Class}localGlobalClass
   * @param {Class}shimGlobalClass
   * @param {number}name
   * @param {string}interface_
   * @param {number}version
   * @param {LocalCompositorSession}localCompositorSession
   */
  constructor (wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version, localCompositorSession) {
    super(wlDisplay, wlGlobalClass.interface_, version)
    /**
     * @type {Class}
     * @private
     */
    this._wlGlobalClass = wlGlobalClass
    /**
     * @type {Class}
     * @private
     */
    this._localGlobalClass = localGlobalClass
    /**
     * @type {Class}
     * @private
     */
    this._shimGlobalClass = shimGlobalClass
    /**
     * @type {number}
     * @private
     */
    this._seatName = name
    /**
     * @type {string}
     * @private
     */
    this._interface_ = interface_
    /**
     * @type {LocalCompositorSession}
     * @private
     */
    this._localCompositorSession = localCompositorSession
  }

  /**
   * @param {WlClient}wlClient
   * @param {number}version
   * @param {number}id
   */
  bind (wlClient, version, id) {
    try {
      // find matching proxy based on wayland wlClient pointer address
      const clientRegistryProxy = wlClient._clientRegistryProxy
      const globalProxy = clientRegistryProxy.bind(this._seatName, this._interface_, version)

      const localGlobal = this._localGlobalClass.create()
      globalProxy.listener = localGlobal
      const shimGlobal = this._shimGlobalClass.create(globalProxy, this._localCompositorSession)

      localGlobal.resource = this._wlGlobalClass.create(wlClient, version, id, shimGlobal, null)
      globalProxy.onError = (code, message) => {
        localGlobal.resource.postError(code, message)
      }
    } catch (error) {
      console.error(JSON.stringify(this), error)
      process.exit(1)
    }
  }
}

module.exports = ShimGlobal
