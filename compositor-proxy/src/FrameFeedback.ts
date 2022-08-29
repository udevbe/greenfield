import { destroyWlResourceSilently, flush, sendEvents } from 'westfield-proxy'
import { performance } from 'perf_hooks'
import { clearTimeout } from 'timers'

export class FrameFeedback {
  private callbackResourceIds: number[] = []
  private commitTimestamp = 0
  private clientSideDuration?: number
  private delayedFrameDoneEvents?: NodeJS.Timeout
  private paused = false
  private sendDoneEventsOnResume = false

  syncParent?: FrameFeedback
  private syncChildren: FrameFeedback[] = []

  private nroPendingClientFrames = 0

  constructor(private wlClient: unknown, private messageInterceptors: Record<number, any>) {}

  destroy() {
    if (this.delayedFrameDoneEvents) {
      clearTimeout(this.delayedFrameDoneEvents)
    }
  }

  addFrameCallbackId(frameCallbackId: number): void {
    this.callbackResourceIds.push(frameCallbackId)
  }

  commitNotify(): void {
    this.commitTimestamp = performance.now()
  }

  sendDoneEvents() {
    const frameCallbackIds = [...this.callbackResourceIds]
    this.callbackResourceIds = []
    this.sendFrameDoneEvents(performance.now(), frameCallbackIds)
  }

  updateDelay(delay: number) {
    if (this.clientSideDuration === undefined) {
      this.sendDoneEvents()
    }
    this.clientSideDuration = Math.max(16, delay)
  }

  clientFramesProcessed(nroFrames: number) {
    this.nroPendingClientFrames -= nroFrames
    if (this.nroPendingClientFrames < 0) {
      throw new Error('BUG. Got more confirmed client frames then we sent out!')
    }

    // TODO trigger client render in case it was paused
  }

  frameEncodingDone(encodeStart: number): void {
    // TODO if nroPendingClientFrames keeps rising (eg because of a connection issue) we need pause until the client has caught up (eg reconnected)

    if (this.clientSideDuration === undefined || this.syncParent) {
      return
    }

    const frameCallbackIds = [...this.callbackResourceIds]
    this.callbackResourceIds = []
    const encodingDuration = performance.now() - encodeStart
    if (encodingDuration < this.clientSideDuration) {
      const callbackDelay = this.clientSideDuration - encodingDuration
      if (callbackDelay >= 1 && this.delayedFrameDoneEvents === undefined) {
        this.delayedFrameDoneEvents = setTimeout(() => {
          if (this.paused) {
            this.sendDoneEventsOnResume = true
            return
          }

          this.delayedFrameDoneEvents = undefined
          this.sendFrameDoneEvents(performance.now(), frameCallbackIds)
        }, callbackDelay)
        return
      }
    }

    if (this.delayedFrameDoneEvents === undefined) {
      this.sendFrameDoneEvents(performance.now(), frameCallbackIds)
    }
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
    if (this.sendDoneEventsOnResume) {
      this.sendDoneEventsOnResume = false
      this.sendDoneEvents()
    }
  }

  private sendFrameDoneEvents(frameDoneTimestamp: number, frameCallbackIds: number[]) {
    frameCallbackIds.forEach((frameCallbackId) => {
      this.sendFrameDoneEvent(frameDoneTimestamp, frameCallbackId)
      delete this.messageInterceptors[frameCallbackId]
    })

    this.syncChildren.forEach((syncChild) => syncChild.sendDoneEvents())
  }

  private sendFrameDoneEvent(frameDoneTimestamp: number, callbackResourceId: number) {
    // send done event to callback
    const doneSize = 12 // id+size+opcode+time arg
    const doneBuffer = new ArrayBuffer(doneSize)
    const doneBufu32 = new Uint32Array(doneBuffer)
    const doneBufu16 = new Uint16Array(doneBuffer)
    doneBufu32[0] = callbackResourceId
    doneBufu16[2] = 0 // done opcode
    doneBufu16[3] = doneSize
    doneBufu32[2] = frameDoneTimestamp << 0
    sendEvents(this.wlClient, doneBufu32, new Uint32Array([]))

    // send delete id event to display
    const deleteSize = 12 // id+size+opcode+id arg
    const deleteBuffer = new ArrayBuffer(deleteSize)
    const deleteBufu32 = new Uint32Array(deleteBuffer)
    const deleteBufu16 = new Uint16Array(deleteBuffer)
    deleteBufu32[0] = 1
    deleteBufu16[2] = 1 // delete opcode
    deleteBufu16[3] = deleteSize
    deleteBufu32[2] = callbackResourceId
    sendEvents(this.wlClient, deleteBufu32, new Uint32Array([]))

    destroyWlResourceSilently(this.wlClient, callbackResourceId)
    flush(this.wlClient)
  }

  sendBufferReleaseEvent(bufferResourceId: number) {
    const releaseSize = 8 // id+size+opcode
    const releaseBuffer = new ArrayBuffer(releaseSize)
    const releaseBufu32 = new Uint32Array(releaseBuffer)
    const releaseBufu16 = new Uint16Array(releaseBuffer)
    releaseBufu32[0] = bufferResourceId
    releaseBufu16[2] = 0 // release opcode
    releaseBufu16[3] = releaseSize
    sendEvents(this.wlClient, releaseBufu32, new Uint32Array([]))

    flush(this.wlClient)
  }

  addSyncChild(childFrameFeedback: FrameFeedback) {
    if (this.syncChildren.find((syncChild) => syncChild === childFrameFeedback) === undefined) {
      this.syncChildren = [...this.syncChildren, childFrameFeedback]
      childFrameFeedback.syncParent = this
    }
  }

  removeSyncChild(childFrameFeedback: FrameFeedback) {
    if (childFrameFeedback.syncParent === this) {
      childFrameFeedback.syncParent = undefined
      this.syncChildren = this.syncChildren.filter((syncChild) => syncChild !== childFrameFeedback)
    }
  }

  setModeSync(parentFrameFeedback: FrameFeedback) {
    if (this.syncParent) {
      this.syncParent.removeSyncChild(this)
    }
    parentFrameFeedback.addSyncChild(this)
  }

  setModeAsync() {
    if (this.syncParent) {
      this.syncParent.removeSyncChild(this)
      this.sendDoneEvents()
    }
  }
}
