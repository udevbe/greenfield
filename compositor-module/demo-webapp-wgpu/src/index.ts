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
  GfWebBufferFactoryProtocolName,
  GfWebBufferFactoryProxy,
  WlBufferEvents,
  WlBufferProxy,
  WlCompositorProtocolName,
  WlCompositorProxy,
  WlPointerButtonState,
  WlPointerEvents,
  WlPointerProxy,
  WlRegistryEvents,
  WlRegistryProxy,
  WlSeatCapability,
  WlSeatEvents,
  WlSeatProtocolName,
  WlSeatProxy,
  WlShellProtocolName,
  WlShellProxy,
  WlShellSurfaceEvents,
  WlShellSurfaceProxy,
  WlSurfaceProxy,
} from 'westfield-runtime-client'
import { Fixed } from 'westfield-runtime-common'

import { setup_and_draw } from '../pkg'

class ImageBitmapBuffer implements WlBufferEvents {
  static create(webGL: GfWebBufferFactoryProxy, imageBitmap: ImageBitmap): ImageBitmapBuffer {
    const proxy = webGL.createBuffer(imageBitmap)
    const glBuffer = new ImageBitmapBuffer(proxy, imageBitmap)
    proxy.listener = glBuffer
    return glBuffer
  }

  constructor(readonly proxy: WlBufferProxy, readonly imageBitmap: ImageBitmap) {}

  release() {
    this.imageBitmap.close()
    this.proxy.destroy()
  }
}

class Window implements WlRegistryEvents, WlShellSurfaceEvents, WlSeatEvents, WlPointerEvents {
  static create(width: number, height: number): Window {
    const registry = display.getRegistry()
    const window = new Window(registry, width, height)
    registry.listener = window
    return window
  }

  private readonly wlRegistryProxy: WlRegistryProxy
  private webGlProxy?: GfWebBufferFactoryProxy
  private wlCompositorProxy?: WlCompositorProxy
  private wlShellProxy?: WlShellProxy
  private wlSeatProxy?: WlSeatProxy
  private wlSurfaceProxy?: WlSurfaceProxy
  private wlShellSurfaceProxy?: WlShellSurfaceProxy
  private frameCount = 0
  // private onFrame?: () => Promise<number>
  private wlPointerProxy?: WlPointerProxy
  private readonly canvas: OffscreenCanvas

  constructor(registry: WlRegistryProxy, public width: number, public height: number) {
    this.wlRegistryProxy = registry
    this.canvas = new OffscreenCanvas(width, height)
  }

  global(name: number, interface_: string, version: number) {
    switch (interface_) {
      case WlCompositorProtocolName: {
        this.wlCompositorProxy = this.wlRegistryProxy.bind(name, WlCompositorProtocolName, WlCompositorProxy, version)
        this.wlSurfaceProxy = this.wlCompositorProxy.createSurface()
        // this.onFrame = frame(this.wlSurfaceProxy)
        break
      }

      case GfWebBufferFactoryProtocolName: {
        this.webGlProxy = this.wlRegistryProxy.bind(
          name,
          GfWebBufferFactoryProtocolName,
          GfWebBufferFactoryProxy,
          version,
        )
        break
      }

      case WlShellProtocolName: {
        this.wlShellProxy = this.wlRegistryProxy.bind(name, WlShellProtocolName, WlShellProxy, version)
        break
      }

      case WlSeatProtocolName: {
        this.wlSeatProxy = this.wlRegistryProxy.bind(name, WlSeatProtocolName, WlSeatProxy, version)
        this.wlSeatProxy.listener = this
      }
    }
  }

  async init() {
    if (this.wlShellProxy === undefined) {
      throw new Error('No shell.')
    }
    if (this.wlSurfaceProxy === undefined) {
      throw new Error('No surface.')
    }

    this.wlShellSurfaceProxy = this.wlShellProxy.getShellSurface(this.wlSurfaceProxy)
    this.wlShellSurfaceProxy.listener = this
    this.wlShellSurfaceProxy.setToplevel()
    this.wlShellSurfaceProxy.setTitle('Simple WebGL')

    const syncPromise = display.sync()
    display.flush()
    await syncPromise

    setInterval(() => {
      console.log(`FPS: ${this.frameCount}`)
      this.frameCount = 0
    }, 1000)
  }

  /**
   * @param {number}time
   */
  async draw() {
    if (this.wlSurfaceProxy === undefined) {
      throw new Error('No surface.')
    }
    if (this.webGlProxy === undefined) {
      throw new Error('No image bitmap buffer available.')
    }

    await setup_and_draw(this.canvas)

    const imageBitmap = this.canvas.transferToImageBitmap()
    const imageBitmapBuffer = ImageBitmapBuffer.create(this.webGlProxy, imageBitmap)
    this.wlSurfaceProxy.attach(imageBitmapBuffer.proxy, 0, 0)
    this.wlSurfaceProxy.damage(0, 0, this.canvas.width, this.canvas.height)

    // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
    this.wlSurfaceProxy.commit(0)
    display.flush()

    this.frameCount++
  }

  globalRemove(name: number) {
    // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
  }

  configure(edges: number, width: number, height: number) {
    // TODO
  }

  ping(serial: number) {
    if (this.wlShellSurfaceProxy === undefined) {
      throw new Error('No shellsurface.')
    }
    this.wlShellSurfaceProxy.pong(serial)
  }

  popupDone() {
    // TODO
  }

  capabilities(capabilities: number) {
    if (this.wlSeatProxy === undefined) {
      throw new Error('No seat.')
    }

    if (capabilities & WlSeatCapability._pointer) {
      this.wlPointerProxy = this.wlSeatProxy.getPointer()
      this.wlPointerProxy.listener = this
    } else if (this.wlPointerProxy) {
      this.wlPointerProxy.release()
      this.wlPointerProxy = undefined
    }
  }

  name(name: string) {
    // TODO
  }

  axis(time: number, axis: number, value: Fixed) {
    // TODO
  }

  axisDiscrete(axis: number, discrete: number) {
    // TODO
  }

  axisSource(axisSource: number) {
    // TODO
  }

  axisStop(time: number, axis: number) {
    // TODO
  }

  button(serial: number, time: number, button: number, state: number) {
    if (this.wlShellSurfaceProxy === undefined || this.wlSeatProxy === undefined) {
      return
    }

    if (state & WlPointerButtonState._pressed) {
      this.wlShellSurfaceProxy.move(this.wlSeatProxy, serial)
    }
  }

  enter(serial: number, surface: WlSurfaceProxy, surfaceX: Fixed, surfaceY: Fixed) {
    // TODO
  }

  frame() {
    // TODO
  }

  leave(serial: number, surface: WlSurfaceProxy) {
    // TODO
  }

  motion(time: number, surfaceX: Fixed, surfaceY: Fixed) {
    // TODO
  }
}

async function main() {
  // create a new window with some buffers
  const window = Window.create(800, 600)
  // create a sync promise
  const syncPromise = display.sync()
  // flush out window creation & sync requests to the compositor
  display.flush()
  // wait for compositor to have processed all our outgoing requests
  await syncPromise
  // Now begin drawing after the compositor is done processing all our requests
  await window.init()
  await window.draw()
  display.flush()
  // wait for the display connection to close
  try {
    await display.onClose()
    console.log('Application exit.')
  } catch (e: any) {
    console.error('Application terminated with error.')
    console.error(e.stackTrace)
  }
}

main()
