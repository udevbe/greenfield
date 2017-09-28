'use strict'

const LocalSession = require('./LocalSession')
const {Display, Listener, Client} = require('wayland-server-bindings-runtime')

module.exports = class ShimSession {
  static create (request, socket, head) {
    const wlDisplay = Display.create()
    const waylandSocket = wlDisplay.addSocketAuto()
    console.log('Created wayland socket: ' + waylandSocket)
    wlDisplay.initShm()

    // promisify shim session & resolve when local session resolves
    return LocalSession.create(request, socket, head, wlDisplay).then((localSession) => {

      const shimSession = new ShimSession(localSession, wlDisplay)
      const clientListener = Listener.create(shimSession.onClientCreated.bind(shimSession))
      // always keep ref to listener to avoid gc.
      process.on('exit', () => {clientListener})

      shimSession.clientListener = clientListener
      wlDisplay.addClientCreatedListener(clientListener)

      return shimSession
    })
  }

  end (reason) {
    console.log('Closing shim compositor: %s', reason)
    this.stopLoop()
    this.wlDisplay.destroy()
  }

  constructor (localSession, wlDisplay) {
    this.localSession = localSession
    this.wlDisplay = wlDisplay
  }

  onClientCreated (listenerPtr, clientPtr) {
    console.log('Wayland client connected.')
    // stop the wayland loop to keep clients from trying to bind to shim globals
    const client = new Client(clientPtr)

    this.stopLoop()
    this.localSession.createConnection(client).then((localClient) => {
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
