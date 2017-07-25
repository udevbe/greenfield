export default class LocalCompositor {
  static create (grCompositoryProxy) {
    return new LocalCompositor(grCompositoryProxy)
  }

  constructor (grCompositorProxy) {
    this.grCompositorProxy = grCompositorProxy
  }
}