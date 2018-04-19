'use strict'

export default class DesktopShellMenu {
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

  static _createDivElementMenuButton () {
    const divElementMenuButton = document.createElement('div')
    divElementMenuButton.classList.add('menu-button')
    divElementMenuButton.classList.add('config')
    return divElementMenuButton
  }

  static _createDivElementMenuContainer () {
    const divElementMenuContainer = document.createElement('div')
    divElementMenuContainer.classList.add('menu-container')
    divElementMenuContainer.classList.add('config')
    window.document.body.appendChild(divElementMenuContainer)

    const divElementMenuTriangleUp = document.createElement('div')
    divElementMenuTriangleUp.classList.add('menu-triangle-up')
    divElementMenuTriangleUp.classList.add('config')
    divElementMenuContainer.appendChild(divElementMenuTriangleUp)

    return divElementMenuContainer
  }

  static _createDivElementMenu () {
    const divElementMenu = document.createElement('div')
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
