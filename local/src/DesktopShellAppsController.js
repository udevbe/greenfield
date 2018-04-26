'use strict'

const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

const WebSocket = require('ws')

module.exports = class DesktopShellAppsController {
  /**
   * @param request
   * @param socket
   * @param head
   * @param {ShimSession}shimSession
   * @return {DesktopShellAppsController}
   */
  static create (request, socket, head, shimSession) {
    const wss = new WebSocket.Server({
      noServer: true
    })
    const locales = this._parseAcceptLangs(request.headers['accept-language'])
    const waylandSocket = shimSession.waylandSocket
    const desktopShellAppsController = new DesktopShellAppsController(wss, locales, waylandSocket)
    desktopShellAppsController._handleUpgrade(request, socket, head)
    return desktopShellAppsController
  }

  /**
   * Parse HTTP accept-language header of the user browser.
   *
   * @param {string} hdr The string of accpet-language header
   * @return {[string,number][]} Array of language-quality pairs
   */
  static _parseAcceptLangs (hdr) {
    const pairs = hdr.split(',')
    const result = []
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split(';')
      if (pair.length === 1) result.push([pair[0], '1'])
      else result.push([pair[0], pair[1].split('=')[1]])
    }
    return result
  }

  /**
   * @param {WebSocket.Server}wss
   * @param {[string,number][]}locales
   * @param {string}waylandSocket
   */
  constructor (wss, locales, waylandSocket) {
    /**
     * @type {WebSocket.Server}
     * @private
     */
    this._wss = wss
    /**
     * @type {[string,number][]}
     * @private
     */
    this._locales = locales
    /**
     * @type {string}
     * @private
     */
    this._waylandSocket = waylandSocket
    /**
     * @type {WebSocket}
     * @private
     */
    this._ws = null
  }

  _handleUpgrade (request, socket, head) {
    console.log(`Child ${process.pid} received web socket upgrade request for apps controller. Will establish web socket connection.`)
    this._wss.handleUpgrade(request, socket, head, (ws) => {
      console.log(`Child ${process.pid} apps web socket is open.`)
      this._ws = ws
      this._setupWebsocket()
    })
  }

  _setupWebsocket () {
    this._ws.onmessage = (event) => {
      try {
        const jsonMessage = event.data
        const message = JSON.parse(jsonMessage)
        this._handleMessage(message)
      } catch (error) {
        console.trace(`Child ${process.pid} failed to handle incoming message. ${JSON.stringify(event)}\n${event.message}\n${error.stack}`)
        this._ws.close(4007, 'Apps web socket received an illegal message')
      }
    }
    this._ws.onclose = (event) => {
      console.log(`Child ${process.pid} apps web socket is closed. ${event.code}: ${event.reason}`)
    }
    this._ws.onerror = () => {
      console.error(`Session web socket is in error.`)
    }
  }

  /**
   * @param {{action:string, data: *}}message
   * @private
   */
  _handleMessage (message) {
    const action = message.action
    this[action](message)
  }

  /**
   * @param {{action:string, data: string}}message
   * @private
   */
  _launch (message) {
    const executable = message.data
    this._doLaunch(executable)
  }

  /**
   * @param {string}executable
   * @return {Promise<void>}
   * @private
   */
  async _doLaunch (executable) {
    try {
      console.log(`Child ${process.pid} launching ${executable}.`)
      const childEnv = {}
      Object.assign(childEnv, process.env)
      childEnv.WAYLAND_DISPLAY = this._waylandSocket
      const {stdout, stderr} = await execFile(executable, [], {env: childEnv})
      console.log(stdout)
      console.error(stderr)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * @param {{action: string, data: string}}message
   * @private
   */
  _query (message) {
    const filter = message.data
    const appsList = this._doQuery(filter)
    const appsListJSON = JSON.stringify({action: '_query', data: appsList})
    this._ws.send(appsListJSON)
  }

  /**
   * @param {string}filter
   * @return {{ executable:string, name: string, description: string, icon: string }[]}
   * @private
   */
  _doQuery (filter) {
    // TODO hard coded list for now. Programmatically discover/define apps based on logged in user's permission.
    return [
      {
        executable: '/home/zubzub/git/weston/clients/weston-terminal', // The name or path of the executable file to run.
        name: 'Weston Terminal', // TODO localize string based on this._locales
        description: 'A minimal terminal emulator', // TODO localize string based on this._locales
        icon: 'assets/terminal.svg' // path relative to https(s)://<host>/<sessionId>/
      },
      {
        executable: '/home/zubzub/git/weston/clients/weston-simple-egl', // The name or path of the executable file to run.
        name: 'Weston Simple EGL', // TODO localize string based on this._locales
        description: 'A spinning rgb triangle', // TODO localize string based on this._locales
        icon: 'assets/rgb-triangle.svg' // path relative to https(s)://<host>/<sessionId>/
      }
    ]
  }
}
