import { destroyWlResourceSilently, flush, sendEvents } from 'westfield-proxy'
import { performance } from 'perf_hooks'
import { clearTimeout } from 'timers'

export class FrameFeedback {
  // frame callback prediction state
  private virtualRefreshDeadline = 0
  private refreshInterval = 16.667
  private clientProcessingDuration?: number
  private clientFeedbackTimestamp = 0
  private delayedFrameDoneEvents?: {
    timeout?: NodeJS.Timeout
    endTime?: number
    startTime: number
    callback: () => void
    promise: Promise<number>
  }
  private paused = false

  constructor(private wlClient: unknown, private messageInterceptors: Record<number, any>) {}

  destroy() {
    if (this.delayedFrameDoneEvents) {
      clearTimeout(this.delayedFrameDoneEvents.timeout)
      this.delayedFrameDoneEvents = undefined
    }
  }

  commitNotify(
    buffer: {
      readonly bufferResourceId: number
      readonly encodingPromise: Promise<void>
    },
    frameCallbacksIds: number[],
    isDestroyed: () => boolean,
  ): void {
    const committedBuffer = {
      ...buffer,
      commitTimestamp: performance.now(),
      isDestroyed,
      frameCallbacksIds,
    } as const
    committedBuffer.encodingPromise.then(() => this.commitDone(committedBuffer))
  }

  updateDelay(clientRefreshInterval: number, clientProcessingDuration: number | undefined) {
    const now = performance.now()
    this.clientFeedbackTimestamp = now
    this.refreshInterval = clientRefreshInterval

    if (clientProcessingDuration) {
      this.clientProcessingDuration = clientProcessingDuration
    }

    if (this.paused) {
      this.resume()
      return
    }

    if (this.clientProcessingDuration === undefined) {
      return
    }

    if (this.delayedFrameDoneEvents && this.delayedFrameDoneEvents.endTime) {
      const newEndTime = this.delayedFrameDoneEvents.startTime + this.clientProcessingDuration
      if (newEndTime < now) {
        // immediately fire frame done events
        clearTimeout(this.delayedFrameDoneEvents.timeout)
        this.delayedFrameDoneEvents.callback()
      } else if (this.delayedFrameDoneEvents.endTime - newEndTime > 0) {
        // If there is a scheduled frame done event that is more in the future compared to a frame done event that
        // would be scheduled now, then we reschedule the old frame done event using the new delay information
        clearTimeout(this.delayedFrameDoneEvents.timeout)
        this.delayedFrameDoneEvents.timeout = setTimeout(
          this.delayedFrameDoneEvents.callback,
          this.clientProcessingDuration,
        )
      }
    }
  }

  private commitDone(committedBuffer: {
    readonly frameCallbacksIds: number[]
    readonly isDestroyed: () => boolean
    readonly commitTimestamp: number
  }): void {
    if (committedBuffer.isDestroyed()) {
      return
    }

    if (this.delayedFrameDoneEvents) {
      this.delayedFrameDoneEvents.promise.then((feedbackTime) =>
        this.sendFrameDoneEventsWithCallbacks(feedbackTime, committedBuffer.frameCallbacksIds),
      )
      return
    }

    const now = performance.now()

    if (now - this.clientFeedbackTimestamp > 2000 || this.clientProcessingDuration === undefined) {
      // pause sending frame done event until we have a (recent) feedback timestamp
      this.pause()
      this.createDelayedFrameDoneEvents(committedBuffer.frameCallbacksIds)
      return
    }

    const duration = now - committedBuffer.commitTimestamp
    const extraClientDuration = this.clientProcessingDuration > duration ? this.clientProcessingDuration - duration : 0

    // TODO take expected application wait-for-commit into account when calculating next deadline
    this.virtualRefreshDeadline +=
      Math.ceil((now + extraClientDuration - this.virtualRefreshDeadline) / this.refreshInterval) * this.refreshInterval

    const callbackDelay = this.virtualRefreshDeadline - now

    if (callbackDelay >= 1) {
      this.createDelayedFrameDoneEvents(committedBuffer.frameCallbacksIds, callbackDelay)
    } else {
      this.sendFrameDoneEventsWithCallbacks(now, committedBuffer.frameCallbacksIds)
    }
  }

  private createDelayedFrameDoneEvents(frameCallbackIds: number[], callbackDelay?: number) {
    let callbackResolve: (value: number | PromiseLike<number>) => void
    const promise = new Promise<number>((resolve) => {
      callbackResolve = resolve
    })
    const startTime = performance.now()
    const endTime = callbackDelay ? startTime + callbackDelay : undefined
    const callback = () => {
      if (this.delayedFrameDoneEvents && this.paused) {
        this.delayedFrameDoneEvents.timeout = undefined
        this.delayedFrameDoneEvents.endTime = undefined
        return
      }

      this.delayedFrameDoneEvents = undefined
      const feedbackTime = endTime ?? performance.now()
      this.sendFrameDoneEventsWithCallbacks(feedbackTime, frameCallbackIds)

      callbackResolve(feedbackTime)
    }
    this.delayedFrameDoneEvents = {
      callback,
      startTime,
      timeout: callbackDelay ? setTimeout(callback, callbackDelay) : undefined,
      endTime,
      promise,
    }
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false

    if (this.delayedFrameDoneEvents && this.delayedFrameDoneEvents.timeout === undefined) {
      this.delayedFrameDoneEvents.callback()
    }
  }

  sendFrameDoneEventsWithCallbacks(frameDoneTimestamp: number, frameCallbackIds: number[]) {
    for (const frameCallbackId of frameCallbackIds) {
      this.sendFrameDoneEvent(frameDoneTimestamp, frameCallbackId)
      delete this.messageInterceptors[frameCallbackId]
    }

    // this.syncChildren.forEach((syncChild) => syncChild.sendDoneEvents(frameDoneTimestamp))
  }

  private sendFrameDoneEvent(frameDoneTimestamp: number, callbackResourceId: number) {
    const doneSize = 12 // id+size+opcode+time arg
    const deleteSize = 12 // id+size+opcode+id arg

    const messagesBuffer = new ArrayBuffer(doneSize + deleteSize)

    // send done event to callback
    const doneBufu32 = new Uint32Array(messagesBuffer)
    const doneBufu16 = new Uint16Array(messagesBuffer)
    doneBufu32[0] = callbackResourceId
    doneBufu16[2] = 0 // done opcode
    doneBufu16[3] = doneSize
    doneBufu32[2] = frameDoneTimestamp << 0

    // send delete id event to display
    const deleteBufu32 = new Uint32Array(messagesBuffer, doneSize)
    const deleteBufu16 = new Uint16Array(messagesBuffer, doneSize)
    deleteBufu32[0] = 1
    deleteBufu16[2] = 1 // delete opcode
    deleteBufu16[3] = deleteSize
    deleteBufu32[2] = callbackResourceId

    sendEvents(this.wlClient, doneBufu32, new Uint32Array([]))
    flush(this.wlClient)

    destroyWlResourceSilently(this.wlClient, callbackResourceId)
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
}
