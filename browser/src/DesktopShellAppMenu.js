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
    const divElementAppMenuAppsContainer = this._createDivElementAppMenuAppsContainer()

    divElementAppMenuContainer.appendChild(divElementAppMenu)
    const searchBar = this._createSearchBar(divElementAppMenuContainer)
    divElementAppMenu.appendChild(searchBar.divElementSearchContainer)
    divElementAppMenu.appendChild(divElementAppMenuAppsContainer)

    const desktopShellAppMenu = new DesktopShellAppMenu(divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar, divElementAppMenuAppsContainer, browserSession)

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

  static _createDivElementAppMenuAppsContainer () {
    const divElementAppsContainer = document.createElement('div')
    divElementAppsContainer.classList.add('app-menu-item-container')
    return divElementAppsContainer
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
            desktopShellAppMenuItem.divElementItem.scrollIntoView({block: 'end', behavior: 'smooth'})
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
   * @param {BrowserSession}browserSession
   */
  constructor (divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar, divElementAppMenuAppsContainer, browserSession) {
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
     * @type {BrowserSession}
     * @private
     */
    this._browserSession = browserSession
    /**
     * @type {window.WebSocket}
     * @private
     */
    this._ws = null
    /**
     * @type {DesktopShellAppMenuItem[]}
     * @private
     */
    this._desktopShellAppMenuItems = []
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
    ws.onerror = () => {
      console.error(`Apps web socket is in error.`)
    }

    ws.onclose = (event) => {
      console.log(`Apps web socket is closed: ${event.code}: ${event.reason}`)
    }

    ws.onopen = () => {
      console.log('Apps web socket is open.')
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
      try {
        const message = JSON.parse(event.data)
        const action = message.action
        this[action](message.data)
      } catch (error) {
        console.trace(`Apps web socket failed to handle incoming message: $${JSON.stringify(event)}\n${event.message}\n${error.stack}`)
        this._ws.close(4007, 'Apps web socket received an illegal message')
      }
    }

    window.unload = () => {
      ws.close(1000, 'User closed tab.')
    }
  }

  /**
   * Dynamically called by ws.onmessage, as specified by the action property in the received message.
   * @param {{ executable:string, name: string, description: string, icon: string }[]}appsList
   * @private
   */
  _query (appsList) {
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
