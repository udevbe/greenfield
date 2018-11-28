'use strict'

import WlKeyboardRequests from './protocol/WlKeyboardRequests'
import WlKeyboardResource from './protocol/WlKeyboardResource'

import Xkb from './Xkb'
import WebFD from './WebFD'

const { pressed, released } = WlKeyboardResource.KeyState
const { xkbV1 } = WlKeyboardResource.KeymapFormat

/**
 *
 *            The wl_keyboard interface represents one or more keyboards
 *            associated with a seat.
 * @implements WlKeyboardRequests
 */
export default class Keyboard extends WlKeyboardRequests {
  /**
   * @param {!Session}session
   * @param {!DataDevice} dataDevice
   * @return {!Keyboard}
   */
  static create (session, dataDevice) {
    const keyboard = new Keyboard(dataDevice)
    // TODO get the keymap from some config source
    // TODO make available in config menu
    keyboard.updateKeymap('qwerty.xkb')

    document.addEventListener('keyup', (event) => {
      const keyboardEvent = /** @type {KeyboardEvent} */ event
      if (keyboard._handleKey(keyboardEvent, false)) {
        keyboardEvent.preventDefault()
        keyboardEvent.stopPropagation()
        session.flush()
      }
    })
    document.addEventListener('keydown', (event) => {
      const keyboardEvent = /** @type {KeyboardEvent} */ event
      if (keyboard._handleKey(keyboardEvent, true)) {
        keyboardEvent.preventDefault()
        keyboardEvent.stopPropagation()
        session.flush()
      }
    })

    return keyboard
  }

  /**
   * Use Keyboard.create(..) instead.
   * @private
   * @param {!DataDevice} dataDevice
   */
  constructor (dataDevice) {
    super()
    /**
     * @type {!DataDevice}
     * @const
     * @private
     */
    this._dataDevice = dataDevice
    /**
     * @type {!Array<WlKeyboardResource>}
     */
    this.resources = []
    /**
     * @type {?Xkb}
     * @private
     */
    this._xkb = null
    /**
     * @type {?Surface}
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
     * @type {?Promise<void>}
     * @private
     */
    this._keyboardFocusPromise = null
    /**
     * @type {?Seat}
     */
    this.seat = null
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
   * @return {Promise<void>}
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
   * @param {!WlKeyboardResource} resource
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
  updateKeymap (keymapFileName) {
    Xkb.createFromResource(keymapFileName).then((xkb) => {
      if (this._xkb) {
        // TODO cleanup previous keymap state
      }
      this._xkb = xkb
      this.resources.forEach((resource) => {
        this.emitKeymap(resource)
      })
    })
  }

  /**
   * @param {!WlKeyboardResource}resource
   */
  emitKeymap (resource) {
    const keymapString = this._xkb.asString()
    const textEncoder = new TextEncoder('utf-8')
    const keymapBuffer = textEncoder.encode(keymapString).buffer
    // TODO We only need to create a new WebFD for each new native client host. Currently there's not really a way
    // to check this. This way we don't need to re-upload the same data to the same remote host each time.
    const webFD = WebFD.create(resource.client)
    webFD.openAndWriteShm(keymapBuffer).then((nativeFd) => {
      resource.keymap(xkbV1, nativeFd, keymapBuffer.byteLength)
      resource.client.flush()
      webFD.close()
    })
  }

  /**
   * @param {!Surface}focus
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
      this._dataDevice.onKeyboardFocusGained(focus)

      focus.resource.onDestroy().then(() => {
        if (this.focus === focus) {
          this.focus = null
        }
      })

      const serial = this.seat.nextSerial()
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
      const serial = this.seat.nextSerial()
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
   * @param {?Surface}surface
   */
  set focus (surface) {
    this._focus = surface
    if (this._keyboardFocusResolve) {
      this._keyboardFocusResolve()
    }
    this._keyboardFocusListeners.forEach((listener) => {
      listener()
    })
  }

  /**
   * @return {?Surface}
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
    const linuxKeyCode = Xkb.linuxKeycode[keyCode]
    if (down && this._keys.includes(linuxKeyCode)) {
      // prevent key repeat from browser
      return false
    }

    const modsUpdate = down ? this._xkb.keyDown(linuxKeyCode) : this._xkb.keyUp(linuxKeyCode)
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
      const time = event.timeStamp
      const evdevKeyCode = linuxKeyCode - 8
      const state = down ? pressed : released
      const serial = this.seat.nextKeySerial(down)

      const modsDepressed = this._xkb.modsDepressed
      const modsLatched = this._xkb.modsLatched
      const modsLocked = this._xkb.modsLocked
      const group = this._xkb.group

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
   * @param {!WlKeyboardResource}resource
   */
  emitKeyRepeatInfo (resource) {
    if (resource.version >= 4) {
      // TODO get this from some config source
      // TODO make available in config menu
      resource.repeatInfo(40, 400)
    }
  }
}
