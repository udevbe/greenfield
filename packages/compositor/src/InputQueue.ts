import { ButtonEvent } from './ButtonEvent'
import Session from './Session'
import { AxisEvent } from './AxisEvent'
import { KeyEvent } from './KeyEvent'
import { createRenderFrame } from './render/Renderer'

export class InputQueue {
  private motionQueue: ButtonEvent[] = []
  private buttonQueue: ButtonEvent[] = []
  private axisQueue: AxisEvent[] = []
  private keyQueue: KeyEvent[] = []

  private queueDrainTask?: Promise<void>

  constructor(public readonly session: Session) {}

  queueMotion(event: ButtonEvent): void {
    this.motionQueue.push(event)
    this.ensureQueueDrain()
  }

  queueAxis(event: AxisEvent): void {
    this.axisQueue.push(event)
    this.ensureQueueDrain()
  }

  queueKey(event: KeyEvent): void {
    this.keyQueue.push(event)
    this.ensureQueueDrain()
  }

  queueButton(event: ButtonEvent): void {
    this.buttonQueue.push(event)
    this.ensureQueueDrain()
  }

  private drainQueues() {
    let needsFrameEvent = false
    let needsFlush = false

    if (this.motionQueue.length > 0) {
      needsFrameEvent = true
      for (const buttonEvent of this.motionQueue) {
        this.session.globals.seat.notifyMotion(buttonEvent)
      }
      this.motionQueue = []
    }

    if (this.axisQueue.length > 0) {
      needsFrameEvent = true
      for (const axisEvent of this.axisQueue) {
        this.session.globals.seat.notifyAxis(axisEvent)
      }
      this.axisQueue = []
    }

    if (this.buttonQueue.length > 0) {
      needsFrameEvent = true
      for (const buttonEvent of this.buttonQueue) {
        this.session.globals.seat.notifyButton(buttonEvent)
      }
      this.buttonQueue = []
    }

    if (this.keyQueue.length > 0) {
      needsFlush = true
      for (const keyEvent of this.keyQueue) {
        this.session.globals.seat.notifyKey(keyEvent)
      }
      this.keyQueue = []
    }

    if (needsFrameEvent) {
      this.session.globals.seat.notifyFrame()
    }

    if (needsFrameEvent || needsFlush) {
      this.session.flush()
    }
  }

  private ensureQueueDrain() {
    if (this.queueDrainTask) {
      return
    }

    if (this.session.renderer.renderFrame) {
      this.queueDrainTask = this.session.renderer.renderFrame.then(() => {
        this.drainQueues()
        this.queueDrainTask = undefined
      })
    } else {
      this.queueDrainTask = createRenderFrame().then(() => {
        this.drainQueues()
        this.queueDrainTask = undefined
      })
    }
  }
}
