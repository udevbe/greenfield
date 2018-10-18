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
    this._ws = ws
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {

  }

  /**
   * @param {...string}compositorSessionIds
   */
  announceCompositors (...compositorSessionIds) {
    compositorSessionIds.forEach(compositorSessionId => {
      this._ws.send(JSON.stringify({
        intent: 'announceCompositor',
        compositorSessionId: compositorSessionId
      }))
    })
  }
}

module.exports = AppEndpoint
