'use strict'

import { Display } from 'westfield-runtime-server'
import WebFS from './WebFS'

/**
 * Listens for client announcements from the server.
 */
export default class Session {
  /**
   * @returns {Session}
   */
  static create () {
    const display = new Display()
    const compositorSessionId = this._uuidv4()
    DEBUG && console.log(`[compositor-session: ${compositorSessionId}] - Starting new compositor session.`)
    return new Session(display, compositorSessionId)
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
   * @param {string}compositorSessionId
   * @private
   */
  constructor (display, compositorSessionId) {
    /**
     * @type {Display}
     */
    this.display = display
    /**
     * @type {string}
     */
    this.compositorSessionId = compositorSessionId
    /**
     * @type {WebSocket|null}
     */
    this.webSocket = null
    /**
     * @type {Object.<string,Object>}
     */
    this.messageHandlers = {}
    /**
     * @type {WebFS}
     */
    this.webFS = WebFS.create(this.compositorSessionId)
  }

  /**
   * @param {function(event:CloseEvent):void}onClose
   * @return {Promise<void>}
   */
  withRemote (onClose) {
    return new Promise((resolve, reject) => {
      const websocketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const url = `${websocketProtocol}://${window.location.host}/announceCompositor/${this.compositorSessionId}`
      this.webSocket = new WebSocket(url)

      this.webSocket.onmessage = event => this._onRemoteMessage(event)
      this.webSocket.onerror = event => reject(event.error)
      this.webSocket.onopen = event => {
        this.webSocket.onerror = event => this._onRemoteError(event)
        resolve()
      }
      this.webSocket.onclose = event => {
        this._onRemoteClose(event)
        onClose(event)
      }
    })
  }

  /**
   * @param {MessageEvent}event
   * @private
   */
  _onRemoteMessage (event) {
    const eventData = event.data
    const message = JSON.parse(/** @types {string} */eventData)
    const { object, method, args } = message
    try {
      this.messageHandlers[object][method](args)
    } catch (error) {
      console.error(`[compositor-session: ${this.compositorSessionId}] - Failed to handle incoming message. object=${object}:method=${method}:args=${args}\n${error}\n${error.stack}`)
      this.webSocket.close(4007, `Compositor session [${this.compositorSessionId}] received an illegal message`)
    }

    // TODO handle app-endpoint disconnected
  }

  /**
   * @param {CloseEvent}event
   * @private
   */
  _onRemoteClose (event) {
    console.log(`[compositor-session: ${this.compositorSessionId}] - Web socket connection closed. ${event.code}: ${event.reason}.`)
    // TODO notify user?
    // TODO retry connection?

    // FIXME for now we just terminate all clients
    this.display.clients.forEach(client => client.close())
  }

  /**
   * @param {Event}event
   * @private
   */
  _onRemoteError (event) {
    console.error(`[compositor-session: ${this.compositorSessionId}] - Web socket is in error: ${event}.`)
  }

  flush () {
    this.display.flushClients()
  }
}
