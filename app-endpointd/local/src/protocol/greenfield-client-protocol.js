/*
 *
 *        Copyright © 2008-2011 Kristian Høgsberg
 *        Copyright © 2010-2011 Intel Corporation
 *        Copyright © 2012-2013 Collabora, Ltd.
 *        Copyright © 2017 Erik De Rijcke
 *
 *        Permission is hereby granted, free of charge, to any person
 *        obtaining a copy of this software and associated documentation files
 *        (the "Software"), to deal in the Software without restriction,
 *        including without limitation the rights to use, copy, modify, merge,
 *        publish, distribute, sublicense, and/or sell copies of the Software,
 *        and to permit persons to whom the Software is furnished to do so,
 *        subject to the following conditions:
 *
 *        The above copyright notice and this permission notice (including the
 *        next paragraph) shall be included in all copies or substantial
 *        portions of the Software.
 *
 *        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *        NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *        ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *        SOFTWARE.
 *    
 */
const wfc = require('westfield-runtime-client')
/**
 *
 *            Clients and compositor can send out-of-band data using a blob transfer object. Data is
 *            effectively transferred asynchronous using an implementation specific mechanism. A blob transfer object
 *            acts as a hook into an implementation specific mechanism to send and get the actual blob data.
 *        
 */
wfc.GrBlobTransfer = class GrBlobTransfer extends wfc.WObject {

	/**
	 * @since 1
	 *
	 */
	close () {
		this.connection._marshall(this._id, 1, [])
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 * @since 1
			 *
			 */
			release() {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.release.call(this.listener)
	}

}


/**
 *
 *            Clients can handle the 'done' event to get notified when
 *            the related request is done.
 *        
 */
wfc.GrCallback = class GrCallback extends wfc.WObject {

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                Notify the client when the related request is done.
			 *            
			 *
			 * @param {Number} callbackData request-specific data for the callback 
			 *
			 * @since 1
			 *
			 */
			done(callbackData) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.done.call(this.listener, args[0])
	}

}


/**
 *
 *            A compositor.  This object is a singleton global.  The
 *            compositor is in charge of combining the contents of multiple
 *            surfaces into one displayable output.
 *        
 */
wfc.GrCompositor = class GrCompositor extends wfc.WObject {

	/**
	 *
	 *                Ask the compositor to create a new surface.
	 *            
	 *
	 * @return {gr_surface} the new surface 
	 *
	 * @since 1
	 *
	 */
	createSurface () {
		return this.connection._marshallConstructor(this._id, 1, "GrSurface", [wfc._newObject()])
	}

	/**
	 *
	 *                Ask the compositor to create a new region.
	 *            
	 *
	 * @return {gr_region} the new region 
	 *
	 * @since 1
	 *
	 */
	createRegion () {
		return this.connection._marshallConstructor(this._id, 2, "GrRegion", [wfc._newObject()])
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {
		})
	}

}


/**
 *
 *            A buffer provides the content for a gr_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 *        
 */
wfc.GrBuffer = class GrBuffer extends wfc.WObject {

	/**
	 *
	 *                Destroy a buffer. If and how you need to release the backing
	 *                storage is defined by the buffer factory interface.
	 *
	 *                For possible side-effects to a surface, see gr_surface.attach.
	 *            
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                Sent when this gr_buffer is no longer used by the compositor.
			 *                The client is now free to reuse or destroy this buffer and its
			 *                backing storage.
			 *
			 *                If a client receives a release event before the frame callback
			 *                requested in the same gr_surface.commit that attaches this
			 *                gr_buffer to a surface, then the client is immediately free to
			 *                reuse the buffer and its backing storage, and does not need a
			 *                second buffer for the next surface content update. Typically
			 *                this is possible, when the compositor maintains a copy of the
			 *                gr_surface contents, e.g. as a GL texture. This is an important
			 *                optimization for GL(ES) compositors with gr_shm clients.
			 *            
			 * @since 1
			 *
			 */
			release() {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.release.call(this.listener)
	}

}


/**
 *
 *            A gr_data_offer represents a piece of data offered for transfer
 *            by another client (the source client).  It is used by the
 *            copy-and-paste and drag-and-drop mechanisms.  The offer
 *            describes the different mime types that the data can be
 *            converted to and provides the mechanism for transferring the
 *            data directly from the source client.
 *        
 */
wfc.GrDataOffer = class GrDataOffer extends wfc.WObject {

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
	 * @param {Number} serial serial number of the accept request 
	 * @param {?string} mimeType mime type accepted by the client 
	 *
	 * @since 1
	 *
	 */
	accept (serial, mimeType) {
		this.connection._marshall(this._id, 1, [wfc._uint(serial), wfc._stringOptional(mimeType)])
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
	 * @param {string} mimeType mime type desired by receiver 
	 * @param {Number} fd file descriptor for data transfer 
	 *
	 * @since 1
	 *
	 */
	receive (mimeType, fd) {
		this.connection._marshall(this._id, 2, [wfc._string(mimeType), wfc._uint(fd)])
	}

	/**
	 *
	 *                Destroy the data offer.
	 *            
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 3, [])
		this.connection._deleteObject(this)
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
	 * @since 3
	 *
	 */
	finish () {
		this.connection._marshall(this._id, 4, [])
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
	 * @param {Number} dndActions actions supported by the destination client 
	 * @param {Number} preferredAction action preferred by the destination client 
	 *
	 * @since 3
	 *
	 */
	setActions (dndActions, preferredAction) {
		this.connection._marshall(this._id, 5, [wfc._uint(dndActions), wfc._uint(preferredAction)])
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                Sent immediately after creating the gr_data_offer object.  One
			 *                event per offered mime type.
			 *            
			 *
			 * @param {string} mimeType offered mime type 
			 *
			 * @since 1
			 *
			 */
			offer(mimeType) {},

			/**
			 *
			 *                This event indicates the actions offered by the data source. It
			 *                will be sent right after gr_data_device.enter, or anytime the source
			 *                side changes its offered actions through gr_data_source.set_actions.
			 *            
			 *
			 * @param {Number} sourceActions actions offered by the data source 
			 *
			 * @since 3
			 *
			 */
			sourceActions(sourceActions) {},

			/**
			 *
			 *                This event indicates the action selected by the compositor after
			 *                matching the source/destination side actions. Only one action (or
			 *                none) will be offered here.
			 *
			 *                This event can be emitted multiple times during the drag-and-drop
			 *                operation in response to destination side action changes through
			 *                gr_data_offer.set_actions.
			 *
			 *                This event will no longer be emitted after gr_data_device.drop
			 *                happened on the drag-and-drop destination, the client must
			 *                honor the last action received, or the last preferred one set
			 *                through gr_data_offer.set_actions when handling an "ask" action.
			 *
			 *                Compositors may also change the selected action on the fly, mainly
			 *                in response to keyboard modifier changes during the drag-and-drop
			 *                operation.
			 *
			 *                The most recent action received is always the valid one. Prior to
			 *                receiving gr_data_device.drop, the chosen action may change (e.g.
			 *                due to keyboard modifiers being pressed). At the time of receiving
			 *                gr_data_device.drop the drag-and-drop destination must honor the
			 *                last action received.
			 *
			 *                Action changes may still happen after gr_data_device.drop,
			 *                especially on "ask" actions, where the drag-and-drop destination
			 *                may choose another action afterwards. Action changes happening
			 *                at this stage are always the result of inter-client negotiation, the
			 *                compositor shall no longer be able to induce a different action.
			 *
			 *                Upon "ask" actions, it is expected that the drag-and-drop destination
			 *                may potentially choose a different action and/or mime type,
			 *                based on gr_data_offer.source_actions and finally chosen by the
			 *                user (e.g. popping up a menu with the available options). The
			 *                final gr_data_offer.set_actions and gr_data_offer.accept requests
			 *                must happen before the call to gr_data_offer.finish.
			 *            
			 *
			 * @param {Number} dndAction action selected by the compositor 
			 *
			 * @since 3
			 *
			 */
			action(dndAction) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"s");
		this.listener.offer.call(this.listener, args[0])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.sourceActions.call(this.listener, args[0])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.action.call(this.listener, args[0])
	}

}

wfc.GrDataOffer.Error = {
  /**
   * finish request was called untimely
   */
  invalidFinish: 0,
  /**
   * action mask contains invalid values
   */
  invalidActionMask: 1,
  /**
   * action argument has an invalid value
   */
  invalidAction: 2,
  /**
   * offer doesn't accept this request
   */
  invalidOffer: 3
}


/**
 *
 *            The gr_data_source object is the source side of a gr_data_offer.
 *            It is created by the source client in a data transfer and
 *            provides a way to describe the offered data and a way to respond
 *            to requests to transfer the data.
 *        
 */
wfc.GrDataSource = class GrDataSource extends wfc.WObject {

	/**
	 *
	 *                This request adds a mime type to the set of mime types
	 *                advertised to targets.  Can be called several times to offer
	 *                multiple types.
	 *            
	 *
	 * @param {string} mimeType mime type offered by the data source 
	 *
	 * @since 1
	 *
	 */
	offer (mimeType) {
		this.connection._marshall(this._id, 1, [wfc._string(mimeType)])
	}

	/**
	 *
	 *                Destroy the data source.
	 *            
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 2, [])
		this.connection._deleteObject(this)
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
	 * @param {Number} dndActions actions supported by the data source 
	 *
	 * @since 3
	 *
	 */
	setActions (dndActions) {
		this.connection._marshall(this._id, 3, [wfc._uint(dndActions)])
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                Sent when a target accepts pointer_focus or motion events.  If
			 *                a target does not accept any of the offered types, type is NULL.
			 *
			 *                Used for feedback during drag-and-drop.
			 *            
			 *
			 * @param {?string} mimeType mime type accepted by the target 
			 *
			 * @since 1
			 *
			 */
			target(mimeType) {},

			/**
			 *
			 *                Request for data from the client.  Send the data as the
			 *                specified mime type over the passed file descriptor, then
			 *                close it.
			 *            
			 *
			 * @param {string} mimeType mime type for the data 
			 * @param {Number} fd file descriptor for the data 
			 *
			 * @since 1
			 *
			 */
			send(mimeType, fd) {},

			/**
			 *
			 *                This data source is no longer valid. There are several reasons why
			 *                this could happen:
			 *
			 *                 - The data source has been replaced by another data source.
			 *                 - The drag-and-drop operation was performed, but the drop destination
			 *                did not accept any of the mime types offered through
			 *                gr_data_source.target.
			 *                 - The drag-and-drop operation was performed, but the drop destination
			 *                did not select any of the actions present in the mask offered through
			 *                gr_data_source.action.
			 *                 - The drag-and-drop operation was performed but didn't happen over a
			 *                surface.
			 *                 - The compositor cancelled the drag-and-drop operation (e.g. compositor
			 *                dependent timeouts to avoid stale drag-and-drop transfers).
			 *
			 *                The client should clean up and destroy this data source.
			 *
			 *                For objects of version 2 or older, gr_data_source.cancelled will
			 *                only be emitted if the data source was replaced by another data
			 *                source.
			 *            
			 * @since 1
			 *
			 */
			cancelled() {},

			/**
			 *
			 *                The user performed the drop action. This event does not indicate
			 *                acceptance, gr_data_source.cancelled may still be emitted afterwards
			 *                if the drop destination does not accept any mime type.
			 *
			 *                However, this event might however not be received if the compositor
			 *                cancelled the drag-and-drop operation before this event could happen.
			 *
			 *                Note that the data_source may still be used in the future and should
			 *                not be destroyed here.
			 *            
			 * @since 3
			 *
			 */
			dndDropPerformed() {},

			/**
			 *
			 *                The drop destination finished interoperating with this data
			 *                source, so the client is now free to destroy this data source and
			 *                free all associated data.
			 *
			 *                If the action used to perform the operation was "move", the
			 *                source can now delete the transferred data.
			 *            
			 * @since 3
			 *
			 */
			dndFinished() {},

			/**
			 *
			 *                This event indicates the action selected by the compositor after
			 *                matching the source/destination side actions. Only one action (or
			 *                none) will be offered here.
			 *
			 *                This event can be emitted multiple times during the drag-and-drop
			 *                operation, mainly in response to destination side changes through
			 *                gr_data_offer.set_actions, and as the data device enters/leaves
			 *                surfaces.
			 *
			 *                It is only possible to receive this event after
			 *                gr_data_source.dnd_drop_performed if the drag-and-drop operation
			 *                ended in an "ask" action, in which case the final gr_data_source.action
			 *                event will happen immediately before gr_data_source.dnd_finished.
			 *
			 *                Compositors may also change the selected action on the fly, mainly
			 *                in response to keyboard modifier changes during the drag-and-drop
			 *                operation.
			 *
			 *                The most recent action received is always the valid one. The chosen
			 *                action may change alongside negotiation (e.g. an "ask" action can turn
			 *                into a "move" operation), so the effects of the final action must
			 *                always be applied in gr_data_offer.dnd_finished.
			 *
			 *                Clients can trigger cursor surface changes from this point, so
			 *                they reflect the current action.
			 *            
			 *
			 * @param {Number} dndAction action selected by the compositor 
			 *
			 * @since 3
			 *
			 */
			action(dndAction) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"?s");
		this.listener.target.call(this.listener, args[0])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"su");
		this.listener.send.call(this.listener, args[0], args[1])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.cancelled.call(this.listener)
	}

	[4] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.dndDropPerformed.call(this.listener)
	}

	[5] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.dndFinished.call(this.listener)
	}

	[6] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.action.call(this.listener, args[0])
	}

}

wfc.GrDataSource.Error = {
  /**
   * action mask contains invalid values
   */
  invalidActionMask: 0,
  /**
   * source doesn't accept this request
   */
  invalidSource: 1
}


/**
 *
 *            There is one gr_data_device per seat which can be obtained
 *            from the global gr_data_device_manager singleton.
 *
 *            A gr_data_device provides access to inter-client data transfer
 *            mechanisms such as copy-and-paste and drag-and-drop.
 *        
 */
wfc.GrDataDevice = class GrDataDevice extends wfc.WObject {

	/**
	 *
	 *                This request asks the compositor to start a drag-and-drop
	 *                operation on behalf of the client.
	 *
	 *                The source argument is the data source that provides the data
	 *                for the eventual data transfer. If source is NULL, enter, leave
	 *                and motion events are sent only to the client that initiated the
	 *                drag and the client is expected to handle the data passing
	 *                internally.
	 *
	 *                The origin surface is the surface where the drag originates and
	 *                the client must have an active implicit grab that matches the
	 *                serial.
	 *
	 *                The icon surface is an optional (can be NULL) surface that
	 *                provides an icon to be moved around with the cursor.  Initially,
	 *                the top-left corner of the icon surface is placed at the cursor
	 *                hotspot, but subsequent gr_surface.attach request can move the
	 *                relative position. Attach requests must be confirmed with
	 *                gr_surface.commit as usual. The icon surface is given the role of
	 *                a drag-and-drop icon. If the icon surface already has another role,
	 *                it raises a protocol error.
	 *
	 *                The current and pending input regions of the icon gr_surface are
	 *                cleared, and gr_surface.set_input_region is ignored until the
	 *                gr_surface is no longer used as the icon surface. When the use
	 *                as an icon ends, the current and pending input regions become
	 *                undefined, and the gr_surface is unmapped.
	 *            
	 *
	 * @param {?*} source data source for the eventual transfer 
	 * @param {*} origin surface where the drag originates 
	 * @param {?*} icon drag-and-drop icon surface 
	 * @param {Number} serial serial number of the implicit grab on the origin 
	 *
	 * @since 1
	 *
	 */
	startDrag (source, origin, icon, serial) {
		this.connection._marshall(this._id, 1, [wfc._objectOptional(source), wfc._object(origin), wfc._objectOptional(icon), wfc._uint(serial)])
	}

	/**
	 *
	 *                This request asks the compositor to set the selection
	 *                to the data from the source on behalf of the client.
	 *
	 *                To unset the selection, set the source to NULL.
	 *            
	 *
	 * @param {?*} source data source for the selection 
	 * @param {Number} serial serial number of the event that triggered this request 
	 *
	 * @since 1
	 *
	 */
	setSelection (source, serial) {
		this.connection._marshall(this._id, 2, [wfc._objectOptional(source), wfc._uint(serial)])
	}

	/**
	 *
	 *                This request destroys the data device.
	 *            
	 * @since 2
	 *
	 */
	release () {
		this.connection._marshall(this._id, 3, [])
		this.connection._deleteObject(this)
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                The data_offer event introduces a new gr_data_offer object,
			 *                which will subsequently be used in either the
			 *                data_device.enter event (for drag-and-drop) or the
			 *                data_device.selection event (for selections).  Immediately
			 *                following the data_device_data_offer event, the new data_offer
			 *                object will send out data_offer.offer events to describe the
			 *                mime types it offers.
			 *            
			 *
			 * @param {*} id the new data_offer object 
			 *
			 * @since 1
			 *
			 */
			dataOffer(id) {},

			/**
			 *
			 *                This event is sent when an active drag-and-drop pointer enters
			 *                a surface owned by the client.  The position of the pointer at
			 *                enter time is provided by the x and y arguments, in surface-local
			 *                coordinates.
			 *            
			 *
			 * @param {Number} serial serial number of the enter event 
			 * @param {*} surface client surface entered 
			 * @param {Fixed} x surface-local x coordinate 
			 * @param {Fixed} y surface-local y coordinate 
			 * @param {?*} id source data_offer object 
			 *
			 * @since 1
			 *
			 */
			enter(serial, surface, x, y, id) {},

			/**
			 *
			 *                This event is sent when the drag-and-drop pointer leaves the
			 *                surface and the session ends.  The client must destroy the
			 *                gr_data_offer introduced at enter time at this point.
			 *            
			 * @since 1
			 *
			 */
			leave() {},

			/**
			 *
			 *                This event is sent when the drag-and-drop pointer moves within
			 *                the currently focused surface. The new position of the pointer
			 *                is provided by the x and y arguments, in surface-local
			 *                coordinates.
			 *            
			 *
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Fixed} x surface-local x coordinate 
			 * @param {Fixed} y surface-local y coordinate 
			 *
			 * @since 1
			 *
			 */
			motion(time, x, y) {},

			/**
			 *
			 *                The event is sent when a drag-and-drop operation is ended
			 *                because the implicit grab is removed.
			 *
			 *                The drag-and-drop destination is expected to honor the last action
			 *                received through gr_data_offer.action, if the resulting action is
			 *                "copy" or "move", the destination can still perform
			 *                gr_data_offer.receive requests, and is expected to end all
			 *                transfers with a gr_data_offer.finish request.
			 *
			 *                If the resulting action is "ask", the action will not be considered
			 *                final. The drag-and-drop destination is expected to perform one last
			 *                gr_data_offer.set_actions request, or gr_data_offer.destroy in order
			 *                to cancel the operation.
			 *            
			 * @since 1
			 *
			 */
			drop() {},

			/**
			 *
			 *                The selection event is sent out to notify the client of a new
			 *                gr_data_offer for the selection for this device.  The
			 *                data_device.data_offer and the data_offer.offer events are
			 *                sent out immediately before this event to introduce the data
			 *                offer object.  The selection event is sent to a client
			 *                immediately before receiving keyboard focus and when a new
			 *                selection is set while the client has keyboard focus.  The
			 *                data_offer is valid until a new data_offer or NULL is received
			 *                or until the client loses keyboard focus.  The client must
			 *                destroy the previous selection data_offer, if any, upon receiving
			 *                this event.
			 *            
			 *
			 * @param {?*} id selection data_offer object 
			 *
			 * @since 1
			 *
			 */
			selection(id) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"n");
		this.listener.dataOffer.call(this.listener, args[0]("GrDataOffer"))
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"uoff?o");
		this.listener.enter.call(this.listener, args[0], args[1], args[2], args[3], args[4])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.leave.call(this.listener)
	}

	[4] (message) {
		const args = this.connection._unmarshallArgs(message,"uff");
		this.listener.motion.call(this.listener, args[0], args[1], args[2])
	}

	[5] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.drop.call(this.listener)
	}

	[6] (message) {
		const args = this.connection._unmarshallArgs(message,"?o");
		this.listener.selection.call(this.listener, args[0])
	}

}

wfc.GrDataDevice.Error = {
  /**
   * given gr_surface has another role
   */
  role: 0
}


/**
 *
 *            The gr_data_device_manager is a singleton global object that
 *            provides access to inter-client data transfer mechanisms such as
 *            copy-and-paste and drag-and-drop.  These mechanisms are tied to
 *            a gr_seat and this interface lets a client get a gr_data_device
 *            corresponding to a gr_seat.
 *
 *            Depending on the version bound, the objects created from the bound
 *            gr_data_device_manager object will have different requirements for
 *            functioning properly. See gr_data_source.set_actions,
 *            gr_data_offer.accept and gr_data_offer.finish for details.
 *        
 */
wfc.GrDataDeviceManager = class GrDataDeviceManager extends wfc.WObject {

	/**
	 *
	 *                Create a new data source.
	 *            
	 *
	 * @return {gr_data_source} data source to create 
	 *
	 * @since 1
	 *
	 */
	createDataSource () {
		return this.connection._marshallConstructor(this._id, 1, "GrDataSource", [wfc._newObject()])
	}

	/**
	 *
	 *                Create a new data device for a given seat.
	 *            
	 *
	 * @param {*} seat seat associated with the data device 
	 * @return {gr_data_device} data device to create 
	 *
	 * @since 1
	 *
	 */
	getDataDevice (seat) {
		return this.connection._marshallConstructor(this._id, 2, "GrDataDevice", [wfc._newObject(), wfc._object(seat)])
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {
		})
	}

}

wfc.GrDataDeviceManager.DndAction = {
  /**
   * no action
   */
  none: 0,
  /**
   * copy action
   */
  copy: 1,
  /**
   * move action
   */
  move: 2,
  /**
   * ask action
   */
  ask: 4
}


/**
 *
 *            This interface is implemented by servers that provide
 *            desktop-style user interfaces.
 *
 *            It allows clients to associate a gr_shell_surface with
 *            a basic surface.
 *        
 */
wfc.GrShell = class GrShell extends wfc.WObject {

	/**
	 *
	 *                Create a shell surface for an existing surface. This gives
	 *                the gr_surface the role of a shell surface. If the gr_surface
	 *                already has another role, it raises a protocol error.
	 *
	 *                Only one shell surface can be associated with a given surface.
	 *            
	 *
	 * @param {*} surface surface to be given the shell surface role 
	 * @return {gr_shell_surface} shell surface to create 
	 *
	 * @since 1
	 *
	 */
	getShellSurface (surface) {
		return this.connection._marshallConstructor(this._id, 1, "GrShellSurface", [wfc._newObject(), wfc._object(surface)])
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {
		})
	}

}

wfc.GrShell.Error = {
  /**
   * given gr_surface has another role
   */
  role: 0
}


/**
 *
 *            An interface that may be implemented by a gr_surface, for
 *            implementations that provide a desktop-style user interface.
 *
 *            It provides requests to treat surfaces like toplevel, fullscreen
 *            or popup windows, move, resize or maximize them, associate
 *            metadata like title and class, etc.
 *
 *            On the server side the object is automatically destroyed when
 *            the related gr_surface is destroyed. On the client side,
 *            gr_shell_surface_destroy() must be called before destroying
 *            the gr_surface object.
 *        
 */
wfc.GrShellSurface = class GrShellSurface extends wfc.WObject {

	/**
	 *
	 *                A client must respond to a ping event with a pong request or
	 *                the client may be deemed unresponsive.
	 *            
	 *
	 * @param {Number} serial serial number of the ping event 
	 *
	 * @since 1
	 *
	 */
	pong (serial) {
		this.connection._marshall(this._id, 1, [wfc._uint(serial)])
	}

	/**
	 *
	 *                Start a pointer-driven move of the surface.
	 *
	 *                This request must be used in response to a button press event.
	 *                The server may ignore move requests depending on the state of
	 *                the surface (e.g. fullscreen or maximized).
	 *            
	 *
	 * @param {*} seat seat whose pointer is used 
	 * @param {Number} serial serial number of the implicit grab on the pointer 
	 *
	 * @since 1
	 *
	 */
	move (seat, serial) {
		this.connection._marshall(this._id, 2, [wfc._object(seat), wfc._uint(serial)])
	}

	/**
	 *
	 *                Start a pointer-driven resizing of the surface.
	 *
	 *                This request must be used in response to a button press event.
	 *                The server may ignore resize requests depending on the state of
	 *                the surface (e.g. fullscreen or maximized).
	 *            
	 *
	 * @param {*} seat seat whose pointer is used 
	 * @param {Number} serial serial number of the implicit grab on the pointer 
	 * @param {Number} edges which edge or corner is being dragged 
	 *
	 * @since 1
	 *
	 */
	resize (seat, serial, edges) {
		this.connection._marshall(this._id, 3, [wfc._object(seat), wfc._uint(serial), wfc._uint(edges)])
	}

	/**
	 *
	 *                Map the surface as a toplevel surface.
	 *
	 *                A toplevel surface is not fullscreen, maximized or transient.
	 *            
	 * @since 1
	 *
	 */
	setToplevel () {
		this.connection._marshall(this._id, 4, [])
	}

	/**
	 *
	 *                Map the surface relative to an existing surface.
	 *
	 *                The x and y arguments specify the location of the upper left
	 *                corner of the surface relative to the upper left corner of the
	 *                parent surface, in surface-local coordinates.
	 *
	 *                The flags argument controls details of the transient behaviour.
	 *            
	 *
	 * @param {*} parent parent surface 
	 * @param {Number} x surface-local x coordinate 
	 * @param {Number} y surface-local y coordinate 
	 * @param {Number} flags transient surface behavior 
	 *
	 * @since 1
	 *
	 */
	setTransient (parent, x, y, flags) {
		this.connection._marshall(this._id, 5, [wfc._object(parent), wfc._int(x), wfc._int(y), wfc._uint(flags)])
	}

	/**
	 *
	 *                Map the surface as a fullscreen surface.
	 *
	 *                If an output parameter is given then the surface will be made
	 *                fullscreen on that output. If the client does not specify the
	 *                output then the compositor will apply its policy - usually
	 *                choosing the output on which the surface has the biggest surface
	 *                area.
	 *
	 *                The client may specify a method to resolve a size conflict
	 *                between the output size and the surface size - this is provided
	 *                through the method parameter.
	 *
	 *                The framerate parameter is used only when the method is set
	 *                to "driver", to indicate the preferred framerate. A value of 0
	 *                indicates that the client does not care about framerate.  The
	 *                framerate is specified in mHz, that is framerate of 60000 is 60Hz.
	 *
	 *                A method of "scale" or "driver" implies a scaling operation of
	 *                the surface, either via a direct scaling operation or a change of
	 *                the output mode. This will override any kind of output scaling, so
	 *                that mapping a surface with a buffer size equal to the mode can
	 *                fill the screen independent of buffer_scale.
	 *
	 *                A method of "fill" means we don't scale up the buffer, however
	 *                any output scale is applied. This means that you may run into
	 *                an edge case where the application maps a buffer with the same
	 *                size of the output mode but buffer_scale 1 (thus making a
	 *                surface larger than the output). In this case it is allowed to
	 *                downscale the results to fit the screen.
	 *
	 *                The compositor must reply to this request with a configure event
	 *                with the dimensions for the output on which the surface will
	 *                be made fullscreen.
	 *            
	 *
	 * @param {Number} method method for resolving size conflict 
	 * @param {Number} framerate framerate in mHz 
	 * @param {?*} output output on which the surface is to be fullscreen 
	 *
	 * @since 1
	 *
	 */
	setFullscreen (method, framerate, output) {
		this.connection._marshall(this._id, 6, [wfc._uint(method), wfc._uint(framerate), wfc._objectOptional(output)])
	}

	/**
	 *
	 *                Map the surface as a popup.
	 *
	 *                A popup surface is a transient surface with an added pointer
	 *                grab.
	 *
	 *                An existing implicit grab will be changed to owner-events mode,
	 *                and the popup grab will continue after the implicit grab ends
	 *                (i.e. releasing the mouse button does not cause the popup to
	 *                be unmapped).
	 *
	 *                The popup grab continues until the window is destroyed or a
	 *                mouse button is pressed in any other client's window. A click
	 *                in any of the client's surfaces is reported as normal, however,
	 *                clicks in other clients' surfaces will be discarded and trigger
	 *                the callback.
	 *
	 *                The x and y arguments specify the location of the upper left
	 *                corner of the surface relative to the upper left corner of the
	 *                parent surface, in surface-local coordinates.
	 *            
	 *
	 * @param {*} seat seat whose pointer is used 
	 * @param {Number} serial serial number of the implicit grab on the pointer 
	 * @param {*} parent parent surface 
	 * @param {Number} x surface-local x coordinate 
	 * @param {Number} y surface-local y coordinate 
	 * @param {Number} flags transient surface behavior 
	 *
	 * @since 1
	 *
	 */
	setPopup (seat, serial, parent, x, y, flags) {
		this.connection._marshall(this._id, 7, [wfc._object(seat), wfc._uint(serial), wfc._object(parent), wfc._int(x), wfc._int(y), wfc._uint(flags)])
	}

	/**
	 *
	 *                Map the surface as a maximized surface.
	 *
	 *                If an output parameter is given then the surface will be
	 *                maximized on that output. If the client does not specify the
	 *                output then the compositor will apply its policy - usually
	 *                choosing the output on which the surface has the biggest surface
	 *                area.
	 *
	 *                The compositor will reply with a configure event telling
	 *                the expected new surface size. The operation is completed
	 *                on the next buffer attach to this surface.
	 *
	 *                A maximized surface typically fills the entire output it is
	 *                bound to, except for desktop elements such as panels. This is
	 *                the main difference between a maximized shell surface and a
	 *                fullscreen shell surface.
	 *
	 *                The details depend on the compositor implementation.
	 *            
	 *
	 * @param {?*} output output on which the surface is to be maximized 
	 *
	 * @since 1
	 *
	 */
	setMaximized (output) {
		this.connection._marshall(this._id, 8, [wfc._objectOptional(output)])
	}

	/**
	 *
	 *                Set a short title for the surface.
	 *
	 *                This string may be used to identify the surface in a task bar,
	 *                window list, or other user interface elements provided by the
	 *                compositor.
	 *
	 *                The string must be encoded in UTF-8.
	 *            
	 *
	 * @param {string} title surface title 
	 *
	 * @since 1
	 *
	 */
	setTitle (title) {
		this.connection._marshall(this._id, 9, [wfc._string(title)])
	}

	/**
	 *
	 *                Set a class for the surface.
	 *
	 *                The surface class identifies the general class of applications
	 *                to which the surface belongs. A common convention is to use the
	 *                file name (or the full path if it is a non-standard location) of
	 *                the application's .desktop file as the class.
	 *            
	 *
	 * @param {string} clazz surface class 
	 *
	 * @since 1
	 *
	 */
	setClass (clazz) {
		this.connection._marshall(this._id, 10, [wfc._string(clazz)])
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                Ping a client to check if it is receiving events and sending
			 *                requests. A client is expected to reply with a pong request.
			 *            
			 *
			 * @param {Number} serial serial number of the ping 
			 *
			 * @since 1
			 *
			 */
			ping(serial) {},

			/**
			 *
			 *                The configure event asks the client to resize its surface.
			 *
			 *                The size is a hint, in the sense that the client is free to
			 *                ignore it if it doesn't resize, pick a smaller size (to
			 *                satisfy aspect ratio or resize in steps of NxM pixels).
			 *
			 *                The edges parameter provides a hint about how the surface
			 *                was resized. The client may use this information to decide
			 *                how to adjust its content to the new size (e.g. a scrolling
			 *                area might adjust its content position to leave the viewable
			 *                content unmoved).
			 *
			 *                The client is free to dismiss all but the last configure
			 *                event it received.
			 *
			 *                The width and height arguments specify the size of the window
			 *                in surface-local coordinates.
			 *            
			 *
			 * @param {Number} edges how the surface was resized 
			 * @param {Number} width new width of the surface 
			 * @param {Number} height new height of the surface 
			 *
			 * @since 1
			 *
			 */
			configure(edges, width, height) {},

			/**
			 *
			 *                The popup_done event is sent out when a popup grab is broken,
			 *                that is, when the user clicks a surface that doesn't belong
			 *                to the client owning the popup surface.
			 *            
			 * @since 1
			 *
			 */
			popupDone() {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.ping.call(this.listener, args[0])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"uii");
		this.listener.configure.call(this.listener, args[0], args[1], args[2])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.popupDone.call(this.listener)
	}

}

wfc.GrShellSurface.Resize = {
  /**
   * no edge
   */
  none: 0,
  /**
   * top edge
   */
  top: 1,
  /**
   * bottom edge
   */
  bottom: 2,
  /**
   * left edge
   */
  left: 4,
  /**
   * top and left edges
   */
  topLeft: 5,
  /**
   * bottom and left edges
   */
  bottomLeft: 6,
  /**
   * right edge
   */
  right: 8,
  /**
   * top and right edges
   */
  topRight: 9,
  /**
   * bottom and right edges
   */
  bottomRight: 10
}

wfc.GrShellSurface.Transient = {
  /**
   * do not set keyboard focus
   */
  inactive: 0x1
}

wfc.GrShellSurface.FullscreenMethod = {
  /**
   * no preference, apply default policy
   */
  default: 0,
  /**
   * scale, preserve the surface's aspect ratio and center on output
   */
  scale: 1,
  /**
   * switch output mode to the smallest mode that can fit the surface, add black borders to compensate size mismatch
   */
  driver: 2,
  /**
   * no upscaling, center on output and add black borders to compensate size mismatch
   */
  fill: 3
}


/**
 *
 *            A surface is a rectangular area that is displayed on the screen.
 *            It has a location, size and pixel contents.
 *
 *            The size of a surface (and relative positions on it) is described
 *            in surface-local coordinates, which may differ from the buffer
 *            coordinates of the pixel content, in case a buffer_transform
 *            or a buffer_scale is used.
 *
 *            A surface without a "role" is fairly useless: a compositor does
 *            not know where, when or how to present it. The role is the
 *            purpose of a gr_surface. Examples of roles are a cursor for a
 *            pointer (as set by gr_pointer.set_cursor), a drag icon
 *            (gr_data_device.start_drag), a sub-surface
 *            (gr_subcompositor.get_subsurface), and a window as defined by a
 *            shell protocol (e.g. gr_shell.get_shell_surface).
 *
 *            A surface can have only one role at a time. Initially a
 *            gr_surface does not have a role. Once a gr_surface is given a
 *            role, it is set permanently for the whole lifetime of the
 *            gr_surface object. Giving the current role again is allowed,
 *            unless explicitly forbidden by the relevant interface
 *            specification.
 *
 *            Surface roles are given by requests in other interfaces such as
 *            gr_pointer.set_cursor. The request should explicitly mention
 *            that this request gives a role to a gr_surface. Often, this
 *            request also creates a new protocol object that represents the
 *            role and adds additional functionality to gr_surface. When a
 *            client wants to destroy a gr_surface, they must destroy this 'role
 *            object' before the gr_surface.
 *
 *            Destroying the role object does not remove the role from the
 *            gr_surface, but it may stop the gr_surface from "playing the role".
 *            For instance, if a gr_subsurface object is destroyed, the gr_surface
 *            it was created for will be unmapped and forget its position and
 *            z-order. It is allowed to create a gr_subsurface for the same
 *            gr_surface again, but it is not allowed to use the gr_surface as
 *            a cursor (cursor is a different role than sub-surface, and role
 *            switching is not allowed).
 *        
 */
wfc.GrSurface = class GrSurface extends wfc.WObject {

	/**
	 *
	 *                Deletes the surface and invalidates its object ID.
	 *            
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}

	/**
	 *
	 *                Set a buffer as the content of this surface.
	 *
	 *                The new size of the surface is calculated based on the buffer
	 *                size transformed by the inverse buffer_transform and the
	 *                inverse buffer_scale. This means that the supplied buffer
	 *                must be an integer multiple of the buffer_scale.
	 *
	 *                The x and y arguments specify the location of the new pending
	 *                buffer's upper left corner, relative to the current buffer's upper
	 *                left corner, in surface-local coordinates. In other words, the
	 *                x and y, combined with the new surface size define in which
	 *                directions the surface's size changes.
	 *
	 *                Surface contents are double-buffered state, see gr_surface.commit.
	 *
	 *                The initial surface contents are void; there is no content.
	 *                gr_surface.attach assigns the given gr_buffer as the pending
	 *                gr_buffer. gr_surface.commit makes the pending gr_buffer the new
	 *                surface contents, and the size of the surface becomes the size
	 *                calculated from the gr_buffer, as described above. After commit,
	 *                there is no pending buffer until the next attach.
	 *
	 *                Committing a pending gr_buffer allows the compositor to read the
	 *                pixels in the gr_buffer. The compositor may access the pixels at
	 *                any time after the gr_surface.commit request. When the compositor
	 *                will not access the pixels anymore, it will send the
	 *                gr_buffer.release event. Only after receiving gr_buffer.release,
	 *                the client may reuse the gr_buffer. A gr_buffer that has been
	 *                attached and then replaced by another attach instead of committed
	 *                will not receive a release event, and is not used by the
	 *                compositor.
	 *
	 *                Destroying the gr_buffer after gr_buffer.release does not change
	 *                the surface contents. However, if the client destroys the
	 *                gr_buffer before receiving the gr_buffer.release event, the surface
	 *                contents become undefined immediately.
	 *
	 *                If gr_surface.attach is sent with a NULL gr_buffer, the
	 *                following gr_surface.commit will remove the surface content.
	 *            
	 *
	 * @param {?*} buffer buffer of surface contents 
	 * @param {Number} x surface-local x coordinate 
	 * @param {Number} y surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	attach (buffer, x, y) {
		this.connection._marshall(this._id, 2, [wfc._objectOptional(buffer), wfc._int(x), wfc._int(y)])
	}

	/**
	 *
	 *                This request is used to describe the regions where the pending
	 *                buffer is different from the current surface contents, and where
	 *                the surface therefore needs to be repainted. The compositor
	 *                ignores the parts of the damage that fall outside of the surface.
	 *
	 *                Damage is double-buffered state, see gr_surface.commit.
	 *
	 *                The damage rectangle is specified in surface-local coordinates,
	 *                where x and y specify the upper left corner of the damage rectangle.
	 *
	 *                The initial value for pending damage is empty: no damage.
	 *                gr_surface.damage adds pending damage: the new pending damage
	 *                is the union of old pending damage and the given rectangle.
	 *
	 *                gr_surface.commit assigns pending damage as the current damage,
	 *                and clears pending damage. The server will clear the current
	 *                damage as it repaints the surface.
	 *
	 *                Alternatively, damage can be posted with gr_surface.damage_buffer
	 *                which uses buffer coordinates instead of surface coordinates,
	 *                and is probably the preferred and intuitive way of doing this.
	 *            
	 *
	 * @param {Number} x surface-local x coordinate 
	 * @param {Number} y surface-local y coordinate 
	 * @param {Number} width width of damage rectangle 
	 * @param {Number} height height of damage rectangle 
	 *
	 * @since 1
	 *
	 */
	damage (x, y, width, height) {
		this.connection._marshall(this._id, 3, [wfc._int(x), wfc._int(y), wfc._int(width), wfc._int(height)])
	}

	/**
	 *
	 *                Request a notification when it is a good time to start drawing a new
	 *                frame, by creating a frame callback. This is useful for throttling
	 *                redrawing operations, and driving animations.
	 *
	 *                When a client is animating on a gr_surface, it can use the 'frame'
	 *                request to get notified when it is a good time to draw and commit the
	 *                next frame of animation. If the client commits an update earlier than
	 *                that, it is likely that some updates will not make it to the display,
	 *                and the client is wasting resources by drawing too often.
	 *
	 *                The frame request will take effect on the next gr_surface.commit.
	 *                The notification will only be posted for one frame unless
	 *                requested again. For a gr_surface, the notifications are posted in
	 *                the order the frame requests were committed.
	 *
	 *                The server must send the notifications so that a client
	 *                will not send excessive updates, while still allowing
	 *                the highest possible update rate for clients that wait for the reply
	 *                before drawing again. The server should give some time for the client
	 *                to draw and commit after sending the frame callback events to let it
	 *                hit the next output refresh.
	 *
	 *                A server should avoid signaling the frame callbacks if the
	 *                surface is not visible in any way, e.g. the surface is off-screen,
	 *                or completely obscured by other opaque surfaces.
	 *
	 *                The object returned by this request will be destroyed by the
	 *                compositor after the callback is fired and as such the client must not
	 *                attempt to use it after that point.
	 *
	 *                The callback_data passed in the callback is the current time, in
	 *                milliseconds, with an undefined base.
	 *            
	 *
	 * @return {gr_callback} callback object for the frame request 
	 *
	 * @since 1
	 *
	 */
	frame () {
		return this.connection._marshallConstructor(this._id, 4, "GrCallback", [wfc._newObject()])
	}

	/**
	 *
	 *                This request sets the region of the surface that contains
	 *                opaque content.
	 *
	 *                The opaque region is an optimization hint for the compositor
	 *                that lets it optimize the redrawing of content behind opaque
	 *                regions.  Setting an opaque region is not required for correct
	 *                behaviour, but marking transparent content as opaque will result
	 *                in repaint artifacts.
	 *
	 *                The opaque region is specified in surface-local coordinates.
	 *
	 *                The compositor ignores the parts of the opaque region that fall
	 *                outside of the surface.
	 *
	 *                Opaque region is double-buffered state, see gr_surface.commit.
	 *
	 *                gr_surface.set_opaque_region changes the pending opaque region.
	 *                gr_surface.commit copies the pending region to the current region.
	 *                Otherwise, the pending and current regions are never changed.
	 *
	 *                The initial value for an opaque region is empty. Setting the pending
	 *                opaque region has copy semantics, and the gr_region object can be
	 *                destroyed immediately. A NULL gr_region causes the pending opaque
	 *                region to be set to empty.
	 *            
	 *
	 * @param {?*} region opaque region of the surface 
	 *
	 * @since 1
	 *
	 */
	setOpaqueRegion (region) {
		this.connection._marshall(this._id, 5, [wfc._objectOptional(region)])
	}

	/**
	 *
	 *                This request sets the region of the surface that can receive
	 *                pointer and touch events.
	 *
	 *                Input events happening outside of this region will try the next
	 *                surface in the server surface stack. The compositor ignores the
	 *                parts of the input region that fall outside of the surface.
	 *
	 *                The input region is specified in surface-local coordinates.
	 *
	 *                Input region is double-buffered state, see gr_surface.commit.
	 *
	 *                gr_surface.set_input_region changes the pending input region.
	 *                gr_surface.commit copies the pending region to the current region.
	 *                Otherwise the pending and current regions are never changed,
	 *                except cursor and icon surfaces are special cases, see
	 *                gr_pointer.set_cursor and gr_data_device.start_drag.
	 *
	 *                The initial value for an input region is infinite. That means the
	 *                whole surface will accept input. Setting the pending input region
	 *                has copy semantics, and the gr_region object can be destroyed
	 *                immediately. A NULL gr_region causes the input region to be set
	 *                to infinite.
	 *            
	 *
	 * @param {?*} region input region of the surface 
	 *
	 * @since 1
	 *
	 */
	setInputRegion (region) {
		this.connection._marshall(this._id, 6, [wfc._objectOptional(region)])
	}

	/**
	 *
	 *                Surface state (input, opaque, and damage regions, attached buffers,
	 *                etc.) is double-buffered. Protocol requests modify the pending state,
	 *                as opposed to the current state in use by the compositor. A commit
	 *                request atomically applies all pending state, replacing the current
	 *                state. After commit, the new pending state is as documented for each
	 *                related request.
	 *
	 *                On commit, a pending gr_buffer is applied first, and all other state
	 *                second. This means that all coordinates in double-buffered state are
	 *                relative to the new gr_buffer coming into use, except for
	 *                gr_surface.attach itself. If there is no pending gr_buffer, the
	 *                coordinates are relative to the current surface contents.
	 *
	 *                All requests that need a commit to become effective are documented
	 *                to affect double-buffered state.
	 *
	 *                Other interfaces may add further double-buffered surface state.
	 *            
	 * @since 1
	 *
	 */
	commit () {
		this.connection._marshall(this._id, 7, [])
	}

	/**
	 *
	 *                This request sets an optional transformation on how the compositor
	 *                interprets the contents of the buffer attached to the surface. The
	 *                accepted values for the transform parameter are the values for
	 *                gr_output.transform.
	 *
	 *                Buffer transform is double-buffered state, see gr_surface.commit.
	 *
	 *                A newly created surface has its buffer transformation set to normal.
	 *
	 *                gr_surface.set_buffer_transform changes the pending buffer
	 *                transformation. gr_surface.commit copies the pending buffer
	 *                transformation to the current one. Otherwise, the pending and current
	 *                values are never changed.
	 *
	 *                The purpose of this request is to allow clients to render content
	 *                according to the output transform, thus permitting the compositor to
	 *                use certain optimizations even if the display is rotated. Using
	 *                hardware overlays and scanning out a client buffer for fullscreen
	 *                surfaces are examples of such optimizations. Those optimizations are
	 *                highly dependent on the compositor implementation, so the use of this
	 *                request should be considered on a case-by-case basis.
	 *
	 *                Note that if the transform value includes 90 or 270 degree rotation,
	 *                the width of the buffer will become the surface height and the height
	 *                of the buffer will become the surface width.
	 *
	 *                If transform is not one of the values from the
	 *                gr_output.transform enum the invalid_transform protocol error
	 *                is raised.
	 *            
	 *
	 * @param {Number} transform transform for interpreting buffer contents 
	 *
	 * @since 2
	 *
	 */
	setBufferTransform (transform) {
		this.connection._marshall(this._id, 8, [wfc._int(transform)])
	}

	/**
	 *
	 *                This request sets an optional scaling factor on how the compositor
	 *                interprets the contents of the buffer attached to the window.
	 *
	 *                Buffer scale is double-buffered state, see gr_surface.commit.
	 *
	 *                A newly created surface has its buffer scale set to 1.
	 *
	 *                gr_surface.set_buffer_scale changes the pending buffer scale.
	 *                gr_surface.commit copies the pending buffer scale to the current one.
	 *                Otherwise, the pending and current values are never changed.
	 *
	 *                The purpose of this request is to allow clients to supply higher
	 *                resolution buffer data for use on high resolution outputs. It is
	 *                intended that you pick the same buffer scale as the scale of the
	 *                output that the surface is displayed on. This means the compositor
	 *                can avoid scaling when rendering the surface on that output.
	 *
	 *                Note that if the scale is larger than 1, then you have to attach
	 *                a buffer that is larger (by a factor of scale in each dimension)
	 *                than the desired surface size.
	 *
	 *                If scale is not positive the invalid_scale protocol error is
	 *                raised.
	 *            
	 *
	 * @param {Number} scale positive scale for interpreting buffer contents 
	 *
	 * @since 3
	 *
	 */
	setBufferScale (scale) {
		this.connection._marshall(this._id, 9, [wfc._int(scale)])
	}

	/**
	 *
	 *                This request is used to describe the regions where the pending
	 *                buffer is different from the current surface contents, and where
	 *                the surface therefore needs to be repainted. The compositor
	 *                ignores the parts of the damage that fall outside of the surface.
	 *
	 *                Damage is double-buffered state, see gr_surface.commit.
	 *
	 *                The damage rectangle is specified in buffer coordinates,
	 *                where x and y specify the upper left corner of the damage rectangle.
	 *
	 *                The initial value for pending damage is empty: no damage.
	 *                gr_surface.damage_buffer adds pending damage: the new pending
	 *                damage is the union of old pending damage and the given rectangle.
	 *
	 *                gr_surface.commit assigns pending damage as the current damage,
	 *                and clears pending damage. The server will clear the current
	 *                damage as it repaints the surface.
	 *
	 *                This request differs from gr_surface.damage in only one way - it
	 *                takes damage in buffer coordinates instead of surface-local
	 *                coordinates. While this generally is more intuitive than surface
	 *                coordinates, it is especially desirable when using wp_viewport
	 *                or when a drawing library (like EGL) is unaware of buffer scale
	 *                and buffer transform.
	 *
	 *                Note: Because buffer transformation changes and damage requests may
	 *                be interleaved in the protocol stream, it is impossible to determine
	 *                the actual mapping between surface and buffer damage until
	 *                gr_surface.commit time. Therefore, compositors wishing to take both
	 *                kinds of damage into account will have to accumulate damage from the
	 *                two requests separately and only transform from one to the other
	 *                after receiving the gr_surface.commit.
	 *            
	 *
	 * @param {Number} x buffer-local x coordinate 
	 * @param {Number} y buffer-local y coordinate 
	 * @param {Number} width width of damage rectangle 
	 * @param {Number} height height of damage rectangle 
	 *
	 * @since 4
	 *
	 */
	damageBuffer (x, y, width, height) {
		this.connection._marshall(this._id, 10, [wfc._int(x), wfc._int(y), wfc._int(width), wfc._int(height)])
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                This is emitted whenever a surface's creation, movement, or resizing
			 *                results in some part of it being within the scanout region of an
			 *                output.
			 *
			 *                Note that a surface may be overlapping with zero or more outputs.
			 *            
			 *
			 * @param {*} output output entered by the surface 
			 *
			 * @since 1
			 *
			 */
			enter(output) {},

			/**
			 *
			 *                This is emitted whenever a surface's creation, movement, or resizing
			 *                results in it no longer having any part of it within the scanout region
			 *                of an output.
			 *            
			 *
			 * @param {*} output output left by the surface 
			 *
			 * @since 1
			 *
			 */
			leave(output) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"o");
		this.listener.enter.call(this.listener, args[0])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"o");
		this.listener.leave.call(this.listener, args[0])
	}

}

wfc.GrSurface.Error = {
  /**
   * buffer scale value is invalid
   */
  invalidScale: 0,
  /**
   * buffer transform value is invalid
   */
  invalidTransform: 1
}


/**
 *
 *            A seat is a group of keyboards, pointer and touch devices. This
 *            object is published as a global during start up, or when such a
 *            device is hot plugged.  A seat typically has a pointer and
 *            maintains a keyboard focus and a pointer focus.
 *        
 */
wfc.GrSeat = class GrSeat extends wfc.WObject {

	/**
	 *
	 *                The ID provided will be initialized to the gr_pointer interface
	 *                for this seat.
	 *
	 *                This request only takes effect if the seat has the pointer
	 *                capability, or has had the pointer capability in the past.
	 *                It is a protocol violation to issue this request on a seat that has
	 *                never had the pointer capability.
	 *            
	 *
	 * @return {gr_pointer} seat pointer 
	 *
	 * @since 1
	 *
	 */
	getPointer () {
		return this.connection._marshallConstructor(this._id, 1, "GrPointer", [wfc._newObject()])
	}

	/**
	 *
	 *                The ID provided will be initialized to the gr_keyboard interface
	 *                for this seat.
	 *
	 *                This request only takes effect if the seat has the keyboard
	 *                capability, or has had the keyboard capability in the past.
	 *                It is a protocol violation to issue this request on a seat that has
	 *                never had the keyboard capability.
	 *            
	 *
	 * @return {gr_keyboard} seat keyboard 
	 *
	 * @since 1
	 *
	 */
	getKeyboard () {
		return this.connection._marshallConstructor(this._id, 2, "GrKeyboard", [wfc._newObject()])
	}

	/**
	 *
	 *                The ID provided will be initialized to the gr_touch interface
	 *                for this seat.
	 *
	 *                This request only takes effect if the seat has the touch
	 *                capability, or has had the touch capability in the past.
	 *                It is a protocol violation to issue this request on a seat that has
	 *                never had the touch capability.
	 *            
	 *
	 * @return {gr_touch} seat touch interface 
	 *
	 * @since 1
	 *
	 */
	getTouch () {
		return this.connection._marshallConstructor(this._id, 3, "GrTouch", [wfc._newObject()])
	}

	/**
	 *
	 *                Using this request a client can tell the server that it is not going to
	 *                use the seat object anymore.
	 *            
	 * @since 5
	 *
	 */
	release () {
		this.connection._marshall(this._id, 4, [])
		this.connection._deleteObject(this)
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                This is emitted whenever a seat gains or loses the pointer,
			 *                keyboard or touch capabilities.  The argument is a capability
			 *                enum containing the complete set of capabilities this seat has.
			 *
			 *                When the pointer capability is added, a client may create a
			 *                gr_pointer object using the gr_seat.get_pointer request. This object
			 *                will receive pointer events until the capability is removed in the
			 *                future.
			 *
			 *                When the pointer capability is removed, a client should destroy the
			 *                gr_pointer objects associated with the seat where the capability was
			 *                removed, using the gr_pointer.release request. No further pointer
			 *                events will be received on these objects.
			 *
			 *                In some compositors, if a seat regains the pointer capability and a
			 *                client has a previously obtained gr_pointer object of version 4 or
			 *                less, that object may start sending pointer events again. This
			 *                behavior is considered a misinterpretation of the intended behavior
			 *                and must not be relied upon by the client. gr_pointer objects of
			 *                version 5 or later must not send events if created before the most
			 *                recent event notifying the client of an added pointer capability.
			 *
			 *                The above behavior also applies to gr_keyboard and gr_touch with the
			 *                keyboard and touch capabilities, respectively.
			 *            
			 *
			 * @param {Number} capabilities capabilities of the seat 
			 *
			 * @since 1
			 *
			 */
			capabilities(capabilities) {},

			/**
			 *
			 *                In a multiseat configuration this can be used by the client to help
			 *                identify which physical devices the seat represents. Based on
			 *                the seat configuration used by the compositor.
			 *            
			 *
			 * @param {string} name seat identifier 
			 *
			 * @since 2
			 *
			 */
			name(name) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.capabilities.call(this.listener, args[0])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"s");
		this.listener.name.call(this.listener, args[0])
	}

}

wfc.GrSeat.Capability = {
  /**
   * the seat has pointer devices
   */
  pointer: 1,
  /**
   * the seat has one or more keyboards
   */
  keyboard: 2,
  /**
   * the seat has touch devices
   */
  touch: 4
}


/**
 *
 *            The gr_pointer interface represents one or more input devices,
 *            such as mice, which control the pointer location and pointer_focus
 *            of a seat.
 *
 *            The gr_pointer interface generates motion, enter and leave
 *            events for the surfaces that the pointer is located over,
 *            and button and axis events for button presses, button releases
 *            and scrolling.
 *        
 */
wfc.GrPointer = class GrPointer extends wfc.WObject {

	/**
	 *
	 *                Set the pointer surface, i.e., the surface that contains the
	 *                pointer image (cursor). This request gives the surface the role
	 *                of a cursor. If the surface already has another role, it raises
	 *                a protocol error.
	 *
	 *                The cursor actually changes only if the pointer
	 *                focus for this device is one of the requesting client's surfaces
	 *                or the surface parameter is the current pointer surface. If
	 *                there was a previous surface set with this request it is
	 *                replaced. If surface is NULL, the pointer image is hidden.
	 *
	 *                The parameters hotspot_x and hotspot_y define the position of
	 *                the pointer surface relative to the pointer location. Its
	 *                top-left corner is always at (x, y) - (hotspot_x, hotspot_y),
	 *                where (x, y) are the coordinates of the pointer location, in
	 *                surface-local coordinates.
	 *
	 *                On surface.attach requests to the pointer surface, hotspot_x
	 *                and hotspot_y are decremented by the x and y parameters
	 *                passed to the request. Attach must be confirmed by
	 *                gr_surface.commit as usual.
	 *
	 *                The hotspot can also be updated by passing the currently set
	 *                pointer surface to this request with new values for hotspot_x
	 *                and hotspot_y.
	 *
	 *                The current and pending input regions of the gr_surface are
	 *                cleared, and gr_surface.set_input_region is ignored until the
	 *                gr_surface is no longer used as the cursor. When the use as a
	 *                cursor ends, the current and pending input regions become
	 *                undefined, and the gr_surface is unmapped.
	 *            
	 *
	 * @param {Number} serial serial number of the enter event 
	 * @param {?*} surface pointer surface 
	 * @param {Number} hotspotX surface-local x coordinate 
	 * @param {Number} hotspotY surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	setCursor (serial, surface, hotspotX, hotspotY) {
		this.connection._marshall(this._id, 1, [wfc._uint(serial), wfc._objectOptional(surface), wfc._int(hotspotX), wfc._int(hotspotY)])
	}

	/**
	 *
	 *                Using this request a client can tell the server that it is not going to
	 *                use the pointer object anymore.
	 *
	 *                This request destroys the pointer proxy object, so clients must not call
	 *                gr_pointer_destroy() after using this request.
	 *            
	 * @since 3
	 *
	 */
	release () {
		this.connection._marshall(this._id, 2, [])
		this.connection._deleteObject(this)
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                Notification that this seat's pointer is focused on a certain
			 *                surface.
			 *
			 *                When a seat's focus enters a surface, the pointer image
			 *                is undefined and a client should respond to this event by setting
			 *                an appropriate pointer image with the set_cursor request.
			 *            
			 *
			 * @param {Number} serial serial number of the enter event 
			 * @param {*} surface surface entered by the pointer 
			 * @param {Fixed} surfaceX surface-local x coordinate 
			 * @param {Fixed} surfaceY surface-local y coordinate 
			 *
			 * @since 1
			 *
			 */
			enter(serial, surface, surfaceX, surfaceY) {},

			/**
			 *
			 *                Notification that this seat's pointer is no longer focused on
			 *                a certain surface.
			 *
			 *                The leave notification is sent before the enter notification
			 *                for the new focus.
			 *            
			 *
			 * @param {Number} serial serial number of the leave event 
			 * @param {*} surface surface left by the pointer 
			 *
			 * @since 1
			 *
			 */
			leave(serial, surface) {},

			/**
			 *
			 *                Notification of pointer location change. The arguments
			 *                surface_x and surface_y are the location relative to the
			 *                focused surface.
			 *            
			 *
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Fixed} surfaceX surface-local x coordinate 
			 * @param {Fixed} surfaceY surface-local y coordinate 
			 *
			 * @since 1
			 *
			 */
			motion(time, surfaceX, surfaceY) {},

			/**
			 *
			 *                Mouse button click and release notifications.
			 *
			 *                The location of the click is given by the last motion or
			 *                enter event.
			 *                The time argument is a timestamp with millisecond
			 *                granularity, with an undefined base.
			 *
			 *                The button is a button code as defined in the Linux kernel's
			 *                linux/input-event-codes.h header file, e.g. BTN_LEFT.
			 *
			 *                Any 16-bit button code value is reserved for future additions to the
			 *                kernel's event code list. All other button codes above 0xFFFF are
			 *                currently undefined but may be used in future versions of this
			 *                protocol.
			 *            
			 *
			 * @param {Number} serial serial number of the button event 
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Number} button button that produced the event 
			 * @param {Number} state physical state of the button 
			 *
			 * @since 1
			 *
			 */
			button(serial, time, button, state) {},

			/**
			 *
			 *                Scroll and other axis notifications.
			 *
			 *                For scroll events (vertical and horizontal scroll axes), the
			 *                value parameter is the length of a vector along the specified
			 *                axis in a coordinate space identical to those of motion events,
			 *                representing a relative movement along the specified axis.
			 *
			 *                For devices that support movements non-parallel to axes multiple
			 *                axis events will be emitted.
			 *
			 *                When applicable, for example for touch pads, the server can
			 *                choose to emit scroll events where the motion vector is
			 *                equivalent to a motion event vector.
			 *
			 *                When applicable, a client can transform its content relative to the
			 *                scroll distance.
			 *            
			 *
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Number} axis axis type 
			 * @param {Fixed} value length of vector in surface-local coordinate space 
			 *
			 * @since 1
			 *
			 */
			axis(time, axis, value) {},

			/**
			 *
			 *                Indicates the end of a set of events that logically belong together.
			 *                A client is expected to accumulate the data in all events within the
			 *                frame before proceeding.
			 *
			 *                All gr_pointer events before a gr_pointer.frame event belong
			 *                logically together. For example, in a diagonal scroll motion the
			 *                compositor will send an optional gr_pointer.axis_source event, two
			 *                gr_pointer.axis events (horizontal and vertical) and finally a
			 *                gr_pointer.frame event. The client may use this information to
			 *                calculate a diagonal vector for scrolling.
			 *
			 *                When multiple gr_pointer.axis events occur within the same frame,
			 *                the motion vector is the combined motion of all events.
			 *                When a gr_pointer.axis and a gr_pointer.axis_stop event occur within
			 *                the same frame, this indicates that axis movement in one axis has
			 *                stopped but continues in the other axis.
			 *                When multiple gr_pointer.axis_stop events occur within the same
			 *                frame, this indicates that these axes stopped in the same instance.
			 *
			 *                A gr_pointer.frame event is sent for every logical event group,
			 *                even if the group only contains a single gr_pointer event.
			 *                Specifically, a client may get a sequence: motion, frame, button,
			 *                frame, axis, frame, axis_stop, frame.
			 *
			 *                The gr_pointer.enter and gr_pointer.leave events are logical events
			 *                generated by the compositor and not the hardware. These events are
			 *                also grouped by a gr_pointer.frame. When a pointer moves from one
			 *                surface to another, a compositor should group the
			 *                gr_pointer.leave event within the same gr_pointer.frame.
			 *                However, a client must not rely on gr_pointer.leave and
			 *                gr_pointer.enter being in the same gr_pointer.frame.
			 *                Compositor-specific policies may require the gr_pointer.leave and
			 *                gr_pointer.enter event being split across multiple gr_pointer.frame
			 *                groups.
			 *            
			 * @since 5
			 *
			 */
			frame() {},

			/**
			 *
			 *                Source information for scroll and other axes.
			 *
			 *                This event does not occur on its own. It is sent before a
			 *                gr_pointer.frame event and carries the source information for
			 *                all events within that frame.
			 *
			 *                The source specifies how this event was generated. If the source is
			 *                gr_pointer.axis_source.finger, a gr_pointer.axis_stop event will be
			 *                sent when the user lifts the finger off the device.
			 *
			 *                If the source is gr_pointer.axis_source.wheel,
			 *                gr_pointer.axis_source.wheel_tilt or
			 *                gr_pointer.axis_source.continuous, a gr_pointer.axis_stop event may
			 *                or may not be sent. Whether a compositor sends an axis_stop event
			 *                for these sources is hardware-specific and implementation-dependent;
			 *                clients must not rely on receiving an axis_stop event for these
			 *                scroll sources and should treat scroll sequences from these scroll
			 *                sources as unterminated by default.
			 *
			 *                This event is optional. If the source is unknown for a particular
			 *                axis event sequence, no event is sent.
			 *                Only one gr_pointer.axis_source event is permitted per frame.
			 *
			 *                The order of gr_pointer.axis_discrete and gr_pointer.axis_source is
			 *                not guaranteed.
			 *            
			 *
			 * @param {Number} axisSource source of the axis event 
			 *
			 * @since 5
			 *
			 */
			axisSource(axisSource) {},

			/**
			 *
			 *                Stop notification for scroll and other axes.
			 *
			 *                For some gr_pointer.axis_source types, a gr_pointer.axis_stop event
			 *                is sent to notify a client that the axis sequence has terminated.
			 *                This enables the client to implement kinetic scrolling.
			 *                See the gr_pointer.axis_source documentation for information on when
			 *                this event may be generated.
			 *
			 *                Any gr_pointer.axis events with the same axis_source after this
			 *                event should be considered as the start of a new axis motion.
			 *
			 *                The timestamp is to be interpreted identical to the timestamp in the
			 *                gr_pointer.axis event. The timestamp value may be the same as a
			 *                preceding gr_pointer.axis event.
			 *            
			 *
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Number} axis the axis stopped with this event 
			 *
			 * @since 5
			 *
			 */
			axisStop(time, axis) {},

			/**
			 *
			 *                Discrete step information for scroll and other axes.
			 *
			 *                This event carries the axis value of the gr_pointer.axis event in
			 *                discrete steps (e.g. mouse wheel clicks).
			 *
			 *                This event does not occur on its own, it is coupled with a
			 *                gr_pointer.axis event that represents this axis value on a
			 *                continuous scale. The protocol guarantees that each axis_discrete
			 *                event is always followed by exactly one axis event with the same
			 *                axis number within the same gr_pointer.frame. Note that the protocol
			 *                allows for other events to occur between the axis_discrete and
			 *                its coupled axis event, including other axis_discrete or axis
			 *                events.
			 *
			 *                This event is optional; continuous scrolling devices
			 *                like two-finger scrolling on touchpads do not have discrete
			 *                steps and do not generate this event.
			 *
			 *                The discrete value carries the directional information. e.g. a value
			 *                of -2 is two steps towards the negative direction of this axis.
			 *
			 *                The axis number is identical to the axis number in the associated
			 *                axis event.
			 *
			 *                The order of gr_pointer.axis_discrete and gr_pointer.axis_source is
			 *                not guaranteed.
			 *            
			 *
			 * @param {Number} axis axis type 
			 * @param {Number} discrete number of steps 
			 *
			 * @since 5
			 *
			 */
			axisDiscrete(axis, discrete) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"uoff");
		this.listener.enter.call(this.listener, args[0], args[1], args[2], args[3])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"uo");
		this.listener.leave.call(this.listener, args[0], args[1])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"uff");
		this.listener.motion.call(this.listener, args[0], args[1], args[2])
	}

	[4] (message) {
		const args = this.connection._unmarshallArgs(message,"uuuu");
		this.listener.button.call(this.listener, args[0], args[1], args[2], args[3])
	}

	[5] (message) {
		const args = this.connection._unmarshallArgs(message,"uuf");
		this.listener.axis.call(this.listener, args[0], args[1], args[2])
	}

	[6] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.frame.call(this.listener)
	}

	[7] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.axisSource.call(this.listener, args[0])
	}

	[8] (message) {
		const args = this.connection._unmarshallArgs(message,"uu");
		this.listener.axisStop.call(this.listener, args[0], args[1])
	}

	[9] (message) {
		const args = this.connection._unmarshallArgs(message,"ui");
		this.listener.axisDiscrete.call(this.listener, args[0], args[1])
	}

}

wfc.GrPointer.Error = {
  /**
   * given gr_surface has another role
   */
  role: 0
}

wfc.GrPointer.ButtonState = {
  /**
   * the button is not pressed
   */
  released: 0,
  /**
   * the button is pressed
   */
  pressed: 1
}

wfc.GrPointer.Axis = {
  /**
   * vertical axis
   */
  verticalScroll: 0,
  /**
   * horizontal axis
   */
  horizontalScroll: 1
}

wfc.GrPointer.AxisSource = {
  /**
   * a physical wheel rotation
   */
  wheel: 0,
  /**
   * finger on a touch surface
   */
  finger: 1,
  /**
   * continuous coordinate space
   */
  continuous: 2,
  /**
   * a physical wheel tilt
   */
  wheelTilt: 3
}


/**
 *
 *            The gr_keyboard interface represents one or more keyboards
 *            associated with a seat.
 *        
 */
wfc.GrKeyboard = class GrKeyboard extends wfc.WObject {

	/**
	 * @since 3
	 *
	 */
	release () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                This event provides a file descriptor to the client which can be
			 *                memory-mapped to provide a keyboard mapping description.
			 *            
			 *
			 * @param {Number} format keymap format 
			 * @param {string} transfer keymap that will be send using a blob transfer described by the given blob transfer descriptor 
			 * @param {Number} size keymap size, in bytes 
			 *
			 * @since 1
			 *
			 */
			keymap(format, transfer, size) {},

			/**
			 *
			 *                Notification that this seat's keyboard focus is on a certain
			 *                surface.
			 *            
			 *
			 * @param {Number} serial serial number of the enter event 
			 * @param {*} surface surface gaining keyboard focus 
			 * @param {ArrayBuffer} keys the currently pressed keys 
			 *
			 * @since 1
			 *
			 */
			enter(serial, surface, keys) {},

			/**
			 *
			 *                Notification that this seat's keyboard focus is no longer on
			 *                a certain surface.
			 *
			 *                The leave notification is sent before the enter notification
			 *                for the new focus.
			 *            
			 *
			 * @param {Number} serial serial number of the leave event 
			 * @param {*} surface surface that lost keyboard focus 
			 *
			 * @since 1
			 *
			 */
			leave(serial, surface) {},

			/**
			 *
			 *                A key was pressed or released.
			 *                The time argument is a timestamp with millisecond
			 *                granularity, with an undefined base.
			 *            
			 *
			 * @param {Number} serial serial number of the key event 
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Number} key key that produced the event 
			 * @param {Number} state physical state of the key 
			 *
			 * @since 1
			 *
			 */
			key(serial, time, key, state) {},

			/**
			 *
			 *                Notifies clients that the modifier and/or group state has
			 *                changed, and it should update its local state.
			 *            
			 *
			 * @param {Number} serial serial number of the modifiers event 
			 * @param {Number} modsDepressed depressed modifiers 
			 * @param {Number} modsLatched latched modifiers 
			 * @param {Number} modsLocked locked modifiers 
			 * @param {Number} group keyboard layout 
			 *
			 * @since 1
			 *
			 */
			modifiers(serial, modsDepressed, modsLatched, modsLocked, group) {},

			/**
			 *
			 *                Informs the client about the keyboard's repeat rate and delay.
			 *
			 *                This event is sent as soon as the gr_keyboard object has been created,
			 *                and is guaranteed to be received by the client before any key press
			 *                event.
			 *
			 *                Negative values for either rate or delay are illegal. A rate of zero
			 *                will disable any repeating (regardless of the value of delay).
			 *
			 *                This event can be sent later on as well with a new value if necessary,
			 *                so clients should continue listening for the event past the creation
			 *                of gr_keyboard.
			 *            
			 *
			 * @param {Number} rate the rate of repeating keys in characters per second 
			 * @param {Number} delay delay in milliseconds since key down until repeating starts 
			 *
			 * @since 4
			 *
			 */
			repeatInfo(rate, delay) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"usu");
		this.listener.keymap.call(this.listener, args[0], args[1], args[2])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"uoa");
		this.listener.enter.call(this.listener, args[0], args[1], args[2])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"uo");
		this.listener.leave.call(this.listener, args[0], args[1])
	}

	[4] (message) {
		const args = this.connection._unmarshallArgs(message,"uuuu");
		this.listener.key.call(this.listener, args[0], args[1], args[2], args[3])
	}

	[5] (message) {
		const args = this.connection._unmarshallArgs(message,"uuuuu");
		this.listener.modifiers.call(this.listener, args[0], args[1], args[2], args[3], args[4])
	}

	[6] (message) {
		const args = this.connection._unmarshallArgs(message,"ii");
		this.listener.repeatInfo.call(this.listener, args[0], args[1])
	}

}

wfc.GrKeyboard.KeymapFormat = {
  /**
   * no keymap; client must understand how to interpret the raw keycode
   */
  noKeymap: 0,
  /**
   * libxkbcommon compatible; to determine the xkb keycode, clients must add 8 to the key event keycode
   */
  xkbV1: 1
}

wfc.GrKeyboard.KeyState = {
  /**
   * key is not pressed
   */
  released: 0,
  /**
   * key is pressed
   */
  pressed: 1
}


/**
 *
 *            The gr_touch interface represents a touchscreen
 *            associated with a seat.
 *
 *            Touch interactions can consist of one or more contacts.
 *            For each contact, a series of events is generated, starting
 *            with a down event, followed by zero or more motion events,
 *            and ending with an up event. Events relating to the same
 *            contact point can be identified by the ID of the sequence.
 *        
 */
wfc.GrTouch = class GrTouch extends wfc.WObject {

	/**
	 * @since 3
	 *
	 */
	release () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                A new touch point has appeared on the surface. This touch point is
			 *                assigned a unique ID. Future events from this touch point reference
			 *                this ID. The ID ceases to be valid after a touch up event and may be
			 *                reused in the future.
			 *            
			 *
			 * @param {Number} serial serial number of the touch down event 
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {*} surface surface touched 
			 * @param {Number} id the unique ID of this touch point 
			 * @param {Fixed} x surface-local x coordinate 
			 * @param {Fixed} y surface-local y coordinate 
			 *
			 * @since 1
			 *
			 */
			down(serial, time, surface, id, x, y) {},

			/**
			 *
			 *                The touch point has disappeared. No further events will be sent for
			 *                this touch point and the touch point's ID is released and may be
			 *                reused in a future touch down event.
			 *            
			 *
			 * @param {Number} serial serial number of the touch up event 
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Number} id the unique ID of this touch point 
			 *
			 * @since 1
			 *
			 */
			up(serial, time, id) {},

			/**
			 *
			 *                A touch point has changed coordinates.
			 *            
			 *
			 * @param {Number} time timestamp with millisecond granularity 
			 * @param {Number} id the unique ID of this touch point 
			 * @param {Fixed} x surface-local x coordinate 
			 * @param {Fixed} y surface-local y coordinate 
			 *
			 * @since 1
			 *
			 */
			motion(time, id, x, y) {},

			/**
			 *
			 *                Indicates the end of a set of events that logically belong together.
			 *                A client is expected to accumulate the data in all events within the
			 *                frame before proceeding.
			 *
			 *                A gr_touch.frame terminates at least one event but otherwise no
			 *                guarantee is provided about the set of events within a frame. A client
			 *                must assume that any state not updated in a frame is unchanged from the
			 *                previously known state.
			 *            
			 * @since 1
			 *
			 */
			frame() {},

			/**
			 *
			 *                Sent if the compositor decides the touch stream is a global
			 *                gesture. No further events are sent to the clients from that
			 *                particular gesture. Touch cancellation applies to all touch points
			 *                currently active on this client's surface. The client is
			 *                responsible for finalizing the touch points, future touch points on
			 *                this surface may reuse the touch point ID.
			 *            
			 * @since 1
			 *
			 */
			cancel() {},

			/**
			 *
			 *                Sent when a touchpoint has changed its shape.
			 *
			 *                This event does not occur on its own. It is sent before a
			 *                gr_touch.frame event and carries the new shape information for
			 *                any previously reported, or new touch points of that frame.
			 *
			 *                Other events describing the touch point such as gr_touch.down,
			 *                gr_touch.motion or gr_touch.orientation may be sent within the
			 *                same gr_touch.frame. A client should treat these events as a single
			 *                logical touch point update. The order of gr_touch.shape,
			 *                gr_touch.orientation and gr_touch.motion is not guaranteed.
			 *                A gr_touch.down event is guaranteed to occur before the first
			 *                gr_touch.shape event for this touch ID but both events may occur within
			 *                the same gr_touch.frame.
			 *
			 *                A touchpoint shape is approximated by an ellipse through the major and
			 *                minor axis length. The major axis length describes the longer diameter
			 *                of the ellipse, while the minor axis length describes the shorter
			 *                diameter. Major and minor are orthogonal and both are specified in
			 *                surface-local coordinates. The center of the ellipse is always at the
			 *                touchpoint location as reported by gr_touch.down or gr_touch.move.
			 *
			 *                This event is only sent by the compositor if the touch device supports
			 *                shape reports. The client has to make reasonable assumptions about the
			 *                shape if it did not receive this event.
			 *            
			 *
			 * @param {Number} id the unique ID of this touch point 
			 * @param {Fixed} major length of the major axis in surface-local coordinates 
			 * @param {Fixed} minor length of the minor axis in surface-local coordinates 
			 *
			 * @since 6
			 *
			 */
			shape(id, major, minor) {},

			/**
			 *
			 *                Sent when a touchpoint has changed its orientation.
			 *
			 *                This event does not occur on its own. It is sent before a
			 *                gr_touch.frame event and carries the new shape information for
			 *                any previously reported, or new touch points of that frame.
			 *
			 *                Other events describing the touch point such as gr_touch.down,
			 *                gr_touch.motion or gr_touch.shape may be sent within the
			 *                same gr_touch.frame. A client should treat these events as a single
			 *                logical touch point update. The order of gr_touch.shape,
			 *                gr_touch.orientation and gr_touch.motion is not guaranteed.
			 *                A gr_touch.down event is guaranteed to occur before the first
			 *                gr_touch.orientation event for this touch ID but both events may occur
			 *                within the same gr_touch.frame.
			 *
			 *                The orientation describes the clockwise angle of a touchpoint's major
			 *                axis to the positive surface y-axis and is normalized to the -180 to
			 *                +180 degree range. The granularity of orientation depends on the touch
			 *                device, some devices only support binary rotation values between 0 and
			 *                90 degrees.
			 *
			 *                This event is only sent by the compositor if the touch device supports
			 *                orientation reports.
			 *            
			 *
			 * @param {Number} id the unique ID of this touch point 
			 * @param {Fixed} orientation angle between major axis and positive surface y-axis in degrees 
			 *
			 * @since 6
			 *
			 */
			orientation(id, orientation) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"uuoiff");
		this.listener.down.call(this.listener, args[0], args[1], args[2], args[3], args[4], args[5])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"uui");
		this.listener.up.call(this.listener, args[0], args[1], args[2])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"uiff");
		this.listener.motion.call(this.listener, args[0], args[1], args[2], args[3])
	}

	[4] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.frame.call(this.listener)
	}

	[5] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.cancel.call(this.listener)
	}

	[6] (message) {
		const args = this.connection._unmarshallArgs(message,"iff");
		this.listener.shape.call(this.listener, args[0], args[1], args[2])
	}

	[7] (message) {
		const args = this.connection._unmarshallArgs(message,"if");
		this.listener.orientation.call(this.listener, args[0], args[1])
	}

}


/**
 *
 *            An output describes part of the compositor geometry.  The
 *            compositor works in the 'compositor coordinate system' and an
 *            output corresponds to a rectangular area in that space that is
 *            actually visible.  This typically corresponds to a monitor that
 *            displays part of the compositor space.  This object is published
 *            as global during start up, or when a monitor is hotplugged.
 *        
 */
wfc.GrOutput = class GrOutput extends wfc.WObject {

	/**
	 *
	 *                Using this request a client can tell the server that it is not going to
	 *                use the output object anymore.
	 *            
	 * @since 3
	 *
	 */
	release () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                The geometry event describes geometric properties of the output.
			 *                The event is sent when binding to the output object and whenever
			 *                any of the properties change.
			 *            
			 *
			 * @param {Number} x x position within the global compositor space 
			 * @param {Number} y y position within the global compositor space 
			 * @param {Number} physicalWidth width in millimeters of the output 
			 * @param {Number} physicalHeight height in millimeters of the output 
			 * @param {Number} subpixel subpixel orientation of the output 
			 * @param {string} make textual description of the manufacturer 
			 * @param {string} model textual description of the model 
			 * @param {Number} transform transform that maps framebuffer to output 
			 *
			 * @since 1
			 *
			 */
			geometry(x, y, physicalWidth, physicalHeight, subpixel, make, model, transform) {},

			/**
			 *
			 *                The mode event describes an available mode for the output.
			 *
			 *                The event is sent when binding to the output object and there
			 *                will always be one mode, the current mode.  The event is sent
			 *                again if an output changes mode, for the mode that is now
			 *                current.  In other words, the current mode is always the last
			 *                mode that was received with the current flag set.
			 *
			 *                The size of a mode is given in physical hardware units of
			 *                the output device. This is not necessarily the same as
			 *                the output size in the global compositor space. For instance,
			 *                the output may be scaled, as described in gr_output.scale,
			 *                or transformed, as described in gr_output.transform.
			 *            
			 *
			 * @param {Number} flags bitfield of mode flags 
			 * @param {Number} width width of the mode in hardware units 
			 * @param {Number} height height of the mode in hardware units 
			 * @param {Number} refresh vertical refresh rate in mHz 
			 *
			 * @since 1
			 *
			 */
			mode(flags, width, height, refresh) {},

			/**
			 *
			 *                This event is sent after all other properties have been
			 *                sent after binding to the output object and after any
			 *                other property changes done after that. This allows
			 *                changes to the output properties to be seen as
			 *                atomic, even if they happen via multiple events.
			 *            
			 * @since 2
			 *
			 */
			done() {},

			/**
			 *
			 *                This event contains scaling geometry information
			 *                that is not in the geometry event. It may be sent after
			 *                binding the output object or if the output scale changes
			 *                later. If it is not sent, the client should assume a
			 *                scale of 1.
			 *
			 *                A scale larger than 1 means that the compositor will
			 *                automatically scale surface buffers by this amount
			 *                when rendering. This is used for very high resolution
			 *                displays where applications rendering at the native
			 *                resolution would be too small to be legible.
			 *
			 *                It is intended that scaling aware clients track the
			 *                current output of a surface, and if it is on a scaled
			 *                output it should use gr_surface.set_buffer_scale with
			 *                the scale of the output. That way the compositor can
			 *                avoid scaling the surface, and the client can supply
			 *                a higher detail image.
			 *            
			 *
			 * @param {Number} factor scaling factor of output 
			 *
			 * @since 2
			 *
			 */
			scale(factor) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"iiiiissi");
		this.listener.geometry.call(this.listener, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"uiii");
		this.listener.mode.call(this.listener, args[0], args[1], args[2], args[3])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.done.call(this.listener)
	}

	[4] (message) {
		const args = this.connection._unmarshallArgs(message,"i");
		this.listener.scale.call(this.listener, args[0])
	}

}

wfc.GrOutput.Subpixel = {
  /**
   * unknown geometry
   */
  unknown: 0,
  /**
   * no geometry
   */
  none: 1,
  /**
   * horizontal RGB
   */
  horizontalRgb: 2,
  /**
   * horizontal BGR
   */
  horizontalBgr: 3,
  /**
   * vertical RGB
   */
  verticalRgb: 4,
  /**
   * vertical BGR
   */
  verticalBgr: 5
}

wfc.GrOutput.Transform = {
  /**
   * no transform
   */
  normal: 0,
  /**
   * 90 degrees counter-clockwise
   */
  90: 1,
  /**
   * 180 degrees counter-clockwise
   */
  180: 2,
  /**
   * 270 degrees counter-clockwise
   */
  270: 3,
  /**
   * 180 degree flip around a vertical axis
   */
  flipped: 4,
  /**
   * flip and rotate 90 degrees counter-clockwise
   */
  flipped90: 5,
  /**
   * flip and rotate 180 degrees counter-clockwise
   */
  flipped180: 6,
  /**
   * flip and rotate 270 degrees counter-clockwise
   */
  flipped270: 7
}

wfc.GrOutput.Mode = {
  /**
   * indicates this is the current mode
   */
  current: 0x1,
  /**
   * indicates this is the preferred mode
   */
  preferred: 0x2
}


/**
 *
 *            A region object describes an area.
 *
 *            Region objects are used to describe the opaque and input
 *            regions of a surface.
 *        
 */
wfc.GrRegion = class GrRegion extends wfc.WObject {

	/**
	 *
	 *                Destroy the region.  This will invalidate the object ID.
	 *            
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}

	/**
	 *
	 *                Add the specified rectangle to the region.
	 *            
	 *
	 * @param {Number} x region-local x coordinate 
	 * @param {Number} y region-local y coordinate 
	 * @param {Number} width rectangle width 
	 * @param {Number} height rectangle height 
	 *
	 * @since 1
	 *
	 */
	add (x, y, width, height) {
		this.connection._marshall(this._id, 2, [wfc._int(x), wfc._int(y), wfc._int(width), wfc._int(height)])
	}

	/**
	 *
	 *                Subtract the specified rectangle from the region.
	 *            
	 *
	 * @param {Number} x region-local x coordinate 
	 * @param {Number} y region-local y coordinate 
	 * @param {Number} width rectangle width 
	 * @param {Number} height rectangle height 
	 *
	 * @since 1
	 *
	 */
	subtract (x, y, width, height) {
		this.connection._marshall(this._id, 3, [wfc._int(x), wfc._int(y), wfc._int(width), wfc._int(height)])
	}

	constructor (connection) {
		super(connection, {
		})
	}

}


/**
 *
 *            The global interface exposing sub-surface compositing capabilities.
 *            A gr_surface, that has sub-surfaces associated, is called the
 *            parent surface. Sub-surfaces can be arbitrarily nested and create
 *            a tree of sub-surfaces.
 *
 *            The root surface in a tree of sub-surfaces is the main
 *            surface. The main surface cannot be a sub-surface, because
 *            sub-surfaces must always have a parent.
 *
 *            A main surface with its sub-surfaces forms a (compound) window.
 *            For window management purposes, this set of gr_surface objects is
 *            to be considered as a single window, and it should also behave as
 *            such.
 *
 *            The aim of sub-surfaces is to offload some of the compositing work
 *            within a window from clients to the compositor. A prime example is
 *            a video player with decorations and video in separate gr_surface
 *            objects. This should allow the compositor to pass YUV video buffer
 *            processing to dedicated overlay hardware when possible.
 *        
 */
wfc.GrSubcompositor = class GrSubcompositor extends wfc.WObject {

	/**
	 *
	 *                Informs the server that the client will not be using this
	 *                protocol object anymore. This does not affect any other
	 *                objects, gr_subsurface objects included.
	 *            
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}

	/**
	 *
	 *                Create a sub-surface interface for the given surface, and
	 *                associate it with the given parent surface. This turns a
	 *                plain gr_surface into a sub-surface.
	 *
	 *                The to-be sub-surface must not already have another role, and it
	 *                must not have an existing gr_subsurface object. Otherwise a protocol
	 *                error is raised.
	 *            
	 *
	 * @param {*} surface the surface to be turned into a sub-surface 
	 * @param {*} parent the parent surface 
	 * @return {gr_subsurface} the new sub-surface object ID 
	 *
	 * @since 1
	 *
	 */
	getSubsurface (surface, parent) {
		return this.connection._marshallConstructor(this._id, 2, "GrSubsurface", [wfc._newObject(), wfc._object(surface), wfc._object(parent)])
	}

	constructor (connection) {
		super(connection, {
		})
	}

}

wfc.GrSubcompositor.Error = {
  /**
   * the to-be sub-surface is invalid
   */
  badSurface: 0
}


/**
 *
 *            An additional interface to a gr_surface object, which has been
 *            made a sub-surface. A sub-surface has one parent surface. A
 *            sub-surface's size and position are not limited to that of the parent.
 *            Particularly, a sub-surface is not automatically clipped to its
 *            parent's area.
 *
 *            A sub-surface becomes mapped, when a non-NULL gr_buffer is applied
 *            and the parent surface is mapped. The order of which one happens
 *            first is irrelevant. A sub-surface is hidden if the parent becomes
 *            hidden, or if a NULL gr_buffer is applied. These rules apply
 *            recursively through the tree of surfaces.
 *
 *            The behaviour of a gr_surface.commit request on a sub-surface
 *            depends on the sub-surface's mode. The possible modes are
 *            synchronized and desynchronized, see methods
 *            gr_subsurface.set_sync and gr_subsurface.set_desync. Synchronized
 *            mode caches the gr_surface state to be applied when the parent's
 *            state gets applied, and desynchronized mode applies the pending
 *            gr_surface state directly. A sub-surface is initially in the
 *            synchronized mode.
 *
 *            Sub-surfaces have also other kind of state, which is managed by
 *            gr_subsurface requests, as opposed to gr_surface requests. This
 *            state includes the sub-surface position relative to the parent
 *            surface (gr_subsurface.set_position), and the stacking order of
 *            the parent and its sub-surfaces (gr_subsurface.place_above and
 *            .place_below). This state is applied when the parent surface's
 *            gr_surface state is applied, regardless of the sub-surface's mode.
 *            As the exception, set_sync and set_desync are effective immediately.
 *
 *            The main surface can be thought to be always in desynchronized mode,
 *            since it does not have a parent in the sub-surfaces sense.
 *
 *            Even if a sub-surface is in desynchronized mode, it will behave as
 *            in synchronized mode, if its parent surface behaves as in
 *            synchronized mode. This rule is applied recursively throughout the
 *            tree of surfaces. This means, that one can set a sub-surface into
 *            synchronized mode, and then assume that all its child and grand-child
 *            sub-surfaces are synchronized, too, without explicitly setting them.
 *
 *            If the gr_surface associated with the gr_subsurface is destroyed, the
 *            gr_subsurface object becomes inert. Note, that destroying either object
 *            takes effect immediately. If you need to synchronize the removal
 *            of a sub-surface to the parent surface update, unmap the sub-surface
 *            first by attaching a NULL gr_buffer, update parent, and then destroy
 *            the sub-surface.
 *
 *            If the parent gr_surface object is destroyed, the sub-surface is
 *            unmapped.
 *        
 */
wfc.GrSubsurface = class GrSubsurface extends wfc.WObject {

	/**
	 *
	 *                The sub-surface interface is removed from the gr_surface object
	 *                that was turned into a sub-surface with a
	 *                gr_subcompositor.get_subsurface request. The gr_surface's association
	 *                to the parent is deleted, and the gr_surface loses its role as
	 *                a sub-surface. The gr_surface is unmapped.
	 *            
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}

	/**
	 *
	 *                This schedules a sub-surface position change.
	 *                The sub-surface will be moved so that its origin (top left
	 *                corner pixel) will be at the location x, y of the parent surface
	 *                coordinate system. The coordinates are not restricted to the parent
	 *                surface area. Negative values are allowed.
	 *
	 *                The scheduled coordinates will take effect whenever the state of the
	 *                parent surface is applied. When this happens depends on whether the
	 *                parent surface is in synchronized mode or not. See
	 *                gr_subsurface.set_sync and gr_subsurface.set_desync for details.
	 *
	 *                If more than one set_position request is invoked by the client before
	 *                the commit of the parent surface, the position of a new request always
	 *                replaces the scheduled position from any previous request.
	 *
	 *                The initial position is 0, 0.
	 *            
	 *
	 * @param {Number} x x coordinate in the parent surface 
	 * @param {Number} y y coordinate in the parent surface 
	 *
	 * @since 1
	 *
	 */
	setPosition (x, y) {
		this.connection._marshall(this._id, 2, [wfc._int(x), wfc._int(y)])
	}

	/**
	 *
	 *                This sub-surface is taken from the stack, and put back just
	 *                above the reference surface, changing the z-order of the sub-surfaces.
	 *                The reference surface must be one of the sibling surfaces, or the
	 *                parent surface. Using any other surface, including this sub-surface,
	 *                will cause a protocol error.
	 *
	 *                The z-order is double-buffered. Requests are handled in order and
	 *                applied immediately to a pending state. The final pending state is
	 *                copied to the active state the next time the state of the parent
	 *                surface is applied. When this happens depends on whether the parent
	 *                surface is in synchronized mode or not. See gr_subsurface.set_sync and
	 *                gr_subsurface.set_desync for details.
	 *
	 *                A new sub-surface is initially added as the top-most in the stack
	 *                of its siblings and parent.
	 *            
	 *
	 * @param {*} sibling the reference surface 
	 *
	 * @since 1
	 *
	 */
	placeAbove (sibling) {
		this.connection._marshall(this._id, 3, [wfc._object(sibling)])
	}

	/**
	 *
	 *                The sub-surface is placed just below the reference surface.
	 *                See gr_subsurface.place_above.
	 *            
	 *
	 * @param {*} sibling the reference surface 
	 *
	 * @since 1
	 *
	 */
	placeBelow (sibling) {
		this.connection._marshall(this._id, 4, [wfc._object(sibling)])
	}

	/**
	 *
	 *                Change the commit behaviour of the sub-surface to synchronized
	 *                mode, also described as the parent dependent mode.
	 *
	 *                In synchronized mode, gr_surface.commit on a sub-surface will
	 *                accumulate the committed state in a cache, but the state will
	 *                not be applied and hence will not change the compositor output.
	 *                The cached state is applied to the sub-surface immediately after
	 *                the parent surface's state is applied. This ensures atomic
	 *                updates of the parent and all its synchronized sub-surfaces.
	 *                Applying the cached state will invalidate the cache, so further
	 *                parent surface commits do not (re-)apply old state.
	 *
	 *                See gr_subsurface for the recursive effect of this mode.
	 *            
	 * @since 1
	 *
	 */
	setSync () {
		this.connection._marshall(this._id, 5, [])
	}

	/**
	 *
	 *                Change the commit behaviour of the sub-surface to desynchronized
	 *                mode, also described as independent or freely running mode.
	 *
	 *                In desynchronized mode, gr_surface.commit on a sub-surface will
	 *                apply the pending state directly, without caching, as happens
	 *                normally with a gr_surface. Calling gr_surface.commit on the
	 *                parent surface has no effect on the sub-surface's gr_surface
	 *                state. This mode allows a sub-surface to be updated on its own.
	 *
	 *                If cached state exists when gr_surface.commit is called in
	 *                desynchronized mode, the pending state is added to the cached
	 *                state, and applied as a whole. This invalidates the cache.
	 *
	 *                Note: even if a sub-surface is set to desynchronized, a parent
	 *                sub-surface may override it to behave as synchronized. For details,
	 *                see gr_subsurface.
	 *
	 *                If a surface's parent surface behaves as desynchronized, then
	 *                the cached state is applied on set_desync.
	 *            
	 * @since 1
	 *
	 */
	setDesync () {
		this.connection._marshall(this._id, 6, [])
	}

	constructor (connection) {
		super(connection, {
		})
	}

}

wfc.GrSubsurface.Error = {
  /**
   * gr_surface is not a sibling or the parent
   */
  badSurface: 0
}

module.exports = wfc