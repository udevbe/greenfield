'use strict'

const SocketWatcher = require('socketwatcher').SocketWatcher
const {Display} = require('wayland-server-bindings-runtime')

const LocalSession = require('./LocalSession')
const LocalRtcPeerConnectionFactory = require('./LocalRtcPeerConnectionFactory')
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
    // block the native client from making any calls until the setup with the browser is complete.
    // FIXME this blocks the whole native wayland loop, instead we should only block the native client. For this a change in libwayland itself is required.
    this.stop()
    this.localSession.createConnection(client).then((localClient) => {
      return LocalRtcPeerConnectionFactory.create(localClient)
    }).then((localRtcPeerConnectionFactory) => {
      const localClient = localRtcPeerConnectionFactory.localClient
      const localRtcPeerConnection = localRtcPeerConnectionFactory.createRtcPeerConnection()
      return LocalRtcBufferFactory.create(localClient, localRtcPeerConnection)
    }).then((localRtcBufferFactory) => {
      // create & link rtc buffer factory to client connection
      localRtcBufferFactory.localClient.connection._rtcBufferFactory = localRtcBufferFactory
      this.start()
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
      this._fdWatcher.callback = null
    }
    this._fdWatcher = null
  }
}
