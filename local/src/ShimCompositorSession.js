'use strict'
/** @module ShimSession */

const {Connection} = require('westfield-runtime-client')
const {Display} = require('wayland-server-bindings-runtime')
const {Epoll} = require('epoll')

const ShimGlobal = require('./ShimGlobal')

const LocalCompositorSession = require('./LocalCompositorSession')
const LocalRtcPeerConnectionFactory = require('./LocalRtcPeerConnectionFactory')
const LocalRtcBufferFactory = require('./LocalRtcBufferFactory')

/**
 * @class ShimCompositorSession
 */
class ShimCompositorSession {
  /**
   * @param request
   * @param socket
   * @param head
   * @return {Promise<ShimCompositorSession>}
   */
  static async create (request, socket, head) {
    const wlDisplay = Display.create()
    wlDisplay.initShm()
    const waylandSocket = wlDisplay.addSocketAuto()
    console.log(`Child ${process.pid} created new wayland server socket: ${waylandSocket}`)

    // set the wayland display to something non existing, else gstreamer will connect to us with a fallback value and
    // block, while in turn we wait for gstreamer, resulting in a deadlock!
    process.env.WAYLAND_DISPLAY = 'doesntExist'

    const primaryConnection = new Connection()

    const shimCompositorSession = new ShimCompositorSession(wlDisplay, waylandSocket)
    wlDisplay.addClientCreatedListener(shimCompositorSession.onClientCreated.bind(shimCompositorSession))

    const localCompositorSession = await LocalCompositorSession.create(request, socket, head, shimCompositorSession)
    shimCompositorSession.localCompositorSession = localCompositorSession

    const primaryConnectionSetup = localCompositorSession.setupPrimaryConnection(primaryConnection)
    const localRtcPeerConnectionFactoryPromise = LocalRtcPeerConnectionFactory.create(primaryConnection)

    primaryConnection.flush()

    await primaryConnectionSetup
    const localRtcPeerConnectionFactory = await localRtcPeerConnectionFactoryPromise

    const localRtcPeerConnection = localRtcPeerConnectionFactory.createRtcPeerConnection()
    const localRtcBufferFactoryPromise = LocalRtcBufferFactory.create(primaryConnection, localRtcPeerConnection)

    primaryConnection.flush()

    const localRtcBufferFactory = await localRtcBufferFactoryPromise

    localCompositorSession.localRtcPeerConnectionFactory = localRtcPeerConnectionFactory
    localCompositorSession.localRtcPeerConnection = localRtcPeerConnection
    localCompositorSession.localRtcBufferFactory = localRtcBufferFactory

    return shimCompositorSession
  }

  /**
   * Use ShimCompositorSession.create(..) instead.
   * @private
   * @param {WlDisplay}wlDisplay
   * @param {string}waylandSocket
   */
  constructor (wlDisplay, waylandSocket) {
    /**
     * @type {LocalCompositorSession}
     */
    this.localCompositorSession = null
    /**
     * @type {WlDisplay}
     * @private
     */
    this._wlDisplay = wlDisplay
    this._fdWatcher = null
    /**
     * @type {Object.<number,ShimGlobal>}
     * @private
     */
    this._shimGlobals = {}
  }

  end (reason) {
    console.log('Closing shim compositor: %s', reason)
    this.stop()
    this._wlDisplay.destroy()
  }

  /**
   * @param {WlClient}wlClient
   */
  onClientCreated (wlClient) {
    console.log('Wayland client connected.')
    this.localCompositorSession.createClientSession(wlClient)
  }

  start () {
    if (this._fdWatcher === null) {
      const fdWatcher = new Epoll((err) => {
        if (err) {
          console.error(err)
        } else {
          this._wlDisplay.flushClients()
          this._wlDisplay.eventLoop.dispatch(0)
          this.localCompositorSession.flushToBrowser()
        }
      })
      fdWatcher.add(this._wlDisplay.eventLoop.fd, Epoll.EPOLLPRI | Epoll.EPOLLIN | Epoll.EPOLLERR)
      this._fdWatcher = fdWatcher
    }
  }

  stop () {
    if (this._fdWatcher !== null) {
      this._fdWatcher.remove(this._wlDisplay.eventLoop.fd)
      this._fdWatcher.callback = null
    }
    this._fdWatcher = null
  }

  flushToNative () {
    this._wlDisplay.flushClients()
  }

  /**
   * @param {number}name
   * @param {string}interface_
   * @param {number}version
   */
  setupShimGlobal (name, interface_, version) {
    this._shimGlobals[name] = ShimGlobal.create(this._wlDisplay, name, interface_, version, this.localCompositorSession)
  }

  /**
   * @param {string}name
   */
  tearDownShimGlobal (name) {
    delete this._shimGlobals[name]
    // TODO remove native wayland global?
  }
}

module.exports = ShimCompositorSession
