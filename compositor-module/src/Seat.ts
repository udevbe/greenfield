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
import { DesktopSurface } from './Desktop'
import { AxisEvent, ButtonEvent, CompositorSeat, KeyEvent, nrmlvo } from './index'
import { Keyboard, KeyboardGrab } from './Keyboard'

import { DragIconRole, Pointer, PointerDrag, PointerGrab } from './Pointer'
import Session from './Session'
import Surface from './Surface'
import Touch from './Touch'
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

export type ButtonBinding = {
  button: ButtonEvent['buttonCode']
  modifiers: KeyboardModifier
  handler: (pointer: Pointer, event: ButtonEvent) => void
}

export class PopupGrab implements KeyboardGrab, PointerGrab {
  private constructor(
    public readonly seat: Seat,
    public readonly keyboard: Keyboard,
    public readonly pointer: Pointer,
    public client?: Client,
    public initialUp: boolean = false,
    public surfaces: DesktopSurface[] = [],
  ) {}

  static create(seat: Seat): PopupGrab {
    return new PopupGrab(seat, seat.keyboard, seat.pointer)
  }

  axis(event: AxisEvent): void {
    this.pointer.sendAxis(event)
  }

  button(event: ButtonEvent): void {
    const initialUp = this.initialUp
    if (event.released) {
      this.initialUp = true
    }

    if (this.pointer.focus) {
      this.pointer.sendButton(event)
    } else if (event.released && (initialUp || event.timestamp - (this.pointer.grabTime ?? 0) > 500)) {
      this.seat.popupGrabEnd()
    }
  }

  cancel(): void {
    this.seat.popupGrabEnd()
  }

  focus(): void {
    const view = this.seat.session.renderer.pickView(this.pointer)
    if (view !== undefined && view.surface.resource.client === this.client) {
      const { x: sx, y: sy } = view.sceneToViewSpace(this.pointer)
      this.pointer.setFocus(view, sx, sy)
    } else {
      this.pointer.clearFocus()
    }
  }

  motion(event: ButtonEvent): void {
    this.pointer.sendMotion(event)
  }

  frame(): void {
    this.pointer.sendFrame()
  }

  key(event: KeyEvent): void {
    this.keyboard.sendKey(event)
  }

  modifiers(serial: number, modsDepressed: number, modsLatched: number, modsLocked: number, group: number): void {
    this.keyboard.sendModifiers(serial, modsDepressed, modsLatched, modsLocked, group)
  }

  getTopmostDesktopSurface(): DesktopSurface | undefined {
    if (this.surfaces.length === 0) {
      return undefined
    }

    return this.surfaces[this.surfaces.length - 1]
  }

  addSurface(surface: DesktopSurface): void {
    this.surfaces = [...this.surfaces, surface]
  }

  removeSurface(surface: DesktopSurface): void {
    this.surfaces = this.surfaces.filter((popupSurface) => popupSurface !== surface)

    if (this.surfaces.length === 0) {
      this.seat.popupGrabEnd()
    }
  }
}

export class Seat implements WlSeatRequests, CompositorSeat, WlDataDeviceRequests {
  serial = 0
  readonly pointer: Pointer
  readonly keyboard: Keyboard
  readonly touch?: Touch
  needFocusInit = false
  savedKbdFocus?: Surface
  readonly popupGrab: PopupGrab
  selectionDataSource?: DataSource
  selectionListeners: (() => void)[] = []
  buttonBindings: ButtonBinding[] = []
  focusedSurface?: DesktopSurface
  activationListeners: ((surface: Surface) => void)[] = []
  private global?: Global
  private readonly _seatName: 'browser-seat0' = 'browser-seat0'
  private selectionSerial = 0
  private modifierState: KeyboardModifier = 0

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
    this.popupGrab = PopupGrab.create(this)
  }

  static create(session: Session): Seat {
    return new Seat(session, [], capabilities.hasTouch)
  }

  focusSurfaceDestroyListener = () => this.activateNextFocus()

  savedKbdFocusListener = (): void => {
    this.savedKbdFocus = undefined
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
        getKeyboard(): void {
          // do nothing
        },
        getPointer(): void {
          // do nothing
        },
        getTouch(): void {
          // do nothing
        },
        release: (resource) => resource.destroy(),
      }
    }
  }

  nextSerial(): number {
    return ++this.serial
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
        setCursor(): void {
          // do nothing
        },
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

    const isPointerGrab =
      this.pointer.buttonCount === 1 &&
      this.pointer.grabSerial === serial &&
      this.pointer.focus !== undefined &&
      this.pointer.focus.surface === origin

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
      icon.role = DragIconRole.create(icon, this.pointer)
    }

    if (isPointerGrab) {
      this.pointer.startDrag(source, icon, resource.client)
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

    this.setSelectionInternal(source, serial)
  }

  setSelectionInternal(source: DataSource | undefined, serial: number): void {
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

  notifyMotion(event: ButtonEvent): void {
    this.pointer.grab.motion(event)
  }

  notifyButton(event: ButtonEvent): void {
    if (event.released) {
      this.pointer.buttonCount--
      if (this.pointer.buttonCount < 0) {
        // A button press happened outside the browser, but the release happend inside. Ignoring.
        this.pointer.buttonCount = 0
        return
      }
    } else {
      if (this.pointer.buttonCount === 0) {
        this.pointer.grabButton = event.buttonCode
        this.pointer.grabTime = event.timestamp
        this.pointer.grabPoint = { x: this.pointer.x, y: this.pointer.y }
      }
      this.pointer.buttonCount++
    }
    this.runButtonBinding(event)

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

  notifyModifiers(serial: number): void {
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

  notifyUpdateKeymap(nrmlvo: nrmlvo): void {
    this.keyboard.pendingKeymap = nrmlvo

    if (this.keyboard.keys.length === 0) {
      this.updateKeymap()
    }
  }

  notifyKey(event: KeyEvent): void {
    if (this.needFocusInit) {
      this.needFocusInit = false
      // key was pressed while we didn't have input focus from the browser and is now released
      const { capsLock, numLock } = event
      const mask: KeyboardLocks = KeyboardLocks.CAPS_LOCK | KeyboardLocks.NUM_LOCK
      let value: KeyboardLocks = 0
      if (capsLock) {
        value |= KeyboardLocks.CAPS_LOCK
      }
      if (numLock) {
        value |= KeyboardLocks.NUM_LOCK
      }
      this.keyboard.setLocks(mask, value)
      if (!event.pressed && this.keyboard.keys.length === 0) {
        return
      }
    }

    if (event.pressed && this.keyboard.keys.includes(event.keyCode.evdevKeyCode)) {
      /* Ignore server-generated repeats. */
      return
    }

    if (event.pressed) {
      this.keyboard.keys = [...this.keyboard.keys, event.keyCode.evdevKeyCode]
    } else {
      this.keyboard.keys = this.keyboard.keys.filter((key) => event.keyCode.evdevKeyCode !== key)
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

    this.updateModifierState(this.serial, event.pressed, event.keyCode.x11KeyCode)
    this.keyboard.grabSerial = this.serial

    if (event.pressed) {
      this.keyboard.grabTime = event.timeStamp
      this.keyboard.grabKey = event.keyCode
    }
  }

  setKeyboardFocus(desktopSurface: DesktopSurface): void {
    if (desktopSurface.surface.destroyed) {
      return
    }

    if (this.keyboard.focus !== desktopSurface.surface) {
      this.keyboard.setFocus(desktopSurface.surface)
      if (this.keyboard.focus === desktopSurface.surface) {
        this.gainFocus(desktopSurface)
      }
      this.dataDeviceSetKeyboardFocus()
    }

    this.activationListeners.forEach((listener) => listener(desktopSurface.surface))
  }

  notifyKeyboardFocusOut(): void {
    const serial = this.nextSerial()
    const focus = this.keyboard.focus

    this.keyboard.keys.forEach((key) => {
      this.updateModifierState(serial, false, key)
    })

    this.modifierState = 0

    this.keyboard.setFocus(undefined)
    this.keyboard.cancelGrab()
    this.pointer.grab.cancel()

    if (focus) {
      this.savedKbdFocus = focus
      this.savedKbdFocus.resource.addDestroyListener(this.savedKbdFocusListener)
    }

    this.needFocusInit = true
  }

  notifyKeyboardFocusIn(): void {
    if (this.savedKbdFocus && !this.savedKbdFocus.destroyed) {
      this.keyboard.setFocus(this.savedKbdFocus)
    }
  }

  popupGrabStart(client: Client, serial: number): boolean {
    if (this.keyboard.grabSerial !== serial && this.pointer.grabSerial !== serial) {
      return false
    }

    if (!(this.keyboard.grab instanceof PopupGrab)) {
      this.keyboard.startGrab(this.popupGrab)
    }
    if (!(this.pointer.grab instanceof PopupGrab)) {
      this.pointer.startGrab(this.popupGrab)
    }

    this.popupGrab.initialUp = this.pointer.buttonCount === 0
    this.popupGrab.client = client

    return true
  }

  popupGrabEnd(): void {
    if (this.popupGrab === undefined) {
      return
    }

    this.popupGrab.surfaces.reverse().forEach((desktopSurface) => {
      desktopSurface.role.requestClose()
    })

    if (this.keyboard.grab instanceof PopupGrab) {
      this.keyboard.endGrab()
    }
    if (this.pointer.grab instanceof PopupGrab) {
      this.pointer.endGrab()
    }

    this.popupGrab.client = undefined
  }

  endDrag(drag: PointerDrag): void {
    drag.end()
    this.pointer.endGrab()
    this.keyboard.endGrab()
  }

  dropFocus(): void {
    if (this.focusedSurface) {
      this.focusedSurface.surface.resource.removeDestroyListener(this.focusSurfaceDestroyListener)
      this.focusedSurface.loseFocus()
    }
    this.activateNextFocus()
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

  private updateModifierState(serial: number, down: boolean, x11KeyCode: number) {
    if (down) {
      this.keyboard.xkb.keyDown(x11KeyCode)
    } else {
      this.keyboard.xkb.keyUp(x11KeyCode)
    }

    this.notifyModifiers(serial)
  }

  private gainFocus(desktopSurface: DesktopSurface): void {
    this.focusedSurface?.surface.resource.removeDestroyListener(this.focusSurfaceDestroyListener)
    this.focusedSurface?.loseFocus()
    this.focusedSurface = desktopSurface
    desktopSurface.surface.resource.addDestroyListener(this.focusSurfaceDestroyListener)
    this.focusedSurface.gainFocus()
  }

  private activateNextFocus() {
    const nextFocusView = this.session.renderer.topLevelViews
      .reverse()
      .find((toplevelView) => toplevelView.surface !== this.focusedSurface?.surface)
    this.focusedSurface = undefined
    nextFocusView?.surface?.role?.desktopSurface?.activate()
  }

  private runButtonBinding(event: ButtonEvent) {
    if (event.released) {
      return
    }

    this.buttonBindings
      .filter(
        (buttonBinding) => buttonBinding.button === event.buttonCode && buttonBinding.modifiers === this.modifierState,
      )
      .forEach((buttonBinding) => buttonBinding.handler(this.pointer, event))
  }
}
