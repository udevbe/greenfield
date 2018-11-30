'use strict'

const webRTC = require('wrtc')

const NativeCompositorSession = require('./NativeCompositorSession')

class RtcClient {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @returns {Promise<RtcClient>}
   */
  static create (appEndpointCompositorPair) {
    // TODO reject on error
    return new Promise((resolve) => {
      // TODO rtc peer connection options from config
      const pcConfig = {
        'iceServers': [
          { 'urls': ['stun:stun.l.google.com:19302'] },
          {
            'urls': ['turn:gftest.udev.be'],
            'credentialType': 'password',
            'username': 'greenfield',
            'credential': 'bluesky'
          }
        ]
      }
      const peerConnection = new webRTC.RTCPeerConnection(pcConfig)
      const rtcClient = new RtcClient(appEndpointCompositorPair, peerConnection)
      peerConnection.onicecandidate = evt => {
        const candidate = evt.candidate
        if (candidate !== null) {
          process.env.DEBUG && console.log(`[app-endpoint-${appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: sending local ice candidate: ${JSON.stringify(candidate)}.`)
          const appEndpointSessionId = appEndpointCompositorPair.appEndpointSessionId
          rtcClient._sendRTCSignal({
            object: 'rtcSocket',
            method: 'iceCandidate',
            args: {
              appEndpointSessionId,
              candidate
            }
          })
        }
      }
      peerConnection.onnegotiationneeded = () => {
        process.env.DEBUG && console.log(`[app-endpoint-${appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: negotiation needed.`)
        rtcClient._sendOffer()
      }

      // TODO properly figure out rtc peer connection lifecycle
      peerConnection.onconnectionstatechange = () => {
        switch (peerConnection.connectionState) {
          case 'disconnected':
            process.env.DEBUG && console.log(`[app-endpoint-${appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: state is disconnected.`)
            rtcClient.destroy()
            break
          case 'failed':
            process.env.DEBUG && console.log(`[app-endpoint-${appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: state is failed.`)
            rtcClient.destroy()
            break
          case 'closed':
            process.env.DEBUG && console.log(`[app-endpoint-${appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: state is closed.`)
            rtcClient.destroy()
            break
        }
      }
      process.env.DEBUG && console.log(`[app-endpoint-${appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: state is ${peerConnection.connectionState}.`)

      // TODO eagerly pre-create a data channel for faster client-browser communication.

      const nativeCompositorSession = NativeCompositorSession.create(rtcClient)
      rtcClient.onDestroy().then(() => nativeCompositorSession.destroy())

      resolve(rtcClient)
    })
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {RTCPeerConnection}peerConnection
   */
  constructor (appEndpointCompositorPair, peerConnection) {
    /**
     * @type {AppEndpointCompositorPair}
     */
    this.appEndpointCompositorPair = appEndpointCompositorPair
    /**
     * @type {RTCPeerConnection}
     */
    this.peerConnection = peerConnection
    /**
     * @type {function():void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise((resolve) => {
      this._destroyResolve = resolve
    })
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

  /**
   * @param {*}signal
   * @private
   */
  _sendRTCSignal (signal) {
    this.appEndpointCompositorPair.webSocket.send(JSON.stringify(signal))
  }

  async iceCandidate ({ candidate }) {
    process.env.DEBUG && console.log(`[app-endpoint-${this.appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: received remote ice candidate: ${JSON.stringify(candidate)}.`)
    await this.peerConnection.addIceCandidate(candidate)
  }

  async sdpOffer ({ offer }) {
    process.env.DEBUG && console.log(`[app-endpoint-${this.appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: received browser sdp offer: ${JSON.stringify(offer)}`)
    await this.peerConnection.setRemoteDescription(offer)
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)

    process.env.DEBUG && console.log(`[app-endpoint-${this.appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: sending local sdp answer: ${JSON.stringify(answer)}`)
    this._sendRTCSignal({
      object: 'rtcSocket',
      method: 'sdpReply',
      args: {
        appEndpointSessionId: this.appEndpointCompositorPair.appEndpointSessionId,
        reply: answer
      }
    })
  }

  async sdpReply ({ reply }) {
    process.env.DEBUG && console.log(`[app-endpoint-${this.appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: received browser sdp answer: ${JSON.stringify(reply)}`)
    await this.peerConnection.setRemoteDescription(reply)
  }

  async _sendOffer () {
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    process.env.DEBUG && console.log(`[app-endpoint-${this.appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection: sending local sdp offer: ${JSON.stringify(offer)}.`)
    this._sendRTCSignal({
      object: 'rtcSocket',
      method: 'sdpOffer',
      args: {
        appEndpointSessionId: this.appEndpointCompositorPair.appEndpointSessionId,
        offer
      }
    })
  }
}

module.exports = RtcClient
