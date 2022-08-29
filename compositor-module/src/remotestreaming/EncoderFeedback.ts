import { EncoderApi } from '../api'

let refreshInterval = 16.667
let previousPresentationTimestamp = 0

let encoderSurfaceFeedbacks = [] as EncoderSurfaceFeedback[]

function updateRefreshInterval() {
  requestAnimationFrame((presentationTimestamp) => {
    const newRefreshInterval = presentationTimestamp - previousPresentationTimestamp
    if (newRefreshInterval !== presentationTimestamp) {
      if (Math.abs(newRefreshInterval - refreshInterval) > 2) {
        encoderSurfaceFeedbacks.forEach((encoderSurfaceFeedback) =>
          encoderSurfaceFeedback.refreshInterval(newRefreshInterval),
        )
      }

      refreshInterval = Math.floor(newRefreshInterval)
    }
    previousPresentationTimestamp = presentationTimestamp
    updateRefreshInterval()
  })
}

updateRefreshInterval()

export function createEncoderFeedback(clientId: string, surfaceId: number, encoderApi?: EncoderApi) {
  const encoderSurfaceFeedback = new EncoderSurfaceFeedback(clientId, surfaceId, encoderApi)
  encoderSurfaceFeedbacks = [...encoderSurfaceFeedbacks, encoderSurfaceFeedback]
  encoderSurfaceFeedback.refreshInterval(refreshInterval)
  return encoderSurfaceFeedback
}

export class EncoderSurfaceFeedback {
  constructor(
    private readonly clientId: string,
    private readonly surfaceId: number,
    private readonly encoderApi?: EncoderApi,
    private readonly durations = [] as { refreshAlignedDuration: number; duration: number }[],
    private commitSerial?: number,
    // Record<commitSerial, bufferSentStartTime>
    private bufferSentStartedTimes: Record<number, number> = {},
    private previousRefreshAlignedDurationAvg = 0,
    private readonly nFrames = 7,
  ) {}

  bufferSentStartTime(commitSerial: number, bufferSentStartedTime: number) {
    this.bufferSentStartedTimes[commitSerial] = bufferSentStartedTime
  }

  bufferCommit(commitSerial: number) {
    this.commitSerial = commitSerial
  }

  destroy() {
    this.commitSerial = undefined
    encoderSurfaceFeedbacks = encoderSurfaceFeedbacks.filter(
      (encoderSurfaceFeedback) => encoderSurfaceFeedback !== this,
    )
  }

  frameProcessed(processedTime: number): void {
    if (this.encoderApi === undefined) {
      return
    }
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

    const duration = processedTime - bufferSentStartedTime
    const refreshAlignedDuration = (Math.ceil(duration / refreshInterval) * refreshInterval) >> 0
    this.durations.push({ duration, refreshAlignedDuration })
    if (this.durations.length > this.nFrames) {
      this.durations.shift()
    }

    const durationsSum = this.durations.reduce(
      (prev, cur) => ({
        duration: prev.duration + cur.duration,
        refreshAlignedDuration: prev.refreshAlignedDuration + cur.refreshAlignedDuration,
      }),
      { duration: 0, refreshAlignedDuration: 0 },
    )
    const durationAvg = durationsSum.duration / this.durations.length
    const refreshAlignedDurationAvg = durationsSum.refreshAlignedDuration / this.durations.length

    if (refreshAlignedDurationAvg === this.previousRefreshAlignedDurationAvg) {
      return
    }

    if (Math.abs(refreshAlignedDurationAvg - this.previousRefreshAlignedDurationAvg) >= refreshInterval) {
      this.previousRefreshAlignedDurationAvg = refreshAlignedDurationAvg
      this.encoderApi.feedback({
        clientId: this.clientId,
        surfaceId: this.surfaceId,
        inlineObject1: {
          duration: durationAvg,
        },
      })
    }
  }

  refreshInterval(refreshInterval: number) {
    // TODO send refresh interval to host
  }
}
