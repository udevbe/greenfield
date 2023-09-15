/*
 *
 *        Copyright © 2023 Erik De Rijcke
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
 *        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *        ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *        SOFTWARE.
 *    
 */

import { Connection, WlMessage, fileDescriptor, uint, int, 
	fixed, object, objectOptional, newObject, string, stringOptional, 
	array, arrayOptional, u, i, f, oOptional, o, n, sOptional, s, aOptional, a, h,	FD, Fixed } from 'westfield-runtime-common'
import * as Westfield from '.'
import { Proxy, Display } from '../westfield-runtime-client'


/**
 *
 *            A singleton global object that provides support for web buffers.
 *
 *            Clients can create wl_buffer objects using the create_buffer request.
 *        
 */
export class WebBitmapbufFactoryProxy extends Proxy {

	/**
	 * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
	 */
	constructor (display: Display, connection: Connection, id: number) {
		super(display, connection, id)
	}


	/**
	 *
	 *                Create a wl_buffer object by wrapping an HTML bitmap, so it can be used with a surface.
	 *            
	 * @since 1
	 *
	 */
	createBuffer (bitmap: FD): Westfield.WlBufferProxy {
    		return this.marshallConstructor(this.id, 0, Westfield.WlBufferProxy, [newObject(), fileDescriptor(bitmap)])
	}
}
export const WebBitmapbufFactoryProtocolName = 'web_bitmapbuf_factory'

