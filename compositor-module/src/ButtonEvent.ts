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

export interface ButtonEvent {
  x: number,
  y: number,
  timestamp: number,
  buttonCode: 0 | 1 | 2 | 3 | 4,
  released: boolean,
  buttons: number,
  sceneId: string
}

export interface CreateButtonEvent {
  (x: number,
   y: number,
   timestamp: number,
   buttonCode: 0 | 1 | 2 | 3 | 4,
   released: boolean,
   buttons: number,
   sceneId: string): ButtonEvent
}

export interface CreateButtonEventFromMouseEvent {
  (mouseEvent: MouseEvent,
   released: boolean,
   sceneId: string
  ): ButtonEvent
}

export const createButtonEvent: CreateButtonEvent = (
  x: number,
  y: number,
  timestamp: number,
  buttonCode: 0 | 1 | 2 | 3 | 4,
  released: boolean,
  buttons: number,
  sceneId: string
): ButtonEvent => ({ x, y, timestamp, buttonCode, released, buttons, sceneId })

export const createButtonEventFromMouseEvent: CreateButtonEventFromMouseEvent = (
  mouseEvent: MouseEvent,
  released: boolean,
  sceneId: string
): ButtonEvent => {
  const currentTarget = mouseEvent.currentTarget as HTMLElement
  const { left: targetX, top: targetY } = currentTarget.getBoundingClientRect()
  const button = mouseEvent.button as 0 | 1 | 2 | 3 | 4

  return createButtonEvent(
    mouseEvent.clientX - targetX,
    mouseEvent.clientY - targetY,
    mouseEvent.timeStamp,
    button,
    released,
    mouseEvent.buttons,
    sceneId
  )
}
