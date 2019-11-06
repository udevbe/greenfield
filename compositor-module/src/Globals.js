import Output from './Output'
import Renderer from './render/Renderer'
import Compositor from './Compositor'
import DataDeviceManager from './DataDeviceManager'
import Subcompositor from './Subcompositor'
import Shell from './Shell'
import XdgWmBase from './XdgWmBase'
import WebShm from './webshm/WebShm'
import WebGL from './webgl/WebGL'
import Seat from './Seat'

class Globals {
  static create (session) {
    const seat = Seat.create(session)

    const output = Output.create()
    const renderer = Renderer.create()
    const compositor = Compositor.create(session, renderer, seat)
    const dataDeviceManager = DataDeviceManager.create()
    const subcompositor = Subcompositor.create()

    const shell = Shell.create(session)
    const xdgWmBase = XdgWmBase.create(session, seat)

    const webShm = WebShm.create()
    const webGL = WebGL.create(session)

    return new Globals(session, seat, output, renderer, compositor, dataDeviceManager, subcompositor, shell, xdgWmBase, webShm, webGL)
  }

  constructor (session, seat, output, renderer, compositor, dataDeviceManager, subcompositor, shell, xdgWmBase, webShm, webGL) {
    this.session = session
    this.seat = seat
    this.output = output
    this.renderer = renderer
    this.compositor = compositor
    this.dataDeviceManager = dataDeviceManager
    this.subcompositor = subcompositor
    this.shell = shell
    this.xdgWmBase = xdgWmBase
    this.webShm = webShm
    this.webGL = webGL
  }

  register () {
    this.output.registerGlobal(this.session.display.registry)
    this.compositor.registerGlobal(this.session.display.registry)
    this.dataDeviceManager.registerGlobal(this.session.display.registry)
    this.seat.registerGlobal(this.session.display.registry)
    this.shell.registerGlobal(this.session.display.registry)
    this.subcompositor.registerGlobal(this.session.display.registry)

    this.xdgWmBase.registerGlobal(this.session.display.registry)

    this.webShm.registerGlobal(this.session.display.registry)
    this.webGL.registerGlobal(this.session.display.registry)
  }

  unregister () {
    this.output.unregisterGlobal()
    this.compositor.unregisterGlobal()
    this.dataDeviceManager.unregisterGlobal()
    this.seat.unregisterGlobal()
    this.shell.unregisterGlobal()
    this.subcompositor.unregisterGlobal()

    this.xdgWmBase.unregisterGlobal()

    this.webShm.unregisterGlobal()
    this.webGL.unregisterGlobal()
  }
}

export default Globals
