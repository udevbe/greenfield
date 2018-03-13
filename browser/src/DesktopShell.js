'use strict'

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
     * @type {BrowserKeyboard}
     */
    this.browserKeyboard = null
    /**
     * @type {{view: BrowserSurfaceView, browserSurface: BrowserSurface, entry: HTMLDivElement}[]}
     */
    this.entries = []
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return {HTMLDivElement}
   */
  manage (browserSurface) {
    // create a view and attach it to the scene
    const view = browserSurface.createView()
    this.fadeOutViewOnDestroy(view)
    view.attachTo(document.body)
    view.raise()

    // destroy the view if the shell-surface is destroyed
    browserSurface.resource.onDestroy().then(() => {
      view.destroy()
    })

    const entry = document.createElement('div')
    entry.classList.add('entry')
    this.entryContainer.appendChild(entry)

    view.onDestroy().then(() => {
      if (entry.parentElement) {
        entry.addEventListener('transitionend', () => {
          entry.parentElement.removeChild(entry)
        })
        entry.classList.add('entry-removed')
      }
    })

    entry.addEventListener('click', () => {
      view.raise()
      this.browserKeyboard.focusGained(view)
      // TODO give it keyboard focus
    })

    // TODO create dedicated entry class
    this.entries.push({
      view: view,
      browserSurface: browserSurface,
      entry: entry
    })

    return entry
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

  fadeOutViewOnDestroy (view) {
    // play a nice fade out animation if the view is destroyed
    view.onDestroy().then(() => {
      view.bufferedCanvas.frontContext.canvas.addEventListener('transitionend', () => {
        // after the animation has ended, detach the view from the scene
        view.detach()
      }, false)
      // play the animation
      view.fadeOut()
    })
  }
}
