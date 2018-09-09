'use strict'

import GrDataSourceRequests from './protocol/GrDataSourceRequests'
import GrDataDeviceManagerResource from './protocol/GrDataDeviceManagerResource'

const {copy, move, ask, none} = GrDataDeviceManagerResource.DndAction
const ALL_ACTIONS = (copy | move | ask)

/**
 *
 *            The gr_data_source object is the source side of a gr_data_offer.
 *            It is created by the source client in a data transfer and
 *            provides a way to describe the offered data and a way to respond
 *            to requests to transfer the data.
 * @implements GrDataSourceRequests
 */
export default class DataSource extends GrDataSourceRequests {
  /**
   * @param {GrDataSourceResource} grDataSourceResource
   * @return {DataSource}
   */
  static create (grDataSourceResource) {
    const dataSource = new DataSource(grDataSourceResource)
    grDataSourceResource.implementation = dataSource
    return dataSource
  }

  /**
   * @param {GrDataSourceResource} grDataSourceResource
   */
  constructor (grDataSourceResource) {
    super()
    /**
     * @type {GrDataSourceResource}
     */
    this.resource = grDataSourceResource
    this.mimeTypes = []
    this.dndActions = 0
    this._actionsSet = false
    this.currentDndAction = none
    this.accepted = false
    /**
     * @type {GrDataOffer}
     */
    this.grDataOffer = null
  }

  /**
   *
   *                This request adds a mime type to the set of mime types
   *                advertised to targets.  Can be called several times to offer
   *                multiple types.
   *
   *
   * @param {GrDataSourceResource} resource
   * @param {string} mimeType mime type offered by the data source
   *
   * @since 1
   * @override
   */
  offer (resource, mimeType) {
    this.mimeTypes.push(mimeType)
    if (this.grDataOffer) {
      this.grDataOffer.offer(mimeType)
    }
  }

  /**
   *
   *                Destroy the data source.
   *
   *
   * @param {GrDataSourceResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    resource.destroy()
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
   * @param {GrDataSourceResource} resource
   * @param {Number} dndActions actions supported by the data source
   *
   * @since 3
   * @override
   */
  setActions (resource, dndActions) {
    if (this._actionsSet) {
      // TODO protocol error
      // wl_resource_post_error(source->resource,
      //   WL_DATA_SOURCE_ERROR_INVALID_ACTION_MASK,
      //   "cannot set actions more than once");
      return
    }

    if (this.dndActions & ~ALL_ACTIONS) {
      // TODO protocol error
      // wl_resource_post_error(source->resource,
      //   WL_DATA_SOURCE_ERROR_INVALID_ACTION_MASK,
      //   "invalid action mask %x", dnd_actions);
      return
    }

    // if (source->seat) {
    //   wl_resource_post_error(source->resource,
    //     WL_DATA_SOURCE_ERROR_INVALID_ACTION_MASK,
    //     "invalid action change after "
    //   "wl_data_device.start_drag");
    //   return;
    // }

    this.dndActions = dndActions
    this._actionsSet = true
  }

  notifyFinish () {
    if (!this.dndActions) {
      return
    }

    if (this.grDataOffer.implementation.inAsk && this.resource.version >= 3) {
      this.resource.action(this.currentDndAction)
    }

    if (this.resource >= 3) {
      this.resource.dndFinished()
    }

    this.grDataOffer = null
  }
}
