'use strict'

export default class WebWorkerSocket {
  /**
   * @param {Session}session
   * @return {WebWorkerSocket}
   */
  static create (session) {
    return new WebWorkerSocket(session)
  }

  /**
   * @param {Session}session
   */
  constructor (session) {
    /**
     * @type {Session}
     */
    this._session = session
  }

  /**
   * @param {Worker}webWorker
   */
  onWebWorker (webWorker) {
    const client = this._session.display.createClient((sendBuffer) => webWorker.postMessage(sendBuffer, [sendBuffer]))

    webWorker.onmessage = (event) => {
      const webWorkerMessage = /** @type {{protocolMessage:ArrayBuffer, meta:Array<Transferable>}} */event.data
      if (webWorkerMessage.protocolMessage instanceof ArrayBuffer) {
        const buffer = new Uint32Array(/** @type {ArrayBuffer} */webWorkerMessage.protocolMessage)
        // TODO abstract fds number to WebFD type so we can have different implementations depending on WebWorker & Native clients
        const fds = new Uint32Array(0)
        client.connection.message({ buffer, fds })
      } else {
        console.error(`[web-worker-connection] client send an illegal message.`)
        client.close()
      }
    }

    /**
     * @param {Array<{buffer: ArrayBuffer, fds: Array<number>}>}wireMessages
     */
    client.connection.onFlush = (wireMessages) => {
      // convert to arraybuffer so it can be send over a data channel.
      const messagesSize = wireMessages.reduce((previousValue, currentValue) => {
        previousValue += Uint32Array.BYTES_PER_ELEMENT + (currentValue.fds * Uint32Array.BYTES_PER_ELEMENT) + currentValue.buffer.byteLength
        return previousValue
      }, 0)

      const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize + Uint32Array.BYTES_PER_ELEMENT))
      sendBuffer[0] = 0 // out-of-band opcode
      let offset = 1
      wireMessages.forEach(value => {
        // TODO abstract fds number to WebFD type so we can have different implementations depending on WebWorker & Native clients
        const fds = Uint32Array.from(value.fds)
        const message = new Uint32Array(value.buffer)
        sendBuffer[offset++] = fds.length
        sendBuffer.set(fds, offset)
        offset += fds.length
        sendBuffer.set(message, offset)
        offset += message.length
      })

      webWorker.postMessage({ protocolMessage: sendBuffer.buffer, meta: [] }, [sendBuffer.buffer])
    }
  }
}
