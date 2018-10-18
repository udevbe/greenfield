'use strict'

export default class ClientSession {
  /**
   * @param {!Client}clientConnection
   * @return {ClientSession}
   */
  static create (clientConnection) {
    return new ClientSession(clientConnection)
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
   * @param {GrClientSessionResource}resource
   */
  destroy (resource) {
    this._clientConnection.close()
    resource.destroy()
  }
}
