'use strict'

class AppEndpointSession {
  /**
   * @param {WebSocket.Server} wss
   * @param {CompositorSession} compositorSession
   * @param {string}id
   * @param {{}}headers
   * @param {Object}method
   * @param {Buffer}head
   * @param {Socket}socket
   * @returns {Promise<AppEndpointSession>}
   */
  static async create (wss, compositorSession, id, headers, method, head, socket) {
    return new Promise((resolve) => {
      process.env.DEBUG && console.log(`[compositor-session: ${compositorSession.id}] [app-endpoint: ${id}] - New instance created.`)
      wss.handleUpgrade({
        headers: headers,
        method: method
      }, socket, head, (endpointWebSocket) => {
        const appEndpointSession = new AppEndpointSession(compositorSession, endpointWebSocket, id)

        endpointWebSocket.onmessage = (event) => appEndpointSession._onMessage(event)
        endpointWebSocket.onclose = (event) => appEndpointSession._onClose(event)
        endpointWebSocket.onerror = (event) => appEndpointSession._onError(event)

        process.env.DEBUG && console.log(`[compositor-session: ${compositorSession.id}] [app-endpoint: ${id}] - Web socket open.`)
        resolve(appEndpointSession)
      })
    })
  }

  /**
   * @param {CompositorSession} compositorSession
   * @param {WebSocket}webSocket
   * @param {string}id
   */
  constructor (compositorSession, webSocket, id) {
    /**
     * @type {CompositorSession}
     * @private
     */
    this._compositorSession = compositorSession
    /**
     * @type {WebSocket}
     */
    this.webSocket = webSocket
    /**
     * @type {string}
     */
    this.id = id

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
   * @returns {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    if (this._destroyResolve) {
      this._destroyResolve()
      this._destroyResolve = null
    }
  }

  /**
   * @param event
   * @private
   */
  _onMessage (event) {
    try {
      const eventData = event.data
      if (eventData.length > 10240) {
        throw new Error('Message length exceeded bounds.')
      }
      process.env.DEBUG && console.log(`[compositor-session: ${this._compositorSession.id}] [app-endpoint: ${this.id}] - Receiving incoming application endpoint message: ${eventData}. Forwarding to browser.`)
      const endpointMessage = JSON.parse(eventData)
      if (endpointMessage.target === this._compositorSession.id) {
        this._compositorSession.webSocket.send(JSON.stringify(endpointMessage.payload))
      } else {
        const appEndpointSession = this._compositorSession.appEndpointSessions[endpointMessage.target]
        appEndpointSession.webSocket.send(JSON.stringify(endpointMessage.payload))
      }
    } catch (error) {
      console.error(`[compositor-session: ${this._compositorSession.id}] [app-endpoint: ${this.id}] - Failed to handle incoming message. \n${error}\n${error.stack}`)
      this.webSocket.close(4007, `App endpoint session [${this.id}] received an illegal message.`)
    }
  }

  /**
   * @param event
   * @private
   */
  _onClose (event) {
    console.log(`[compositor-session: ${this._compositorSession.id}] [app-endpoint: ${this.id}] Web socket is closed. ${event.code}: ${event.reason}`)
    this.webSocket = null
    this.destroy()
  }

  /**
   * @param event
   * @private
   */
  _onError (event) {
    console.error(`[compositor-session: ${this._compositorSession.id}] [app-endpoint: ${this.id}] Web socket is in error.`)
  }
}

module.exports = AppEndpointSession
