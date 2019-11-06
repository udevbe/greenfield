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

/**
 * Implementations are expected to extend this class.
 * @interface
 */
export default class UserShellSurface {
  /**
   * The title of the surface
   * @param {string} title
   */
  set title (title) {}

  /**
   * The id of the application. Can be used to group surfaces.
   * @param {string}appId
   */
  set appId (appId) {}

  /**
   * Indicates if the surface contents can be displayed on screen.
   * @param {boolean}mapped
   */
  set mapped (mapped) {}

  /**
   * Indicates if the application is responding.
   * @param {boolean}unresponsive
   */
  set unresponsive (unresponsive) {}

  /**
   * Registers a callback that will be fired when the user shell wants to make a surface active (ie give it input)
   * @param {function}activeCallback
   */
  set onActivationRequest (activeCallback) {}

  /**
   * Registers callback that notifies if a surface is no longer active (ie no longer receives input)
   * @param {function}inactivateCallback
   */
  set onInactive (inactivateCallback) {}

  /**
   * Confirms that the user shell can give the surface input.
   */
  activation () {}

  /**
   * Notifies the user shell that the surface should no longer be displayed. If the surface is still mapped then the
   * surface contents can still be displayed ie in a live updating tile.
   */
  minimize () {}
}
