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

  send (mimeType, fd) {
    this.resource.send(mimeType, fd)
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
