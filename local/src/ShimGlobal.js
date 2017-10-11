'use strict'

require('./protocol/greenfield-client-protocol')
const {Global} = require('wayland-server-bindings-runtime')
const util = require('util')

class ShimGlobal extends Global {
  static create (wlDisplay, name, interface_, version) {
    const wlGlobalClass = require(util.format('./protocol/wayland/%s', interface_.replace('Gr', 'Wl')))
    const localGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Local')))
    const shimGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Shim')))
    return new ShimGlobal(wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version)
  }

  constructor (wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version) {
    super(wlDisplay, wlGlobalClass.interface_, version)
    this._wlGlobalClass = wlGlobalClass
    this._localGlobalClass = localGlobalClass
    this._shimGlobalClass = shimGlobalClass
    this._name = name
    this._interface_ = interface_
    this._version = version
  }

  bind (wlClient, version, id) {
    try {
      // find matching proxy based on wayland wlClient pointer address
      const clientRegistryProxy = wlClient._clientRegistryProxy
      const globalProxy = clientRegistryProxy.bind(this._name, this._interface_, this._version)

      const localGlobal = this._localGlobalClass.create()
      globalProxy.listener = localGlobal
      const shimGlobal = this._shimGlobalClass.create(globalProxy)

      localGlobal.resource = this._wlGlobalClass.create(wlClient, version, id, shimGlobal, null)
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
}

module.exports = ShimGlobal
