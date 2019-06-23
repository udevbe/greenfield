// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

import WlKeyboardRequests from './protocol/WlKeyboardRequests'
import WlKeyboardResource from './protocol/WlKeyboardResource'

import Xkb from './Xkb'

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
    const nrmlvoEntries = Xkb.buildNrmlvoEntries()

    const langTokens = navigator.language.split('-')
    let lang = langTokens.length === 1 ? langTokens[0].toLowerCase() : langTokens[1].toLowerCase()
    // TODO load rmlvo (names) from profile(?) and if not defined in profile, deduce from browser language settings
    const nrmlvoEntry = nrmlvoEntries.find(nrmlvo => nrmlvo.layout === lang && nrmlvo.variant == null) || nrmlvoEntries.find(nrmlvo => nrmlvo.layout === 'us')

    const keyboard = new Keyboard(dataDevice, session, nrmlvoEntries, nrmlvoEntry)
    keyboard.updateKeymapFromNames(keyboard.nrmlvo)

    document.addEventListener('keyup', event => {
      const keyboardEvent = /** @type {KeyboardEvent} */ event
      if (keyboard._handleKey(keyboardEvent, false)) {
        keyboardEvent.preventDefault()
        keyboardEvent.stopPropagation()
        session.flush()
      }
    })
    document.addEventListener('keydown', event => {
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
   * @param {!Session}session
   * @param {Array<{name: string, rules: string, model: string, layout: string, variant: string, options: string}>}nrmlvoEntries
   * @param {{name: string, rules: string, model: string, layout: string, variant: string, options: string}}nrmlvoEntry
   */
  constructor (dataDevice, session, nrmlvoEntries, nrmlvoEntry) {
    super()
    /**
     * @type {!DataDevice}
     * @const
     * @private
     */
    this._dataDevice = dataDevice
    /**
     * @type {!Session}
     * @private
     */
    this._session = session
    /**
     * @type {Array<{name: string, rules: string, model: string, layout: string, variant: string, options: string}>}
     * @private
     */
    this.nrmlvoEntries = nrmlvoEntries
    /**
     * @type {!Array<WlKeyboardResource>}
     */
    this.resources = []
    /**
     * @type {?Xkb}
     */
    this.xkb = null
    /**
     * @type {{name: string, rules: string, model: string, layout: string, variant: string, options: string}}
     */
    this.nrmlvo = nrmlvoEntry
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
      this._keyboardFocusPromise = new Promise(resolve => {
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
   * @param {{ name: string, rules: String, model: String, layout: String, variant: String, options: String }}nrmlvo
   */
  updateKeymapFromNames (nrmlvo) {
    if (this.xkb) {
      // TODO cleanup previous keymap state
    }
    this.nrmlvo = nrmlvo
    this.xkb = Xkb.createFromNames(nrmlvo)
    this.resources.forEach(resource => this.emitKeymap(resource))
  }

  /**
   * @param {!string}keymapFileName
   */
  updateKeymap (keymapFileName) {
    Xkb.createFromResource(keymapFileName).then(
      /**
       * @param {Xkb}xkb
       */
      xkb => {
        if (this.xkb) {
          // TODO cleanup previous keymap state
        }
        this.xkb = xkb
        this.resources.forEach(resource => this.emitKeymap(resource))
      })
  }

  /**
   * @param {!WlKeyboardResource}resource
   */
  emitKeymap (resource) {
    const keymapString = this.xkb.asString()
    const textEncoder = new TextEncoder('utf-8')
    const keymapBuffer = textEncoder.encode(keymapString).buffer

    const keymapWebFD = this._session.webFS.fromArrayBuffer(keymapBuffer)
    resource.keymap(xkbV1, keymapWebFD, keymapBuffer.byteLength)
    resource.client.connection.flush()
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

      this.resources
        .filter(resource => resource.client === this.focus.resource.client)
        .forEach(resource => resource.enter(serial, surface, keys))
      if (this._keyboardFocusResolve) {
        this._keyboardFocusResolve()
      }
      this._keyboardFocusListeners.forEach(listener => listener())
    }
  }

  focusLost () {
    if (this.focus) {
      const serial = this.seat.nextSerial()
      const surface = this.focus.resource

      this.resources
        .filter(resource => resource.client === this.focus.resource.client)
        .forEach(resource => resource.leave(serial, surface))

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
    this._keyboardFocusListeners.forEach(listener => listener())
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

    const modsUpdate = down ? this.xkb.keyDown(linuxKeyCode) : this.xkb.keyUp(linuxKeyCode)
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
      const serial = this.seat.nextSerial()

      const modsDepressed = this.xkb.modsDepressed
      const modsLatched = this.xkb.modsLatched
      const modsLocked = this.xkb.modsLocked
      const group = this.xkb.group

      this.resources
        .filter(resource => resource.client === this.focus.resource.client)
        .forEach(resource => {
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
