'use strict'

import DesktopShellEntry from './DesktopShellEntry'

export default class DesktopShell {
  static create () {
    const body = document.body
    const workspace = document.getElementById('workspace')
    const panel = document.createElement('div')
    panel.classList.add('hpanel')
    body.insertAdjacentElement('afterbegin', panel)

    const entryContainer = document.createElement('div')
    entryContainer.classList.add('entry-container')
    panel.appendChild(entryContainer)

    const menu = document.createElement('div')
    menu.classList.add('menu')
    panel.appendChild(menu)

    return new DesktopShell(body, workspace, panel, entryContainer, menu)
  }

  /**
   * Use DesktopShell.create(..)
   * @param {HTMLBodyElement}body
   * @param {HTMLDivElement}workspace
   * @param {HTMLDivElement}panel
   * @param {HTMLDivElement}entryContainer
   * @param {HTMLDivElement}menu
   * @private
   */
  constructor (body, workspace, panel, entryContainer, menu) {
    /**
     * @type{HTMLBodyElement}
     */
    this.body = body
    /**
     * @type{HTMLDivElement}
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
     * @type{HTMLDivElement}
     */
    this.menu = menu
    /**
     * This field is set when browserKeyboard is created.
     * @type {BrowserKeyboard}
     */
    this.browserKeyboard = null
    /**
     * @type {DesktopShellEntry[]}
     */
    this.entries = []
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return {DesktopShellEntry}
   */
  manage (browserSurface) {
    // create a view and attach it to the scene
    const desktopShellEntry = DesktopShellEntry.create(this.browserKeyboard, browserSurface)
    this.entryContainer.appendChild(desktopShellEntry.entry)
    this.entries.push(desktopShellEntry)

    return desktopShellEntry
  }

  onKeyboardFocusGained (view) {
    this.entries.forEach((entry) => {
      entry.entry.classList.remove('entry-focus')
    })
    const entry = this.entries.find((entry) => {
      return entry.view === view
    })
    entry.entry.classList.add('entry-focus')
  }
}
