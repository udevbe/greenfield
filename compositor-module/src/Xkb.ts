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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lib } from './lib'

const XKB_KEYMAP_FORMAT_TEXT_V1 = 1
const XKB_CONTEXT_NO_DEFAULT_INCLUDES = 1 << 0
const XKB_CONTEXT_NO_ENVIRONMENT_NAMES = 1 << 1
const XKB_KEYMAP_COMPILE_NO_FLAGS = 0
const XKB_KEY_UP = 0
const XKB_KEY_DOWN = 1
const XKB_STATE_MODS_DEPRESSED = 1 << 0
const XKB_STATE_MODS_LATCHED = 1 << 1
const XKB_STATE_MODS_LOCKED = 1 << 2
const XKB_STATE_LAYOUT_EFFECTIVE = 1 << 7

export type nrmlvo = {
  name: string
  rules: string
  model: string
  layout: string
  variant?: string
  options?: string
}

export function buildNrmlvoEntries(): nrmlvo[] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

// TODO create typedefinitions for libxkb

/**
 * @param keymapLayout an xkb keymap as a single string.
 */
export function createFromString(keymapLayout: string): Xkb {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const keymapLayoutPtr = lib.xkbcommon._malloc(lib.xkbcommon.lengthBytesUTF8(keymapLayout) + 1)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  lib.xkbcommon.stringToUTF8(keymapLayout, keymapLayoutPtr, lib.xkbcommon.lengthBytesUTF8(keymapLayout) + 1)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const xkbContext = lib.xkbcommon._xkb_context_new(XKB_CONTEXT_NO_DEFAULT_INCLUDES | XKB_CONTEXT_NO_ENVIRONMENT_NAMES)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const keymap = lib.xkbcommon._xkb_keymap_new_from_string(
    xkbContext,
    keymapLayoutPtr,
    XKB_KEYMAP_FORMAT_TEXT_V1,
    XKB_KEYMAP_COMPILE_NO_FLAGS,
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const state = lib.xkbcommon._xkb_state_new(keymap)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  lib.xkbcommon._free(keymapLayoutPtr)

  return new Xkb(xkbContext, keymap, state)
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const xkbRuleNamesPtr = lib.xkbcommon._malloc(5 * 4)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const xkbRuleNamesBuffer = new Uint32Array(lib.xkbcommon.HEAP8.buffer, xkbRuleNamesPtr, 5)

  xkbRuleNamesBuffer[0] = stringToPointer(rules)
  xkbRuleNamesBuffer[1] = stringToPointer(model)
  xkbRuleNamesBuffer[2] = stringToPointer(layout)
  xkbRuleNamesBuffer[3] = stringToPointer(variant)
  xkbRuleNamesBuffer[4] = stringToPointer(options)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const xkbContext = lib.xkbcommon._xkb_context_new(0)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const keymap = lib.xkbcommon._xkb_keymap_new_from_names(xkbContext, xkbRuleNamesPtr, XKB_KEYMAP_COMPILE_NO_FLAGS)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const state = lib.xkbcommon._xkb_state_new(keymap)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  xkbRuleNamesBuffer.forEach((pointer) => lib.xkbcommon._free(pointer))
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  lib.xkbcommon._free(xkbRuleNamesPtr)

  return new Xkb(xkbContext, keymap, state)
}

function stringToPointer(value?: string): number {
  if (value) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const stringPtr = lib.xkbcommon._malloc(lib.xkbcommon.lengthBytesUTF8(value) + 1)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    lib.xkbcommon.stringToUTF8(value, stringPtr, lib.xkbcommon.lengthBytesUTF8(value) + 1)
    return stringPtr
  } else {
    return 0
  }
}

export class Xkb {
  readonly xkbContext: number
  readonly keymap: number
  readonly state: number
  private _stateComponentMask = 0

  constructor(xkbContext: number, keymap: number, state: number) {
    this.xkbContext = xkbContext
    this.keymap = keymap
    this.state = state
    this._stateComponentMask = 0
  }

  asString() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const keymapStringPtr = lib.xkbcommon._xkb_keymap_get_as_string(this.keymap, XKB_KEYMAP_FORMAT_TEXT_V1)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return lib.xkbcommon.UTF8ToString(keymapStringPtr)
  }

  keyUp(linuxKeyCode: LinuxKeyCode): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return lib.xkbcommon._xkb_state_update_key(this.state, linuxKeyCode, XKB_KEY_UP) !== 0
  }

  keyDown(linuxKeyCode: LinuxKeyCode): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return lib.xkbcommon._xkb_state_update_key(this.state, linuxKeyCode, XKB_KEY_DOWN) !== 0
  }

  get modsDepressed(): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return lib.xkbcommon._xkb_state_serialize_mods(this.state, XKB_STATE_MODS_DEPRESSED)
  }

  get modsLatched(): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return lib.xkbcommon._xkb_state_serialize_mods(this.state, XKB_STATE_MODS_LATCHED)
  }

  get modsLocked(): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return lib.xkbcommon._xkb_state_serialize_mods(this.state, XKB_STATE_MODS_LOCKED)
  }

  get group(): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return lib.xkbcommon._xkb_state_serialize_layout(this.state, XKB_STATE_LAYOUT_EFFECTIVE)
  }
}

// convert browser neutral key codes (which are strings) to linux (x11) keycode
export enum LinuxKeyCode {
  Escape = 0x0009,
  Digit1 = 0x000a,
  Digit2 = 0x000b,
  Digit3 = 0x000c,
  Digit4 = 0x000d,
  Digit5 = 0x000e,
  Digit6 = 0x000f,
  Digit7 = 0x0010,
  Digit8 = 0x0011,
  Digit9 = 0x0012,
  Digit0 = 0x0013,
  Minus = 0x0014,
  Equal = 0x0015,
  Backspace = 0x0016,
  Tab = 0x0017,
  KeyQ = 0x0018,
  KeyW = 0x0019,
  KeyE = 0x001a,
  KeyR = 0x001b,
  KeyT = 0x001c,
  KeyY = 0x001d,
  KeyU = 0x001e,
  KeyI = 0x001f,
  KeyO = 0x0020,
  KeyP = 0x0021,
  BracketLeft = 0x0022,
  BracketRight = 0x0023,
  Enter = 0x0024,
  ControlLeft = 0x0025,
  KeyA = 0x0026,
  KeyS = 0x0027,
  KeyD = 0x0028,
  KeyF = 0x0029,
  KeyG = 0x002a,
  KeyH = 0x002b,
  KeyJ = 0x002c,
  KeyK = 0x002d,
  KeyL = 0x002e,
  Semicolon = 0x002f,
  Quote = 0x0030,
  Backquote = 0x0031,
  ShiftLeft = 0x0032,
  Backslash = 0x0033,
  KeyZ = 0x0034,
  KeyX = 0x0035,
  KeyC = 0x0036,
  KeyV = 0x0037,
  KeyB = 0x0038,
  KeyN = 0x0039,
  KeyM = 0x003a,
  Comma = 0x003b,
  Period = 0x003c,
  Slash = 0x003d,
  ShiftRight = 0x003e,
  NumpadMultiply = 0x003f,
  AltLeft = 0x0040,
  Space = 0x0041,
  CapsLock = 0x0042,
  F1 = 0x0043,
  F2 = 0x0044,
  F3 = 0x0045,
  F4 = 0x0046,
  F5 = 0x0047,
  F6 = 0x0048,
  F7 = 0x0049,
  F8 = 0x004a,
  F9 = 0x004b,
  F10 = 0x004c,
  NumLock = 0x004d,
  ScrollLock = 0x004e,
  Numpad7 = 0x004f,
  Numpad8 = 0x0050,
  Numpad9 = 0x0051,
  NumpadSubtract = 0x0052,
  Numpad4 = 0x0053,
  Numpad5 = 0x0054,
  Numpad6 = 0x0055,
  NumpadAdd = 0x0056,
  Numpad1 = 0x0057,
  Numpad2 = 0x0058,
  Numpad3 = 0x0059,
  Numpad0 = 0x005a,
  NumpadDecimal = 0x005b,
  IntlBackslash = 0x005e,
  F11 = 0x005f,
  F12 = 0x0060,
  IntlRo = 0x0061,
  Convert = 0x0064,
  KanaMode = 0x0065,
  NonConvert = 0x0066,
  NumpadEnter = 0x0068,
  ControlRight = 0x0069,
  NumpadDivide = 0x006a,
  PrintScreen = 0x006b,
  AltRight = 0x006c,
  Home = 0x006e,
  ArrowUp = 0x006f,
  PageUp = 0x0070,
  ArrowLeft = 0x0071,
  ArrowRight = 0x0072,
  End = 0x0073,
  ArrowDown = 0x0074,
  PageDown = 0x0075,
  Insert = 0x0076,
  Delete = 0x0077,
  NumpadEqual = 0x007d,
  Pause = 0x007f,
  IntlYen = 0x0084,
  OSLeft = 0x0085,
  OSRight = 0x0086,
  ContextMenu = 0x0087,
}
