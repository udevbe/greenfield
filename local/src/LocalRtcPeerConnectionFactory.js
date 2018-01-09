const rtc = require('./protocol/rtc-client-protocol')

const LocalRtcPeerConnection = require('./LocalRtcPeerConnection')

module.exports = class LocalRtcPeerConnectionFactory {
  /**
   * @param {LocalClient}localClient
   * @return {Promise<LocalRtcPeerConnectionFactory>}
   */
  static create (localClient) {
    return new Promise((resolve) => {
      const registryProxy = localClient.connection.createRegistry()

      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === rtc.RtcPeerConnectionFactory.name) {
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
   * @param proxy
   */
  constructor (localClient, proxy) {
    this.localClient = localClient
    this.proxy = proxy
  }

  createRtcPeerConnection () {
    const rtcPeerConnectionProxy = this.proxy.createRtcPeerConnection()
    return LocalRtcPeerConnection.create(rtcPeerConnectionProxy)
  }
}
