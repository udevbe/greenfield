'use strict'

/**
 *
 *            Clients can handle the 'done' event to get notified when
 *            the related request is done.
 *
 */
export default class Callback {
  /**
   * @param {!WlCallbackResource}wlCallbackResource
   * @return {!Callback}
   */
  static create (wlCallbackResource) {
    return new Callback(wlCallbackResource)
  }

  /**
   * @param {!WlCallbackResource}grCallbackResource
   * @private
   */
  constructor (grCallbackResource) {
    /**
     * @type {?WlCallbackResource}
     */
    this.resource = grCallbackResource
  }

  /**
   *
   *                Notify the client when the related request is done.
   *
   *
   * @param {!number} data request-specific data for the callback
   *
   * @since 1
   *
   */
  done (data) {
    if (this.resource) {
      this.resource.done(data)
      this.resource.destroy()
      this.resource = null
    }
  }
}
