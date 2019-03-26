// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

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
