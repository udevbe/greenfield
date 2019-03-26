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

export default class DesktopShellAppMenuItem {
  /**
   * @param {WebSocket}ws
   * @param {string}executable
   * @param {string}iconUrl
   * @param {string}name
   * @param {string}description
   * @return {DesktopShellAppMenuItem}
   */
  static create (ws, executable, iconUrl, name, description) {
    const divElementItem = this._createDivElementItem(description)
    const imageElementIcon = this._createImageElementIcon(iconUrl)
    const divElementName = this._createDivElementName(name)
    divElementItem.appendChild(imageElementIcon)
    divElementItem.appendChild(divElementName)

    this._setupEventHandlers(ws, divElementItem, executable)
    return new DesktopShellAppMenuItem(divElementItem, name)
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementItem (description) {
    const divElementItem = /** @type {HTMLDivElement} */document.createElement('div')
    divElementItem.setAttribute('title', description)
    divElementItem.classList.add('app-menu-item')

    return divElementItem
  }

  /**
   * @param {string}iconUrl
   * @return {HTMLImageElement}
   * @private
   */
  static _createImageElementIcon (iconUrl) {
    const imageElementIcon = new Image()
    imageElementIcon.src = iconUrl

    return imageElementIcon
  }

  /**
   * @param {string}name
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementName (name) {
    const divElementName = /** @type {HTMLDivElement} */document.createElement('div')
    divElementName.classList.add('name')
    divElementName.textContent = name

    return divElementName
  }

  /**
   * @param {WebSocket}ws
   * @param {HTMLDivElement}itemDiv
   * @param {string}executable
   * @private
   */
  static _setupEventHandlers (ws, itemDiv, executable) {
    itemDiv.addEventListener('mousedown', () => {
      ws.send(JSON.stringify({
        action: '_launch',
        data: executable
      }))
    })
  }

  /**
   * @param {HTMLDivElement}divElementItem
   * @param {string}name
   */
  constructor (divElementItem, name) {
    /**
     * @type {HTMLDivElement}
     */
    this.divElementItem = divElementItem
    /**
     * @type {string}
     */
    this.name = name
  }
}
