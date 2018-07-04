'use strict'

import DesktopUserShellSurface from './DesktopUserShellSurface'
import DesktopShellMenu from './DesktopShellMenu'

import './desktopshell.css'
import DesktopShellAppMenu from './DesktopShellAppMenu'
import UserShell from '../UserShell'

export default class DesktopUserShell extends UserShell {
  /**
   * @param {BrowserSession}browserSession
   * @return {DesktopUserShell}
   */
  static create (browserSession) {
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

    return new DesktopUserShell(body, workspace, panel, entryContainer)
  }

  /**
   * Use DesktopShell.create(..)
   * @param {HTMLElement}body
   * @param {HTMLElement}workspace
   * @param {HTMLDivElement}panel
   * @param {HTMLDivElement}entryContainer
   * @private
   */
  constructor (body, workspace, panel, entryContainer) {
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
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {function}activeCallback
   * @return {UserShellSurface}
   * @override
   */
  manage (browserSurface, activeCallback) {
    const desktopShellEntry = DesktopUserShellSurface.create(browserSurface, activeCallback)
    this.entryContainer.appendChild(desktopShellEntry.divElement)
    return desktopShellEntry
  }

  /**
   * Signal the user shell that a keyboard resource is available [for a particular client]. Useful to decide if a
   * surface can be given keyboard input.
   * @param {GrKeyboard}grKeyboard
   * @override
   */
  keyboardAvailable (grKeyboard) {
    DesktopUserShellSurface.desktopUserShellSurfaces.forEach((desktopUserShellSurface) => {
      if (desktopUserShellSurface.mainView.browserSurface.resource.client === grKeyboard.client) {
        desktopUserShellSurface.grKeyboard = grKeyboard
      }
    })
  }
}
