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

'use strict'

import UserShellSurface from './UserShellSurface'

/**
 * Singleton.
 * Custom user shell implementations are expected to implement this singleton's methods.
 */
class UserShell {
  /**
   * Ask the user shell to start managing the given surface.
   * @param {Surface}surface
   * @param {function}activeCallback  Registers a callback that will be fired when the user shell wants to make a surface active (ie give it input)
   * @param {function}inactivateCallback Registers callback that notifies if a surface is no longer active (ie no longer receives input)
   * @return {UserShellSurface}
   */
  manage (surface, activeCallback, inactivateCallback) { return UserShellSurface() }

  /**
   * Notify the user of an important event.
   *
   * @param {'success'|'warning'|'error'|'info'}variant
   * @param {string}message
   */
  notify (variant, message) { window.alert(`${variant}: ${message}`) }
}

export default new UserShell()
