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

class RemoteAppLauncher {
  /**
   * @param {Session}session
   * @param {RemoteSocket}remoteSocket
   * @return {RemoteAppLauncher}
   */
  static create (session, remoteSocket) {
    return new RemoteAppLauncher(session, remoteSocket)
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
   * @param {URL}appEndpointURL
   * @param {string}remoteAppId
   * @return {Promise<Client>}
   */
  async launch (appEndpointURL, remoteAppId) {
    appEndpointURL.searchParams.delete('compositorSessionId')
    appEndpointURL.searchParams.append('compositorSessionId', this._session.compositorSessionId)
    appEndpointURL.searchParams.delete('launch')
    appEndpointURL.searchParams.append('launch', remoteAppId)

    const webSocket = new window.WebSocket(appEndpointURL.href)
    return this._remoteSocket.onWebSocket(webSocket)
  }
}

export default RemoteAppLauncher
