// Copyright 2020 Erik De Rijcke
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
  frame,
  GrWebShmBufferEvents,
  GrWebShmBufferProxy,
  GrWebShmProtocolName,
  GrWebShmProxy,
  webFS,
  WlBufferEvents,
  WlBufferProxy,
  WlCompositorProtocolName,
  WlCompositorProxy,
  WlRegistryEvents,
  WlRegistryProxy,
  WlShellProtocolName,
  WlShellProxy,
  WlShellSurfaceEvents,
  WlShellSurfaceProxy,
  WlSurfaceProxy
} from 'westfield-runtime-client'
import { WebFD } from 'westfield-runtime-common'

class ShmBufferPool {
  static create(webShm: GrWebShmProxy, poolSize: number, width: number, height: number): ShmBufferPool {
    const available = new Array(poolSize)
    const shmBufferPool = new ShmBufferPool(available)
    for (let i = 0; i < poolSize; i++) {
      available[i] = ShmBuffer.create(webShm, width, height, shmBufferPool)
    }
    return shmBufferPool
  }

  private readonly _available: ShmBuffer[]
  private _busy: ShmBuffer[] = []

  constructor(available: Array<ShmBuffer>) {
    this._available = available
    this._busy = []
  }

  give(shmBuffer: ShmBuffer) {
    const idx = this._busy.indexOf(shmBuffer)
    if (idx > -1) {
      this._busy.splice(idx, 1)
    }
    this._available.push(shmBuffer)
  }

  take(): ShmBuffer | null {
    const shmBuffer = this._available.shift()
    if (shmBuffer != null) {
      this._busy.push(shmBuffer)
      return shmBuffer
    }
    return null
  }
}

class ShmBuffer implements GrWebShmBufferEvents, WlBufferEvents {
  static create(webShm: GrWebShmProxy, width: number, height: number, webArrayBufferPool: ShmBufferPool): ShmBuffer {
    const arrayBuffer = new ArrayBuffer(height * width * Uint32Array.BYTES_PER_ELEMENT)
    const pixelContent = webFS.fromArrayBuffer(arrayBuffer)

    const proxy = webShm.createWebArrayBuffer()
    const bufferProxy = webShm.createBuffer(proxy, width, height)

    const shmBuffer = new ShmBuffer(proxy, bufferProxy, pixelContent, arrayBuffer, width, height, webArrayBufferPool)

    proxy.listener = shmBuffer
    bufferProxy.listener = shmBuffer

    return shmBuffer
  }

  readonly width: number
  readonly height: number
  readonly bufferProxy: WlBufferProxy
  arrayBuffer: ArrayBuffer

  private proxy: GrWebShmBufferProxy
  private _pixelContent: WebFD
  private _shmBufferPool: ShmBufferPool

  constructor(proxy: GrWebShmBufferProxy, bufferProxy: WlBufferProxy, pixelContent: WebFD, arrayBuffer: ArrayBuffer, width: number, height: number, shmBufferPool: ShmBufferPool) {
    this.proxy = proxy
    this.bufferProxy = bufferProxy
    this._pixelContent = pixelContent
    this.arrayBuffer = arrayBuffer
    this.width = width
    this.height = height
    this._shmBufferPool = shmBufferPool
  }

  attach() {
    this.proxy.attach(this._pixelContent)
  }

  async detach(contents: WebFD) {
    this._pixelContent = contents
    this.arrayBuffer = (await contents.getTransferable()) as ArrayBuffer
  }

  release() {
    this._shmBufferPool.give(this)
  }
}

class Window implements WlRegistryEvents, WlShellSurfaceEvents {
  private _registry: WlRegistryProxy
  private readonly width: number
  private readonly height: number

  private _onFrame?: () => Promise<number>
  private _shmBufferPool?: ShmBufferPool
  private _compositor?: WlCompositorProxy
  private _webShm?: GrWebShmProxy
  private _shell?: WlShellProxy
  private _surface?: WlSurfaceProxy
  private _shellSurface?: WlShellSurfaceProxy

  static create(width: number, height: number): Window {
    const registry = display.getRegistry()
    const window = new Window(registry, width, height)
    registry.listener = window
    return window
  }

  constructor(registry: WlRegistryProxy, width: number, height: number) {
    this._registry = registry
    this.width = width
    this.height = height
  }

  global(name: number, interface_: string, version: number) {
    if (interface_ === WlCompositorProtocolName) {
      this._compositor = this._registry.bind(name, interface_, WlCompositorProxy, version)
      this._surface = this._compositor.createSurface()
      this._onFrame = frame(this._surface)
    }

    if (interface_ === GrWebShmProtocolName) {
      this._webShm = this._registry.bind(name, interface_, GrWebShmProxy, version)
      this._shmBufferPool = ShmBufferPool.create(this._webShm, 2, this.width, this.height)
    }

    if (interface_ === WlShellProtocolName) {
      this._shell = this._registry.bind(name, interface_, WlShellProxy, version)
    }
  }

  init() {
    if (this._shell === undefined) {
      display.close()
      throw new Error('No shell proxy.')
    }
    if (this._surface === undefined) {
      display.close()
      throw new Error('No surface proxy.')
    }
    this._shellSurface = this._shell.getShellSurface(this._surface)
    this._shellSurface.listener = this
    this._shellSurface.setToplevel()
    this._shellSurface.setTitle('Simple Web Shm')
  }

  _paintPixels(shmBuffer: ShmBuffer, timestamp: number) {
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

  draw(timestamp: number) {
    if (this._shmBufferPool === undefined) {
      display.close()
      throw new Error('No shm buffer pool.')
    }
    if (this._surface === undefined) {
      display.close()
      throw new Error('No surface proxy.')
    }


    const shmBuffer = this._shmBufferPool.take()
    if (shmBuffer) {
      this._paintPixels(shmBuffer, timestamp)
      shmBuffer.attach()

      this._surface.attach(shmBuffer.bufferProxy, 0, 0)
      this._surface.damage(0, 0, shmBuffer.width, shmBuffer.height)

      // Wait for the compositor to signal that we can draw the next frame.
      // Note that using 'await' here would result in a deadlock as the event loop would be blocked, and the event
      // that resolves the await state would never be picked up by the blocked event loop.
      this._onFrame?.().then(timestamp => this.draw(timestamp))

      // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
      this._surface.commit(0)
    } else {
      console.error('All buffers occupied by compositor!')
      display.close()
    }
  }

  globalRemove(name: number) {
    // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
  }

  configure(edges: number, width: number, height: number) { /* NOOP */
  }

  ping(serial: number) {
    if (this._shellSurface === undefined) {
      throw new Error('No shell surface proxy.')
    }
    this._shellSurface.pong(serial)
  }

  popupDone() {
  }
}

async function main() {
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
