'use strict'

import xkbModule from './lib/libxkbcommon'

const xkb = xkbModule()

export default class BrowserXkb {
  /**
   * Qwerty mapping.
   * @return {Promise<BrowserXkb>}
   */
  static createDefault () {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest()

      xhr.onreadystatechange = () => {
        const mappingFile = xhr.responseText
        try {
          const browserXkb = BrowserXkb.create(mappingFile)
          resolve(browserXkb)
        } catch (error) {
          reject(error)
        }
      }

      xhr.open('GET', 'qwertyfull.xkb')
      xhr.send()
    })
  }

  /**
   * @param {string}keymapLayout
   * @return {BrowserXkb}
   */
  static create (keymapLayout) {
    const keymapLayoutPtr = xkb.allocate(xkb.intArrayFromString(keymapLayout), 'i8', xkb.ALLOC_NORMAL)
    const xkbContext = xkb._xkb_context_new(0)
    const XKB_KEYMAP_FORMAT_TEXT_V1 = 0
    const XKB_CONTEXT_NO_FLAGS = 0

    const keymap = xkb._xkb_keymap_new_from_string(xkbContext, keymapLayoutPtr, XKB_KEYMAP_FORMAT_TEXT_V1, XKB_CONTEXT_NO_FLAGS)
    const state = xkb._xkb_state_new(keymap)

    return new BrowserXkb(xkbContext, keymap, state)
  }

  /**
   * Use BrowserXkb.create(..)
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
}
