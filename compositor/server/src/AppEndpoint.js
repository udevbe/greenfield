class AppEndpoint {
  /**
   * @param {WebSocket}ws
   * @param {string}appEndpointId
   * @returns {AppEndpoint}
   */
  static create (ws, appEndpointId) {
    process.env.DEBUG && console.log(`[compositor-service] - Web socket is open for [app-endpoint-daemon: ${appEndpointId}].`)

    const appEndpoint = new AppEndpoint(ws, appEndpointId)
    ws.onclose = (event) => appEndpoint._onClose(event)
    ws.onerror = (event) => appEndpoint._onError(event)
    return appEndpoint
  }

  /**
   * @param {WebSocket}ws
   * @param {string}appEndpointId
   */
  constructor (ws, appEndpointId) {
    this.appEndpointId = appEndpointId
    /**
     * @type {WebSocket}
     * @private
     */
    this._webSocket = ws
    /**
     * @type {function:void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise((resolve, reject) => {
      this._destroyResolve = resolve
    })
  }

  destroy () {
    this._destroyResolve()
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  _onClose (event) {
    console.log(`[app-endpoint-daemon ${this.appEndpointId}] Web socket is closed. ${event.code}: ${event.reason}`)
    this.destroy()
  }

  _onError (event) {
    console.error(`[app-endpoint-daemon ${this.appEndpointId}] Web socket is in error.`)
  }

  /**
   * @param {...string}compositorSessionIds
   */
  announceCompositors (...compositorSessionIds) {
    compositorSessionIds.forEach(compositorSessionId => {
      this._webSocket.send(JSON.stringify({
        intent: 'announceCompositor',
        compositorSessionId: compositorSessionId
      }))
    })
  }
}

module.exports = AppEndpoint
