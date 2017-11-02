'use strict'

export default class BrowserClientSession {
  static create (clientConnection) {
    return new BrowserClientSession(clientConnection)
  }

  constructor (clientConnection) {
    this._clientConnection = clientConnection
  }

  destroy (resource) {
    this._clientConnection.close()
    resource.destroy()
  }
}
