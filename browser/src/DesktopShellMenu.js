'use strict'

export default class DesktopShellMenu {
  static create () {
    const divElementMenuButton = document.createElement('div')
    divElementMenuButton.classList.add('menu-button')

    const divElementMenuContainer = document.createElement('div')
    divElementMenuContainer.classList.add('menu-container')
    divElementMenuContainer.style.visibility = 'hidden'
    divElementMenuContainer.style.zIndex = '-65535'

    window.document.body.appendChild(divElementMenuContainer)

    const divElementMenu = document.createElement('div')
    divElementMenu.classList.add('menu')
    divElementMenuContainer.appendChild(divElementMenu)

    const desktopShellMenu = new DesktopShellMenu(divElementMenuButton)

    divElementMenuButton.addEventListener('click', () => {
      divElementMenuContainer.style.visibility = 'visible'
      divElementMenuContainer.style.zIndex = '65535'
      divElementMenu.classList.add('menu-active')
      divElementMenuButton.classList.add('menu-button-active')
    })

    divElementMenuContainer.addEventListener('click', (event) => {
      if (event.target === divElementMenuContainer) {
        divElementMenuContainer.style.visibility = 'hidden'
        divElementMenuContainer.style.zIndex = '-65535'

        divElementMenu.classList.remove('menu-active')
        divElementMenuButton.classList.remove('menu-button-active')
      }
    })

    return desktopShellMenu
  }

  /**
   * @param {HTMLDivElement}divElement
   */
  constructor (divElement) {
    /**
     * @type {HTMLDivElement}
     */
    this.divElement = divElement
  }
}
