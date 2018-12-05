'use strict'

import DesktopUserShellSurface from './DesktopUserShellSurface'

import './desktopshell.css'

/**
 * @implements UserShell
 */
export default class DesktopUserShell {
  /**
   * @param {Session}session
   * @param {Seat}seat
   * @return {DesktopUserShell}
   */
  static create (session, seat) {
    const body = document.body
    const workspace = document.getElementById('workspace')
    const panel = /** @type {HTMLDivElement} */document.createElement('div')
    panel.classList.add('hpanel')
    body.insertAdjacentElement('afterbegin', panel)

    const entryContainer = /** @type {HTMLDivElement} */document.createElement('div')
    entryContainer.classList.add('entry-container')
    panel.appendChild(entryContainer)
    return new DesktopUserShell(body, workspace, panel, entryContainer, seat)
  }

  /**
   * Use DesktopShell.create(..)
   * @param {HTMLElement}body
   * @param {HTMLElement}workspace
   * @param {HTMLDivElement}panel
   * @param {HTMLDivElement}entryContainer
   * @param {Seat}seat
   * @private
   */
  constructor (body, workspace, panel, entryContainer, seat) {
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
     * @type {Seat}
     * @private
     */
    this._seat = seat
  }

  /**
   * @param {Surface}surface
   * @return {UserShellSurface}
   * @override
   */
  manage (surface) {
    const desktopShellEntry = DesktopUserShellSurface.create(surface, this._seat)
    this.entryContainer.appendChild(desktopShellEntry.divElement)
    return desktopShellEntry
  }
}
