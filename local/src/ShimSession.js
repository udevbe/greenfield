'use strict'

const util = require('util')
const setImmediatePromise = util.promisify(setImmediate)

const LocalClient = require('./LocalClient')

const wsb = require('wayland-server-bindings-runtime')
const Display = wsb.Display
const Listener = wsb.Listener
const Client = wsb.Client

module.exports = class ShimSession {
  static create (localSession) {
    const wlDisplay = Display.create()
    const shimSession = new ShimSession(localSession, wlDisplay)
    wlDisplay.addClientCreatedListener(Listener.create(shimSession.onClientCreated))

    return shimSession
  }

  constructor (localSession, wlDisplay) {
    this.localSession = localSession
    this.wlDisplay = wlDisplay
    this.localClients = []
  }

  onClientCreated (listenerPtr, clientPtr) {
    // stop the wayland loop to keep clients from trying to bind to shim globals
    this.stopLoop()
    const client = new Client(clientPtr)
    // TODO listen for client destruction

    this.localSession.createConnection().then((wfcConnection) => {
      return LocalClient.create(wfcConnection, client)
    }).then((localClient) => {
      this.localClients.push(localClient)
      // client can now safely bind to shim globals
      this.startLoop()
    }).catch((error) => {
      console.error(error)
      // FIXME handle error state (disconnect?)
    })
  }

  startLoop () {
    this._loop = true
    this._doLoop()
  }

  _doLoop () {
    setImmediatePromise().then(() => {
      if (this._loop) {
        this.wlDisplay.eventLoop.dispatch(0)
        this._doLoop()
      }
    })
  }

  stopLoop () {
    this._loop = false
  }
}
