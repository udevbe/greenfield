'use strict'

import DesktopShellAppMenuItem from './DesktopShellAppMenuItem'

export default class DesktopShellAppMenu {
  /**
   * @param {BrowserSession}browserSession
   * @return {DesktopShellAppMenu}
   */
  static create (browserSession) {
    const divElementAppMenuButton = this._createDivElementAppMenuButton()
    const divElementAppMenuContainer = this._createDivElementAppMenuContainer()
    const divElementAppMenu = this._createDivElementAppMenu()
    divElementAppMenuContainer.appendChild(divElementAppMenu)
    const searchBar = this._createSearchBar(divElementAppMenuContainer)
    divElementAppMenu.appendChild(searchBar.divElementSearchContainer)

    const desktopShellAppMenu = new DesktopShellAppMenu(divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar, browserSession)

    // event listeners
    this._addEventListeners(desktopShellAppMenu)
    desktopShellAppMenu._setupWebsocketConnection(browserSession)

    return desktopShellAppMenu
  }

  static _createDivElementAppMenuButton () {
    const divElementMenuButton = document.createElement('div')
    divElementMenuButton.classList.add('menu-button')
    divElementMenuButton.classList.add('apps')
    return divElementMenuButton
  }

  static _createDivElementAppMenuContainer () {
    const divElementMenuContainer = document.createElement('div')
    divElementMenuContainer.classList.add('menu-container')
    divElementMenuContainer.classList.add('apps')
    window.document.body.appendChild(divElementMenuContainer)

    const divElementMenuTriangleUp = document.createElement('div')
    divElementMenuTriangleUp.classList.add('menu-triangle-up')
    divElementMenuTriangleUp.classList.add('apps')
    divElementMenuContainer.appendChild(divElementMenuTriangleUp)

    return divElementMenuContainer
  }

  static _createDivElementAppMenu () {
    const divElementMenu = document.createElement('div')
    divElementMenu.classList.add('menu')
    divElementMenu.classList.add('apps')
    return divElementMenu
  }

  /**
   * @param {HTMLDivElement}divElementAppMenuContainer
   * @return {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}
   * @private
   */
  static _createSearchBar (divElementAppMenuContainer) {
    const divElementSearchContainer = document.createElement('div')
    const divElementSearchIcon = document.createElement('div')
    const inputElementSearchInput = document.createElement('input')

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
      if (event.target !== desktopShellAppMenu.divElementAppMenu && event.target !== desktopShellAppMenu.divElementAppMenuButton) {
        desktopShellAppMenu.hideMenu()
      }
    })
  }

  /**
   * @param {HTMLDivElement}divElementAppMenuButton
   * @param {HTMLDivElement}divElementAppMenuContainer
   * @param {HTMLDivElement}divElementAppMenu
   * @param {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}searchBar
   * @param {BrowserSession}browserSession
   */
  constructor (divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar, browserSession) {
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
     * @type {BrowserSession}
     * @private
     */
    this._browserSession = browserSession
    /**
     * @type {window.WebSocket}
     * @private
     */
    this._ws = null
  }

  /**
   * @param {BrowserSession}browserSession
   * @private
   */
  _setupWebsocketConnection (browserSession) {
    const sessionId = browserSession.sessionId
    const websocketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${websocketProtocol}://${window.location.host}/${sessionId}/apps`

    const ws = new window.WebSocket(url)
    ws.onerror = (event) => {
      if (ws.readyState === window.WebSocket.CONNECTING) {
        // TODO log error?
      }
    }

    ws.onopen = () => {
      this._setupWebsocket(ws)
      ws.send(JSON.stringify({
        action: '_query',
        data: ''
      }))
    }
    this._ws = ws
  }

  _setupWebsocket (ws) {
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      const action = message.action
      this[action](message.data)
    }

    window.unload = () => {
      ws.onclose = function () {} // disable onclose handler first
      ws.close(1000, 'User closed tab.')
    }
  }

  /**
   * @param {{ executable:string, name: string, description: string, icon: string }[]}appsList
   * @private
   */
  _query (appsList) {
    appsList.forEach((appDescription) => {
      const executable = appDescription.executable
      const name = appDescription.name
      const description = appDescription.description
      const iconPath = appDescription.icon
      const iconUrl = `${window.location.protocol}/${iconPath}`

      const desktopShellAppMenuItem = DesktopShellAppMenuItem.create(this._ws, executable, iconUrl, name, description)
      this.divElementAppMenu.appendChild(desktopShellAppMenuItem.divElementItem)
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
