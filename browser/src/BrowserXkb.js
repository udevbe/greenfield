'use strict'

import xkbModule from './lib/libxkbcommon'

const xkb = xkbModule()

const XKB_KEYMAP_FORMAT_TEXT_V1 = 1
const XKB_CONTEXT_NO_DEFAULT_INCLUDES = 1 << 0
const XKB_CONTEXT_NO_ENVIRONMENT_NAMES = 1 << 1
const XKB_KEYMAP_COMPILE_NO_FLAGS = 0

export default class BrowserXkb {
  /**
   * @param {string}resource file name of the remote resource. Resource should be an xkb keymap.
   * @return {Promise<BrowserXkb>}
   */
  static createFromResource (resource) {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === window.XMLHttpRequest.DONE && xhr.status === 200) {
          const mappingFile = xhr.responseText
          try {
            const browserXkb = BrowserXkb.create(mappingFile)
            resolve(browserXkb)
          } catch (error) {
            reject(error)
          }
        } // TODO reject if we have something else than 2xx
      }

      xhr.open('GET', '/' + resource)
      xhr.send()
    })
  }

  /**
   * @param {string}keymapLayout an xkb keymap as a single string.
   * @return {BrowserXkb}
   */
  static create (keymapLayout) {
    const keymapLayoutPtr = xkb._malloc(xkb.lengthBytesUTF8(keymapLayout) + 1)
    xkb.stringToUTF8(keymapLayout, keymapLayoutPtr, xkb.lengthBytesUTF8(keymapLayout) + 1)

    const xkbContext = xkb._xkb_context_new(XKB_CONTEXT_NO_DEFAULT_INCLUDES | XKB_CONTEXT_NO_ENVIRONMENT_NAMES)
    const keymap = xkb._xkb_keymap_new_from_string(xkbContext, keymapLayoutPtr, XKB_KEYMAP_FORMAT_TEXT_V1, XKB_KEYMAP_COMPILE_NO_FLAGS)
    const state = xkb._xkb_state_new(keymap)

    xkb._free(keymapLayoutPtr)

    return new BrowserXkb(xkbContext, keymap, state)
  }

  /**
   * Use BrowserXkb.create(..) or BrowserXkb.createFromResource(..)
   * @private
   * @param {number}xkbContext
   * @param {number}keymap
   * @param {number}state
   */
  constructor (xkbContext, keymap, state) {
    this.xkbContext = xkbContext
    this.keymap = keymap
    this.state = state
  }

  asString () {
    const keymapStringPtr = xkb._xkb_keymap_get_as_string(this.keymap, XKB_KEYMAP_FORMAT_TEXT_V1)
    return xkb.Pointer_stringify(keymapStringPtr)
  }
}
// convert browser neutral key codes (which are strings *sigh*) to linux (x11) keycode
BrowserXkb.linuxKeycode = {
  'Escape': 0x0009,
  'Digit1': 0x000A,
  'Digit2': 0x000B,
  'Digit3': 0x000C,
  'Digit4': 0x000D,
  'Digit5': 0x000E,
  'Digit6': 0x000F,
  'Digit7': 0x0010,
  'Digit8': 0x0011,
  'Digit9': 0x0012,
  'Digit0': 0x0013,
  'Minus': 0x0014,
  'Equal': 0x0015,
  'Backspace': 0x0016,
  'Tab': 0x0017,
  'KeyQ': 0x0018,
  'KeyW': 0x0019,
  'KeyE': 0x001A,
  'KeyR': 0x001B,
  'KeyT': 0x001C,
  'KeyY': 0x001D,
  'KeyU': 0x001E,
  'KeyI': 0x001F,
  'KeyO': 0x0020,
  'KeyP': 0x0021,
  'BracketLeft': 0x0022,
  'BracketRight': 0x0023,
  'Enter': 0x0024,
  'ControlLeft': 0x0025,
  'KeyA': 0x0026,
  'KeyS': 0x0027,
  'KeyD': 0x0028,
  'KeyF': 0x0029,
  'KeyG': 0x002A,
  'KeyH': 0x002B,
  'KeyJ': 0x002C,
  'KeyK': 0x002D,
  'KeyL': 0x002E,
  'Semicolon': 0x002F,
  'Quote': 0x0030,
  'Backquote': 0x0031,
  'ShiftLeft': 0x0032,
  'Backslash': 0x0033,
  'KeyZ': 0x0034,
  'KeyX': 0x0035,
  'KeyC': 0x0036,
  'KeyV': 0x0037,
  'KeyB': 0x0038,
  'KeyN': 0x0039,
  'KeyM': 0x003A,
  'Comma': 0x003B,
  'Period': 0x003C,
  'Slash': 0x003D,
  'ShiftRight': 0x003E,
  'NumpadMultiply': 0x003F,
  'AltLeft': 0x0040,
  'Space': 0x0041,
  'CapsLock': 0x0042,
  'F1': 0x0043,
  'F2': 0x0044,
  'F3': 0x0045,
  'F4': 0x0046,
  'F5': 0x0047,
  'F6': 0x0048,
  'F7': 0x0049,
  'F8': 0x004A,
  'F9': 0x004B,
  'F10': 0x004C,
  'NumLock': 0x004D,
  'ScrollLock': 0x004E,
  'Numpad7': 0x004F,
  'Numpad8': 0x0050,
  'Numpad9': 0x0051,
  'NumpadSubtract': 0x0052,
  'Numpad4': 0x0053,
  'Numpad5': 0x0054,
  'Numpad6': 0x0055,
  'NumpadAdd': 0x0056,
  'Numpad1': 0x0057,
  'Numpad2': 0x0058,
  'Numpad3': 0x0059,
  'Numpad0': 0x005A,
  'NumpadDecimal': 0x005B,
  'IntlBackslash': 0x005E,
  'F11': 0x005F,
  'F12': 0x0060,
  'IntlRo': 0x0061,
  'Convert': 0x0064,
  'KanaMode': 0x0065,
  'NonConvert': 0x0066,
  'NumpadEnter': 0x0068,
  'ControlRight': 0x0069,
  'NumpadDivide': 0x006A,
  'PrintScreen': 0x006B,
  'AltRight': 0x006C,
  'Home': 0x006E,
  'ArrowUp': 0x006F,
  'PageUp': 0x0070,
  'ArrowLeft': 0x0071,
  'ArrowRight': 0x0072,
  'End': 0x0073,
  'ArrowDown': 0x0074,
  'PageDown': 0x0075,
  'Insert': 0x0076,
  'Delete': 0x0077,
  'NumpadEqual': 0x007D,
  'Pause': 0x007F,
  'IntlYen': 0x0084,
  'OSLeft': 0x0085,
  'OSRight': 0x0086,
  'ContextMenu': 0x0087
}
