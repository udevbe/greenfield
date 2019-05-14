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

/**
 * Wraps a potentially absent web socket. Useful in case a new web socket still needs  to be created.
 */
class WebSocketChannel {
  /***
   * @param {WebSocket}webSocket
   * @return {WebSocketChannel}
   */
  static create (webSocket) {
    const webSocketChannel = new WebSocketChannel()
    webSocketChannel.webSocket = webSocket
    return webSocketChannel
  }

  /**
   * @return {WebSocketChannel}
   */
  static createNoWebSocket () {
    return new WebSocketChannel()
  }

  constructor () {
    /**
     * @type {WebSocket|null}
     * @private
     */
    this._webSocket = null
    /**
     * @type {function():void}
     * @private
     */
    this._onOpenEventHandler = null
    /**
     * @type {function(Object):void}
     * @private
     */
    this._onErrorEventHandler = null
    this._onCloseEventHandler = null
    this._onMessageEventHandler = null
  }

  close () { this._webSocket.close() }

  /**
   * @param {ArrayBuffer}arrayBuffer
   */
  send (arrayBuffer) { this._webSocket.send(arrayBuffer) }

  set onerror (onErrorEventHandler) { this._onErrorEventHandler = onErrorEventHandler }

  set onclose (onCloseEventHandler) { this._onCloseEventHandler = onCloseEventHandler }

  set onmessage (onMessageEventHandler) { this._onMessageEventHandler = onMessageEventHandler }

  /**
   * @param {function():void}onOpenEventHandler
   */
  set onopen (onOpenEventHandler) {
    this._webSocket ? this._webSocket.onopen = onOpenEventHandler : this._onOpenEventHandler = onOpenEventHandler
  }

  /**
   * @param {WebSocket}webSocket
   */
  set webSocket (webSocket) {
    this._webSocket = webSocket
    if (this._onOpenEventHandler) {
      this._webSocket.onopen = this._onOpenEventHandler
      if (this._webSocket.readyState === 'open') {
        this._onOpenEventHandler()
      }
    }

    this._webSocket.onerror = (e) => {
      if (this._onErrorEventHandler) {
        this._onErrorEventHandler(e)
      }
    }

    // FIXME Do we manually need to fire a closed event in case the websocket is already closed?
    this._webSocket.onclose = (e) => {
      if (this._onCloseEventHandler) {
        this._onCloseEventHandler(e)
      }
    }

    this._onMessageEventHandler = (e) => {
      if (this._onMessageEventHandler) {
        this._onMessageEventHandler(e)
      }
    }
  }

  /**
   * @return {WebSocket}
   */
  get webSocket () {
    return this._webSocket
  }

  /**
   * @return {number}
   */
  get readyState () { return this._webSocket ? this._webSocket.readyState : 0 } // 0 === 'connecting'
}

module.exports = WebSocketChannel
