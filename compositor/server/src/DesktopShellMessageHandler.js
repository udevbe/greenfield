'use strict'

class DesktopShellMessageHandler {
  /**
   * @param {CompositorSession}compositorSession
   */
  static create (compositorSession) {
    return new DesktopShellMessageHandler(compositorSession)
  }

  /**
   * @param {CompositorSession}compositorSession
   */
  constructor (compositorSession) {
    this._compositorSession = compositorSession
  }

  queryLaunchers (args) {
    // TODO
  }
}

module.exports = DesktopShellMessageHandler
