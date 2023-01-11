import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import type { CompositorProxySession } from './CompositorProxySession'
import type { PeerConnection } from 'node-datachannel'
import { DescriptionType } from 'node-datachannel'

interface RTCSessionDescriptionInit {
  sdp?: string
  type: DescriptionType
}

interface RTCIceCandidateInit {
  candidate?: string
  sdpMLineIndex?: number | null
  sdpMid?: string | null
  usernameFragment?: string | null
}

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

let openWs: WebSocket | null = null
let sendBuffer: Uint8Array[] = []

function cachedSend(message: Uint8Array) {
  openWs?.send(message, true) ?? sendBuffer.push(message)
}

function flushCachedSends(openWs: WebSocket) {
  if (sendBuffer.length === 0) {
    return
  }
  for (const message of sendBuffer) {
    openWs.send(message, true)
  }
  sendBuffer = []
}

export function webRTCSignaling(compositorProxySession: CompositorProxySession): WebSocketBehavior {
  compositorProxySession.peerConnection.onLocalDescription((sdp: string, type: DescriptionType) => {
    const localDescription: RTCSessionDescriptionInit = { type, sdp }
    const signalingMessage: SignalingMessage = {
      type: 'sdp',
      data: localDescription,
    }
    cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
  })
  compositorProxySession.peerConnection.onLocalCandidate((candidate: string, mid: string) => {
    const localCandidate: RTCIceCandidateInit = { candidate, sdpMid: mid }
    const signalingMessage: SignalingMessage = {
      type: 'ice',
      data: localCandidate,
    }
    cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
  })

  compositorProxySession.peerConnection.onStateChange((state) => {
    // 'connecting', 'connected', 'disconnected', 'closed'
    console.log(`peer connection state changed to ${state}`)
  })

  compositorProxySession.peerConnection.onGatheringStateChange((state) => {
    if (state === 'Complete') {
      const signalingMessage: SignalingMessage = {
        type: 'ice',
        data: null,
      }
      cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
    }
  })

  compositorProxySession.peerConnection.setLocalDescription(DescriptionType.Offer)

  return {
    sendPingsAutomatically: true,
    upgrade: (res, req, context) => {
      /* This immediately calls open handler, you must not use res after this call */
      res.upgrade(
        {
          searchParams: new URLSearchParams(req.getQuery()),
          compositorProxySession,
        },
        /* Spell these correctly */
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context,
      )
    },
    open: signalingOpen,
    message: signalingMessage,
    close: signalingClose,
  }
}

function signalingOpen(ws: WebSocket) {
  if (openWs !== null) {
    ws.close()
    return
  }

  const searchParams: URLSearchParams = ws.searchParams
  const compositorProxySession: CompositorProxySession = ws.compositorProxySession
  if (searchParams.get('compositorSessionId') !== compositorProxySession.compositorSessionId) {
    const message = 'Bad or missing compositorSessionId query parameter.'
    ws.end(4403, message)
    return
  }

  openWs = ws
  flushCachedSends(ws)
}

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === 'sdp' || messageObject.type === 'ice'
}

function signalingMessage(ws: WebSocket, message: ArrayBuffer) {
  const messageData = textDecoder.decode(message)
  const messageObject = JSON.parse(messageData)
  if (isSignalingMessage(messageObject)) {
    if (messageObject.type === 'ice') {
      const peerConnection: PeerConnection = ws.compositorProxySession.peerConnection
      peerConnection.addRemoteCandidate(messageObject.data?.candidate ?? '', messageObject.data?.sdpMid ?? '')
    } else if (messageObject.type === 'sdp' && messageObject.data.sdp) {
      const peerConnection: PeerConnection = ws.compositorProxySession.peerConnection
      peerConnection.setRemoteDescription(messageObject.data.sdp, messageObject.data.type)
    }
  }
}

function signalingClose(ws: WebSocket, code: number, message: ArrayBuffer) {
  openWs = null
}
