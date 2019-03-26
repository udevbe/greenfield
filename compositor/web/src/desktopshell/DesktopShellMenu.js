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

export default class DesktopShellMenu {
  /**
   * @return {DesktopShellMenu}
   */
  static create () {
    const divElementMenuButton = this._createDivElementMenuButton()
    const divElementMenuContainer = this._createDivElementMenuContainer()
    const divElementMenu = this._createDivElementMenu()
    divElementMenuContainer.appendChild(divElementMenu)
    const searchBar = this._createSearchBar(divElementMenuContainer)
    divElementMenu.appendChild(searchBar.divElementSearchContainer)

    const desktopShellMenu = new DesktopShellMenu(divElementMenuButton, divElementMenuContainer, divElementMenu, searchBar)

    // event listeners
    this._addEventListeners(desktopShellMenu)

    return desktopShellMenu
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementMenuButton () {
    const divElementMenuButton = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenuButton.classList.add('menu-button')
    divElementMenuButton.classList.add('config')
    return divElementMenuButton
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementMenuContainer () {
    const divElementMenuContainer = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenuContainer.classList.add('menu-container')
    divElementMenuContainer.classList.add('config')
    window.document.body.appendChild(divElementMenuContainer)

    const divElementMenuTriangleUp = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenuTriangleUp.classList.add('menu-triangle-up')
    divElementMenuTriangleUp.classList.add('config')
    divElementMenuContainer.appendChild(divElementMenuTriangleUp)

    return divElementMenuContainer
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementMenu () {
    const divElementMenu = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenu.classList.add('menu')
    divElementMenu.classList.add('config')
    return divElementMenu
  }

  /**
   * @param {HTMLDivElement}divElementMenuContainer
   * @return {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}
   * @private
   */
  static _createSearchBar (divElementMenuContainer) {
    const divElementSearchContainer = /** @type {HTMLDivElement} */document.createElement('div')
    const divElementSearchIcon = /** @type {HTMLDivElement} */document.createElement('div')
    const inputElementSearchInput = /** @type {HTMLInputElement} */document.createElement('input')

    inputElementSearchInput.setAttribute('type', 'text')
    inputElementSearchInput.setAttribute('name', 'search')
    inputElementSearchInput.setAttribute('placeholder', '...')

    divElementSearchContainer.appendChild(divElementSearchIcon)
    divElementSearchContainer.appendChild(inputElementSearchInput)

    divElementSearchContainer.classList.add('search-container')
    divElementSearchIcon.classList.add('search-icon')
    inputElementSearchInput.classList.add('search-input')

    return {
      divElementSearchContainer: divElementSearchContainer,
      divElementSearchIcon: divElementSearchIcon,
      inputElementSearchInput: inputElementSearchInput
    }
  }

  /**
   * @param {DesktopShellMenu}desktopShellMenu
   * @private
   */
  static _addEventListeners (desktopShellMenu) {
    desktopShellMenu.divElementMenuButton.addEventListener('mousedown', () => {
      desktopShellMenu.showMenu()
    })
    window.document.addEventListener('mousedown', (event) => {
      if (event.target !== desktopShellMenu.divElementMenu && event.target !== desktopShellMenu.divElementMenuButton) {
        desktopShellMenu.hideMenu()
      }
    })
    desktopShellMenu.searchBar.inputElementSearchInput.addEventListener('input', (inputEvent) => {
      const searchText = inputEvent.data
      // TODO scroll matching menu item into view
    })
  }

  /**
   * @param {HTMLDivElement}divElementMenuButton
   * @param {HTMLDivElement}divElementMenuContainer
   * @param {HTMLDivElement}divElementMenu
   * @param {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}searchBar
   */
  constructor (divElementMenuButton, divElementMenuContainer, divElementMenu, searchBar) {
    /**
     * @type {HTMLDivElement}
     */
    this.divElementMenuButton = divElementMenuButton
    /**
     * @type {HTMLDivElement}
     */
    this.divElementMenuContainer = divElementMenuContainer
    /**
     * @type {HTMLDivElement}
     */
    this.divElementMenu = divElementMenu
    /**
     * @type {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}
     */
    this.searchBar = searchBar
  }

  showMenu () {
    this.divElementMenuContainer.addEventListener('transitionend', () => {
      this.searchBar.inputElementSearchInput.classList.add('enable-default')
      this.searchBar.inputElementSearchInput.focus()
    })

    this.divElementMenuContainer.style.visibility = 'visible'
    this.divElementMenu.classList.add('menu-active')
    this.divElementMenuButton.classList.add('menu-button-active')
  }

  hideMenu () {
    this.searchBar.inputElementSearchInput.blur()
    this.searchBar.inputElementSearchInput.classList.remove('enable-default')
    this.searchBar.inputElementSearchInput.value = ''

    this.divElementMenuContainer.style.visibility = 'hidden'
    this.divElementMenu.classList.remove('menu-active')
    this.divElementMenuButton.classList.remove('menu-button-active')
  }
}
