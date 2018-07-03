'use strict'

import { Global } from 'westfield-runtime-server'
import { GrShell, GrShellSurface } from './protocol/greenfield-browser-protocol'

import BrowserShellSurface from './BrowserShellSurface'

/**
 *
 *            This interface is implemented by servers that provide
 *            desktop-style user interfaces.
 *
 *            It allows clients to associate a gr_shell_surface with
 *            a basic surface.
 *
 */
export default class BrowserShell extends Global {
  /**
   * @param {BrowserSession} browserSession
   * @param {UserShell}userShell
   * @return {BrowserShell}
   */
  static create (browserSession, userShell) {
    return new BrowserShell(browserSession, userShell)
  }

  /**
   * Use BrowserShell.create(..)
   * @param {BrowserSession} browserSession
   * @param {UserShell}userShell
   * @private
   */
  constructor (browserSession, userShell) {
    super(GrShell.name, 1)
    /**
     * @type {BrowserSession}
     */
    this.browserSession = browserSession
    /**
     * @type {UserShell}
     */
    this.userShell = userShell
  }

  bindClient (client, id, version) {
    const grShellResource = new GrShell(client, id, version)
    grShellResource.implementation = this
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
   * @param {GrShell} resource
   * @param {*} id shell surface to create
   * @param {*} surface surface to be given the shell surface role
   *
   * @since 1
   *
   */
  getShellSurface (resource, id, surface) {
    if (surface.implementation.role) {
      // TODO protocol error
    }

    const grShellSurfaceResource = new GrShellSurface(resource.client, id, resource.version)
    BrowserShellSurface.create(grShellSurfaceResource, surface, this.browserSession, this.userShell)
  }
}
