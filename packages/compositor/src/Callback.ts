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

import { Client, WlCallbackResource } from '@gfld/compositor-protocol'

export interface Callback {
  done(time: number): void
}

export function createCallback(client: Client, resourceId: number, version: number): Callback {
  const wlCallbackResource = new WlCallbackResource(client, resourceId, version)
  const callback = new DefaultCallback(wlCallbackResource)
  wlCallbackResource.addDestroyListener(() => {
    callback.resource = undefined
  })
  return callback
}

class DefaultCallback {
  constructor(public resource: WlCallbackResource | undefined) {}

  done(data: number): void {
    if (this.resource) {
      this.resource.done(data)
      this.resource.destroy()
      this.resource = undefined
    }
  }
}
