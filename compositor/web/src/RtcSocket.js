'use strict'

import WlBufferResource from './protocol/WlBufferResource'
import Buffer from './Buffer'

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

  async connect ({ appEndpointSessionId }) {
    if (this._appEndpointConnections[appEndpointSessionId]) {
      console.error(`WebRTC connection: ${appEndpointSessionId} already exists. Ignoring.`)
      return
    }

    // TODO show to user available app-endpoints
    // TODO show to user status of app-endpoints (peer connection state)

    // TODO rtc connection options setup
    const peerConnection = new RTCPeerConnection()
    this._appEndpointConnections[appEndpointSessionId] = peerConnection
    peerConnection.ondatachannel = (event) => this._onDataChannel(event.channel)

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

    // TODO figure out what the lifecycle of a peer connection is in regards to it's connection state.
    peerConnection.onconnectionstatechange = (event) => {
      switch (peerConnection.connectionState) {
        case 'connected':
          DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} is open.`)
          break
        case 'disconnected':
          DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} is disconnected.`)
          break
        case 'failed':
          DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} failed.`)
          delete this._appEndpointConnections[appEndpointSessionId]
          break
        case 'closed':
          DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} closed.`)
          delete this._appEndpointConnections[appEndpointSessionId]
          break
      }
    }
  }

  /**
   * @param {RTCDataChannel}dataChannel
   * @private
   */
  _onDataChannel (dataChannel) {
    dataChannel.binaryType = 'arraybuffer'
    dataChannel.onopen = () => {
      const client = this._session.display.createClient()
      // send out-of-band resource destroy
      client.addResourceDestroyListener((resource) => dataChannel.send(new Uint32Array([1, 2, resource.id]).buffer))

      dataChannel.onclose = () => client.close()
      dataChannel.onerror = () => client.close()
      dataChannel.onmessage = (event) => {
        const arrayBuffer = /** @type {ArrayBuffer} */event.data
        const dataView = new DataView(arrayBuffer)
        const outOfBand = dataView.getUint32(0, true)
        if (!outOfBand) {
          const receiveBuffer = new Uint32Array(arrayBuffer, Uint32Array.BYTES_PER_ELEMENT)
          const fdsInCount = receiveBuffer[0]
          const fds = receiveBuffer.subarray(1, 1 + fdsInCount)
          const buffer = receiveBuffer.subarray(1 + fdsInCount)
          client.message({ buffer, fds })
        } else {
          client.outOfBandMessage(arrayBuffer)
        }
      }

      /**
       * @param {Array<{buffer: ArrayBuffer, fds: Array<number>}>}wireMessages
       */
      client.onFlush = (wireMessages) => {
        // convert to arraybuffer so it can be send over a data channel.
        const messagesSize = wireMessages.reduce((previousValue, currentValue) => {
          previousValue += Uint32Array.BYTES_PER_ELEMENT + (currentValue.fds * Uint32Array.BYTES_PER_ELEMENT) + currentValue.buffer.byteLength
          return previousValue
        }, 0)

        const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize + Uint32Array.BYTES_PER_ELEMENT))
        sendBuffer[0] = 0 // out-of-band opcode
        let offset = 1
        wireMessages.forEach(value => {
          const fds = Uint32Array.from(value.fds)
          const message = new Uint32Array(value.buffer)
          sendBuffer[offset++] = fds.length
          sendBuffer.set(fds, offset)
          offset += fds.length
          sendBuffer.set(message, offset)
          offset += message.length
        })
        dataChannel.send(sendBuffer.buffer)
      }

      client.setOutOfBandListener(1, 0, (message) => {
        const wlBufferResource = new WlBufferResource(client, new Uint32Array(message)[2], 1)
        wlBufferResource.implementation = Buffer.create(wlBufferResource)
      })
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

  async iceCandidate ({ appEndpointSessionId, candidate }) {
    const peerConnection = this._appEndpointConnections[appEndpointSessionId]
    if (!peerConnection) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} was not found.`)
    }

    await peerConnection.addIceCandidate(candidate)
  }

  async sdpReply ({ appEndpointSessionId, reply }) {
    const peerConnection = this._appEndpointConnections[appEndpointSessionId]
    if (!peerConnection) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} was not found.`)
    }

    await peerConnection.setRemoteDescription(reply)
  }

  async sdpOffer ({ appEndpointSessionId, offer }) {
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
