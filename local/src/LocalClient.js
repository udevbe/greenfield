'use strict'

const {Listener} = require('wayland-server-bindings-runtime')

module.exports = class LocalClient {
  /**
   *
   * @param {wfc.Connection} wfcConnection westfield client connection
   * @param {wsb.Client} wlClient A native wayland client
   * @returns {LocalClient}
   */
  static create (wfcConnection, wlClient) {
    const localClient = new LocalClient(wfcConnection, wlClient)
    wlClient.addDestroyListener(Listener.create(localClient._handleDestroy.bind(localClient)))
    return localClient
  }

  /**
   *
   * @param {wfc.Connection} connection
   * @param {wsb.Client} wlClient A native wayland client
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
    // TODO unref listener

    if (this.wlClient === null) {
      return
    }
    this.wlClient = null

    console.log('Wayland client closed.')
    this._destroyedResolver(this)
    this.connection.close()
  }
}
