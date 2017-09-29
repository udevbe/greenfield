'use strict'

export default class BrowserTouch {
  static create (grTouchResource) {
    const browserTouch = new BrowserTouch(grTouchResource)
    grTouchResource.implementation = browserTouch
    return browserTouch
  }

  constructor (grTouchResource) {
    this.resource = grTouchResource
  }

  /**
   *
   * @param {GrTouch} resource
   *
   * @since 3
   *
   */
  release (resource) {}
}
