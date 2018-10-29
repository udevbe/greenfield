'use strict'

import { Display } from 'westfield-runtime-server'

/**
 * Listens for client announcements from the server.
 */
export default class Session {
  /**
   * @returns {Promise<Session>}
   */
  static create () {
    return new Promise((resolve, reject) => {
      DEBUG && console.log('Starting new compositor session.')
      const display = new Display()
      const websocketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const compositorSessionId = this._uuidv4()
      const url = `${websocketProtocol}://${window.location.host}/announceCompositor/${compositorSessionId}`

      const webSocket = new WebSocket(url)
      const session = new Session(display, webSocket, compositorSessionId)

      webSocket.onmessage = event => session._onMessage(event)
      webSocket.onerror = event => reject(event.error)
      webSocket.onopen = event => {
        webSocket.onerror = event => session._onError(event)
        resolve(session)
      }
      webSocket.onclose = event => session._onClose(event)
    })
  }

  /**
   * @returns {string}
   * @private
   */
  static _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  /**
   * Use Session.create(..) instead
   * @param {Display}display
   * @param {WebSocket}webSocket
   * @param {string}compositorSessionId
   * @private
   */
  constructor (display, webSocket, compositorSessionId) {
    /**
     * @type {Display}
     */
    this.display = display
    /**
     * @type {string}
     */
    this.compositorSessionId = compositorSessionId
    /**
     * @type {WebSocket}
     */
    this.webSocket = webSocket
    /**
     * @type {Object.<string,Object>}
     */
    this.messageHandlers = {}
  }

  _onMessage (event) {
    const eventData = event.data
    const message = JSON.parse(/** @types {string} */eventData)
    const { object, method, args } = message
    try {
      this.messageHandlers[object][method](args)
    } catch (error) {
      console.error(`Compositor session [${this.compositorSessionId}] failed to handle incoming message. object=${object}:method=${method}:args=${args}\n${error}\n${error.stack}`)
      this.webSocket.close(4007, `Compositor session [${this.compositorSessionId}] received an illegal message`)
    }

    // TODO handle app-endpoint disconnected
  }

  _onClose (event) {
    // TODO notify user
    // TODO retry connection?
  }

  _onError (event) {
    // TODO log error?
  }

  flush () {
    this.display.flushClients()
  }
}
