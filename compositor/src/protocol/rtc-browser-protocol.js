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
const wfs = require('westfield-runtime-server')
/**
 */
wfs.RtcBufferFactory = class RtcBufferFactory extends wfs.Resource {

	constructor (client, id, version) {
		super(client, id, version, {

			/**
			 *
			 * @param {RtcBufferFactory} resource 
			 * @param {*} id A new generic buffer 
			 *
			 * @since 1
			 *
			 */
			createBuffer(resource, id) {},

			/**
			 *
			 * @param {RtcBufferFactory} resource 
			 * @param {*} id A new data channel buffer 
			 * @param {*} blobTransfer The blob transfer of a peer connection in server mode used to send buffer data. 
			 * @param {*} buffer The generic buffer that will implement the new datachannel buffer 
			 *
			 * @since 1
			 *
			 */
			createDcBuffer(resource, id, blobTransfer, buffer) {},
		})
	}

	[1] (message) {
		const args = this.client._unmarshallArgs(message,"n")
		this.implementation.createBuffer.call(this.implementation, this, args[0])
	}

	[2] (message) {
		const args = this.client._unmarshallArgs(message,"noo")
		this.implementation.createDcBuffer.call(this.implementation, this, args[0], args[1], args[2])
	}

}


/**
 */
wfs.RtcDcBuffer = class RtcDcBuffer extends wfs.Resource {

	/**
	 *
	 * @param {Number} serial Serial of the received buffer contents 
	 *
	 * @since 1
	 *
	 */
	ack (serial) {
		this.client._marshall(this.id, 1, [wfs._uint(serial)])
	}

	/**
	 *
	 * @param {Number} serial Serial of the buffer contents that was decoded 
	 * @param {Number} duration Time it took to decode the buffer. 
	 *
	 * @since 1
	 *
	 */
	latency (serial, duration) {
		this.client._marshall(this.id, 2, [wfs._uint(serial), wfs._uint(duration)])
	}

	constructor (client, id, version) {
		super(client, id, version, {

			/**
			 *
			 * @param {RtcDcBuffer} resource 
			 *
			 * @since 1
			 *
			 */
			destroy(resource) {},

			/**
			 *
			 * @param {RtcDcBuffer} resource 
			 * @param {Number} serial Serial of the send buffer contents 
			 *
			 * @since 1
			 *
			 */
			syn(resource, serial) {},
		})
	}

	[1] (message) {
		const args = this.client._unmarshallArgs(message,"")
		this.implementation.destroy.call(this.implementation, this)
	}

	[2] (message) {
		const args = this.client._unmarshallArgs(message,"u")
		this.implementation.syn.call(this.implementation, this, args[0])
	}

}


/**
 */
wfs.RtcPeerConnectionFactory = class RtcPeerConnectionFactory extends wfs.Resource {

	constructor (client, id, version) {
		super(client, id, version, {

			/**
			 *
			 * @param {RtcPeerConnectionFactory} resource 
			 * @param {*} id Creates new peer connection 
			 *
			 * @since 1
			 *
			 */
			createRtcPeerConnection(resource, id) {},
		})
	}

	[1] (message) {
		const args = this.client._unmarshallArgs(message,"n")
		this.implementation.createRtcPeerConnection.call(this.implementation, this, args[0])
	}

}


/**
 */
wfs.RtcPeerConnection = class RtcPeerConnection extends wfs.Resource {

	/**
	 *
	 *                Notify the client that it should start initializing this peer connection. After initialization, this rtc
	 *                peer connection is connected with another rtc peer connection. The other end can either be a server side
	 *                peer connection, or a peer connection created by another client.
	 *            
	 * @since 1
	 *
	 */
	init () {
		this.client._marshall(this.id, 1, [])
	}

	/**
	 *
	 * @param {string} description  
	 *
	 * @since 1
	 *
	 */
	serverSdpReply (description) {
		this.client._marshall(this.id, 2, [wfs._string(description)])
	}

	/**
	 *
	 * @param {string} description  
	 *
	 * @since 1
	 *
	 */
	serverSdpOffer (description) {
		this.client._marshall(this.id, 3, [wfs._string(description)])
	}

	/**
	 *
	 * @param {string} description  
	 *
	 * @since 1
	 *
	 */
	serverIceCandidates (description) {
		this.client._marshall(this.id, 4, [wfs._string(description)])
	}

	constructor (client, id, version) {
		super(client, id, version, {

			/**
			 *
			 * @param {RtcPeerConnection} resource 
			 * @param {*} id Returns new blob transfer object who's data will be send over the given rtc peer connection 
			 * @param {string} descriptor blob transfer descriptor 
			 *
			 * @since 1
			 *
			 */
			createBlobTransfer(resource, id, descriptor) {},

			/**
			 *
			 * @param {RtcPeerConnection} resource 
			 * @param {string} description  
			 *
			 * @since 1
			 *
			 */
			clientIceCandidates(resource, description) {},

			/**
			 *
			 * @param {RtcPeerConnection} resource 
			 * @param {string} description  
			 *
			 * @since 1
			 *
			 */
			clientSdpOffer(resource, description) {},

			/**
			 *
			 * @param {RtcPeerConnection} resource 
			 * @param {string} description  
			 *
			 * @since 1
			 *
			 */
			clientSdpReply(resource, description) {},

			/**
			 *
			 * @param {RtcPeerConnection} resource 
			 *
			 * @since 1
			 *
			 */
			close(resource) {},
		})
	}

	[1] (message) {
		const args = this.client._unmarshallArgs(message,"ns")
		this.implementation.createBlobTransfer.call(this.implementation, this, args[0], args[1])
	}

	[2] (message) {
		const args = this.client._unmarshallArgs(message,"s")
		this.implementation.clientIceCandidates.call(this.implementation, this, args[0])
	}

	[3] (message) {
		const args = this.client._unmarshallArgs(message,"s")
		this.implementation.clientSdpOffer.call(this.implementation, this, args[0])
	}

	[4] (message) {
		const args = this.client._unmarshallArgs(message,"s")
		this.implementation.clientSdpReply.call(this.implementation, this, args[0])
	}

	[5] (message) {
		const args = this.client._unmarshallArgs(message,"")
		this.implementation.close.call(this.implementation, this)
	}

}

module.exports = wfs