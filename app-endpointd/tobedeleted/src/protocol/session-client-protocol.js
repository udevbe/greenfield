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
const wfc = require('westfield-runtime-client')
/**
 */
wfc.GrClientSession = class GrClientSession extends wfc.WObject {

	/**
	 * @since 1
	 *
	 */
	destroy () {
		this.connection._marshall(this._id, 1, [])
	}

	constructor (connection) {
		super(connection, {

			/**
			 *
			 * @param {Number} sessionId the new client session 
			 *
			 * @since 1
			 *
			 */
			session(sessionId) {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"u");
		this.listener.session.call(this.listener, args[0])
	}

}


/**
 */
wfc.GrSession = class GrSession extends wfc.WObject {

	/**
	 *
	 * @return {GrClientSession} the new client session 
	 *
	 * @since 1
	 *
	 */
	client () {
		return this.connection._marshallConstructor(this._id, 1, "GrClientSession", [wfc._newObject()])
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
			flush() {},
		})
	}

	[1] (message) {
		const args = this.connection._unmarshallArgs(message,"");
		this.listener.flush.call(this.listener)
	}

}

module.exports = wfc