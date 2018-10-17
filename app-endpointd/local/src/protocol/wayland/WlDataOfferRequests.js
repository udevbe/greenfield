/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


class WlDataOfferRequests {
  constructor () {
    this[0] = this.accept
    this[1] = this.receive
    this[2] = this.destroy
    this[3] = this.finish
    this[4] = this.setActions
  }

  /**
   *
   *	Indicate that the client can accept the given mime type, or
   *	NULL for not accepted.
   *
   *	For objects of version 2 or older, this request is used by the
   *	client to give feedback whether the client can receive the given
   *	mime type, or NULL if none is accepted; the feedback does not
   *	determine whether the drag-and-drop operation succeeds or not.
   *
   *	For objects of version 3 or newer, this request determines the
   *	final result of the drag-and-drop operation. If the end result
   *	is that no mime types were accepted, the drag-and-drop operation
   *	will be cancelled and the corresponding drag source will receive
   *	wl_data_source.cancelled. Clients may still use this event in
   *	conjunction with wl_data_source.action for feedback.
   *      
   *
   * @param {WlDataOffer} resource
   * @param {Number} serial serial number of the accept request
   * @param {?string} mimeType mime type accepted by the client
   *
   * @since 1
   *
   */
  accept (resource, serial, mimeType) {}
  /**
   *
   *	To transfer the offered data, the client issues this request
   *	and indicates the mime type it wants to receive.  The transfer
   *	happens through the passed file descriptor (typically created
   *	with the pipe system call).  The source client writes the data
   *	in the mime type representation requested and then closes the
   *	file descriptor.
   *
   *	The receiving client reads from the read end of the pipe until
   *	EOF and then closes its end, at which point the transfer is
   *	complete.
   *
   *	This request may happen multiple times for different mime types,
   *	both before and after wl_data_device.drop. Drag-and-drop destination
   *	clients may preemptively fetch data or examine it more closely to
   *	determine acceptance.
   *      
   *
   * @param {WlDataOffer} resource
   * @param {string} mimeType mime type desired by receiver
   * @param {Number} fd file descriptor for data transfer
   *
   * @since 1
   *
   */
  receive (resource, mimeType, fd) {}
  /**
   *
   *	Destroy the data offer.
   *      
   *
   * @param {WlDataOffer} resource
   *
   * @since 1
   *
   */
  destroy (resource) {}
  /**
   *
   *	Notifies the compositor that the drag destination successfully
   *	finished the drag-and-drop operation.
   *
   *	Upon receiving this request, the compositor will emit
   *	wl_data_source.dnd_finished on the drag source client.
   *
   *	It is a client error to perform other requests than
   *	wl_data_offer.destroy after this one. It is also an error to perform
   *	this request after a NULL mime type has been set in
   *	wl_data_offer.accept or no action was received through
   *	wl_data_offer.action.
   *      
   *
   * @param {WlDataOffer} resource
   *
   * @since 3
   *
   */
  finish (resource) {}
  /**
   *
   *	Sets the actions that the destination side client supports for
   *	this operation. This request may trigger the emission of
   *	wl_data_source.action and wl_data_offer.action events if the compositor
   *	needs to change the selected action.
   *
   *	This request can be called multiple times throughout the
   *	drag-and-drop operation, typically in response to wl_data_device.enter
   *	or wl_data_device.motion events.
   *
   *	This request determines the final result of the drag-and-drop
   *	operation. If the end result is that no action is accepted,
   *	the drag source will receive wl_drag_source.cancelled.
   *
   *	The dnd_actions argument must contain only values expressed in the
   *	wl_data_device_manager.dnd_actions enum, and the preferred_action
   *	argument must only contain one of those values set, otherwise it
   *	will result in a protocol error.
   *
   *	While managing an "ask" action, the destination drag-and-drop client
   *	may perform further wl_data_offer.receive requests, and is expected
   *	to perform one last wl_data_offer.set_actions request with a preferred
   *	action other than "ask" (and optionally wl_data_offer.accept) before
   *	requesting wl_data_offer.finish, in order to convey the action selected
   *	by the user. If the preferred action is not in the
   *	wl_data_offer.source_actions mask, an error will be raised.
   *
   *	If the "ask" action is dismissed (e.g. user cancellation), the client
   *	is expected to perform wl_data_offer.destroy right away.
   *
   *	This request can only be made on drag-and-drop offers, a protocol error
   *	will be raised otherwise.
   *      
   *
   * @param {WlDataOffer} resource
   * @param {Number} dndActions actions supported by the destination client
   * @param {Number} preferredAction action preferred by the destination client
   *
   * @since 3
   *
   */
  setActions (resource, dndActions, preferredAction) {}
}

module.exports = WlDataOfferRequests
