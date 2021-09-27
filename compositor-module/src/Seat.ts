// Copyright 2020 Erik De Rijcke
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
  Global,
  Registry,
  Resource,
  WlDataDeviceRequests,
  WlDataDeviceResource,
  WlDataSourceError,
  WlDataSourceResource,
  WlKeyboardResource,
  WlPointerError,
  WlPointerResource,
  WlSeatCapability,
  WlSeatRequests,
  WlSeatResource,
  WlSurfaceResource,
  WlTouchResource,
} from 'westfield-runtime-server'

import { capabilities } from './browser/capabilities'
import DataSource from './DataSource'
import { AxisEvent, ButtonEvent, CompositorSeat, KeyEvent, nrmlvo } from './index'
import { Keyboard, KeyboardGrab } from './Keyboard'

import { Pointer, DragIconRole, PointerDrag } from './Pointer'
import Session from './Session'
import Surface from './Surface'
import Touch from './Touch'
import View from './View'
import { createFromNames, Led } from './Xkb'

const { keyboard, pointer, touch } = WlSeatCapability

export enum KeyboardModifier {
  MODIFIER_CTRL = 1,
  MODIFIER_ALT = 2,
  MODIFIER_SUPER = 4,
  MODIFIER_SHIFT = 8,
}

export enum KeyboardLocks {
  NUM_LOCK = 1,
  CAPS_LOCK = 2,
}

export interface Drag {
  client: Client
  dataSource?: DataSource
  dataSourceListener: () => void
  focusView?: View
  focusResource?: WlSurfaceResource
  focusListener: () => void
  icon?: View
  iconDestroyListener?: () => void
  dx: number
  dy: number
  keyboardGrab?: KeyboardGrab
}

class Seat implements WlSeatRequests, CompositorSeat, WlDataDeviceRequests {
  serial = 0
  public readonly pointer: Pointer
  public readonly keyboard: Keyboard
  public readonly touch?: Touch
  private global?: Global
  private readonly _seatName: 'browser-seat0' = 'browser-seat0'
  private selectionDataSource?: DataSource
  private selectionSerial = 0
  private selectionListeners: (() => void)[] = []
  private modifierState: KeyboardModifier = 0
  savedKbdFocus?: Surface
  savedKbdFocusListener = () => {
    this.savedKbdFocus = undefined
  }

  private constructor(
    public readonly session: Session,
    public dragResourceList: WlDataDeviceResource[],
    public readonly hasTouch: boolean,
  ) {
    this.pointer = Pointer.create(this)
    this.keyboard = Keyboard.create(this)
    if (hasTouch) {
      this.touch = Touch.create(this)
    }
  }

  static create(session: Session): Seat {
    return new Seat(session, [], capabilities.hasTouch)
  }

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, WlSeatResource.protocolName, 6, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal(): void {
    if (!this.global) {
      return
    }
    this.global.destroy()
    this.global = undefined
  }

  bindClient(client: Client, id: number, version: number): void {
    const wlSeatResource = new WlSeatResource(client, id, version)
    if (this.global) {
      wlSeatResource.implementation = this

      this.emitCapabilities(wlSeatResource)
      this.emitName(wlSeatResource)
    } else {
      // no global present and still receiving a bind can happen when there is a race between the compositor
      // unregistering the global and a client binding to it. As such we handle it here.
      wlSeatResource.implementation = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getKeyboard(): void {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getPointer(): void {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getTouch(): void {},
        release: (resource) => resource.destroy(),
      }
    }
  }

  nextSerial(): number {
    return ++this.serial
  }

  isValidInputSerial(serial: number): boolean {
    return serial === this.serial
  }

  getPointer(resource: WlSeatResource, id: number): void {
    const wlPointerResource = new WlPointerResource(resource.client, id, resource.version)

    if (this.global) {
      wlPointerResource.implementation = this.pointer
      this.pointer.resources = [...this.pointer.resources, wlPointerResource]
      wlPointerResource.onDestroy().then(() => {
        this.pointer.resources = this.pointer.resources.filter((otherResource) => otherResource !== wlPointerResource)
      })
      if (this.pointer.focus?.surface.resource.client === wlPointerResource.client) {
        const { x: sx, y: sy } = this.pointer.focus.sceneToViewSpace(this.pointer)
        wlPointerResource.enter(
          this.pointer.fousSerial,
          this.pointer.focus.surface.resource,
          Fixed.parse(sx),
          Fixed.parse(sy),
        )
        this.pointer.sendFrame()
      }
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlPointerResource.implementation = {
        release(resource: WlPointerResource): void {
          resource.destroy()
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setCursor(): void {},
      }
    }
  }

  getKeyboard(resource: WlSeatResource, id: number): void {
    const wlKeyboardResource = new WlKeyboardResource(resource.client, id, resource.version)
    if (this.global) {
      wlKeyboardResource.implementation = this.keyboard
      this.keyboard.resources = [...this.keyboard.resources, wlKeyboardResource]
      wlKeyboardResource.onDestroy().then(() => {
        this.keyboard.resources = this.keyboard.resources.filter(
          (otherResource) => otherResource !== wlKeyboardResource,
        )
      })

      if (wlKeyboardResource.version >= 4) {
        // TODO we probably want to make this configurable
        wlKeyboardResource.repeatInfo(40, 400)
      }

      this.keyboard.sendKeymap(wlKeyboardResource)

      if (this.keyboard.focus && this.keyboard.focus.resource.client === wlKeyboardResource.client) {
        wlKeyboardResource.enter(
          this.keyboard.focusSerial,
          this.keyboard.focus.resource,
          new Uint8Array(this.keyboard.keys),
        )
        wlKeyboardResource.modifiers(
          this.keyboard.focusSerial,
          this.keyboard.modifiers.modsDepressed,
          this.keyboard.modifiers.modsLatched,
          this.keyboard.modifiers.modsLocked,
          this.keyboard.modifiers.group,
        )

        /* If this is the first keyboard resource for this
         * client... */
        if (
          this.keyboard.resources.filter((keyboardResource) => keyboardResource.client === wlKeyboardResource.client)
            .length === 1
        ) {
          this.dataDeviceSetKeyboardFocus()
        }
      }
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlKeyboardResource.implementation = {
        release(resource: WlKeyboardResource): void {
          resource.destroy()
        },
      }
    }
  }

  getTouch(resource: WlSeatResource, id: number): void {
    const wlTouchResource = new WlTouchResource(resource.client, id, resource.version)

    if (this.hasTouch && this.global && this.touch) {
      this.touch.resources = [...this.touch.resources, wlTouchResource]
      wlTouchResource.implementation = this.touch
    } else {
      // race situation. Seat global is no longer active, but the client still managed to send a request. handle this.
      wlTouchResource.implementation = {
        release(resource: WlTouchResource): void {
          resource.destroy()
        },
      }
    }
  }

  release(resource: Resource): void {
    // data_device or seat resource
    resource.destroy()
  }

  startDrag(
    resource: WlDataDeviceResource,
    sourceResource: WlDataSourceResource | undefined,
    originResource: WlSurfaceResource,
    iconResource: WlSurfaceResource | undefined,
    serial: number,
  ): void {
    const origin = originResource.implementation as Surface

    const isPointerGrab = this.pointer.buttonCount === 1 && this.pointer.focus?.surface === origin
    // TODO touch

    if (!isPointerGrab) {
      return
    }

    const source = sourceResource?.implementation as DataSource | undefined
    const icon = iconResource?.implementation as Surface | undefined

    if (icon) {
      if (icon.role && !(icon.role instanceof DragIconRole)) {
        resource.postError(WlPointerError.role, 'Given surface has another role.')
        this.session.logger.warn('[client-protocol-error] - Given surface has another role')
        return
      }
      icon.role = DragIconRole.create(this.pointer, icon)
    }

    // TODO touch
    if (isPointerGrab) {
      this.pointer.startDrag(source, icon, resource.client)
    }

    if (source) {
      source.seat = this
    }
  }

  setSelection(resource: WlDataDeviceResource, sourceResource: WlDataSourceResource | undefined, serial: number): void {
    if (sourceResource === undefined) {
      return
    }

    const source = sourceResource.implementation as DataSource
    if (source.actionsSet) {
      sourceResource.postError(
        WlDataSourceError.invalidSource,
        'cannot set drag-and-drop source as (keyboard) selection',
      )
      this.session.logger.warn(
        'Client violated Wayland protocol: cannot set drag-and-drop source as (keyboard) selection',
      )
      return
    }

    this.seatSetSelection(source, serial)
  }

  seatSetSelection(source: DataSource, serial: number) {
    if (this.selectionDataSource && this.selectionSerial - serial < Number.MAX_SAFE_INTEGER / 2) {
      return
    }

    if (this.selectionDataSource) {
      this.selectionDataSource.cancel()
      this.selectionDataSource = undefined
    }

    this.selectionDataSource = source
    this.selectionSerial = serial

    if (source) {
      source.setSelection = true
    }

    const focus = this.keyboard.focus
    if (focus) {
      this.sendSelection(focus.resource.client)
    }

    this.selectionListeners.forEach((selectionListener) => selectionListener())

    if (source) {
      source.resource.onDestroy().then(() => {
        if (this.selectionDataSource === source) {
          this.destroySelectionDataSource()
        }
      })
    }
  }

  sendSelection(client: Client): void {
    this.dragResourceList.forEach((dataDevice) => {
      if (dataDevice.client !== client) {
        return
      }

      if (this.selectionDataSource === undefined) {
        dataDevice.selection(undefined)
      } else {
        const offer = this.selectionDataSource.sendOffer(dataDevice)
        dataDevice.selection(offer.resource)
      }
    })
  }

  dataDeviceSetKeyboardFocus(): void {
    const focus = this.keyboard.focus
    if (focus === undefined) {
      return
    }

    this.sendSelection(focus.resource.client)
  }

  endPointerDragGab(drag: PointerDrag): void {
    // TODO see data-device.c L 636
    this.endDragGrab(drag)
    drag.grab?.pointer.endGrab()
    drag.keyboardGrab?.keyboard.endGrab()
  }

  notifyMotion(event: ButtonEvent): void {
    this.pointer.grab.motion(event)
  }

  notifyButton(event: ButtonEvent): void {
    if (event.released) {
      this.pointer.buttonCount--
    } else {
      if (this.pointer.buttonCount === 0) {
        this.pointer.grabButton = event.buttonCode
        this.pointer.grabTime = event.timestamp
        this.pointer.grabX = this.pointer.x
        this.pointer.grabY = this.pointer.y
      }
      this.pointer.buttonCount++
    }
    // TODO binding see input.c L1899
    // runBinding()

    this.pointer.grab?.button(event)
    if (this.pointer.buttonCount === 1) {
      this.pointer.grabSerial = this.serial
    }
  }

  notifyAxis(event: AxisEvent): void {
    // TODO run axis binding, see input.c L1918
    // runAxisBinding()
    this.pointer.grab.axis(event)
  }

  notifyFrame(): void {
    this.pointer.grab.frame()
  }

  notifyModifiers(serial: number) {
    const modsDepressed = this.keyboard.xkb.modsDepressed
    const modsLatched = this.keyboard.xkb.modsLatched
    const modsLocked = this.keyboard.xkb.modsLocked
    const group = this.keyboard.xkb.group

    const changed =
      modsDepressed !== this.keyboard.modifiers.modsDepressed ||
      modsLatched !== this.keyboard.modifiers.modsLatched ||
      modsLocked !== this.keyboard.modifiers.modsLocked ||
      group !== this.keyboard.modifiers.group

    // TODO run modifier bindings see input.c L2022

    this.keyboard.modifiers.modsDepressed = modsDepressed
    this.keyboard.modifiers.modsLatched = modsLocked
    this.keyboard.modifiers.modsLocked = modsLocked
    this.keyboard.modifiers.group = group

    const modsLookup = modsDepressed | modsLatched
    this.modifierState = 0
    if (modsLookup & (1 << this.keyboard.xkb.ctrlMod)) {
      this.modifierState |= KeyboardModifier.MODIFIER_CTRL
    }
    if (modsLookup & (1 << this.keyboard.xkb.altMod)) {
      this.modifierState |= KeyboardModifier.MODIFIER_ALT
    }
    if (modsLookup & (1 << this.keyboard.xkb.superMod)) {
      this.modifierState |= KeyboardModifier.MODIFIER_SUPER
    }
    if (modsLookup & (1 << this.keyboard.xkb.shiftMod)) {
      this.modifierState |= KeyboardModifier.MODIFIER_SHIFT
    }

    let leds = 0
    if (this.keyboard.xkb.numLedActive()) {
      leds |= Led.LED_NUM_LOCK
    }
    if (this.keyboard.xkb.capsLedActive()) {
      leds |= Led.LED_CAPS_LOCK
    }
    if (this.keyboard.xkb.scrollLockLedActive()) {
      leds |= Led.LED_SCROLL_LOCK
    }
    this.keyboard.xkb.leds = leds

    if (changed) {
      this.keyboard.grab.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
    }
  }

  notifyUpdateKeymap(nrmlvo: nrmlvo) {
    this.keyboard.pendingKeymap = nrmlvo

    if (this.keyboard.keys.length === 0) {
      this.updateKeymap()
    }
  }

  notifyKey(event: KeyEvent) {
    const alreadyPressedKey = this.keyboard.keys.find((key) => key === event.code && event.down)
    if (alreadyPressedKey !== undefined) {
      /* Ignore server-generated repeats. */
      return
    }

    if (event.down) {
      this.keyboard.keys = [...this.keyboard.keys, event.code]
    }

    const grab = this.keyboard.grab
    if (grab === this.keyboard.defaultGrab || grab === this.keyboard.inputMethodGrab) {
      // TODO run key binding see input.c L2220
      this.keyboard.grab = grab
    }

    grab.key(event)

    if (this.keyboard.pendingKeymap && this.keyboard.keys.length === 0) {
      this.updateKeymap()
    }

    this.updateModifierState(this.serial, event.down, event.code)
    this.keyboard.grabSerial = this.serial

    if (event.down) {
      this.keyboard.grabTime = event.timestamp
      this.keyboard.grabKey = event.code
    }
  }

  private emitCapabilities(wlSeatResource: WlSeatResource) {
    if (!this.global) {
      return
    }

    let caps = pointer | keyboard
    if (this.hasTouch) {
      caps |= touch
    }
    wlSeatResource.capabilities(caps)
  }

  private emitName(wlSeatResource: WlSeatResource) {
    if (wlSeatResource.version >= 2) {
      wlSeatResource.name(this._seatName)
    }
  }

  private destroySelectionDataSource() {
    this.selectionDataSource = undefined
    const focus = this.keyboard.focus
    if (focus) {
      const dataDevice = this.dragResourceList.find((dragResource) => dragResource.client === focus.resource.client)
      if (dataDevice) {
        dataDevice.selection(undefined)
      }
    }

    this.selectionListeners.forEach((listener) => listener())
  }

  private updateKeymap() {
    if (this.keyboard.pendingKeymap === undefined) {
      this.session.logger.warn('BUG. Tried to update keymap while not keymap was set.')
      return
    }

    const xkb = createFromNames(this.keyboard.pendingKeymap)
    this.keyboard.pendingKeymap = undefined

    const latchedMods = this.keyboard.xkb.modsLatched
    const lockedMods = this.keyboard.xkb.modsLocked

    xkb.updateMask(0, latchedMods, lockedMods, 0, 0, 0)
    this.keyboard.xkb = xkb

    this.keyboard.resources.forEach((keyboardResource) => {
      this.keyboard.sendKeymap(keyboardResource)
    })

    this.notifyModifiers(this.nextSerial())
    if (latchedMods === 0 && lockedMods === 0) {
      return
    }

    this.keyboard.resources.forEach((keyboardResource) => {
      keyboardResource.modifiers(
        this.serial,
        this.keyboard.modifiers.modsDepressed,
        this.keyboard.modifiers.modsLatched,
        this.keyboard.modifiers.modsLocked,
        this.keyboard.modifiers.group,
      )
    })
  }

  private updateModifierState(serial: number, down: boolean, key: number) {
    if (down) {
      this.keyboard.xkb.keyDown(key)
    } else {
      this.keyboard.xkb.keyUp(key)
    }

    this.notifyModifiers(serial)
  }

  setKeyboardFocus(surface: Surface): void {
    if (this.keyboard.focus !== surface) {
      this.keyboard.setFocus(surface)
    }

    // TODO activate signal see input.c L3632
  }

  notifyKeyboardFocusOut(): void {
    const serial = this.nextSerial()
    this.keyboard.keys.forEach((key) => {
      this.updateModifierState(serial, false, key)
    })

    this.modifierState = 0

    this.keyboard.setFocus(undefined)
    this.keyboard.cancelGrab()
    this.pointer.cancelGrab()

    if (this.keyboard.focus) {
      this.savedKbdFocus = this.keyboard.focus
      this.savedKbdFocus.resource.addDestroyListener(this.savedKbdFocusListener)
    }
  }

  notifyKeyboardFocusIn(keys: number[]): void {
    const serial = this.nextSerial()
    this.keyboard.keys.forEach((key) => {
      this.updateModifierState(serial, true, key)
    })

    if (this.savedKbdFocus) {
      this.keyboard.setFocus(this.savedKbdFocus)
    }
  }
}

export default Seat
