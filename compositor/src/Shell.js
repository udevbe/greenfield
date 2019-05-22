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

'use strict'

import WlShellRequests from './protocol/WlShellRequests'
import WlShellResource from './protocol/WlShellResource'
import WlShellSurfaceResource from './protocol/WlShellSurfaceResource'

import ShellSurface from './ShellSurface'

/**
 *
 *            This interface is implemented by servers that provide
 *            desktop-style user interfaces.
 *
 *            It allows clients to associate a wl_shell_surface with
 *            a basic surface.
 * @implements {WlShellRequests}
 */
export default class Shell extends WlShellRequests {
  /**
   * @param {Session} session
   * @return {Shell}
   */
  static create (session) {
    return new Shell(session)
  }

  /**
   * Use Shell.create(..)
   * @param {Session} session
   * @private
   */
  constructor (session) {
    super()
    /**
     * @type {Session}
     */
    this.session = session
    /**
     * @type {Global}
     * @private
     */
    this._global = null
  }

  /**
   *
   * Invoked when a client binds to this global.
   *
   * @param {!Client} client
   * @param {!number} id
   * @param {!number} version
   */
  bindClient (client, id, version) {
    const wlShellResource = new WlShellResource(client, id, version)
    wlShellResource.implementation = this
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlShellResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal () {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = null
  }

  /**
   *
   *                Create a shell surface for an existing surface. This gives
   *                the wl_surface the role of a shell surface. If the wl_surface
   *                already has another role, it raises a protocol error.
   *
   *                Only one shell surface can be associated with a given surface.
   *
   *
   * @param {WlShellResource} resource
   * @param {number} id shell surface to create
   * @param {WlSurfaceResource} surface surface to be given the shell surface role
   *
   * @since 1
   * @override
   */
  getShellSurface (resource, id, surface) {
    if (surface.implementation.role) {
      resource.postError(WlShellResource.Error.role, 'Given surface has another role.')
      DEBUG && console.log('[client-protocol-error] - Given surface has another role.')
      return
    }

    const wlShellSurfaceResource = new WlShellSurfaceResource(resource.client, id, resource.version)
    ShellSurface.create(wlShellSurfaceResource, surface, this.session)
  }
}
