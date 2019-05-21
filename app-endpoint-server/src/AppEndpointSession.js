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
    const logger = Logger({
      name: `app-endpoint-session::${compositorSessionId}`,
      prettyPrint: (process.env.DEBUG && process.env.DEBUG == true)
    })
    const nativeCompositorSession = NativeCompositorSession.create(compositorSessionId)
    const appEndpointSession = new AppEndpointSession(logger, nativeCompositorSession, compositorSessionId)
    nativeCompositorSession.onDestroy().then(() => appEndpointSession.destroy())
    logger.info(`Session started.`)
    return appEndpointSession
  }

  /**
   * @param logger
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {string}compositorSessionId
   */
  constructor (logger, nativeCompositorSession, compositorSessionId) {
    /**
     * @private
     */
    this._logger = logger
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
    this._logger.info(`Session destroyed.`)
    this._destroyResolve()
  }

  /**
   * @param {WebSocket}webSocket
   * @param {ParsedUrlQuery}query
   */
  handleConnection (webSocket, query) {
    this._logger.debug(`New web socket open.`)
    if (query.clientId) {
      this._nativeCompositorSession.socketForClient(webSocket, Number.parseInt(query.clientId))
    } else if (query.launch) {
      const appConfig = /** @type{{bin: string, args: Array<string>}} */sessionConfig.apps[query.launch]
      if (appConfig) {
        try {
          const childProcess = child_process.spawn(appConfig.bin, appConfig.args, {
            env: {
              ...process.env,
              'WAYLAND_DISPLAY': `${this._nativeCompositorSession.waylandDisplay}`
            }
          })

          const childLogger = Logger({
            name: `${appConfig.bin} ${appConfig.args}`,
            prettyPrint: (process.env.DEBUG && process.env.DEBUG == true)
          })
          childProcess.stdout.on('data', data => childLogger.info(`stdout: ${data}`))
          childProcess.stderr.on('data', data => childLogger.error(`stderr: ${data}`))
          childProcess.on('close', code => this._logger.error(`child process: ${appConfig.bin} ${appConfig.args} exited with code: ${code}`))

          this._nativeCompositorSession.childSpawned(webSocket)
        } catch (e) {
          this._logger.error(`Application: ${query.launch} failed to start.`)
          this._logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
          this._logger.error('error object stack: ')
          this._logger.error(e.stack)

          webSocket.close(4503, `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${query.launch} failed to start.`)
        }
      } else {
        this._logger.error(`[app-endpoint-session: ${this.compositorSessionId}] - Application: ${query.launch} not found.`)
        webSocket.close(4404, `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${query.launch} not found.`)
      }
    } else if (query.shm) {
      // TODO setup web socket and transfer shm contents
    } else if (query.pipe) {
      // TODO setup web socket and wait for pipe read/write
    }
  }
}

/**
 * @param {WebSocketServer}webSocketServer
 * @param {WebSocket}webSocket
 * @param {ParsedUrlQuery}query
 * @private
 */
function _handleFirstUpgrade (webSocketServer, webSocket, query) {
  // create new session on first connection
  const appEndpointSession = AppEndpointSession.create(query)
  appEndpointSession.onDestroy().then(() => process.exit(0))
  appEndpointSession.handleConnection(webSocket, query)

  process.on('message', (request, socket) => {
    const { query, ...req } = request[0]
    const head = request[1]

    // handle subsequent upgrades
    webSocketServer.handleUpgrade(
      req,
      socket,
      head,
      webSocket => appEndpointSession.handleConnection(webSocket, query)
    )
  })
}

function main () {
  const logger = Logger({
    name: `app-endpoint-session-process`,
    prettyPrint: (process.env.DEBUG && process.env.DEBUG == true)
  })
  process.on('uncaughtException', e => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
    logger.error('error object stack: ')
    logger.error(e.stack)
  })

  SurfaceBufferEncoding.init()

  const webSocketServer = /** @type {WebSocketServer} */new Server(sessionConfig.webSocketServer.options)

  process.once('message', (request, socket) => {
    const { query, ...req } = request[0]
    const head = request[1]

    // handle first websocket connection
    webSocketServer.handleUpgrade(req, socket, head, webSocket => _handleFirstUpgrade(webSocketServer, webSocket, query))
  })
}

main()
