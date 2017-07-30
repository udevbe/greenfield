import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import rtc from './protocol/rtc-browser-protocol'

import BrowserBuffer from './BrowserBuffer'
import BrowserRtcDcBuffer from './BrowserRtcDcBuffer'

export default class BrowserRtcBufferFactory extends westfield.Global {
  /**
   *
   * @param {wfs.GrBuffer} grBufferResource
   * @returns {BrowserRtcDcBuffer}
   */
  static get (grBufferResource) {
    return grBufferResource.implementation.browserRtcDcBuffer
  }

  /**
   *
   * @param {wfs.Server} wfsServer
   * @returns {BrowserRtcBufferFactory}
   */
  static create (wfsServer) {
    const browserRtcBufferFactory = new BrowserRtcBufferFactory()
    wfsServer.registry.register(browserRtcBufferFactory)
    return browserRtcBufferFactory
  }

  /**
   * Use BrowserDcBufferFactory.create instead.
   * @private
   */
  constructor () {
    // FIXME Don't harcode the interface name, instead get it from an imported namespace
    super('RtcBufferFactory', 1)
  }

  /**
   *
   * Invoked when a client binds to this global. Subclasses implement this method so they can instantiate a
   * corresponding wfs.Resource subtype.
   *
   * @param {wfs.Client} client
   * @param {Number} id
   * @param {Number} version
   */
  bindClient (client, id, version) {
    const rtcBufferFactoryResource = new rtc.RtcBufferFactory(client, id, version)
    rtcBufferFactoryResource.implementation = this
  }

  /**
   *
   * @param {RtcBufferFactory} resource
   * @param {*} id A new generic buffer
   *
   * @since 1
   *
   */
  createBuffer (resource, id) {
    const grBufferResource = new greenfield.GrBuffer(resource.client, id, resource.version)
    BrowserBuffer.create(grBufferResource)
  }

  /**
   *
   * @param {wfs.RtcBufferFactory} resource
   * @param {Number} id A new datachannel buffer
   * @param {Number} channelId 16-bit id of the data channel
   * @param {wfs.RtcPeerConnection} rtcPeerConnectionResource The bound wrtc signaling instance who's peer connection will be used to setup the data channel
   * @param {wfs.GrBuffer} grBufferResource The generic buffer that will implement the new datachannel buffer
   *
   * @since 1
   *
   */
  createDcBuffer (resource, id, channelId, rtcPeerConnectionResource, grBufferResource) {
    const peerConnection = rtcPeerConnectionResource.implementation.peerConnection
    const dataChannel = peerConnection.createDataChannel(null, {
      ordered: false,
      maxRetransmits: 0,
      negotiated: true,
      id: channelId
    })

    const rtcDcBufferResource = new rtc.RtcDcBuffer(resource.client, id, resource.version)
    BrowserRtcDcBuffer.create(grBufferResource, rtcDcBufferResource, dataChannel)
  }
}
