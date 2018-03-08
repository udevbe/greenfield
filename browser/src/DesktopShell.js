'use strict'

export default class DesktopShell {
  static create () {
    const body = document.body
    const workspace = document.getElementById('workspace')
    const panel = document.createElement('div')
    panel.classList.add('hpanel')
    body.insertAdjacentElement('afterbegin', panel)
    return new DesktopShell(body, workspace, panel)
  }

  /**
   * Use DesktopShell.create(..)
   * @param {HTMLBodyElement}body
   * @param {HTMLDivElement}workspace
   * @param {HTMLDivElement}panel
   * @private
   */
  constructor (body, workspace, panel) {
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
  }

  /**
   * @param {BrowserSurface}browserSurface
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

    // TODO add entry to panel
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
