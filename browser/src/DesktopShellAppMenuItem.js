'use strict'

export default class DesktopShellAppMenuItem {
  /**
   * @param {window.WebSocket}ws
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
    return new DesktopShellAppMenuItem(divElementItem)
  }

  /**
   * @return {HTMLDivElement}
   * @private
   */
  static _createDivElementItem (description) {
    const divElementItem = document.createElement('div')
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
    const imageElementIcon = new window.Image()
    imageElementIcon.src = iconUrl

    return imageElementIcon
  }

  static _createDivElementName (name) {
    const divElementName = document.createElement('div')
    divElementName.classList.add('name')
    divElementName.textContent = name

    return divElementName
  }

  /**
   * @param {window.WebSocket}ws
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
   */
  constructor (divElementItem) {
    this.divElementItem = divElementItem
  }
}
