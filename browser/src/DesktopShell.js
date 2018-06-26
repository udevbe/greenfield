'use strict'

import DesktopShellEntry from './DesktopShellEntry'
import DesktopShellMenu from './DesktopShellMenu'

import './style/desktopshell.css'
import DesktopShellAppMenu from './DesktopShellAppMenu'

export default class DesktopShell {
  /**
   * @param {BrowserSession}browserSession
   * @param {BrowserSeat} browserSeat
   * @return {DesktopShell}
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

    const desktopShell = new DesktopShell(body, workspace, panel, entryContainer, browserSeat)
    browserSeat.browserKeyboard.addKeyboardFocusListener(() => {
      if (browserSeat.browserKeyboard.focus) {
        desktopShell.onKeyboardFocusGained(browserSeat.browserKeyboard.focus)
      }
    })

    return desktopShell
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
     * @type {DesktopShellEntry[]}
     */
    this.desktopShellEntries = []
    /**
     * @type {BrowserSeat}
     * @private
     */
    this._browserSeat = browserSeat
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return {DesktopShellEntry}
   */
  manage (browserSurface) {
    // create a view and attach it to the scene
    const desktopShellEntry = DesktopShellEntry.create(browserSurface, this._browserSeat)
    this.entryContainer.appendChild(desktopShellEntry.divElement)
    this.desktopShellEntries.push(desktopShellEntry)

    // TODO can we make this work without a timeout?
    // delay the activation as keyboard resource might still come in late
    const activationTimer = window.setTimeout(() => {
      desktopShellEntry.makeActive()
    }, 300)

    // remove the entry if the surface is destroyed
    browserSurface.resource.onDestroy().then(() => {
      const idx = this.desktopShellEntries.indexOf(desktopShellEntry)
      if (idx > -1) {
        this.desktopShellEntries.splice(idx, 1)
        window.clearTimeout(activationTimer)
      }
    })

    return desktopShellEntry
  }

  onKeyboardFocusGained (browserSurface) {
    const desktopShellEntry = this.desktopShellEntries.find((desktopShellEntry) => {
      return desktopShellEntry.mainView.browserSurface === browserSurface
    })
    if (desktopShellEntry) {
      this.desktopShellEntries.forEach((desktopShellEntry) => {
        desktopShellEntry.onKeyboardFocusLost()
      })
      desktopShellEntry.onKeyboardFocusGained()
    }
  }
}
