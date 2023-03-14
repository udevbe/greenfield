import { destroyWlResourceSilently, flush, sendEvents } from 'westfield-proxy'
import { performance } from 'perf_hooks'
import type { Channel } from './Channel'

let tickInterval = 16.667
let nextTickInterval = tickInterval
let feedbackClockTimer: NodeJS.Timer | undefined
type Feedback = { callback: (time: number) => void; frameCallbackDelay: number }
let feedbackClockQueue: Feedback[] = []

function configureFramePipelineTicks(interval: number) {
  if (feedbackClockTimer) {
    return
  }

  tickInterval = interval
  feedbackClockTimer = setInterval(() => {
    if (feedbackClockQueue.length) {
      const time = performance.now() >>> 0
      for (const feedback of feedbackClockQueue) {
        feedback.frameCallbackDelay -= tickInterval
        if (feedback.frameCallbackDelay <= 0) {
          feedback.callback(time)
        }
      }
      feedbackClockQueue = feedbackClockQueue.filter((feedback) => feedback.frameCallbackDelay > 0)
    }

    if (tickInterval !== nextTickInterval) {
      if (feedbackClockTimer) {
        clearInterval(feedbackClockTimer)
        feedbackClockTimer = undefined
      }
      configureFramePipelineTicks(nextTickInterval)
    }
  }, tickInterval)
}

configureFramePipelineTicks(nextTickInterval)

export class FrameFeedback {
  private serverProcessingDuration = 0
  private clientProcessingDuration = 0
  private clientFeedbackTimestamp = 0
  private parkedFeedbackClockQueue: Feedback[] = []
  private frameCallbackDelay = 0
  private destroyed = false

  constructor(
    private wlClient: unknown,
    private messageInterceptors: Record<number, any>,
    private feedbackChannel: Channel,
  ) {
    feedbackChannel.onMessage = (buffer) => {
      const data = Buffer.from(buffer, buffer.byteOffset, buffer.byteLength)
      const refreshInterval = data.readUInt16LE(0)
      const avgDuration = data.readUInt16LE(2)
      this.updateDelay(refreshInterval, avgDuration)
    }
  }

  destroy() {
    this.destroyed = true
    this.parkedFeedbackClockQueue = []
    this.feedbackChannel.close()
  }

  commitNotify(frameCallbacksIds: number[]): void {
    const clockQueue =
      performance.now() - this.clientFeedbackTimestamp > 1500 ? this.parkedFeedbackClockQueue : feedbackClockQueue
    clockQueue.push({
      callback: (time) => {
        if (this.destroyed) {
          return
        }
        this.sendFrameDoneEventsWithCallbacks(time, frameCallbacksIds)
      },
      frameCallbackDelay: this.frameCallbackDelay,
    })
  }

  private updateDelay(clientRefreshInterval: number, clientProcessingDuration: number) {
    this.clientFeedbackTimestamp = performance.now()
    this.clientProcessingDuration = clientProcessingDuration
    if (this.parkedFeedbackClockQueue.length) {
      feedbackClockQueue.push(...this.parkedFeedbackClockQueue)
      this.parkedFeedbackClockQueue = []
    }

    this.frameCallbackDelay = Math.floor(Math.max(this.serverProcessingDuration, this.clientProcessingDuration))
    nextTickInterval = Math.floor(clientRefreshInterval)
  }

  encodingDone(commitTimestamp: number): void {
    this.serverProcessingDuration = performance.now() - commitTimestamp
    // console.log(this.serverProcessingDuration, this.clientProcessingDuration)
    this.frameCallbackDelay = Math.floor(Math.max(this.serverProcessingDuration, this.clientProcessingDuration))
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
    doneBufu32[2] = frameDoneTimestamp >>> 0

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
