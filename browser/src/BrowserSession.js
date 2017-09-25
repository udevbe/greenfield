'use strict'

import westfield from 'westfield-runtime-server'
import session from './protocol/session-browser-protocol'

/**
 * Listens for client announcements from the server.
 */
export default class BrowserSession extends westfield.Global {
  /**
   *
   * @param {Server}wfsServer
   * @param {string} url
   * @returns {Promise<Client>}
   * @private
   */
  static _createConnection (wfsServer, url) {
    return new Promise((resolve, reject) => {
      const ws = new window.WebSocket(url)
      ws.binaryType = 'arraybuffer'

      ws.onerror = (event) => {
        if (ws.readyState === window.WebSocket.CONNECTING) {
          reject(event)
        }
      }

      ws.onopen = () => {
        const client = wfsServer.createClient()

        client.onSend = (wireMsg) => {
          if (ws.readyState === window.WebSocket.CLOSING || ws.readyState === window.WebSocket.CLOSED) {
            // Fail silently as we will soon receive the close event which will trigger the cleanup.
            return
          }

          try {
            ws.send(wireMsg, (error) => {
              if (error !== undefined) {
                console.error(error)
                ws.close()
              }
            })
          } catch (error) {
            console.error(error)
            ws.close()
          }
        }

        ws.onmessage = (message) => {
          try {
            client.message(message.data)
          } catch (error) {
            console.error(error)
            ws.close()
          }
        }

        ws.onclose = () => client.close()
        client.onClose().then(() => ws.close())

        resolve(client)
      }
    })
  }

  /**
   *
   * @param {String} sessionId websocket session
   * @returns {Promise<BrowserSession>}
   */
  static create (sessionId) {
    console.log('Starting new browser session.')
    const wfsServer = new westfield.Server()
    const url = 'ws://' + window.location.host + '/' + sessionId
    return this._createConnection(wfsServer, url).then(() => {
      const browserSession = new BrowserSession(url, wfsServer)
      wfsServer.registry.register(browserSession)
      return browserSession
    }).catch((error) => {
      console.log('Received session connection error ' + error)
    })
  }

  constructor (url, wfsServer) {
    super(session.GrSession.name, 1)
    this.url = url
    this.wfsServer = wfsServer
  }

  bindClient (client, id, version) {
    const grSessionResource = new session.GrSession(client, id, version)
    grSessionResource.implementation = this
  }

  /**
   *
   * @param {GrSession} resource
   *
   * @since 1
   *
   */
  client (resource) {
    console.log('New client connected.')
    BrowserSession._createConnection(this.wfsServer, this.url).catch((error) => {
      console.log('Received client connection error ' + error)
    })
  }
}
