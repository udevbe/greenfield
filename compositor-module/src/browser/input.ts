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
  // canvas.onmouseleave = () => {
  //   seat.pointer.cancelGrab()
  //   seat.pointer.clearFocus()
  // }
  canvas.onfocus = () => seat.notifyKeyboardFocusIn()
  canvas.onblur = () => seat.notifyKeyboardFocusOut()

  //wire up dom input events to compositor input events
  const pointerMoveHandler = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    seat.notifyMotion(createButtonEventFromMouseEvent(event, false, outputId))
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
  }
  canvas.onpointerup = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    seat.notifyButton(createButtonEventFromMouseEvent(event, true, outputId))
    canvas.releasePointerCapture(event.pointerId)
  }
  canvas.onwheel = (event: WheelEvent) => {
    event.stopPropagation()
    event.preventDefault()
    seat.notifyAxis(createAxisEventFromWheelEvent(event, outputId))
  }
  canvas.onkeydown = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, true)
    if (keyEvent) {
      seat.notifyKey(keyEvent)
    }
  }
  canvas.onkeyup = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, false)
    if (keyEvent) {
      seat.notifyKey(keyEvent)
    }
  }
}
