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
 * Singleton.
 * Custom user shell implementations are expected to implement this singleton's event functions.
 */
const UserShellApi = {
  /**
   * @typedef {{title:string, appId:string, mapped:boolean, active: boolean, unresponsive: boolean, minimized: boolean}}UserSurfaceState
   */
  events: {
    /**
     * Ask the user shell to start managing the given surface.
     * @param {Surface}surface
     * @param {UserSurfaceState}state
     */
    manage: (surface, state) => {},

    /**
     * Notify the user of an important event.
     *
     * @param {'success'|'warning'|'error'|'info'}variant
     * @param {string}message
     */
    notify: (variant, message) => {},

    /**
     * @param {Surface}surface
     * @param {UserSurfaceState}state
     */
    updateUserSurfaceState: (surface, state) => {}
  },

  actions: {
    /**
     * Request the surface to be made active. An active surface will have a different visual clue ie brighter than
     * an inactive surface. An active surface can receive user input after it has confirmed it's active state.
     * @param {Surface}surface
     */
    requestActivate: surface => surface.role.requestActivate(),

    /**
     * Notify a surface that it will no longer receive user input. An inactive surface can update it's visual clue
     * to reflect it's inactive state.
     * @param {Surface}surface
     */
    notifyInactive: surface => surface.role.notifyInactive()
  }
}

export default UserShellApi
