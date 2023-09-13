import {
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createKeyEventFromKeyboardEvent,
} from '../index'
import Session from '../Session'
import { createDnd } from './dnd'
import { initBrowserSelection } from './selection'

export function addInputOutput(session: Session, canvas: HTMLCanvasElement, outputId: string): void {
  session.renderer.initScene(outputId, canvas)

  const seat = session.globals.seat

  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault()
  canvas.style.userSelect = 'none'

  canvas.tabIndex = 1
  const dnd = createDnd(canvas, seat, outputId)

  // canvas.addEventListener('pointerover', () => canvas.focus(), { passive: true })

  const pointerleaveHandler = () => {
    seat.notifyKeyboardFocusOut()
    seat.pointer.buttonCount = 0
    session.renderer.resetCursor()
    session.flush()
  }
  dnd.onDnDStarted = () => canvas.removeEventListener('pointerleave', pointerleaveHandler)
  dnd.onDnDEnded = () => canvas.addEventListener('pointerleave', pointerleaveHandler, { passive: true })

  initBrowserSelection(session)

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

  canvas.addEventListener(
    'pointermove',
    (event: PointerEvent) => {
      for (const coalescedEvent of event.getCoalescedEvents()) {
        const buttonEvent = createButtonEventFromMouseEvent(
          coalescedEvent,
          false,
          outputId,
          canvas.width,
          canvas.height,
        )
        session.inputQueue.queueMotion(buttonEvent)
      }
      session.inputQueue.queueMotion(
        createButtonEventFromMouseEvent(event, false, outputId, canvas.width, canvas.height),
      )
    },
    { passive: true },
  )

  canvas.addEventListener(
    'pointerdown',
    (event: PointerEvent) => {
      dnd.handlePointerDown(event)
      canvas.setPointerCapture(event.pointerId)
      session.inputQueue.queueButton(
        createButtonEventFromMouseEvent(event, false, outputId, canvas.width, canvas.height),
      )
    },
    { passive: true },
  )

  canvas.addEventListener(
    'pointerup',
    (event: PointerEvent) => {
      canvas.releasePointerCapture(event.pointerId)
      session.inputQueue.queueButton(
        createButtonEventFromMouseEvent(event, true, outputId, canvas.width, canvas.height),
      )
      dnd.handlePointerUp(event)
    },
    { passive: true },
  )

  canvas.addEventListener(
    'wheel',
    (event: WheelEvent) => {
      session.inputQueue.queueAxis(createAxisEventFromWheelEvent(event, outputId))
    },
    { passive: true },
  )

  canvas.addEventListener('keydown', (event: KeyboardEvent) => {
    const keyEvent = createKeyEventFromKeyboardEvent(event, true)
    if (keyEvent) {
      event.preventDefault()
      session.inputQueue.queueKey(keyEvent)
    }
  })

  canvas.addEventListener('keyup', (event: KeyboardEvent) => {
    const keyEvent = createKeyEventFromKeyboardEvent(event, false)
    if (keyEvent) {
      event.preventDefault()
      session.inputQueue.queueKey(keyEvent)
    }
  })

  window.onbeforeunload = () => true
}
