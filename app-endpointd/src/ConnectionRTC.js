'use strict'

const webRTC = require('wrtc')

// TODO datachannel creation listeners
class ConnectionRTC {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {Object}peerConnectionConfig
   * @param {string}remotePeerId
   * @return {Promise<ConnectionRTC>}
   */
  static async create (appEndpointCompositorPair, peerConnectionConfig, remotePeerId) {
    // TODO reject when no suitable ice candidates are found
    return new Promise((resolve, reject) => {
      const peerConnection = new webRTC.RTCPeerConnection(peerConnectionConfig)
      const connectionRTC = new ConnectionRTC(appEndpointCompositorPair, peerConnection, remotePeerId)

      peerConnection.onicecandidate = evt => {
        const candidate = evt.candidate
        if (candidate !== null) {
          process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: sending local ice candidate: ${JSON.stringify(candidate)}.`)
          const appEndpointSessionId = appEndpointCompositorPair.appEndpointSessionId
          connectionRTC._sendRTCSignal({
            object: 'connectionRTC',
            method: 'iceCandidate',
            args: {
              appEndpointSessionId,
              candidate
            }
          })
        }
      }
      peerConnection.onnegotiationneeded = () => {
        process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: negotiation needed.`)
        connectionRTC._sendOffer()
      }

      // TODO properly figure out rtc peer connection lifecycle
      peerConnection.onconnectionstatechange = () => {
        switch (peerConnection.connectionState) {
          case 'disconnected':
            process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: state is disconnected.`)
            connectionRTC.destroy()
            break
          case 'failed':
            process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: state is failed.`)
            connectionRTC.destroy()
            break
          case 'closed':
            process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: state is closed.`)
            connectionRTC.destroy()
            break
        }
      }
      resolve(connectionRTC)
    })
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {RTCPeerConnection}peerConnection
   * @param {string}remotePeerUUID
   */
  constructor (appEndpointCompositorPair, peerConnection, remotePeerUUID) {
    /**
     * @type {AppEndpointCompositorPair}
     */
    this.appEndpointCompositorPair = appEndpointCompositorPair
    /**
     * @type {RTCPeerConnection}
     */
    this.peerConnection = peerConnection
    /**
     * @type {string}
     */
    this.remotePeerUUID = remotePeerUUID
  }

  /**
   * @param {*}signal
   * @private
   */
  _sendRTCSignal (signal) {
    this.appEndpointCompositorPair.webSocket.send(JSON.stringify({
      target: `${this.remotePeerUUID}`,
      payload: signal
    }))
  }

  async iceCandidate ({ candidate }) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: received remote ice candidate: ${JSON.stringify(candidate)}.`)
    await this.peerConnection.addIceCandidate(candidate)
  }

  async sdpOffer ({ offer }) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: received browser sdp offer: ${JSON.stringify(offer)}.`)
    await this.peerConnection.setRemoteDescription(offer)
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)

    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: sending local sdp answer: ${JSON.stringify(answer)}.`)
    this._sendRTCSignal({
      object: 'connectionRTC',
      method: 'sdpReply',
      args: {
        appEndpointSessionId: this.appEndpointCompositorPair.appEndpointSessionId,
        reply: answer
      }
    })
  }

  async sdpReply ({ reply }) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: received browser sdp answer: ${JSON.stringify(reply)}.`)
    await this.peerConnection.setRemoteDescription(reply)
  }

  async _sendOffer () {
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: sending local sdp offer: ${JSON.stringify(offer)}.`)
    this._sendRTCSignal({
      object: 'connectionRTC',
      method: 'sdpOffer',
      args: {
        appEndpointSessionId: this.appEndpointCompositorPair.appEndpointSessionId,
        offer
      }
    })
  }
}

module.exports = ConnectionRTC
