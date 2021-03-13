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
    prettyPrint: process.env.DEBUG && process.env.DEBUG == true,
    level: process.env.DEBUG && process.env.DEBUG == true ? 20 : 30,
})

require('json5/lib/register')

const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const { /** @type {WebSocketServer} */ Server } = require('ws')

const { sessionConfig } = require('../config.json5')
const SurfaceBufferEncoding = require('./SurfaceBufferEncoding')
const NativeCompositorSession = require('./NativeCompositorSession')

class AppEndpointSession {
    /**
     * @param {string}compositorSessionId
     * @return {AppEndpointSession}
     */
    static create({ compositorSessionId }) {
        const logger = Logger({
            name: `app-endpoint-session::${compositorSessionId}`,
            prettyPrint: process.env.DEBUG && process.env.DEBUG == true,
            level: process.env.DEBUG && process.env.DEBUG == true ? 20 : 30,
        })
        const nativeCompositorSession = NativeCompositorSession.create(
            compositorSessionId
        )
        const appEndpointSession = new AppEndpointSession(
            logger,
            nativeCompositorSession,
            compositorSessionId
        )
        nativeCompositorSession
            .onDestroy()
            .then(() => appEndpointSession.destroy())
        logger.info(`Session started.`)
        return appEndpointSession
    }

    /**
     * @param logger
     * @param {NativeCompositorSession}nativeCompositorSession
     * @param {string}compositorSessionId
     */
    constructor(logger, nativeCompositorSession, compositorSessionId) {
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
        this._destroyPromise = new Promise((resolve) => {
            this._destroyResolve = resolve
        })
    }

    /**
     * @return {Promise<void>}
     */
    onDestroy() {
        return this._destroyPromise
    }

    destroy() {
        this._logger.info(`Session destroyed.`)
        this._destroyResolve()
    }

    /**
     * @param {WebSocket}webSocket
     * @param {ParsedUrlQuery}query
     */
    async createWlConnection(webSocket, query) {
        const clientId = Number.parseInt(query['clientId'])
        this._nativeCompositorSession.socketForClient(webSocket, clientId)
    }

    /**
     * @param {string}image
     */
    async launchDockerImage(image) {
        // const childLogger = Logger({
        //     name: image,
        //     prettyPrint: process.env.DEBUG && process.env.DEBUG == true,
        //     level: process.env.DEBUG && process.env.DEBUG == true ? 20 : 30,
        // })

        // TODO link compositor volume with unix socket to client

        // Create the container.
        // TODO log container output
        const container = await docker.createContainer({
            AttachStderr: false,
            AttachStdin: false,
            AttachStdout: false,
            Image: image,
            OpenStdin: false,
            StdinOnce: false,
            Tty: false,
            Env: {
                GDK_BACKEND: 'wayland',
                QT_QPA_PLATFORM: 'wayland',
                XDG_SESSION_TYPE: 'wayland',
                WAYLAND_DISPLAY: `${this._nativeCompositorSession.waylandDisplay}`,
            },
        })

        // Start the container.
        await container.run()

        // We wait for container response.
        await container.wait()

        // We remove the container after its execution. This is the same as `--rm`.
        container.remove()
    }

    /**
     * @param {WebSocket}webSocket
     * @param {ParsedUrlQuery}query
     */
    async launchApplication(webSocket, query) {
        const applicationId = query['launch']

        const appConfig =
            /** @type{{image: string}} */ sessionConfig.apps[applicationId]
        if (appConfig) {
            try {
                this.launchDockerImage(appConfig.image)
                this._nativeCompositorSession.childSpawned(webSocket)
            } catch (e) {
                this._logger.error(
                    `Application: ${applicationId} failed to start.`
                )
                this._logger.error(
                    '\tname: ' +
                        e.name +
                        ' message: ' +
                        e.message +
                        ' text: ' +
                        e.text
                )
                this._logger.error('error object stack: ')
                this._logger.error(e.stack)

                webSocket.close(
                    4503,
                    `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${applicationId} failed to start.`
                )
            }
        } else {
            this._logger.error(
                `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${applicationId} not found.`
            )
            webSocket.close(
                4404,
                `[app-endpoint-session: ${this.compositorSessionId}] - Application: ${applicationId} not found.`
            )
        }
    }

    /**
     * @param {WebSocket}webSocket
     * @param {ParsedUrlQuery}query
     */
    handleIncomingDataTransfer(webSocket, query) {
        const transferArgs = {
            fd: query['fd'],
            compositorSessionId: query['compositorSessionId'],
        }
        this._nativeCompositorSession.appEndpointWebFS.incomingDataTransfer(
            webSocket,
            transferArgs
        )
    }

    /**
     * @param {WebSocket}webSocket
     * @param {IncomingHttpHeaders}headers
     * @param {ParsedUrlQuery}query
     */
    handleConnection(webSocket, headers, query) {
        try {
            this._logger.debug(`New web socket open.`)
            if (query['clientId']) {
                this.createWlConnection(webSocket, query)
            } else if (query['launch']) {
                this.launchApplication(webSocket, query)
            } else if (query['fd']) {
                this.handleIncomingDataTransfer(webSocket, query)
            }
        } catch (e) {
            this._logger.error(
                '\tname: ' +
                    e.name +
                    ' message: ' +
                    e.message +
                    ' text: ' +
                    e.text
            )
            this._logger.error('error object stack: ')
            this._logger.error(e.stack)
            webSocket.close(
                4503,
                `[app-endpoint-session: ${this.compositorSessionId}] - Server encountered an exception.`
            )
        }
    }
}

function main() {
    process.on('uncaughtException', (e) => {
        logger.error(
            '\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text
        )
        logger.error('error object stack: ')
        logger.error(e.stack)
    })

    SurfaceBufferEncoding.init()

    const webSocketServer = /** @type {WebSocketServer} */ new Server(
        sessionConfig.webSocketServer.options
    )
    let appEndpointSession = undefined

    process.on('message', (request, socket) => {
        const { query, ...req } = request[0]
        const head = request[1]
        if (socket) {
            if (appEndpointSession === undefined) {
                // handle first websocket connection
                appEndpointSession = AppEndpointSession.create(query)
                appEndpointSession.onDestroy().then(() => process.exit(0))
            }
            // handle subsequent upgrades
            webSocketServer.handleUpgrade(req, socket, head, (webSocket) =>
                appEndpointSession.handleConnection(
                    webSocket,
                    req.headers,
                    query
                )
            )
        } else {
            logger.warn('Received a non-existent websocket. Ignoring')
        }
    })
}

main()
