/*
 *
 *        Greenfield WebRTC Protocol
 *        Copyright (C) 2017 Erik De Rijcke
 *
 *        This program is free software: you can redistribute it and/or modify
 *        it under the terms of the GNU Affero General Public License as
 *        published by the Free Software Foundation, either version 3 of the
 *        License, or (at your option) any later version.
 *
 *        This program is distributed in the hope that it will be useful,
 *        but WITHOUT ANY WARRANTY; without even the implied warranty of
 *        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *        GNU Affero General Public License for more details.
 *
 *        You should have received a copy of the GNU Affero General Public License
 *        along with this program. If not, see >http://www.gnu.org/licenses/<.
 *    
 */
const wfc = require('westfield-runtime-client')
/**
 */
wfc.RtcBufferFactory = class RtcBufferFactory extends wfc.WObject {

	/**
	 *
	 * @return {gr_buffer} A new generic buffer 
	 *
	 * @since 1
	 *
	 */
	createBuffer () {
		return this.connection._marshallConstructor(this._id, 1, "GrBuffer", [wfc._newObject()])
	}

	/**
	 *
	 * @param {*} blobTransfer The blob transfer of a peer connection in server mode used to send buffer data. 
	 * @param {*} buffer The generic buffer that will implement the new datachannel buffer 
	 * @return {rtc_dc_buffer} A new data channel buffer 
	 *
	 * @since 1
	 *
	 */
	createDcBuffer (blobTransfer, buffer) {
		return this.connection._marshallConstructor(this._id, 2, "RtcDcBuffer", [wfc._newObject(), wfc._object(blobTransfer), wfc._object(buffer)])
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
 */
wfc.RtcDcBuffer = class RtcDcBuffer extends wfc.WObject {

	/**
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 1, [])
		this.connection._deleteObject(this)
	}

	/**
	 *
	 * @param {Number} serial Serial of the send buffer contents 
	 *
	 * @since 1
	 *
	 */
	syn (serial) {
		this.connection._marshall(this._id, 2, [wfc._uint(serial)])
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 * @param {Number} serial Serial of the received buffer contents 
			 *
			 * @since 1
			 *
			 */
			ack(serial) {},

			/**
			 *
			 * @param {Number} serial Serial of the buffer contents that was decoded 
			 * @param {Number} duration Time it took to decode the buffer. 
			 *
			 * @since 1
			 *
			 */
			latency(serial, duration) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.ack.call(this.listener, args[0])
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"uu");
		this.listener.latency.call(this.listener, args[0], args[1])
	}

}


/**
 */
wfc.RtcPeerConnectionFactory = class RtcPeerConnectionFactory extends wfc.WObject {

	/**
	 *
	 * @return {rtc_peer_connection} Creates new peer connection 
	 *
	 * @since 1
	 *
	 */
	createRtcPeerConnection () {
		return this.connection._marshallConstructor(this._id, 1, "RtcPeerConnection", [wfc._newObject()])
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
 */
wfc.RtcPeerConnection = class RtcPeerConnection extends wfc.WObject {

	/**
	 *
	 * @param {string} descriptor blob transfer descriptor 
	 * @return {gr_blob_transfer} Returns new blob transfer object who's data will be send over the given rtc peer connection 
	 *
	 * @since 1
	 *
	 */
	createBlobTransfer (descriptor) {
		return this.connection._marshallConstructor(this._id, 1, "GrBlobTransfer", [wfc._newObject(), wfc._string(descriptor)])
	}

	/**
	 *
	 * @param {string} description  
	 *
	 * @since 1
	 *
	 */
	clientIceCandidates (description) {
		this.connection._marshall(this._id, 2, [wfc._string(description)])
	}

	/**
	 *
	 * @param {string} description  
	 *
	 * @since 1
	 *
	 */
	clientSdpOffer (description) {
		this.connection._marshall(this._id, 3, [wfc._string(description)])
	}

	/**
	 *
	 * @param {string} description  
	 *
	 * @since 1
	 *
	 */
	clientSdpReply (description) {
		this.connection._marshall(this._id, 4, [wfc._string(description)])
	}

	/**
	 * @since 1
	 *
	 */
	close () {
		this.connection._marshall(this._id, 5, [])
	}
	destroy () {
		this.connection._deleteObject(this)
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 *                Notify the client that it should start initializing this peer connection. After initialization, this rtc
			 *                peer connection is connected with another rtc peer connection. The other end can either be a server side
			 *                peer connection, or a peer connection created by another client.
			 *            
			 * @since 1
			 *
			 */
			init() {},

			/**
			 *
			 * @param {string} description  
			 *
			 * @since 1
			 *
			 */
			serverSdpReply(description) {},

			/**
			 *
			 * @param {string} description  
			 *
			 * @since 1
			 *
			 */
			serverSdpOffer(description) {},

			/**
			 *
			 * @param {string} description  
			 *
			 * @since 1
			 *
			 */
			serverIceCandidates(description) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.init.call(this.listener)
	}

	[2] (message) {
		const args = this.connection._unmarshallArgs(message,"s");
		this.listener.serverSdpReply.call(this.listener, args[0])
	}

	[3] (message) {
		const args = this.connection._unmarshallArgs(message,"s");
		this.listener.serverSdpOffer.call(this.listener, args[0])
	}

	[4] (message) {
		const args = this.connection._unmarshallArgs(message,"s");
		this.listener.serverIceCandidates.call(this.listener, args[0])
	}

}

module.exports = wfc