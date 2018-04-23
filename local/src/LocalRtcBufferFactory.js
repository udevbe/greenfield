'use strict'

const rtc = require('./protocol/rtc-client-protocol')
const LocalRtcDcBuffer = require('./LocalRtcDcBuffer')

module.exports = class LocalRtcBufferFactory {
  /**
   *
   * @param {LocalClient} localClient
   * @param {LocalRtcPeerConnection} localRtcPeerConnection
   * @return {Promise<LocalRtcBufferFactory>}
   */
  static create (localClient, localRtcPeerConnection) {
    return new Promise((resolve) => {
      const registryProxy = localClient.connection.createRegistry()

      // FIXME listen for global removal
      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === rtc.RtcBufferFactory.name) {
          const rtcBufferFactoryProxy = registryProxy.bind(name, interface_, version)
          const localRtcBufferFactory = new LocalRtcBufferFactory(localClient, localRtcPeerConnection)
          rtcBufferFactoryProxy.listener = localRtcBufferFactory
          localRtcBufferFactory.rtcBufferFactoryProxy = rtcBufferFactoryProxy
          resolve(localRtcBufferFactory)
        }
      }
    })
  }

  /**
   * Use LocalRtcBufferFactory.create(..) instead.
   * @param {LocalClient} localClient
   * @param {LocalRtcPeerConnection} localRtcPeerConnection
   * @private
   */
  constructor (localClient, localRtcPeerConnection) {
    /**
     * @type {LocalClient}
     */
    this.localClient = localClient
    /**
     * @type {LocalRtcPeerConnection}
     */
    this.localRtcPeerConnection = localRtcPeerConnection
    /**
     * @type {RtcBufferFactory}
     */
    this.rtcBufferFactoryProxy = null // set in LocalRtcBufferFactory.create(..)
  }

  /**
   * @return {LocalRtcDcBuffer}
   */
  createLocalRtcDcBuffer () {
    const grBufferProxy = this.rtcBufferFactoryProxy.createBuffer()
    const localRtcBlobTransfer = this.localRtcPeerConnection.createBlobTransfer(false, 'arraybuffer')
    const rtcDcBufferProxy = this.rtcBufferFactoryProxy.createDcBuffer(localRtcBlobTransfer.proxy, grBufferProxy)
    const localRtcDcBuffer = LocalRtcDcBuffer.create(grBufferProxy, rtcDcBufferProxy, localRtcBlobTransfer)
    rtcDcBufferProxy.listener = localRtcDcBuffer

    return localRtcDcBuffer
  }
}
