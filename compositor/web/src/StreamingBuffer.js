// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

import WlBufferRequests from './protocol/WlBufferRequests'
import BufferStream from './BufferStream'

/**
 *
 *            A buffer provides the content for a wl_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 * @implements WlBufferRequests
 * @implements BufferImplementation
 */
export default class StreamingBuffer extends WlBufferRequests {
  /**
   *
   * @param {!WlBufferResource} wlBufferResource
   * @return {!StreamingBuffer}
   */
  static create (wlBufferResource) {
    const bufferStream = BufferStream.create()
    const buffer = new StreamingBuffer(wlBufferResource, bufferStream)
    wlBufferResource.implementation = buffer
    return buffer
  }

  /**
   * Instead use StreamingBuffer.create(..)
   * @private
   * @param {!WlBufferResource}wlBufferResource
   * @param {BufferStream}bufferStream
   */
  constructor (wlBufferResource, bufferStream) {
    super()
    /**
     * @type {!WlBufferResource}
     * @const
     */
    this.resource = wlBufferResource
    /**
     * @type {BufferStream}
     */
    this.bufferStream = bufferStream
  }

  /**
   *
   * @param {!WlBufferResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    this.bufferStream.destroy()
    resource.destroy()
  }

  /**
   * @param commitSerial
   * @return {!Promise<EncodedFrame>}
   * @override
   */
  async getContents (commitSerial) {
    return this.bufferStream.onFrameAvailable(commitSerial)
  }

  release () {
    this.resource.release()
  }
}
