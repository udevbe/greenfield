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

require('json5/lib/register')
// eslint-disable-next-line camelcase
const child_process = require('child_process')

const { /** @type {WebSocketServer} */Server } = require('ws')

const { sessionConfig } = require('../config.json5')
const SurfaceBufferEncoding = require('./SurfaceBufferEncoding')
const NativeCompositorSession = require('./NativeCompositorSession')

class AppEndpointSession {
  /**
   * @param {string}compositorSessionId
   * @return {AppEndpointSession}
   */
  static create ({ compositorSessionId }) {
    const nativeCompositorSession = NativeCompositorSession.create(compositorSessionId)
    const appEndpointSession = new AppEndpointSession(nativeCompositorSession, compositorSessionId)
    process.env.DEBUG && console.log(`[app-endpoint-session: ${compositorSessionId}] - Session started.`)
    return appEndpointSession
  }

  /**
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {string}compositorSessionId
   */
  constructor (nativeCompositorSession, compositorSessionId) {
    /**
     * @type {NativeCompositorSession}
     * @private
     */
    this._nativeCompositorSession = nativeCompositorSession
    /**
     * @type {string}
     */
    this.compositorSessionId = compositorSessionId
    /**
     * @type {function():void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise((resolve) => { this._destroyResolve = resolve })
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    this._destroyResolve()
  }

  /**
   * @param {WebSocket}webSocket
   * @param query
   */
  handleConnection (webSocket, query) {
    process.env.DEBUG && console.log(`[app-endpoint-session: ${this.compositorSessionId}] - New web socket open.`)
    if (query.launch) {
      const appConfig = /** @type{{bin: string, args: Array<string>}} */sessionConfig.apps[query.launch]
      if (appConfig) {
        try {
          const childProcess = child_process.spawn(appConfig.bin, appConfig.args, {
            env: {
              ...process.env,
              'WAYLAND_DISPLAY': `${this._nativeCompositorSession.waylandDisplay}`
            }
          })

          childProcess.stdout.on('data', data => console.log(`stdout: ${data}`))
          childProcess.stderr.on('data', data => console.log(`stderr: ${data}`))
          childProcess.on('close', code => console.log(`child process exited with code ${code}`))

          this._nativeCompositorSession.childSpawned(webSocket)
        } catch (e) {
          console.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
          console.error('error object stack: ')
          console.error(e.stack)

          // TODO report back to the browser when the app failed to start
        }
      } else {
        // TODO report to browser that app was not found
        console.error(`Application: ${query.launch} was not found.`)
      }
    } else if (query.clientId) {
      this._nativeCompositorSession.socketForClient(webSocket, query.clientId)
    } else if (query.shm) {
      // TODO setup web socket and transfer shm contents
    } else if (query.pipe) {
      // TODO setup web socket and wait for pipe read/write
    }
  }

  /**
   * @param {CloseEvent}event
   * @private
   */
  _onClose (event) {
    process.env.DEBUG && console.log(`[app-endpoint-session: ${this.compositorSessionId}] - Web socket is closed. ${event.code}: ${event.reason}.`)
    this.destroy()
  }

  /**
   * @param {Event}event
   * @private
   */
  _onError (event) {
    process.env.DEBUG && console.error(`[app-endpoint-session: ${this.compositorSessionId}] - Web socket is in error. ${event}.`)
  }
}

function _handleFirstUpgrade (webSocketServer, webSocket, query) {
  // create new session on first connection
  // TODO set a timer to destroy app endpoint session process when no connections are active anymore
  const appEndpointSession = AppEndpointSession.create(query)
  appEndpointSession.handleConnection(webSocket, query)

  process.on('message', (request, socket) => {
    const { query, ...req } = request[0]
    const head = request[1]

    // handle subsequent upgrades
    webSocketServer.handleUpgrade(
      req,
      socket,
      head,
      (webSocket) => appEndpointSession.handleConnection(webSocket, query)
    )
  })
}

function main () {
  process.on('uncaughtException', (error) => console.error(error, error.stack))

  SurfaceBufferEncoding.init()

  const webSocketServer = /** @type {WebSocketServer} */new Server(sessionConfig.webSocketServer.options)

  process.once('message', (request, socket) => {
    const { query, ...req } = request[0]
    const head = request[1]

    webSocketServer.handleUpgrade(req, socket, head, (webSocket) => _handleFirstUpgrade(webSocketServer, webSocket, query))
  })
}

main()
