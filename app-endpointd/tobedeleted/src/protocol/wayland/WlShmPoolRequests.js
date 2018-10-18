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


class WlShmPoolRequests {
  constructor () {
    this[0] = this.createBuffer
    this[1] = this.destroy
    this[2] = this.resize
  }

  /**
   *
   *	Create a wl_buffer object from the pool.
   *
   *	The buffer is created offset bytes into the pool and has
   *	width and height as specified.  The stride argument specifies
   *	the number of bytes from the beginning of one row to the beginning
   *	of the next.  The format is the pixel format of the buffer and
   *	must be one of those advertised through the wl_shm.format event.
   *
   *	A buffer will keep a reference to the pool it was created from
   *	so it is valid to destroy the pool immediately after creating
   *	a buffer from it.
   *      
   *
   * @param {WlShmPool} resource
   * @param {*} id buffer to create
   * @param {Number} offset buffer byte offset within the pool
   * @param {Number} width buffer width, in pixels
   * @param {Number} height buffer height, in pixels
   * @param {Number} stride number of bytes from the beginning of one row to the beginning of the next row
   * @param {Number} format buffer pixel format
   *
   * @since 1
   *
   */
  createBuffer (resource, id, offset, width, height, stride, format) {}
  /**
   *
   *	Destroy the shared memory pool.
   *
   *	The mmapped memory will be released when all
   *	buffers that have been created from this pool
   *	are gone.
   *      
   *
   * @param {WlShmPool} resource
   *
   * @since 1
   *
   */
  destroy (resource) {}
  /**
   *
   *	This request will cause the server to remap the backing memory
   *	for the pool from the file descriptor passed when the pool was
   *	created, but using the new size.  This request can only be
   *	used to make the pool bigger.
   *      
   *
   * @param {WlShmPool} resource
   * @param {Number} size new size of the pool, in bytes
   *
   * @since 1
   *
   */
  resize (resource, size) {}
}

module.exports = WlShmPoolRequests
