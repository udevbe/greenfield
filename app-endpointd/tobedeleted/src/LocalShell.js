'use strict'

// Wayland Global
class LocalShell {
  /**
   * @return {LocalShell}
   */
  static create () {
    return new LocalShell()
  }

  constructor () {
    /**
     * @type {WlShell|null}
     */
    this.resource = null
  }
}

module.exports = LocalShell
