'use strict'

export default class DesktopShellAppMenu {
  static create () {
    const divElementAppMenuButton = this._createDivElementAppMenuButton()
    const divElementAppMenuContainer = this._createDivElementAppMenuContainer()
    const divElementAppMenu = this._createDivElementAppMenu()
    divElementAppMenuContainer.appendChild(divElementAppMenu)
    const searchBar = this._createSearchBar(divElementAppMenuContainer)
    divElementAppMenu.appendChild(searchBar.divElementSearchContainer)

    const desktopShellAppMenu = new DesktopShellAppMenu(divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar)

    // event listeners
    this._addEventListeners(desktopShellAppMenu)

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
        console.log(event.target)
        console.log(desktopShellAppMenu.divElementAppMenu)
        desktopShellAppMenu.hideMenu()
      }
    })
  }

  /**
   * @param {HTMLDivElement}divElementAppMenuButton
   * @param {HTMLDivElement}divElementAppMenuContainer
   * @param {HTMLDivElement}divElementAppMenu
   * @param {{divElementSearchContainer: HTMLDivElement, divElementSearchIcon: HTMLDivElement, inputElementSearchInput: HTMLInputElement}}searchBar
   */
  constructor (divElementAppMenuButton, divElementAppMenuContainer, divElementAppMenu, searchBar) {
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
    // this.divElementMenuContainer.style.zIndex = '-65535'
    this.divElementAppMenu.classList.remove('menu-active')
    this.divElementAppMenuButton.classList.remove('menu-button-active')
  }
}
