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
  WlDataDeviceManagerDndAction,
  WlDataDeviceResource,
  WlDataOfferResource,
  WlPointerAxis,
  WlPointerAxisSource,
  WlPointerButtonState,
  WlPointerError,
  WlPointerRequests,
  WlPointerResource,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import { AxisEvent } from './AxisEvent'
import { setCursor } from './browser/cursor'
import { ButtonEvent } from './ButtonEvent'
import DataSource from './DataSource'
import { KeyboardGrab } from './Keyboard'
import { KeyEvent } from './KeyEvent'
import { ORIGIN, Point } from './math/Point'
import { clear } from './Region'

import { Seat } from './Seat'
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
      if (view === undefined) {
        setCursor('default')
      }
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
  focus(): void

  motion(event: ButtonEvent): void

  button(event: ButtonEvent): void

  axis(event: AxisEvent): void

  frame(): void

  cancel(): void
}

export class PointerDrag implements PointerGrab, KeyboardGrab {
  dataSource?: DataSource
  dataSourceListener = () => {
    this.dataSource = undefined
    this.end()
  }
  focusView?: View
  focusResource?: WlDataDeviceResource
  deltaPoint?: Point
  iconListener = () => {
    this.icon = undefined
  }

  private constructor(public readonly pointer: Pointer, public readonly client: Client, public icon?: View) {}

  static create(pointer: Pointer, client: Client, icon?: View): PointerDrag {
    return new PointerDrag(pointer, client, icon)
  }

  end(): void {
    if (this.icon) {
      // TODO remove drag icon from browser pointer
      this.icon.surface.resource.removeDestroyListener(this.iconDestroyListener)
      clear(this.icon.surface.pendingState.inputPixmanRegion)
    }
    this.setFocus(undefined)
    this.pointer.endGrab()
    this.pointer.seat.keyboard.endGrab()
  }

  axis(event: AxisEvent): void {
    // do nothing
  }

  button(event: ButtonEvent): void {
    if (this.dataSource && this.pointer.grabButton === event.buttonCode && event.released) {
      if (
        this.focusResource !== undefined &&
        this.dataSource.accepted &&
        this.dataSource.currentDndAction !== WlDataDeviceManagerDndAction.none
      ) {
        this.focusResource.drop()

        if (this.dataSource.resource.version >= 3) {
          this.dataSource.resource.dndDropPerformed()
        }

        if (this.dataSource.dataOffer) {
          this.dataSource.dataOffer.inAsk = this.dataSource.currentDndAction === WlDataDeviceManagerDndAction.ask
        }
      } else if (this.dataSource.resource.version >= 3) {
        this.dataSource.resource.cancelled()
      }
    }

    if (this.pointer.buttonCount == 0 && event.released) {
      this.dataSource?.resource.removeDestroyListener(this.dataSourceListener)
      this.end()
    }
  }

  cancel(): void {
    this.dataSource?.resource.removeDestroyListener(this.dataSourceListener)
    this.end()
  }

  focus(): void {
    const view = this.pointer.seat.session.renderer.pickView(this.pointer)
    let newFocus: { view: View; sx: Fixed; sy: Fixed } | undefined = undefined
    if (view) {
      const { x: sx, y: sy } = view?.sceneToViewSpace(this.pointer) ?? ORIGIN
      newFocus = { view, sx: Fixed.parse(sx), sy: Fixed.parse(sy) }
    }
    if (this.focusView !== view) {
      this.setFocus(newFocus)
    }
  }

  frame(): void {
    // do nothing
  }

  key(event: KeyEvent): void {
    // do nothing
  }

  modifiers(serial: number, modsDepressed: number, modsLatched: number, modsLocked: number, group: number): void {
    let compositorAction: WlDataDeviceManagerDndAction
    if (modsDepressed & (1 << this.pointer.seat.keyboard.xkb.shiftMod)) {
      compositorAction = WlDataDeviceManagerDndAction.move
    } else if (modsDepressed & (1 << this.pointer.seat.keyboard.xkb.ctrlMod)) {
      compositorAction = WlDataDeviceManagerDndAction.copy
    } else {
      compositorAction = WlDataDeviceManagerDndAction.none
    }
    if (this.dataSource) {
      this.dataSource.compositorAction = compositorAction
      this.dataSource.dataOffer?.updateAction()
    }
  }

  motion(event: ButtonEvent): void {
    this.pointer.moveTo(event)

    if (this.icon) {
      // mouse cursor move is handled by the browser
      // this.icon.positionOffset = plusPoint(this.pointer, this.deltaPoint ?? ORIGIN)
      // this.pointer.seat.session.renderer.render()
    }

    if (this.focusView && this.focusResource) {
      const { x: sx, y: sy } = this.focusView.sceneToViewSpace(this.pointer)
      this.focusResource.motion(event.timestamp, Fixed.parse(sx), Fixed.parse(sy))
    }
  }

  setFocus(newFocus?: { view: View; sx: Fixed; sy: Fixed }): void {
    if (this.focusView !== undefined && newFocus?.view && this.focusView?.surface === newFocus?.view.surface) {
      this.focusView = newFocus.view
      return
    }

    if (this.focusResource !== undefined) {
      this.focusResource.leave()
      this.focusResource.removeDestroyListener(this.focusListener)
      this.focusResource = undefined
      this.focusView = undefined
    }

    if (newFocus === undefined) {
      return
    }

    if (this.dataSource === undefined && newFocus.view.surface.resource.client !== this.client) {
      return
    }

    if (this.dataSource?.dataOffer) {
      /* Unlink the offer from the source */
      this.dataSource.dataOffer.source?.resource.removeDestroyListener(this.dataSource.dataOffer.sourceDestroyListener)
      this.dataSource.dataOffer.source = undefined
      this.dataSource.dataOffer = undefined
    }

    const resource = this.pointer.seat.dragResourceList.find(
      (dragResource) => dragResource.client === newFocus.view.surface.resource.client,
    )

    if (resource === undefined) {
      return
    }

    const serial = this.pointer.seat.nextSerial()
    let offerResource: WlDataOfferResource | undefined
    if (this.dataSource) {
      this.dataSource.accepted = false
      const offer = this.dataSource.sendOffer(resource)
      offer.updateAction()
      offerResource = offer.resource
    }

    resource.enter(serial, newFocus.view.surface.resource, newFocus.sx, newFocus.sy, offerResource)

    this.focusView = newFocus.view
    resource.addDestroyListener(this.focusListener)
    this.focusResource = resource
  }

  private readonly iconDestroyListener = () => {
    this.icon = undefined
  }

  private readonly focusListener = () => {
    this.destroyDragFocus()
  }

  private destroyDragFocus() {
    this.focusResource = undefined
  }
}

export class DragIconRole implements SurfaceRole {
  private constructor(public readonly view: View) {}

  public static create(icon: Surface): DragIconRole {
    const view = View.create(icon)
    return new DragIconRole(view)
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
  x = -1000000
  y = -1000000
  hotspotX = 0
  hotspotY = 0
  buttonCount = 0
  sprite?: View
  grab = this.defaultGrab
  grabButton?: 0 | 1 | 2 | 3 | 4
  grabTime?: number
  grabPoint?: Point
  grabSerial?: number
  private readonly _cursorDestroyListener: () => void

  private constructor(public readonly seat: Seat) {
    this._cursorDestroyListener = () => {
      this.sprite = undefined
      this.setDefaultCursor()
    }
  }

  static create(seat: Seat): Pointer {
    return new Pointer(seat)
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
    if (this.seat.serial - serial > Number.MAX_SAFE_INTEGER / 2) {
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
        this.seat.session.logger.warn('[client-protocol-error] - Given surface has another role')
        resource.postError(WlPointerError.role, 'Given surface has another role.')
        return
      }
      if (surface.role === undefined) {
        surface.role = CursorRole.create(this, surface)
      }
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
    const drag = PointerDrag.create(this, client, icon?.role?.view)

    if (icon) {
      icon.resource.addDestroyListener(drag.iconListener)
    }

    if (source) {
      source.resource.addDestroyListener(() => {
        if (drag.dataSource === source) {
          this.seat.endDrag(drag)
        }
      })
    }

    this.clearFocus()
    this.seat.keyboard.setFocus(undefined)

    this.startGrab(drag)
    this.seat.keyboard.startGrab(drag)
  }

  startGrab(grab: PointerGrab): void {
    this.grab = grab
    this.grab.focus()
  }

  endGrab(): void {
    this.grab = this.defaultGrab
    this.grab.focus()
  }

  moveTo({ x, y }: Point): void {
    this.x = x
    this.y = y

    this.grab.focus()
    this.motionListeners.forEach((listener) => listener())
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

  sendMotion(event: ButtonEvent): void {
    const oldSx = this.sx
    const oldSy = this.sy

    if (this.focus) {
      const { x: sx, y: sy } = this.focus.sceneToViewSpace(event)
      this.sx = Fixed.parse(sx)
      this.sy = Fixed.parse(sy)
    }

    this.moveTo(event)

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

  private readonly focusViewListener = () => {
    this.clearFocus()
  }

  private unmapSprite() {
    this.seat.session.renderer.hidePointer()
    this.sprite?.surface.resource.removeDestroyListener(this._cursorDestroyListener)
    this.sprite = undefined
  }

  private frame(pointerResource: WlPointerResource) {
    if (pointerResource.version >= 5) {
      pointerResource.frame()
    }
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
}
