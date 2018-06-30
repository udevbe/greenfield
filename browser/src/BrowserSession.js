'use strict'

import { Global, Server } from 'westfield-runtime-server'
import session from './protocol/session-browser-protocol'
import BrowserClientSession from './BrowserClientSession'

/**
 * Listens for client announcements from the server.
 */
export default class BrowserSession extends Global {
  /**
   * @param {string} sessionId unique random browser compositor session id
   * @returns {Promise<BrowserSession>}
   */
  static async create (sessionId) {
    console.log('Starting new browser session.')
    const wfsServer = new Server()
    const websocketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${websocketProtocol}://${window.location.host}/${sessionId}`
    const browserSession = new BrowserSession(url, wfsServer, sessionId)
    await browserSession._createConnection(url)
    wfsServer.registry.register(browserSession)
    return browserSession
  }

  /**
   * Use BrowserSession.create(..) instead
   * @param {string}url
   * @param {Server}wfsServer
   * @param {string}sessionId
   * @private
   */
  constructor (url, wfsServer, sessionId) {
    super(session.GrSession.name, 1)
    /**
     * @type {string}
     */
    this.url = url
    /**
     * @type {Server}
     */
    this.wfsServer = wfsServer
    /**
     * @type {string}
     */
    this.sessionId = sessionId
    /**
     * @type {{}}
     * @private
     */
    this._clients = {}
    /**
     * @type {number}
     * @private
     */
    this._nextClientSessionId = 1
    /**
     * @type {WebSocket}
     * @private
     */
    this._ws = null
    /**
     * @type {Array}
     */
    this.resources = []
  }

  /**
   * @param {string} url
   * @returns {Promise<void>}
   * @private
   */
  _createConnection (url) {
    return new Promise((resolve, reject) => {
      const ws = new window.WebSocket(url)
      ws.binaryType = 'arraybuffer'

      ws.onerror = (event) => {
        console.error(`Session web socket is in error.`)
        if (ws.readyState === window.WebSocket.CONNECTING) {
          reject(event)
        }
      }

      ws.onopen = () => {
        try {
          console.log('Session web socket is open.')
          this._ws = ws
          this._setupWebsocket()
          this._primaryConnection = this._setupPrimaryConnection()
          resolve()
        } catch (error) {
          reject(error)
        }
      }
    })
  }

  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const grSessionResource = new session.GrSession(client, id, version)
    grSessionResource.implementation = this
    this.resources.push(grSessionResource)
  }

  _setupWebsocket () {
    this._ws.onmessage = this.eventSource((event) => {
      try {
        const buf = event.data
        const sessionId = new DataView(buf).getUint32(0, true)
        const arrayBuffer = buf.slice(4, buf.byteLength)

        this._clients[sessionId].message(arrayBuffer)
      } catch (error) {
        console.error(`Session web socket failed to handle incoming message. \n${error.stack}`)
        this._ws.close(4007, 'Session web socket received an illegal message')
      }
    })

    this._ws.onclose = (event) => {
      console.log(`Web socket closed. ${event.code}:${event.reason}`)
    }

    window.onbeforeunload = (e) => {
      const dialogText = 'dummytext'
      e.returnValue = dialogText
      return dialogText
    }

    window.unload = () => {
      console.log('User closed tab.')
      this._ws.close(1000, 'User closed tab.')
    }
  }

  _setupPrimaryConnection () {
    return this._setupConnection(0)
  }

  /**
   * @param {number}clientSessionId
   * @return {Client}
   * @private
   */
  _setupConnection (clientSessionId) {
    const client = this.wfsServer.createClient()
    this._clients[clientSessionId] = client
    this._setupClientConnection(client, clientSessionId)
    return client
  }

  /**
   * @param {Client}client
   * @param {number}clientSessionId
   * @private
   */
  _setupClientConnection (client, clientSessionId) {
    client.onSend = (arrayBuffer) => {
      try {
        const b = new Uint8Array(arrayBuffer.byteLength + 4)
        new window.DataView(b.buffer).setUint32(0, clientSessionId, true)
        b.set(new Uint8Array(arrayBuffer), 4)

        this._ws.send(b.buffer)
      } catch (error) {
        console.error(error.stack)
        this._ws.close(4002, 'Session web socket is in error.')
      }
    }
  }

  /**
   * Wraps a lambda so a flush is guaranteed after the lambda executes
   * @param lambda
   * @return {Function}
   */
  eventSource (lambda) {
    const self = this
    return function () {
      lambda.apply(this, arguments)
      self.flush()
    }
  }

  /**
   *
   * @param {GrSession} resource
   * @param {number}id client session resource id
   * @since 1
   *
   */
  client (resource, id) {
    console.log('New client connected.')
    const clientSessionId = this._nextClientSessionId++
    const clientConnection = this._setupConnection(clientSessionId)
    const grClientSessionResource = new session.GrClientSession(resource.client, id, resource.version)
    grClientSessionResource.implementation = BrowserClientSession.create(clientConnection)
    grClientSessionResource.session(clientSessionId)
  }

  flush () {
    this.resources.forEach(resource => resource.flush())
  }
}
