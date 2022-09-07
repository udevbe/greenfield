import { EncoderApi } from '../api'

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
      clientEncodersFeedbacks.forEach((clientEncoderFeedback) => clientEncoderFeedback.sendRefreshIntervalUpdate())
    }

    previousPresentationTimestamp = presentationTimestamp
  })
}

updateRefreshInterval()

export function createClientEncodersFeedback(clientId: string, encoderApi: EncoderApi) {
  const clientEncoderFeedback = new ClientEncodersFeedback(clientId, encoderApi)
  clientEncodersFeedbacks = [...clientEncodersFeedbacks, clientEncoderFeedback]
  clientEncoderFeedback.sendFeedback()
  return clientEncoderFeedback
}

function notNull<TValue>(value: TValue | null): value is TValue {
  return value !== null
}

export class ClientEncodersFeedback {
  constructor(
    private readonly clientId: string,
    private readonly encoderApi: EncoderApi,
    private surfaceEncoderFeedbacks: SurfaceEncoderFeedback[] = [],
  ) {}

  sendRefreshIntervalUpdate() {
    this.encoderApi.feedback({
      clientId: this.clientId,
      inlineObject1: {
        refreshInterval,
      },
    })
  }

  sendFeedback() {
    const now = performance.now()
    const surfaceDurationEntries = this.surfaceEncoderFeedbacks
      .map((surfaceEncoderFeedback) => {
        if (now - surfaceEncoderFeedback.durationSentTime < 1000) {
          return null
        }

        const durations = surfaceEncoderFeedback.durations
        if (durations.length === 0) {
          return null
        }

        const durationsSum = durations.reduce((prev, cur) => prev + cur, 0)
        const avgDuration = durationsSum / durations.length
        surfaceEncoderFeedback.durationSentTime = now
        surfaceEncoderFeedback.durations = []
        return [surfaceEncoderFeedback.surfaceId, avgDuration]
      })
      .filter(notNull)
    if (surfaceDurationEntries.length === 0) {
      return
    }

    const surfaceDurations = Object.fromEntries(surfaceDurationEntries)
    this.encoderApi.feedback({
      clientId: this.clientId,
      inlineObject1: {
        surfaceDurations,
        refreshInterval,
      },
    })
  }

  surfaceDestroyed(destroyedSurfaceEncoderFeedback: SurfaceEncoderFeedback) {
    this.surfaceEncoderFeedbacks = this.surfaceEncoderFeedbacks.filter(
      (surfaceEncoderFeedback) => surfaceEncoderFeedback !== destroyedSurfaceEncoderFeedback,
    )
  }

  destroy() {
    clientEncodersFeedbacks = clientEncodersFeedbacks.filter((clientEncoderFeedback) => clientEncoderFeedback !== this)
  }

  createSurfaceEncoderFeedback(surfaceId: number): SurfaceEncoderFeedback {
    const surfaceEncoderFeedback = new SurfaceEncoderFeedback(surfaceId, this)
    this.surfaceEncoderFeedbacks.push(surfaceEncoderFeedback)
    return surfaceEncoderFeedback
  }
}

export class SurfaceEncoderFeedback {
  constructor(
    public readonly surfaceId: number,
    private readonly clientEncodersFeedback: ClientEncodersFeedback,
    private commitSerial?: number,
    private bufferSentStartedTimes: Record<number, number> = {},
    public durations = [] as number[],
    public durationSentTime = 0,
  ) {}

  bufferSentStartTime(commitSerial: number, bufferSentStartedTime: number) {
    this.bufferSentStartedTimes[commitSerial] = bufferSentStartedTime
  }

  bufferCommit(commitSerial: number) {
    this.commitSerial = commitSerial
  }

  destroy() {
    this.commitSerial = undefined
    this.clientEncodersFeedback.surfaceDestroyed(this)
  }

  frameProcessed(processedTime: number): void {
    if (this.commitSerial === undefined) {
      return
    }

    const commitSerial = this.commitSerial
    this.commitSerial = undefined
    if (commitSerial === undefined) {
      return
    }

    const bufferSentStartedTime = this.bufferSentStartedTimes[commitSerial]
    delete this.bufferSentStartedTimes[commitSerial]

    const duration = bufferSentStartedTime ? processedTime - bufferSentStartedTime : 1
    this.durations.push(duration)
  }
}
