const { Endpoint, nativeGlobalNames } = require('westfield-endpoint')
const { Epoll } = require('epoll')

const NativeClientSession = require('./NativeClientSession')

class NativeCompositorSession {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {CommunicationChannelFactory}communicationChannelFactory
   * @returns {NativeCompositorSession}
   */
  static create (appEndpointCompositorPair, communicationChannelFactory) {
    const compositorSession = new NativeCompositorSession(appEndpointCompositorPair, communicationChannelFactory)

    // TODO move global create/destroy callback implementations into Endpoint.js
    compositorSession.wlDisplay = Endpoint.createDisplay(
      wlClient => compositorSession._onClientCreated(wlClient),
      globalName => compositorSession._onGlobalCreated(globalName),
      globalName => compositorSession._onGlobalDestroyed(globalName)
    )
    Endpoint.initShm(compositorSession.wlDisplay)
    compositorSession.wlDisplayName = Endpoint.addSocketAuto(compositorSession.wlDisplay)
    console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - Native compositor session: created new app-endpoint.`)
    console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - Native compositor session: compositor listening on: WAYLAND_DISPLAY="${compositorSession.wlDisplayName}".`)

    // set the wayland display to something non existing, else gstreamer will connect to us with a fallback value and
    // block, while in turn we wait for gstreamer, resulting in a deadlock!
    // FIXME this can be removed once we move all the buffer encoding to native code with a programmatically constructed
    // gstreamer pipeline using a headless option
    process.env.WAYLAND_DISPLAY = 'doesntExist'

    compositorSession.wlDisplayFd = Endpoint.getFd(compositorSession.wlDisplay)

    // TODO handle err
    // FIXME write our own native epoll
    const fdWatcher = new Epoll(err => Endpoint.dispatchRequests(compositorSession.wlDisplay))
    fdWatcher.add(compositorSession.wlDisplayFd, Epoll.EPOLLPRI | Epoll.EPOLLIN | Epoll.EPOLLERR)

    return compositorSession
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {CommunicationChannelFactory}communicationChannelFactory
   */
  constructor (appEndpointCompositorPair, communicationChannelFactory) {
    /**
     * @type {AppEndpointCompositorPair}
     */
    this.appEndpointCompositorPair = appEndpointCompositorPair
    /**
     * @type {CommunicationChannelFactory}
     * @private
     */
    this._communicationChannelFactory = communicationChannelFactory
    /**
     * @type {Object}
     */
    this.wlDisplay = null
    /**
     * @type {string}
     */
    this.wlDisplayName = null
    /**
     * @type {number}
     */
    this.wlDisplayFd = -1
    /**
     * @type {Array<NativeClientSession>}
     */
    this.clients = []
  }

  destroy () {
    // TODO
  }

  /**
   * @param {Object}wlClient
   * @private
   */
  _onClientCreated (wlClient) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.clientRTC.appEndpointCompositorPair.appEndpointSessionId}] - Native compositor session: new wayland client connected.`)

    const communicationChannel = this._communicationChannelFactory.createMessagesChannel('')
    const clientSession = NativeClientSession.create(wlClient, this, communicationChannel)
    this.clients.push(clientSession)
    clientSession.onDestroy().then(() => {
      const idx = this.clients.indexOf(clientSession)
      if (idx > -1) {
        this.clients.splice(idx, 1)
      }
    })
  }

  /**
   * @param {number}globalName
   * @private
   */
  _onGlobalCreated (globalName) {
    nativeGlobalNames.push(globalName)
  }

  /**
   * @param {number}globalName
   * @private
   */
  _onGlobalDestroyed (globalName) {
    const idx = nativeGlobalNames.indexOf(globalName)
    if (idx > -1) {
      nativeGlobalNames.splice(idx, 1)
    }
  }
}

module.exports = NativeCompositorSession
