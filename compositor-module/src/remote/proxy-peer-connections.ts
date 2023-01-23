import { ClientConnectionListener } from '../index'
import { Client } from 'westfield-runtime-server'
import Session from '../Session'
import ReconnectingWebSocket from './reconnecting-websocket'

type SignalingMessage =
  | {
      type: 'sdp'
      data: RTCSessionDescription | null
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

const identity = window.crypto.randomUUID()
const peerIdentity: SignalingMessage = {
  type: 'identity',
  data: identity,
}
const peerIdentityMessage = textEncoder.encode(JSON.stringify(peerIdentity))

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === 'sdp' || messageObject.type === 'ice' || messageObject.type === 'identity'
}

const proxyPeerConnections: Record<
  string,
  { peerConnection: RTCPeerConnection; clientConnectionListener: ClientConnectionListener }
> = {}

function createPeerConnection(
  session: Session,
  signalingWebSocket: ReconnectingWebSocket,
  signalingURL: string,
  clientConnectionListener: ClientConnectionListener,
  onProxyRestart: (newPeerConnection: RTCPeerConnection, clientConnectionListener: ClientConnectionListener) => void,
  remotePeerIdentity?: string,
): RTCPeerConnection {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    iceCandidatePoolSize: 4,
  })

  // other side has polite = false
  const polite = true
  // - The perfect negotiation logic, separated from the rest of the application --- cfr: https://w3c.github.io/webrtc-pc/#perfect-negotiation-example
  // keep track of some negotiation state to prevent races and errors
  let makingOffer = false
  let ignoreOffer = false
  let isSettingRemoteAnswerPending = false

  peerConnection.onicecandidate = (ev) => {
    if (ev.candidate?.protocol === 'tcp') {
      return
    }
    const signalingMessage: SignalingMessage = {
      type: 'ice',
      data: ev.candidate,
      identity,
    }
    signalingWebSocket.send(textEncoder.encode(JSON.stringify(signalingMessage)))
  }

  peerConnection.onnegotiationneeded = async () => {
    try {
      makingOffer = true
      const offer = await peerConnection.createOffer({ offerToReceiveVideo: false, offerToReceiveAudio: false })
      await peerConnection.setLocalDescription(offer)
      const signalingMessage: SignalingMessage = {
        type: 'sdp',
        data: peerConnection.localDescription,
        identity,
      }
      signalingWebSocket.send(textEncoder.encode(JSON.stringify(signalingMessage)))
    } catch (err) {
      console.error(err)
    } finally {
      makingOffer = false
    }
  }

  signalingWebSocket.onmessage = async (event) => {
    const messageObject = JSON.parse(textDecoder.decode(event.data as ArrayBuffer))
    if (isSignalingMessage(messageObject)) {
      if (messageObject.type === 'identity') {
        session.logger.info(`Received remote signaling identity: ${messageObject.data}.`)
        if (remotePeerIdentity && messageObject.data !== remotePeerIdentity) {
          session.logger.info(
            `Remote signaling identity has changed. Old: ${remotePeerIdentity}. New: ${messageObject.data}. Creating new peer connection.`,
          )
          // Remote proxy has restarted. Shutdown the old peer connection before handling any signaling.
          peerConnection.onnegotiationneeded = null
          peerConnection.onicecandidate = null
          peerConnection.close()
          remotePeerIdentity = messageObject.data
          // start a new peer connection
          onProxyRestart(
            createPeerConnection(
              session,
              signalingWebSocket,
              signalingURL,
              clientConnectionListener,
              onProxyRestart,
              messageObject.data,
            ),
            clientConnectionListener,
          )
        } else if (remotePeerIdentity === undefined) {
          // Connecting to remote proxy for the first time
          remotePeerIdentity = messageObject.data
        } // else re-connecting, ignore.
      } else if (messageObject.identity === remotePeerIdentity && messageObject.type === 'ice' && messageObject.data) {
        try {
          await peerConnection.addIceCandidate(messageObject.data)
        } catch (err) {
          if (!ignoreOffer) throw err // Suppress ignored offer's candidates
        }
      } else if (
        messageObject.identity === remotePeerIdentity &&
        messageObject.type === 'sdp' &&
        messageObject.data?.sdp
      ) {
        // An offer may come in while we are busy processing SRD(answer).
        // In this case, we will be in "stable" by the time the offer is processed,
        // so it is safe to chain it on our Operations Chain now.
        const readyForOffer =
          !makingOffer && (peerConnection.signalingState == 'stable' || isSettingRemoteAnswerPending)
        const offerCollision = messageObject.data.type === 'offer' && !readyForOffer

        ignoreOffer = !polite && offerCollision
        if (ignoreOffer) {
          return
        }

        isSettingRemoteAnswerPending = messageObject.data.type === 'answer'
        await peerConnection.setRemoteDescription(messageObject.data)
        isSettingRemoteAnswerPending = false
        if (messageObject.data.type === 'offer') {
          await peerConnection.setLocalDescription()
          const signalingMessage: SignalingMessage = {
            type: 'sdp',
            data: peerConnection.localDescription,
            identity,
          }
          signalingWebSocket.send(textEncoder.encode(JSON.stringify(signalingMessage)))
        }
      }
    }
  }

  signalingWebSocket.onopen = (event, queue) => {
    queue.unshift(peerIdentityMessage)
  }

  proxyPeerConnections[signalingURL] = {
    peerConnection,
    clientConnectionListener,
  }

  return peerConnection
}

export function ensureProxyPeerConnection(
  session: Session,
  compositorProxyURL: URL,
  onProxyRestart: (newPeerConnection: RTCPeerConnection, clientConnectionListener: ClientConnectionListener) => void,
): {
  peerConnection: RTCPeerConnection
  clientConnectionListener: ClientConnectionListener
} {
  const signalingPath = compositorProxyURL.pathname.endsWith('/') ? 'signaling' : '/signaling'
  const signalingURL = `${compositorProxyURL.protocol}//${compositorProxyURL.host}${compositorProxyURL.pathname}${signalingPath}?${compositorProxyURL.searchParams}`
  const peerConnectionEntry = proxyPeerConnections[signalingURL]
  if (peerConnectionEntry) {
    return {
      peerConnection: peerConnectionEntry.peerConnection,
      clientConnectionListener: peerConnectionEntry.clientConnectionListener,
    }
  }

  session.logger.info(`Trying to connect using compositor proxy signaling URL: ${signalingURL}`)
  const signalingWebSocket = new ReconnectingWebSocket(signalingURL, undefined, {
    minReconnectionDelay: 1000,
    maxReconnectionDelay: 3000,
    reconnectionDelayGrowFactor: 100,
  })
  signalingWebSocket.binaryType = 'arraybuffer'

  const clientConnectionListener: ClientConnectionListener = {
    onClient(client: Client) {
      /*noop*/
    },
    close() {
      // TODO implement clean remote proxy disconnect
      signalingWebSocket.close()
    },
  }

  const peerConnection = createPeerConnection(
    session,
    signalingWebSocket,
    signalingURL,
    clientConnectionListener,
    onProxyRestart,
  )
  return { peerConnection, clientConnectionListener }
}
