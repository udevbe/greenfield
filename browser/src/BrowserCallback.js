'use strict'

export default class BrowserCallback {
  static create (grCallbackResource) {
    return new BrowserCallback(grCallbackResource)
  }

  constructor (grCallbackResource) {
    this.resource = grCallbackResource
  }

  done (data) {
    this.resource.done(data)
    this.resource.destroy()
    this.resource = null
  }
}
