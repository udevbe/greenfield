import { destroyWlResourceSilently, flush, sendEvents } from 'westfield-proxy'
import { performance } from 'perf_hooks'

export class FrameFeedback {
  private callbackResourceIds: number[] = []
  private commitTimestamp = 0
  private frameDoneTimestamp = 0
  delay = 16.667

  constructor(private wlClient: unknown, private messageInterceptors: Record<number, any>) {}

  addFrameCallbackId(frameCallbackId: number): void {
    this.callbackResourceIds.push(frameCallbackId)
  }

  commitNotify(): void {
    this.commitTimestamp = performance.now()
  }

  frameDone(encodeStart: number): void {
    if (this.callbackResourceIds.length > 0) {
      const frameCallbackIds = [...this.callbackResourceIds]
      this.callbackResourceIds = []
      const encodeDuration = performance.now() - encodeStart
      const clientRenderDuration = this.commitTimestamp - this.frameDoneTimestamp
      const totalRenderTime = clientRenderDuration + encodeDuration
      // TODO Base the max interval time on client rendering speed and browser decoding feedback
      if (totalRenderTime < this.delay) {
        const frameDelay = this.delay - totalRenderTime
        if (frameDelay >= 1) {
          setTimeout(() => {
            this.frameDoneTimestamp = performance.now()
            frameCallbackIds.forEach((frameCallbackId) => {
              this.sendFrameDoneEvent(frameCallbackId)
              delete this.messageInterceptors[frameCallbackId]
            })
          }, frameDelay << 0)
          return
        }
      }

      frameCallbackIds.forEach((frameCallbackId) => {
        this.frameDoneTimestamp = performance.now()
        this.sendFrameDoneEvent(frameCallbackId)
        delete this.messageInterceptors[frameCallbackId]
      })
    }
  }

  private sendFrameDoneEvent(callbackResourceId: number) {
    // send done event to callback
    const doneSize = 12 // id+size+opcode+time arg
    const doneBuffer = new ArrayBuffer(doneSize)
    const doneBufu32 = new Uint32Array(doneBuffer)
    const doneBufu16 = new Uint16Array(doneBuffer)
    doneBufu32[0] = callbackResourceId
    doneBufu16[2] = 0
    doneBufu16[3] = doneSize
    doneBufu32[2] = this.frameDoneTimestamp << 0
    sendEvents(this.wlClient, doneBufu32, new Uint32Array([]))

    // send delete id event to display
    const deleteSize = 12 // id+size+opcode+id arg
    const deleteBuffer = new ArrayBuffer(deleteSize)
    const deleteBufu32 = new Uint32Array(deleteBuffer)
    const deleteBufu16 = new Uint16Array(deleteBuffer)
    deleteBufu32[0] = 1
    deleteBufu16[2] = 1
    deleteBufu16[3] = deleteSize
    deleteBufu32[2] = callbackResourceId
    sendEvents(this.wlClient, deleteBufu32, new Uint32Array([]))

    destroyWlResourceSilently(this.wlClient, callbackResourceId)

    flush(this.wlClient)
  }
}
