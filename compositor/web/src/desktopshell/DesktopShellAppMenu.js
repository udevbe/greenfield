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

import DesktopShellAppMenuItem from './DesktopShellAppMenuItem'

export default class DesktopShellAppMenu {
  /**
   * @param {Session}session
   * @return {DesktopShellAppMenu}
   */
  static create (session) {
    const divElementAppMenuButton = this._createDivElementAppMenuButton()
    const divElementAppMenuContainer = this._createDivElementAppMenuContainer()
    const divElementAppMenu = this._createDivElementAppMenu()
    const divElementAppMenuAppsContainer = this._createDivElementAppMenuAppsContainer()

    divElementAppMenuContainer.appendChild(divElementAppMenu)
    const searchBar = this._createSearchBar(divElementAppMenuContainer)
    divElementAppMenu.appendChild(searchBar.divElementSearchContainer)
    divElementAppMenu.appendChild(divElementAppMenuAppsContainer)

    const desktopShellAppMenu = new DesktopShellAppMenu(divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar, divElementAppMenuAppsContainer, session)

    // event listeners
    this._addEventListeners(desktopShellAppMenu)

    session.messageHandlers['desktopShell'] = desktopShellAppMenu
    session.webSocket.send(JSON.stringify({
      object: 'desktopShell',
      method: 'queryLaunchers',
      args: {}
    }))

    return desktopShellAppMenu
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementAppMenuButton () {
    const divElementMenuButton = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenuButton.classList.add('menu-button')
    divElementMenuButton.classList.add('apps')
    return divElementMenuButton
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementAppMenuContainer () {
    const divElementMenuContainer = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenuContainer.classList.add('menu-container')
    divElementMenuContainer.classList.add('apps')
    window.document.body.appendChild(divElementMenuContainer)

    const divElementMenuTriangleUp = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenuTriangleUp.classList.add('menu-triangle-up')
    divElementMenuTriangleUp.classList.add('apps')
    divElementMenuContainer.appendChild(divElementMenuTriangleUp)

    return divElementMenuContainer
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementAppMenu () {
    const divElementMenu = /** @type {HTMLDivElement} */document.createElement('div')
    divElementMenu.classList.add('menu')
    divElementMenu.classList.add('apps')
    return divElementMenu
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementAppMenuAppsContainer () {
    const divElementAppsContainer = /** @type {HTMLDivElement} */document.createElement('div')
    divElementAppsContainer.classList.add('app-menu-item-container')
    return divElementAppsContainer
  }

  /**
   * @param {HTMLDivElement}divElementAppMenuContainer
   * @return {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}
   * @private
   */
  static _createSearchBar (divElementAppMenuContainer) {
    const divElementSearchContainer = /** @type {HTMLDivElement} */document.createElement('div')
    const divElementSearchIcon = /** @type {HTMLDivElement} */ document.createElement('div')
    const inputElementSearchInput = /** @type {HTMLDivElement} */document.createElement('input')

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
   * @param {DesktopShellAppMenu}desktopShellAppMenu
   * @private
   */
  static _addEventListeners (desktopShellAppMenu) {
    desktopShellAppMenu.divElementAppMenuButton.addEventListener('mousedown', () => {
      desktopShellAppMenu.showMenu()
    })
    window.document.addEventListener('mousedown', (event) => {
      // FIXME Find a better way.
      if (event.target !== desktopShellAppMenu.divElementAppMenu &&
        event.target !== desktopShellAppMenu.divElementAppMenuButton &&
        event.target !== desktopShellAppMenu.searchBar.inputElementSearchInput &&
        event.target !== desktopShellAppMenu.searchBar.divElementSearchContainer &&
        event.target !== desktopShellAppMenu.searchBar.divElementSearchIcon) {
        desktopShellAppMenu.hideMenu()
      }
    })
    desktopShellAppMenu.searchBar.inputElementSearchInput.addEventListener('input', () => {
      const searchText = desktopShellAppMenu.searchBar.inputElementSearchInput.value
      desktopShellAppMenu._desktopShellAppMenuItems.forEach((desktopShellAppMenuItem) => {
        desktopShellAppMenuItem.divElementItem.classList.remove('search-match')
      })
      if (searchText) {
        for (const desktopShellAppMenuItem of desktopShellAppMenu._desktopShellAppMenuItems) {
          const candidateString = `${desktopShellAppMenuItem.name}`
          if (candidateString.toLowerCase().includes(searchText.toLowerCase())) {
            desktopShellAppMenuItem.divElementItem.classList.add('search-match')
            desktopShellAppMenuItem.divElementItem.scrollIntoView({ block: 'end', behavior: 'smooth' })
            break
          }
        }
      }
      // TODO let enter launch found application
      // TODO let escape close the menu
    })
  }

  /**
   * @param {HTMLDivElement}divElementAppMenuButton
   * @param {HTMLDivElement}divElementAppMenuContainer
   * @param {HTMLDivElement}divElementAppMenu
   * @param {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}searchBar
   * @param {HTMLDivElement}divElementAppMenuAppsContainer
   * @param {Session}session
   */
  constructor (divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar, divElementAppMenuAppsContainer, session) {
    /**
     * @type {HTMLDivElement}
     */
    this.divElementAppMenuButton = divElementAppMenuButton
    /**
     * @type {HTMLDivElement}
     */
    this.divElementAppMenuContainer = divElementAppMenuContainer
    /**
     * @type {HTMLDivElement}
     */
    this.divElementAppMenu = divElementAppMenu
    /**
     * @type {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}
     */
    this.searchBar = searchBar
    /**
     * @type {HTMLDivElement}
     */
    this.divElementAppMenuAppsContainer = divElementAppMenuAppsContainer
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {DesktopShellAppMenuItem[]}
     * @private
     */
    this._desktopShellAppMenuItems = []
  }

  _onMessage (event) {
    try {
      const message = JSON.parse(event.data)
      const action = message.intent
      this[action](...message.arguments)
    } catch (error) {
      console.trace(`Apps web socket failed to handle incoming message: $${JSON.stringify(event)}\n${event.message}\n${error.stack}`)
    }
  }

  /**
   * Reply of queryLaunchers.
   * @param {Object} args
   */
  launchersList (args) {
    const {
      /** @type{Array<{ executable:string, name: string, description: string, icon: string }>} */
      appsList
    } = args
    this._desktopShellAppMenuItems.forEach((desktopShellAppMenuItem) => {
      if (desktopShellAppMenuItem.divElementItem.parentElement) {
        desktopShellAppMenuItem.divElementItem.parentElement.removeChild(desktopShellAppMenuItem.divElementItem)
      }
    })
    this._desktopShellAppMenuItems = []
    appsList.forEach((appDescription) => {
      const executable = appDescription.executable
      const name = appDescription.name
      const description = appDescription.description
      const iconPath = appDescription.icon
      const iconUrl = `${window.location.protocol}/${iconPath}`

      const desktopShellAppMenuItem = DesktopShellAppMenuItem.create(this._ws, executable, iconUrl, name, description)
      this._desktopShellAppMenuItems.push(desktopShellAppMenuItem)
      this.divElementAppMenuAppsContainer.appendChild(desktopShellAppMenuItem.divElementItem)
    })
  }

  showMenu () {
    this.divElementAppMenuContainer.addEventListener('transitionend', () => {
      this.searchBar.inputElementSearchInput.classList.add('enable-default')
      this.searchBar.inputElementSearchInput.focus()
    })

    this.divElementAppMenuContainer.style.visibility = 'visible'
    this.divElementAppMenu.classList.add('menu-active')
    this.divElementAppMenuButton.classList.add('menu-button-active')
  }

  hideMenu () {
    this.searchBar.inputElementSearchInput.blur()
    this.searchBar.inputElementSearchInput.classList.remove('enable-default')
    this.searchBar.inputElementSearchInput.value = ''

    this.divElementAppMenuContainer.style.visibility = 'hidden'
    this.divElementAppMenu.classList.remove('menu-active')
    this.divElementAppMenuButton.classList.remove('menu-button-active')
  }
}
