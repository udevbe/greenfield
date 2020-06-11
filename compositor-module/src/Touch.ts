// Copyright 2020 Erik De Rijcke
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

import { WlTouchResource } from 'westfield-runtime-server'
import Seat from './Seat'

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
  private resources: WlTouchResource[] = []
  // @ts-ignore set in Seat creation
  private seat: Seat

  static create(): Touch {
    return new Touch()
  }

  private constructor() {
  }

  release(resource: WlTouchResource) {
    resource.destroy()
    this.resources = this.resources.filter(otherResource => otherResource !== resource)
  }
}
