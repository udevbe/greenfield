import wfs from '../../protocol/greenfield-browser-protocol'
import wrtc from '../../protocol/dcbuffer-browser-protocol'

export default class BrowserWrtcSignaling extends wfs.Global {

  static create (server) {
    const browserWrtcSignaling = new BrowserWrtcSignaling()
    server.registry.register(browserWrtcSignaling)
    return browserWrtcSignaling
  }

  constructor () {
    super('WrtcSignaling', 1)
  }

  _setupPeerConnecton (client, webrtcSignaling) {
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

    return peerConnection
  }

  bindClient (client, id, version) {
    const wrtcSignalingResource = new wrtc.WebrtcSignaling(client, id, version)
    this.onPeerConnection(client, this._setupPeerConnecton(client, wrtcSignalingResource))
  }

  onPeerConnection (client, peerConnection) {}

  onPeerConnectionError (client, error) {}
}
