'use strict'

require('./protocol/greenfield-client-protocol')
const {Global, Client} = require('wayland-server-bindings-runtime')
const NULL = require('fastcall').ref.NULL_POINTER
const util = require('util')

module.exports = class ShimGlobal extends Global {
  static create (wlDisplay, name, interface_, version) {
    const wlGlobalClass = require(util.format('./protocol/wayland/%s', interface_.replace('Gr', 'Wl')))
    const localGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Local')))
    const shimGlobalClass = require(util.format('./%s', interface_.replace('Gr', 'Shim')))
    return new ShimGlobal(wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version)
  }

  constructor (wlDisplay, wlGlobalClass, localGlobalClass, shimGlobalClass, name, interface_, version) {
    super(wlDisplay, wlGlobalClass.interface_, version, NULL, (client, data, version, id) => { this.bind(client, version, id) })
    this._wlGlobalClass = wlGlobalClass
    this._localGlobalClass = localGlobalClass
    this._shimGlobalClass = shimGlobalClass
    this._name = name
    this._interface_ = interface_
    this._version = version
    this._clientRegistryProxies = {}
  }

  bind (wlClientPtr, version, id) {
    try {
      // find matching proxy based on wayland wlClientPtr
      const clientRegistryProxy = this._clientRegistryProxies[wlClientPtr.address()]
      const globalProxy = clientRegistryProxy.bind(this._name, this._interface_, this._version)

      const localGlobal = this._localGlobalClass.create()
      globalProxy.listener = localGlobal
      const shimGlobal = this._shimGlobalClass.create(globalProxy)

      localGlobal.resource = this._wlGlobalClass.create(new Client(wlClientPtr), version, id, shimGlobal, null)
    } catch (error) {
      console.log(error)
    }
  }

  announceClient (wlClient, clientRegistryProxy) {
    this._clientRegistryProxies[wlClient.ptr.address()] = clientRegistryProxy
  }
}
