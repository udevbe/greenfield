'use strict'

const ConnectionRTCPool = require('./ConnectionRTCPool')
const NativeCompositorSession = require('./NativeCompositorSession')

class ClientRTC {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @returns {Promise<ClientRTC>}
   */
  static async create (appEndpointCompositorPair) {
    const connectionRTC = await ConnectionRTCPool.get(appEndpointCompositorPair, appEndpointCompositorPair.compositorSessionId)
    connectionRTC.connect()
    // TODO eagerly pre-create a data channel for faster client-browser communication.

    const clientRTC = new ClientRTC(appEndpointCompositorPair, connectionRTC)
    const nativeCompositorSession = NativeCompositorSession.create(clientRTC)
    clientRTC.onDestroy().then(() => nativeCompositorSession.destroy())

    return clientRTC
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {ConnectionRTC}connectionRTC
   */
  constructor (appEndpointCompositorPair, connectionRTC) {
    /**
     * @type {AppEndpointCompositorPair}
     */
    this.appEndpointCompositorPair = appEndpointCompositorPair
    /**
     * @type {ConnectionRTC}
     */
    this.connectionRTC = connectionRTC
    /**
     * @type {function():void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise((resolve) => { this._destroyResolve = resolve })
  }

  /**
   * @param {string}remotePeerId
   */
  ['connect'] ({ remotePeerId }) {
    ConnectionRTCPool.get(this.appEndpointCompositorPair, remotePeerId)
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCIceCandidateInit | RTCIceCandidate}candidate
   * @return {Promise<void>}
   */
  async ['iceCandidate'] ({ remotePeerId, candidate }) {
    const connectionRTC = await ConnectionRTCPool.get(this.appEndpointCompositorPair, remotePeerId)
    await connectionRTC.iceCandidate(candidate)
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCSessionDescriptionInit}reply
   * @return {Promise<void>}
   */
  async ['sdpReply'] ({ remotePeerId, reply }) {
    const connectionRTC = await ConnectionRTCPool.get(this.appEndpointCompositorPair, remotePeerId)
    await connectionRTC.sdpReply(reply)
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCSessionDescriptionInit}offer
   * @return {Promise<void>}
   */
  async ['sdpOffer'] ({ remotePeerId, offer }) {
    const connectionRTC = await ConnectionRTCPool.get(this.appEndpointCompositorPair, remotePeerId)
    await connectionRTC.sdpOffer(offer)
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    this._destroyResolve()
  }
}

module.exports = ClientRTC
