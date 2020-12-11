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

import { WlCallbackResource } from 'westfield-runtime-server'

/**
 *
 *            Clients can handle the 'done' event to get notified when
 *            the related request is done.
 *
 */
export default class Callback {
  resource?: WlCallbackResource

  static create(wlCallbackResource: WlCallbackResource): Callback {
    const callback = new Callback(wlCallbackResource)
    wlCallbackResource.addDestroyListener(() => {
      callback.resource = undefined
    })
    return callback
  }

  private constructor(wlCallbackResource: WlCallbackResource) {
    this.resource = wlCallbackResource
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
  done(data: number) {
    this.resource?.done(data)
    this.resource?.destroy()
    this.resource = undefined
  }
}
