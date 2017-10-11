'use strict'

const SocketWatcher = require('socketwatcher').SocketWatcher
const { Display } = require('wayland-server-bindings-runtime')

const LocalSession = require('./LocalSession')
const LocalRtcBufferFactory = require('./LocalRtcBufferFactory')

module.exports = class ShimSession {
  static create (request, socket, head) {
    const wlDisplay = Display.create()
    wlDisplay.initShm()
    const waylandSocket = wlDisplay.addSocketAuto()
    console.log('Created wayland socket: ' + waylandSocket)

    return LocalSession.create(request, socket, head, wlDisplay).then((localSession) => {
      const shimSession = new ShimSession(localSession, wlDisplay)
      wlDisplay.addClientCreatedListener(shimSession.onClientCreated.bind(shimSession))
      return shimSession
    })
  }

  end (reason) {
    console.log('Closing shim compositor: %s', reason)
    this.stop()
    this.wlDisplay.destroy()
  }

  constructor (localSession, wlDisplay) {
    this.localSession = localSession
    this.wlDisplay = wlDisplay
    this._fdWatcher = null
  }

  onClientCreated (client) {
    console.log('Wayland client connected.')
    this.stop()
    this.localSession.createConnection(client).then((localClient) => {
      this.start()
      return LocalRtcBufferFactory.create(localClient)
    }).then((localClient, localRtcBufferFactory) => {
      // create & link rtc buffer factory to client
      localClient._rtcBufferFactory = localRtcBufferFactory
    }).catch((error) => {
      console.error(error)
      // FIXME handle error state (disconnect?)
    })
  }

  start () {
    if (this._fdWatcher === null) {
      const fdWatcher = new SocketWatcher()
      fdWatcher.callback = () => { this._doLoop() }
      fdWatcher.set(this.wlDisplay.eventLoop.fd, true, false)
      this._fdWatcher = fdWatcher
    }

    this.wlDisplay.flushClients()
    this._fdWatcher.start()
  }

  _doLoop () {
    this.wlDisplay.eventLoop.dispatch(0)
    if (this._fdWatcher !== null) {
      this.wlDisplay.flushClients()
    }
  }

  stop () {
    if (this._fdWatcher !== null) {
      this._fdWatcher.stop()
    }
    this._fdWatcher.callback = null
    this._fdWatcher = null
  }
}
