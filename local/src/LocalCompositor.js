'use strict'

module.exports = class LocalCompositor {

  /**
   *
   * @param {wfc.GrCompositor} grCompositoryProxy
   * @returns {module.LocalCompositor}
   */
  static create (grCompositoryProxy) {
    return new LocalCompositor(grCompositoryProxy)
  }

  /**
   *
   * @param {wfc.GrCompositor} grCompositorProxy
   */
  constructor (grCompositorProxy) {
    this.grCompositorProxy = grCompositorProxy
  }
}