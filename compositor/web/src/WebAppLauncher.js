export default class WebAppLauncher {
  /**
   * @param {WebAppSocket}webAppSocket
   * @return {WebAppLauncher}
   */
  static create (webAppSocket) {
    return new WebAppLauncher(webAppSocket)
  }

  /**
   * @param {WebAppSocket}webAppSocket
   */
  constructor (webAppSocket) {
    /**
     * @type {WebAppSocket}
     * @private
     */
    this._webAppSocket = webAppSocket
    /**
     * @type {Object.<number, Worker>}
     */
    this.webAppWorkers = {}
    /**
     * @type {number}
     * @private
     */
    this._nextWebAppId = 1
  }

  /**
   * @param {string}webAppSrc
   * @return {number}
   */
  launch (webAppSrc) {
    const webAppWorker = new Worker(webAppSrc)
    const webAppId = this._nextWebAppId++
    this.webAppWorkers[webAppId] = webAppWorker
    this._webAppSocket.onWebAppWorker(webAppWorker)
    return webAppId
  }

  /**
   * @param {number}webAppId
   */
  terminate (webAppId) {
    this.webAppWorkers[webAppId].terminate()
    delete this.webAppWorkers[webAppId]
  }
}
