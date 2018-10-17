const {RtcPeerConnectionFactory} = require('./protocol/rtc-client-protocol')

const LocalRtcPeerConnection = require('./LocalRtcPeerConnection')

// Wayland Global
class LocalRtcPeerConnectionFactory {
  /**
   * @param {wfc.Connection}connection
   * @return {Promise<LocalRtcPeerConnectionFactory>}
   */
  static create (connection) {
    return new Promise((resolve) => {
      const registryProxy = connection.createRegistry()

      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === RtcPeerConnectionFactory.name) {
          const rtcPeerConnectionFactoryProxy = registryProxy.bind(name, interface_, version)
          const localRtcPeerConnectionFactory = new LocalRtcPeerConnectionFactory(rtcPeerConnectionFactoryProxy)
          rtcPeerConnectionFactoryProxy.listener = localRtcPeerConnectionFactory
          resolve(localRtcPeerConnectionFactory)
        }
      }
    })
  }

  /**
   * Use LocalRtcPeerConnectionFactory.create(...)
   * @private
   * @param {RtcPeerConnectionFactory}proxy
   */
  constructor (proxy) {
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
