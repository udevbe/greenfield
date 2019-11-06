// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

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
