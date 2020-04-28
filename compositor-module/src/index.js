// Copyright 2019 Erik De Rijcke
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

import AxisEvent from './AxisEvent'
import ButtonEvent from './ButtonEvent'
import KeyEvent from './KeyEvent'

export { init as initWasm } from './lib'
export { default as Session } from './Session'
export { default as WebAppLauncher } from './WebAppLauncher'
export { default as RemoteAppLauncher } from './RemoteAppLauncher'
export { default as WebAppSocket } from './WebAppSocket'
export { default as RemoteSocket } from './RemoteSocket'
export { default as ButtonEvent } from './ButtonEvent'
export { default as AxisEvent } from './AxisEvent'
export { default as KeyEvent } from './KeyEvent'

/**
 * @param {MouseEvent}mouseEvent
 * @param {boolean}released
 * @param {string}sceneId
 * @return {ButtonEvent}
 */
export const createButtonEventFromMouseEvent = (mouseEvent, released, sceneId) => ButtonEvent.fromMouseEvent(mouseEvent, released, sceneId)

/**
 * @param {WheelEvent}wheelEvent
 * @param {string}sceneId
 * @return {AxisEvent}
 */
export const createAxisEventFromWheelEvent = (wheelEvent, sceneId) => AxisEvent.fromWheelEvent(wheelEvent, sceneId)

/**
 * @param {KeyboardEvent}keyboardEvent
 * @param {boolean}down
 * @return {KeyEvent}
 */
export const createKeyEventFromKeyboardEvent = (keyboardEvent, down) => KeyEvent.fromKeyboardEvent(keyboardEvent, down)
