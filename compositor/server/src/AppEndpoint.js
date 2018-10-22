class AppEndpoint {
  /**
   * @param {WebSocket}ws
   * @returns {AppEndpoint}
   */
  static create (ws) {
    return new AppEndpoint(ws)
  }

  /**
   * @param {WebSocket}ws
   */
  constructor (ws) {
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

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
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
