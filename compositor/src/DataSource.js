'use strict'

import WlDataSourceRequests from './protocol/WlDataSourceRequests'
import WlDataDeviceManagerResource from './protocol/WlDataDeviceManagerResource'

const {copy, move, ask, none} = WlDataDeviceManagerResource.DndAction
const ALL_ACTIONS = (copy | move | ask)

/**
 *
 *            The wl_data_source object is the source side of a wl_data_offer.
 *            It is created by the source client in a data transfer and
 *            provides a way to describe the offered data and a way to respond
 *            to requests to transfer the data.
 * @implements WlDataSourceRequests
 */
export default class DataSource extends WlDataSourceRequests {
  /**
   * @param {WlDataSourceResource} wlDataSourceResource
   * @return {DataSource}
   */
  static create (wlDataSourceResource) {
    const dataSource = new DataSource(wlDataSourceResource)
    wlDataSourceResource.implementation = dataSource
    return dataSource
  }

  /**
   * @param {WlDataSourceResource} wlDataSourceResource
   */
  constructor (wlDataSourceResource) {
    super()
    /**
     * @type {WlDataSourceResource}
     */
    this.resource = wlDataSourceResource
    /**
     * @type {Array<string>}
     */
    this.mimeTypes = []
    /**
     * @type {number}
     */
    this.dndActions = 0
    /**
     * @type {boolean}
     * @private
     */
    this._actionsSet = false
    /**
     * @type {number}
     */
    this.currentDndAction = none
    /**
     * @type {boolean}
     */
    this.accepted = false
    /**
     * @type {WlDataOfferResource}
     */
    this.wlDataOffer = null
  }

  /**
   *
   *                This request adds a mime type to the set of mime types
   *                advertised to targets.  Can be called several times to offer
   *                multiple types.
   *
   *
   * @param {WlDataSourceResource} resource
   * @param {string} mimeType mime type offered by the data source
   *
   * @since 1
   * @override
   */
  offer (resource, mimeType) {
    this.mimeTypes.push(mimeType)
    if (this.wlDataOffer) {
      this.wlDataOffer.offer(mimeType)
    }
  }

  /**
   *
   *                Destroy the data source.
   *
   *
   * @param {WlDataSourceResource} resource
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
   *                operation. This request may trigger wl_data_source.action and
   *                wl_data_offer.action events if the compositor needs to change the
   *                selected action.
   *
   *                The dnd_actions argument must contain only values expressed in the
   *                wl_data_device_manager.dnd_actions enum, otherwise it will result
   *                in a protocol error.
   *
   *                This request must be made once only, and can only be made on sources
   *                used in drag-and-drop, so it must be performed before
   *                wl_data_device.start_drag. Attempting to use the source other than
   *                for drag-and-drop will raise a protocol error.
   *
   *
   * @param {WlDataSourceResource} resource
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

    if (this.wlDataOffer.implementation.inAsk && this.resource.version >= 3) {
      this.resource.action(this.currentDndAction)
    }

    if (this.resource >= 3) {
      this.resource.dndFinished()
    }

    this.wlDataOffer = null
  }
}
