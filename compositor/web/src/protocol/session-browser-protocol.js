/*
 *
 *        Session Protocol for use with an HTML5 Wayland compositor.
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
wfs.GrClientSession = class GrClientSession extends wfs.Resource {

	/**
	 *
	 * @param {Number} sessionId the new client session 
	 *
	 * @since 1
	 *
	 */
	session (sessionId) {
		this.client._marshall(this.id, 1, [wfs._uint(sessionId)])
	}

	constructor (client, id, version) {
		super(client, id, version, {

			/**
			 *
			 * @param {GrClientSession} resource 
			 *
			 * @since 1
			 *
			 */
			destroy(resource) {},
		})
	}

	[1] (message) {
		const args = this.client._unmarshallArgs(message,"")
		this.implementation.destroy.call(this.implementation, this)
	}

}


/**
 */
wfs.GrSession = class GrSession extends wfs.Resource {

	/**
	 * @since 1
	 *
	 */
	flush () {
		this.client._marshall(this.id, 1, [])
	}

	constructor (client, id, version) {
		super(client, id, version, {

			/**
			 *
			 * @param {GrSession} resource 
			 * @param {*} id the new client session 
			 *
			 * @since 1
			 *
			 */
			client(resource, id) {},
		})
	}

	[1] (message) {
		const args = this.client._unmarshallArgs(message,"n")
		this.implementation.client.call(this.implementation, this, args[0])
	}

}

module.exports = wfs