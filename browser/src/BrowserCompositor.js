import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserSurface from './BrowserSurface'
import BrowserRegion from './BrowserRegion'
import BrowserScene from './BrowserScene'
import BrowserRenderer from './BrowserRenderer'

export default class BrowserCompositor extends westfield.Global {
  /**
   *
   * @param {Server} server
   * @returns {BrowserCompositor}
   */
  static create (server) {
    const browserScene = BrowserScene.create()
    const browserRenderer = BrowserRenderer.create()

    const browserCompositor = new BrowserCompositor(browserScene, browserRenderer)
    server.registry.register(browserCompositor)
    return browserCompositor
  }

  /**
   * Use BrowserCompositor.create(server) instead.
   * @private
   */
  constructor (browserScene, browserRenderer) {
    // FIXME Don't harcode the interface name, instead get it from an imported namespace
    super('GrCompositor', 4)
    this.browserScene = browserScene
    this.browserRenderer = browserRenderer
  }

  bindClient (client, id, version) {
    let grCompositorResource
    switch (version) {
      case 1:
        grCompositorResource = new greenfield.GrCompositor(client, id, 1)
        break
      case 2:
        grCompositorResource = new greenfield.GrCompositorV2(client, id, 2)
        break
      case 3:
        grCompositorResource = new greenfield.GrCompositorV3(client, id, 3)
        break
      default:
        grCompositorResource = new greenfield.GrCompositorV4(client, id, 4)
    }
    grCompositorResource.implementation = this
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
    let grSurfaceResource
    switch (resource.version) {
      case 1:
        grSurfaceResource = new greenfield.GrSurface(resource.client, id, 1)
        break
      case 2:
        grSurfaceResource = new greenfield.GrSurfaceV2(resource.client, id, 2)
        break
      case 3:
        grSurfaceResource = new greenfield.GrSurfaceV3(resource.client, id, 3)
        break
      default:
        grSurfaceResource = new greenfield.GrSurfaceV4(resource.client, id, 4)
    }
    BrowserSurface.create(grSurfaceResource, this)
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
    const grRegionResource = new greenfield.GrRegion(resource.client, id, 1)
    BrowserRegion.create(grRegionResource)
  }

  render () {
    const browserSurfaceViewStack = this.browserScene.createBrowserSurfaceViewStack()
    this.browserRrenderer.render(browserSurfaceViewStack)
  }
}
