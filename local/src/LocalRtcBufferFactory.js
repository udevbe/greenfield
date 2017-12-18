'use strict'

const rtc = require('./protocol/rtc-client-protocol')
const LocalRtcDcBuffer = require('./LocalRtcDcBuffer')

module.exports = class LocalRtcBufferFactory {
  /**
   *
   * @param {LocalClient} localClient
   * @return {Promise<LocalRtcBufferFactory>}
   */
  static create (localClient) {
    return new Promise((resolve) => {
      const registryProxy = localClient.connection.createRegistry()

      // FIXME listen for global removal
      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === rtc.RtcBufferFactory.name) {
          const rtcBufferFactoryProxy = registryProxy.bind(name, interface_, version)
          const localRtcBufferFactory = new LocalRtcBufferFactory()
          rtcBufferFactoryProxy.listener = localRtcBufferFactory
          localRtcBufferFactory.rtcBufferFactoryProxy = rtcBufferFactoryProxy
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
    this.rtcBufferFactoryProxy = null
  }

  /**
   * @param  {LocalRtcPeerConnection}localRtcPeerConnection
   * @return {LocalRtcDcBuffer}
   */
  createLocalRtcDcBuffer (localRtcPeerConnection) {
    const grBufferProxy = this.rtcBufferFactoryProxy.createBuffer()
    const localRtcBlobTransfer = localRtcPeerConnection.createBlobTransfer(false)
    const rtcDcBufferProxy = this.rtcBufferFactoryProxy.createDcBuffer(localRtcBlobTransfer.proxy, grBufferProxy)
    const localRtcDcBuffer = LocalRtcDcBuffer.create(grBufferProxy, rtcDcBufferProxy)
    rtcDcBufferProxy.listener = localRtcDcBuffer

    return localRtcDcBuffer
  }
}
