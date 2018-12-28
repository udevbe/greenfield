'use strict'

const ConnectionRTC = require('./ConnectionRTC')

class ConnectionRTCPool {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {string}remotePeerId
   * @return {Promise<ConnectionRTC>}
   */
  static async get (appEndpointCompositorPair, remotePeerId) {
    let connectionRTC = ConnectionRTCPool._pool[remotePeerId]
    if (!connectionRTC) {
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
      connectionRTC = await ConnectionRTC.create(appEndpointCompositorPair, pcConfig, remotePeerId)
      ConnectionRTCPool._pool[remotePeerId] = connectionRTC
    }
    return connectionRTC
  }
}

/**
 * @type {Object.<string,ConnectionRTC>}
 * @private
 */
ConnectionRTCPool._pool = {}

module.exports = ConnectionRTCPool
