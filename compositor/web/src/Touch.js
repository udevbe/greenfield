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
export default class Touch {
  /**
   * @returns {Touch}
   */
  static create () {
    return new Touch()
  }

  constructor () {
    /**
     * @type {Array<WlTouchResource>}
     */
    this.resources = []
    /**
     * @type {Seat}
     */
    this.seat = null
  }

  /**
   *
   * @param {WlTouchResource} resource
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
