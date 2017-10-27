'use strict'

module.exports = class LocalClientSession {
  static create (clientSessions, wlDisplay) {
    return new LocalClientSession(clientSessions, wlDisplay)
  }

  constructor (clientSessions, wlDisplay) {
    this.flush = false
    this.wlDisplay = wlDisplay
    this._clientSessions = clientSessions
  }

  markFlush () {
    this.flush = true
    for (const clientSession of this._clientSessions) {
      if (!clientSession.flush) {
        return
      }
    }
    this.flush = false
    for (const clientSession of this._clientSessions) {
      clientSession.flush = false
    }
    this.wlDisplay.flushClients()
  }
}
