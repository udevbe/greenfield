import {
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createKeyEventFromKeyboardEvent,
} from '../index'
import Session from '../Session'

export function addInputOutput(session: Session, canvas: HTMLCanvasElement, outputId: string): void {
  session.renderer.initScene(outputId, canvas)

  const seat = session.globals.seat

  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault()
  canvas.tabIndex = 1

  canvas.onmouseover = () => canvas.focus()
  canvas.onmouseleave = () => {
    seat.notifyKeyboardFocusOut()
    seat.pointer.buttonCount = 0
    session.flush()
  }

  canvas.onfocus = () => {
    seat.notifyKeyboardFocusIn()
    session.flush()
  }
  canvas.onblur = () => {
    seat.notifyKeyboardFocusOut()
    session.flush()
  }

  //wire up dom input events to compositor input events
  const pointerMoveHandler = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    seat.notifyMotion(createButtonEventFromMouseEvent(event, false, outputId))
    seat.notifyFrame()
    session.flush()
  }

  // @ts-ignore
  if (canvas.onpointerrawupdate) {
    // @ts-ignore
    canvas.onpointerrawupdate = pointerMoveHandler
  } else {
    canvas.onpointermove = pointerMoveHandler
  }

  canvas.onpointerdown = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)

    seat.notifyButton(createButtonEventFromMouseEvent(event, false, outputId))
    seat.notifyFrame()
    session.flush()
  }
  canvas.onpointerup = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    canvas.releasePointerCapture(event.pointerId)

    seat.notifyButton(createButtonEventFromMouseEvent(event, true, outputId))
    seat.notifyFrame()
    session.flush()
  }
  canvas.onwheel = (event: WheelEvent) => {
    event.stopPropagation()
    event.preventDefault()

    seat.notifyAxis(createAxisEventFromWheelEvent(event, outputId))
    seat.notifyFrame()
    session.flush()
  }
  canvas.onkeydown = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, true)
    if (keyEvent) {
      seat.notifyKey(keyEvent)
      session.flush()
    }
  }
  canvas.onkeyup = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, false)
    if (keyEvent) {
      seat.notifyKey(keyEvent)
      session.flush()
    }
  }
}
