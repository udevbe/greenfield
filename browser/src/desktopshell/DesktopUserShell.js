'use strict'

import DesktopUserShellSurface from './DesktopUserShellSurface'
import DesktopShellMenu from './DesktopShellMenu'

import './desktopshell.css'
import DesktopShellAppMenu from './DesktopShellAppMenu'
import UserShell from '../UserShell'

export default class DesktopUserShell extends UserShell {
  /**
   * @param {BrowserSession}browserSession
   * @param {BrowserSeat}browserSeat
   * @return {DesktopUserShell}
   */
  static create (browserSession, browserSeat) {
    const body = document.body
    const workspace = document.getElementById('workspace')
    const panel = document.createElement('div')
    panel.classList.add('hpanel')
    body.insertAdjacentElement('afterbegin', panel)

    const entryContainer = document.createElement('div')
    entryContainer.classList.add('entry-container')
    panel.appendChild(entryContainer)

    const desktopShellAppMenu = DesktopShellAppMenu.create(browserSession)
    panel.appendChild(desktopShellAppMenu.divElementAppMenuButton)

    const desktopShellMenu = DesktopShellMenu.create()
    panel.appendChild(desktopShellMenu.divElementMenuButton)

    const desktopUserShell = new DesktopUserShell(body, workspace, panel, entryContainer, browserSeat)
    browserSeat.addKeyboardResourceListener((grKeyboard) => {
      desktopUserShell._keyboardAvailable(grKeyboard)
    })

    return desktopUserShell
  }

  /**
   * Use DesktopShell.create(..)
   * @param {HTMLElement}body
   * @param {HTMLElement}workspace
   * @param {HTMLDivElement}panel
   * @param {HTMLDivElement}entryContainer
   * @param {BrowserSeat}browserSeat
   * @private
   */
  constructor (body, workspace, panel, entryContainer, browserSeat) {
    super()
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
     * @type {BrowserSeat}
     * @private
     */
    this._browserSeat = browserSeat
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return {UserShellSurface}
   * @override
   */
  manage (browserSurface) {
    const desktopShellEntry = DesktopUserShellSurface.create(browserSurface, this._browserSeat)
    this.entryContainer.appendChild(desktopShellEntry.divElement)
    return desktopShellEntry
  }

  /**
   * @param {GrKeyboard}grKeyboard
   * @private
   */
  _keyboardAvailable (grKeyboard) {
    DesktopUserShellSurface.desktopUserShellSurfaces.forEach((desktopUserShellSurface) => {
      if (desktopUserShellSurface.mainView.browserSurface.resource.client === grKeyboard.client) {
        desktopUserShellSurface.grKeyboard = grKeyboard
      }
    })
  }
}
