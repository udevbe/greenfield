import westfield from 'westfield-runtime-server'
import rtc from './protocol/rtc-browser-protocol'

import BrowserRtcPeerConnection from './BrowserRtcPeerConnection'

export default class BrowserRtcPeerConnectionFactory extends westfield.Global {
  static create () {
    return new BrowserRtcPeerConnectionFactory()
  }

  constructor () {
    super(rtc.RtcPeerConnectionFactory.name, 1)
  }

  bindClient (client, id, version) {
    const rtcPeerConnectionFactoryResource = new rtc.RtcPeerConnectionFactory(client, id, version)
    rtcPeerConnectionFactoryResource.implementation = this
  }

  createRtcPeerConnection (resource, id) {
    const rtcPeerConnectionResource = new rtc.RtcPeerConnection(resource.client, id, resource.version)
    BrowserRtcPeerConnection.create(rtcPeerConnectionResource)
  }
}
