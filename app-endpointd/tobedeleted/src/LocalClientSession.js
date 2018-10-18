'use strict'


class LocalClientSession {
  /**
   * @param {wfc.GrClientSession}clientSessionProxy
   * @param {wfc.Connection}connection
   * @return {LocalClientSession}
   */
  static create (clientSessionProxy, connection) {
    const clientRegistryProxy = connection.createRegistry()
    return new LocalClientSession(clientSessionProxy, connection, clientRegistryProxy)
  }

  /**
   * @param {wfc.GrClientSession}clientSessionProxy
   * @param {wfc.Connection}connection
   * @param {wfc.Registry}clientRegistryProxy
   */
  constructor (clientSessionProxy, connection, clientRegistryProxy) {
    /**
     * @type {wfc.GrClientSession}
     */
    this.proxy = clientSessionProxy
    /**
     * @type {wfc.Connection}
     */
    this.connection = connection
    /**
     * @type {wfc.Registry}
     */
    this.clientRegistryProxy = clientRegistryProxy
    /**
     * @type {LocalRtcBufferFactory}
     */
    this.localRtcBufferFactory = null
    /**
     * @type {LocalRtcPeerConnection}
     */
    this.localRtcPeerConnection = null
  }
}

module.exports = LocalClientSession
