'use strict'

export default class BrowserTouch {
  /**
   * @returns {BrowserTouch}
   */
  static create () {
    return new BrowserTouch()
  }

  constructor () {
    this.resources = []
  }

  /**
   *
   * @param {GrTouch} resource
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
