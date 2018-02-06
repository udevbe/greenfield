'use strict'

import greenfield from './protocol/greenfield-browser-protocol'

const DndAction = greenfield.GrDataDeviceManager.DndAction
const ALL_ACTIONS = (DndAction.copy | DndAction.move | DndAction.ask)

export default class BrowserDataOffer {
  /**
   * @param {GrDataSource}source
   * @param {number}offerId
   * @param {GrDataDevice}dataDeviceResource
   * @return {BrowserDataOffer}
   */
  static create (source, offerId, dataDeviceResource) {
    const browserDataOffer = new BrowserDataOffer(source)
    const grDataOffer = new greenfield.GrDataOffer(dataDeviceResource.client, offerId, dataDeviceResource.version)
    grDataOffer.implementation = browserDataOffer
    browserDataOffer.resource = grDataOffer
    grDataOffer.onDestroy().then(() => {
      browserDataOffer._handleDestroy()
    })

    return browserDataOffer
  }

  /**
   * Use BrowserDataOffer.create(..) instead.
   * @private
   * @param {GrDataSource}source
   */
  constructor (source) {
    // set when offer is created
    /**
     * @type {GrDataOffer}
     */
    this.resource = null
    /**
     * @type {string}
     */
    this.acceptMimeType = null
    /**
     * @type {number}
     */
    this.preferredAction = null
    /**
     * @type {number}
     */
    this.dndActions = greenfield.GrDataDeviceManager.DndAction.none
    /**
     * @type {GrDataSource}
     */
    this.grDataSource = source
    /**
     * @type {boolean}
     * @private
     */
    this._finished = false
    this.inAsk = false
  }

  _handleDestroy () {
    if (!this.grDataSource) { return }

    // TODO remove source destroy listener
    // TODO add source destroy listener
    // wl_list_remove(&offer->source_destroy_listener.link);

    if (this.grDataSource.implementation.grDataOffer !== this.resource) { return }

    /* If the drag destination has version < 3, wl_data_offer.finish
     * won't be called, so do this here as a safety net, because
     * we still want the version >=3 drag source to be happy.
     */
    if (this.resource < 3) {
      this.grDataSource.implementation.notifyFinish()
    } else if (this.grDataSource.resource &&
      this.grDataSource.resource.version >= 3) {
      this.grDataSource.resource.cancelled()
    }

    this.grDataSource.implementation.grDataOffer = null
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
   *                gr_data_source.cancelled. Clients may still use this event in
   *                conjunction with gr_data_source.action for feedback.
   *
   *
   * @param {GrDataOffer} resource
   * @param {Number} serial serial number of the accept request
   * @param {string|null} mimeType mime type accepted by the client
   *
   * @since 1
   *
   */
  accept (resource, serial, mimeType) {
    if (!this.grDataSource || !this.grDataSource.implementation.grDataOffer) {
      return
    }
    if (this._finished) {
      // TODO raise protocol error
    }

    this.acceptMimeType = mimeType
    this.grDataSource.target(mimeType)
    this.grDataSource.implementation.accepted = mimeType !== null
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
   * @param {GrDataOffer} resource
   * @param {string} mimeType mime type desired by receiver
   * @param {Number} fd file descriptor for data transfer
   *
   * @since 1
   *
   */
  receive (resource, mimeType, fd) {
    if (this._finished) {
      // TODO raise protocol error
    }
    if (this.grDataSource) {
      this.grDataSource.send(mimeType, fd)
    } else {
      this.grDataSource.send('', -1)
    }
  }

  /**
   *
   *                Destroy the data offer.
   *
   *
   * @param {GrDataOffer} resource
   *
   * @since 1
   *
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
   *                gr_data_source.dnd_finished on the drag source client.
   *
   *                It is a client error to perform other requests than
   *                gr_data_offer.destroy after this one. It is also an error to perform
   *                this request after a NULL mime type has been set in
   *                gr_data_offer.accept or no action was received through
   *                gr_data_offer.action.
   *
   *
   * @param {GrDataOffer} resource
   *
   * @since 3
   *
   */
  finish (resource) {
    if (this.grDataSource || !this.preferredAction) {
      return
    }
    if (!this.acceptMimeType || this._finished) {
      return
    }

    /* Disallow finish while we have a grab driving drag-and-drop, or
     * if the negotiation is not at the right stage
     */
    if (!this.grDataSource.implementation.accepted) {
      // TODO raise protocol error
      // wl_resource_post_error(offer->resource,
      //   WL_DATA_OFFER_ERROR_INVALID_FINISH,
      //   "premature finish request");
      return
    }

    switch (this.grDataSource.implementation.currentDndAction) {
      case greenfield.GrDataDeviceManager.DndAction.none:
      case greenfield.GrDataDeviceManager.DndAction.ask:
        // TODO raise protocol error
        // wl_resource_post_error(offer->resource,
        //   WL_DATA_OFFER_ERROR_INVALID_OFFER,
        //   'offer finished with an invalid action')
        return
      default:
        break
    }

    this.grDataSource.implementation.notifyFinish()
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
   *                gr_data_source.action and gr_data_offer.action events if the compositor
   *                needs to change the selected action.
   *
   *                This request can be called multiple times throughout the
   *                drag-and-drop operation, typically in response to gr_data_device.enter
   *                or gr_data_device.motion events.
   *
   *                This request determines the final result of the drag-and-drop
   *                operation. If the end result is that no action is accepted,
   *                the drag source will receive gr_drag_source.cancelled.
   *
   *                The dnd_actions argument must contain only values expressed in the
   *                gr_data_device_manager.dnd_actions enum, and the preferred_action
   *                argument must only contain one of those values set, otherwise it
   *                will result in a protocol error.
   *
   *                While managing an "ask" action, the destination drag-and-drop client
   *                may perform further gr_data_offer.receive requests, and is expected
   *                to perform one last gr_data_offer.set_actions request with a preferred
   *                action other than "ask" (and optionally gr_data_offer.accept) before
   *                requesting gr_data_offer.finish, in order to convey the action selected
   *                by the user. If the preferred action is not in the
   *                gr_data_offer.source_actions mask, an error will be raised.
   *
   *                If the "ask" action is dismissed (e.g. user cancellation), the client
   *                is expected to perform gr_data_offer.destroy right away.
   *
   *                This request can only be made on drag-and-drop offers, a protocol error
   *                will be raised otherwise.
   *
   *
   * @param {GrDataOffer} resource
   * @param {Number} dndActions actions supported by the destination client
   * @param {Number} preferredAction action preferred by the destination client
   *
   * @since 3
   *
   */
  setActions (resource, dndActions, preferredAction) {
    if (!this.grDataSource) {
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
    if (!this.grDataSource) { return }

    const action = this._chooseAction()

    if (this.grDataSource.implementation.currentDndAction === action) { return }

    this.grDataSource.implementation.currentDndAction = action

    if (this.inAsk) { return }

    if (this.grDataSource.version >= 3) {
      this.grDataSource.action(action)
    }

    if (this.resource.version >= 3) {
      this.resource.action(action)
    }
  }

  _chooseAction () {
    let offerActions = DndAction.none
    let preferredAction = DndAction.none
    if (this.resource >= 3) {
      offerActions = this.dndActions
      preferredAction = this.preferredAction
    } else {
      offerActions = DndAction.copy
    }

    let sourceActions = DndAction.none
    if (this.grDataSource.version >= 3) {
      sourceActions = this.grDataSource.implementation.dndActions
    } else {
      sourceActions = DndAction.copy
    }
    const availableActions = offerActions & sourceActions

    if (!availableActions) {
      return DndAction.none
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
