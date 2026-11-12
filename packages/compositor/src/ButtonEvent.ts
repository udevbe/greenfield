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
  canvas: HTMLCanvasElement,
): ButtonEvent {
  const buttonCode = mouseEvent.button as 0 | 1 | 2 | 3 | 4

  const maxX = canvas.width
  const maxY = canvas.height
  const bounds = canvas.getBoundingClientRect()
  const style = getComputedStyle(canvas)
  const leftInset = Number.parseFloat(style.borderLeftWidth) + Number.parseFloat(style.paddingLeft)
  const rightInset = Number.parseFloat(style.borderRightWidth) + Number.parseFloat(style.paddingRight)
  const topInset = Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.paddingTop)
  const bottomInset = Number.parseFloat(style.borderBottomWidth) + Number.parseFloat(style.paddingBottom)
  const width = Number.parseFloat(style.width) - (style.boxSizing === 'border-box' ? leftInset + rightInset : 0)
  const height = Number.parseFloat(style.height) - (style.boxSizing === 'border-box' ? topInset + bottomInset : 0)

  // Map viewport coordinates through the CSS content box to compositor pixels.
  const targetX =
    bounds.width > 0 && width > 0
      ? ((((mouseEvent.clientX - bounds.left) / bounds.width) * (width + leftInset + rightInset) - leftInset) * maxX) /
        width
      : 0
  const targetY =
    bounds.height > 0 && height > 0
      ? ((((mouseEvent.clientY - bounds.top) / bounds.height) * (height + topInset + bottomInset) - topInset) * maxY) /
        height
      : 0
  const x = targetX > maxX ? maxX : targetX < 0 ? 0 : targetX
  const y = targetY > maxY ? maxY : targetY < 0 ? 0 : targetY

  return { x, y, timestamp: mouseEvent.timeStamp, buttonCode, released, buttons: mouseEvent.buttons, sceneId }
}
