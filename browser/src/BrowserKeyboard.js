'use strict'

import greenfield from './protocol/greenfield-browser-protocol'

import BrowserXkb from './BrowserXkb'
import BrowserRtcBlobTransfer from './BrowserRtcBlobTransfer'

export default class BrowserKeyboard {
  /**
   * @returns {BrowserKeyboard}
   */
  static create () {
    const browserKeyboard = new BrowserKeyboard()
    browserKeyboard.updateKeymap('qwerty.xkb')
    return browserKeyboard
  }

  constructor (browserXkb) {
    this.resources = []
    this._browserXkb = null
  }

  /**
   *
   * @param {GrKeyboard} resource
   *
   * @since 3
   *
   */
  release (resource) {
    resource.destroy()
    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
  }

  updateKeymap (keymapFileName) {
    BrowserXkb.createFromResource(keymapFileName).then((browserXkb) => {
      if (this._browserXkb) {
        // TODO cleanup previous keymap state
      }
      this._browserXkb = browserXkb
      this.emitKeymap()
    }).catch((error) => {
      console.log(error)
    })
  }

  emitKeymap () {
    if (this.resources.length === 0) {
      return
    }

    const keymapString = this._browserXkb.asString()
    const blobDescriptor = BrowserRtcBlobTransfer.createDescriptor(true, 'string')

    BrowserRtcBlobTransfer.get(blobDescriptor).then((browserRtcBlobTransfer) => {
      browserRtcBlobTransfer.browserRtcPeerConnection.ensureP2S()
      return browserRtcBlobTransfer.open()
    }).then((rtcDataChannel) => {
      // chrome doesn't like chunks > 16KB
      const maxChunkSize = 16 * 1000 // 1000 instead of 1024 to be on the safe side.
      if (keymapString > maxChunkSize) {
        const nroChunks = Math.ceil(keymapString.length / maxChunkSize)
        for (let i = 0; i < nroChunks; i++) {
          const chunk = keymapString.substring(i * maxChunkSize, (i + 1) * maxChunkSize)
          rtcDataChannel.send(chunk)
        }
      } else {
        rtcDataChannel.send(keymapString)
      }
    }).catch((error) => {
      console.log(error)
    })

    this.resources.forEach((resource) => {
      resource.keymap(greenfield.GrKeyboard.KeymapFormat.xkbV1, blobDescriptor, keymapString.length)
    })
  }
}
