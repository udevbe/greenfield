'use strict'

export default class BrowserClientSession {
  static create (ws) {
    return new BrowserClientSession(ws)
  }

  constructor (ws) {
    this._ws = ws
  }

  destroy (resource) {

  }
}
