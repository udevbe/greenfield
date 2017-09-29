'use strict'

export default class BrowserKeyboard {
  static create (grKeyboardResource) {
    const browserKeyboard = new BrowserKeyboard(grKeyboardResource)
    grKeyboardResource.implementation = browserKeyboard
    return browserKeyboard
  }

  constructor (grKeyboardResource) {
    this.resource = grKeyboardResource
  }

  /**
   *
   * @param {GrKeyboard} resource
   *
   * @since 3
   *
   */
  release (resource) {

  }
}
