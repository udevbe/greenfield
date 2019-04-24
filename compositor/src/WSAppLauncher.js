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

class WSAppLauncher {
  /**
   * @param {Session}session
   * @param {WSSocket}wsSocket
   * @return {WSAppLauncher}
   */
  static create (session, wsSocket) {
    return new WSAppLauncher(session, wsSocket)
  }

  /**
   * @param {Session}session
   * @param {WSSocket}wsSocket
   */
  constructor (session, wsSocket) {
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {WSSocket}
     * @private
     */
    this._wsSocket = wsSocket
  }

  /**
   * @param {string}remoteAppURL
   */
  launch (remoteAppURL) {
    // TODO add real user token parameter
    const webSocket = new window.WebSocket(`${remoteAppURL}?session=${this._session.compositorSessionId}?userToken=12345`)
    this._wsSocket.onWebSocket(webSocket)
  }
}

export default WSAppLauncher
