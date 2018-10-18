'use strict'

class AppEndpointSession {
  /**
   * @param {WebSocket.Server} wss
   * @param {WebSocket} compositorWebSocket
   * @param {string}id
   * @param {{}}headers
   * @param {Object}method
   * @param {Socket}socket
   * @param {Buffer}head
   * @returns {Promise<AppEndpointSession>}
   */
  static async create (wss, compositorWebSocket, id, headers, method, head, socket) {
    return new Promise((resolve) => {
      console.log(`App endpoint session ${id} received web socket upgrade request. Will establishing web socket connection with app endpoint.`)
      wss.handleUpgrade({
        headers: headers,
        method: method
      }, socket, head, (endpointWebSocket) => {
        console.log(`App endpoint session [${id}] web socket is open.`)
        const appEndpointSession = new AppEndpointSession(compositorWebSocket, endpointWebSocket, id)

        endpointWebSocket.onmessage = (event) => {
          appEndpointSession._onMessage(event)
        }
        endpointWebSocket.onclose = (event) => {
          appEndpointSession._onClose(event)
        }
        endpointWebSocket.onerror = (event) => {
          appEndpointSession._onError(event)
        }

        resolve(appEndpointSession)
      })
    })
  }

  /**
   * @param {WebSocket}compositorWebSocket
   * @param {WebSocket}webSocket
   * @param {string}id
   */
  constructor (compositorWebSocket, webSocket, id) {
    /**
     * @type {WebSocket}
     * @private
     */
    this._compositorWebSocket = compositorWebSocket
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
    this._destroyPromise = new Promise((resolve) => {
      this._destroyResolve = resolve
    })
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
      const message = JSON.parse(/** @types {string} */eventData)
      if (message.intention === 'pair' && message.phase === 'signaling') {
        this._compositorWebSocket.send(eventData)
      }
    } catch (error) {
      console.error(`App endpoint session [${this.id}] failed to handle incoming message. \n${error}\n${error.stack}`)
      this.webSocket.close(4007, `App endpoint session [${this.id}] received an illegal message.`)
    }
  }

  /**
   * @param event
   * @private
   */
  _onClose (event) {
    console.log(`App endpoint session [${this.id}] web socket is closed. ${event.code}: ${event.reason}`)
    this.webSocket = null
    this.destroy()
  }

  /**
   * @param event
   * @private
   */
  _onError (event) {
    console.error(`App endpoint session [${this.id}] web socket is in error.`)
  }
}

module.exports = AppEndpointSession
