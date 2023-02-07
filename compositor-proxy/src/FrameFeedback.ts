import { destroyWlResourceSilently, flush, sendEvents } from 'westfield-proxy'
import { performance } from 'perf_hooks'
import type { Channel } from './Channel'

let activeFeedbackClockInterval = 16.667
let feedbackClockTimer: NodeJS.Timer | undefined
let feedbackClockQueue: ((time: number) => void)[] = []

function configureFrameFeedbackClock(interval: number) {
  if (feedbackClockTimer) {
    clearInterval(feedbackClockTimer)
    feedbackClockTimer = undefined
  }
  activeFeedbackClockInterval = Math.ceil(interval)
  feedbackClockTimer = setInterval(() => {
    if (feedbackClockQueue.length) {
      const time = performance.now()
      for (const virtualVSyncListener of feedbackClockQueue) {
        virtualVSyncListener(time)
      }
      feedbackClockQueue = []
    }
  }, activeFeedbackClockInterval)
}

configureFrameFeedbackClock(activeFeedbackClockInterval)

export class FrameFeedback {
  private serverProcessingDuration = 0
  private clientProcessingDuration = 0
  private clientFeedbackTimestamp = 0
  private parkedFeedbackClockQueue: ((time: number) => void)[] = []

  constructor(
    private wlClient: unknown,
    private messageInterceptors: Record<number, any>,
    private feedbackChannel: Channel,
    private clientRefreshInterval = 16.667,
  ) {
    feedbackChannel.onMessage((buffer) => {
      const refreshInterval = buffer.readUInt16LE()
      const avgDuration = buffer.readUInt16LE(2)
      this.updateDelay(refreshInterval, avgDuration)
    })
  }

  destroy() {
    this.feedbackChannel.close()
  }

  commitNotify(frameCallbacksIds: number[], isDestroyed: () => boolean): void {
    const clockQueue =
      performance.now() - this.clientFeedbackTimestamp > 1500 ? this.parkedFeedbackClockQueue : feedbackClockQueue
    clockQueue.push((time) => {
      if (isDestroyed()) {
        return
      }
      this.sendFrameDoneEventsWithCallbacks(time, frameCallbacksIds)
    })
  }

  private ensureCorrectClockInterval() {
    const slowestClockInterval = Math.max(
      this.serverProcessingDuration,
      this.clientProcessingDuration,
      this.clientRefreshInterval,
    )

    if (Math.abs(slowestClockInterval - activeFeedbackClockInterval) > 8) {
      configureFrameFeedbackClock(slowestClockInterval)
    }
  }

  private updateDelay(clientRefreshInterval: number, clientProcessingDuration: number) {
    this.clientFeedbackTimestamp = performance.now()
    this.clientProcessingDuration = clientProcessingDuration
    this.clientRefreshInterval = clientRefreshInterval
    if (this.parkedFeedbackClockQueue.length) {
      feedbackClockQueue.push(...this.parkedFeedbackClockQueue)
      this.parkedFeedbackClockQueue = []
    }

    this.ensureCorrectClockInterval()
  }

  encodingDone(commitTimestamp: number): void {
    this.serverProcessingDuration = performance.now() - commitTimestamp
    this.ensureCorrectClockInterval()
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
