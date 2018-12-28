'use strict'

const WebSocket = require('ws')

const AppEndpointSession = require('./AppEndpointSession')
const DesktopShellMessageHandler = require('./DesktopShellMessageHandler')
const RTCSignalMessageHandler = require('./RTCSignalMessageHandler')

class CompositorSession {
  /**
   * @param {string}id
   * @param {{}}headers
   * @param {Object}method
   * @param {Socket}socket
   * @param {Buffer}head
   * @returns {Promise<CompositorSession>}
   */
  static async create (id, headers, method, head, socket) {
    return new Promise((resolve) => {
      const wss = new WebSocket.Server({
        noServer: true,
        handshakeTimeout: 2000
      })
      process.env.DEBUG && console.log(`[compositor-session: ${id}] - New instance created.`)
      wss.handleUpgrade({
        headers: headers,
        method: method
      }, socket, head, (sessionWebSocket) => {
        process.env.DEBUG && console.log(`[compositor-session: ${id}] - Browser web socket is open.`)
        const compositorSession = new CompositorSession(wss, sessionWebSocket, id)

        sessionWebSocket.addEventListener('message', (event) => compositorSession._onMessage(event))
        sessionWebSocket.onclose = (event) => compositorSession._onClose(event)
        sessionWebSocket.onerror = (event) => compositorSession._onError(event)

        resolve(compositorSession)
      })
    })
  }

  /**
   *
   * @param {WebSocket.Server} wss
   * @param {WebSocket}webSocket
   * @param {string}compositorSessionId
   */
  constructor (wss, webSocket, compositorSessionId) {
    /**
     * @type {WebSocket.Server}
     * @private
     */
    this._wss = wss
    /**
     * @type {string}
     */
    this.id = compositorSessionId
    /**
     * @type {WebSocket}
     */
    this.webSocket = webSocket
    /**
     * @type {Object.<string,AppEndpointSession>}
     */
    this.appEndpointSessions = {}
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

    /**
     * @type {{signalingServer: RTCSignalMessageHandler, desktopShell: DesktopShellMessageHandler}}
     * @private
     */
    this._compositorMessageHandlers = {
      signalingServer: RTCSignalMessageHandler.create(this),
      desktopShell: DesktopShellMessageHandler.create(this)
    }
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  /**
   * Handles an incoming web socket connection coming from an application endpoint.
   * @param {string}appEndpointSessionId
   * @param {{}}headers
   * @param {Object}method
   * @param {Buffer}head
   * @param {Socket}socket
   * @returns {Promise<AppEndpointSession>}
   */
  async pair (appEndpointSessionId, headers, method, head, socket) {
    const appEndpointSession = await AppEndpointSession.create(this._wss, this, appEndpointSessionId, headers, method, head, socket)
    this.appEndpointSessions[appEndpointSessionId] = appEndpointSession
    appEndpointSession.onDestroy().then(() => delete this.appEndpointSessions[appEndpointSessionId])
    this.onDestroy().then(() => appEndpointSession.destroy())

    // Requests the browser to start a new webRTC peer connection.
    this.webSocket.send(JSON.stringify({
      object: 'rtcSocket',
      method: 'connect',
      args: { appEndpointSessionId }
    }))
  }

  destroy () {
    if (this._destroyResolve) {
      this._wss.close()
      this._destroyResolve()
      this._destroyResolve = null
    }
  }

  /**
   * @param {MessageEvent}event
   * @private
   */
  _onMessage (event) {
    const eventData = event.data
    process.env.DEBUG && console.log(`[compositor-session: ${this.id}] - Received incoming browser message: ${eventData}`)``
    try {
      const message = JSON.parse(/** @types {string} */eventData)
      const { object, method, args } = message
      this._compositorMessageHandlers[object][method](args)
    } catch (error) {
      console.error(`[compositor-session: ${this.id}] - Failed to handle incoming message. object=${object}:method=${method}:args=${args}\n${error}\n${error.stack}`)
      this.webSocket.close(4007, `Received an illegal message`)
    }
  }

  /**
   * @param {CloseEvent}event
   * @private
   */
  _onClose (event) {
    console.log(`[compositor-session: ${this.id}] - Browser web socket is closed. ${event.code}: ${event.reason}`)
    this.destroy()
  }

  _onError () {
    console.error(`[compositor-session: ${this.id}] - Browser web socket is in error.`)
  }
}

module.exports = CompositorSession
