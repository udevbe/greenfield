import { destroyWlResourceSilently, flush, sendEvents } from 'westfield-proxy'
import { performance } from 'perf_hooks'
import { clearTimeout } from 'timers'

export class FrameFeedback {
  callbackResourceIds: number[] = []
  private commitTimestamp = 0
  delay = 16.667
  private delayedFrameDone?: NodeJS.Timeout

  syncParent?: FrameFeedback
  private syncChildren: FrameFeedback[] = []

  constructor(private wlClient: unknown, private messageInterceptors: Record<number, any>) {}

  destroy() {
    if (this.delayedFrameDone) {
      clearTimeout(this.delayedFrameDone)
    }
  }

  addFrameCallbackId(frameCallbackId: number): void {
    this.callbackResourceIds.push(frameCallbackId)
  }

  commitNotify(): void {
    this.commitTimestamp = performance.now()
  }

  frameDone(encodeStart: number): void {
    if (this.syncParent) {
      // wait for parent to send his done event
      return
    }

    const frameCallbackIds = [...this.callbackResourceIds]
    this.callbackResourceIds = []
    const totalRenderTime = performance.now() - encodeStart
    if (totalRenderTime < this.delay) {
      const frameDelay = this.delay - totalRenderTime
      if (frameDelay >= 1 && this.delayedFrameDone === undefined) {
        this.delayedFrameDone = setTimeout(() => {
          this.delayedFrameDone = undefined
          this.sendFrameDoneEvents(performance.now(), frameCallbackIds)
        }, frameDelay << 0)
        return
      }
    }

    if (this.delayedFrameDone === undefined) {
      this.sendFrameDoneEvents(performance.now(), frameCallbackIds)
    }
  }

  sendFrameDoneEvents(frameDoneTimestamp: number, frameCallbackIds: number[]) {
    frameCallbackIds.forEach((frameCallbackId) => {
      this.sendFrameDoneEvent(frameDoneTimestamp, frameCallbackId)
      delete this.messageInterceptors[frameCallbackId]
    })

    this.syncChildren.forEach((syncChild) => {
      const frameCallbackIds = [...syncChild.callbackResourceIds]
      syncChild.callbackResourceIds = []
      syncChild.sendFrameDoneEvents(frameDoneTimestamp, frameCallbackIds)
    })
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
      const frameCallbackIds = [...this.callbackResourceIds]
      this.callbackResourceIds = []
      this.sendFrameDoneEvents(performance.now(), frameCallbackIds)
    }
  }
}
