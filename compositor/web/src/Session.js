'use strict'

import { Display } from 'westfield-runtime-server'

import GrSessionRequests from './protocol/GrSessionRequests'
import GrSessionResource from './protocol/GrSessionResource'
import GrClientSessionResource from './protocol/GrClientSessionResource'

import ClientSession from './ClientSession'

/**
 * Listens for client announcements from the server.
 * @implements {GrSessionRequests}
 */
export default class Session extends GrSessionRequests {
  /**
   * @param {string} compositorSessionId unique random compositor session id
   * @returns {Session}
   */
  static create (compositorSessionId) {
    DEBUG && console.log('Starting new compositor session.')
    const display = new Display()
    const websocketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${websocketProtocol}://${window.location.host}/${compositorSessionId}`
    const session = new Session(url, display, compositorSessionId)

    session._createWebSocket(url)
    session._setupPrimaryConnection()

    display.registry.createGlobal(this, GrSessionResource.name, 1, (client, id, version) => {
      session.bindClient(client, id, version)
    })

    return session
  }

  /**
   * Use Session.create(..) instead
   * @param {string}url
   * @param {Display}display
   * @param {string}compositorSessionId
   * @private
   */
  constructor (url, display, compositorSessionId) {
    super()
    /**
     * @type {string}
     */
    this.url = url
    /**
     * @type {Display}
     */
    this.display = display
    /**
     * @type {string}
     */
    this.compositorSessionId = compositorSessionId
    /**
     * @type {{}}
     * @private
     */
    this._clients = {}
    /**
     * @type {WebSocket}
     * @private
     */
    this._ws = null
    /**
     * @type {Array<GrSessionResource>}
     */
    this.resources = []
    /**
     * @type {Array<ArrayBuffer>}
     * @private
     */
    this._wireMessages = []
  }

  /**
   * @param {string} url
   * @private
   */
  _createWebSocket (url) {
    const ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    ws.onerror = (event) => {
      console.error(`Session web socket is in error.`)
      if (ws.readyState === WebSocket.CONNECTING) {
        DEBUG && console.log('Fatal error while connecting websocket.')
        // TODO signal user a fatal error has accurred. Implement some kind of retry mechanism?
      }
    }
    ws.onopen = () => {
      DEBUG && console.log('Session web socket is open.')
    }
    ws.onmessage = async (event) => {
      try {
        this._wireMessages.push(/** @types {ArrayBuffer} */event.data)

        if (this._wireMessages.length === 1) {
          while (this._wireMessages.length) {
            this.flush()
            const wireMessage = this._wireMessages[0]
            const sessionId = new DataView(wireMessage).getUint32(0, true)
            const arrayBuffer = wireMessage.slice(4, wireMessage.byteLength)

            const client = this._clients[sessionId]
            await client.message(arrayBuffer)
            this._wireMessages.shift()
            this.flush()
          }
        }
      } catch (error) {
        console.error(`Session web socket failed to handle incoming message. \n${error.stack}`)
        this._ws.close(4007, 'Session web socket received an illegal message')
      }
    }
    ws.onclose = (event) => {
      DEBUG && console.log(`Web socket closed. ${event.code}:${event.reason}`)
    }
    this._ws = ws

    window.onbeforeunload = (e) => {
      const dialogText = 'dummytext'
      e.returnValue = dialogText
      return dialogText
    }
  }

  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const grSessionResource = new GrSessionResource(client, id, version)
    grSessionResource.implementation = this
    this.resources.push(grSessionResource)
  }

  _setupPrimaryConnection () {
    return this._setupConnection(0)
  }

  /**
   * @param {!number}connectionId
   * @return {!Client}
   * @private
   */
  _setupConnection (connectionId) {
    const client = this.display.createClient()
    this._clients[connectionId] = client
    this._setupClientConnection(client, connectionId)
    return client
  }

  /**
   * @param {!Client}client
   * @param {!number}clientSessionId
   * @private
   */
  _setupClientConnection (client, clientSessionId) {
    client.onFlush = (arrayBuffer) => {
      try {
        const b = new Uint8Array(arrayBuffer.byteLength + 4)
        new DataView(b.buffer).setUint32(0, clientSessionId, true)
        b.set(new Uint8Array(arrayBuffer), 4)
        this._ws.send(b.buffer)
      } catch (error) {
        console.error(error.stack)
        this._ws.close(4002, 'Session web socket is in error.')
      }
    }
  }

  /**
   *
   * @param {!GrSessionResource} resource
   * @param {!number}id client session resource id
   * @param {!number}connectionId
   * @since 1
   *
   */
  client (resource, id, connectionId) {
    DEBUG && console.log('New client connected.')
    const clientConnection = this._setupConnection(connectionId)
    const grClientSessionResource = new GrClientSessionResource(resource.client, id, resource.version)
    grClientSessionResource.implementation = ClientSession.create(clientConnection)
  }

  flush () {
    this.display.flushClients()
  }
}
