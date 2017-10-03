'use strict'

const LocalSession = require('./LocalSession')
const {Display, Listener, Client} = require('wayland-server-bindings-runtime')
const WlShmFormat = require('./protocol/wayland/WlShmFormat')

module.exports = class ShimSession {
  static create (request, socket, head) {
    const wlDisplay = Display.create()
    wlDisplay.addShmFormat(WlShmFormat.xrgb8888)
    wlDisplay.addShmFormat(WlShmFormat.argb8888)
    wlDisplay.initShm()
    const waylandSocket = wlDisplay.addSocketAuto()
    console.log('Created wayland socket: ' + waylandSocket)

    return LocalSession.create(request, socket, head, wlDisplay).then((localSession) => {
      const shimSession = new ShimSession(localSession, wlDisplay)
      const listener = Listener.create(shimSession.onClientCreated.bind(shimSession))
      wlDisplay.addClientCreatedListener(listener)
      shimSession.startLoop()
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
      // new connection with browser set up, client can now safely bind to shim globals
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
      try {
        if (this._loop) {
          this.wlDisplay.flushClients()
          this.wlDisplay.eventLoop.dispatch(-1)
          this._doLoop()
        }
      } catch (error) {
        console.error(error)
      }
    })
  }

  stopLoop () {
    this._loop = false
  }
}
