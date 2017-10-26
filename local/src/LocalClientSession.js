'use strict'

module.exports = class LocalClientSession {
  static create () {
    return new LocalClientSession()
  }

  constructor () {}

  markFlush () {
    this.flush = true
  }
}
