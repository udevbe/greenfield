import Compositor from './Compositor'
import DataDeviceManager from './DataDeviceManager'
import { CompositorGlobals } from './index'
import Output from './Output'
import { Seat } from './Seat'
import Session from './Session'
import Shell from './Shell'
import Subcompositor from './Subcompositor'
import XdgWmBase from './XdgWmBase'
import { WebBuffersFactory } from './web/WebBuffersFactory'
import { Shm } from './Shm'

class Globals implements CompositorGlobals {
  static create(session: Session): Globals {
    const shm = Shm.create(session)
    const seat = Seat.create(session)

    const compositor = Compositor.create(session)
    const dataDeviceManager = DataDeviceManager.create(session)
    const subcompositor = Subcompositor.create(session)

    const shell = Shell.create(session)
    const xdgWmBase = XdgWmBase.create(session, seat)

    const webBuffersFactory = WebBuffersFactory.create(session)

    return new Globals(
      session,
      shm,
      seat,
      compositor,
      dataDeviceManager,
      subcompositor,
      shell,
      xdgWmBase,
      webBuffersFactory,
    )
  }

  private constructor(
    public readonly session: Session,
    public readonly shm: Shm,
    public readonly seat: Seat,
    public readonly compositor: Compositor,
    public readonly dataDeviceManager: DataDeviceManager,
    public readonly subcompositor: Subcompositor,
    public readonly shell: Shell,
    public readonly xdgWmBase: XdgWmBase,
    public readonly webBuffersFactory: WebBuffersFactory,
    public outputs: Output[] = [],
  ) {}

  registerOutput(output: Output): void {
    this.outputs = [...this.outputs, output]
    output.registerGlobal(this.session.display.registry)
  }

  unregisterOutput(output: Output): void {
    output.unregisterGlobal()
    this.outputs = this.outputs.filter((otherOutput) => otherOutput !== output)
  }

  register(): void {
    this.shm.registerGlobal(this.session.display.registry)
    this.compositor.registerGlobal(this.session.display.registry)
    this.dataDeviceManager.registerGlobal(this.session.display.registry)
    this.seat.registerGlobal(this.session.display.registry)
    this.shell.registerGlobal(this.session.display.registry)
    this.subcompositor.registerGlobal(this.session.display.registry)
    this.xdgWmBase.registerGlobal(this.session.display.registry)
    this.webBuffersFactory.registerGlobal(this.session.display.registry)
  }

  unregister(): void {
    this.shm.unregisterGlobal()
    this.compositor.unregisterGlobal()
    this.dataDeviceManager.unregisterGlobal()
    this.seat.unregisterGlobal()
    this.shell.unregisterGlobal()
    this.subcompositor.unregisterGlobal()
    this.xdgWmBase.unregisterGlobal()
    this.webBuffersFactory.unregisterGlobal()
  }
}

export default Globals
