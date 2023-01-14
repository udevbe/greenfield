import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import type { CompositorProxySession } from './CompositorProxySession'
import { DescriptionType } from 'node-datachannel'

type UserData = {
  searchParams: URLSearchParams
  compositorProxySession: CompositorProxySession
}

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

let openWs: WebSocket<UserData> | null = null
let sendBuffer: Uint8Array[] = []

function cachedSend(message: Uint8Array) {
  openWs?.send(message, true) ?? sendBuffer.push(message)
}

function flushCachedSends(openWs: WebSocket<UserData>) {
  if (sendBuffer.length === 0) {
    return
  }
  for (const message of sendBuffer) {
    openWs.send(message, true)
  }
  sendBuffer = []
}

export function webRTCSignaling(compositorProxySession: CompositorProxySession): WebSocketBehavior<UserData> {
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

function signalingOpen(ws: WebSocket<UserData>) {
  if (openWs !== null) {
    ws.close()
    return
  }

  const { searchParams, compositorProxySession } = ws.getUserData()
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

function signalingMessage(ws: WebSocket<UserData>, message: ArrayBuffer) {
  const messageData = textDecoder.decode(message)
  const messageObject = JSON.parse(messageData)
  if (isSignalingMessage(messageObject)) {
    if (messageObject.type === 'ice') {
      ws.getUserData().compositorProxySession.peerConnection.addRemoteCandidate(
        messageObject.data?.candidate ?? '',
        messageObject.data?.sdpMid ?? '',
      )
    } else if (messageObject.type === 'sdp' && messageObject.data.sdp) {
      ws.getUserData().compositorProxySession.peerConnection.setRemoteDescription(
        messageObject.data.sdp,
        messageObject.data.type,
      )
    }
  }
}

function signalingClose(ws: WebSocket<UserData>, code: number, message: ArrayBuffer) {
  openWs = null
}
