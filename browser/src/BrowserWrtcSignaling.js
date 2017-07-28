import westfield from 'westfield-runtime-server'
import dcbuffer from './protocol/dcbuffer-browser-protocol'

export default class BrowserWrtcSignaling extends westfield.Global {
  static create (server) {
    const browserWrtcSignaling = new BrowserWrtcSignaling()
    server.registry.register(browserWrtcSignaling)
    return browserWrtcSignaling
  }

  constructor () {
    // FIXME Don't harcode the interface name, instead get it from an imported namespace
    super('WrtcSignaling', 1)
  }

  _createPeerConnecton (client, webrtcSignaling) {
    const peerConnection = new window.RTCPeerConnection({
      'iceServers': [
        {'urls': 'stun:stun.wtfismyip.com/'}
      ]
    })

    peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        webrtcSignaling.serverIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }

    webrtcSignaling.listener.clientIceCandidates = (description) => {
      const signal = JSON.parse(description)
      peerConnection.addIceCandidate(new window.RTCIceCandidate(signal.candidate)).catch(error => {
        this.onPeerConnectionError(client, error)
      })
    }

    webrtcSignaling.listener.clientSdpReply = (description) => {
      const signal = JSON.parse(description)
      peerConnection.setRemoteDescription(new window.RTCSessionDescription(signal.sdp)).catch((error) => {
        this.onPeerConnectionError(client, error)
      })
    }

    peerConnection.createOffer({
      offerToReceiveAudio: false,
      offerToReceiveVideo: false,
      voiceActivityDetection: false,
      iceRestart: false
    }).then((desc) => {
      return peerConnection.setLocalDescription(desc)
    }).then(() => {
      webrtcSignaling.serverSdpOffer(JSON.stringify({'sdp': peerConnection.localDescription}))
    }).catch((error) => {
      this.onPeerConnectionError(client, error)
    })

    // store the peer connection in the signaling instance so we can find it again when we create a dc buffer later on.
    webrtcSignaling.implementation.peerConnection = peerConnection
  }

  bindClient (client, id, version) {
    const wrtcSignalingResource = new dcbuffer.WebrtcSignaling(client, id, version)
    this._createPeerConnecton(client, wrtcSignalingResource)
  }

  // FIXME signal error to client & disconnect
  onPeerConnectionError (client, error) {}
}
