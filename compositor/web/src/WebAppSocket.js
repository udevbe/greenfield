'use strict'

export default class WebAppSocket {
  /**
   * @param {Session}session
   * @return {WebAppSocket}
   */
  static create (session) {
    return new WebAppSocket(session)
  }

  /**
   * @param {Session}session
   */
  constructor (session) {
    /**
     * @type {Session}
     */
    this._session = session
    /**
     * @type {Array<Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>>}
     * @private
     */
    this._flushQueue = []
  }

  /**
   * @param {Worker}webWorker
   */
  onWebAppWorker (webWorker) {
    // TODO How listen for webWorker terminate/close/destroy?
    // TODO close client connection when worker is terminated

    const client = this._session.display.createClient((sendBuffer) => webWorker.postMessage(sendBuffer, [sendBuffer]))

    webWorker.onmessage = (event) => {
      const webWorkerMessage = /** @type {{protocolMessage:ArrayBuffer, meta:Array<Transferable>}} */event.data
      if (webWorkerMessage.protocolMessage instanceof ArrayBuffer) {
        const buffer = new Uint32Array(/** @type {ArrayBuffer} */webWorkerMessage.protocolMessage)
        const fds = webWorkerMessage.meta.map(transferable => {
          if ((transferable instanceof ArrayBuffer) || transferable instanceof SharedArrayBuffer) {
            return this._session.webFS.fromArrayBuffer(transferable)
          } else if (transferable instanceof ImageBitmap) {
            return this._session.webFS.fromImageBitmap(transferable)
          }// else if (transferable instanceof MessagePort) {
          // }
          throw new Error(`Unsupported transferable: ${transferable}`)
        })
        client.connection.message({ buffer, fds })
      } else {
        console.error(`[web-worker-connection] client send an illegal message.`)
        client.close()
      }
    }

    /**
     * @param {Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>}wireMessages
     */
    client.connection.onFlush = async (wireMessages) => {
      this._flushQueue.push(wireMessages)

      if (this._flushQueue.length > 1) {
        return
      }

      while (this._flushQueue.length) {
        const sendWireMessages = this._flushQueue[0]

        // convert to as single arrayBuffer so it can be send over a data channel using zero copy semantics.
        const messagesSize = sendWireMessages.reduce((previousValue, currentValue) => {
          previousValue += Uint32Array.BYTES_PER_ELEMENT + (currentValue.fds * Uint32Array.BYTES_PER_ELEMENT) + currentValue.buffer.byteLength
          return previousValue
        }, 0)

        const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize))
        let offset = 0
        const meta = []
        for (const wireMessage of sendWireMessages) {
          for (const webFd of wireMessage.fds) {
            const transferable = await webFd.getTransferable()
            meta.push(transferable)
          }
          const message = new Uint32Array(wireMessage.buffer)
          sendBuffer.set(message, offset)
          offset += message.length
        }

        webWorker.postMessage({ protocolMessage: sendBuffer.buffer, meta }, [sendBuffer.buffer].concat(meta))
        this._flushQueue.shift()
      }
    }
  }
}
