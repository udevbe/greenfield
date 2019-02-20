'use strict'

const RTCConnection = require('./RTCConnection')
const ChannelFactoryPool = require('../ChannelFactoryPool')

class RTCConnectionPool extends ChannelFactoryPool {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @return {RTCConnectionPool}
   */
  static create (appEndpointCompositorPair) {
    return new RTCConnectionPool(appEndpointCompositorPair)
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   */
  constructor (appEndpointCompositorPair) {
    super()
    /**
     * @type {Object.<string,RTCConnection>}
     * @private
     */
    this._pool = {}
    /**
     * @type {AppEndpointCompositorPair}
     * @private
     */
    this._appEndpointCompositorPair = appEndpointCompositorPair
  }

  /**
   * @param {string}remotePeerId
   * @return {RTCConnection}
   */
  get (remotePeerId) {
    // TODO track rtc connection lifecycle & update pool
    let rtcConnection = this._pool[remotePeerId]
    if (!rtcConnection) {
      // TODO rtc peer connection options from config
      const pcConfig = {
        'iceServers': [
          {
            'urls': ['turn:gftest.udev.be'],
            'credentialType': 'password',
            // TODO credentials from env variable
            'username': 'greenfield',
            'credential': 'bluesky'
          }
        ]
      }
      rtcConnection = RTCConnection.create(this._appEndpointCompositorPair, pcConfig, remotePeerId)
      this._pool[remotePeerId] = rtcConnection
      rtcConnection.connect()
    }
    return rtcConnection
  }
}

module.exports = RTCConnectionPool
