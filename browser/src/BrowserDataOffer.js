'use strict'

export default class BrowserDataOffer {
  /**
   * @param {GrDataSource}source
   * @return {BrowserDataOffer}
   */
  static create (source) {
    return new BrowserDataOffer(source)
  }

  /**
   * Use BrowserDataOffer.create(..) instead.
   * @private
   * @param {GrDataSource}source
   */
  constructor (source) {
    /**
     * @type {string}
     */
    this.acceptMimeType = null
    this.acceptSerial = null
    /**
     * @type {number}
     */
    this.preferredAction = null
    /**
     * @type {GrDataSource}
     */
    this.source = source
    /**
     * @type {boolean}
     * @private
     */
    this._finished = false
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
    if (!this.source) {
      // TODO raise protocol error (offer no longer valid)
    }
    if (this._finished) {
      // TODO raise protocol error
    }

    this.acceptSerial = serial
    this.acceptMimeType = mimeType
    this.source.target(mimeType)

    if (resource.version >= 3 && !mimeType) {
      this.source.cancelled()
    }
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
    if (!this.source) {
      // TODO raise protocol error (offer no longer valid)
    }
    if (this._finished) {
      // TODO raise protocol error
    }
    this.source.send(mimeType, fd)
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
    if (!this.source) {
      // TODO raise protocol error (offer no longer valid)
    }
    if (!this.acceptMimeType || this._finished || !this.preferredAction) {
      // TODO raise protocol error
    }
    this.source.dndFinished()
    this._finished = true
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
    if (!this.source) {
      // TODO raise protocol error (offer no longer valid)
    }
    if (this._finished) {
      // TODO raise protocol error
    }
    if (!(this.source.implementation.dndActions & preferredAction)) {
      // TODO raise protocol error
      return
    }

    // TODO check dndActions is part of OR'ed enum
    // TODO check if preferredAction is part of enum

    // just use default preferred action for now
    if (preferredAction) {
      this.source.action(preferredAction)
      resource.action(preferredAction)
      this.preferredAction = preferredAction
    } else {
      this.source.cancelled()
    }
  }
}
