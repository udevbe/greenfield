import cd from './protocol/session-client-protocol'

/**
 * Listens for client announcements from the server.
 */
export default class Session {

  /**
   *
   * @param {String} url websocket session url
   * @returns {Promise<Session>}
   */
  static create (url) {
    return new Promise((resolve, reject) => {
      const ws = new window.WebSocket(url, 'session')// create new websocket connection
      ws.binaryType = 'arraybuffer'// set socket type to array buffer, required for wfc connection to work.

      ws.onerror = (event) => {
        if (ws.readyState === 'CONNECTING') {
          reject(event)
        }
      }

      const connection = new cd.Connection()// create connection
      connection.onSend = (data) => {
        ws.send(data)
      }// wire connection send to websocket
      ws.onmessage = (event) => {
        connection.unmarshall(event.data)
      }// wire websocket message to connection unmarshall

      ws.onopen = (event) => {
        const registry = connection.createRegistry() // create a registry that will notify us of any current and new globals
        registry.listener.global = (name, interface_, version) => { // register a listener to will be notified if a new global appears
          if (interface_ === 'GrSession') { // check if we support the global
            const grSession = registry.bind(name, interface_, version)// create a new object that will be bound to the global
            const session = new Session()

            grSession.listener.client = () => {
              session.onClient()
            }

            resolve(session)
          }
        }
      }
    })
  }

  /**
   * Notifies that a new client is available on the native remote
   */
  onClient () {}
}
