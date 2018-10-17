'use strict'

module.exports = class LocalBuffer {
  static create () {
    return new LocalBuffer()
  }

  constructor () {
    this.resource = null
  }

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
  release () {
    this.resource.release()
  }
}
