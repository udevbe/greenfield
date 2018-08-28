'use strict'

import { GrKeyboard } from './protocol/greenfield-browser-protocol'

import BrowserXkb from './BrowserXkb'
import BrowserRtcBlobTransfer from './BrowserRtcBlobTransfer'

const {pressed, released} = GrKeyboard.KeyState
const {xkbV1} = GrKeyboard.KeymapFormat

/**
 *
 *            The gr_keyboard interface represents one or more keyboards
 *            associated with a seat.
 *
 */
export default class BrowserKeyboard {
  /**
   * @param {!BrowserSession}browserSession
   * @param {!BrowserDataDevice} browserDataDevice
   * @return {!BrowserKeyboard}
   */
  static create (browserSession, browserDataDevice) {
    const browserKeyboard = new BrowserKeyboard(browserDataDevice)
    // TODO get the keymap from some config source
    // TODO make available in config menu
    browserKeyboard.updateKeymap('qwerty.xkb')

    document.addEventListener('keyup', (event) => {
      if (browserKeyboard._handleKey(event, false)) {
        event.preventDefault()
        event.stopPropagation()
      }
      browserSession.flush()
    })
    document.addEventListener('keydown', (event) => {
      if (browserKeyboard._handleKey(event, true)) {
        event.preventDefault()
        event.stopPropagation()
      }
      browserSession.flush()
    })

    return browserKeyboard
  }

  /**
   * Use BrowserKeyboard.create(..) instead.
   * @private
   * @param {!BrowserDataDevice} browserDataDevice
   */
  constructor (browserDataDevice) {
    /**
     * @type {!BrowserDataDevice}
     * @const
     * @private
     */
    this._browserDataDevice = browserDataDevice
    /**
     * @type {!Array<GrKeyboard>}
     */
    this.resources = []
    /**
     * @type {?BrowserXkb}
     * @private
     */
    this._browserXkb = null
    /**
     * @type {?BrowserSurface}
     */
    this._focus = null
    /**
     * @type {?Array<number>}
     * @private
     */
    this._keys = []
    /**
     * @type {?Array<function():void>}
     * @private
     */
    this._keyboardFocusListeners = []
    /**
     * @type {?function():void|null}
     * @private
     */
    this._keyboardFocusResolve = null
    /**
     * @type {?Promise}
     * @private
     */
    this._keyboardFocusPromise = null
    /**
     * @type {?BrowserSeat}
     */
    this.browserSeat = null
  }

  /**
   * @param {!function():void}listener
   */
  addKeyboardFocusListener (listener) {
    this._keyboardFocusListeners.push(listener)
  }

  /**
   * @param {!function():void}listener
   */
  removeKeyboardFocusListener (listener) {
    const idx = this._keyboardFocusListeners.indexOf(listener)
    if (idx > 0) {
      this._keyboardFocusListeners.splice(idx, 1)
    }
  }

  /**
   * @return {!Promise}
   */
  onKeyboardFocusChanged () {
    if (!this._keyboardFocusPromise) {
      this._keyboardFocusPromise = new Promise((resolve) => {
        this._keyboardFocusResolve = resolve
      }).then(() => {
        this._keyboardFocusPromise = null
        this._keyboardFocusResolve = null
      })
    }

    return this._keyboardFocusPromise
  }

  /**
   *
   * @param {!GrKeyboard} resource
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
   * @param {!string}keymapFileName
   */
  async updateKeymap (keymapFileName) {
    const browserXkb = await BrowserXkb.createFromResource(keymapFileName)
    if (this._browserXkb) {
      // TODO cleanup previous keymap state
    }
    this._browserXkb = browserXkb
    this.resources.forEach(async (resource) => {
      await this.emitKeymap(resource)
    })
  }

  /**
   * @param {!GrKeyboard}resource
   */
  async emitKeymap (resource) {
    const keymapString = this._browserXkb.asString()
    const textEncoder = new window.TextEncoder('utf-8')
    const keymapBuffer = textEncoder.encode(keymapString)
    const keymapBufferLength = keymapBuffer.buffer.byteLength
    const blobDescriptor = BrowserRtcBlobTransfer.createDescriptor(true, 'arraybuffer')
    resource.keymap(xkbV1, blobDescriptor, keymapBufferLength)

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
   * @param {!BrowserSurface}focus
   */
  focusGained (focus) {
    if (!focus.hasKeyboardInput || this.focus === focus) {
      return
    }
    if (this.focus) {
      this.focusLost()
    }

    if (focus) {
      this.focus = focus
      this._browserDataDevice.onKeyboardFocusGained(focus)

      focus.resource.onDestroy().then(() => {
        if (this.focus === focus) {
          this.focus = null
        }
      })

      const serial = this.browserSeat.nextSerial()
      const surface = this.focus.resource
      const keys = new Uint8Array(this._keys).buffer

      this.resources.filter((resource) => {
        return resource.client === this.focus.resource.client
      }).forEach((resource) => {
        resource.enter(serial, surface, keys)
      })
      if (this._keyboardFocusResolve) {
        this._keyboardFocusResolve()
      }
      this._keyboardFocusListeners.forEach((listener) => {
        listener()
      })
    }
  }

  focusLost () {
    if (this.focus) {
      const serial = this.browserSeat.nextSerial()
      const surface = this.focus.resource

      this.resources.filter((resource) => {
        return resource.client === this.focus.resource.client
      }).forEach((resource) => {
        resource.leave(serial, surface)
      })

      this.focus = null
    }
  }

  /**
   * @param {?BrowserSurface}browserSurface
   */
  set focus (browserSurface) {
    this._focus = browserSurface
    if (this._keyboardFocusResolve) {
      this._keyboardFocusResolve()
    }
    this._keyboardFocusListeners.forEach((listener) => {
      listener()
    })
  }

  /**
   * @return {?BrowserSurface}
   */
  get focus () {
    return this._focus
  }

  /**
   *
   * @param {!KeyboardEvent}event
   * @param {!boolean}down
   * @return {!boolean}
   */
  _handleKey (event, down) {
    let consumed = false
    const keyCode = event.code
    const linuxKeyCode = BrowserXkb.linuxKeycode[keyCode]
    if (down && this._keys.includes(linuxKeyCode)) {
      // prevent key repeat from browser
      return false
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

    if (this.focus) {
      consumed = true
      const serial = this.browserSeat.nextInputSerial()
      const time = event.timeStamp
      const evdevKeyCode = linuxKeyCode - 8
      const state = down ? pressed : released

      const modsDepressed = this._browserXkb.modsDepressed
      const modsLatched = this._browserXkb.modsLatched
      const modsLocked = this._browserXkb.modsLocked
      const group = this._browserXkb.group

      this.resources.filter((resource) => {
        return resource.client === this.focus.resource.client
      }).forEach((resource) => {
        resource.key(serial, time, evdevKeyCode, state)
        if (modsUpdate) {
          resource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
        }
      })
    }

    return consumed
  }

  /**
   * @param {!GrKeyboard}resource
   */
  emitKeyRepeatInfo (resource) {
    if (resource.version >= 4) {
      // TODO get this from some config source
      // TODO make available in config menu
      resource.repeatInfo(40, 400)
    }
  }
}
