import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import dcbuffer from './protocol/dcbuffer-browser-protocol'

import BrowserBuffer from './BrowserBuffer'
import BrowserDcBuffer from './BrowserDcBuffer'

export default class BrowserDcBufferFactory extends westfield.Global {
  /**
   *
   * @param {wfs.GrBuffer} grBuffer
   * @returns {BrowserDcBuffer}
   */
  static get (grBuffer) {
    return grBuffer.implementation.dcBuffer
  }

  /**
   *
   * @param {wfs.Server} server
   * @returns {BrowserDcBufferFactory}
   */
  static create (server) {
    const browserDcBufferFactory = new BrowserDcBufferFactory()
    server.registry.register(browserDcBufferFactory)
    return browserDcBufferFactory
  }

  /**
   * Use BrowserDcBufferFactory.create instead.
   * @private
   */
  constructor () {
    // FIXME Don't harcode the interface name, instead get it from an imported namespace
    super('DcBufferFactory', 1)
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
    const dcBufferFactory = new dcbuffer.DcBufferFactory(client, id, version)
    dcBufferFactory.implementation = this
  }

  /**
   *
   * @param {DcBufferFactory} resource
   * @param {*} id A new generic buffer
   *
   * @since 1
   *
   */
  createBuffer (resource, id) {
    const grBuffer = new greenfield.GrBuffer(resource.client, id, resource.version)
    BrowserBuffer.create(grBuffer)
  }

  /**
   *
   * @param {DcBufferFactory} resource
   * @param {Number} id A new datachannel buffer
   * @param {Number} channelId 16-bit id of the data channel
   * @param {wfs.WrtcSignaling} wrtcSignaling The bound wrtc signaling instance who's peer connection will be used to setup the data channel
   * @param {wfs.GrBuffer} buffer The generic buffer that will implement the new datachannel buffer
   *
   * @since 1
   *
   */
  createDcBuffer (resource, id, channelId, wrtcSignaling, buffer) {
    const peerConnection = wrtcSignaling.implementation.peerConnection
    const dataChannel = peerConnection.createDataChannel(null, {
      ordered: false,
      maxRetransmits: 0,
      negotiated: true,
      id: channelId
    })

    const dcBuffer = new dcbuffer.DcBuffer(resource.client, id, resource.version)
    BrowserDcBuffer.create(buffer, dcBuffer, dataChannel)
  }
}
