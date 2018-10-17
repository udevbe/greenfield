'use strict'

const WebSocket = require('ws')

const AppEndpointSession = require('./AppEndpointSession')

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
      console.log(`Compositor session [${id}] received web socket upgrade request. Will establishing web socket connection with browser.`)
      wss.handleUpgrade({
        headers: headers,
        method: method
      }, socket, head, (sessionWebSocket) => {
        console.log(`Compositor session [${id}] web socket is open.`)
        const compositorSession = new CompositorSession(wss, sessionWebSocket, id)

        sessionWebSocket.onmessage = (event) => {
          compositorSession._onMessage(event)
        }
        sessionWebSocket.onclose = (event) => {
          compositorSession._onClose(event)
        }
        sessionWebSocket.onerror = (event) => {
          compositorSession._onError(event)
        }

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
     * @private
     */
    this._appEndpointSessions = {}
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
  onDestroy () {
    return this._destroyPromise
  }

  /**
   * @param {string}appEndpointSessionId
   * @param {{}}headers
   * @param {Object}method
   * @param {Buffer}head
   * @param {Socket}socket
   * @returns {Promise<AppEndpointSession>}
   */
  async pair (appEndpointSessionId, headers, method, head, socket) {
    const appEndpointSession = await AppEndpointSession.create(this._wss, this.webSocket, appEndpointSessionId, headers, method, head, socket)
    this._appEndpointSessions[appEndpointSessionId] = appEndpointSession
    appEndpointSession.onDestroy().then(() => {
      delete this._appEndpointSessions[appEndpointSessionId]
    })
    this.onDestroy().then(() => {
      appEndpointSession.destroy()
    })

    // request to start a webrtc pairing session (peer connection)
    this.webSocket.send(JSON.stringify({
      intention: 'pair',
      phase: 'request',
      appEndpointSessionId: appEndpointSessionId
    }))
  }

  destroy () {
    if (this._destroyResolve) {
      this._wss.close()
      this._destroyResolve()
      this._destroyResolve = null
    }
  }

  _onMessage (event) {
    try {
      const eventData = event.data
      const message = JSON.parse(/** @types {string} */eventData)

      const {intention, phase, appEndpointSessionId} = message
      if (intention === 'pair' && phase === 'signaling') {
        const appEndpointSession = this._appEndpointSessions[appEndpointSessionId]
        if (appEndpointSession) {
          appEndpointSession.webSocket.send(eventData)
        } else {
          throw new Error(`Compositor session [${this.id}] failed to parse incoming compositor message. Property 'appEndpointSessionId' with value '${appEndpointSessionId}' did not match a known app endpoint session.`)
        }
      } else {
        throw new Error(`Compositor session [${this.id}] failed to parse incoming compositor message. Expected message with properties 'intention' and 'phase'.`)
      }
    } catch (error) {
      console.error(`Compositor session [${this.id}] failed to handle incoming message. \n${error}\n${error.stack}`)
      this.webSocket.close(4007, `Compositor session [${this.id}] received an illegal message`)
    }
  }

  _onClose (event) {
    console.log(`Compositor session [${this.id}] web socket is closed. ${event.code}: ${event.reason}`)
    this.destroy()
  }

  _onError (event) {
    console.error(`Compositor session [${this.id}] web socket is in error.`)
  }
}

module.exports = CompositorSession
