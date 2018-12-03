'use strict'

const childProcess = require('child_process')
const path = require('path')
const crypto = require('crypto')

const WebSocket = require('ws')

const { daemon: daemonConfig } = require('./config')

const uuidRegEx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

class AppEndpointDaemon {
  /**
   * @returns {Promise<AppEndpointDaemon>}
   */
  static async create () {
    const appEndpointUUID = this._uuidv4()
    return new Promise((resolve, reject) => {
      const websocketUrl = `${daemonConfig['web-socket-connection']['url']}/announceAppEndpointDaemon/${appEndpointUUID}`

      // TODO listen for connection failure and reject promise
      const webSocket = new WebSocket(websocketUrl)
      const appEndpointDaemon = new AppEndpointDaemon(webSocket)

      webSocket.onclose = e => appEndpointDaemon._onClose(e)
      webSocket.onerror = e => reject(e.error)
      webSocket.onmessage = e => appEndpointDaemon._onMessage(e)

      webSocket.onopen = () => {
        webSocket.onerror = e => appEndpointDaemon._onError(e)
        resolve(appEndpointDaemon)
      }
    })
  }

  static _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  /**
   * @param {WebSocket}webSocket
   */
  constructor (webSocket) {
    /**
     * @type {WebSocket}
     */
    this.webSocket = webSocket
    /**
     * @type {Object.<string, ChildProcess>}
     * @private
     */
    this._appEndpointSessionForks = {}
    /**
     * @type {function():void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise(resolve => {
      this._destroyResolve = resolve
    })
  }

  /**
   * @param {string} compositorSessionId
   * @return {ChildProcess}
   */
  createAppEndpointSessionFork (compositorSessionId) {
    let child = this._appEndpointSessionForks[compositorSessionId]
    if (child == null) {
      // uncomment next line for debugging support in the child process
      // process.execArgv.push('--inspect-brk=0')

      console.log('[app-endpoint-daemon] - Creating new child process.')
      const configPath = process.argv[2]
      child = childProcess.fork(path.join(__dirname, 'appEndpointSessionIndex.js'), configPath == null ? [] : [`${configPath}`])

      const removeChild = () => {
        console.log(`[app-endpoint-daemon] - Child [${child.pid}] exit.`)
        delete this._appEndpointSessionForks[compositorSessionId]
      }

      child.on('exit', removeChild)
      child.on('SIGINT', function () {
        process.env.DEBUG && console.log(`[app-endpoint-daemon] Child [${child.pid}] received SIGINT.`)
        child.exit()
      })
      child.on('SIGTERM', function () {
        process.env.DEBUG && console.log(`[app-endpoint-daemon] Child [${child.pid}] received SIGTERM.`)
        child.exit()
      })

      this._appEndpointSessionForks[compositorSessionId] = child
    } else {
      // TODO error out as there already exists a app endpoint session fork for this compositor session id.
    }
    return child
  }

  /**
   * @returns {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    if (this._destroyResolve) {
      this._destroyResolve()
      this._destroyResolve = null
    }
  }

  /**
   * @param event
   * @private
   */
  _onClose (event) {
    console.log(`[app-endpoint-daemon] - Web socket is closed. ${event.code}: ${event.reason}.`)
    this.destroy()
  }

  /**
   * @param event
   * @private
   */
  _onMessage (event) {
    const eventData = /** @type {string} */event.data
    const message = JSON.parse(eventData)
    const { intent, compositorSessionId } = message
    if (intent === 'announceCompositor' && uuidRegEx.test(compositorSessionId)) {
      const appEndpointSessionFork = this.createAppEndpointSessionFork(compositorSessionId)
      this.onDestroy().then(() => {
        console.log(`[app-endpoint-daemon] - Sending child ${appEndpointSessionFork.pid} SIGKILL.`)
        appEndpointSessionFork.kill('SIGKILL')
      })
      appEndpointSessionFork.send(message)
    } else {
      process.env.DEBUG && console.log(`[app-endpoint-daemon] - Received an illegal message. Expected message with properties 'intent=announce' and 'compositorSessionId=uuid'. Instead got:\\n${eventData}.`)
      this.webSocket.close(4007, `Received an illegal message. Expected message with properties 'intent=announce' and 'compositorSessionId=uuid'. Instead got:\n${eventData}.`)
    }
  }

  /**
   * @param event
   * @private
   */
  _onError (event) {
    process.env.DEBUG && console.error(`[app-endpoint-daemon] Web socket is in error.`)
  }
}

module.exports = AppEndpointDaemon
