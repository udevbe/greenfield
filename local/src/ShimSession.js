'use strict'
/** @module ShimSession */

const SocketWatcher = require('socketwatcher').SocketWatcher
const {Display} = require('wayland-server-bindings-runtime')

const LocalSession = require('./LocalSession')
const LocalRtcPeerConnectionFactory = require('./LocalRtcPeerConnectionFactory')
const LocalRtcBufferFactory = require('./LocalRtcBufferFactory')

/**
 * @class ShimSession
 */
module.exports = class ShimSession {
  /**
   * @param request
   * @param socket
   * @param head
   * @return {Promise<ShimSession>}
   */
  static async create (request, socket, head) {
    const wlDisplay = Display.create()
    wlDisplay.initShm()
    const waylandSocket = wlDisplay.addSocketAuto()
    console.log(`Child ${process.pid} created new wayland server socket: ${waylandSocket}`)

    const localSession = await LocalSession.create(request, socket, head, wlDisplay)
    const shimSession = new ShimSession(localSession, wlDisplay, waylandSocket)
    wlDisplay.addClientCreatedListener(shimSession.onClientCreated.bind(shimSession))
    return shimSession
  }

  end (reason) {
    console.log('Closing shim compositor: %s', reason)
    this.stop()
    this.wlDisplay.destroy()
  }

  /**
   * Use ShimSession.create(..) instead.
   * @private
   * @param {LocalSession}localSession
   * @param {WlDisplay}wlDisplay
   * @param {string}waylandSocket
   */
  constructor (localSession, wlDisplay, waylandSocket) {
    /**
     * @type {LocalSession}
     */
    this.localSession = localSession
    /**
     * @type {WlDisplay}
     */
    this.wlDisplay = wlDisplay
    /**
     * @type {string}
     */
    this.waylandSocket = waylandSocket
    this._fdWatcher = null
  }

  async onClientCreated (client) {
    console.log('Wayland client connected.')
    // block the native client from making any calls until the setup with the browser is complete.
    // FIXME this blocks the whole native wayland loop, instead we should only block the native client. For this a change in libwayland itself is required.
    this.stop()
    const localClient = await this.localSession.createConnection(client)
    const localRtcPeerConnectionFactory = await LocalRtcPeerConnectionFactory.create(localClient)
    const localRtcPeerConnection = localRtcPeerConnectionFactory.createRtcPeerConnection()
    // store the peer connection in the westfield connection object and reuse it for all blob transfers that require a peer to server connection.
    localClient.connection._localRtcPeerConnection = localRtcPeerConnection
    const localRtcBufferFactory = await LocalRtcBufferFactory.create(localClient, localRtcPeerConnection)
    // create & link rtc buffer factory to the wayland client's westfield connection
    localRtcBufferFactory.localClient.connection._rtcBufferFactory = localRtcBufferFactory
    this.start()
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
