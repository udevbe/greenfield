'use strict'

/**
 * Conceptual webRTC server socket as webRTC doesn't have the notion of server/client model.
 * Clients (application endpoints) announce their desire to create a new RTC peer connection here.
 */
export default class RtcSocket {
  /**
   *
   * @param {Session}session
   * @returns {RtcSocket}
   */
  static create (session) {
    const rtcSocket = new RtcSocket(session)
    session.messageHandlers['rtcSocket'] = rtcSocket
    return rtcSocket
  }

  /**
   * @param {Session}session
   */
  constructor (session) {
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {Object.<string,RTCPeerConnection>}
     * @private
     */
    this._appEndpointConnections = {}
  }

  async connect (args) {
    const { appEndpointSessionId } = args

    if (this._appEndpointConnections[appEndpointSessionId]) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} already exists.`)
    }

    // TODO rtc connection options setup
    const peerConnection = new RTCPeerConnection()
    this._appEndpointConnections[appEndpointSessionId] = peerConnection
    peerConnection.ondatachannel = (event) => {
      this._onDataChannel(event.channel)
    }

    peerConnection.onnegotiationneeded = async () => {
      DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} negotiation needed.`)
      await this._sendOffer(appEndpointSessionId, peerConnection)
    }

    peerConnection.onicecandidate = evt => {
      const candidate = evt.candidate
      DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} sending local ice candidate: ${candidate}`)
      if (candidate !== null) {
        this._sendRTCSignal(appEndpointSessionId, {
          object: 'rtcClient',
          method: 'iceCandidate',
          args: { candidate }
        })
      }
    }
  }

  /**
   * @param {RTCDataChannel}dataChannel
   * @private
   */
  _onDataChannel (dataChannel) {
    dataChannel.onopen = () => {
      const client = this._session.display.createClient()

      dataChannel.onclose = () => client.close()
      dataChannel.onerror = () => client.close()
      dataChannel.onmessage = async (event) => {
        const arrayBuffer = /** @type {ArrayBuffer} */event.data
        // TODO extract file descriptors from received arrayBuffer
        await client.message({ buffer: arrayBuffer, fds: [] })
      }

      /**
       * @param {Array<{buffer: ArrayBuffer, fds: Array<number>}>}wireMessage
       */
      client.onFlush = (wireMessage) => {
        // TODO aggregate into chunks of 16kb array buffers & send over data channel
      }
    }
  }

  async _sendOffer (appEndpointSessionId, peerConnection) {
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    this._sendRTCSignal(appEndpointSessionId, {
      object: 'rtcClient',
      method: 'sdpOffer',
      args: { offer }
    })
  }

  /**
   * @param {string}appEndpointSessionId
   * @param {*}signal
   * @private
   */
  _sendRTCSignal (appEndpointSessionId, signal) {
    this._session.webSocket.send(JSON.stringify({
      object: 'signalingServer',
      method: 'rtcSignal',
      args: {
        appEndpointSessionId,
        signalMessage: JSON.stringify(signal)
      }
    }))
  }

  async iceCandidate (args) {
    const { appEndpointSessionId, candidate } = args

    const peerConnection = this._appEndpointConnections[appEndpointSessionId]
    if (!peerConnection) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} was not found.`)
    }

    await peerConnection.addIceCandidate(candidate)
  }

  async sdpReply (args) {
    const { appEndpointSessionId, reply } = args

    const peerConnection = this._appEndpointConnections[appEndpointSessionId]
    if (!peerConnection) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} was not found.`)
    }

    await peerConnection.setRemoteDescription(reply)
  }

  async sdpOffer (args) {
    const { appEndpointSessionId, offer } = args
    const peerConnection = this._appEndpointConnections[appEndpointSessionId]
    if (!peerConnection) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} was not found.`)
    }

    await peerConnection.setRemoteDescription(offer)
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    process.env.DEBUG && console.log(`WebRTC connection: sending browser sdp answer: ${answer}`)
    this._sendRTCSignal(appEndpointSessionId, {
      object: 'rtcClient',
      method: 'sdpReply',
      args: {
        reply: answer
      }
    })
  }
}
