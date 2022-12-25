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
  WlSurfaceProxy,
  XdgSurfaceProxy,
  XdgToplevelEvents,
  XdgToplevelProxy,
  XdgWmBaseEvents,
  XdgWmBaseProtocolName,
  XdgWmBaseProxy,
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

class Window implements WlRegistryEvents, XdgWmBaseEvents, XdgToplevelEvents, WlSeatEvents, WlPointerEvents {
  static create(width: number, height: number): Window {
    const registry = display.getRegistry()
    const window = new Window(registry, width, height)
    registry.listener = window
    return window
  }

  private readonly wlRegistryProxy: WlRegistryProxy
  private webGlProxy?: GfWebBufferFactoryProxy
  private wlCompositorProxy?: WlCompositorProxy
  private xdgWmBaseProxy?: XdgWmBaseProxy
  private wlSeatProxy?: WlSeatProxy
  private wlSurfaceProxy?: WlSurfaceProxy
  private xdgSurfaceProxy?: XdgSurfaceProxy
  private xdgToplevelProxy?: XdgToplevelProxy
  private frameCount = 0
  private wlPointerProxy?: WlPointerProxy
  private drawingState?: unknown
  private readonly canvas: OffscreenCanvas

  constructor(registry: WlRegistryProxy, public width: number, public height: number) {
    this.wlRegistryProxy = registry
    this.canvas = new OffscreenCanvas(width, height)
  }

  close(): void {
    throw new Error('Method not implemented.')
  }

  global(name: number, interface_: string, version: number) {
    switch (interface_) {
      case WlCompositorProtocolName: {
        this.wlCompositorProxy = this.wlRegistryProxy.bind(name, WlCompositorProtocolName, WlCompositorProxy, version)
        this.wlSurfaceProxy = this.wlCompositorProxy.createSurface()
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

      case XdgWmBaseProtocolName: {
        this.xdgWmBaseProxy = this.wlRegistryProxy.bind(name, XdgWmBaseProtocolName, XdgWmBaseProxy, version)
        this.xdgWmBaseProxy.listener = this
        break
      }

      case WlSeatProtocolName: {
        this.wlSeatProxy = this.wlRegistryProxy.bind(name, WlSeatProtocolName, WlSeatProxy, version)
        this.wlSeatProxy.listener = this
        break
      }
    }
  }

  async init() {
    if (this.xdgWmBaseProxy === undefined) {
      throw new Error('No shell.')
    }
    if (this.wlSurfaceProxy === undefined) {
      throw new Error('No surface.')
    }

    this.xdgSurfaceProxy = this.xdgWmBaseProxy.getXdgSurface(this.wlSurfaceProxy)
    this.xdgSurfaceProxy.listener = {
      configure: (serial: number) => {
        this.xdgSurfaceProxy?.ackConfigure(serial)
        if (this.drawingState === undefined) {
          this.drawingState = 'dummy'
          // Now begin drawing after the compositor is done processing all our requests
          this.drawOnce(0)
        }
      },
    }
    this.xdgToplevelProxy = this.xdgSurfaceProxy.getToplevel()
    this.xdgToplevelProxy.listener = this

    this.xdgToplevelProxy.setTitle('Simple WebGL')
    this.wlSurfaceProxy.commit(0)
    const syncPromise = display.sync()
    display.flush()
    await syncPromise
    setInterval(() => {
      console.log(`Simpl-WebGL: ${this.frameCount} fps`)
      this.frameCount = 0
    }, 1000)
  }

  /**
   * @param {number}time
   */
  async drawOnce(time: number) {
    if (this.wlSurfaceProxy === undefined) {
      throw new Error('No surface.')
    }
    if (this.drawingState === undefined) {
      throw new Error('No drawing state.')
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

  configure(width: number, height: number, states: ArrayBuffer) {
    this.width = width === 0 ? this.width : width
    this.height = height === 0 ? this.height : height
    // TODO resize
  }

  ping(serial: number) {
    if (this.xdgWmBaseProxy === undefined) {
      throw new Error('No shellsurface.')
    }
    this.xdgWmBaseProxy.pong(serial)
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
    if (this.xdgToplevelProxy === undefined || this.wlSeatProxy === undefined) {
      return
    }

    if (state & WlPointerButtonState._pressed) {
      this.xdgToplevelProxy.move(this.wlSeatProxy, serial)
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
  // wait for globals to come in
  const syncPromise = display.sync()
  display.flush()
  await syncPromise
  // init protocol objects
  await window.init()
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
