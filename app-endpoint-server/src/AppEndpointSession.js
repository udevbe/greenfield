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
const logger = Logger({
  name: `app-endpoint-session-process`,
  prettyPrint: (process.env.DEBUG && process.env.DEBUG == true),
  level: (process.env.DEBUG && process.env.DEBUG == true) ? 20 : 30
})

require('json5/lib/register')
// eslint-disable-next-line camelcase
const child_process = require('child_process')

const { /** @type {WebSocketServer} */Server } = require('ws')

const { sessionConfig } = require('../config.json5')
const SurfaceBufferEncoding = require('./SurfaceBufferEncoding')
const NativeCompositorSession = require('./NativeCompositorSession')

// const { authorizeApplicationLaunch } = require('./CloudFunctions')

class AppEndpointSession {
  /**
   * @param {string}compositorSessionId
   * @return {AppEndpointSession}
   */
  static create ({ compositorSessionId }) {
    const logger = Logger({
      name: `app-endpoint-session::${compositorSessionId}`,
      prettyPrint: (process.env.DEBUG && process.env.DEBUG == true),
      level: (process.env.DEBUG && process.env.DEBUG == true) ? 20 : 30
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
   * @param {IncomingHttpHeaders}headers
   * @param {ParsedUrlQuery}query
   */
  async handleConnection (webSocket, headers, query) {
    try {
      this._logger.debug(`New web socket open.`)
      if (query['clientId']) {
        this._nativeCompositorSession.socketForClient(webSocket, Number.parseInt(query.clientId))
      } else if (query['launch']) {
        const applicationId = query['launch']
        // FIXME authorization check disabled beause it's slow and broken.
        // try {
        //   await authorizeApplicationLaunch(headers['sec-websocket-protocol'], applicationId)
        // } catch (e) {
        //   this._logger.error(`Application: ${applicationId} failed to start.`)
        //   this._logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
        //   this._logger.error('error object stack: ')
        //   this._logger.error(e.stack)
        //   webSocket.close(4403, `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${applicationId} access denied.`)
        //   return
        // }

        const appConfig = /** @type{{bin: string, args: Array<string>}} */sessionConfig.apps[applicationId]
        if (appConfig) {
          try {
            const childProcess = child_process.spawn(appConfig.bin, appConfig.args, {
              env: {
                ...process.env,
                'GDK_BACKEND': 'wayland',
                'XDG_SESSION_TYPE': 'wayland',
                'WAYLAND_DISPLAY': `${this._nativeCompositorSession.waylandDisplay}`
              }
            })

            const childLogger = Logger({
              name: `${appConfig.bin} ${appConfig.args}`,
              prettyPrint: (process.env.DEBUG && process.env.DEBUG == true),
              level: (process.env.DEBUG && process.env.DEBUG == true) ? 20 : 30
            })
            childProcess.stdout.on('data', data => childLogger.info(`stdout: ${data}`))
            childProcess.stderr.on('data', data => childLogger.error(`stderr: ${data}`))
            childProcess.on('close', code => {
              const msg = `child process: ${appConfig.bin} ${appConfig.args} exited with code: ${code}`
              if (code) {
                this._logger.error(msg)
              } else {
                this._logger.info(msg)
              }
            })

            this._nativeCompositorSession.childSpawned(webSocket)
          } catch (e) {
            this._logger.error(`Application: ${applicationId} failed to start.`)
            this._logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
            this._logger.error('error object stack: ')
            this._logger.error(e.stack)

            webSocket.close(4503, `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${applicationId} failed to start.`)
          }
        } else {
          this._logger.error(`[app-endpoint-session: ${this.compositorSessionId}] - Application: ${applicationId} not found.`)
          webSocket.close(4404, `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${applicationId} not found.`)
        }
      } else if (query.fd) {
        this._nativeCompositorSession.appEndpointWebFS.incomingDataTransfer(webSocket, query)
      }
    } catch (e) {
      webSocket.close(4503, `[app-endpoint-session: ${this.compositorSessionId}] - Server encountered an exception.`)
    }
  }
}

/**
 * @param {WebSocketServer}webSocketServer
 * @param {WebSocket}webSocket
 * @param {IncomingHttpHeaders}headers
 * @param {ParsedUrlQuery}query
 * @private
 */
async function _handleFirstUpgrade (webSocketServer, webSocket, headers, query) {
  // create new session on first connection
  const appEndpointSession = AppEndpointSession.create(query)
  appEndpointSession.onDestroy().then(() => process.exit(0))
  await appEndpointSession.handleConnection(webSocket, headers, query)

  process.on('message', (request, socket) => {
    const { query, ...req } = request[0]
    const head = request[1]

    if (socket) {
      // handle subsequent upgrades
      webSocketServer.handleUpgrade(
        req,
        socket,
        head,
        webSocket => appEndpointSession.handleConnection(webSocket, req.headers, query)
      )
    } else {
      logger.warn('Received a non-existent websocket. Ignoring')
    }
  })
}

function main () {
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
    if (socket) {
      // handle first websocket connection
      webSocketServer.handleUpgrade(req, socket, head, webSocket => _handleFirstUpgrade(webSocketServer, webSocket, req.headers, query))
    } else {
      logger.warn('Received a non-existent websocket. Ignoring')
    }
  })
}

main()
