// Copyright 2020 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import Surface from './Surface'

export default class Callback {
  static create(surface: Surface): Callback {
    return new Callback(surface)
  }

  private constructor(public surface: Surface) {}

  done(time: number): void {
    const duration = (performance.now() - this.surface.encoderFeedback.commitTime) << 0
    this.surface.encoderFeedback.durations.push(duration)
    if (this.surface.encoderFeedback.durations.length > 3) {
      this.surface.encoderFeedback.durations.shift()
    }

    const refreshInterval = (time - this.surface.encoderFeedback.presentationTime) << 0

    const durationSum = this.surface.encoderFeedback.durations.reduce((prev, cur) => prev + cur, 0)
    const durationAvg = durationSum / this.surface.encoderFeedback.durations.length

    const refreshFrameDelay = (this.surface.encoderFeedback.durationAvg / refreshInterval + 1) << 0
    const newRefreshFrameDelay = (durationAvg / refreshInterval + 1) << 0

    if (refreshFrameDelay - newRefreshFrameDelay) {
      this.surface.encoderFeedback.durationAvg = durationAvg

      this.surface.resource.client.userData.encoderApi.feedback({
        clientId: this.surface.resource.client.id,
        surfaceId: this.surface.resource.id,
        inlineObject1: {
          duration: newRefreshFrameDelay * refreshInterval,
          refreshInterval,
        },
      })
    }
    this.surface.encoderFeedback.presentationTime = time
  }
}
