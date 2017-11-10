'use strict'

module.exports = class LocalDataOffer {
  static create () {
    return new LocalDataOffer()
  }

  constructor () {
    this.resource = null
  }

  offer (mimeType) {
    this.resource.offer(mimeType)
  }

  sourceActions (sourceActions) {
    this.resource.sourceActions(sourceActions)
  }

  action (dndAction) {
    this.resource.action(dndAction)
  }
}
