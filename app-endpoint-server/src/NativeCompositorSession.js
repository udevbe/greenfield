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

const Logger = require('pino')

const { Endpoint, nativeGlobalNames } = require('westfield-endpoint')
const { Epoll } = require('epoll')

const NativeClientSession = require('./NativeClientSession')
const WebSocketChannel = require('./WebSocketChannel')
const { sessionConfig } = require('../config.json5')

const AppEndpointWebFS = require('./AppEndpointWebFS')

class NativeCompositorSession {
  /**
   * @param {string}compositorSessionId
   * @returns {NativeCompositorSession}
   */
  static create (compositorSessionId) {
    const logger = Logger({
      name: `app-endpoint-session::${compositorSessionId}::native-compositor-session`,
      prettyPrint: (process.env.DEBUG && process.env.DEBUG == true),
      level: (process.env.DEBUG && process.env.DEBUG == true) ? 20 : 30
    })

    const compositorSession = new NativeCompositorSession(logger, compositorSessionId, AppEndpointWebFS.create(compositorSessionId))

    // TODO move global create/destroy callback implementations into Endpoint.js
    compositorSession.wlDisplay = Endpoint.createDisplay(
      wlClient => compositorSession._onClientCreated(wlClient),
      globalName => compositorSession._onGlobalCreated(globalName),
      globalName => compositorSession._onGlobalDestroyed(globalName)
    )
    Endpoint.initShm(compositorSession.wlDisplay)
    const waylandDisplay = Endpoint.addSocketAuto(compositorSession.wlDisplay)
    compositorSession.waylandDisplay = waylandDisplay
    logger.info(`Listening on: WAYLAND_DISPLAY="${waylandDisplay}".`)

    // set the wayland display to something non existing, else gstreamer will connect to us with a fallback value and
    // block, while in turn we wait for gstreamer, resulting in a deadlock!
    // FIXME this can be removed once we move all the buffer encoding to native code with a programmatically constructed
    // gstreamer pipeline using a headless option
    process.env.WAYLAND_DISPLAY = 'doesntExist'

    const wlDisplayFd = Endpoint.getFd(compositorSession.wlDisplay)

    // TODO handle err
    // TODO write our own native epoll
    const fdWatcher = new Epoll(err => Endpoint.dispatchRequests(compositorSession.wlDisplay))
    fdWatcher.add(wlDisplayFd, Epoll.EPOLLPRI | Epoll.EPOLLIN | Epoll.EPOLLERR)

    return compositorSession
  }

  /**
   * @param logger
   * @param {string}compositorSessionId
   * @param {AppEndpointWebFS}appEndpointWebFS
   */
  constructor (logger, compositorSessionId, appEndpointWebFS) {
    /**
     * @private
     */
    this._logger = logger
    /**
     * @type {?string}
     */
    this.waylandDisplay = null
    /**
     * @type {string}
     */
    this.compositorSessionId = compositorSessionId
    /**
     * @type {AppEndpointWebFS}
     */
    this.appEndpointWebFS = appEndpointWebFS
    /**
     * @type {Object}
     */
    this.wlDisplay = null
    /**
     * @type {Array<{webSocketChannel: WebSocketChannel, nativeClientSession: ?NativeClientSession, id: number}>}
     * @private
     */
    this._clients = []
    /**
     * @type {number}
     * @private
     */
    this._nextClientId = 0
    /**
     * @type {?number}
     * @private
     */
    this._destroyTimeoutTimer = null
    /**
     * @type {?function():void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise(resolve => { this._destroyResolve = resolve })
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    if (this._destroyResolve === null) {
      return
    }

    if (this._destroyTimeoutTimer) {
      this._destroyTimeoutTimer = null
    }

    this._clients.forEach(client => client.nativeClientSession.destroy())
    Endpoint.destroyDisplay(this.wlDisplay)

    this._destroyResolve()
    this._destroyResolve = null
  }

  /**
   * @param {number}clientId
   * @param {Object}wlClient
   * @private
   */
  _requestWebSocket (clientId, wlClient) {
    // We hijack the very first web socket connection we find to send an out of band message asking for a new web socket.
    const client = this._clients.find(client => client.webSocketChannel.webSocket !== null)
    if (client) {
      client.nativeClientSession.requestWebSocket(clientId)
    } else {
      // Not a single web socket available. This means the client was definitely started locally and was not the result of a browser initiated parent process.
      this._logger.error(`No web sockets available for externally created wayland client. Only child clients created as a side effect of a browser initiated client processes are allowed.`)
      Endpoint.destroyClient(wlClient)
    }
  }

  /**
   * @param {Object}wlClient
   * @private
   */
  _onClientCreated (wlClient) {
    this._logger.info(`New Wayland client connected.`)
    this._stopDestroyTimeout()

    let client = this._clients.find((client) => client.nativeClientSession === null)

    if (client) {
      client.nativeClientSession = NativeClientSession.create(wlClient, this, client.webSocketChannel)
    } else {
      const webSocketChannel = WebSocketChannel.createNoWebSocket()
      const id = this._nextClientId++
      client = {
        nativeClientSession: NativeClientSession.create(wlClient, this, webSocketChannel),
        webSocketChannel,
        id
      }
      this._clients.push(client)
      // no browser initiated web sockets available, so ask compositor to create a new one linked to clientId
      this._requestWebSocket(id, wlClient)
    }

    client.nativeClientSession.onDestroy().then(() => {
      const idx = this._clients.indexOf(client)
      if (idx > -1) {
        this._clients.splice(idx, 1)

        if (this._clients.length === 0) {
          this._startDestroyTimeout()
        }
      }
    })
  }

  _stopDestroyTimeout () {
    if (this._destroyTimeoutTimer) {
      clearTimeout(this._destroyTimeoutTimer)
    }
  }

  _startDestroyTimeout () {
    this._destroyTimeoutTimer = setTimeout(() => this.destroy(), sessionConfig.destroyTimeout)
  }

  childSpawned (webSocket) {
    webSocket.binaryType = 'arraybuffer'
    this._clients.push({
      webSocketChannel: WebSocketChannel.create(webSocket),
      nativeClientSession: null,
      id: this._nextClientId++
    })
  }

  /**
   * @param {WebSocket}webSocket
   * @param {number}clientId
   */
  socketForClient (webSocket, clientId) {
    // As a side effect, this will notify the NativeClientSession that a web socket is now available
    webSocket.binaryType = 'arraybuffer'
    this._clients.find(client => client.id === clientId).webSocketChannel.webSocket = webSocket
  }

  /**
   * @param {number}globalName
   * @private
   */
  _onGlobalCreated (globalName) {
    nativeGlobalNames.push(globalName)
  }

  /**
   * @param {number}globalName
   * @private
   */
  _onGlobalDestroyed (globalName) {
    const idx = nativeGlobalNames.indexOf(globalName)
    if (idx > -1) {
      nativeGlobalNames.splice(idx, 1)
    }
  }
}

module.exports = NativeCompositorSession
