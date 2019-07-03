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

class AppLauncherEntry {
  /**
   * @param {string}id
   * @param {string}title
   * @param {URL}icon
   * @param {URL}app
   * @param {'web'|'remote'}type
   */
  constructor (id, title, icon, app, type) {
    /**
     * @type {string}
     */
    this.id = id
    /**
     * @type {string}
     */
    this.title = title
    /**
     * @type {URL}
     */
    this.icon = icon
    /**
     * @type {URL}
     */
    this.app = app
    /**
     * @type {"web"|"remote"}
     */
    this.type = type
    /**
     * @type {?Client}
     * @private
     */
    this._client = null
    /**
     * @type {Array<function():void>}
     */
    this.clientListeners = []
  }

  /**
   * @param {Client}client
   */
  set client (client) {
    this._client = client
    this.clientListeners.forEach(listener => listener())
  }

  /**
   * @return {?Client}
   */
  get client () {
    return this._client
  }
}

export default AppLauncherEntry
