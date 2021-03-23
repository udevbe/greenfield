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

export interface AxisEvent {
  deltaMode: number
  DOM_DELTA_LINE: number
  DOM_DELTA_PAGE: number
  DOM_DELTA_PIXEL: number
  deltaX: number
  deltaY: number
  timestamp: number
  sceneId: string
}

export interface CreateAxisEvent {
  (
    deltaMode: number,
    DOM_DELTA_LINE: number,
    DOM_DELTA_PAGE: number,
    DOM_DELTA_PIXEL: number,
    deltaX: number,
    deltaY: number,
    timestamp: number,
    sceneId: string,
  ): AxisEvent
}

export const createAxisEvent: CreateAxisEvent = (
  deltaMode: number,
  DOM_DELTA_LINE: number,
  DOM_DELTA_PAGE: number,
  DOM_DELTA_PIXEL: number,
  deltaX: number,
  deltaY: number,
  timestamp: number,
  sceneId: string,
): AxisEvent => ({
  deltaMode,
  DOM_DELTA_LINE,
  DOM_DELTA_PAGE,
  DOM_DELTA_PIXEL,
  deltaX,
  deltaY,
  timestamp,
  sceneId,
})

export interface CreateAxisEventFromWheelEvent {
  (wheelEvent: WheelEvent, sceneId: string): AxisEvent
}

export const createAxisEventFromWheelEvent: CreateAxisEventFromWheelEvent = (wheelEvent: WheelEvent, sceneId: string) =>
  createAxisEvent(
    wheelEvent.deltaMode,
    wheelEvent.DOM_DELTA_LINE,
    wheelEvent.DOM_DELTA_PAGE,
    wheelEvent.DOM_DELTA_PIXEL,
    wheelEvent.deltaX,
    wheelEvent.deltaY,
    wheelEvent.timeStamp,
    sceneId,
  )
