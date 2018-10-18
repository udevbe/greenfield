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

      webSocket.onmessage = (event) => {
        session._onMessage(event)
      }
      webSocket.onopen = (event) => {
        resolve(session)
      }
      webSocket.onclose = (event) => {
        session._onClose(event)
      }
      webSocket.onerror = (event) => {
        // TODO reject promise if connection failed
        session._onError(event)
      }
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
     * @type {{}}
     * @private
     */
    this._clients = {}
    /**
     * @type {WebSocket}
     * @private
     */
    this._ws = webSocket
  }

  _onMessage (event) {
    // TODO handle app-endpoint pair intention
    // TODO handle new client datachannel connection
    // TODO handle app-endpoint disconnected
  }

  _onClose (event) {
    // TODO retry connection?
  }

  _onError (event) {
    // TODO log error?
  }

  flush () {
    this.display.flushClients()
  }
}
