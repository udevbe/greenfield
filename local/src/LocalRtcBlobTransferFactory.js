const crypto = require('crypto')

const rtc = require('./protocol/rtc-client-protocol')

const LocalRtcBlobTransfer = require('./LocalRtcBlobTransfer')

module.exports = class LocalRtcBlobTransferFactory {
  static create (localClient) {
    return new Promise((resolve) => {
      const registryProxy = localClient.connection.createRegistry()

      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === rtc.RtcBlobTransferFactory.name) {
          const rtcBlobTransferFactoryProxy = registryProxy.bind(name, interface_, version)
          const localRtcBlobTransferFactory = new LocalRtcBlobTransferFactory(rtcBlobTransferFactoryProxy)
          rtcBlobTransferFactoryProxy.listener = localRtcBlobTransferFactory
          resolve(localRtcBlobTransferFactory)
        }
      }
    })
  }

  constructor (proxy) {
    this.proxy = proxy
  }

  _createDescriptorObject (localRtcPeerConnection, reliable) {
    const dataChannelId = localRtcPeerConnection.nextDataChannelId()
    // object somewhat corresponds to rtc data channel config dictionary
    return {
      negotiated: true,
      maxRetransmits: reliable ? null : 0,
      id: dataChannelId,
      ordered: reliable,
      label: this._uuidv4(),
      binaryType: 'arraybuffer'
    }
  }

  _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  /**
   * @param {String}blobDescriptor
   * @param {LocalRtcPeerConnection}localRtcPeerConnection
   * @return {LocalRtcBlobTransfer}
   */
  createFromDescriptor (blobDescriptor, localRtcPeerConnection) {
    const descriptorObj = JSON.parse(blobDescriptor)
    if (descriptorObj.id === -1) {
      descriptorObj.id = localRtcPeerConnection.nextDataChannelId()
    }
    const blobTransferProxy = this.proxy.createBlobTransfer(JSON.stringify(descriptorObj), localRtcPeerConnection.proxy)
    return LocalRtcBlobTransfer.create(blobTransferProxy, descriptorObj, localRtcPeerConnection)
  }

  create (localRtcPeerConnection, reliable) {
    const dataChannelInitDict = this._createDescriptorObject(localRtcPeerConnection, reliable)
    return this.createFromDescriptor(JSON.stringify(dataChannelInitDict), localRtcPeerConnection)
  }
}
