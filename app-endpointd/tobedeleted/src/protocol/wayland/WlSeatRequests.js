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


class WlSeatRequests {
  constructor () {
    this[0] = this.getPointer
    this[1] = this.getKeyboard
    this[2] = this.getTouch
    this[3] = this.release
  }

  /**
   *
   *	The ID provided will be initialized to the wl_pointer interface
   *	for this seat.
   *
   *	This request only takes effect if the seat has the pointer
   *	capability, or has had the pointer capability in the past.
   *	It is a protocol violation to issue this request on a seat that has
   *	never had the pointer capability.
   *      
   *
   * @param {WlSeat} resource
   * @param {*} id seat pointer
   *
   * @since 1
   *
   */
  getPointer (resource, id) {}
  /**
   *
   *	The ID provided will be initialized to the wl_keyboard interface
   *	for this seat.
   *
   *	This request only takes effect if the seat has the keyboard
   *	capability, or has had the keyboard capability in the past.
   *	It is a protocol violation to issue this request on a seat that has
   *	never had the keyboard capability.
   *      
   *
   * @param {WlSeat} resource
   * @param {*} id seat keyboard
   *
   * @since 1
   *
   */
  getKeyboard (resource, id) {}
  /**
   *
   *	The ID provided will be initialized to the wl_touch interface
   *	for this seat.
   *
   *	This request only takes effect if the seat has the touch
   *	capability, or has had the touch capability in the past.
   *	It is a protocol violation to issue this request on a seat that has
   *	never had the touch capability.
   *      
   *
   * @param {WlSeat} resource
   * @param {*} id seat touch interface
   *
   * @since 1
   *
   */
  getTouch (resource, id) {}
  /**
   *
   *	Using this request a client can tell the server that it is not going to
   *	use the seat object anymore.
   *      
   *
   * @param {WlSeat} resource
   *
   * @since 5
   *
   */
  release (resource) {}
}

module.exports = WlSeatRequests
