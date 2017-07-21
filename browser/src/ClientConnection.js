/**
 * @property bleh
 */
export default class ClientConnection {
  /**
   *
   * @param {Server} server
   * @param {String} clientConnectionUrl
   * @returns {Promise<ClientConnection>}
   */
  static create (server, clientConnectionUrl) {
    const ws = new window.WebSocket(clientConnectionUrl, 'client')
    ws.binaryType = 'arraybuffer'

    return new Promise((resolve, reject) => {
      ws.onerror = (event) => {
        if (ws.readyState === 'CONNECTING') {
          reject(event)
        }
      }

      ws.onopen = (event) => {
        // A new connection was established. Create a new westfield client object to represent this connection.
        const client = server.createClient()

        // Wire the send callback of this client object to our websocket.
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

        // Wire data receiving from the websocket to the client object.
        ws.onmessage = (message) => {
          try {
            // The client object expects an ArrayBuffer as it's argument.
            // Slice and get the ArrayBuffer of the Node Buffer with the provided offset, else we take too much data into account.
            client.message(message.data)
          } catch (error) {
            console.error(error)
            ws.close()
          }
        }

        // Wire closing of the websocket to our client object.
        ws.onclose = function () {
          client.close()
        }

        resolve(new ClientConnection(server, ws, client))
      }
    })
  }

  /**
   * Use ClientConnection.create(server, clientConnectionUrl) instead.
   *
   * @param {Server} server
   * @param {WebSocket} ws
   * @param {Client} client
   */
  constructor (server, ws, client) {
    this.ws = ws
    this.server = server
    this.client = client
  }
}
