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
  WlShellRequests,
  WlShellResource,
  WlShellError,
  WlShellSurfaceResource,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import Session from './Session'

import ShellSurface from './ShellSurface'
import Surface from './Surface'

export default class Shell implements WlShellRequests {
  private global?: Global

  static create(session: Session): Shell {
    return new Shell(session)
  }

  private constructor(public readonly session: Session) {}

  bindClient(client: Client, id: number, version: number): void {
    const wlShellResource = new WlShellResource(client, id, version)
    wlShellResource.implementation = this
  }

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, WlShellResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal(): void {
    if (!this.global) {
      return
    }
    this.global.destroy()
    this.global = undefined
  }

  getShellSurface(resource: WlShellResource, id: number, surfaceResource: WlSurfaceResource): void {
    if ((surfaceResource.implementation as Surface).role) {
      resource.postError(WlShellError.role, 'Given surface has another role.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }

    const wlShellSurfaceResource = new WlShellSurfaceResource(resource.client, id, resource.version)
    ShellSurface.create(wlShellSurfaceResource, surfaceResource, this.session)
  }
}
