'use strict'

import DesktopShellEntry from './DesktopShellEntry'
import DesktopShellMenu from './DesktopShellMenu'

import './style/desktopshell.css'
import DesktopShellAppMenu from './DesktopShellAppMenu'

export default class DesktopShell {
  /**
   * @param {BrowserSession}browserSession
   * @return {DesktopShell}
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

    return new DesktopShell(body, workspace, panel, entryContainer)
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
     * This field is set when browserKeyboard is created.
     * @type {BrowserKeyboard}
     */
    this.browserKeyboard = null
    /**
     * @type {DesktopShellEntry[]}
     */
    this.desktopShellEntries = []
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return {DesktopShellEntry}
   */
  manage (browserSurface) {
    // create a view and attach it to the scene
    const desktopShellEntry = DesktopShellEntry.create(this.browserKeyboard, browserSurface)
    this.entryContainer.appendChild(desktopShellEntry.divElement)
    this.desktopShellEntries.push(desktopShellEntry)
    // delay the activation as keyboard resource might still come in late
    window.setTimeout(() => {
      desktopShellEntry.makeActive()
    }, 250)

    return desktopShellEntry
  }

  onKeyboardFocusGained (view) {
    const desktopShellEntry = this.desktopShellEntries.find((desktopShellEntry) => {
      return desktopShellEntry.mainView === view
    })
    if (desktopShellEntry) {
      this.desktopShellEntries.forEach((desktopShellEntry) => {
        desktopShellEntry.onKeyboardFocusLost()
      })
      desktopShellEntry.onKeyboardFocusGained()
    }
  }
}
