'use strict'

const {Connection} = require('westfield-runtime-client')

const LocalClient = require('./LocalClient')

module.exports = class LocalClientSession {
  static create (localSession, resolve, wlClient, clientSessionProxy) {
    return new LocalClientSession(localSession, resolve, wlClient, clientSessionProxy)
  }

  constructor (localSession, resolve, wlClient, clientSessionProxy) {
    this._localSession = localSession
    this._resolve = resolve
    this._wlClient = wlClient
    this._proxy = clientSessionProxy
  }

  /**
   *
   * @param {Number} sessionId the new client session
   *
   * @since 1
   *
   */
  session (sessionId) {
    const wfcConnection = new Connection()
    this._localSession._setupWfcConnection(wfcConnection, sessionId)

    const localClient = LocalClient.create(wfcConnection, this._wlClient)
    this._wlClient._clientRegistryProxy = localClient.connection.createRegistry()
    localClient.onDestroy().then(() => {
      this._proxy.destroy()
    })
    this._resolve(localClient)
  }
}
