'use strict'

module.exports = class LocalDataSource {
  static create () {
    return new LocalDataSource()
  }

  constructor () {
    this.resource = null
  }

  target (mimeType) {
    this.resource.target(mimeType)
  }

  send (mimeType, transfer) {
    // TODO implement blob transfer
    // TODO implement c/p in such a way that we don't transfer data to the browser when copying between native clients
    // this.resource.send(mimeType, transfer)
  }

  cancelled () {
    this.resource.cancelled()
  }

  dndDropPerformed () {
    this.resource.dndDropPerformed()
  }

  dndFinished () {
    this.resource.dndFinished()
  }

  action (dndAction) {
    this.resource.action(dndAction)
  }
}
