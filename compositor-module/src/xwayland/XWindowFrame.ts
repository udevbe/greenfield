import { WlPointerButtonState } from 'westfield-runtime-server'
import { SCREEN, WINDOW, XConnection } from 'xtsb'
import { PICTFORMINFO } from 'xtsb/dist/types/xcbRender'
import signClose from '../assets/sign_close.png'
import signMaximize from '../assets/sign_maximize.png'
import signMinimize from '../assets/sign_minimize.png'
import Pointer from '../Pointer'

function fetchIcon(url: string): Promise<ImageBitmap> {
  return fetch(url)
    .then(value => value.blob())
    .then(value => value.arrayBuffer())
    .then(value => new Uint8ClampedArray(value))
    .then(value => new Blob([value], { type: 'image/png' }))
    .then(value => createImageBitmap(value))
}

const signCloseIconPromise = fetchIcon(signClose)
const signMaximizeIconPromise = fetchIcon(signMaximize)
const signMinimizeIconPromise = fetchIcon(signMinimize)


enum ThemeFrame {
  THEME_FRAME_ACTIVE = 1,
  THEME_FRAME_MAXIMIZED = 2,
  THEME_FRAME_NO_TITLE = 4
}

export enum FrameStatus {
  FRAME_STATUS_NONE = 0,
  FRAME_STATUS_REPAINT = 0x1,
  FRAME_STATUS_MINIMIZE = 0x2,
  FRAME_STATUS_MAXIMIZE = 0x4,
  FRAME_STATUS_CLOSE = 0x8,
  FRAME_STATUS_MENU = 0x10,
  FRAME_STATUS_RESIZE = 0x20,
  FRAME_STATUS_MOVE = 0x40,
  FRAME_STATUS_ALL = 0x7f
}

export enum ThemeLocation {
  THEME_LOCATION_INTERIOR = 0,
  THEME_LOCATION_RESIZING_TOP = 1,
  THEME_LOCATION_RESIZING_BOTTOM = 2,
  THEME_LOCATION_RESIZING_LEFT = 4,
  THEME_LOCATION_RESIZING_TOP_LEFT = 5,
  THEME_LOCATION_RESIZING_BOTTOM_LEFT = 6,
  THEME_LOCATION_RESIZING_RIGHT = 8,
  THEME_LOCATION_RESIZING_TOP_RIGHT = 9,
  THEME_LOCATION_RESIZING_BOTTOM_RIGHT = 10,
  THEME_LOCATION_RESIZING_MASK = 15,
  THEME_LOCATION_EXTERIOR = 16,
  THEME_LOCATION_TITLEBAR = 17,
  THEME_LOCATION_CLIENT_AREA = 18,
}

export enum FrameButton {
  FRAME_BUTTON_NONE = 0,
  FRAME_BUTTON_CLOSE = 0x1,
  FRAME_BUTTON_MAXIMIZE = 0x2,
  FRAME_BUTTON_MINIMIZE = 0x4,
  FRAME_BUTTON_ALL = 0x7
}

enum FrameButtonFlags {
  FRAME_BUTTON_ALIGN_RIGHT = 0x1,
  FRAME_BUTTON_DECORATED = 0x2,
  FRAME_BUTTON_CLICK_DOWN = 0x4,
}

export enum FrameFlag {
  FRAME_FLAG_ACTIVE = 0x1,
  FRAME_FLAG_MAXIMIZED = 0x2
}

// from input-event-codes.h
const BTN_LEFT = 0x110
const BTN_RIGHT = 0x111

class XWindowFramePointer {
  // @ts-ignore
  private destroyResolve: (value?: void | PromiseLike<void>) => void
  private destroyPromise = new Promise(resolve => this.destroyResolve = resolve)

  constructor(public pointer?: Pointer, public x: number = 0, public y: number = 0, public hoverButton?: XWindowFrameButton, public downButtons: XWindowFramePointerButton[] = []) {
  }

  enter(frame: XWindowFrame, pointer: Pointer | undefined, x: number, y: number) {
    this.motion(frame, pointer, x, y)
  }

  motion(frame: XWindowFrame, pointer: Pointer | undefined, x: number, y: number) {
    const framePointer = frame.getPointer(pointer)
    const button = frame.findButton(x, y)
    const location = frame.theme.getLocation(x, y, frame.width, frame.height, frame.flags & FrameFlag.FRAME_FLAG_MAXIMIZED ? ThemeFrame.THEME_FRAME_MAXIMIZED : 0)

    if (!framePointer) {
      return location
    }

    framePointer.x = x
    framePointer.y = y

    if (framePointer.hoverButton === button) {
      return location
    }

    framePointer.hoverButton?.leave()
    framePointer.hoverButton = button
    framePointer.hoverButton?.enter()

    return location
  }

  destroy() {
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }
}

class XWindowFramePointerButton {
  // @ts-ignore
  private destroyResolve: (value?: void | PromiseLike<void>) => void
  private destroyPromise = new Promise(resolve => this.destroyResolve = resolve)

  constructor(public button: number, public pressLocation: ThemeLocation, private frameButton?: XWindowFrameButton) {
  }

  press(frame: XWindowFrame, pointer: XWindowFramePointer) {
    if (this.button === BTN_RIGHT) {
      if (this.pressLocation === ThemeLocation.THEME_LOCATION_TITLEBAR) {
        frame.status |= FrameStatus.FRAME_STATUS_MENU
      }
      this.destroy()
    } else if (this.button === BTN_LEFT) {
      if (pointer.hoverButton) {
        pointer.hoverButton.press()
      } else {
        switch (this.pressLocation) {
          case ThemeLocation.THEME_LOCATION_TITLEBAR:
            frame.status |= FrameStatus.FRAME_STATUS_MOVE
            this.destroy()
            break
          case ThemeLocation.THEME_LOCATION_RESIZING_TOP:
          case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM:
          case ThemeLocation.THEME_LOCATION_RESIZING_LEFT:
          case ThemeLocation.THEME_LOCATION_RESIZING_RIGHT:
          case ThemeLocation.THEME_LOCATION_RESIZING_TOP_LEFT:
          case ThemeLocation.THEME_LOCATION_RESIZING_TOP_RIGHT:
          case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_LEFT:
          case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_RIGHT:
            frame.status |= FrameStatus.FRAME_STATUS_RESIZE
            this.destroy()
            break
          default:
            break

        }
      }
    }
  }

  release(pointer: XWindowFramePointer) {
    if (this.button === BTN_LEFT && this.frameButton) {
      if (this.frameButton === pointer.hoverButton) {
        this.frameButton.release()
      } else {
        this.frameButton.cancel()
      }
    }
  }

  cancel() {
    this.frameButton?.cancel()
  }

  destroy() {
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }
}

class XWindowFrameButton {
  allocation: {
    x: number, y: number
    width: number, height: number
  } = {
    x: 0, y: 0,
    width: 0, height: 0
  }

  // @ts-ignore
  private destroyResolve: (value?: void | PromiseLike<void>) => void
  private destroyPromise = new Promise(resolve => this.destroyResolve = resolve)

  private hoverCount: number = 0
  private pressCount: number = 0

  constructor(private frame: XWindowFrame, public icon: CanvasRenderingContext2D, private statusEffect: FrameStatus, public flags: FrameButtonFlags) {
  }

  enter() {
    if (!this.hoverCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
    this.hoverCount++
  }

  leave() {
    this.hoverCount--
    if (!this.hoverCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
  }

  press() {
    if (!this.pressCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
    this.pressCount++

    if (this.flags & FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN) {
      this.frame.status |= this.statusEffect
    }
  }

  release() {
    this.pressCount--
    if (this.pressCount) {
      return
    }

    this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT

    if (!(this.flags & FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)) {
      this.frame.status |= this.statusEffect
    }
  }

  cancel() {
    this.pressCount--
    if (!this.pressCount) {
      this.frame.status |= FrameStatus.FRAME_STATUS_REPAINT
    }
  }

  repaint() {
    if (!this.allocation.width) {
      return
    }
    if (!this.allocation.height) {
      return
    }

    const x = this.allocation.x
    const y = this.allocation.y

    // TODO do paint in canvas?
  }

  destroy() {
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }
}

export interface Frame {
  status: number
  width: number,
  height: number
  interior: { x: number; y: number, width: number, height: number }

  pointerMotion(pointer: Pointer | undefined, x: number, y: number): ThemeLocation

  doubleClick(undefined: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation

  pointerButton(pointer: Pointer | undefined, buttonId: number, buttonState: WlPointerButtonState): ThemeLocation

  statusClear(frameStatus: FrameStatus): void

  resizeInside(width: number, height: number): void

  destroy(): void

  resizeInside(width: number, height: number): void

  setTitle(title: string): void

  repaint(): void

  renderShadow(x: number, y: number, width: number, height: number, margin: number, topMargin: number): void

  inputRect(): { x: number, y: number, width: number, height: number }

  pointerEnter(pointer: Pointer | undefined, x: number, y: number): ThemeLocation

  pointerLeave(pointer: Pointer | undefined): void

  unsetFlag(flag: FrameFlag): void

  setFlag(flag: FrameFlag): void
}

export class XWindowFrame implements Frame {
  status: FrameStatus = FrameStatus.FRAME_STATUS_REPAINT
  pointers: XWindowFramePointer[] = []
  buttons: XWindowFrameButton[] = []
  private _interior: { x: number; y: number, width: number, height: number } = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  private geometryDirty: boolean = true
  flags: FrameFlag = 0
  private opaqueMargin: number = 0
  private _shadowMargin: number = 0
  private titleRect: {
    x: number,
    y: number,
    width: number,
    height: number
  } = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  constructor(
    public theme: Theme,
    public width: number,
    public height: number,
    buttons: number,
    private title: string,
    private closeButtonIcon: CanvasRenderingContext2D,
    private maximizeButtonIcon: CanvasRenderingContext2D,
    private minimzeButtonIcon: CanvasRenderingContext2D,
    private icon?: CanvasRenderingContext2D
  ) {
    if (title) {
      if (icon) {
        const xWindowFrameButton = new XWindowFrameButton(this, icon, FrameStatus.FRAME_STATUS_MENU, FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
        this.buttons = [...this.buttons, xWindowFrameButton]
      } else {
        // TODO load a png and use it as a default icon?
      }
    }

    if (buttons & FrameButton.FRAME_BUTTON_CLOSE) {
      // TODO load sign_close.png

      const xWindowFrameButton = new XWindowFrameButton(this, closeButtonIcon, FrameStatus.FRAME_STATUS_MENU, FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
      xWindowFrameButton.onDestroy().then(() => this.buttons = this.buttons.filter(value => value !== xWindowFrameButton))
      this.buttons = [...this.buttons, xWindowFrameButton]
    }

    if (buttons & FrameButton.FRAME_BUTTON_MAXIMIZE) {
      // TODO load "sign_maximize.png

      const xWindowFrameButton = new XWindowFrameButton(this, maximizeButtonIcon, FrameStatus.FRAME_STATUS_MENU, FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
      xWindowFrameButton.onDestroy().then(() => this.buttons = this.buttons.filter(value => value !== xWindowFrameButton))
      this.buttons = [...this.buttons, xWindowFrameButton]
    }

    if (buttons & FrameButton.FRAME_BUTTON_MINIMIZE) {
      // TODO load sign_minimize.png

      const xWindowFrameButton = new XWindowFrameButton(this, minimzeButtonIcon, FrameStatus.FRAME_STATUS_MENU, FrameButtonFlags.FRAME_BUTTON_CLICK_DOWN)
      xWindowFrameButton.onDestroy().then(() => this.buttons = this.buttons.filter(value => value !== xWindowFrameButton))
      this.buttons = [...this.buttons, xWindowFrameButton]
    }
  }

  pointerMotion(pointer: Pointer | undefined, x: number, y: number): ThemeLocation {
    const framePointer = this.getPointer(pointer)
    const button = this.findButton(x, y)

    const location = this.theme.getLocation(x, y, this.width, this.height, this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED ? ThemeFrame.THEME_FRAME_MAXIMIZED : 0)
    if (!framePointer) {
      return location
    }

    framePointer.x = x
    framePointer.y = y

    if (framePointer.hoverButton === button) {
      return location
    }

    if (framePointer.hoverButton) {
      framePointer.hoverButton.leave()
    }

    framePointer.hoverButton = button

    if (framePointer.hoverButton) {
      framePointer.hoverButton.enter()
    }

    return location
  }

  doubleClick(pointer: Pointer | undefined, btn: number, state: WlPointerButtonState): ThemeLocation {
    const framePointer = this.getPointer(pointer)
    const location = this.theme.getLocation(framePointer.x, framePointer.y, this.width, this.height, this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED ? ThemeFrame.THEME_FRAME_MAXIMIZED : 0)
    const button = this.findButton(framePointer.x, framePointer.y)

    if (location !== ThemeLocation.THEME_LOCATION_TITLEBAR || btn !== BTN_LEFT) {
      return location
    }

    if (state === WlPointerButtonState.pressed) {
      if (button) {
        button.press()
      } else {
        this.status |= FrameStatus.FRAME_STATUS_MAXIMIZE
      }
    } else if (state === WlPointerButtonState.released) {
      if (button) {
        button.release()
      }
    }

    return location
  }

  pointerButton(pointer: Pointer | undefined, btn: number, state: WlPointerButtonState): ThemeLocation {
    const framePointer = this.getPointer(pointer)
    let location = ThemeLocation.THEME_LOCATION_EXTERIOR

    if (!framePointer) {
      return location
    }

    location = this.theme.getLocation(framePointer.x, framePointer.y, this.width, this.height, this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED ? ThemeFrame.THEME_FRAME_MAXIMIZED : 0)

    if (state === WlPointerButtonState.pressed) {
      const button = new XWindowFramePointerButton(btn, location, framePointer.hoverButton)
      framePointer.downButtons = [...framePointer.downButtons, button]
      button.press(this, framePointer)
    } else if (state === WlPointerButtonState.released) {
      const button = framePointer.downButtons.find(button => button.button === btn)
      if (!button) {
        return location
      }
      location = button.pressLocation
      button.release(framePointer)
      button.destroy()
    }

    return location
  }

  statusClear(frameStatus: FrameStatus): void {
    this.status &= ~frameStatus
  }

  resizeInside(width: number, height: number): void {
    let decorationWidth = 0
    let decorationHeight = 0
    let titlebarHeight = 0
    if (this.title || this.buttons.length !== 0) {
      titlebarHeight = this.theme.titlebarHeight
    } else {
      titlebarHeight = this.theme.width
    }

    if (this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED) {
      decorationWidth = this.theme.width * 2
      decorationHeight = this.theme.width + titlebarHeight
    } else {
      decorationWidth = (this.theme.width + this.theme.margin) * 2
      decorationHeight = this.theme.width + titlebarHeight + this.theme.margin * 2
    }

    this.resize(width + decorationWidth, height + decorationHeight)
  }

  destroy(): void {
    this.buttons.forEach(value => value.destroy())
    this.pointers.forEach(value => value.destroy())
  }

  private refreshGeometry() {
    if (!this.geometryDirty) {
      return
    }

    const titlebarHeight = this.title || this.buttons.length > 0 ? this.theme.titlebarHeight : this.theme.width

    if (this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED) {
      const decorationWidth = this.theme.width * 2
      const decorationHeight = this.theme.width + titlebarHeight

      this._interior.x = this.theme.width
      this._interior.y = titlebarHeight
      this._interior.width = this.width - decorationWidth
      this._interior.height = this.height - decorationHeight

      this.opaqueMargin = 0
      this._shadowMargin = 0
    } else {
      const decorationWidth = (this.theme.width + this.theme.margin) * 2
      const decorationHeight = this.theme.width + titlebarHeight + this.theme.margin * 2

      this._interior.x = this.theme.width + this.theme.margin
      this._interior.y = titlebarHeight + this.theme.margin
      this._interior.width = this.width - decorationWidth
      this._interior.height = this.height - decorationHeight

      this.opaqueMargin = this.theme.margin + this.theme.frameRadius
      this._shadowMargin = this.theme.margin
    }

    let xr = this.width - this.theme.width - this._shadowMargin
    let xl = this.theme.width + this._shadowMargin
    const y = this.theme.width + this._shadowMargin

    this.buttons.forEach(button => {
      const buttonPadding = 4
      let w = button.icon.canvas.width
      const h = button.icon.canvas.height

      if (button.flags & FrameButtonFlags.FRAME_BUTTON_DECORATED) {
        w += 10
      }

      if (button.flags & FrameButtonFlags.FRAME_BUTTON_ALIGN_RIGHT) {
        xr -= w

        button.allocation.x = xr
        button.allocation.y = y
        button.allocation.width = w + 1
        button.allocation.height = h + 1

        xr -= buttonPadding
      } else {
        button.allocation.x = xl
        button.allocation.y = y
        button.allocation.width = w + 1
        button.allocation.height = h + 1

        xl += w
        xl += buttonPadding
      }
    })

    this.titleRect.x = xl
    this.titleRect.y = y
    this.titleRect.width = xr - xl
    this.titleRect.height = titlebarHeight

    this.geometryDirty = false
  }

  get interior(): { x: number; y: number; width: number; height: number } {
    this.refreshGeometry()

    return { ...this._interior }
  }

  setTitle(title: string): void {
    this.title = title
    this.geometryDirty = true
    this.status = FrameStatus.FRAME_STATUS_REPAINT
  }

  repaint(): void {
    this.refreshGeometry()
    let flags: ThemeFrame = 0

    if (this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED) {
      flags |= ThemeFrame.THEME_FRAME_MAXIMIZED
    }

    if (this.flags & FrameFlag.FRAME_FLAG_ACTIVE) {
      flags |= ThemeFrame.THEME_FRAME_ACTIVE
    }

    // TODO do theme paint

    this.buttons.forEach(button => button.repaint())

    this.statusClear(FrameStatus.FRAME_STATUS_REPAINT)
  }

  renderShadow(x: number, y: number, width: number, height: number, margin: number, topMargin: number): void {
    // TODO render shadow
    this.theme.shadow
  }

  inputRect(): { x: number, y: number, width: number, height: number } {
    this.refreshGeometry()

    return {
      x: this._shadowMargin,
      y: this._shadowMargin,
      width: this.width - this._shadowMargin * 2,
      height: this.height - this._shadowMargin * 2
    }
  }

  opaqueRect(): { x: number, y: number, width: number, height: number } {
    this.refreshGeometry()

    return {
      x: this.opaqueMargin,
      y: this.opaqueMargin,
      width: this.width - this.opaqueMargin * 2,
      height: this.height - this.opaqueMargin * 2
    }
  }

  get shadowMargin(): number {
    this.refreshGeometry()

    return this._shadowMargin
  }

  pointerEnter(pointer: Pointer | undefined, x: number, y: number): ThemeLocation {
    return this.pointerMotion(pointer, x, y)
  }

  pointerLeave(pointer: Pointer | undefined): void {
    const framePointer = this.getPointer(pointer)
    if (!framePointer) {
      return
    }

    framePointer.hoverButton?.leave()

    framePointer.downButtons.forEach(button => {
      button.cancel()
      button.destroy()
    })

    framePointer.destroy()
  }

  setFlag(flag: FrameFlag) {
    if (flag & FrameFlag.FRAME_FLAG_MAXIMIZED && !(this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED)) {
      this.geometryDirty = true
    }

    this.flags |= flag
    this.status |= FrameStatus.FRAME_STATUS_REPAINT
  }

  unsetFlag(flag: FrameFlag) {
    if (flag & FrameFlag.FRAME_FLAG_MAXIMIZED && this.flags & FrameFlag.FRAME_FLAG_MAXIMIZED) {
      this.geometryDirty = true
    }

    this.flags &= ~flag
    this.status |= FrameStatus.FRAME_STATUS_REPAINT
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.geometryDirty = true
    this.status |= FrameStatus.FRAME_STATUS_REPAINT
  }

  getPointer(pointer?: Pointer): XWindowFramePointer {
    const framePointer = this.pointers.find(framePointer => framePointer.pointer === pointer)
    if (framePointer) {
      return framePointer
    }

    const xWindowFramePointer = new XWindowFramePointer(pointer)
    xWindowFramePointer.onDestroy().then(value => this.pointers = this.pointers.filter(value => value !== xWindowFramePointer))
    this.pointers = [...this.pointers, xWindowFramePointer]
    return xWindowFramePointer
  }

  findButton(x: number, y: number): XWindowFrameButton | undefined {
    return this.buttons.find(button => {
      const relX = x - button.allocation.x
      const relY = y - button.allocation.y

      return (0 <= relX && relX < button.allocation.width &&
        0 <= relY && relY < button.allocation.height)
    })
  }
}

export interface Theme {
  readonly activeFrame?: CanvasRenderingContext2D,
  readonly inactiveFrame?: CanvasRenderingContext2D,
  readonly shadow?: CanvasRenderingContext2D,
  readonly frameRadius: number,
  readonly margin: number,
  readonly width: number,
  readonly titlebarHeight: number

  getLocation(x: number, y: number, width: number, height: number, flags: ThemeFrame): ThemeLocation
}

class XWindowTheme implements Theme {
  readonly activeFrame: CanvasRenderingContext2D
  readonly frameRadius: number = 3
  readonly inactiveFrame: CanvasRenderingContext2D
  // FIXME setting this to a non-zero value breaks things somehow
  readonly margin: number = 0
  readonly shadow: CanvasRenderingContext2D
  readonly titlebarHeight: number = 27
  readonly width: number = 6

  getLocation(x: number, y: number, width: number, height: number, flags: ThemeFrame): ThemeLocation {
    let margin: number
    let gripSize: number
    let topMargin: number
    let hLocation: ThemeLocation
    let vLocation: ThemeLocation
    let location: ThemeLocation

    if (flags & ThemeFrame.THEME_FRAME_MAXIMIZED) {
      margin = 0
      gripSize = 0
    } else {
      margin = this.margin
      gripSize = 8
    }

    if (flags & ThemeFrame.THEME_FRAME_NO_TITLE) {
      topMargin = this.width
    } else {
      topMargin = this.titlebarHeight
    }

    if (x < margin) {
      hLocation = ThemeLocation.THEME_LOCATION_EXTERIOR
    } else if (x < margin + gripSize) {
      hLocation = ThemeLocation.THEME_LOCATION_RESIZING_LEFT
    } else if (x < width - margin - gripSize) {
      hLocation = ThemeLocation.THEME_LOCATION_INTERIOR
    } else if (x < width - margin) {
      hLocation = ThemeLocation.THEME_LOCATION_RESIZING_RIGHT
    } else {
      hLocation = ThemeLocation.THEME_LOCATION_EXTERIOR
    }

    if (y < margin) {
      vLocation = ThemeLocation.THEME_LOCATION_EXTERIOR
    } else if (y < margin + gripSize) {
      vLocation = ThemeLocation.THEME_LOCATION_RESIZING_TOP
    } else if (y < height - margin - gripSize) {
      vLocation = ThemeLocation.THEME_LOCATION_INTERIOR
    } else if (y < height - margin) {
      vLocation = ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM
    } else {
      vLocation = ThemeLocation.THEME_LOCATION_EXTERIOR
    }

    location = vLocation | hLocation
    if (location & ThemeLocation.THEME_LOCATION_EXTERIOR) {
      location = ThemeLocation.THEME_LOCATION_EXTERIOR
    }
    if (location === ThemeLocation.THEME_LOCATION_INTERIOR &&
      y < margin + topMargin) {
      location = ThemeLocation.THEME_LOCATION_TITLEBAR
    } else if (location === ThemeLocation.THEME_LOCATION_INTERIOR) {
      location = ThemeLocation.THEME_LOCATION_CLIENT_AREA
    }

    return location
  }

  constructor() {
    const activeFrame = document.createElement('canvas').getContext('2d')
    const inactiveFrame = document.createElement('canvas').getContext('2d')
    const shadow = document.createElement('canvas').getContext('2d')

    if (activeFrame === null || inactiveFrame === null || shadow === null) {
      throw new Error('Could not create XWindow Theme. CanvasRenderingContext2D failed to initialize.')
    }

    this.activeFrame = activeFrame
    this.inactiveFrame = inactiveFrame
    this.shadow = shadow

    this.shadow.canvas.width = 128
    this.shadow.canvas.height = 128

    this.activeFrame.canvas.width = 128
    this.activeFrame.canvas.height = 128

    this.inactiveFrame.canvas.width = 128
    this.inactiveFrame.canvas.height = 128
  }
}

export function themeCreate(): Theme {
  return new XWindowTheme()
}

export async function frameCreate(theme: Theme, width: number, height: number, buttons: number, title: string, icon?: CanvasRenderingContext2D): Promise<Frame> {
  const signMinimizeIconData = await signMinimizeIconPromise
  const signMaximizeIconData = await signMaximizeIconPromise
  const signCloseIconData = await signCloseIconPromise

  const closeIcon = document.createElement('canvas').getContext('2d')
  const maximizeIcon = document.createElement('canvas').getContext('2d')
  const minimizeIcon = document.createElement('canvas').getContext('2d')

  if (closeIcon === null || maximizeIcon === null || minimizeIcon === null) {
    throw new Error('Could not get 2d rendering context from canvas.')
  }

  closeIcon.canvas.width = signCloseIconData.width
  closeIcon.canvas.height = signCloseIconData.height
  closeIcon.drawImage(signCloseIconData, 0, 0)


  maximizeIcon.canvas.width = signMaximizeIconData.width
  maximizeIcon.canvas.height = signMaximizeIconData.height
  maximizeIcon.drawImage(signMaximizeIconData, 0, 0)

  minimizeIcon.canvas.width = signMinimizeIconData.width
  minimizeIcon.canvas.height = signMinimizeIconData.height
  minimizeIcon.drawImage(signMinimizeIconData, 0, 0)

  return new XWindowFrame(theme, width, height, buttons, title, closeIcon, maximizeIcon, minimizeIcon, icon)
}

export function canvasXtsbSurfaceCreateWithXRenderFormat(connection: XConnection, screen: SCREEN, frameId: WINDOW, formatRgba: PICTFORMINFO, width: number, height: number): HTMLCanvasElement {
  // TODO
  return document.createElement('canvas')
}

export function canvasXtsbSurfaceSetSize(canvas: HTMLCanvasElement | undefined, width: number, height: number): void {
  // TODO
}
