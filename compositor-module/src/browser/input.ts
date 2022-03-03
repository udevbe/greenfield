import {
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createKeyEventFromKeyboardEvent,
} from '../index'
import Session from '../Session'
import { createDnd } from './dnd'

export function addInputOutput(session: Session, canvas: HTMLCanvasElement, outputId: string): void {
  session.renderer.initScene(outputId, canvas)

  const seat = session.globals.seat

  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault()
  canvas.style.userSelect = 'none'

  canvas.tabIndex = 1
  const dnd = createDnd(canvas, seat, outputId)

  canvas.addEventListener('pointerover', () => canvas.focus(), { passive: true })

  const pointerleaveHandler = () => {
    seat.notifyKeyboardFocusOut()
    seat.pointer.buttonCount = 0
    session.renderer.resetCursor()
    session.flush()
  }
  dnd.onDnDStarted = () => canvas.removeEventListener('pointerleave', pointerleaveHandler)
  dnd.onDnDEnded = () => canvas.addEventListener('pointerleave', pointerleaveHandler, { passive: true })

  canvas.addEventListener('pointerleave', pointerleaveHandler, { passive: true })
  canvas.addEventListener(
    'focus',
    () => {
      seat.notifyKeyboardFocusIn()
      session.flush()
    },
    { passive: true },
  )
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
    canvas.addEventListener('pointerrawupdate', pointerMoveHandler, { passive: true })
  } else {
    canvas.addEventListener('pointermove', pointerMoveHandler, { passive: true })
  }

  canvas.addEventListener(
    'pointerdown',
    (event: PointerEvent) => {
      dnd.handlePointerDown(event)
      canvas.setPointerCapture(event.pointerId)

      seat.notifyButton(createButtonEventFromMouseEvent(event, false, outputId, canvas.width, canvas.height))
      seat.notifyFrame()
      session.flush()
    },
    { passive: true },
  )

  canvas.addEventListener(
    'pointerup',
    (event: PointerEvent) => {
      canvas.releasePointerCapture(event.pointerId)

      seat.notifyButton(createButtonEventFromMouseEvent(event, true, outputId, canvas.width, canvas.height))
      seat.notifyFrame()
      session.flush()
      dnd.handlePointerUp(event)
    },
    { passive: true },
  )

  canvas.addEventListener(
    'wheel',
    (event: WheelEvent) => {
      seat.notifyAxis(createAxisEventFromWheelEvent(event, outputId))
      seat.notifyFrame()
      session.flush()
    },
    { passive: true },
  )

  canvas.addEventListener('keydown', (event: KeyboardEvent) => {
    const keyEvent = createKeyEventFromKeyboardEvent(event, true)
    if (keyEvent) {
      event.preventDefault()
      seat.notifyKey(keyEvent)
      session.flush()
    }
  })

  canvas.addEventListener('keyup', (event: KeyboardEvent) => {
    const keyEvent = createKeyEventFromKeyboardEvent(event, false)
    if (keyEvent) {
      event.preventDefault()
      seat.notifyKey(keyEvent)
      session.flush()
    }
  })
}
