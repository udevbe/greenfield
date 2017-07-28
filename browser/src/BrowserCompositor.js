import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserSurface from './BrowserSurface'
import BrowserRegion from './BrowserRegion'

export default class BrowserCompositor extends westfield.Global {
  /**
   *
   * @param {Server} server
   * @returns {BrowserCompositor}
   */
  static create (server) {
    const browserCompositor = new BrowserCompositor()
    server.registry.register(browserCompositor)
    return browserCompositor
  }

  /**
   * Use BrowserCompositor.create(server) instead.
   * @private
   */
  constructor () {
    // FIXME Don't harcode the interface name, instead get it from an imported namespace
    super('GrCompositor', 4)
  }

  bindClient (client, id, version) {
    let grCompositor
    switch (version) {
      case 1:
        grCompositor = new greenfield.GrCompositor(client, id, 1)
        break
      case 2:
        grCompositor = new greenfield.GrCompositorV2(client, id, 2)
        break
      case 3:
        grCompositor = new greenfield.GrCompositorV3(client, id, 3)
        break
      default:
        grCompositor = new greenfield.GrCompositorV4(client, id, 4)
    }
    grCompositor.implementation = this
  }

  onClientConnection (clientConnection) {}

  /**
   *
   * Ask the compositor to create a new surface.
   *
   *
   * @param {GrCompositor} resource
   * @param {*} id undefined
   *
   * @since 1
   *
   */
  createSurface (resource, id) {
    let grSurface
    switch (resource.version) {
      case 1:
        grSurface = new greenfield.GrSurface(resource.client, id, 1)
        break
      case 2:
        grSurface = new greenfield.GrSurfaceV2(resource.client, id, 2)
        break
      case 3:
        grSurface = new greenfield.GrSurfaceV3(resource.client, id, 3)
        break
      default:
        grSurface = new greenfield.GrSurfaceV4(resource.client, id, 4)
    }
    BrowserSurface.create(grSurface)
  }

  /**
   *
   * Ask the compositor to create a new region.
   *
   *
   * @param {GrCompositor} resource
   * @param {*} id undefined
   *
   * @since 1
   *
   */
  createRegion (resource, id) {
    const grRegion = new greenfield.GrRegion(resource.client, id, 1)
    BrowserRegion.create(grRegion)
  }
}
