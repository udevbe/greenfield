'use strict'

const crypto = require('crypto')
const WebSocket = require('ws')

const { session: sessionConfig } = require('./config')
const RTCConnectionPool = require('./rtc/RTCConnectionPool')
const RTCSignaling = require('./rtc/RTCSignaling')
const NativeCompositorSession = require('./NativeCompositorSession')

class AppEndpointCompositorPair {
  /**
   * @returns {string}
   * @private
   */
  static _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  /**
   * @param {string}compositorSessionId
   * @returns {Promise<AppEndpointCompositorPair>}
   */
  static async create (compositorSessionId) {
    const appEndpointSessionId = this._uuidv4()
    const appEndpointCompositorPair = await new Promise((resolve, reject) => {
      const websocketUrl = `${sessionConfig['web-socket-connection']['url']}/pairAppEndpoint/${appEndpointSessionId}/${compositorSessionId}`

      // TODO listen for connection failure and reject promise
      const webSocket = new WebSocket(websocketUrl)
      const appEndpointCompositorPair = new AppEndpointCompositorPair(webSocket, appEndpointSessionId, compositorSessionId)
      process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointSessionId}] - New instance created for compositor session: ${compositorSessionId}.`)

      webSocket.onclose = e => appEndpointCompositorPair._onClose(e)
      webSocket.onerror = e => reject(e.error)
      webSocket.onmessage = e => appEndpointCompositorPair._onMessage(e)

      webSocket.onopen = () => {
        webSocket.onerror = (e) => appEndpointCompositorPair._onError(e)
        console.log(`[app-endpoint: ${appEndpointSessionId}] - Web socket connected to ${websocketUrl}.`)
        resolve(appEndpointCompositorPair)
      }
    })

    const communicationChannelFactory = this._communicationChannelFactory(appEndpointCompositorPair)
    NativeCompositorSession.create(appEndpointCompositorPair, communicationChannelFactory)

    return appEndpointCompositorPair
  }

  /**
   * @param appEndpointCompositorPair
   * @return {CommunicationChannelFactory}
   * @private
   */
  static _communicationChannelFactory (appEndpointCompositorPair) {
    // TODO get factory type from config
    appEndpointCompositorPair.messageHandlers['RTCSignaling'] = RTCSignaling.create(this)
    return RTCConnectionPool.get(appEndpointCompositorPair, appEndpointCompositorPair.compositorSessionId)
  }

  /**
   * @param {WebSocket}webSocket
   * @param {string}appEndpointSessionId
   * @param {string}compositorSessionId
   */
  constructor (webSocket, appEndpointSessionId, compositorSessionId) {
    /**
     * @type {WebSocket}
     */
    this.webSocket = webSocket
    /**
     * @type {string}
     */
    this.appEndpointSessionId = appEndpointSessionId
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
    /**
     * @type {Object.<string, Object>}
     */
    this.messageHandlers = {}
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    this._destroyResolve()
  }

  /**
   * @param {MessageEvent}event
   * @private
   */
  _onMessage (event) {
    const eventData = event.data
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointSessionId}] - Message received: ${eventData}.`)
    const message = JSON.parse(/** @types {string} */eventData)
    const { object, method, args } = message
    try {
      this.messageHandlers[object][method](args)
    } catch (error) {
      process.env.DEBUG && console.error(`[app-endpoint: ${this.appEndpointSessionId}] - failed to handle incoming message. object=${object}:method=${method}:args=${args}\n${error}\n${error.stack}`)
      this.webSocket.close(4007, `Web socket received an illegal message.`)
    }
  }

  /**
   * @param {CloseEvent}event
   * @private
   */
  _onClose (event) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointSessionId}] - Web socket is closed. ${event.code}: ${event.reason}.`)
    this.destroy()
  }

  /**
   * @param {Event}event
   * @private
   */
  _onError (event) {
    process.env.DEBUG && console.error(`[app-endpoint: ${this.appEndpointSessionId}] - Web socket is in error. ${event}.`)
  }

  /**
   * @param {string}remotePeerUUID
   * @param {*}signal
   */
  sendSignal (remotePeerUUID, signal) {
    this.webSocket.send(JSON.stringify({
      target: remotePeerUUID,
      payload: signal
    }))
  }
}

module.exports = AppEndpointCompositorPair
