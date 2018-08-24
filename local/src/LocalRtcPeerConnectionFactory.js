const {RtcPeerConnectionFactory} = require('./protocol/rtc-client-protocol')

const LocalRtcPeerConnection = require('./LocalRtcPeerConnection')

// Wayland Global
class LocalRtcPeerConnectionFactory {
  /**
   * @param {LocalClient}localClient
   * @return {Promise<LocalRtcPeerConnectionFactory>}
   */
  static create (localClient) {
    return new Promise((resolve) => {
      const registryProxy = localClient.connection.createRegistry()

      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === RtcPeerConnectionFactory.name) {
          const rtcPeerConnectionFactoryProxy = registryProxy.bind(name, interface_, version)
          const localRtcPeerConnectionFactory = new LocalRtcPeerConnectionFactory(localClient, rtcPeerConnectionFactoryProxy)
          rtcPeerConnectionFactoryProxy.listener = localRtcPeerConnectionFactory
          resolve(localRtcPeerConnectionFactory)
        }
      }
    })
  }

  /**
   * Use LocalRtcPeerConnectionFactory.create(...)
   * @private
   * @param {LocalClient}localClient
   * @param {RtcPeerConnectionFactory}proxy
   */
  constructor (localClient, proxy) {
    /**
     * @type {LocalClient}
     */
    this.localClient = localClient
    /**
     * @type {RtcPeerConnectionFactory}
     */
    this.proxy = proxy
  }

  /**
   * @return {LocalRtcPeerConnection}
   */
  createRtcPeerConnection () {
    const rtcPeerConnectionProxy = this.proxy.createRtcPeerConnection()
    return LocalRtcPeerConnection.create(rtcPeerConnectionProxy)
  }
}

module.exports = LocalRtcPeerConnectionFactory
