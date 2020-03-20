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

import { init as initWasm, isInitialized } from './lib'
import Session from './Session'
import WebAppLauncher from './WebAppLauncher'
import RemoteAppLauncher from './RemoteAppLauncher'
import WebAppSocket from './WebAppSocket'
import RemoteSocket from './RemoteSocket'
import Mat4 from './math/Mat4'
import ButtonEvent from './ButtonEvent'
import AxisEvent from './AxisEvent'
import KeyEvent from './KeyEvent'

/**
 * @param {MouseEvent}mouseEvent
 * @param {boolean}released
 * @param {string}sceneId
 * @return {ButtonEvent}
 */
const createButtonEventFromMouseEvent = (mouseEvent, released, sceneId) => ButtonEvent.fromMouseEvent(mouseEvent, released, sceneId)

/**
 * @param {WheelEvent}wheelEvent
 * @param {string}sceneId
 * @return {AxisEvent}
 */
const createAxisEventFromWheelEvent = (wheelEvent, sceneId) => AxisEvent.fromWheelEvent(wheelEvent, sceneId)

/**
 * @param {KeyboardEvent}keyboardEvent
 * @param {boolean}down
 * @return {KeyEvent}
 */
const createKeyEventFromKeyboardEvent = (keyboardEvent, down) => KeyEvent.fromKeyboardEvent(keyboardEvent, down)

export {
  initWasm,
  isInitialized,
  Session,
  WebAppLauncher,
  WebAppSocket,
  RemoteAppLauncher,
  RemoteSocket,
  Mat4,
  createButtonEventFromMouseEvent,
  createAxisEventFromWheelEvent,
  createKeyEventFromKeyboardEvent
}
