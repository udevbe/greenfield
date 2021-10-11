import Session from '../Session'
import Surface from '../Surface'
import XWaylandShellSurface from './XWaylandShellSurface'
import { XWindow } from './XWindow'

class XWaylandShell {
  static create(session: Session): XWaylandShell {
    return new XWaylandShell(session)
  }

  private readonly session: Session

  constructor(session: Session) {
    this.session = session
  }

  createSurface(window: XWindow, surface: Surface): XWaylandShellSurface {
    return XWaylandShellSurface.create(this.session, window, surface)
  }
}

export default XWaylandShell
