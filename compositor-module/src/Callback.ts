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

export default class Callback {
  static create(wlCallbackResource: WlCallbackResource): Callback {
    const callback = new Callback(wlCallbackResource)
    wlCallbackResource.addDestroyListener(() => {
      callback.resource = undefined
    })
    return callback
  }

  private constructor(public resource: WlCallbackResource | undefined) {}

  done(data: number): void {
    this.resource?.done(data)
    this.resource?.destroy()
    this.resource = undefined
  }
}
