import { EncoderApi } from '../api'
import type { Channel } from './Channel'

let refreshInterval = 0
let previousPresentationTimestamp = 0

let clientEncodersFeedbacks = [] as ClientEncodersFeedback[]

function updateRefreshInterval() {
  requestAnimationFrame((presentationTimestamp) => {
    updateRefreshInterval()
    if (previousPresentationTimestamp === 0) {
      previousPresentationTimestamp = presentationTimestamp
      return
    }

    const newRefreshInterval = presentationTimestamp - previousPresentationTimestamp

    if (Math.abs(newRefreshInterval - refreshInterval) > 16) {
      refreshInterval = newRefreshInterval
    }

    previousPresentationTimestamp = presentationTimestamp
  })
}

function feedbackLoop() {
  for (const clientEncodersFeedback of clientEncodersFeedbacks) {
    clientEncodersFeedback.sendFeedback()
  }
}

setInterval(feedbackLoop, 1000)

updateRefreshInterval()
feedbackLoop()

export function createClientEncodersFeedback(clientId: string, encoderApi: EncoderApi) {
  const clientEncoderFeedback = new ClientEncodersFeedback(clientId, encoderApi)
  clientEncodersFeedbacks = [...clientEncodersFeedbacks, clientEncoderFeedback]
  clientEncoderFeedback.sendFeedback()
  return clientEncoderFeedback
}

export class ClientEncodersFeedback {
  constructor(
    private readonly clientId: string,
    private readonly encoderApi: EncoderApi,
    private surfaceEncoderFeedbacks: Record<number, SurfaceEncoderFeedback> = {},
  ) {}

  addFeedbackChannel(feedbackChannel: Channel, surfaceId: number) {
    this.ensureSurfaceEncoderFeedback(surfaceId).feedbackChannel = feedbackChannel
  }

  sendFeedback() {
    for (const surfaceEncoderFeedback of Object.values(this.surfaceEncoderFeedbacks)) {
      if (
        surfaceEncoderFeedback.feedbackChannel === undefined ||
        surfaceEncoderFeedback.feedbackChannel.readyState !== 'open'
      ) {
        continue
      }

      const durations = surfaceEncoderFeedback.durations
      const durationsLength = durations.length
      if (durationsLength === 0) {
        continue
      }

      const durationsSum = durations.reduce((prev, cur) => prev + cur, 0)
      const avgDuration = durationsSum / durationsLength

      surfaceEncoderFeedback.feedbackChannel.send(
        new Uint16Array([Math.min(65000, refreshInterval), Math.min(65000, avgDuration)]),
      )
      surfaceEncoderFeedback.durations = [avgDuration]
    }
  }

  surfaceDestroyed(destroyedSurfaceEncoderFeedback: SurfaceEncoderFeedback) {
    destroyedSurfaceEncoderFeedback.feedbackChannel?.close()
    delete this.surfaceEncoderFeedbacks[destroyedSurfaceEncoderFeedback.surfaceId]
  }

  destroy() {
    clientEncodersFeedbacks = clientEncodersFeedbacks.filter((clientEncoderFeedback) => clientEncoderFeedback !== this)
  }

  ensureSurfaceEncoderFeedback(surfaceId: number): SurfaceEncoderFeedback {
    let surfaceEncoderFeedback = this.surfaceEncoderFeedbacks[surfaceId]
    if (surfaceEncoderFeedback) {
      return surfaceEncoderFeedback
    }
    surfaceEncoderFeedback = new SurfaceEncoderFeedback(surfaceId, this)
    this.surfaceEncoderFeedbacks[surfaceId] = surfaceEncoderFeedback
    return surfaceEncoderFeedback
  }
}

export class SurfaceEncoderFeedback {
  constructor(
    public readonly surfaceId: number,
    private readonly clientEncodersFeedback: ClientEncodersFeedback,
    private bufferCommitTimes: Record<number, number> = {},
    public durations = [] as number[],
    public feedbackChannel?: Channel,
  ) {}

  frameDecodingStarted(commitSerial: number) {
    this.bufferCommitTimes[commitSerial] = performance.now()
  }

  destroy() {
    this.clientEncodersFeedback.surfaceDestroyed(this)
  }

  frameDecodingDone(commitSerial: number): void {
    const bufferDecodingStartedTime = this.bufferCommitTimes[commitSerial]
    delete this.bufferCommitTimes[commitSerial]

    const duration = performance.now() - bufferDecodingStartedTime
    this.durations.push(duration)
    if (this.durations.length > 20) {
      this.durations.shift()
    }
  }
}
