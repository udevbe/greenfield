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

export enum ButtonCode {
  /**
   * Main button pressed, usually the left button or the un-initialized state
   */
  MAIN,
  /**
   * Auxiliary button pressed, usually the wheel button or the middle button (if present)
   */
  AUX,
  /**
   * Auxiliary button pressed, usually the wheel button or the middle button (if present)
   */
  SECONDARY,
  /**
   * Fourth button, typically the Browser Back button
   */
  FOURTH,
  /**
   * Fifth button, typically the Browser Forward button
   */
  FIFTH,
}

export type ButtonEvent = {
  readonly x: number
  readonly y: number
  readonly timestamp: number
  readonly buttonCode: ButtonCode
  readonly released: boolean
  readonly buttons: number
  readonly sceneId: string
}

export function createButtonEventFromMouseEvent(
  mouseEvent: MouseEvent,
  released: boolean,
  sceneId: string,
  maxX: number,
  maxY: number,
): ButtonEvent {
  const buttonCode = mouseEvent.button as 0 | 1 | 2 | 3 | 4

  const targetX = mouseEvent.offsetX
  const targetY = mouseEvent.offsetY
  const x = targetX > maxX ? maxX : targetX < 0 ? 0 : targetX
  const y = targetY > maxY ? maxY : targetY < 0 ? 0 : targetY

  return { x, y, timestamp: mouseEvent.timeStamp, buttonCode, released, buttons: mouseEvent.buttons, sceneId }
}
