'use strict'

import DesktopUserShellSurface from './DesktopUserShellSurface'
import DesktopShellMenu from './DesktopShellMenu'

import './style/desktopshell.css'
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
    /**
     * @type {DesktopUserShellSurface[]}
     */
    this.desktopShellEntries = []
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return {UserShellSurface}
   */
  manage (browserSurface) {
    // create a view and attach it to the scene
    const desktopShellEntry = DesktopUserShellSurface.create(browserSurface, this._browserSeat)
    this.entryContainer.appendChild(desktopShellEntry.divElement)
    this.desktopShellEntries.push(desktopShellEntry)

    // remove the entry if the surface is destroyed
    browserSurface.resource.onDestroy().then(() => {
      const idx = this.desktopShellEntries.indexOf(desktopShellEntry)
      if (idx > -1) {
        this.desktopShellEntries.splice(idx, 1)
      }
    })

    return desktopShellEntry
  }

  /**
   * @param {BrowserSurface|null}browserSurface
   * @private
   */
  _onKeyboardFocusChanged (browserSurface) {
    if (browserSurface) {
      const desktopShellEntry = this.desktopShellEntries.find((desktopShellEntry) => {
        return desktopShellEntry.mainView.browserSurface === browserSurface
      })
      if (desktopShellEntry) {
        this.desktopShellEntries.forEach((desktopShellEntry) => {
          desktopShellEntry.onKeyboardFocusLost()
        })
        desktopShellEntry.onKeyboardFocusGained()
      }
    } else {

    }
  }
}
