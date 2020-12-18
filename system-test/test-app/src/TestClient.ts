import {
  display,
  GrWebShmProxy,
  WlBufferProxy,
  WlCompositorProxy,
  WlKeyboardProxy, WlOutputEvents,
  WlOutputProxy,
  WlPointerEvents,
  WlPointerProxy,
  WlSeatCapability,
  WlSeatEvents,
  WlSeatProxy,
  WlSurfaceEvents,
  WlSurfaceProxy,
  WlTouchProxy
} from 'westfield-runtime-client'
import { Fixed } from 'westfield-runtime-common'

export class Output implements WlOutputEvents {
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0
  scale_: number = 1
  initialized: boolean = false

  constructor(public wlOutput: WlOutputProxy) {
  }

  done(): void {
    this.initialized = true

    // TODO
  }

  geometry(x: number, y: number, physicalWidth: number, physicalHeight: number, subpixel: number, make: string, model: string, transform: number): void {
    // TODO
  }

  mode(flags: number, width: number, height: number, refresh: number): void {
    // TODO
  }

  scale(factor: number): void {
    // TODO
  }
}
export type TestBuffer = {
  proxy: WlBufferProxy
  // size_t len;
  // pixman_image_t *image;
}

export class Surface implements WlSurfaceEvents {
  output?: Output
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0
  buffer?: TestBuffer

  constructor(public wlSurface: WlSurfaceProxy) {
  }

  enter(output: WlOutputProxy): void {
    this.output = output.listener as Output

    console.log(`test-client: got surface enter output ${this.output.wlOutput.id}`);
  }

  leave(output: WlOutputProxy): void {
    this.output = undefined

    console.log(`test-client: got surface leave output ${output.id}`)
  }
}

export class Pointer implements WlPointerEvents {
  focus?: Surface
  x: number = 0
  y: number = 0
  button_: number = 0
  state: number = 0
  axis_: number = 0
  axisValue: number = 0
  motionTimeMsec: number = 0
  buttonTimeMsec: number = 0
  axisTimeMsec: number = 0
  axisStopTimeMsec: number = 0
  inputTimestamp: DOMHighResTimeStamp = 0
  motionTimeTimespec: DOMHighResTimeStamp = 0
  buttonTimeTimespec: DOMHighResTimeStamp = 0
  axisTimeTimespec: DOMHighResTimeStamp = 0
  axisStopTimeTimespec: DOMHighResTimeStamp = 0

  constructor(public wlPointer: WlPointerProxy) {
  }

  axis(time: number, axis: number, value: Fixed): void {
    this.axis_ = axis
    this.axisValue = value.asDouble()
    this.axisTimeMsec = time
    this.axisTimeTimespec = this.inputTimestamp
    this.inputTimestamp = 0

    console.log(`test-client: got pointer axis ${axis} ${value.asDouble()}`)
  }

  axisDiscrete(axis: number, discrete: number): void {
    console.log(`test-client: got pointer axis discrete ${axis} ${discrete}`)
  }

  axisSource(axisSource: number): void {
    console.log(`test-client: got pointer axis source ${axisSource}`)
  }

  axisStop(time: number, axis: number): void {
    this.axis_ = axis
    this.axisStopTimeMsec = time
    this.axisStopTimeTimespec = this.inputTimestamp
    this.inputTimestamp = 0

    console.log(`test-client: got pointer axis stop ${axis}`)
  }

  button(serial: number, time: number, button: number, state: number): void {
    this.button_ = button
    this.state = state
    this.buttonTimeMsec = time
    this.buttonTimeTimespec = this.inputTimestamp
    this.inputTimestamp = 0

    console.log(`test-client: got pointer button ${button} ${state}`)
  }

  enter(serial: number, surface: WlSurfaceProxy | undefined, surfaceX: Fixed, surfaceY: Fixed): void {
    if (surface?.listener) {
      this.focus = surface.listener as Surface
    } else {
      this.focus = undefined
    }

    this.x = surfaceX.asInt()
    this.y = surfaceY.asInt()

    console.log(`test-client: got pointer enter ${this.x} ${this.y}, surface ${this.focus?.wlSurface.id}`)
  }

  frame(): void {
    console.log(`test-client: got pointer frame`)
  }

  leave(serial: number, surface: WlSurfaceProxy): void {
    this.focus = undefined
    console.log(`test-client: got pointer leave, surface ${surface?.id}`)
  }

  motion(time: number, surfaceX: Fixed, surfaceY: Fixed): void {
    this.x = surfaceX.asInt()
    this.y = surfaceY.asInt()
    this.motionTimeMsec = time
    this.motionTimeTimespec = this.inputTimestamp
    this.inputTimestamp = 0

    console.log(`test-client: got pointer motion ${this.x} ${this.y}`)
  }
}

export type Keyboard = {
  wlKeyboard: WlKeyboardProxy
  surface: Surface
  key: number
  state: number
  modsDepressed: number
  modsLatched: number
  modsLocked: number
  group: number
  repeatInfo: {
    rate: number
    delay: number
  }
  keyTimeMsec: number
  inputTimestamp: DOMHighResTimeStamp
  keyTimeTimespec: DOMHighResTimeStamp
}

export type Touch = {
  wlTouch: WlTouchProxy
  downX: number
  downY: number
  x: number
  y: number
  id: number
  upId: number/* id of last wl_touch.up event */
  frameNo: number
  cancelNo: number
  downTimeMsec: number
  upTimeMsec: number
  motionTimeMsec: number
  inputTimestamp: DOMHighResTimeStamp
  downTimeTimespec: DOMHighResTimeStamp
  upTimeTimespec: DOMHighResTimeStamp
  motionTimeTimespec: DOMHighResTimeStamp
}

export type Global = { name: number, interface_: string, version: number }

export class Input implements WlSeatEvents {
  pointer?: Pointer
  keyboard?: Keyboard
  touch?: Touch
  seatName?: string
  caps: WlSeatCapability = 0

  constructor(
    public client: TestClient,
    public globalName: number,
    public wlSeat: WlSeatProxy
  ) {
  }

  capabilities(capabilities: number): void {
    this.caps = capabilities

    /* we will create/update the devices only with the right (test) seat.
     * If we haven't discovered which seat is the test seat, just
     * store capabilities and bail out */
    this.updateDevices()

    console.log(`test-client: got seat ${this.wlSeat.id} capabilities: ${capabilities}`)
  }

  name(name: string): void {
    this.seatName = name
    this.updateDevices()
    this.client.input = this

    console.log(`test-client: got seat ${this.wlSeat.id} name: '${name}'`)
  }

  private updateDevices() {
    if ((this.caps & WlSeatCapability._pointer) && !this.pointer) {
      this.pointer = new Pointer(this.wlSeat.getPointer())
      this.pointer.wlPointer.listener = this.pointer
    }
  }
}

function createTestClient() {
  const testClient = new TestClient()
  display.getRegistry().listener = {
    global: (name: number, interface_: string, version: number): void => testClient.handleGlobal(name, interface_, version),
    globalRemove: (name: number): void => testClient.handleGlobalRemove(name)
  }
}

class TestClient {
  compositor?: WlCompositorProxy
  webShm?: GrWebShmProxy
  /* the seat that is actually used for input events */
  input?: Input
  /* server can have more wl_seats. We need keep them all until we
   * find the one that we need. After that, the others
   * will be destroyed, so this list will have the length of 1.
   * If some day in the future we will need the other seats,
   * we can just keep them here. */
  inputs: Input[] = []
  output?: WlOutputProxy
  surface?: WlSurfaceProxy
  globalList: Global[] = []
  outputList: WlOutputProxy[] = []
  bufferCopyDone?: boolean

  handleGlobal(name: number, interface_: string, version: number) {
    const global: Global = { name, interface_, version }
    this.globalList = [...this.globalList, global]

    if (interface_ === 'wl_compositor') {
      this.compositor = display.getRegistry().bind(name, interface_, WlCompositorProxy, version)
    } else if (interface_ === 'wl_seat') {
      const input = new Input(
        this,
        global.name,
        display.getRegistry().bind(name, interface_, WlSeatProxy, version)
      )
      input.wlSeat.listener = input
    }
  }

  handleGlobalRemove(name: number) {

  }
}

function main() {

}

main()
