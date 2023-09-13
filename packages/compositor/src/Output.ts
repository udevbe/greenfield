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

import {
  Client,
  Global,
  Registry,
  WlOutputRequests,
  WlOutputResource,
  WlOutputMode,
  WlOutputSubpixel,
  WlOutputTransform,
} from 'westfield-runtime-server'

import { capabilities } from './browser/capabilities'

export default class Output implements WlOutputRequests {
  private _global?: Global
  resources: WlOutputResource[] = []

  static create(canvas: HTMLCanvasElement): Output {
    return new Output(canvas)
  }

  private constructor(public readonly canvas: HTMLCanvasElement, private _x = 0, private _y = 0) {}

  get x(): number {
    return this._x
  }

  get y(): number {
    return this._y
  }

  registerGlobal(registry: Registry): void {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlOutputResource.protocolName, 3, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal(): void {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = undefined
  }

  bindClient(client: Client, id: number, version: number): void {
    const wlOutputResource = new WlOutputResource(client, id, version)
    if (this._global) {
      this.resources = [...this.resources, wlOutputResource]
      wlOutputResource.implementation = this
      this.emitSpecs(wlOutputResource)
    } else {
      // no global present and still receiving a bind can happen when there is a race between the compositor
      // unregistering the global and a client binding to it. As such we handle it here.
      wlOutputResource.implementation = {
        release: () => wlOutputResource.destroy(),
      }
    }
  }

  update(location?: { x: number; y: number }): void {
    if (location) {
      this._x = location.x
      this._y = location.y
    }

    this.resources.forEach((resource) => this.emitSpecs(resource))
  }

  emitSpecs(wlOutputResource: WlOutputResource): void {
    if (!this._global) {
      return
    }
    // TODO we might want to listen for window/document size changes and emit on update
    this.emitGeometry(wlOutputResource)
    this.emitMode(wlOutputResource)
    // TODO scaling info using window.devicePixelRatio
    // TODO expose pixel scaling in config menu
    if (wlOutputResource.version >= 2) {
      wlOutputResource.done()
    }
  }

  private emitMode(wlOutputResource: WlOutputResource) {
    const flags = WlOutputMode.current
    // the refresh rate is impossible to query without manual measuring, which is error prone.
    const refresh = 60
    wlOutputResource.mode(flags, this.canvas.width, this.canvas.height, refresh)
  }

  private emitGeometry(wlOutputResource: WlOutputResource) {
    // this is really just an approximation as browsers don't offer a way to get the physical width :(
    // A css pixel is roughly 1/96 of an inch, so ~0.2646 mm
    // TODO test this on high dpi devices
    const physicalWidth = Math.ceil(this.canvas.width * 0.2646)
    const physicalHeight = Math.ceil(this.canvas.height * 0.2646)
    const subpixel = WlOutputSubpixel.unknown
    const make = 'Greenfield'
    const model = capabilities.userAgent

    const orientation = capabilities.orientationType
    let transform = WlOutputTransform.normal

    // FIXME this requires some experimentation to get it right
    switch (orientation) {
      case 'portrait-primary': {
        transform = WlOutputTransform.normal
        break
      }
      case 'portrait-secondary': {
        transform = WlOutputTransform._180
        break
      }
      case 'landscape-primary': {
        transform = WlOutputTransform.normal
        break
      }
      case 'landscape-secondary': {
        transform = WlOutputTransform._180
        break
      }
    }

    wlOutputResource.geometry(this._x, this._y, physicalWidth, physicalHeight, subpixel, make, model, transform)
  }

  release(resource: WlOutputResource): void {
    resource.destroy()
    this.resources = this.resources.filter((otherResource) => otherResource !== resource)
  }
}
