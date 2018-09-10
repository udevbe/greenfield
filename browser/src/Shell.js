'use strict'

import GrShellRequests from './protocol/GrShellRequests'
import GrShellResource from './protocol/GrShellResource'
import GrShellSurfaceResource from './protocol/GrShellSurfaceResource'

import ShellSurface from './ShellSurface'

/**
 *
 *            This interface is implemented by servers that provide
 *            desktop-style user interfaces.
 *
 *            It allows clients to associate a gr_shell_surface with
 *            a basic surface.
 * @implements {GrShellRequests}
 */
export default class Shell extends GrShellRequests {
  /**
   * @param {Session} session
   * @param {UserShell}userShell
   * @return {Shell}
   */
  static create (session, userShell) {
    return new Shell(session, userShell)
  }

  /**
   * Use Shell.create(..)
   * @param {Session} session
   * @param {UserShell}userShell
   * @private
   */
  constructor (session, userShell) {
    super()
    /**
     * @type {Session}
     */
    this.session = session
    /**
     * @type {UserShell}
     */
    this.userShell = userShell
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
    const grShellResource = new GrShellResource(client, id, version)
    grShellResource.implementation = this
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, GrShellResource.name, 1, (client, id, version) => {
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
   *                the gr_surface the role of a shell surface. If the gr_surface
   *                already has another role, it raises a protocol error.
   *
   *                Only one shell surface can be associated with a given surface.
   *
   *
   * @param {GrShellResource} resource
   * @param {number} id shell surface to create
   * @param {GrSurfaceResource} surface surface to be given the shell surface role
   *
   * @since 1
   * @override
   */
  getShellSurface (resource, id, surface) {
    if (surface.implementation.role) {
      resource.postError(GrShellResource.Error.role, 'Given surface has another role.')
      DEBUG && console.log('Protocol error. Given surface has another role.')
      return
    }

    const grShellSurfaceResource = new GrShellSurfaceResource(resource.client, id, resource.version)
    ShellSurface.create(grShellSurfaceResource, surface, this.session, this.userShell)
  }
}
