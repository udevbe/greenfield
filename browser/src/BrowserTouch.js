'use strict'

/**
 *
 *            The gr_touch interface represents a touchscreen
 *            associated with a seat.
 *
 *            Touch interactions can consist of one or more contacts.
 *            For each contact, a series of events is generated, starting
 *            with a down event, followed by zero or more motion events,
 *            and ending with an up event. Events relating to the same
 *            contact point can be identified by the ID of the sequence.
 *
 */
export default class BrowserTouch {
  /**
   * @returns {BrowserTouch}
   */
  static create () {
    return new BrowserTouch()
  }

  constructor () {
    /**
     * @type {Array<GrTouch>}
     */
    this.resources = []
    /**
     * @type {BrowserSeat}
     */
    this.browserSeat = null
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
