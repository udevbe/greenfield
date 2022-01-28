import {
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createKeyEventFromKeyboardEvent,
} from '../index'
import Session from '../Session'
import { browserDragStarted } from './pointer'

export function addInputOutput(session: Session, canvas: HTMLCanvasElement, outputId: string): void {
  session.renderer.initScene(outputId, canvas)

  const seat = session.globals.seat

  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault()
  canvas.tabIndex = 1

  canvas.draggable = true
  canvas.ondragstart = browserDragStarted
  canvas.ondragover = (event) => {
    seat.notifyMotion(createButtonEventFromMouseEvent(event, false, outputId, canvas.width, canvas.height))
    seat.notifyFrame()
    session.flush()
  }
  canvas.ondragend = (ev) => {
    seat.notifyButton(createButtonEventFromMouseEvent(ev, true, outputId, canvas.width, canvas.height))
    seat.notifyFrame()
    session.flush()
  }

  canvas.onmouseover = () => canvas.focus()
  canvas.onmouseleave = () => {
    seat.notifyKeyboardFocusOut()
    seat.pointer.buttonCount = 0
    session.renderer.resetCursor()
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
    const buttonEvent = createButtonEventFromMouseEvent(event, false, outputId, canvas.width, canvas.height)
    seat.notifyMotion(buttonEvent)
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
    canvas.setPointerCapture(event.pointerId)

    seat.notifyButton(createButtonEventFromMouseEvent(event, false, outputId, canvas.width, canvas.height))
    seat.notifyFrame()
    session.flush()
  }
  canvas.onpointerup = (event: PointerEvent) => {
    canvas.releasePointerCapture(event.pointerId)

    seat.notifyButton(createButtonEventFromMouseEvent(event, true, outputId, canvas.width, canvas.height))
    seat.notifyFrame()
    session.flush()
  }
  canvas.onwheel = (event: WheelEvent) => {
    seat.notifyAxis(createAxisEventFromWheelEvent(event, outputId))
    seat.notifyFrame()
    session.flush()
  }
  canvas.onkeydown = (event: KeyboardEvent) => {
    const keyEvent = createKeyEventFromKeyboardEvent(event, true)
    if (keyEvent) {
      event.preventDefault()
      seat.notifyKey(keyEvent)
      session.flush()
    }
  }
  canvas.onkeyup = (event: KeyboardEvent) => {
    const keyEvent = createKeyEventFromKeyboardEvent(event, false)
    if (keyEvent) {
      event.preventDefault()
      seat.notifyKey(keyEvent)
      session.flush()
    }
  }
}
