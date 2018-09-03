'use strict'

export default class BrowserClientSession {
  /**
   * @param {!wfs.Client}clientConnection
   * @return {BrowserClientSession}
   */
  static create (clientConnection) {
    return new BrowserClientSession(clientConnection)
  }

  /**
   * @param {!wfs.Client}clientConnection
   */
  constructor (clientConnection) {
    /**
     * @type {!wfs.Client}
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
