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

import Surface from './Surface'
import { Client, WlCallbackResource } from 'westfield-runtime-server'

let refreshInterval = 16.667
let previousPresentationTimestamp = 0

function updateRefreshInterval() {
  requestAnimationFrame((presentationTimestamp) => {
    const newRefreshInterval = presentationTimestamp - previousPresentationTimestamp
    if (newRefreshInterval !== presentationTimestamp) {
      refreshInterval = newRefreshInterval
    }
    previousPresentationTimestamp = presentationTimestamp
    updateRefreshInterval()
  })
}

updateRefreshInterval()

export interface Callback {
  done(time: number): void
}

export function createProxyCallback(surface: Surface): Callback {
  return new ProxyCallback(surface)
}

export function createDefaultCallback(client: Client, resourceId: number, version: number): Callback {
  const wlCallbackResource = new WlCallbackResource(client, resourceId, version)
  const callback = new DefaultCallback(wlCallbackResource)
  wlCallbackResource.addDestroyListener(() => {
    callback.resource = undefined
  })
  return callback
}

class ProxyCallback implements Callback {
  commitSerial?: number

  constructor(public surface: Surface) {}

  done(time: number): void {
    // ignore call, done by proxy
  }
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
