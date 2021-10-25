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
  WlKeyboardKeymapFormat,
  WlKeyboardKeyState,
  WlKeyboardRequests,
  WlKeyboardResource,
} from 'westfield-runtime-server'
import { CompositorKeyboard, KeyCode } from './index'
import { KeyEvent } from './KeyEvent'
import { Seat, KeyboardLocks } from './Seat'
import Surface from './Surface'
import { buildNrmlvoEntries, createFromNames, nrmlvo, Xkb } from './Xkb'

const { xkbV1 } = WlKeyboardKeymapFormat

export class DefaultKeyboardGrab implements KeyboardGrab {
  static create(keyboard: Keyboard): KeyboardGrab {
    return new DefaultKeyboardGrab(keyboard)
  }

  private constructor(readonly keyboard: Keyboard) {}

  cancel(): void {
    // do nothing
  }

  key(event: KeyEvent): void {
    this.keyboard.sendKey(event)
  }

  modifiers(serial: number, modsDepressed: number, modsLatched: number, modsLocked: number, group: number): void {
    this.keyboard.sendModifiers(serial, modsDepressed, modsLatched, modsLocked, group)
  }
}

export interface KeyboardGrab {
  key(event: KeyEvent): void

  modifiers(serial: number, modsDepressed: number, modsLatched: number, modsLocked: number, group: number): void

  cancel(): void
}

export class Keyboard implements WlKeyboardRequests, CompositorKeyboard {
  static create(seat: Seat): Keyboard {
    const nrmlvoEntries = buildNrmlvoEntries()

    // deduce from browser language settings
    const langTokens = navigator.language.split('-')
    const lang = langTokens.length === 1 ? langTokens[0].toLowerCase() : langTokens[1].toLowerCase()
    const nrmlvoEntry =
      nrmlvoEntries.find((nrmlvo) => nrmlvo.layout === lang && nrmlvo.variant == null) ||
      nrmlvoEntries.find((nrmlvo) => nrmlvo.layout === 'us')
    if (nrmlvoEntry === undefined) {
      throw new Error('BUG. No default nrmlvo entry found.')
    }

    const xkb = createFromNames(nrmlvoEntry)
    return new Keyboard(seat, nrmlvoEntries, nrmlvoEntry, xkb)
  }

  readonly defaultNrmlvo: nrmlvo
  resources: WlKeyboardResource[] = []
  focusSerial = 0
  grabKey?: KeyCode
  grabSerial?: number
  grabTime?: number
  focus?: Surface
  private readonly focusDestroyListener = () => {
    this.setFocus(undefined)
  }
  keys: number[] = []
  focusListeners: (() => void)[] = []
  readonly defaultGrab = DefaultKeyboardGrab.create(this)
  grab: KeyboardGrab = this.defaultGrab
  inputMethodGrab?: KeyboardGrab
  pendingKeymap?: nrmlvo
  modifiers: {
    modsDepressed: number
    modsLatched: number
    modsLocked: number
    group: number
  } = {
    modsDepressed: 0,
    modsLatched: 0,
    modsLocked: 0,
    group: 0,
  }

  private constructor(
    public readonly seat: Seat,
    public readonly nrmlvoEntries: nrmlvo[],
    public nrmlvo: nrmlvo,
    public xkb: Xkb,
  ) {
    this.defaultNrmlvo = nrmlvo
  }

  release(resource: WlKeyboardResource): void {
    resource.destroy()
    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
  }

  startGrab(grab: KeyboardGrab): void {
    this.grab = grab
  }

  endGrab(): void {
    this.grab = this.defaultGrab
  }

  cancelGrab(): void {
    this.grab.cancel()
  }

  setFocus(surface: Surface | undefined): void {
    if (this.focus && !this.focus.destroyed && this.focus !== surface) {
      const serial = this.seat.nextSerial()
      const focusResource = this.focus.resource
      this.resources
        .filter((keyboardResource) => keyboardResource.client === focusResource.client)
        .forEach((keyboardResource) => {
          keyboardResource.leave(serial, focusResource)
        })
    }

    if (surface && this.focus !== surface) {
      const serial = this.seat.nextSerial()
      this.resources
        .filter((keyboardResource) => keyboardResource.client === surface.resource.client)
        .forEach((keyboardResource) => {
          keyboardResource.enter(serial, surface.resource, new Uint8Array(this.keys))
          keyboardResource.modifiers(
            serial,
            this.xkb.modsDepressed,
            this.xkb.modsLatched,
            this.xkb.modsLocked,
            this.xkb.group,
          )
        })
      this.focusSerial = serial
    }

    if (this.seat.savedKbdFocus) {
      this.seat.savedKbdFocus.resource.removeDestroyListener(this.seat.savedKbdFocusListener)
      this.seat.savedKbdFocus = undefined
    }

    if (this.focus) {
      this.focus.resource.removeDestroyListener(this.focusDestroyListener)
    }
    surface?.resource.addDestroyListener(this.focusDestroyListener)

    this.focus = surface
    this.focusListeners.forEach((listener) => listener())
  }

  sendKeymap(resource: WlKeyboardResource): void {
    const keymapString = this.xkb.asString()
    const textEncoder = new TextEncoder()
    const keymapBuffer = textEncoder.encode(keymapString).buffer

    const keymapWebFD = this.seat.session.webFS.fromArrayBuffer(keymapBuffer)
    resource.keymap(xkbV1, keymapWebFD, keymapBuffer.byteLength)
  }

  setLocks(mask: KeyboardLocks, value: KeyboardLocks): void {
    const modsDepressed = this.xkb.modsDepressed
    const modsLatched = this.xkb.modsLatched
    let modsLocked = this.xkb.modsLocked
    const group = this.xkb.group

    const num = 1 << this.xkb.mod2Mod
    const caps = 1 << this.xkb.capsMod

    if (mask & KeyboardLocks.NUM_LOCK) {
      if (value & KeyboardLocks.NUM_LOCK) {
        modsLocked |= num
      } else {
        modsLocked &= ~num
      }
    }
    if (mask & KeyboardLocks.CAPS_LOCK) {
      if (value & KeyboardLocks.CAPS_LOCK) {
        modsLocked |= caps
      } else {
        modsLocked &= ~caps
      }
    }

    this.xkb.updateMask(modsDepressed, modsLatched, modsLocked, 0, 0, group)

    const serial = this.seat.nextSerial()
    this.seat.notifyModifiers(serial)
  }

  sendModifiers(serial: number, modsDepressed: number, modsLatched: number, modsLocked: number, group: number): void {
    if (this.focus) {
      this.resources
        .filter((keyboardResource) => keyboardResource.client == this.focus?.resource.client)
        .forEach((keyboardResource) => {
          keyboardResource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
        })
    }

    if (this.seat.pointer.focus && this.seat.pointer.focus.surface !== this.focus) {
      const pointerClient = this.seat.pointer.focus.surface.resource.client
      this.resources
        .filter((keyboardResource) => keyboardResource.client == pointerClient)
        .forEach((keyboardResource) => {
          keyboardResource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
        })
    }
  }

  sendKey(event: KeyEvent): void {
    if (this.focus === undefined) {
      return
    }

    const serial = this.seat.nextSerial()
    this.resources
      .filter((keyboardResource) => keyboardResource.client == this.focus?.resource.client)
      .forEach((keyboardResource) => {
        keyboardResource.key(
          serial,
          event.timeStamp,
          event.keyCode.evdevKeyCode,
          event.pressed ? WlKeyboardKeyState.pressed : WlKeyboardKeyState.released,
        )
      })
  }
}
