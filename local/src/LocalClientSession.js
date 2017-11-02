'use strict'

const westfield = require('westfield-runtime-client')

const LocalClient = require('./LocalClient')

module.exports = class LocalClientSession {
  static create (localSession, resolve, wlClient) {
    return new LocalClientSession(localSession, resolve, wlClient)
  }

  constructor (localSession, resolve, wlClient) {
    this._localSession = localSession
    this._resolve = resolve
    this._wlClient = wlClient
  }

  /**
   *
   * @param {Number} sessionId the new client session
   *
   * @since 1
   *
   */
  session (sessionId) {
    const wfcConnection = new westfield.Connection()
    this._localSession._connections[sessionId] = wfcConnection
    this._localSession._setupWfcConnection(wfcConnection, sessionId)

    const localClient = LocalClient.create(wfcConnection, this._wlClient)
    this._wlClient._clientRegistryProxy = localClient.connection.createRegistry()
    this._resolve(localClient)
  }
}
