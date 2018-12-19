'use strict'

import WlBufferRequests from './protocol/WlBufferRequests'
import BufferStream from './BufferStream'

/**
 *
 *            A buffer provides the content for a gr_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 * @implements WlBufferRequests
 * @implements Buffer
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
    // TODO try to improve buffer chunk handling and not slice (=copy) anywhere
    wlBufferResource.client.setOutOfBandListener(
      wlBufferResource.id,
      128,
      (outOfBandMessage) => bufferStream.onChunk(outOfBandMessage.slice(2 * Uint32Array.BYTES_PER_ELEMENT))
    )
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
   */
  async getContents (commitSerial) {
    return this.bufferStream.onFrameAvailable(commitSerial)
  }
}
