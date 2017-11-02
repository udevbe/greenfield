'use strict'

module.exports = class LocalClient {
  /**
   *
   * @param {wfc.Connection} wfcConnection westfield client connection
   * @param {Client} wlClient A native wayland client
   * @returns {LocalClient}
   */
  static create (wfcConnection, wlClient) {
    const localClient = new LocalClient(wfcConnection, wlClient)
    wlClient.onDestroy().then(localClient._handleDestroy.bind(localClient))
    return localClient
  }

  /**
   *
   * @param {wfc.Connection} connection
   * @param {Client} wlClient A native wayland client
   */
  constructor (connection, wlClient) {
    this.connection = connection
    this.wlClient = wlClient
    this._wlClientDetroyedPromise = new Promise((resolve) => {
      this._destroyedResolver = resolve
    })
  }

  /**
   *
   * @returns {Promise.<LocalClient>}
   */
  onDestroy () {
    return this._wlClientDetroyedPromise
  }

  _handleDestroy () {
    if (this.wlClient === null) {
      return
    }
    this.wlClient = null

    console.log('Wayland client closed.')
    this._destroyedResolver(this)
    this.connection.close()
  }
}
