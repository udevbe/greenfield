import {
  connect,
  Display as WlDisplay,
  WlBufferProxy,
  WlCallbackEvents,
  WlCallbackProxy,
  WlCompositorProtocolName,
  WlCompositorProxy,
  WlKeyboardProxy,
  WlRegistryEvents,
  WlRegistryProxy,
  WlSeatCapability,
  WlSeatEvents,
  WlSeatProtocolName,
  WlSeatProxy,
  WlShmEvents,
  WlShmFormat,
  WlShmProtocolName,
  WlShmProxy,
  WlSurfaceProxy,
  XdgSurfaceEvents,
  XdgSurfaceProxy,
  XdgToplevelEvents,
  XdgToplevelProxy,
  XdgToplevelState,
  XdgWmBaseEvents,
  XdgWmBaseProtocolName,
  XdgWmBaseProxy,
} from '@gfld/client-protocol'

const MAX_BUFFER_ALLOC = 2 as const
const KEY_ESC = 1 as const

interface ClientDisplay {
  display: WlDisplay
  registry: WlRegistryProxy
  compositor?: WlCompositorProxy
  wmBase?: XdgWmBaseProxy
  seat?: WlSeatProxy
  keyboard?: WlKeyboardProxy
  shm?: WlShmProxy
  hasXRGB: boolean
}

type ClientBuffer = {
  window: ClientWindow
  buffer?: WlBufferProxy
  shmData?: Uint8Array
  busy: boolean
  width: number
  height: number
  size: number /* width * 4 * height */
}

type ClientWindow = {
  display: ClientDisplay
  width: number
  height: number
  initWidth: number
  initHeight: number
  surface: WlSurfaceProxy
  xdgSurface?: XdgSurfaceProxy
  xdgToplevel?: XdgToplevelProxy
  bufferList: ClientBuffer[]
  prevBuffer?: ClientBuffer
  waitForConfigure: boolean
  maximized: boolean
  fullscreen: boolean
  needsUpdateBuffer: boolean
}

let terminate: () => void
const termination = new Promise<void>((resolve) => (terminate = resolve))

function destroyBuffer(buffer: ClientBuffer) {
  if (buffer.buffer !== undefined) {
    buffer.buffer.destroy()
  }

  buffer.shmData = undefined
  buffer.window.bufferList = buffer.window.bufferList.filter((otherBuffer) => otherBuffer !== buffer)
}

class Window implements ClientWindow, XdgSurfaceEvents, WlCallbackEvents {
  bufferList: ClientBuffer[] = []
  callback?: WlCallbackProxy
  fullscreen = false
  initHeight = 0
  initWidth = 0
  maximized = false
  needsUpdateBuffer = false
  prevBuffer?: ClientBuffer
  surface: WlSurfaceProxy
  waitForConfigure = false
  xdgSurface?: XdgSurfaceProxy
  xdgToplevel?: XdgToplevelProxy
  xdgTopLevelEvents: XdgToplevelEvents = {
    close: () => {
      this.xdgToplevelClose()
    },
    configure: (width: number, height: number, states: ArrayBuffer) => {
      this.xdgToplevelConfigure(width, height, states)
    },
  }

  constructor(public readonly display: ClientDisplay, public width: number, public height: number) {
    this.initWidth = width
    this.initHeight = height
    this.surface = this.display.compositor!.createSurface()

    if (display.wmBase) {
      this.xdgSurface = display.wmBase.getXdgSurface(this.surface)
      this.xdgSurface.listener = this
      this.xdgToplevel = this.xdgSurface.getToplevel()
      this.xdgToplevel.listener = this.xdgTopLevelEvents

      this.xdgToplevel.setTitle('simple-shm')
      this.xdgToplevel.setAppId('org.freedesktop.weston.simple-shm')

      this.surface.commit()
      this.waitForConfigure = true
    }

    for (let i = 0; i < MAX_BUFFER_ALLOC; i++) {
      this.allocBuffer(this.width, this.height)
    }
  }

  allocBuffer(width: number, height: number): ClientBuffer {
    const buffer = {
      window: this,
      width,
      height,
      busy: false,
      size: 0,
    }
    this.bufferList.push(buffer)
    return buffer
  }

  pickFreeBuffer(): ClientBuffer | undefined {
    for (const buffer of this.bufferList) {
      if (!buffer.busy) {
        return buffer
      }
    }
  }

  pruneOldReleasedBuffers() {
    for (const buffer of this.bufferList) {
      if (!buffer.busy && (buffer.width !== this.width || buffer.height !== this.height)) {
        destroyBuffer(buffer)
      }
    }
  }

  createShmBuffer(buffer: ClientBuffer, format: number) {
    const width = this.width
    const height = this.height
    const stride = width * 4
    const size = stride * height
    const display = this.display

    const data = new Uint8Array(new SharedArrayBuffer(size))
    const pool = display.shm!.createPool(data, size)
    buffer.buffer = pool.createBuffer(0, width, height, stride, format)
    buffer.buffer.addDestroyListener(() => {
      buffer.busy = false
    })
    buffer.buffer.listener = {
      release() {
        buffer.busy = false
      },
    }
    pool.destroy()

    buffer.size = size
    buffer.shmData = data
  }

  configure(serial: number): void {
    this.xdgSurface!.ackConfigure(serial)

    if (this.waitForConfigure) {
      this.redraw(undefined, 0)
      this.waitForConfigure = false
    }
  }

  redraw(callback: WlCallbackProxy | undefined, time: number) {
    this.pruneOldReleasedBuffers()
    const buffer = this.nextBuffer()
    if (buffer === undefined) {
      throw new Error(!callback ? 'Failed to create the first buffer.' : 'Both buffers busy at redraw(). Server bug?')
    }

    paintPixels(buffer.shmData!, 20, this.width, this.height, time)

    this.surface.attach(buffer.buffer, 0, 0)
    this.surface.damage(20, 20, this.width - 40, this.height - 40)

    if (callback) {
      callback.destroy()
    }

    this.callback = this.surface.frame()
    this.callback.listener = this
    this.surface.commit()
    buffer.busy = true
  }

  private xdgToplevelConfigure(width: number, height: number, states: ArrayBuffer) {
    this.fullscreen = false
    this.maximized = false

    for (const state of new Uint32Array(states)) {
      switch (state) {
        case XdgToplevelState._fullscreen:
          this.fullscreen = true
          break
        case XdgToplevelState._maximized:
          this.maximized = true
          break
      }
    }

    if (width > 0 && height > 0) {
      if (!this.fullscreen && !this.maximized) {
        this.initWidth = width
        this.initHeight = height
      }
      this.width = width
      this.height = height
    } else if (!this.fullscreen && !this.maximized) {
      this.width = this.initWidth
      this.height = this.initHeight
    }

    this.needsUpdateBuffer = true
  }

  xdgToplevelClose() {
    terminate()
  }

  destroy() {
    if (this.callback) {
      this.callback.destroy()
    }

    for (const clientBuffer of this.bufferList) {
      destroyBuffer(clientBuffer)
    }

    if (this.xdgToplevel) {
      this.xdgToplevel.destroy()
    }
    if (this.xdgSurface) {
      this.xdgSurface.destroy()
    }
    this.surface.destroy()
  }

  nextBuffer() {
    if (this.needsUpdateBuffer) {
      for (let i = 0; i < MAX_BUFFER_ALLOC; i++) {
        this.allocBuffer(this.width, this.height)
      }
      this.needsUpdateBuffer = false
    }

    const buffer = this.pickFreeBuffer()

    if (buffer === undefined) {
      return undefined
    }

    if (buffer.buffer === undefined) {
      this.createShmBuffer(buffer, WlShmFormat._xrgb8888)
      /* paint the padding */
      buffer.shmData!.fill(0xff)
    }

    return buffer
  }

  done(callbackData: number): void {
    this.redraw(this.callback, callbackData)
  }
}

function paintPixels(image: Uint8Array, padding: number, width: number, height: number, time: number) {
  const halfh = padding + (height - padding * 2) / 2
  const halfw = padding + (width - padding * 2) / 2
  let ir, or
  const pixel = new Uint32Array(image.buffer, image.byteOffset, image.length / Uint32Array.BYTES_PER_ELEMENT)
  let y

  /* squared radii thresholds */
  or = (halfw < halfh ? halfw : halfh) - 8
  ir = or - 32
  or *= or
  ir *= ir

  let offset = padding * width
  for (y = padding; y < height - padding; y++) {
    let x
    const y2 = (y - halfh) * (y - halfh)

    offset += padding
    for (x = padding; x < width - padding; x++) {
      let v

      /* squared distance from center */
      const r2 = (x - halfw) * (x - halfw) + y2

      if (r2 < ir) {
        v = (((r2 / 32) >>> 0) + ((time / 64) >>> 0)) * 0x0080401
      } else if (r2 < or) {
        v = (y + ((time / 32) >>> 0)) * 0x0080401
      } else {
        v = (x + ((time / 16) >>> 0)) * 0x0080401
      }
      v &= 0x00ffffff

      /* cross if compositor uses X from XRGB as alpha */
      if (Math.abs(x - y) > 6 && Math.abs(x + y - height) > 6) {
        v |= 0xff000000
      }

      pixel[offset++] = v
    }

    offset += padding
  }
}

class Display implements ClientDisplay, WlRegistryEvents, WlShmEvents, XdgWmBaseEvents, WlSeatEvents {
  registry: WlRegistryProxy
  compositor?: WlCompositorProxy
  hasXRGB = false
  keyboard?: WlKeyboardProxy
  seat?: WlSeatProxy
  shm?: WlShmProxy
  wmBase?: XdgWmBaseProxy

  constructor(public display: WlDisplay) {
    this.registry = display.getRegistry()
  }

  global(name: number, interface_: string, version: number) {
    if (interface_ === WlCompositorProtocolName) {
      this.compositor = this.registry.bind(name, WlCompositorProtocolName, WlCompositorProxy, 1)
    } else if (interface_ === XdgWmBaseProtocolName) {
      this.wmBase = this.registry.bind(name, XdgWmBaseProtocolName, XdgWmBaseProxy, 1)
      this.wmBase.listener = this
    } else if (interface_ === WlSeatProtocolName) {
      this.seat = this.registry.bind(name, WlSeatProtocolName, WlSeatProxy, 1)
      this.seat.listener = this
    } else if (interface_ === WlShmProtocolName) {
      this.shm = this.registry.bind(name, WlShmProtocolName, WlShmProxy, 1)
      this.shm.listener = this
    }
  }

  globalRemove(name: number) {
    /* NOOP */
  }

  format(format: number) {
    if (format === WlShmFormat._xrgb8888) {
      this.hasXRGB = true
    }
  }

  ping(serial: number) {
    this.wmBase!.pong(serial)
  }

  capabilities(caps: number): void {
    if (caps & WlSeatCapability._keyboard && this.keyboard === undefined) {
      this.keyboard = this.seat!.getKeyboard()
      this.keyboard.listener = this
    } else if (!(caps & WlSeatCapability._keyboard) && this.keyboard) {
      this.keyboard.destroy()
      this.keyboard = undefined
    }
  }

  name(name: string): void {
    /* NOOP */
  }

  enter(serial: number, surface: WlSurfaceProxy, keys: ArrayBuffer): void {
    /* NOOP */
  }

  key(serial: number, time: number, key: number, state: number): void {
    if (key == KEY_ESC && state) {
      terminate()
    }
  }

  keymap(format: number, fd: any, size: number): void {
    /* NOOP */
  }

  leave(serial: number, surface: WlSurfaceProxy): void {
    /* NOOP */
  }

  modifiers(serial: number, modsDepressed: number, modsLatched: number, modsLocked: number, group: number): void {
    /* NOOP */
  }

  repeatInfo(rate: number, delay: number): void {
    /* NOOP */
  }

  destroy() {
    if (this.shm) {
      this.shm.destroy()
    }
    if (this.wmBase) {
      this.wmBase.destroy()
    }
    if (this.compositor) {
      this.compositor.destroy()
    }
    this.registry.destroy()
    this.display.flush()
    this.display.close()
  }
}

async function createDisplay(): Promise<Display> {
  const display = new Display(connect())
  display.registry.listener = display
  await display.display.roundtrip()
  if (display.shm === undefined) {
    throw new Error('No wl_shm global')
  }
  await display.display.roundtrip()
  if (!display.hasXRGB) {
    throw new Error('WL_SHM_FORMAT_XRGB32 not available')
  }
  return display
}

function createWindow(display: ClientDisplay, width: number, height: number) {
  return new Window(display, width, height)
}

async function main() {
  const display = await createDisplay()
  const window = createWindow(display, 250, 250)

  window.surface.damage(0, 0, window.width, window.height)

  if (!window.waitForConfigure) {
    window.redraw(undefined, 0)
  }

  await termination

  window.destroy()
  display.destroy()
}

main()
