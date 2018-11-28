'use strict'

class WebFD {
  /**
   * @param {Client} client
   * @return {WebFD}
   */
  static create (client) {
    return new WebFD(client, client._display.getNextObjectId())
  }

  /**
   * @param {Client} client
   * @param {number} webFd
   */
  constructor (client, webFd) {
    /**
     * @type {Client}
     */
    this.client = client
    /**
     * @type {number}
     * @private
     */
    this.nativeFd = -1
    /**
     * @private
     * @const
     * @type {number}
     */
    this._webFd = webFd
  }

  /**
   * @param {ArrayBuffer}contents
   * @return {Promise<void>}
   */
  async openAndWriteShm (contents) {
    const displayId = 1
    const openShmOpcode = 127
    return new Promise((resolve, reject) => {
      if (this.nativeFd !== -1) {
        reject(new Error('WebFD already open.'))
      }
      this.client.setOutOfBandListener(this._webFd, openShmOpcode, (buffer) => {
        const nativeFd = new Uint32Array(buffer)[2]
        if (nativeFd === -1) {
          reject(new Error('Failed to open and/or write to file on native endpoint host. Check logs on remote machine.'))
        } else {
          this.nativeFd = nativeFd
        }

        this.client.removeOutOfBandListener(this._webFd, openShmOpcode)
        resolve(nativeFd)
      })
      const sendBuffer = new ArrayBuffer(4 + contents.byteLength)
      const dataView = new DataView(sendBuffer)
      dataView.setUint32(0, this._webFd, true)
      new Uint8Array(sendBuffer, 4).set(new Uint8Array(contents))
      this.client.sendOutOfBand(displayId, openShmOpcode, sendBuffer)
    })
  }

  async close () {
    const displayId = 1
    const closeOpcode = 128
    return new Promise((resolve, reject) => {
      if (this.nativeFd === -1) {
        reject(new Error('WebFD already closed.'))
      }
      this.client.setOutOfBandListener(this._webFd, closeOpcode, (response) => {
        const responseCode = new Uint32Array(response)[2]
        if (responseCode === -1) {
          reject(new Error('Failed to close file on native endpoint host. Check logs on remote machine.'))
        } else {
          this.nativeFd = -1
        }

        this.client.removeOutOfBandListener(this._webFd, closeOpcode)
        resolve(responseCode)
      })
      this.client.sendOutOfBand(displayId, closeOpcode, new Uint32Array([this._webFd, this.nativeFd]).buffer)
    })
  }
}

/**
 * @type {number}
 * @private
 */
WebFD._nextWebFD = 0

export default WebFD
