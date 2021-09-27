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

import { Fixed } from 'westfield-runtime-common'
import {
  Client,
  WlPointerAxis,
  WlPointerAxisSource,
  WlPointerButtonState,
  WlPointerError,
  WlPointerRequests,
  WlPointerResource,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import { AxisEvent } from './AxisEvent'
import { ButtonEvent } from './ButtonEvent'
import DataSource from './DataSource'

import Seat, { Drag } from './Seat'
import Surface from './Surface'
import SurfaceRole from './SurfaceRole'
import View from './View'

const { horizontalScroll, verticalScroll } = WlPointerAxis
const { wheel } = WlPointerAxisSource

export class DefaultPointerGrab implements PointerGrab {
  private constructor(public readonly pointer: Pointer) {}

  static create(pointer: Pointer): PointerGrab {
    return new DefaultPointerGrab(pointer)
  }

  axis(event: AxisEvent): void {
    this.pointer.sendAxis(event)
  }

  button(event: ButtonEvent): void {
    this.pointer.sendButton(event)
    if (this.pointer.buttonCount === 0 && event.released) {
      const view = this.pointer.seat.session.renderer.pickView(this.pointer)
      if (view) {
        const { x: sx, y: sy } = view.sceneToViewSpace(this.pointer)
        this.pointer.setFocus(view, Fixed.parse(sx), Fixed.parse(sy))
      } else {
        this.pointer.clearFocus()
      }
    }
  }

  cancel(): void {
    // do nothing
  }

  focus(): void {
    if (this.pointer.buttonCount > 0) {
      return
    }

    const view = this.pointer.seat.session.renderer.pickView(this.pointer)

    const { x, y } = view?.sceneToViewSpace(this.pointer) ?? { x: -1000000, y: -1000000 }
    const sx = Fixed.parse(x)
    const sy = Fixed.parse(y)
    if (this.pointer.focus !== view || this.pointer.sx !== sx || this.pointer.sy !== sy) {
      this.pointer.setFocus(view, sx, sy)
    }
  }

  frame(): void {
    this.pointer.sendFrame()
  }

  motion(event: ButtonEvent): void {
    this.pointer.sendMotion(event)
  }
}

export interface PointerGrab {
  pointer: Pointer

  focus(): void

  motion(event: ButtonEvent): void

  button(event: ButtonEvent): void

  axis(event: AxisEvent): void

  frame(): void

  cancel(): void
}

export interface PointerDrag extends Drag {
  grab?: PointerGrab
}

export class DragIconRole implements SurfaceRole {
  private constructor(public readonly pointer: Pointer, public readonly view: View) {}

  public static create(pointer: Pointer, icon: Surface): DragIconRole {
    const view = View.create(icon)
    return new DragIconRole(pointer, view)
  }

  onCommit(surface: Surface): void {
    surface.commitPending()
    // TODO update browser drag icon
  }
}

export class CursorRole implements SurfaceRole {
  private constructor(public readonly pointer: Pointer, public readonly view: View) {}

  public static create(pointer: Pointer, cursor: Surface): CursorRole {
    const view = View.create(cursor)
    return new CursorRole(pointer, view)
  }

  onCommit(surface: Surface): void {
    surface.commitPending()
    if (this.pointer.sprite?.surface === surface) {
      this.pointer.hotspotX -= surface.state.dx
      this.pointer.hotspotY -= surface.state.dy
      this.pointer.seat.session.renderer.updatePointerCursor(this.view)
    }
  }
}

// translates between browser button codes & kernel code as expected by wayland protocol
const linuxInput = {
  // left
  0: 0x110,
  // middle
  1: 0x112,
  // right
  2: 0x111,
  // browser back
  3: 0x116,
  // browser forward
  4: 0x115,
} as const

const lineScrollAmount = 12 as const

export class Pointer implements WlPointerRequests {
  static create(seat: Seat): Pointer {
    return new Pointer(seat)
  }

  // surface space x & y coordinates of focused surface
  sx = Fixed.parse(-1000000)
  sy = Fixed.parse(-1000000)
  readonly defaultGrab: PointerGrab = DefaultPointerGrab.create(this)
  focusListeners: (() => void)[] = []
  motionListeners: (() => void)[] = []
  fousSerial = 0
  scrollFactor = 1
  resources: WlPointerResource[] = []
  focus?: View
  private readonly focusViewListener = () => {
    this.clearFocus()
  }
  x = -1000000
  y = -1000000
  hotspotX = 0
  hotspotY = 0
  buttonCount = 0
  sprite?: View
  grab = DefaultPointerGrab.create(this)
  grabButton?: 0 | 1 | 2 | 3 | 4
  grabTime?: number
  grabX?: number
  grabY?: number
  grabSerial?: number

  private readonly _cursorDestroyListener: () => void

  private constructor(public readonly seat: Seat) {
    this._cursorDestroyListener = () => {
      this.sprite = undefined
      this.setDefaultCursor()
    }
  }

  setCursor(
    resource: WlPointerResource,
    serial: number,
    surfaceResource: WlSurfaceResource | undefined,
    hotspotX: number,
    hotspotY: number,
  ): void {
    const surface = surfaceResource?.implementation as Surface | undefined

    if (this.focus === undefined) {
      return
    }
    if (this.focus.surface.resource.client !== resource.client) {
      return
    }
    if (this.seat.serial - serial > Number.MIN_SAFE_INTEGER / 2) {
      return
    }

    if (surface === undefined) {
      if (this.sprite) {
        this.unmapSprite()
      }
      return
    }

    if (this.sprite === undefined || this.sprite.surface !== surface) {
      if (surface.role && !(surface.role instanceof CursorRole)) {
        resource.postError(WlPointerError.role, 'Given surface has another role.')
        this.seat.session.logger.warn('[client-protocol-error] - Given surface has another role')
        return
      }
      surface.role = CursorRole.create(this, surface)
      if (this.sprite !== undefined) {
        this.unmapSprite()
      }

      surface.resource.onDestroy().then(() => {
        if (this.sprite?.surface === surface) {
          this.sprite = undefined
        }
      })

      this.hotspotX = hotspotX
      this.hotspotY = hotspotY

      this.seat.session.renderer.updatePointerCursor(surface.role.view)
    }
  }

  release(resource: WlPointerResource): void {
    resource.destroy()
    this.resources = this.resources.filter((pointerResource) => pointerResource !== resource)
  }

  clearFocus(): void {
    this.setFocus(undefined, Fixed.parse(-1000000), Fixed.parse(-1000000))
  }

  setFocus(view: View | undefined, sx: Fixed, sy: Fixed): void {
    const refocus =
      (!this.focus && view !== undefined) ||
      (this.focus && view === undefined) ||
      (this.focus && this.focus.surface !== view?.surface) ||
      this.sx !== sx ||
      this.sy !== sy

    if (this.focus && refocus) {
      const surfaceResource = this.focus.surface.resource
      const serial = this.seat.nextSerial()
      this.resources
        .filter((pointerResource) => pointerResource.client === surfaceResource.client)
        .forEach((pointerResource) => {
          pointerResource.leave(serial, surfaceResource)
          pointerResource.frame()
        })
      this.focus = undefined
    }

    if (view && refocus) {
      const surfaceClient = view.surface.resource.client
      const serial = this.seat.nextSerial()
      if (this.seat.keyboard.focus !== view.surface) {
        this.seat.keyboard.resources
          .filter((keyboardResource) => keyboardResource.client === surfaceClient)
          .forEach((keyboardResource) => {
            keyboardResource.modifiers(
              serial,
              this.seat.keyboard.xkb.modsDepressed,
              this.seat.keyboard.xkb.modsLatched,
              this.seat.keyboard.xkb.modsLocked,
              this.seat.keyboard.xkb.group,
            )
          })
      }

      this.resources.forEach((pointerResource) => {
        if (pointerResource.client === surfaceClient) {
          pointerResource.enter(serial, view.surface.resource, sx, sy)
          pointerResource.frame()
        }
      })
      this.fousSerial = serial
    }
    if (this.focus) {
      this.focus.surface.resource.removeDestroyListener(this.focusViewListener)
    }
    this.focus = view
    if (view) {
      view.surface.resource.addDestroyListener(this.focusViewListener)
    }
    this.sx = sx
    this.sy = sy

    this.focusListeners.forEach((listener) => listener())
  }

  setDefaultCursor(): void {
    this.seat.session.renderer.resetPointer()
  }

  startDrag(source: DataSource | undefined, icon: Surface | undefined, client: Client): void {
    const drag: PointerDrag = {
      client,
      dataSource: source,
      dataSourceListener: () => {},
      dx: 0,
      dy: 0,
      focusListener: () => {},
      focusResource: undefined,
      focusView: undefined,
      grab: undefined,
      icon: undefined,
      keyboardGrab: undefined,
    }

    if (icon) {
      drag.icon = icon.role?.view
      icon.resource.addDestroyListener(() => {
        if (icon === drag.icon?.surface) {
          drag.icon = undefined
        }
      })
    }

    if (source) {
      source.resource.addDestroyListener(() => {
        if (drag.dataSource === source) {
          this.seat.endPointerDragGab(drag)
        }
      })
    }

    this.clearFocus()
    this.seat.keyboard.setFocus(undefined)

    this.startGrab(drag.grab)
    this.seat.keyboard.startGrab(drag.keyboardGrab)
  }

  startGrab(grab: PointerGrab): void {
    this.grab = grab
    this.grab.pointer = this
    this.grab.focus()
  }

  endGrab(): void {
    this.grab = this.defaultGrab
    this.grab.focus()
  }

  cancelGrab(): void {
    this.grab?.cancel()
  }

  private unmapSprite() {
    this.seat.session.renderer.hidePointer()
    this.sprite?.surface.resource.removeDestroyListener(this._cursorDestroyListener)
    this.sprite = undefined
  }

  private moveTo(x: number, y: number): void {
    this.x = x
    this.y = y

    this.grab.focus()
    this.motionListeners.forEach((listener) => listener())
  }

  private frame(pointerResource: WlPointerResource) {
    if (pointerResource.version >= 5) {
      pointerResource.frame()
    }
  }

  sendFrame(): void {
    if (this.focus === undefined) {
      return
    }

    this.resources
      .filter((pointerResource) => pointerResource.client === this.focus?.surface.resource.client)
      .forEach((pointerResource) => {
        this.frame(pointerResource)
      })
  }

  private motion(time: number, sx: Fixed, sy: Fixed): void {
    if (this.focus === undefined) {
      return
    }

    this.resources
      .filter((pointerResource) => pointerResource.client === this.focus?.surface.resource.client)
      .forEach((pointerResource) => {
        pointerResource.motion(time, sx, sy)
      })
  }

  sendMotion(event: ButtonEvent): void {
    const oldSx = this.sx
    const oldSy = this.sy

    if (this.focus) {
      const { x: sx, y: sy } = this.focus.sceneToViewSpace(event)
      this.sx = Fixed.parse(sx)
      this.sy = Fixed.parse(sy)
    }

    this.moveTo(event.x, event.y)

    if (oldSx._raw !== this.sx._raw || oldSy._raw !== this.sy._raw) {
      this.motion(event.timestamp, this.sx, this.sy)
    }
  }

  sendAxis(event: AxisEvent): void {
    if (this.focus === undefined) {
      return
    }

    let deltaTransform: (delta: number, axis?: number) => number
    switch (event.deltaMode) {
      case event.DOM_DELTA_LINE: {
        deltaTransform = (delta) => delta * lineScrollAmount
        break
      }
      case event.DOM_DELTA_PAGE: {
        deltaTransform = (delta, axis) => {
          if (axis === verticalScroll) {
            return delta * (this.focus?.surface.size?.height ?? 0)
          } else {
            // horizontalScroll
            return delta * (this.focus?.surface.size?.width ?? 0)
          }
        }
        break
      }
      case event.DOM_DELTA_PIXEL:
      default: {
        deltaTransform = (delta) => delta
        break
      }
    }

    this.resources
      .filter((pointerResource) => pointerResource.client === this.focus?.surface.resource.client)
      .forEach((pointerResource) => {
        const deltaX = event.deltaX
        if (deltaX) {
          const xAxis = horizontalScroll
          const scrollAmount = deltaTransform(deltaX, xAxis)
          pointerResource.axis(event.timestamp, xAxis, Fixed.parse(scrollAmount))
        }

        const deltaY = event.deltaY
        if (deltaY) {
          const yAxis = verticalScroll
          const scrollAmount = deltaTransform(deltaY, yAxis)
          pointerResource.axis(event.timestamp, yAxis, Fixed.parse(scrollAmount))
        }
        if (pointerResource.version >= 5) {
          pointerResource.axisSource(wheel)
          pointerResource.frame()
        }
      })
  }

  sendButton(event: ButtonEvent): void {
    if (this.focus === undefined) {
      return
    }

    const serial = this.seat.nextSerial()
    this.resources
      .filter((pointerResource) => pointerResource.client === this.focus?.surface.resource.client)
      .forEach((pointerResource) => {
        pointerResource.button(
          serial,
          event.timestamp,
          linuxInput[event.buttonCode],
          event.released ? WlPointerButtonState.released : WlPointerButtonState.pressed,
        )
      })
  }
}
