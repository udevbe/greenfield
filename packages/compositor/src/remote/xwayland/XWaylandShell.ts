import Session from '../../Session'
import Surface from '../../Surface'
import XWaylandShellSurface from './XWaylandShellSurface'
import { XWindow } from './XWindow'
import { Size } from '../../math/Size'
import { Point } from '../../math/Point'

class XWaylandShell {
  static create(session: Session): XWaylandShell {
    return new XWaylandShell(session)
  }

  private readonly session: Session

  constructor(session: Session) {
    this.session = session
  }

  createSurface(
    window: XWindow,
    surface: Surface,
    sendConfigure: (size: Size) => void,
    sendPosition: (position: Point) => void,
  ): XWaylandShellSurface {
    return XWaylandShellSurface.create(this.session, window, surface, sendConfigure, sendPosition)
  }
}

export default XWaylandShell
