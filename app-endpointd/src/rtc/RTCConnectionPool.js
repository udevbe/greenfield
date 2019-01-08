'use strict'

const RTCConnection = require('./RTCConnection')

class RTCConnectionPool {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {string}remotePeerId
   * @return {RTCConnection}
   */
  static get (appEndpointCompositorPair, remotePeerId) {
    // TODO track rtc connection lifecycle & update pool
    let rtcConnection = RTCConnectionPool._pool[remotePeerId]
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
      rtcConnection = RTCConnection.create(appEndpointCompositorPair, pcConfig, remotePeerId)
      RTCConnectionPool._pool[remotePeerId] = rtcConnection
      rtcConnection.connect()
    }
    return rtcConnection
  }
}

/**
 * @type {Object.<string,RTCConnection>}
 * @private
 */
RTCConnectionPool._pool = {}

module.exports = RTCConnectionPool
