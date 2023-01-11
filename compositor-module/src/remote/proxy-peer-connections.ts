import ReconnectingWebSocket from 'reconnecting-websocket'
import { ClientConnectionListener } from '../index'
import { Client } from 'westfield-runtime-server'

type SignalingMessage =
  | {
      type: 'sdp'
      data: RTCSessionDescriptionInit
    }
  | {
      type: 'ice'
      data: RTCIceCandidateInit | null
    }

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === 'sdp' || messageObject.type === 'ice'
}

const proxyPeerConnections: Record<
  string,
  { peerConnection: RTCPeerConnection; clientConnectionListener: ClientConnectionListener }
> = {}

export function ensureProxyPeerConnection(compositorProxyURL: URL): {
  peerConnection: RTCPeerConnection
  isNew: boolean
  clientConnectionListener: ClientConnectionListener
} {
  const signalingPath = compositorProxyURL.pathname.endsWith('/') ? 'signaling' : '/signaling'
  const signalingURL = `${compositorProxyURL.protocol}//${compositorProxyURL.host}${compositorProxyURL.pathname}${signalingPath}?${compositorProxyURL.searchParams}`
  const peerConnectionEntry = proxyPeerConnections[signalingURL]
  if (peerConnectionEntry) {
    return {
      peerConnection: peerConnectionEntry.peerConnection,
      isNew: false,
      clientConnectionListener: peerConnectionEntry.clientConnectionListener,
    }
  }

  const signalingWebSocket = new ReconnectingWebSocket(signalingURL)
  signalingWebSocket.binaryType = 'arraybuffer'

  const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
  peerConnection.onconnectionstatechange = (ev) => {
    if (peerConnection.connectionState === 'closed') {
      signalingWebSocket.close()
      delete proxyPeerConnections[signalingURL]
    }
  }

  signalingWebSocket.onmessage = async (event) => {
    const messageObject = JSON.parse(textDecoder.decode(event.data as ArrayBuffer))
    if (isSignalingMessage(messageObject)) {
      if (messageObject.type === 'ice') {
        peerConnection.addIceCandidate(messageObject.data ?? undefined)
      } else if (messageObject.type === 'sdp' && messageObject.data.sdp) {
        await peerConnection.setRemoteDescription(messageObject.data)
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        const signalingMessage: SignalingMessage = {
          type: 'sdp',
          data: answer,
        }
        signalingWebSocket.send(textEncoder.encode(JSON.stringify(signalingMessage)))
      }
    }
  }

  peerConnection.onnegotiationneeded = async () => {
    const offer = await peerConnection.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false })
    await peerConnection.setLocalDescription(offer)
    const signalingMessage: SignalingMessage = {
      type: 'sdp',
      data: offer,
    }
    signalingWebSocket.send(textEncoder.encode(JSON.stringify(signalingMessage)))
  }

  peerConnection.onicecandidate = (ev) => {
    const signalingMessage: SignalingMessage = {
      type: 'ice',
      data: ev.candidate,
    }
    signalingWebSocket.send(textEncoder.encode(JSON.stringify(signalingMessage)))
  }

  peerConnection.oniceconnectionstatechange = (ev) => {
    switch (peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
        peerConnection.close()
        break
    }
  }

  const clientConnectionListener: ClientConnectionListener = {
    onClient(client: Client) {
      /*noop*/
    },
  }

  proxyPeerConnections[signalingURL] = {
    peerConnection,
    clientConnectionListener,
  }

  return { peerConnection, isNew: true, clientConnectionListener }
}
