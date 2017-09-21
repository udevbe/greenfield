'use strict'

const LocalClient = require('./LocalClient')

const wsb = require('wayland-server-bindings-runtime')
const Display = wsb.Display
const Listener = wsb.Listener
const Client = wsb.Client

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
    console.log('Closing shim compositor. Reason: ' + reason)
    this.stopLoop()
    this.wlDisplay.destroy()
  }

  constructor (localSession, wlDisplay) {
    this.localSession = localSession
    this.wlDisplay = wlDisplay
    this.localClients = []
    this.clientListener = null
  }

  onClientCreated (listenerPtr, clientPtr) {
    console.log('Wayland client connected.')
    // stop the wayland loop to keep clients from trying to bind to shim globals
    this.stopLoop()
    const client = new Client(clientPtr)
    // TODO listen for client destruction

    this.localSession.createConnection().then((wfcConnection) => {
      wfcConnection.onClose = () => {
        client.destroy()
      }
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
    setImmediate(() => {
      if (this._loop) {
        this.wlDisplay.eventLoop.dispatch(1)
        this.wlDisplay.flushClients()
        this._doLoop()
      }
    })
  }

  stopLoop () {
    this._loop = false
  }
}
