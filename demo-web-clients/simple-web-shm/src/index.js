// Copyright 2019 Erik De Rijcke
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict'

import {
  display,
  webFS,
  frame,
  WlCompositorProxy,
  GrWebShmProxy,
  WlShellProxy
} from 'westfield-runtime-client'

class ShmBufferPool {
  /**
   * @param {GrWebShmProxy}webShm
   * @param {number}poolSize
   * @param {number}width
   * @param {number}height
   * @return {ShmBufferPool}
   */
  static create (webShm, poolSize, width, height) {
    const available = new Array(poolSize)
    const shmBufferPool = new ShmBufferPool(available)
    for (let i = 0; i < poolSize; i++) {
      available[i] = ShmBuffer.create(webShm, width, height, shmBufferPool)
    }
    return shmBufferPool
  }

  constructor (available) {
    /**
     * @type {Array<ShmBuffer>}
     * @protected
     */
    this._available = available
    /**
     * @type {Array<ShmBuffer>}
     * @protected
     */
    this._busy = []
  }

  /**
   * @param {ShmBuffer}shmBuffer
   */
  give (shmBuffer) {
    const idx = this._busy.indexOf(shmBuffer)
    if (idx > -1) {
      this._busy.splice(idx, 1)
    }
    this._available.push(shmBuffer)
  }

  /**
   * @return {ShmBuffer|null}
   */
  take () {
    const shmBuffer = this._available.shift()
    if (shmBuffer != null) {
      this._busy.push(shmBuffer)
      return shmBuffer
    }
    return null
  }
}

/**
 * @implements GrWebShmBufferEvents
 * @implements WlBufferEvents
 */
class ShmBuffer {
  /**
   * @param {GrWebShmProxy}webShm
   * @param {number}width
   * @param {number}height
   * @param {ShmBufferPool}webArrayBufferPool
   * @return {ShmBuffer}
   */
  static create (webShm, width, height, webArrayBufferPool) {
    const arrayBuffer = new ArrayBuffer(height * width * Uint32Array.BYTES_PER_ELEMENT)
    const pixelContent = webFS.fromArrayBuffer(arrayBuffer)

    const proxy = webShm.createWebArrayBuffer()
    const bufferProxy = webShm.createBuffer(proxy, width, height)

    const shmBuffer = new ShmBuffer(proxy, bufferProxy, pixelContent, arrayBuffer, width, height, webArrayBufferPool)

    proxy.listener = shmBuffer
    bufferProxy.listener = shmBuffer

    return shmBuffer
  }

  /**
   * @param {GrWebShmBufferProxy}proxy
   * @param {WlBufferProxy}bufferProxy
   * @param {WebFD}pixelContent
   * @param {ArrayBuffer}arrayBuffer
   * @param {number}width
   * @param {number}height
   * @param {ShmBufferPool}shmBufferPool
   */
  constructor (proxy, bufferProxy, pixelContent, arrayBuffer, width, height, shmBufferPool) {
    /**
     * @type {GrWebShmBufferProxy}
     */
    this.proxy = proxy
    /**
     * @type {WlBufferProxy}
     */
    this.bufferProxy = bufferProxy
    /**
     * @type {WebFD}
     * @private
     */
    this._pixelContent = pixelContent
    /**
     * @type {ArrayBuffer}
     */
    this.arrayBuffer = arrayBuffer
    /**
     * @type {number}
     */
    this.width = width
    /**
     * @type {number}
     */
    this.height = height
    /**
     * @type {ShmBufferPool}
     * @private
     */
    this._shmBufferPool = shmBufferPool
  }

  attach () {
    this.proxy.attach(this._pixelContent)
  }

  /**
   *
   *                Detaches a previously attached HTML5 array buffer from the compositor and returns it to the client so
   *                it can be reused again for writing. After detaching, the array buffer ownership is passed from
   *                the compositor main thread back to the client.
   *
   *
   * @param {WebFD} contents An HTML5 array buffer, detached from the compositor
   *
   * @since 1
   *
   */
  async detach (contents) {
    this._pixelContent = contents
    this.arrayBuffer = /** @type {ArrayBuffer} */ await contents.getTransferable()
  }

  /**
   *
   *  Sent when this wl_buffer is no longer used by the compositor.
   *  The client is now free to reuse or destroy this buffer and its
   *  backing storage.
   *
   *  If a client receives a release event before the frame callback
   *  requested in the same wl_surface.commit that attaches this
   *  wl_buffer to a surface, then the client is immediately free to
   *  reuse the buffer and its backing storage, and does not need a
   *  second buffer for the next surface content update. Typically
   *  this is possible, when the compositor maintains a copy of the
   *  wl_surface contents, e.g. as a GL texture. This is an important
   *  optimization for GL(ES) compositors with wl_shm clients.
   *
   *
   *
   * @since 1
   *
   */
  release () {
    this._shmBufferPool.give(this)
  }
}

/**
 * @implements WlRegistryEvents
 * @implements WlShellSurfaceEvents
 */
class Window {
  /**
   * @param {number}width
   * @param {number}height
   * @return {Window}
   */
  static create (width, height) {
    const registry = display.getRegistry()
    const window = new Window(registry, width, height)
    registry.listener = window
    return window
  }

  /**
   * @param {WlRegistryProxy}registry
   * @param {number}width
   * @param {number}height
   */
  constructor (registry, width, height) {
    /**
     * @type {WlRegistryProxy}
     * @protected
     */
    this._registry = registry
    /**
     * @type {number}
     */
    this.width = width
    /**
     * @type {number}
     */
    this.height = height
    /**
     * @type {ShmBufferPool|null}
     * @private
     */
    this._shmBufferPool = null
    /**
     * @type {WlCompositorProxy|null}
     * @private
     */
    this._compositor = null
    /**
     * @type {GrWebShmProxy|null}
     * @private
     */
    this._webShm = null
    /**
     * @type {WlShellProxy|null}
     * @private
     */
    this._shell = null
    /**
     * @type {WlSurfaceProxy|null}
     * @private
     */
    this._surface = null
  }

  /**
   *
   *  Notify the client of global objects.
   *
   *  The event notifies the client that a global object with
   *  the given name is now available, and it implements the
   *  given version of the given interface.
   *
   *
   * @param {number} name numeric name of the global object
   * @param {string} interface_ interface implemented by the object
   * @param {number} version interface version
   *
   * @since 1
   *
   */
  global (name, interface_, version) {
    if (interface_ === WlCompositorProxy.protocolName) {
      this._compositor = this._registry.bind(name, interface_, WlCompositorProxy, version)
      this._surface = this._compositor.createSurface()
      this._onFrame = frame(this._surface)
    }

    if (interface_ === GrWebShmProxy.protocolName) {
      this._webShm = this._registry.bind(name, interface_, GrWebShmProxy, version)
      this._webShm.listener = this

      this._shmBufferPool = ShmBufferPool.create(this._webShm, 2, this.width, this.height)
    }

    if (interface_ === WlShellProxy.protocolName) {
      this._shell = this._registry.bind(name, interface_, WlShellProxy, version)
    }
  }

  init () {
    this._shellSurface = this._shell.getShellSurface(this._surface)
    this._shellSurface.listener = this
    this._shellSurface.setToplevel()
    this._shellSurface.setTitle('Simple Web Shm')
  }

  /**
   * @param {ShmBuffer}shmBuffer
   * @param {number}timestamp
   * @private
   */
  _paintPixels (shmBuffer, timestamp) {
    const halfh = shmBuffer.width >> 1
    const halfw = shmBuffer.height >> 1
    let ir
    let or
    const image = new Uint32Array(shmBuffer.arrayBuffer)

    /* squared radii thresholds */
    or = (halfw < halfh ? halfw : halfh) - 8
    ir = or - 32
    or = or * or
    ir = ir * ir

    let offset = 0
    for (let y = 0; y < shmBuffer.height; y++) {
      const y2 = (y - halfh) * (y - halfh)

      for (let x = 0; x < shmBuffer.width; x++) {
        let v
        let w = 0xff000000

        /* squared distance from center */
        const r2 = (x - halfw) * (x - halfw) + y2

        if (r2 < ir) {
          v = ((r2 >> 5) + (timestamp >> 6)) * 0x0080401
        } else if (r2 < or) {
          v = (y + (timestamp >> 5)) * 0x0080401
        } else {
          v = (x + (timestamp >> 4)) * 0x0080401
        }
        // ARGB => ABGR (RGBA LE)
        w |= ((v & 0x00ff0000) >> 16) // R
        w |= ((v & 0x0000ff00)) // G
        w |= ((v & 0x000000ff) << 16) // B

        image[offset++] = w
      }
    }
  }

  /**
   * @param {number}timestamp
   */
  draw (timestamp) {
    const shmBuffer = this._shmBufferPool.take()
    if (shmBuffer) {
      this._paintPixels(shmBuffer, timestamp)
      shmBuffer.attach()

      this._surface.attach(shmBuffer.bufferProxy, 0, 0)
      this._surface.damage(0, 0, shmBuffer.width, shmBuffer.height)

      // Wait for the compositor to signal that we can draw the next frame.
      // Note that using 'await' here would result in a deadlock as the event loop would be blocked, and the event
      // that resolves the await state would never be picked up by the blocked event loop.
      this._onFrame().then(timestamp => this.draw(timestamp))

      // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
      this._surface.commit(0)
    } else {
      console.error('All buffers occupied by compositor!')
      display.close()
    }
  }

  /**
   * @param {number}name
   */
  globalRemove (name) {
    // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
  }

  /**
   *
   *  The configure event asks the client to resize its surface.
   *
   *  The size is a hint, in the sense that the client is free to
   *  ignore it if it doesn't resize, pick a smaller size (to
   *  satisfy aspect ratio or resize in steps of NxM pixels).
   *
   *  The edges parameter provides a hint about how the surface
   *  was resized. The client may use this information to decide
   *  how to adjust its content to the new size (e.g. a scrolling
   *  area might adjust its content position to leave the viewable
   *  content unmoved).
   *
   *  The client is free to dismiss all but the last configure
   *  event it received.
   *
   *  The width and height arguments specify the size of the window
   *  in surface-local coordinates.
   *
   *
   * @param {number} edges how the surface was resized
   * @param {number} width new width of the surface
   * @param {number} height new height of the surface
   *
   * @since 1
   *
   */
  configure (edges, width, height) { /* NOOP */ }

  /**
   *
   *  Ping a client to check if it is receiving events and sending
   *  requests. A client is expected to reply with a pong request.
   *
   *
   * @param {number} serial serial number of the ping
   *
   * @since 1
   *
   */
  ping (serial) {
    this._shellSurface.pong(serial)
  }

  /**
   *
   *  The popup_done event is sent out when a popup grab is broken,
   *  that is, when the user clicks a surface that doesn't belong
   *  to the client owning the popup surface.
   *
   *
   *
   * @since 1
   *
   */
  popupDone () { /* NOOP */ }
}

async function main () {
  // create a new window with some buffers
  const window = Window.create(250, 250)

  // create a sync promise
  const syncPromise = display.sync()

  // flush out window creation & sync requests to the compositor
  display.flush()

  // wait for compositor to have processed all our outgoing requests
  await syncPromise

  // Now begin drawing after the compositor is done processing all our requests
  window.init()
  window.draw(0)

  // wait for the display connection to close
  try {
    await display.onClose()
    console.log('Application exit.')
  } catch (e) {
    console.error('Application terminated with error.')
    console.error(e.stackTrace)
  }
}

main()
