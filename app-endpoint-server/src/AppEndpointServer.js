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

const childProcess = require('child_process')
const path = require('path')

const http = require('http')
const url = require('url')

const { serverConfig } = require('../config.json5')

const uuidRegEx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

class AppEndpointServer {
  /**
   * @returns {AppEndpointServer}
   */
  static create () {
    const logger = Logger({
      name: `app-endpoint-server`,
      prettyPrint: (process.env.DEBUG && process.env.DEBUG == true)
    })

    const server = http.createServer()
    const { timeout, hostname, port } = serverConfig.httpServer
    server.setTimeout(timeout)
    const appEndpointDaemon = new AppEndpointServer(logger)
    server.on('upgrade', (request, socket, head) => appEndpointDaemon.handleHttpUpgradeRequest(request, socket, head))
    server.listen(port, hostname)
    logger.info(`Listening on ${hostname}:${port}.`)

    return appEndpointDaemon
  }

  constructor (logger) {
    /**
     * @private
     */
    this._logger = logger
    /**
     * @type {Object.<string, ChildProcess>}
     * @private
     */
    this._appEndpointSessionForks = {}
    /**
     * @type {function():void}
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
   * @param {IncomingMessage}request
   * @param {Socket}socket
   * @param {Buffer}head
   */
  handleHttpUpgradeRequest (request, socket, head) {
    // TODO handle jwt authentication
    const wsURL = url.parse(request.url, true)
    const compositorSessionId = wsURL.query.compositorSessionId

    this._logger.info(`Received web socket upgrade request with compositor session id: ${compositorSessionId}. Delegating to a session child process.`)
    if (compositorSessionId && uuidRegEx.test(compositorSessionId)) {
      let appEndpointSessionFork = this._appEndpointSessionForks[compositorSessionId]
      if (!appEndpointSessionFork) {
        appEndpointSessionFork = this.createAppEndpointSessionFork(compositorSessionId)
        this.onDestroy().then(() => {
          this._logger.info(`Killing  app-endpoint-session::${compositorSessionId}]. Sending child ${appEndpointSessionFork.pid} SIGKILL.`)
          appEndpointSessionFork.kill('SIGKILL')
        })
      }

      appEndpointSessionFork.send([{
        headers: request.headers,
        method: request.method,
        query: wsURL.query
      }, head], socket)
    } else {
      this._logger.error(`Received web socket upgrade request with compositor session id: ${compositorSessionId}. Id is not a valid uuid.`)
      socket.destroy()
    }
  }

  /**
   * @param {string} compositorSessionId
   * @return {ChildProcess}
   */
  createAppEndpointSessionFork (compositorSessionId) {
    this._logger.info('Creating new session child process.')
    const configPath = process.argv[2]
    const child = childProcess.fork(path.join(__dirname, 'AppEndpointSession.js'), configPath == null ? [] : [`${configPath}`])

    const removeChild = () => {
      this._logger.info(`Session child [${child.pid}] exit.`)
      delete this._appEndpointSessionForks[compositorSessionId]
    }

    child.on('exit', removeChild)
    child.on('SIGINT', () => {
      this._logger.info(`Child ${child.pid} received SIGINT.`)
      child.exit()
    })
    child.on('SIGTERM', () => {
      this._logger.info(`Child ${child.pid} received SIGTERM.`)
      child.exit()
    })

    this._appEndpointSessionForks[compositorSessionId] = child
    return child
  }

  /**
   * @returns {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    if (this._destroyResolve) {
      this._logger.info(`Destroyed.`)
      this._destroyResolve()
      this._destroyResolve = null
    }
  }
}

module.exports = AppEndpointServer
