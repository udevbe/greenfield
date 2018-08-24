'use strict'

class LocalDataOffer {
  /**
   * @return {LocalDataOffer}
   */
  static create () {
    return new LocalDataOffer()
  }

  constructor () {
    this.resource = null
  }

  /**
   * @param {string}mimeType
   */
  offer (mimeType) {
    this.resource.offer(mimeType)
  }

  /**
   * @param {number}sourceActions
   */
  sourceActions (sourceActions) {
    this.resource.sourceActions(sourceActions)
  }

  /**
   * @param {number}dndAction
   */
  action (dndAction) {
    this.resource.action(dndAction)
  }
}

module.exports = LocalDataOffer
