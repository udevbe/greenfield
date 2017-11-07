'use strict'

export default class BrowserKeyboard {
  /**
   * @returns {BrowserKeyboard}
   */
  static create () {
    return new BrowserKeyboard()
  }

  constructor () {
    this.resources = []
  }

  /**
   *
   * @param {GrKeyboard} resource
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
}
