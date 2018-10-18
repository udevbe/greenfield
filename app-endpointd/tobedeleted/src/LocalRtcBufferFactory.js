'use strict'

const {RtcBufferFactory} = require('./protocol/rtc-client-protocol')
const LocalRtcDcBuffer = require('./LocalRtcDcBuffer')

// Wayland Global
class LocalRtcBufferFactory {
  /**
   *
   * @param {wfc.Connection} connection
   * @param {LocalRtcPeerConnection} localRtcPeerConnection
   * @return {Promise<LocalRtcBufferFactory>}
   */
  static create (connection, localRtcPeerConnection) {
    return new Promise((resolve) => {
      const registryProxy = connection.createRegistry()

      // FIXME listen for global removal
      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === RtcBufferFactory.name) {
          const rtcBufferFactoryProxy = registryProxy.bind(name, interface_, version)
          const localRtcBufferFactory = new LocalRtcBufferFactory(localRtcPeerConnection)
          rtcBufferFactoryProxy.listener = localRtcBufferFactory
          localRtcBufferFactory.rtcBufferFactoryProxy = rtcBufferFactoryProxy
          resolve(localRtcBufferFactory)
        }
      }
    })
  }

  /**
   * Use LocalRtcBufferFactory.create(..) instead.
   * @param {LocalRtcPeerConnection} localRtcPeerConnection
   * @private
   */
  constructor (localRtcPeerConnection) {
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

module.exports = LocalRtcBufferFactory
