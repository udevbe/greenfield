'use strict'

export default class BrowserClientSession {
  /**
   * @param {!Client}clientConnection
   * @return {BrowserClientSession}
   */
  static create (clientConnection) {
    return new BrowserClientSession(clientConnection)
  }

  /**
   * @param {!Client}clientConnection
   */
  constructor (clientConnection) {
    /**
     * @type {!Client}
     * @const
     * @private
     */
    this._clientConnection = clientConnection
  }

  /**
   * @param {GrClientSession}resource
   */
  destroy (resource) {
    this._clientConnection.close()
    resource.destroy()
  }
}
