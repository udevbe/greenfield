// Copyright 2020 Erik De Rijcke
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

import {
  WlKeyboardRequests,
  WlKeyboardResource,
  WlKeyboardKeymapFormat,
  WlKeyboardKeyState
} from 'westfield-runtime-server'
import DataDevice from './DataDevice'
import { CompositorKeyboard } from './index'
import { KeyEvent } from './KeyEvent'
import Seat from './Seat'
import Session from './Session'
import Surface from './Surface'
import {
  buildNrmlvoEntries,
  createFromNames,
  createFromResource,
  linuxKeycode,
  nrmlvo,
  Xkb
} from './Xkb'

const { pressed, released } = WlKeyboardKeyState
const { xkbV1 } = WlKeyboardKeymapFormat

/**
 *
 *            The wl_keyboard interface represents one or more keyboards
 *            associated with a seat.
 */
export default class Keyboard implements WlKeyboardRequests, CompositorKeyboard {
  nrmlvo: nrmlvo
  defaultNrmlvo: nrmlvo
  nrmlvoEntries: nrmlvo[]
  resources: WlKeyboardResource[] = []
  // @ts-ignore set in create of Keyboard
  xkb: Xkb
  // @ts-ignore set in create of Seat
  seat: Seat
  private _dataDevice: DataDevice
  private _session: Session
  private _focus?: Surface
  private _keys: number[] = []
  private _keyboardFocusListeners: (() => void)[] = []
  private _keyboardFocusResolve?: () => void
  private _keyboardFocusPromise?: Promise<void>

  static create(session: Session, dataDevice: DataDevice): Keyboard {
    const nrmlvoEntries = buildNrmlvoEntries()

    // deduce from browser language settings
    const langTokens = navigator.language.split('-')
    const lang = langTokens.length === 1 ? langTokens[0].toLowerCase() : langTokens[1].toLowerCase()
    const nrmlvoEntry = nrmlvoEntries.find(nrmlvo => nrmlvo.layout === lang && nrmlvo.variant == null) || nrmlvoEntries.find(nrmlvo => nrmlvo.layout === 'us')
    if (nrmlvoEntry === undefined) {
      throw new Error('BUG. No default nrmlvo entry found.')
    }

    const keyboard = new Keyboard(dataDevice, session, nrmlvoEntries, nrmlvoEntry)
    keyboard.updateKeymapFromNames(keyboard.nrmlvo)

    return keyboard
  }

  private constructor(
    dataDevice: DataDevice,
    session: Session,
    nrmlvoEntries: nrmlvo[],
    nrmlvoEntry: nrmlvo
  ) {
    this._dataDevice = dataDevice
    this._session = session
    this.nrmlvoEntries = nrmlvoEntries
    this.nrmlvo = nrmlvoEntry
    this.defaultNrmlvo = nrmlvoEntry
  }

  addKeyboardFocusListener(listener: () => void) {
    this._keyboardFocusListeners.push(listener)
  }

  removeKeyboardFocusListener(listener: () => void) {
    const idx = this._keyboardFocusListeners.indexOf(listener)
    if (idx > 0) {
      this._keyboardFocusListeners.splice(idx, 1)
    }
  }

  onKeyboardFocusChanged(): Promise<void> {
    if (this._keyboardFocusPromise === undefined) {
      this._keyboardFocusPromise = new Promise(resolve => {
        this._keyboardFocusResolve = resolve
      }).then(() => {
        this._keyboardFocusPromise = undefined
        this._keyboardFocusResolve = undefined
      })
    }

    return this._keyboardFocusPromise
  }

  release(resource: WlKeyboardResource) {
    resource.destroy()
    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
  }

  updateKeymapFromNames(nrmlvo: nrmlvo) {
    if (this.xkb) {
      // TODO cleanup previous keymap state
    }
    this.nrmlvo = nrmlvo
    this.xkb = createFromNames(nrmlvo)
    this.resources.forEach(resource => this.emitKeymap(resource))
  }

  updateKeymap(keymapFileName: string) {
    createFromResource(keymapFileName).then(
      (xkb: Xkb) => {
        if (this.xkb) {
          // TODO cleanup previous keymap state
        }
        this.xkb = xkb
        this.resources.forEach(resource => this.emitKeymap(resource))
      })
  }

  emitKeymap(resource: WlKeyboardResource) {
    const keymapString = this.xkb.asString()
    const textEncoder = new TextEncoder()
    const keymapBuffer = textEncoder.encode(keymapString).buffer

    const keymapWebFD = this._session.webFS.fromArrayBuffer(keymapBuffer)
    resource.keymap(xkbV1, keymapWebFD, keymapBuffer.byteLength)
    resource.client.connection.flush()
  }

  focusGained(focus: Surface) {
    if (!focus.hasKeyboardInput || this.focus === focus) {
      return
    }
    if (this.focus) {
      this.focusLost()
    }

    if (focus) {
      this.focus = focus
      const { client, id } = focus.resource
      this._session.userShell.events.updateUserSeat?.({
        ...this.seat.compositorSeatState,
        keyboardFocus: { id: `${id}`, clientId: client.id }
      })

      this._dataDevice.onKeyboardFocusGained(focus)

      focus.resource.onDestroy().then(() => {
        if (this.focus === focus) {
          this.focus = undefined
        }
      })

      const serial = this.seat.nextSerial()
      const surface = this.focus.resource
      const keys = new Uint8Array(this._keys)

      const targetFocus = this.focus
      this.resources
        .filter(resource => resource.client === targetFocus.resource.client)
        .forEach(resource => resource.enter(serial, surface, keys))
      if (this._keyboardFocusResolve) {
        this._keyboardFocusResolve()
      }
      this._keyboardFocusListeners.forEach(listener => listener())
    }
  }

  focusLost() {
    if (this.focus) {
      const serial = this.seat.nextSerial()
      const surface = this.focus.resource

      const targetFocus = this.focus
      this.resources
        .filter(resource => resource.client === targetFocus.resource.client)
        .forEach(resource => resource.leave(serial, surface))

      this.focus = undefined
      this._session.userShell.events.updateUserSeat?.({
        ...this.seat.compositorSeatState,
        keyboardFocus: undefined
      })
    }
  }

  set focus(surface) {
    this._focus = surface
    if (this._keyboardFocusResolve) {
      this._keyboardFocusResolve()
    }
    this._keyboardFocusListeners.forEach(listener => listener())
  }

  get focus() {
    return this._focus
  }

  handleKey(event: KeyEvent) {
    const keyCode = event.code
    const linuxKeyCode = linuxKeycode[keyCode]
    if (event.down && this._keys.includes(linuxKeyCode)) {
      // prevent key repeat from browser
      return
    }

    const modsUpdate = event.down ? this.xkb.keyDown(linuxKeyCode) : this.xkb.keyUp(linuxKeyCode)
    if (event.down) {
      this._keys.push(linuxKeyCode)
    } else {
      const index = this._keys.indexOf(linuxKeyCode)
      if (index > -1) {
        this._keys.splice(index, 1)
      }
    }

    if (this.focus) {
      const time = event.timestamp
      const evdevKeyCode = linuxKeyCode - 8
      const state = event.down ? pressed : released
      const serial = this.seat.nextSerial()

      const modsDepressed = this.xkb.modsDepressed
      const modsLatched = this.xkb.modsLatched
      const modsLocked = this.xkb.modsLocked
      const group = this.xkb.group

      const targetFocus = this.focus
      this.resources
        .filter(resource => resource.client === targetFocus.resource.client)
        .forEach(resource => {
          resource.key(serial, time, evdevKeyCode, state)
          if (modsUpdate) {
            resource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
          }
        })
    }
  }

  emitKeyRepeatInfo(resource: WlKeyboardResource) {
    if (resource.version >= 4) {
      // TODO get this from some config source
      // TODO make available in config menu
      resource.repeatInfo(40, 400)
    }
  }
}
