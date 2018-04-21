'use strict'

const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

const WebSocket = require('ws')

module.exports = class DesktopShellAppsController {
  /**
   * @param request
   * @param socket
   * @param head
   * @return {DesktopShellAppsController}
   */
  static create (request, socket, head) {
    const wss = new WebSocket.Server({
      noServer: true
    })
    const locales = this._parseAcceptLangs(request.headers['accept-language'])
    const desktopShellAppsController = new DesktopShellAppsController(wss, locales)
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
   */
  constructor (wss, locales) {
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
     * @type {WebSocket}
     * @private
     */
    this._ws = null
  }

  _handleUpgrade (request, socket, head) {
    console.log(`Child ${process.pid} received websocket upgrade request for apps controller. Will establish websocket connection.`)
    this._wss.handleUpgrade(request, socket, head, (ws) => {
      console.log(`Child ${process.pid} apps websocket is open.`)
      this._ws = ws
      this._setupWebsocket()
    })
  }

  _setupWebsocket () {
    this._ws.onmessage = (event) => {
      if (this._ws.readyState === WebSocket.OPEN) {
        const jsonMessage = event.data
        try {
          const message = JSON.parse(jsonMessage)
          this._handleMessage(message)
        } catch (error) {
          console.error(`Child ${process.pid} ${error}`)
          this._ws.close(1, 'Error while handling incoming message.')
        }
      }
    }
    this._ws.onclose = () => {
      console.log(`Child ${process.pid} apps websocket is closed.`)
    }
    // TODO listen for error(?)
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
    console.log(`Child ${process.pid} launching ${executable}.`)
    const {stdout} = await execFile(executable)
    console.log(stdout)
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
        executable: 'weston-terminal', // The name or path of the executable file to run.
        name: 'Weston Terminal', // TODO localize based on this._locales
        description: 'A minimal terminal emulator.', // TODO localize based on this._locales
        icon: 'assets/terminal.svg'
      }
    ]
  }
}
