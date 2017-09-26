'use strict'

const {Global, Client} = require('wayland-server-bindings-runtime')
const util = require('util')

module.exports = class ShimGlobal extends Global {
  static create (wlDisplay, name, interface_, version) {
    const wlGlobalClass = require(util.format('./protocol/wayland/%s', interface_.replace('Gr', 'Wl')))
    const localGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Local')))
    const shimGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Shim')))
    return new ShimGlobal(wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version)
  }

  constructor (wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version) {
    super(wlDisplay, wlGlobalClass.interface_, version, null, (client, data, version, id) => { this.bind(client, data, version, id) })
    this._wlGlobalClass = wlGlobalClass
    this._localGlobalClass = localGlobalClass
    this._shimGlobalClass = shimGlobalClass
    this._name = name
    this._interface_ = interface_
    this._version = version
    this._clientRegistryProxies = {}
  }

  bind (wlClient, data, version, id) {
    // find matching proxy based on wayland wlClient
    const clientRegistryProxy = this._clientRegistryProxies[wlClient.ptr.address()]
    const globalProxy = clientRegistryProxy.bind(this._name, this._interface_, this._version)

    const localGlobal = this._localGlobalClass.create()
    globalProxy.listener = localGlobal
    const shimGlobal = this._shimGlobalClass.create(globalProxy)

    localGlobal.resource = this._wlGlobalClass.create(new Client(wlClient), version, id, shimGlobal, null)
  }

  announceClient (wlClient, clientRegistryProxy) {
    this._clientRegistryProxies[wlClient.ptr.address()] = clientRegistryProxy
  }
}
