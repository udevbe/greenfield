'use strict'

module.exports = class LocalShell {
  static create () {
    return new LocalShell()
  }

  constructor () {
    this.resource = null
  }
}
