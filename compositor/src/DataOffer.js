// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

import WlDataOfferRequests from './protocol/WlDataOfferRequests'
import WlDataOfferResource from './protocol/WlDataOfferResource'

import WlDataDeviceManagerResource from './protocol/WlDataDeviceManagerResource'

const {copy, move, ask, none} = WlDataDeviceManagerResource.DndAction
const ALL_ACTIONS = (copy | move | ask)

/**
 *
 *            A wl_data_offer represents a piece of data offered for transfer
 *            by another client (the source client).  It is used by the
 *            copy-and-paste and drag-and-drop mechanisms.  The offer
 *            describes the different mime types that the data can be
 *            converted to and provides the mechanism for transferring the
 *            data directly from the source client.
 * @implements WlDataOfferRequests
 */
export default class DataOffer extends WlDataOfferRequests {
  /**
   * @param {WlDataSourceResource}source
   * @param {number}offerId
   * @param {WlDataDeviceResource}dataDeviceResource
   * @return {DataOffer}
   */
  static create (source, offerId, dataDeviceResource) {
    const dataOffer = new DataOffer(source)
    const wlDataOfferResource = new WlDataOfferResource(dataDeviceResource.client, offerId, dataDeviceResource.version)
    wlDataOfferResource.implementation = dataOffer
    dataOffer.resource = wlDataOfferResource
    wlDataOfferResource.onDestroy().then(() => dataOffer._handleDestroy())

    return dataOffer
  }

  /**
   * Use DataOffer.create(..) instead.
   * @private
   * @param {WlDataSourceResource}source
   */
  constructor (source) {
    super()
    // set when offer is created
    /**
     * @type {WlDataOfferResource}
     */
    this.resource = null
    /**
     * @type {string|null}
     */
    this.acceptMimeType = null
    /**
     * @type {number}
     */
    this.preferredAction = 0
    /**
     * @type {number}
     */
    this.dndActions = none
    /**
     * @type {WlDataSourceResource}
     */
    this.wlDataSource = source
    /**
     * @type {boolean}
     * @private
     */
    this._finished = false
    this.inAsk = false
  }

  _handleDestroy () {
    if (!this.wlDataSource) { return }

    // TODO remove source destroy listener
    // TODO add source destroy listener
    // wl_list_remove(&offer->source_destroy_listener.link);

    const dataSoure = /** @type {DataSource} */this.wlDataSource.implementation
    if (dataSoure.wlDataOffer !== this.resource) { return }

    /* If the drag destination has version < 3, wl_data_offer.finish
     * won't be called, so do this here as a safety net, because
     * we still want the version >=3 drag source to be happy.
     */
    if (this.resource < 3) {
      dataSoure.notifyFinish()
    } else if (this.wlDataSource.resource &&
      this.wlDataSource.resource.version >= 3) {
      this.wlDataSource.resource.cancelled()
    }

    dataSoure.wlDataOffer = null
  }

  /**
   *
   *                Indicate that the client can accept the given mime type, or
   *                NULL for not accepted.
   *
   *                For objects of version 2 or older, this request is used by the
   *                client to give feedback whether the client can receive the given
   *                mime type, or NULL if none is accepted; the feedback does not
   *                determine whether the drag-and-drop operation succeeds or not.
   *
   *                For objects of version 3 or newer, this request determines the
   *                final result of the drag-and-drop operation. If the end result
   *                is that no mime types were accepted, the drag-and-drop operation
   *                will be cancelled and the corresponding drag source will receive
   *                wl_data_source.cancelled. Clients may still use this event in
   *                conjunction with wl_data_source.action for feedback.
   *
   *
   * @param {WlDataOfferResource} resource
   * @param {number} serial serial number of the accept request
   * @param {string|null} mimeType mime type accepted by the client
   *
   * @since 1
   * @override
   */
  accept (resource, serial, mimeType) {
    if (!this.wlDataSource || !this.wlDataSource.implementation.wlDataOffer) {
      return
    }
    if (this._finished) {
      // TODO raise protocol error
    }

    this.acceptMimeType = mimeType
    this.wlDataSource.target(mimeType)
    this.wlDataSource.implementation.accepted = mimeType !== null
  }

  /**
   *
   *                To transfer the offered data, the client issues this request
   *                and indicates the mime type it wants to receive.  The transfer
   *                happens through the passed file descriptor (typically created
   *                with the pipe system call).  The source client writes the data
   *                in the mime type representation requested and then closes the
   *                file descriptor.
   *
   *                The receiving client reads from the read end of the pipe until
   *                EOF and then closes its end, at which point the transfer is
   *                complete.
   *
   *                This request may happen multiple times for different mime types,
   *                both before and after wl_data_device.drop. Drag-and-drop destination
   *                clients may preemptively fetch data or examine it more closely to
   *                determine acceptance.
   *
   *
   * @param {WlDataOfferResource} resource
   * @param {string} mimeType mime type desired by receiver
   * @param {Number} fd file descriptor for data transfer
   *
   * @since 1
   * @override
   */
  receive (resource, mimeType, fd) {
    if (this._finished) {
      // TODO raise protocol error
    }
    if (this.wlDataSource) {
      this.wlDataSource.send(mimeType, fd)
    } else {
      this.wlDataSource.send('', -1)
    }
  }

  /**
   *
   *                Destroy the data offer.
   *
   *
   * @param {WlDataOfferResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    resource.destroy()
  }

  /**
   *
   *                Notifies the compositor that the drag destination successfully
   *                finished the drag-and-drop operation.
   *
   *                Upon receiving this request, the compositor will emit
   *                wl_data_source.dnd_finished on the drag source client.
   *
   *                It is a client error to perform other requests than
   *                wl_data_offer.destroy after this one. It is also an error to perform
   *                this request after a NULL mime type has been set in
   *                wl_data_offer.accept or no action was received through
   *                wl_data_offer.action.
   *
   *
   * @param {WlDataOfferResource} resource
   *
   * @since 3
   *
   */
  finish (resource) {
    if (this.wlDataSource || !this.preferredAction) {
      return
    }
    if (!this.acceptMimeType || this._finished) {
      return
    }

    /* Disallow finish while we have a grab driving drag-and-drop, or
     * if the negotiation is not at the right stage
     */
    if (!this.wlDataSource.implementation.accepted) {
      // TODO raise protocol error
      // wl_resource_post_error(offer->resource,
      //   WL_DATA_OFFER_ERROR_INVALID_FINISH,
      //   "premature finish request");
      return
    }

    switch (this.wlDataSource.implementation.currentDndAction) {
      case none:
      case ask:
        // TODO raise protocol error
        // wl_resource_post_error(offer->resource,
        //   WL_DATA_OFFER_ERROR_INVALID_OFFER,
        //   'offer finished with an invalid action')
        return
      default:
        break
    }

    this.wlDataSource.implementation.notifyFinish()
  }

  _bitCount (u) {
    // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
    const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111)
    return ((uCount + (uCount >> 3)) & 0o30707070707) % 63
  }

  /**
   *
   *                Sets the actions that the destination side client supports for
   *                this operation. This request may trigger the emission of
   *                wl_data_source.action and wl_data_offer.action events if the compositor
   *                needs to change the selected action.
   *
   *                This request can be called multiple times throughout the
   *                drag-and-drop operation, typically in response to wl_data_device.enter
   *                or wl_data_device.motion events.
   *
   *                This request determines the final result of the drag-and-drop
   *                operation. If the end result is that no action is accepted,
   *                the drag source will receive wl_drag_source.cancelled.
   *
   *                The dnd_actions argument must contain only values expressed in the
   *                wl_data_device_manager.dnd_actions enum, and the preferred_action
   *                argument must only contain one of those values set, otherwise it
   *                will result in a protocol error.
   *
   *                While managing an "ask" action, the destination drag-and-drop client
   *                may perform further wl_data_offer.receive requests, and is expected
   *                to perform one last wl_data_offer.set_actions request with a preferred
   *                action other than "ask" (and optionally wl_data_offer.accept) before
   *                requesting wl_data_offer.finish, in order to convey the action selected
   *                by the user. If the preferred action is not in the
   *                wl_data_offer.source_actions mask, an error will be raised.
   *
   *                If the "ask" action is dismissed (e.g. user cancellation), the client
   *                is expected to perform wl_data_offer.destroy right away.
   *
   *                This request can only be made on drag-and-drop offers, a protocol error
   *                will be raised otherwise.
   *
   *
   * @param {WlDataOfferResource} resource
   * @param {Number} dndActions actions supported by the destination client
   * @param {Number} preferredAction action preferred by the destination client
   *
   * @since 3
   *
   */
  setActions (resource, dndActions, preferredAction) {
    if (!this.wlDataSource) {
      return
    }
    if (this._finished) {
      // TODO raise protocol error
    }

    if (dndActions & ~ALL_ACTIONS) {
      // TODO protocol error
      // wl_resource_post_error(offer->resource,
      //   WL_DATA_OFFER_ERROR_INVALID_ACTION_MASK,
      //   'invalid action mask %x', dnd_actions)
      return
    }

    if (preferredAction &&
      (!(preferredAction & dndActions) ||
        this._bitCount(preferredAction) > 1)) {
      // TODO protocol error
      // wl_resource_post_error(offer->resource,
      //   WL_DATA_OFFER_ERROR_INVALID_ACTION,
      //   'invalid action %x', preferred_action)
      return
    }

    this.dndActions = dndActions
    this.preferredAction = preferredAction
    this.updateAction()
  }

  updateAction () {
    if (!this.wlDataSource) { return }

    const action = this._chooseAction()

    if (this.wlDataSource.implementation.currentDndAction === action) { return }

    this.wlDataSource.implementation.currentDndAction = action

    if (this.inAsk) { return }

    if (this.wlDataSource.version >= 3) {
      this.wlDataSource.action(action)
    }

    if (this.resource.version >= 3) {
      this.resource.action(action)
    }
  }

  _chooseAction () {
    let offerActions = none
    let preferredAction = none
    if (this.resource >= 3) {
      offerActions = this.dndActions
      preferredAction = this.preferredAction
    } else {
      offerActions = copy
    }

    let sourceActions = none
    if (this.wlDataSource.version >= 3) {
      sourceActions = this.wlDataSource.implementation.dndActions
    } else {
      sourceActions = copy
    }
    const availableActions = offerActions & sourceActions

    if (!availableActions) {
      return none
    }

    // TODO a compositor defined action could be returned here

    /* If the dest side has a preferred DnD action, use it */
    if ((preferredAction & availableActions) !== 0) {
      return preferredAction
    }

    /* Use the first found action, in bit order */
    return 1 << (Math.floor(Math.log2(availableActions)) - 1)
  }
}
