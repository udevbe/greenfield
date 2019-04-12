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

import DesktopUserShellSurface from './DesktopUserShellSurface'

import './desktopshell.css'

/**
 * @implements UserShell
 */
export default class DesktopUserShell {
  /**
   * @param {Seat}seat
   * @return {DesktopUserShell}
   */
  static create (seat) {
    const body = document.body
    const workspace = /** @type {HTMLDivElement} */document.createElement('div')
    workspace.setAttribute('id', 'workspace')
    body.appendChild(workspace)

    const panel = /** @type {HTMLDivElement} */document.createElement('div')
    panel.classList.add('hpanel')
    body.insertAdjacentElement('afterbegin', panel)

    const entryContainer = /** @type {HTMLDivElement} */document.createElement('div')
    entryContainer.classList.add('entry-container')
    panel.appendChild(entryContainer)
    return new DesktopUserShell(body, workspace, panel, entryContainer, seat)
  }

  /**
   * Use DesktopShell.create(..)
   * @param {HTMLElement}body
   * @param {HTMLElement}workspace
   * @param {HTMLDivElement}panel
   * @param {HTMLDivElement}entryContainer
   * @param {Seat}seat
   * @private
   */
  constructor (body, workspace, panel, entryContainer, seat) {
    /**
     * @type{HTMLElement}
     */
    this.body = body
    /**
     * @type{HTMLElement}
     */
    this.workspace = workspace
    /**
     * @type{HTMLDivElement}
     */
    this.panel = panel
    /**
     * @type{HTMLDivElement}
     */
    this.entryContainer = entryContainer
    /**
     * @type {Seat}
     * @private
     */
    this._seat = seat
  }

  /**
   * @param {Surface}surface
   * @return {UserShellSurface}
   * @override
   */
  manage (surface) {
    const desktopShellEntry = DesktopUserShellSurface.create(surface, this._seat)
    this.entryContainer.appendChild(desktopShellEntry.divElement)
    return desktopShellEntry
  }
}
