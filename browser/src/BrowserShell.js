'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'

import BrowserShellSurface from './BrowserShellSurface'

export default class BrowserShell extends westfield.Global {
  static create () {
    return new BrowserShell()
  }

  constructor () {
    super(greenfield.GrShell.name, 1)
  }

  bindClient (client, id, version) {
    const grShellResource = new greenfield.GrShell(client, id, version)
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
    const grShellSurfaceResource = new greenfield.GrShellSurface(resource.client, id, resource.version)
    BrowserShellSurface.create(grShellSurfaceResource, surface)
  }
}
