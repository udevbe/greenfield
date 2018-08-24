'use strict'

const util = require('util')
const execFile = util.promisify(require('child_process').execFile)
const url = require('url')
const fs = require('fs')

const WebSocket = require('ws')

const config = require('./config')

class DesktopShellAppsController {
  /**
   * @param {http.IncomingMessage} request The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
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

  /**
   * @param {http.IncomingMessage} request The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @private
   */
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
      console.error(error, error.stack)
    }
  }

  /**
   * @param {{action: string, data: string}}message
   * @private
   */
  async _query (message) {
    const filter = message.data
    const appsList = await this._doQuery(filter)
    const appsListJSON = JSON.stringify({action: '_query', data: appsList})
    this._ws.send(appsListJSON)
  }

  /**
   * @param {string}filter
   * @return {{ executable:string, name: string, description: string, icon: string }[]}
   * @private
   */
  async _doQuery (filter) {
    const appsEntries = config['desktop-shell']['apps-controller']['app-entries-urls']
    const queryResults = await Promise.all(appsEntries.map(async (appsEntry) => {
      const appsEntriesURL = new url.URL(appsEntry)
      const protocol = appsEntriesURL.protocol
      switch (protocol) {
        case 'file:':
          return this._queryEntriesFromFileSystem(filter, appsEntry)
        case 'http:':
        case 'https:':
          return this._queryEntriesFromHttp(filter, appsEntriesURL)
        default:
          console.error(`Unsupported protocol for apps-entries-url. Supported protocols are file, http, https. Got: ${protocol}`)
      }
    }))

    let query = []
    queryResults.forEach((queryResult) => {
      query = query.concat(queryResult)
    })

    return query
  }

  /**
   * @param {string}filter
   * @param {string} appsEntry
   * @return {{ executable:string, name: string, description: string, icon: string }[]}
   * @private
   */
  async _queryEntriesFromFileSystem (filter, appsEntry) {
    let entries = []

    const appsEntriesURL = new url.URL(appsEntry, `file:${process.cwd()}/`)
    try {
      const appsEntriesStats = await util.promisify(fs.stat)(appsEntriesURL)
      if (appsEntriesStats.isFile()) {
        // parse single json file with array elements
        const appsEntriesJSON = await util.promisify(fs.readFile)(appsEntriesURL)
        try {
          entries = JSON.parse(appsEntriesJSON)
        } catch (error) {
          console.error(`Failed to JSON parse app entries: ${appsEntriesURL}. ${error}`)
        }
      } else {
        // list directory and add each json file as a separate element
        const files = await util.promisify(fs.readdir)(appsEntriesURL.pathname)
        await Promise.all(files.map(async (file) => {
          if (file.endsWith('.json')) {
            const appEntryURL = new url.URL(file, `${appsEntriesURL.href}/`)
            const appEntryJSON = await util.promisify(fs.readFile)(appEntryURL)
            try {
              entries.push(JSON.parse(appEntryJSON))
            } catch (error) {
              console.error(`Failed to JSON parse app entry: ${appEntryURL}. ${error}`)
            }
          }
        }))
      }
    } catch (error) {
      console.error(error, error.stack)
    }

    return entries
  }

  /**
   * @param {string}filter
   * @param {URL}appsEntriesURL
   * @return {{ executable:string, name: string, description: string, icon: string }[]}
   * @private
   */
  _queryEntriesFromHttp (filter, appsEntriesURL) {
    // TODO make http get call
    return []
  }
}

module.exports = DesktopShellAppsController
