'use strict'

class LocalClientSession {

  /**
   * @param {wfc.GrClientSession}clientSessionProxy
   * @param {wfc.Connection}connection
   * @return {LocalClientSession}
   */
  static create (clientSessionProxy, connection) {
    return new LocalClientSession(clientSessionProxy, connection)
  }

  /**
   * @param {wfc.GrClientSession}clientSessionProxy
   * @param {wfc.Connection}connection
   */
  constructor (clientSessionProxy, connection) {
    /**
     * @type {wfc.GrClientSession}
     */
    this.proxy = clientSessionProxy
    /**
     * @type {wfc.Connection}
     */
    this.connection = connection
  }
}

module.exports = LocalClientSession
