'use strict'
/** @module BrowserKeyboard */

import greenfield from './protocol/greenfield-browser-protocol'

import BrowserXkb from './BrowserXkb'
import BrowserRtcBlobTransfer from './BrowserRtcBlobTransfer'

/**
 * @class
 */
export default class BrowserKeyboard {
  /**
   * @param {BrowserSession}browserSession
   * @param {BrowserPointer}browserPointer
   * @return {BrowserKeyboard}
   */
  static create (browserSession, browserPointer) {
    const browserKeyboard = new BrowserKeyboard()
    browserKeyboard.updateKeymap('qwerty.xkb')

    document.addEventListener('keyup', browserSession.eventSource((event) => {
      browserKeyboard.onKeyUp(event)
    }), true)
    document.addEventListener('keydown', browserSession.eventSource((event) => {
      browserKeyboard.onKeyDown(event)
    }), true)

    // sync pointer focus with keyboard focus
    browserPointer.focusListeners.push(() => {
      browserPointer.focus === null ? browserKeyboard._focusLost() : browserKeyboard._focusGained(browserPointer.focus)
    })
    browserPointer.focus === null ? browserKeyboard._focusLost() : browserKeyboard._focusGained(browserPointer.focus)

    return browserKeyboard
  }

  /**
   * Use BrowserKeyboard.create(..) instead.
   * @private
   */
  constructor () {
    /**
     * @type {Array}
     */
    this.resources = []
    /**
     * @type {BrowserXkb}
     * @private
     */
    this._browserXkb = null
    /**
     * @type {number}
     * @private
     */
    this._serial = 0
    /**
     * @type {HTMLCanvasElement}
     */
    this.focus = null
    /**
     * @type {Array<number>}
     * @private
     */
    this._keys = []

    this._focusDestroyListener = () => {
      const surfaceResource = this.focus.view.browserSurface.resource
      surfaceResource.removeDestroyListener(this._focusDestroyListener)
      this.focus = null
    }
  }

  /**
   * @return {number}
   * @private
   */
  _nextSerial () {
    return ++this._serial
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

  /**
   * @param {string}keymapFileName
   */
  updateKeymap (keymapFileName) {
    BrowserXkb.createFromResource(keymapFileName).then((browserXkb) => {
      if (this._browserXkb) {
        // TODO cleanup previous keymap state
      }
      this._browserXkb = browserXkb
      this.resources.forEach((resource) => {
        this.emitKeymap(resource)
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  /**
   * @param {GrKeyboard}resource
   */
  emitKeymap (resource) {
    const keymapString = this._browserXkb.asString()
    const blobDescriptor = BrowserRtcBlobTransfer.createDescriptor(true, 'string')

    // cleanup of the blob transfer is initiated at the other end.
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

    resource.keymap(greenfield.GrKeyboard.KeymapFormat.xkbV1, blobDescriptor, keymapString.length)
  }

  /**
   * @param {HTMLCanvasElement}focus
   * @private
   */
  _focusGained (focus) {
    if (this.focus === focus) {
      return
    }
    this._focusLost()

    this.focus = focus
    const surfaceResource = this.focus.view.browserSurface.resource
    surfaceResource.addDestroyListener(this._focusDestroyListener)

    const serial = this._nextSerial()
    const surface = this.focus.view.browserSurface.resource
    const keys = new Uint8Array(this._keys).buffer

    this.resources.filter((resource) => {
      return resource.client === this.focus.view.browserSurface.resource.client
    }).forEach((resource) => {
      resource.enter(serial, surface, keys)
    })
  }

  _focusLost () {
    if (this.focus === null) {
      return
    }

    const serial = this._nextSerial()
    const surface = this.focus.view.browserSurface.resource

    this.resources.filter((resource) => {
      return resource.client === this.focus.view.browserSurface.resource.client
    }).forEach((resource) => {
      resource.leave(serial, surface)
    })

    const surfaceResource = this.focus.view.browserSurface.resource
    surfaceResource.removeDestroyListener(this._focusDestroyListener)
    this.focus = null
  }

  /**
   * @param {KeyboardEvent}event
   */
  onKeyUp (event) {
    const keyCode = event.code
    const linuxKeyCode = BrowserXkb.linuxKeycode[keyCode]
    this._browserXkb.keyUp(linuxKeyCode)
    const index = this._keys.indexOf(linuxKeyCode)
    if (index > -1) {
      this._keys.splice(index, 1)
    }

    if (this.focus === null) {
      return
    }

    const serial = this._nextSerial()
    const time = event.timeStamp
    const evdevKeyCode = linuxKeyCode - 8
    const state = greenfield.GrKeyboard.KeyState.released

    const modsDepressed = this._browserXkb.modsDepressed
    const modsLatched = this._browserXkb.modsLatched
    const modsLocked = this._browserXkb.modsLocked
    const group = this._browserXkb.group

    this.resources.filter((resource) => {
      return resource.client === this.focus.view.browserSurface.resource.client
    }).forEach((resource) => {
      resource.key(serial, time, evdevKeyCode, state)
      resource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
    })
  }

  /**
   * @param {KeyboardEvent}event
   */
  onKeyDown (event) {
    const keyCode = event.code
    const linuxKeyCode = BrowserXkb.linuxKeycode[keyCode]
    this._browserXkb.keyDown(linuxKeyCode)
    this._keys.push(linuxKeyCode)

    if (this.focus === null) {
      return
    }

    const serial = this._nextSerial()
    const time = event.timeStamp
    const evdevKeyCode = linuxKeyCode - 8
    const state = greenfield.GrKeyboard.KeyState.pressed

    const modsDepressed = this._browserXkb.modsDepressed
    const modsLatched = this._browserXkb.modsLatched
    const modsLocked = this._browserXkb.modsLocked
    const group = this._browserXkb.group

    this.resources.filter((resource) => {
      return resource.client === this.focus.view.browserSurface.resource.client
    }).forEach((resource) => {
      resource.key(serial, time, evdevKeyCode, state)
      resource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
    })
  }

  /**
   * @param {GrKeyboard}resource
   */
  emitKeyRepeatInfo (resource) {
    // TODO
  }
}
