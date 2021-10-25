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

import { lib } from './lib'

const XKB_KEYMAP_FORMAT_TEXT_V1 = 1 as const
const XKB_CONTEXT_NO_DEFAULT_INCLUDES = 1 as const
const XKB_CONTEXT_NO_ENVIRONMENT_NAMES = 2 as const
const XKB_KEYMAP_COMPILE_NO_FLAGS = 0 as const
const XKB_KEY_UP = 0 as const
const XKB_KEY_DOWN = 1 as const
const XKB_STATE_MODS_DEPRESSED = 1 as const
const XKB_STATE_MODS_LATCHED = 2 as const
const XKB_STATE_MODS_LOCKED = 4 as const
const XKB_STATE_LAYOUT_EFFECTIVE = 128 as const
const XKB_MOD_NAME_SHIFT = 'Shift' as const
const XKB_MOD_NAME_CAPS = 'Lock' as const
const XKB_MOD_NAME_CTRL = 'Control' as const
const XKB_MOD_NAME_ALT = 'Mod1' as const
const XKB_MOD_NAME_NUM = 'Mod2' as const
const XKB_MOD_NAME_LOGO = 'Mod4' as const
const XKB_LED_NAME_CAPS = 'Caps Lock' as const
const XKB_LED_NAME_NUM = 'Num Lock' as const
const XKB_LED_NAME_SCROLL = 'Scroll Lock' as const

export enum Led {
  LED_NUM_LOCK = 1,
  LED_CAPS_LOCK = 2,
  LED_SCROLL_LOCK = 4,
}

export type nrmlvo = {
  name: string
  rules: string
  model: string
  layout: string
  variant?: string
  options?: string
}

export function buildNrmlvoEntries(): nrmlvo[] {
  // @ts-ignore
  const evdevList: string = lib.xkbcommon.FS.readFile('/usr/local/share/X11/xkb/rules/evdev.lst', { encoding: 'utf8' })
  const lines = evdevList.split('\n')

  let entries: string[] = []

  const rmlvos: {
    rules: 'evdev'
    model: string[]
    layout: string[]
    variant: string[]
    option: string[]
  } = {
    rules: 'evdev',
    model: [],
    layout: [],
    variant: [],
    option: [],
  }
  lines.forEach((line) => {
    if (line.startsWith('!')) {
      // @ts-ignore
      entries = rmlvos[line.substring(1).trim()]
    } else if (line.length) {
      entries.push(line.trim())
    }
  })

  return rmlvos.layout
    .flatMap((layoutLine) => {
      const [layout, layoutName] = layoutLine.split(/\s(.+)/)

      const nrmlvoItems: nrmlvo[] = []
      nrmlvoItems.push({
        name: layoutName.trim(),
        rules: 'evdev',
        model: 'pc105',
        layout,
      })

      rmlvos.variant.forEach((variantLine) => {
        const [variant, variantName] = variantLine.split(/\s(.+)/)

        if (variantName.trim().startsWith(layout)) {
          const newEntry = {
            name: `${layoutName.trim()} - ${variantName
              .trim()
              .substring(layout.length + 2)
              .trim()}`,
            rules: 'evdev',
            model: 'pc105',
            layout,
            variant,
          }
          // due to a bug in xkb config, we need to check duplicate entries
          const duplicate = nrmlvoItems.find((rmlvoItem) => rmlvoItem.name === newEntry.name)
          if (!duplicate) {
            nrmlvoItems.push(newEntry)
          }
        }
      })

      // due to a bug in xkb config, we need to check duplicate entries
      return nrmlvoItems
    })
    .sort(({ name: name0 }, { name: name1 }) => name0.localeCompare(name1))
}

export function createFromResource(resource: string): Promise<Xkb> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const mappingFile = xhr.responseText
        try {
          const xkb = createFromString(mappingFile)
          resolve(xkb)
        } catch (error) {
          reject(error)
        }
      } // TODO reject if we have something else than 2xx
    }

    xhr.open('GET', `keymaps/${resource}`)
    xhr.send()
  })
}

/**
 * @param keymapLayout an xkb keymap as a single string.
 */
export function createFromString(keymapLayout: string): Xkb {
  const keymapLayoutPtr = lib.xkbcommon._malloc(lib.xkbcommon.lengthBytesUTF8(keymapLayout) + 1)
  lib.xkbcommon.stringToUTF8(keymapLayout, keymapLayoutPtr, lib.xkbcommon.lengthBytesUTF8(keymapLayout) + 1)
  const xkbContext = lib.xkbcommon._xkb_context_new(XKB_CONTEXT_NO_DEFAULT_INCLUDES | XKB_CONTEXT_NO_ENVIRONMENT_NAMES)
  const keymap = lib.xkbcommon._xkb_keymap_new_from_string(
    xkbContext,
    keymapLayoutPtr,
    XKB_KEYMAP_FORMAT_TEXT_V1,
    XKB_KEYMAP_COMPILE_NO_FLAGS,
  )
  const state = lib.xkbcommon._xkb_state_new(keymap)
  lib.xkbcommon._free(keymapLayoutPtr)

  return new Xkb(keymap, state)
}

export function createFromNames({
  rules,
  model,
  layout,
  variant,
  options,
}: {
  rules?: string
  model?: string
  layout?: string
  variant?: string
  options?: string
}): Xkb {
  const xkbRuleNamesPtr = lib.xkbcommon._malloc(5 * 4)
  const xkbRuleNamesBuffer = new Uint32Array(lib.xkbcommon.HEAP8.buffer, xkbRuleNamesPtr, 5)

  xkbRuleNamesBuffer[0] = stringToPointer(rules)
  xkbRuleNamesBuffer[1] = stringToPointer(model)
  xkbRuleNamesBuffer[2] = stringToPointer(layout)
  xkbRuleNamesBuffer[3] = stringToPointer(variant)
  xkbRuleNamesBuffer[4] = stringToPointer(options)

  const xkbContext = lib.xkbcommon._xkb_context_new(0)
  const keymap = lib.xkbcommon._xkb_keymap_new_from_names(xkbContext, xkbRuleNamesPtr, XKB_KEYMAP_COMPILE_NO_FLAGS)
  const state = lib.xkbcommon._xkb_state_new(keymap)

  xkbRuleNamesBuffer.forEach((pointer) => lib.xkbcommon._free(pointer))
  lib.xkbcommon._free(xkbRuleNamesPtr)

  return new Xkb(keymap, state)
}

function stringToPointer(value?: string): number {
  if (value) {
    const strLength = lib.xkbcommon.lengthBytesUTF8(value) + 1
    const stringPtr = lib.xkbcommon._malloc(strLength)
    lib.xkbcommon.stringToUTF8(value, stringPtr, strLength)
    return stringPtr
  } else {
    return 0
  }
}

export class Xkb {
  leds: Led = 0
  readonly shiftMod: number
  readonly capsMod: number
  readonly ctrlMod: number
  readonly altMod: number
  readonly mod2Mod: number
  readonly mod3Mod: number
  readonly superMod: number
  readonly mod5Mod: number
  readonly numLed: number
  readonly capsLed: number
  readonly scrollLed: number
  readonly keymapString: string

  constructor(public readonly keymap: number, public readonly state: number) {
    const modNameShift = stringToPointer(XKB_MOD_NAME_SHIFT)
    const modNameCaps = stringToPointer(XKB_MOD_NAME_CAPS)
    const modNameCtrl = stringToPointer(XKB_MOD_NAME_CTRL)
    const modNameAlt = stringToPointer(XKB_MOD_NAME_ALT)
    const mod2 = stringToPointer(XKB_MOD_NAME_NUM)
    const mod3 = stringToPointer('Mod3')
    const logo = stringToPointer(XKB_MOD_NAME_LOGO)
    const mod5 = stringToPointer('Mod5')
    const num = stringToPointer(XKB_LED_NAME_NUM)
    const caps = stringToPointer(XKB_LED_NAME_CAPS)
    const scroll = stringToPointer(XKB_LED_NAME_SCROLL)

    this.shiftMod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, modNameShift)
    this.capsMod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, modNameCaps)
    this.ctrlMod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, modNameCtrl)
    this.altMod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, modNameAlt)
    this.mod2Mod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, mod2)
    this.mod3Mod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, mod3)
    this.superMod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, logo)
    this.mod5Mod = lib.xkbcommon._xkb_keymap_mod_get_index(this.keymap, mod5)

    this.numLed = lib.xkbcommon._xkb_keymap_led_get_index(this.keymap, num)
    this.capsLed = lib.xkbcommon._xkb_keymap_led_get_index(this.keymap, caps)
    this.scrollLed = lib.xkbcommon._xkb_keymap_led_get_index(this.keymap, scroll)

    const keymapStringPtr = lib.xkbcommon._xkb_keymap_get_as_string(this.keymap, XKB_KEYMAP_FORMAT_TEXT_V1)
    this.keymapString = lib.xkbcommon.UTF8ToString(keymapStringPtr)

    lib.xkbcommon._free(modNameShift)
    lib.xkbcommon._free(modNameCaps)
    lib.xkbcommon._free(modNameCtrl)
    lib.xkbcommon._free(modNameAlt)
    lib.xkbcommon._free(mod2)
    lib.xkbcommon._free(mod3)
    lib.xkbcommon._free(logo)
    lib.xkbcommon._free(mod5)
    lib.xkbcommon._free(num)
    lib.xkbcommon._free(caps)
    lib.xkbcommon._free(scroll)
    lib.xkbcommon._free(keymapStringPtr)
  }

  get modsDepressed(): number {
    return lib.xkbcommon._xkb_state_serialize_mods(this.state, XKB_STATE_MODS_DEPRESSED)
  }

  get modsLatched(): number {
    return lib.xkbcommon._xkb_state_serialize_mods(this.state, XKB_STATE_MODS_LATCHED)
  }

  get modsLocked(): number {
    return lib.xkbcommon._xkb_state_serialize_mods(this.state, XKB_STATE_MODS_LOCKED)
  }

  get group(): number {
    return lib.xkbcommon._xkb_state_serialize_layout(this.state, XKB_STATE_LAYOUT_EFFECTIVE)
  }

  asString(): string {
    return this.keymapString
  }

  updateMask(
    depressedMods: number,
    latchedMods: number,
    lockedMods: number,
    depressedLayout: number,
    latchedLayout: number,
    lockedLayout: number,
  ): number {
    return lib.xkbcommon._xkb_state_update_mask(
      this.state,
      depressedMods,
      latchedMods,
      lockedMods,
      depressedLayout,
      latchedLayout,
      lockedLayout,
    )
    return 0
  }

  keyUp(linuxKeyCode: EvDevKeyCode): boolean {
    return lib.xkbcommon._xkb_state_update_key(this.state, linuxKeyCode, XKB_KEY_UP) !== 0
  }

  keyDown(linuxKeyCode: EvDevKeyCode): boolean {
    return lib.xkbcommon._xkb_state_update_key(this.state, linuxKeyCode, XKB_KEY_DOWN) !== 0
  }

  numLedActive(): boolean {
    return lib.xkbcommon._xkb_state_led_index_is_active(this.state, this.numLed) !== 0
  }

  capsLedActive(): boolean {
    return lib.xkbcommon._xkb_state_led_index_is_active(this.state, this.capsLed) !== 0
  }

  scrollLockLedActive(): boolean {
    return lib.xkbcommon._xkb_state_led_index_is_active(this.state, this.scrollLed) !== 0
  }

  destroy(): void {
    lib.xkbcommon._free(this.state)
    // TODO cleanup state & keymaps
  }
}

// convert browser neutral key codes (which are strings) to linux (evdev) keycode
export enum EvDevKeyCode {
  Escape = 1,
  Digit1 = 2,
  Digit2 = 3,
  Digit3 = 4,
  Digit4 = 5,
  Digit5 = 6,
  Digit6 = 7,
  Digit7 = 8,
  Digit8 = 9,
  Digit9 = 10,
  Digit0 = 11,
  Minus = 12,
  Equal = 13,
  Backspace = 14,
  Tab = 15,
  KeyQ = 16,
  KeyW = 17,
  KeyE = 18,
  KeyR = 19,
  KeyT = 20,
  KeyY = 21,
  KeyU = 22,
  KeyI = 23,
  KeyO = 24,
  KeyP = 25,
  BracketLeft = 26,
  BracketRight = 27,
  Enter = 28,
  ControlLeft = 29,
  KeyA = 30,
  KeyS = 31,
  KeyD = 32,
  KeyF = 33,
  KeyG = 34,
  KeyH = 35,
  KeyJ = 36,
  KeyK = 37,
  KeyL = 38,
  Semicolon = 39,
  Quote = 40,
  Backquote = 41,
  ShiftLeft = 42,
  Backslash = 43,
  KeyZ = 44,
  KeyX = 45,
  KeyC = 46,
  KeyV = 47,
  KeyB = 48,
  KeyN = 49,
  KeyM = 50,
  Comma = 51,
  Period = 52,
  Slash = 53,
  ShiftRight = 54,
  NumpadMultiply = 55,
  AltLeft = 56,
  Space = 57,
  CapsLock = 58,
  F1 = 59,
  F2 = 60,
  F3 = 61,
  F4 = 62,
  F5 = 63,
  F6 = 64,
  F7 = 65,
  F8 = 66,
  F9 = 67,
  F10 = 68,
  NumLock = 69,
  ScrollLock = 70,
  Numpad7 = 71,
  Numpad8 = 72,
  Numpad9 = 73,
  NumpadSubtract = 74,
  Numpad4 = 75,
  Numpad5 = 76,
  Numpad6 = 77,
  NumpadAdd = 78,
  Numpad1 = 79,
  Numpad2 = 80,
  Numpad3 = 81,
  Numpad0 = 82,
  NumpadDecimal = 83,
  IntlBackslash = 86,
  F11 = 87,
  F12 = 88,
  IntlRo = 89,
  Convert = 92,
  KanaMode = 93,
  NonConvert = 94,
  NumpadEnter = 96,
  ControlRight = 97,
  NumpadDivide = 98,
  PrintScreen = 99,
  AltRight = 100,
  Home = 102,
  ArrowUp = 103,
  PageUp = 104,
  ArrowLeft = 105,
  ArrowRight = 106,
  End = 107,
  ArrowDown = 108,
  PageDown = 109,
  Insert = 110,
  Delete = 111,
  NumpadEqual = 117,
  Pause = 119,
  IntlYen = 124,
  OSLeft = 125,
  OSRight = 126,
  ContextMenu = 127,
}
