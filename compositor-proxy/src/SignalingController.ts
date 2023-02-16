import { createLogger } from './Logger'
import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import type { CompositorProxySession } from './CompositorProxySession'
import { randomBytes } from 'crypto'
import { RTCIceCandidate, RTCIceServer, RTCPeerConnection, RTCSessionDescriptionInit } from '@koush/wrtc'
import { config } from './config'

const logger = createLogger('compositor-proxy-signaling')

type UserData = {
  searchParams: URLSearchParams
  compositorProxySession: CompositorProxySession
}

export type DataChannelDesc = { type: 'protocol' | 'frame' | 'xwm' | 'feedback'; clientId: string }
export type FeedbackDataChannelDesc = DataChannelDesc & { surfaceId: number }

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
      data: RTCIceServer[]
      identity: string
    }

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

let openWs: WebSocket<UserData> | null = null
const identity = randomBytes(8).toString('hex')
const peerIdentity: SignalingMessage = {
  type: 'identity',
  data: config.server.webrtc.iceServers ?? [],
  identity,
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
  logger.info(`Listening for signaling connections using identity: ${peerIdentity.identity}`)

  const handleIceCandidate: RTCPeerConnection['onicecandidate'] = (ev) => {
    if (ev.candidate?.protocol === 'tcp') {
      return
    }
    const signalingMessage: SignalingMessage = {
      type: 'ice',
      data: ev.candidate,
      identity,
    }
    cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
  }

  const handleNegotiationNeeded: RTCPeerConnection['onnegotiationneeded'] = async () => {
    try {
      compositorProxySession.peerConnectionState.makingOffer = true
      const offer = await compositorProxySession.peerConnectionState.peerConnection.createOffer({
        offerToReceiveVideo: false,
        offerToReceiveAudio: false,
      })
      await compositorProxySession.peerConnectionState.peerConnection.setLocalDescription(offer)
      const signalingMessage: SignalingMessage = {
        type: 'sdp',
        data: compositorProxySession.peerConnectionState.peerConnection.localDescription,
        identity,
      }
      cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
    } catch (err) {
      console.error(err)
    } finally {
      compositorProxySession.peerConnectionState.makingOffer = false
    }
  }

  const handleIceConnectionStateChange: RTCPeerConnection['oniceconnectionstatechange'] = () => {
    if (compositorProxySession.peerConnectionState.peerConnection.iceConnectionState === 'failed') {
      compositorProxySession.peerConnectionState.peerConnection.restartIce()
    }
  }

  compositorProxySession.peerConnectionState.peerConnection.onicecandidate = handleIceCandidate
  compositorProxySession.peerConnectionState.peerConnection.onnegotiationneeded = handleNegotiationNeeded
  compositorProxySession.peerConnectionState.peerConnection.oniceconnectionstatechange = handleIceConnectionStateChange

  const resetPeerConnection = (killAllClients: boolean) => {
    compositorProxySession.peerConnectionState.peerConnection.onicecandidate = null
    compositorProxySession.peerConnectionState.peerConnection.onnegotiationneeded = null
    compositorProxySession.peerConnectionState.peerConnection.oniceconnectionstatechange = null
    compositorProxySession.resetPeerConnectionState(killAllClients)
    compositorProxySession.peerConnectionState.peerConnection.onicecandidate = handleIceCandidate
    compositorProxySession.peerConnectionState.peerConnection.onnegotiationneeded = handleNegotiationNeeded
    compositorProxySession.peerConnectionState.peerConnection.oniceconnectionstatechange =
      handleIceConnectionStateChange
  }

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
    message: async (ws: WebSocket<UserData>, message: ArrayBuffer) => {
      const messageData = textDecoder.decode(message)
      const messageObject = JSON.parse(messageData)

      if (isSignalingMessage(messageObject)) {
        if (messageObject.type === 'identity') {
          logger.info(`Received compositor signaling identity: ${messageObject.identity}.`)
          if (compositorPeerIdentity && messageObject.identity !== compositorPeerIdentity) {
            logger.info(
              `Compositor signaling identity has changed. Old: ${compositorPeerIdentity}. New: ${messageObject.identity}. Creating new peer connection.`,
            )
            // Remote compositor has restarted. Shutdown the old peer connection before handling any signaling.
            compositorPeerIdentity = messageObject.identity
            resetPeerConnection(false)
          } else if (compositorPeerIdentity === undefined) {
            // Connecting to remote proxy for the first time
            compositorPeerIdentity = messageObject.identity
          } // else re-connecting, ignore.
        } else if (
          messageObject.identity === compositorPeerIdentity &&
          messageObject.type === 'ice' &&
          messageObject.data
        ) {
          try {
            await compositorProxySession.peerConnectionState.peerConnection.addIceCandidate(messageObject.data)
          } catch (err) {
            if (!compositorProxySession.peerConnectionState.ignoreOffer) throw err // Suppress ignored offer's candidates
          }
        } else if (
          messageObject.identity === compositorPeerIdentity &&
          messageObject.type === 'sdp' &&
          messageObject.data?.sdp
        ) {
          // An offer may come in while we are busy processing SRD(answer).
          // In this case, we will be in "stable" by the time the offer is processed,
          // so it is safe to chain it on our Operations Chain now.
          const readyForOffer =
            !compositorProxySession.peerConnectionState.makingOffer &&
            (compositorProxySession.peerConnectionState.peerConnection.signalingState == 'stable' ||
              compositorProxySession.peerConnectionState.isSettingRemoteAnswerPending)
          const offerCollision = messageObject.data.type === 'offer' && !readyForOffer

          compositorProxySession.peerConnectionState.ignoreOffer =
            !compositorProxySession.peerConnectionState.polite && offerCollision
          if (compositorProxySession.peerConnectionState.ignoreOffer) {
            return
          }

          compositorProxySession.peerConnectionState.isSettingRemoteAnswerPending = messageObject.data.type === 'answer'
          await compositorProxySession.peerConnectionState.peerConnection.setRemoteDescription(messageObject.data)
          compositorProxySession.peerConnectionState.isSettingRemoteAnswerPending = false

          if (messageObject.data.type === 'offer') {
            const answer = await compositorProxySession.peerConnectionState.peerConnection.createAnswer()
            await compositorProxySession.peerConnectionState.peerConnection.setLocalDescription(answer)
            const signalingMessage: SignalingMessage = {
              type: 'sdp',
              data: compositorProxySession.peerConnectionState.peerConnection.localDescription,
              identity,
            }
            cachedSend(textEncoder.encode(JSON.stringify(signalingMessage)))
          }
        }
      }
    },
    close: (ws: WebSocket<UserData>, code: number, message: ArrayBuffer) => {
      logger.info(`Signaling connection closed. Code: ${code}. Message: ${textDecoder.decode(message)}`)
      openWs = null
      if (code === 4001) {
        // user closed connection
        compositorPeerIdentity = undefined
        resetPeerConnection(true)
      }
    },
  }
}

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === 'sdp' || messageObject.type === 'ice' || messageObject.type === 'identity'
}
