'use strict'

import westfield from 'westfield-runtime-server'
import session from './protocol/session-browser-protocol'

export default class BrowserClientSession extends westfield.Global {
  static create () {
    return new BrowserClientSession()
  }

  constructor () {
    super(session.GrClientSession.name, 1)
    this.resources = []
  }

  bindClient (client, id, version) {
    const grClientSessionResource = new session.GrClientSession(client, id, version)
    grClientSessionResource.implementation = this
    this.resources.push(grClientSessionResource)
  }

  markFlush () {
    this.resources.forEach((resource) => { resource.markFlush() })
  }
}
