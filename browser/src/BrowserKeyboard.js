'use strict'

import greenfield from './protocol/greenfield-browser-protocol'

import BrowserXkb from './BrowserXkb'
import BrowserRtcBlobTransfer from './BrowserRtcBlobTransfer'

export default class BrowserKeyboard {
  /**
   * @returns {BrowserKeyboard}
   */
  static create () {
    return new BrowserKeyboard()
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
        // cleanup previous keymap state
      }

      this._browserXkb = browserXkb
      this._emitKeymap()
    }).catch((error) => {
      console.log(error)
    })
  }

  _emitKeymap () {
    const keymapString = this._browserXkb.asString()
    const blobDescriptor = BrowserRtcBlobTransfer.createDescriptor(true, 'string')

    BrowserRtcBlobTransfer.get(blobDescriptor).then((browserRtcBlobTransfer) => {
      browserRtcBlobTransfer.browserRtcPeerConnection.ensureP2S()
      return browserRtcBlobTransfer.open()
    }).then((rtcDataChannel) => {
      rtcDataChannel.send(keymapString)
    }).catch((error) => {
      console.log(error)
    })

    this.resources.forEach((resource) => {
      resource.keymap(greenfield.GrKeyboard.KeymapFormat.xkbV1, blobDescriptor, keymapString.length)
    })
  }
}
