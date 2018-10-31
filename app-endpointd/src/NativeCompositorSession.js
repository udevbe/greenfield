const { Endpoint } = require('westfield-endpoint')
const { Epoll } = require('epoll')

const NativeClientSession = require('./NativeClientSession')

class NativeCompositorSession {
  /**
   * @param {RtcClient}rtcClient
   * @returns {NativeCompositorSession}
   */
  static create (rtcClient) {
    const compositorSession = new NativeCompositorSession(rtcClient)

    compositorSession.wlDisplay = Endpoint.createDisplay(
      wlClient => compositorSession._onClientCreated(wlClient),
      globalName => compositorSession._onGlobalCreated(globalName),
      globalName => compositorSession._onGlobalDestroyed(globalName)
    )
    Endpoint.initShm(compositorSession.wlDisplay)
    compositorSession.wlDisplayName = Endpoint.addSocketAuto(compositorSession.wlDisplay)
    compositorSession.wlDisplayFd = Endpoint.getFd(compositorSession.wlDisplay)

    const fdWatcher = new Epoll((err) => {
      Endpoint.dispatchRequests(compositorSession.wlDisplay)
    })
    fdWatcher.add(compositorSession.wlDisplayFd, Epoll.EPOLLPRI | Epoll.EPOLLIN | Epoll.EPOLLERR)

    return compositorSession
  }

  /**
   * @param {RtcClient}rtcClient
   */
  constructor (rtcClient) {
    /**
     * @type {RtcClient}
     */
    this.rtcClient = rtcClient
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
    /**
     * List of globals created on the native machine by 3rd party protocol implementations.
     * @type {Array<number>}
     */
    this.localGlobalNames = []
  }

  destroy () {
    // TODO
  }

  /**
   * @param {Object}wlClient
   * @private
   */
  _onClientCreated (wlClient) {
    process.env.DEBUG && console.log(`[app-endpoint-${this.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native compositor session: new wayland client connected.`)

    // TODO keep track of clients
    const clientSession = NativeClientSession.create(wlClient, this)
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
    this.localGlobalNames.push(globalName)
  }

  /**
   * @param {number}globalName
   * @private
   */
  _onGlobalDestroyed (globalName) {
    const idx = this.localGlobalNames.indexOf(globalName)
    if (idx > -1) {
      this.localGlobalNames.splice(idx, 1)
    }
  }
}

module.exports = NativeCompositorSession
