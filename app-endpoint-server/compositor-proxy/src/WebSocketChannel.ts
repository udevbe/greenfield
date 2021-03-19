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

import WebSocket from 'ws'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noopHandler = (): void => {}

/**
 * Wraps a potentially absent web socket. Useful in case a new web socket still needs  to be created.
 */
export class WebSocketChannel {
  static create(webSocket: WebSocket): WebSocketChannel {
    const webSocketChannel = new WebSocketChannel()
    webSocketChannel.webSocket = webSocket
    return webSocketChannel
  }

  static createNoWebSocket(): WebSocketChannel {
    return new WebSocketChannel()
  }

  constructor(
    private _webSocket?: WebSocket,
    private _onOpenEventHandler: (event: WebSocket.OpenEvent) => void = noopHandler,
    private _onErrorEventHandler: (event: WebSocket.ErrorEvent) => void = noopHandler,
    private _onCloseEventHandler: (event: WebSocket.CloseEvent) => void = noopHandler,
    private _onMessageEventHandler: (event: WebSocket.MessageEvent) => void = noopHandler,
  ) {}

  close(): void {
    if (this._webSocket) {
      this._webSocket.close()
    }
  }

  send(arrayBuffer: ArrayBuffer): void {
    this._webSocket?.send(arrayBuffer)
  }

  set onerror(onErrorEventHandler: (event: WebSocket.ErrorEvent) => void) {
    this._onErrorEventHandler = onErrorEventHandler
  }

  set onclose(onCloseEventHandler: (event: WebSocket.CloseEvent) => void) {
    this._onCloseEventHandler = onCloseEventHandler
  }

  set onmessage(onMessageEventHandler: (event: WebSocket.MessageEvent) => void) {
    this._onMessageEventHandler = onMessageEventHandler
  }

  set onopen(onOpenEventHandler: (event: WebSocket.OpenEvent) => void) {
    this._webSocket ? (this._webSocket.onopen = onOpenEventHandler) : (this._onOpenEventHandler = onOpenEventHandler)
  }

  set webSocket(webSocket: WebSocket | undefined) {
    this._webSocket = webSocket

    if (this._webSocket) {
      this._webSocket.onopen = this._onOpenEventHandler
      this._webSocket.onerror = this._onErrorEventHandler

      this._webSocket.onclose = this._onCloseEventHandler
      this._webSocket.onmessage = this._onMessageEventHandler

      if (this._webSocket.readyState === 1) {
        this._onOpenEventHandler({ target: this._webSocket })
      } else if (this._webSocket.readyState === 3) {
        this._onCloseEventHandler({
          wasClean: true,
          code: 1000,
          reason: 'proxy websocket closed',
          target: this._webSocket,
        })
      }
    }
  }

  get webSocket(): WebSocket | undefined {
    return this._webSocket
  }

  get readyState(): number {
    return this._webSocket ? this._webSocket.readyState : 0
  } // 0 === 'connecting'
}
