import { createLogger } from './Logger'
import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import type { CompositorProxySession } from './CompositorProxySession'
import { DescriptionType, preload } from 'node-datachannel'
import crypto from 'crypto'

preload()
const logger = createLogger('compositor-proxy-signaling')

type UserData = {
  searchParams: URLSearchParams
  compositorProxySession: CompositorProxySession
}

interface RTCSessionDescriptionInit {
  sdp?: string
  type: DescriptionType
}

interface RTCIceCandidate {
  candidate?: string
  sdpMLineIndex?: number | null
  sdpMid?: string | null
  usernameFragment?: string | null
}

type SignalingMessage =
  | {
      type: 'sdp'
      data: RTCSessionDescriptionInit | null
      identity: string
    }
  | {
      type: 'ice'
      data: RTCIceCandidate | null
      identity: string
    }
  | {
      type: 'identity'
      data: string
    }

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

let openWs: WebSocket<UserData> | null = null
const identity = crypto.randomBytes(8).toString('hex')
const peerIdentity: SignalingMessage = {
  type: 'identity',
  data: identity,
}
const peerIdentityMessage = textEncoder.encode(JSON.stringify(peerIdentity))
let compositorPeerIdentity: string | undefined

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
  logger.info(`Listening for signaling connections using identity: ${peerIdentity.data}`)
  const handleLocalDescription = (sdp: string, type: DescriptionType) => {
    const localDescription: RTCSessionDescriptionInit = { type, sdp }
    const signalingMessage: SignalingMessage = {
      type: 'sdp',
      data: localDescription,
      identity,
    }
    cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
  }
  const handleIceCandidate = (candidate: string, mid: string) => {
    const localCandidate: RTCIceCandidate = { candidate, sdpMid: mid }
    const signalingMessage: SignalingMessage = {
      type: 'ice',
      data: localCandidate,
      identity,
    }
    cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
  }

  compositorProxySession.peerConnectionState.peerConnection.onLocalDescription(handleLocalDescription)
  compositorProxySession.peerConnectionState.peerConnection.onLocalCandidate(handleIceCandidate)

  compositorProxySession.peerConnectionState.peerConnectionResetListeners.push((newPeerConnection) => {
    newPeerConnection.onLocalDescription(handleLocalDescription)
    newPeerConnection.onLocalCandidate(handleIceCandidate)
  })

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
    open: (ws: WebSocket<UserData>) => {
      if (openWs !== null) {
        ws.close()
        return
      }

      const { searchParams } = ws.getUserData()
      if (searchParams.get('compositorSessionId') !== compositorProxySession.compositorSessionId) {
        const message = 'Bad or missing compositorSessionId query parameter.'
        ws.end(4403, message)
        return
      }

      logger.info(`New signaling connection from ${textDecoder.decode(ws.getRemoteAddressAsText())}.`)

      ws.send(peerIdentityMessage, true)
      openWs = ws
      flushCachedSends(ws)
    },
    message: (ws: WebSocket<UserData>, message: ArrayBuffer) => {
      const messageData = textDecoder.decode(message)
      const messageObject = JSON.parse(messageData)

      if (isSignalingMessage(messageObject)) {
        if (messageObject.type === 'identity') {
          logger.info(`Received compositor signaling identity: ${messageObject.data}.`)
          if (compositorPeerIdentity && messageObject.data !== compositorPeerIdentity) {
            logger.info(
              `Compositor signaling identity has changed. Old: ${compositorPeerIdentity}. New: ${messageObject.data}. Creating new peer connection.`,
            )
            // Remote compositor has restarted. Shutdown the old peer connection before handling any signaling.
            compositorPeerIdentity = messageObject.data
            compositorProxySession.resetPeerConnectionState()
          } else if (compositorPeerIdentity === undefined) {
            // Connecting to remote proxy for the first time
            compositorPeerIdentity = messageObject.data
          } // else re-connecting, ignore.
        } else if (
          messageObject.identity === compositorPeerIdentity &&
          messageObject.type === 'ice' &&
          messageObject.data &&
          messageObject.data.candidate &&
          messageObject.data.sdpMid
        ) {
          compositorProxySession.peerConnectionState.peerConnection.addRemoteCandidate(
            messageObject.data.candidate,
            messageObject.data.sdpMid,
          )
        } else if (
          messageObject.identity === compositorPeerIdentity &&
          messageObject.type === 'sdp' &&
          messageObject.data &&
          messageObject.data.sdp
        ) {
          compositorProxySession.peerConnectionState.peerConnection.setRemoteDescription(
            messageObject.data.sdp,
            messageObject.data.type,
          )
        }
      }
    },
    close: (ws: WebSocket<UserData>, code: number, message: ArrayBuffer) => {
      logger.info(`Signaling connection closed. Code: ${code}. Message: ${textDecoder.decode(message)}`)
      openWs = null
    },
  }
}

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === 'sdp' || messageObject.type === 'ice' || messageObject.type === 'identity'
}
