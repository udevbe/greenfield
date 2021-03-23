import Compositor from './Compositor'
import DataDeviceManager from './DataDeviceManager'
import { CompositorGlobals } from './index'
import Output from './Output'
import Seat from './Seat'
import Session from './Session'
import Shell from './Shell'
import Subcompositor from './Subcompositor'
import WebGL from './webgl/WebGL'
import WebShm from './webshm/WebShm'
import XdgWmBase from './XdgWmBase'

class Globals implements CompositorGlobals {
  readonly session: Session
  readonly seat: Seat
  readonly compositor: Compositor
  readonly dataDeviceManager: DataDeviceManager
  readonly subcompositor: Subcompositor
  readonly shell: Shell
  readonly xdgWmBase: XdgWmBase
  readonly webShm: WebShm
  readonly webGL: WebGL
  outputs: Output[] = []

  static create(session: Session): Globals {
    const seat = Seat.create(session)

    const compositor = Compositor.create(session)
    const dataDeviceManager = DataDeviceManager.create()
    const subcompositor = Subcompositor.create()

    const shell = Shell.create(session)
    const xdgWmBase = XdgWmBase.create(session, seat)

    const webShm = WebShm.create()
    const webGL = WebGL.create(session)

    return new Globals(session, seat, compositor, dataDeviceManager, subcompositor, shell, xdgWmBase, webShm, webGL)
  }

  private constructor(
    session: Session,
    seat: Seat,
    compositor: Compositor,
    dataDeviceManager: DataDeviceManager,
    subcompositor: Subcompositor,
    shell: Shell,
    xdgWmBase: XdgWmBase,
    webShm: WebShm,
    webGL: WebGL,
  ) {
    this.session = session
    this.seat = seat
    this.compositor = compositor
    this.dataDeviceManager = dataDeviceManager
    this.subcompositor = subcompositor
    this.shell = shell
    this.xdgWmBase = xdgWmBase
    this.webShm = webShm
    this.webGL = webGL
  }

  registerOutput(output: Output) {
    this.outputs = [...this.outputs, output]
    output.registerGlobal(this.session.display.registry)
  }

  unregisterOutput(output: Output) {
    output.unregisterGlobal()
    this.outputs = this.outputs.filter((otherOutput) => otherOutput !== output)
  }

  register() {
    this.compositor.registerGlobal(this.session.display.registry)
    this.dataDeviceManager.registerGlobal(this.session.display.registry)
    this.seat.registerGlobal(this.session.display.registry)
    this.shell.registerGlobal(this.session.display.registry)
    this.subcompositor.registerGlobal(this.session.display.registry)

    this.xdgWmBase.registerGlobal(this.session.display.registry)

    this.webShm.registerGlobal(this.session.display.registry)
    this.webGL.registerGlobal(this.session.display.registry)
  }

  unregister() {
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
