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
   * @param {BrowserDataDevice} browserDataDevice
   * @return {BrowserKeyboard}
   */
  static create (browserSession, browserDataDevice) {
    const browserKeyboard = new BrowserKeyboard(browserDataDevice)
    // TODO get the keymap from some config source
    browserKeyboard.updateKeymap('qwerty.xkb')

    document.addEventListener('keyup', browserSession.eventSource((event) => {
      event.preventDefault()
      browserKeyboard.onKey(event, false)
    }), true)
    document.addEventListener('keydown', browserSession.eventSource((event) => {
      event.preventDefault()
      browserKeyboard.onKey(event, true)
    }), true)

    return browserKeyboard
  }

  /**
   * Use BrowserKeyboard.create(..) instead.
   * @private
   * @param {BrowserDataDevice} browserDataDevice
   */
  constructor (browserDataDevice) {
    /**
     * @type {BrowserDataDevice}
     * @private
     */
    this._browserDataDevice = browserDataDevice
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
  async updateKeymap (keymapFileName) {
    const browserXkb = await BrowserXkb.createFromResource(keymapFileName)
    if (this._browserXkb) {
      // TODO cleanup previous keymap state
    }
    this._browserXkb = browserXkb
    this.resources.forEach((resource) => {
      this.emitKeymap(resource)
    })
  }

  /**
   * @param {GrKeyboard}resource
   */
  async emitKeymap (resource) {
    const keymapString = this._browserXkb.asString()
    const textEncoder = new window.TextEncoder('utf-8')
    const keymapBuffer = textEncoder.encode(keymapString)
    const keymapBufferLength = keymapBuffer.buffer.byteLength
    const blobDescriptor = BrowserRtcBlobTransfer.createDescriptor(true, 'arraybuffer')
    resource.keymap(greenfield.GrKeyboard.KeymapFormat.xkbV1, blobDescriptor, keymapBufferLength)

    // cleanup of the blob transfer is initiated at the other end.
    const browserRtcBlobTransfer = await BrowserRtcBlobTransfer.get(blobDescriptor)
    browserRtcBlobTransfer.browserRtcPeerConnection.ensureP2S()
    const rtcDataChannel = await browserRtcBlobTransfer.open()
    // chrome doesn't like chunks > 16KB
    const maxChunkSize = 16 * 1000 // 1000 instead of 1024 to be on the safe side.

    if (keymapBufferLength > maxChunkSize) {
      const nroChunks = Math.ceil(keymapBufferLength / maxChunkSize)
      for (let i = 0; i < nroChunks; i++) {
        const chunk = keymapBuffer.slice(i * maxChunkSize, (i + 1) * maxChunkSize)
        rtcDataChannel.send(chunk.buffer)
      }
    } else {
      rtcDataChannel.send(keymapBuffer.buffer)
    }
  }

  /**
   * @param {HTMLCanvasElement}focus
   */
  focusGained (focus) {
    if (this.focus === focus) {
      return
    }
    this._focusLost()

    this.focus = focus
    this._browserDataDevice.onKeyboardFocusGained()

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

  focusLost () {
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
    this._browserDataDevice.onKeyboardFocusLost()
  }

  /**
   *
   * @param {KeyboardEvent}event
   * @param {boolean}down
   */
  onKey (event, down) {
    const keyCode = event.code
    const linuxKeyCode = BrowserXkb.linuxKeycode[keyCode]
    if (down && this._keys.includes(linuxKeyCode)) {
      // prevent key repeat from browser
      return
    }

    const modsUpdate = down ? this._browserXkb.keyDown(linuxKeyCode) : this._browserXkb.keyUp(linuxKeyCode)
    if (down) {
      this._keys.push(linuxKeyCode)
    } else {
      const index = this._keys.indexOf(linuxKeyCode)
      if (index > -1) {
        this._keys.splice(index, 1)
      }
    }

    if (this.focus === null) {
      return
    }

    const serial = this._nextSerial()
    const time = event.timeStamp
    const evdevKeyCode = linuxKeyCode - 8
    const state = down ? greenfield.GrKeyboard.KeyState.pressed : greenfield.GrKeyboard.KeyState.released

    const modsDepressed = this._browserXkb.modsDepressed
    const modsLatched = this._browserXkb.modsLatched
    const modsLocked = this._browserXkb.modsLocked
    const group = this._browserXkb.group

    this.resources.filter((resource) => {
      return resource.client === this.focus.view.browserSurface.resource.client
    }).forEach((resource) => {
      resource.key(serial, time, evdevKeyCode, state)
      if (modsUpdate) {
        resource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
      }
    })
  }

  /**
   * @param {GrKeyboard}resource
   */
  emitKeyRepeatInfo (resource) {
    if (resource.version >= 4) {
      // TODO get this from some config source
      resource.repeatInfo(40, 400)
    }
  }
}
