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

import React from 'react'
import { init, render } from 'react-canvaskit'
import {
  display,
  frame,
  GrWebGlBufferEvents,
  GrWebGlBufferProxy,
  GrWebGlProtocolName,
  GrWebGlProxy,
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
  WlSurfaceProxy
} from 'westfield-runtime-client'
import { Fixed, WebFD } from 'westfield-runtime-common'

import { App } from './App'
import { GreenfieldProvider, initGreenfieldContext } from './GreenfieldContext'

class GLBuffer implements GrWebGlBufferEvents, WlBufferEvents {
  static create(webGL: GrWebGlProxy): GLBuffer {
    const proxy = webGL.createWebGlBuffer()
    const bufferProxy = webGL.createBuffer(proxy)

    const glBuffer = new GLBuffer(proxy, bufferProxy)

    proxy.listener = glBuffer
    bufferProxy.listener = glBuffer

    return glBuffer
  }

  readonly proxy: GrWebGlBufferProxy
  readonly bufferProxy: WlBufferProxy
  canvas?: OffscreenCanvas

  constructor(proxy: GrWebGlBufferProxy, bufferProxy: WlBufferProxy) {
    this.proxy = proxy
    this.bufferProxy = bufferProxy
  }

  async offscreenCanvas(canvas: WebFD) {
    this.canvas = (await canvas.getTransferable()) as OffscreenCanvas
  }

  release() {
  }
}

class Window implements WlRegistryEvents, WlShellSurfaceEvents, WlSeatEvents, WlPointerEvents {
  static create(): Window {
    const registry = display.getRegistry()
    const window = new Window(registry)
    registry.listener = window
    return window
  }

  private readonly _registry: WlRegistryProxy
  private _webGL?: GrWebGlProxy
  private _compositor?: WlCompositorProxy
  private _shell?: WlShellProxy
  private _seat?: WlSeatProxy
  private _surface?: WlSurfaceProxy
  private _shellSurface?: WlShellSurfaceProxy
  private _glBuffer?: GLBuffer
  private _lastFrameRenderTime = Date.now()
  private _frameCount = 0
  private _onFrame?: () => Promise<number>
  private _frameCallbacks: ((time: number) => void)[] = []
  private _pointer?: WlPointerProxy

  constructor(registry: WlRegistryProxy) {
    this._registry = registry
  }

  global(name: number, interface_: string, version: number) {
    switch (interface_) {
      case WlCompositorProtocolName: {
        this._compositor = this._registry.bind(name, WlCompositorProtocolName, WlCompositorProxy, version)
        this._surface = this._compositor.createSurface()
        this._onFrame = frame(this._surface)
        break
      }

      case GrWebGlProtocolName: {
        this._webGL = this._registry.bind(name, GrWebGlProtocolName, GrWebGlProxy, version)
        this._glBuffer = GLBuffer.create(this._webGL)
        break
      }

      case WlShellProtocolName: {
        this._shell = this._registry.bind(name, WlShellProtocolName, WlShellProxy, version)
        break
      }

      case WlSeatProtocolName: {
        this._seat = this._registry.bind(name, WlSeatProtocolName, WlSeatProxy, version)
        this._seat.listener = this
      }
    }
  }

  async init(width: number, height: number) {
    if (this._shell === undefined) {
      throw new Error('No shell.')
    }
    if (this._surface === undefined) {
      throw new Error('No surface.')
    }

    this._shellSurface = this._shell.getShellSurface(this._surface)
    this._shellSurface.listener = this
    this._shellSurface.setToplevel()
    this._shellSurface.setTitle('Simple WebGL')

    const syncPromise = display.sync()
    display.flush()
    await syncPromise

    if (this._glBuffer === undefined) {
      throw new Error('No GLBuffer.')
    }
    if (this._glBuffer.canvas === undefined) {
      throw new Error('No canvas on GLBuffer.')
    }

    this._glBuffer.canvas.width = width
    this._glBuffer.canvas.height = height

    initGreenfieldContext({
      requestSurfaceFrame: frameCallback => this._frameCallbacks = [...this._frameCallbacks, frameCallback]
    })
    const canvas = this._glBuffer.canvas
    await init()
    render(<GreenfieldProvider><App/></GreenfieldProvider>, canvas, () => this.draw())

    setInterval(() => {
      console.log(`Simpl-WebGL: ${this._frameCount} fps`)
      this._frameCount = 0
    }, 1000)
  }

  draw() {
    if (this._surface === undefined) {
      throw new Error('No surface.')
    }
    if (this._glBuffer === undefined) {
      throw new Error('No GLBuffer.')
    }
    if (this._glBuffer.canvas === undefined) {
      throw new Error('No canvas on GLBuffer.')
    }

    this._onFrame?.().then(time => {
      // we need to create a copy to avoid deleting new callbacks that are added by our foreach loop.
      const frameCallbackCopy = this._frameCallbacks
      this._frameCallbacks = []
      frameCallbackCopy.forEach(frameCallback => frameCallback(time))
    })

    this._surface.attach(this._glBuffer.bufferProxy, 0, 0)
    this._surface.damage(0, 0, this._glBuffer.canvas.width, this._glBuffer.canvas.height)
    // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
    this._surface.commit(0)
    display.flush()

    this._frameCount++
  }

  globalRemove(name: number) {
    // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
  }

  configure(edges: number, width: number, height: number) { /* NOOP */
  }

  ping(serial: number) {
    if (this._shellSurface === undefined) {
      throw new Error('No shellsurface.')
    }
    this._shellSurface.pong(serial)
  }

  popupDone() {
  }

  capabilities(capabilities: number) {
    if (this._seat === undefined) {
      throw new Error('No seat.')
    }

    if (capabilities & WlSeatCapability._pointer) {
      this._pointer = this._seat.getPointer()
      this._pointer.listener = this
    } else if (this._pointer) {
      this._pointer.release()
      this._pointer = undefined
    }
  }

  name(name: string) {
  }

  axis(time: number, axis: number, value: Fixed) {
  }

  axisDiscrete(axis: number, discrete: number) {
  }

  axisSource(axisSource: number) {
  }

  axisStop(time: number, axis: number) {
  }

  button(serial: number, time: number, button: number, state: number) {
    if (this._shellSurface === undefined || this._seat === undefined) {
      return
    }

    if (state & WlPointerButtonState._pressed) {
      this._shellSurface.move(this._seat, serial)
    }
  }

  enter(serial: number, surface: WlSurfaceProxy, surfaceX: Fixed, surfaceY: Fixed) {
  }

  frame() {
  }

  leave(serial: number, surface: WlSurfaceProxy) {
  }

  motion(time: number, surfaceX: Fixed, surfaceY: Fixed) {
  }
}

async function main() {
  // create a new window with some buffers
  const window = Window.create()

  // create a sync promise
  const syncPromise = display.sync()

  // flush out window creation & sync requests to the compositor
  display.flush()

  // wait for compositor to have processed all our outgoing requests
  await syncPromise

  // Now begin drawing after the compositor is done processing all our requests
  await window.init(500, 500)
  display.flush()

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
