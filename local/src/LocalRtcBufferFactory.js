'use strict'

const rtc = require('./protocol/rtc-client-protocol')
const LocalRtcPeerConnection = require('./LocalRtcPeerConnection')
const LocalRtcDcBuffer = require('./LocalRtcDcBuffer')

module.exports = class LocalRtcBufferFactory {
  /**
   *
   * @param {LocalClient} localClient
   * @return {Promise<LocalClient, LocalRtcBufferFactory>}
   */
  static create (localClient) {
    return new Promise((resolve) => {
      const registryProxy = localClient.connection.createRegistry()
      const localRtcBufferFactory = new LocalRtcBufferFactory()

      // FIXME listen for global removal
      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === rtc.RtcPeerConnection.name) {
          localRtcBufferFactory.localRtcPeerConnection = LocalRtcPeerConnection.create(registryProxy.bind(name, interface_, version))
        } else if (interface_ === rtc.RtcBufferFactory.name) {
          const rtcBufferFactoryProxy = registryProxy.bind(name, interface_, version)
          rtcBufferFactoryProxy.listener = localRtcBufferFactory
          localRtcBufferFactory.rtcBufferFactoryProxy = rtcBufferFactoryProxy
        }

        if (localRtcBufferFactory.localRtcPeerConnection && localRtcBufferFactory.rtcBufferFactoryProxy) {
          resolve(localRtcBufferFactory)
        }
      }
    })
  }

  /**
   * Use LocalRtcBufferFactory.create(..) instead.
   * @private
   */
  constructor () {
    this.localRtcPeerConnection = null
    this.rtcBufferFactoryProxy = null
    this._nextChannelId = 1
  }

  /**
   *
   * @return {LocalRtcDcBuffer}
   */
  createLocalRtcDcBuffer () {
    const grBufferProxy = this.rtcBufferFactoryProxy.createBuffer()
    const channelId = this._nextChannelId++
    const rtcDcBufferProxy = this.rtcBufferFactoryProxy.createDcBuffer(channelId, this.localRtcPeerConnection.rtcPeerConnectionProxy, grBufferProxy)
    const dataChannel = this.localRtcPeerConnection.peerConnection.createDataChannel(null, {
      ordered: false,
      maxRetransmits: 0,
      negotiated: true,
      id: channelId
    })

    const localRtcDcBuffer = LocalRtcDcBuffer.create(grBufferProxy, rtcDcBufferProxy, dataChannel)
    rtcDcBufferProxy.listener = localRtcDcBuffer

    return localRtcDcBuffer
  }
}
