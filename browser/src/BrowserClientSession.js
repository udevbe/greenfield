'use strict'

export default class BrowserClientSession {
  static create (grClientSessionResource) {
    return new BrowserClientSession(grClientSessionResource)
  }

  constructor (grClientSessionResource) {
    this.resource = grClientSessionResource
  }

  markFlush () {
    this.resource.markFlush()
  }
}
