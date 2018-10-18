'use strict'

const crypto = require('crypto')

const WebSocket = require('ws')

const config = require('./config')

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
  static create (compositorSessionId) {
    // TODO setup a pairing websocket connection and create a rtc peer connection, using the websocket connection
    // as signaling channel.
    const appEndpointSessionId = this._uuidv4()
    return new Promise((resolve, reject) => {
      const websocketUrl = `${config['websocket-connection']['url']}/pairAppEndpoint/${appEndpointSessionId}/${compositorSessionId}`

      // TODO listen for connection failure and reject promise
      const webSocket = new WebSocket(websocketUrl)
      const appEndpointCompositorPair = new AppEndpointCompositorPair(webSocket, appEndpointSessionId, compositorSessionId)

      webSocket.onopen = (e) => {
        webSocket.onmessage = (e) => {
          appEndpointCompositorPair._onMessage(e)
        }
        webSocket.onclose = (e) => {
          appEndpointCompositorPair._onClose(e)
        }
        webSocket.onerror = (e) => {
          appEndpointCompositorPair._onError(e)
        }

        resolve(appEndpointCompositorPair)
      }
    })
  }

  /**
   * @param {WebSocket}webSocket
   * @param {string}appEndpointSessionId
   * @param {string}compositorSessionId
   */
  constructor (webSocket, appEndpointSessionId, compositorSessionId) {
    this.webSocket = webSocket
    this.appEndpointSessionId = appEndpointSessionId
    this.compositorSessionId = compositorSessionId
    this._destroyResolve = null
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

  destroy () {
    this._destroyResolve()
  }

  _onMessage (event) {
    // TODO handle webrtc peer connection signaling setup
  }

  _onClose (event) {
    console.log(`App endpoint session ${this.appEndpointSessionId} web socket is closed. ${event.code}: ${event.reason}`)
    this.destroy()
  }

  _onError (event) {
    console.error(`App endpoint session ${this.appEndpointSessionId} web socket is in error.`)
  }
}

module.exports = AppEndpointCompositorPair
