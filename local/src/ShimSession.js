'use strict'

const LocalClient = require('./LocalClient')
const {Display, Listener, Client} = require('wayland-server-bindings-runtime')

module.exports = class ShimSession {
  static create (localSession) {
    const wlDisplay = Display.create()
    const socket = wlDisplay.addSocketAuto()
    wlDisplay.initShm()

    console.log('Created wayland socket: ' + socket)

    const shimSession = new ShimSession(localSession, wlDisplay)
    const clientListener = Listener.create(shimSession.onClientCreated.bind(shimSession))
    shimSession.clientListener = clientListener
    wlDisplay.addClientCreatedListener(clientListener)

    return shimSession
  }

  end (reason) {
    console.log('Closing shim compositor: %s', reason)
    this.stopLoop()
    this.wlDisplay.destroy()
  }

  constructor (localSession, wlDisplay) {
    this.localSession = localSession
    this.wlDisplay = wlDisplay
    this.localClients = []
  }

  onClientCreated (listenerPtr, clientPtr) {
    console.log('Wayland client connected.')
    // stop the wayland loop to keep clients from trying to bind to shim globals
    this.stopLoop()
    const client = new Client(clientPtr)

    this.localSession.createConnection().then((wfcConnection) => {
      return LocalClient.create(wfcConnection, client)
    }).then((localClient) => {
      this.localClients.push(localClient)
      // client can now safely bind to shim globals
      this.startLoop()
      return localClient.onDestroy()
    }).then((localClient) => {
      this.localClients.splice(this.localClients.indexOf(localClient), 1)
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
    setImmediate(() => {
      if (this._loop) {
        this.wlDisplay.flushClients()
        this.wlDisplay.eventLoop.dispatch(0)
        this._doLoop()
      }
    })
  }

  stopLoop () {
    this._loop = false
  }
}
