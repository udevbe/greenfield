'use strict'

export default class BrowserDataSource {
  /**
   * @param {GrDataSource} grDataSource
   * @return {BrowserDataSource}
   */
  static create (grDataSource) {
    const browserDataSource = new BrowserDataSource(grDataSource)
    grDataSource.implementation = browserDataSource
    return browserDataSource
  }

  /**
   * @param {GrDataSource} grDataSource
   */
  constructor (grDataSource) {
    this.resource = grDataSource
    this.mimeTypes = []
    this.dndActions = 0
    /**
     * @type {Array<GrDataOffer>}
     */
    this.offers = []
  }

  /**
   *
   *                This request adds a mime type to the set of mime types
   *                advertised to targets.  Can be called several times to offer
   *                multiple types.
   *
   *
   * @param {GrDataSource} resource
   * @param {string} mimeType mime type offered by the data source
   *
   * @since 1
   *
   */
  offer (resource, mimeType) {
    this.mimeTypes.push(mimeType)
  }

  /**
   *
   *                Destroy the data source.
   *
   *
   * @param {GrDataSource} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    this.resource.destroy()
  }

  /**
   *
   *                Sets the actions that the source side client supports for this
   *                operation. This request may trigger gr_data_source.action and
   *                gr_data_offer.action events if the compositor needs to change the
   *                selected action.
   *
   *                The dnd_actions argument must contain only values expressed in the
   *                gr_data_device_manager.dnd_actions enum, otherwise it will result
   *                in a protocol error.
   *
   *                This request must be made once only, and can only be made on sources
   *                used in drag-and-drop, so it must be performed before
   *                gr_data_device.start_drag. Attempting to use the source other than
   *                for drag-and-drop will raise a protocol error.
   *
   *
   * @param {GrDataSource} resource
   * @param {Number} dndActions actions supported by the data source
   *
   * @since 3
   *
   */
  setActions (resource, dndActions) {
    this.dndActions = dndActions
    this.offers.forEach((offer) => {
      offer.sourceActions(this.dndActions)
    })
  }
}
