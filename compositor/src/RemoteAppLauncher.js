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

class RemoteAppLauncher {
  /**
   * @param {Session}session
   * @param {RemoteSocket}wsSocket
   * @return {RemoteAppLauncher}
   */
  static create (session, wsSocket) {
    return new RemoteAppLauncher(session, wsSocket)
  }

  /**
   * @param {Session}session
   * @param {RemoteSocket}remoteSocket
   */
  constructor (session, remoteSocket) {
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {RemoteSocket}
     * @private
     */
    this._remoteSocket = remoteSocket
  }

  /**
   * @param {string}appEndpointURL
   * @param {string}remoteAppId
   */
  launch (appEndpointURL, remoteAppId) {
    const applicationEndpointURL = new URL(appEndpointURL)
    applicationEndpointURL.searchParams.append('compositorSessionId', this._session.compositorSessionId)
    applicationEndpointURL.searchParams.append('launch', remoteAppId)

    // TODO add user jwt token as subprotocol see: https://stackoverflow.com/a/35108078/720436
    const webSocket = new window.WebSocket(applicationEndpointURL)
    this._remoteSocket.onWebSocket(webSocket)
  }
}

export default RemoteAppLauncher
