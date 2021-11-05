import { WlObject } from 'westfield-runtime-common'
import { WlSurfaceResource } from 'westfield-runtime-server'
import {
  ATOM,
  Atom,
  ClientMessageEvent,
  CoordMode,
  EventMask,
  GetPropertyReply,
  marshallClientMessageEvent,
  marshallConfigureNotifyEvent,
  PropMode,
  TIMESTAMP,
  Window,
  WindowClass,
} from 'xtsb'
import { queueCancellableMicrotask } from '../Loop'
import { Point } from '../math/Point'
import { createRect } from '../math/Rect'
import { Size } from '../math/Size'
import Output from '../Output'
import { fini, init, initRect } from '../Region'
import Session from '../Session'
import Surface from '../Surface'
import {
  _NET_WM_MOVERESIZE_CANCEL,
  _NET_WM_MOVERESIZE_MOVE,
  _NET_WM_MOVERESIZE_SIZE_BOTTOM,
  _NET_WM_MOVERESIZE_SIZE_BOTTOMLEFT,
  _NET_WM_MOVERESIZE_SIZE_BOTTOMRIGHT,
  _NET_WM_MOVERESIZE_SIZE_LEFT,
  _NET_WM_MOVERESIZE_SIZE_RIGHT,
  _NET_WM_MOVERESIZE_SIZE_TOP,
  _NET_WM_MOVERESIZE_SIZE_TOPLEFT,
  _NET_WM_MOVERESIZE_SIZE_TOPRIGHT,
  _NET_WM_STATE_ADD,
  _NET_WM_STATE_REMOVE,
  _NET_WM_STATE_TOGGLE,
  ICCCM_WITHDRAWN_STATE,
  MWM_DECOR_ALL,
  MWM_DECOR_EVERYTHING,
  MWM_DECOR_MAXIMIZE,
  MWM_HINTS_DECORATIONS,
  PMaxSize,
  PMinSize,
  PPosition,
  PSize,
  TYPE_MOTIF_WM_HINTS,
  TYPE_NET_WM_STATE,
  TYPE_WM_NORMAL_HINTS,
  TYPE_WM_PROTOCOLS,
  USPosition,
  USSize,
} from './XConstants'
import XWaylandShellSurface, { SurfaceState } from './XWaylandShellSurface'
import { FrameButton, frameCreate, FrameFlag, ThemeLocation, XWindowFrame } from './XWindowFrame'
import { XWindowManager } from './XWindowManager'

type Prop = [atom: ATOM, type: ATOM, propUpdater: (prop: GetPropertyReply) => void]

enum IcccmInputModel {
  LOCAL,
  PASSIVE,
  GLOBAL,
  NONE,
}

interface Hints {
  flags: number
  input: number
  initialState: number
  iconPixmap: number
  iconWindow: number
  iconX: number
  iconY: number
  iconMask: number
  windowGroup: number
}

interface SizeHints {
  flags: number
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  maxWidth: number
  maxHeight: number
  widthInc: number
  heightInc: number
  minAspect: { x: number; y: number }
  maxAspect: { x: number; y: number }
  baseWidth: number
  baseHeight: number
  winGravity: number
}

interface MotifWmHints {
  flags: number
  functions: number
  decorations: number
  inputMode: number
  status: number
}

function updateState(action: number, state: number | boolean): { newState: number | boolean; changed: boolean } {
  let newState

  switch (action) {
    case _NET_WM_STATE_REMOVE:
      newState = 0
      break
    case _NET_WM_STATE_ADD:
      newState = 1
      break
    case _NET_WM_STATE_TOGGLE:
      newState = !state
      break
    default:
      return { changed: false, newState: state }
  }

  const changed = state !== newState

  return { changed, newState }
}

export class XWindow {
  class = ''
  decorate = 0
  deleteWindow = false
  frameId = 0
  fullscreen = false
  hasAlpha = false
  machine = ''
  maximizedHorizontal = false
  maximizedVertical = false
  name = ''
  pid = 0
  type = 0
  propertiesDirty = true
  positionDirty = false
  mapRequestX = Number.MIN_SAFE_INTEGER /* out of range for valid positions */
  mapRequestY = Number.MIN_SAFE_INTEGER /* out of range for valid positions */
  didDouble = false
  lastButtonTime = 0
  savedHeight?: number
  savedWidth?: number

  surface?: Surface
  surfaceId?: number
  surfaceDestroyListener?: (surfaceResource: WlObject) => void
  frame?: XWindowFrame
  sizeHints?: SizeHints
  motifHints?: MotifWmHints
  hints?: Hints
  shsurf?: XWaylandShellSurface
  legacyFullscreenOutput?: Output
  transientFor?: XWindow
  configureTaskRegistration?: () => void
  repaintRegistration?: () => void
  frameExtentsHint = false
  takeFocus = false

  private blackGraphicsContext?: number

  constructor(
    public wm: XWindowManager,
    public id: number,
    public overrideRedirect: boolean,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public readonly session: Session,
  ) {}

  // FIXME fix input focus model, see: https://github.com/swaywm/wlroots/blob/52da68b591bedbbf8a01d74b2f08307a28b058c9/xwayland/xwm.c#L2217
  inputModel(): IcccmInputModel {
    if (!this.hints || this.hints.input) {
      if (this.takeFocus) {
        return IcccmInputModel.LOCAL
      }
      return IcccmInputModel.PASSIVE
    } else {
      if (this.takeFocus) {
        return IcccmInputModel.GLOBAL
      }
    }
    return IcccmInputModel.NONE
  }

  setNetWmState(): void {
    const property: number[] = []
    // TODO implement modal window state
    // if(this.modal) {
    //   property.push(this.wm.atoms._NET_WM_STATE_MODAL)
    // }
    if (this.fullscreen) {
      property.push(this.wm.atoms._NET_WM_STATE_FULLSCREEN)
    }
    if (this.maximizedVertical) {
      property.push(this.wm.atoms._NET_WM_STATE_MAXIMIZED_VERT)
    }
    if (this.maximizedHorizontal) {
      property.push(this.wm.atoms._NET_WM_STATE_MAXIMIZED_HORZ)
    }
    // TODO implement minimized window state(?)
    // if (this.minimized) {
    //   property.push(this.wm.atoms._NET_WM_STATE_HIDDEN)
    // }
    if (this === this.wm.focusWindow) {
      property.push(this.wm.atoms._NET_WM_STATE_FOCUSED)
    }
    this.wm.xConnection.changeProperty(
      PropMode.Replace,
      this.id,
      this.wm.atoms._NET_WM_STATE,
      Atom.ATOM,
      32,
      new Uint32Array(property),
    )
  }

  scheduleRepaint(): void {
    if (this.frameId === Window.None) {
      /* Override-redirect windows go through here, but we
       * cannot assert(window->override_redirect); because
       * we do not deal with changing OR flag yet.
       * XXX: handle OR flag changes in message handlers
       */
      this.setPendingStateOverrideRedirect()
      return
    }

    if (this.repaintRegistration) {
      return
    }

    this.session.logger.debug(`XWindow: schedule repaint, win ${this.id}`)

    this.repaintRegistration = queueCancellableMicrotask(() => this.doRepaint())
  }

  /** Control Xwayland wl_surface.commit behaviour
   *
   * This function sets the "_XWAYLAND_ALLOW_COMMITS" property of the frame window
   * (not the content window!) to allow.
   *
   * If the property is set to true, Xwayland will commit whenever it likes.
   * If the property is set to false, Xwayland will not commit.
   * If the property is not set at all, Xwayland assumes it is true.
   *
   * @param allow Whether Xwayland is allowed to wl_surface.commit for the window.
   */
  setAllowCommits(allow: boolean): void {
    if (this.frameId === undefined) {
      throw new Error('Window does not have a parent.')
    }

    this.wm.xConnection.changeProperty(
      PropMode.Replace,
      this.frameId,
      this.wm.atoms._XWAYLAND_ALLOW_COMMITS,
      Atom.CARDINAL,
      32,
      new Uint32Array([allow ? 1 : 0]),
    )
    this.wm.xConnection.flush()
  }

  async readProperties(): Promise<void> {
    if (!this.propertiesDirty) {
      return
    }
    this.propertiesDirty = false

    const props: Prop[] = [
      [Atom.wmClass, Atom.STRING, ({ value }) => (this.class = value.chars())],
      [Atom.wmName, Atom.STRING, ({ value }) => (this.name = value.chars())],
      [
        Atom.wmTransientFor,
        Atom.WINDOW,
        ({ value }) => {
          const lookupWindow = this.wm.lookupXWindow(new Uint32Array(value.buffer, value.byteOffset)[0])
          if (lookupWindow === undefined) {
            this.session.logger.debug('XCB_ATOM_WINDOW contains window id not found in hash table.')
          } else {
            this.transientFor = lookupWindow
          }
        },
      ],
      [
        this.wm.atoms.WM_PROTOCOLS,
        TYPE_WM_PROTOCOLS,
        ({ value, valueLen }) => {
          const atoms = new Uint32Array(value.buffer, value.byteOffset)
          atoms.includes(this.wm.atoms.WM_DELETE_WINDOW)
          if (atoms.includes(this.wm.atoms.WM_DELETE_WINDOW)) {
            this.deleteWindow = true
          }
          if (atoms.includes(this.wm.atoms.WM_TAKE_FOCUS)) {
            this.takeFocus = true
          }
        },
      ],
      [
        this.wm.atoms.WM_HINTS,
        this.wm.atoms.WM_HINTS,
        ({ value }) => {
          const [flags, input, initialState, iconPixmap, iconWindow, iconX, iconY, iconMask, windowGroup] =
            new Uint32Array(value.buffer, value.byteOffset)
          this.hints = {
            flags,
            input,
            initialState,
            iconPixmap,
            iconWindow,
            iconX,
            iconY,
            iconMask,
            windowGroup,
          }
        },
      ],
      [
        this.wm.atoms.WM_NORMAL_HINTS,
        TYPE_WM_NORMAL_HINTS,
        ({ value }) => {
          const [
            flags,
            x,
            y,
            width,
            height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            widthInc,
            heightInc,
            minAspectX,
            minAspectY,
            maxAspectX,
            maxAspectY,
            baseWidth,
            baseHeight,
            winGravity,
          ] = new Uint32Array(value.buffer, value.byteOffset)
          this.sizeHints = {
            flags,
            x,
            y,
            width,
            height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            widthInc,
            heightInc,
            minAspect: { x: minAspectX, y: minAspectY },
            maxAspect: { x: maxAspectX, y: maxAspectY },
            baseWidth,
            baseHeight,
            winGravity,
          }
        },
      ],
      [
        this.wm.atoms._NET_WM_STATE,
        TYPE_NET_WM_STATE,
        ({ value, valueLen }) => {
          this.fullscreen = false
          const atoms = new Uint32Array(value.buffer, value.byteOffset)
          for (let i = 0; i < valueLen; i++) {
            if (atoms[i] === this.wm.atoms._NET_WM_STATE_FULLSCREEN) {
              this.fullscreen = true
            }
            if (atoms[i] === this.wm.atoms._NET_WM_STATE_MAXIMIZED_VERT) {
              this.maximizedVertical = true
            }
            if (atoms[i] === this.wm.atoms._NET_WM_STATE_MAXIMIZED_HORZ) {
              this.maximizedHorizontal = true
            }
          }
        },
      ],
      [
        this.wm.atoms._NET_WM_WINDOW_TYPE,
        Atom.ATOM,
        ({ value }) => (this.type = new Uint32Array(value.buffer, value.byteOffset)[0]),
      ],
      [this.wm.atoms._NET_WM_NAME, Atom.STRING, ({ value }) => (this.name = value.chars())],
      [
        this.wm.atoms._NET_WM_PID,
        Atom.CARDINAL,
        ({ value }) => (this.pid = new Uint32Array(value.buffer, value.byteOffset)[0]),
      ],
      [
        this.wm.atoms._MOTIF_WM_HINTS,
        TYPE_MOTIF_WM_HINTS,
        ({ value }) => {
          const [flags, functions, decorations, inputMode, status] = new Uint32Array(value.buffer, value.byteOffset)
          this.motifHints = {
            flags,
            functions,
            decorations,
            inputMode,
            status,
          }
          if (this.motifHints.flags & MWM_HINTS_DECORATIONS) {
            if (this.motifHints.decorations & MWM_DECOR_ALL) {
              /* MWM_DECOR_ALL means all except the other values listed. */
              this.decorate = MWM_DECOR_EVERYTHING & ~this.motifHints.decorations
            } else {
              this.decorate = this.motifHints.decorations
            }
          }
        },
      ],
      [this.wm.atoms.WM_CLIENT_MACHINE, Atom.wmClientMachine, ({ value }) => (this.machine = value.chars())],
    ]

    this.decorate = this.overrideRedirect ? 0 : MWM_DECOR_EVERYTHING
    if (this.sizeHints) {
      this.sizeHints.flags = 0
    }
    if (this.motifHints) {
      this.motifHints.flags = 0
    }
    this.deleteWindow = false

    await Promise.all(
      props.map(([atom, , propUpdater]: Prop) =>
        this.wm.xConnection
          .getProperty(0, this.id, atom, Atom.Any, 0, 2048)
          .then((property) => {
            if (property._type === Atom.None) {
              /* No such property */
              return
            }
            propUpdater(property)
          })
          .catch(() => {
            /* Bad window, typically */
          }),
      ),
    )
  }

  getChildPosition(): { x: number; y: number } {
    if (this.fullscreen) {
      return { x: 0, y: 0 }
    }

    if (this.decorate && this.frame) {
      return this.frame.interior
    }

    return { x: this.wm.theme.margin, y: this.wm.theme.margin }
  }

  async createFrame(): Promise<void> {
    let buttons = FrameButton.FRAME_BUTTON_CLOSE

    if (this.decorate & MWM_DECOR_MAXIMIZE) {
      buttons |= FrameButton.FRAME_BUTTON_MAXIMIZE
    }

    this.frame = await frameCreate(this.session, this.wm.theme, this.width, this.height, buttons, this.name)

    this.frame?.resizeInside(this.width, this.height)

    const { width, height } = this.getFrameSize()
    const { x, y } = this.getChildPosition()

    this.frameId = this.wm.xConnection.allocateID()
    this.wm.xConnection.createWindow(
      32,
      this.frameId,
      this.wm.screen.root,
      0,
      0,
      width,
      height,
      0,
      WindowClass.InputOutput,
      this.wm.visualId,
      {
        borderPixel: this.wm.screen.blackPixel,
        eventMask:
          EventMask.KeyPress |
          EventMask.KeyRelease |
          EventMask.ButtonPress |
          EventMask.ButtonRelease |
          EventMask.PointerMotion |
          EventMask.EnterWindow |
          EventMask.LeaveWindow |
          EventMask.SubstructureNotify |
          EventMask.SubstructureRedirect,
        colormap: this.wm.colormap,
      },
    )

    // create a drawing context to trigger decoration frame redraws (the actual frame pixels are stored browser side)
    this.blackGraphicsContext = this.wm.xConnection.allocateID()
    this.wm.xConnection.createGC(this.blackGraphicsContext, this.frameId, {
      foreground: this.wm.xConnection.setup.roots[0].blackPixel,
    })

    this.wm.xConnection.reparentWindow(this.id, this.frameId, x, y)

    this.wm.configureWindow(this.id, { borderWidth: 0 })

    this.wm.windowHash[this.frameId] = this
  }

  handleMoveResize(event: ClientMessageEvent): void {
    const map = [
      ThemeLocation.THEME_LOCATION_RESIZING_TOP_LEFT,
      ThemeLocation.THEME_LOCATION_RESIZING_TOP,
      ThemeLocation.THEME_LOCATION_RESIZING_TOP_RIGHT,
      ThemeLocation.THEME_LOCATION_RESIZING_RIGHT,
      ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_RIGHT,
      ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM,
      ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_LEFT,
      ThemeLocation.THEME_LOCATION_RESIZING_LEFT,
    ] as const

    const pointer = this.wm.session.globals.seat.pointer
    if (pointer.buttonCount !== 1 || pointer.focus === undefined || pointer.focus.surface !== this.surface) {
      return
    }

    const detail = event.data.data32?.[2]
    if (detail === undefined) {
      return
    }

    switch (detail) {
      case _NET_WM_MOVERESIZE_MOVE:
        this.shsurf?.move(pointer)
        break
      case _NET_WM_MOVERESIZE_SIZE_TOPLEFT:
      case _NET_WM_MOVERESIZE_SIZE_TOP:
      case _NET_WM_MOVERESIZE_SIZE_TOPRIGHT:
      case _NET_WM_MOVERESIZE_SIZE_RIGHT:
      case _NET_WM_MOVERESIZE_SIZE_BOTTOMRIGHT:
      case _NET_WM_MOVERESIZE_SIZE_BOTTOM:
      case _NET_WM_MOVERESIZE_SIZE_BOTTOMLEFT:
      case _NET_WM_MOVERESIZE_SIZE_LEFT:
        this.shsurf?.resize(pointer, map[detail])
        break
      case _NET_WM_MOVERESIZE_CANCEL:
        break
    }
  }

  handleState(event: ClientMessageEvent): void {
    const maximized = this.isMaximized()

    const action = event.data.data32?.[0]
    const property1 = event.data.data32?.[1]
    const property2 = event.data.data32?.[2]

    let changed = false
    if (
      (property1 === this.wm.atoms._NET_WM_STATE_FULLSCREEN || property2 === this.wm.atoms._NET_WM_STATE_FULLSCREEN) &&
      action !== undefined &&
      ((): boolean => {
        const { changed, newState } = updateState(action, this.fullscreen)
        this.fullscreen = !!newState
        return changed
      })()
    ) {
      changed = true
      if (this.fullscreen) {
        this.savedWidth = this.width
        this.savedHeight = this.height

        this.shsurf?.setFullscreen()
      } else {
        this.setToplevel()
      }
    } else {
      if (
        (property1 === this.wm.atoms._NET_WM_STATE_MAXIMIZED_VERT ||
          property2 === this.wm.atoms._NET_WM_STATE_MAXIMIZED_VERT) &&
        action !== undefined &&
        ((): boolean => {
          const { changed, newState } = updateState(action, this.maximizedVertical)
          this.maximizedVertical = !!newState
          return changed
        })()
      ) {
        changed = true
      }
      if (
        (property1 === this.wm.atoms._NET_WM_STATE_MAXIMIZED_HORZ ||
          property2 === this.wm.atoms._NET_WM_STATE_MAXIMIZED_HORZ) &&
        action !== undefined &&
        ((): boolean => {
          const { changed, newState } = updateState(action, this.maximizedHorizontal)
          this.maximizedHorizontal = !!newState
          return changed
        })()
      ) {
        changed = true
      }

      if (maximized !== this.isMaximized()) {
        if (this.isMaximized()) {
          this.savedWidth = this.width
          this.savedHeight = this.height
          this.frame?.setFlag(FrameFlag.FRAME_FLAG_MAXIMIZED)
          this.shsurf?.setMaximized()
        } else {
          this.frame?.unsetFlag(FrameFlag.FRAME_FLAG_MAXIMIZED)
          this.setToplevel()
        }
      }
    }

    if (changed) {
      this.setNetWmState()
    }
  }

  isMaximized(): boolean {
    return this.maximizedHorizontal && this.maximizedVertical
  }

  setWmState(state: number): void {
    this.wm.xConnection.changeProperty(
      PropMode.Replace,
      this.id,
      this.wm.atoms.WM_STATE,
      this.wm.atoms.WM_STATE,
      32,
      new Uint32Array([state, Window.None]),
    )
  }

  /*
   * Sets the _NET_WM_DESKTOP property for the window to 'desktop'.
   * Passing a <0 desktop value deletes the property.
   */
  setVirtualDesktop(desktop: number): void {
    if (desktop >= 0) {
      this.wm.xConnection.changeProperty(
        PropMode.Replace,
        this.id,
        this.wm.atoms._NET_WM_DESKTOP,
        Atom.CARDINAL,
        32,
        new Uint32Array([desktop]),
      )
    } else {
      this.wm.xConnection.deleteProperty(this.id, this.wm.atoms._NET_WM_DESKTOP)
    }
  }

  async handleSurfaceId(event: ClientMessageEvent): Promise<void> {
    if (this.surfaceId) {
      this.session.logger.debug(`already have surface id for window ${this.id}`)
      return
    }

    /* Xwayland will send the wayland requests to create the
     * wl_surface before sending this client message.  Even so, we
     * can end up handling the X event before the wayland requests
     * and thus when we try to look up the surface ID, the surface
     * hasn't been created yet.  In that case put the window on
     * the unpaired window list and continue when the surface gets
     * created. */
    const id = event.data.data32?.[0]
    if (id === undefined) {
      return
    }

    const resource = this.wm.client.connection.wlObjects[id] as WlSurfaceResource
    if (resource) {
      this.surfaceId = 0
      await this.xServerMapShellSurface(resource.implementation as Surface)
    } else {
      this.surfaceId = id
      this.wm.unpairedWindowList.push(this)
    }
  }

  async xServerMapShellSurface(surface: Surface): Promise<void> {
    /* This should be necessary only for override-redirected windows,
     * because otherwise MapRequest handler would have already updated
     * the properties. However, if X11 clients set properties after
     * sending MapWindow, here we can still process them. The decorations
     * have already been drawn once with the old property values, so if the
     * app changes something affecting decor after MapWindow, we glitch.
     * We only hit xserver_map_shell_surface() once per MapWindow and
     * wl_surface, so better ensure we get the window type right.
     */
    await this.readProperties()

    /* A weston_wm_window may have many different surfaces assigned
     * throughout its life, so we must make sure to remove the listener
     * from the old surface signal list. */
    if (this.surface && this.surfaceDestroyListener) {
      this.surface.resource.removeDestroyListener(this.surfaceDestroyListener)
    }

    this.surface = surface
    this.surfaceDestroyListener = () => {
      this.session.logger.debug(`XWindow: surface for xid ${this.id} destroyed`)
      /* This should have been freed by the shell.
       * Don't try to use it later. */
      this.shsurf = undefined
      this.surface = undefined
    }
    this.surface.resource.addDestroyListener(this.surfaceDestroyListener)

    this.shsurf = this.wm.xWaylandShell.createSurface(this, surface)
    this.shsurf.sendConfigure = (size: Size) => this.sendConfigure(size)
    this.shsurf.sendPosition = (position: Point) => this.sendPosition(position)

    this.session.logger.debug(
      `XWindow: map shell surface, win ${this.id}, greenfield surface ${this.surface.resource.id}`,
    )

    if (this.name) {
      this.shsurf.setTitle(this.name)
    }
    if (this.pid > 0) {
      this.shsurf.setPid(this.pid)
    }

    if (this.fullscreen && this.legacyFullscreenOutput) {
      this.savedWidth = this.width
      this.savedHeight = this.height
      this.shsurf.setFullscreen(this.legacyFullscreenOutput)
    } else if (this.overrideRedirect) {
      this.shsurf.setXWayland(this.x, this.y)
    } else if (this.transientFor && this.transientFor.surface) {
      const parent = this.transientFor
      if (parent.surface) {
        if (parent.surface && this.isTypeInactive()) {
          this.shsurf.setTransient(parent.surface, this.x - parent.x, this.y - parent.y)
        } else {
          this.shsurf.setToplevel()
          this.shsurf.setParent(parent.surface)
        }
      }
    } else if (this.isMaximized()) {
      this.shsurf.setMaximized()
    } else {
      if (this.isTypeInactive()) {
        this.shsurf.setXWayland(this.x, this.y)
      } else if (this.isPositioned()) {
        this.shsurf.setToplevelWithPosition(this.mapRequestX, this.mapRequestY)
      } else {
        this.shsurf.setToplevel()
      }
    }

    if (this.frameId === Window.None) {
      this.setPendingStateOverrideRedirect()
    } else {
      this.setPendingState()
      this.setAllowCommits(true)
      this.wm.xConnection.flush()
    }
  }

  sendPosition({ x, y }: Point): void {
    /* We use pos_dirty to tell whether a configure message is in flight.
     * This is needed in case we send two configure events in a very
     * short time, since window->x/y is set in after a roundtrip, hence
     * we cannot just check if the current x and y are different. */
    if (this.x !== x || this.y !== y || this.positionDirty) {
      this.positionDirty = true
      this.wm.configureWindow(this.frameId, { x, y })
      if (this.shsurf?.state === SurfaceState.TOP_LEVEL || this.shsurf?.state === SurfaceState.MAXIMIZED) {
        const { x: offsetX, y: offsetY } = this.frame?.interior ?? { x: 0, y: 0 }
        this.sendConfigureNotify(x + offsetX, y + offsetY)
      }
      this.wm.xConnection.flush()
    }
  }

  configureFrame(): void {
    if (!this.frameId) {
      return
    }

    const { height, width } = this.getFrameSize()
    this.wm.configureWindow(this.frameId, { width, height })
  }

  setToplevel(): void {
    this.shsurf?.setToplevel()
    if (this.savedWidth) {
      this.width = this.savedWidth
      this.savedWidth = undefined
    }
    if (this.savedHeight) {
      this.height = this.savedHeight
      this.savedHeight = undefined
    }
    this.frame?.resizeInside(this.width, this.height)
    this.configure()
  }

  sendFullscreenConfigureNotify(): void {
    const { x, y } = this.getChildPosition()
    this.sendConfigureNotify(x, y)
  }

  sendConfigureNotify(x: number, y: number): void {
    const event = marshallConfigureNotifyEvent({
      // filled in when marshalled
      responseType: 0,
      event: this.id,
      window: this.id,
      aboveSibling: Window.None,
      x,
      y,
      width: this.width,
      height: this.height,
      borderWidth: 0,
      overrideRedirect: 0,
    })
    this.wm.xConnection.sendEvent(0, this.id, EventMask.StructureNotify, new Int8Array(event))
  }

  destroy(): void {
    if (this.configureTaskRegistration) {
      this.configureTaskRegistration()
      this.configureTaskRegistration = undefined
    }
    if (this.repaintRegistration) {
      this.repaintRegistration()
      this.repaintRegistration = undefined
    }
    // TODO destroy canvas surface?
    if (this.frameId) {
      this.wm.xConnection.reparentWindow(this.id, this.wm.wmWindow, 0, 0)
      this.wm.xConnection.destroyWindow(this.frameId)
      this.setWmState(ICCCM_WITHDRAWN_STATE)
      this.setVirtualDesktop(-1)
      delete this.wm.windowHash[this.frameId]
      this.frameId = Window.None
    }

    if (this.frame) {
      this.frame.destroy()
    }

    if (this.surfaceId) {
      this.wm.unpairedWindowList = this.wm.unpairedWindowList.filter((value) => value !== this)
    }

    if (this.surface && this.surfaceDestroyListener) {
      this.surface.resource.removeDestroyListener(this.surfaceDestroyListener)
    }

    delete this.wm.windowHash[this.id]
  }

  close(time: TIMESTAMP): void {
    if (this.deleteWindow) {
      const clientMessageEvent = marshallClientMessageEvent({
        responseType: 0,
        format: 32,
        window: this.id,
        _type: this.wm.atoms.WM_PROTOCOLS,
        data: {
          data32: new Uint32Array([this.wm.atoms.WM_DELETE_WINDOW, time]),
        },
      })
      this.wm.xConnection.sendEvent(0, this.id, EventMask.NoEvent, new Int8Array(clientMessageEvent))
    } else {
      // TODO xcb kill client equivalent
      console.error('should call kill client here')
    }
  }

  legacyFullscreen(): Output | undefined {
    const minmax = PMinSize | PMaxSize
    return this.wm.session.globals.outputs.find((output) => {
      if (output.canvas.width === this.width && output.canvas.height === this.height && this.overrideRedirect) {
        return true
      }

      let matchingSize = false
      const sizeHintsFlags = this.sizeHints?.flags ?? 0

      if (
        sizeHintsFlags & (USSize | PSize) &&
        this.sizeHints &&
        this.sizeHints.width === output.canvas.width &&
        this.sizeHints.height === output.canvas.height
      ) {
        matchingSize = true
      }

      if (
        (sizeHintsFlags & minmax) === minmax &&
        this.sizeHints &&
        this.sizeHints.minWidth === output.canvas.width &&
        this.sizeHints.minHeight === output.canvas.height &&
        this.sizeHints.maxWidth === output.canvas.width &&
        this.sizeHints.maxHeight === output.canvas.height
      ) {
        matchingSize = true
      }

      return !!(matchingSize && !this.decorate && sizeHintsFlags & (USPosition | PPosition))
    })
  }

  handleRequestFrameExtends(event: ClientMessageEvent): void {
    const windowId = event.window
    const window = this.wm.windowHash[windowId]
    window.frameExtentsHint = true
  }

  setFrameExtents(): void {
    if ((this.frameExtentsHint = true)) {
      let shadowMargin = 0
      let border = 0
      let top = 0
      if (this.frame) {
        shadowMargin = this.frame.shadowMargin
        border = this.frame.theme.borderWidth + shadowMargin
        top = this.frame.theme.titlebarHeight + shadowMargin
      }
      this.wm.xConnection.changeProperty(
        PropMode.Replace,
        this.id,
        this.wm.atoms._NET_FRAME_EXTENTS,
        Atom.CARDINAL,
        32,
        // left, right, top, bottom
        new Uint32Array([border, border, top, border]),
      )
    }
  }

  private setPendingStateOverrideRedirect() {
    /* for override-redirect windows */
    if (this.frameId !== Window.None) {
      throw new Error('Can only set pending state for windows without a parent.')
    }

    if (this.surface === undefined) {
      return
    }

    const { width, height } = this.getFrameSize()
    fini(this.surface.pendingState.opaquePixmanRegion)
    if (this.hasAlpha) {
      init(this.surface.pendingState.opaquePixmanRegion)
    } else {
      initRect(this.surface.pendingState.opaquePixmanRegion, createRect({ x: 0, y: 0 }, { width, height }))
    }
  }

  private async doRepaint() {
    this.repaintRegistration = undefined
    this.setAllowCommits(false)
    await this.readProperties()
    this.drawDecorations()
    this.setPendingState()

    this.setAllowCommits(true)
    // this.wm.xConnection.flush()
  }

  private getFrameSize(): { width: number; height: number } {
    if (this.fullscreen) {
      return { width: this.width, height: this.height }
    }

    if (this.decorate && this.frame) {
      return { width: this.frame.width, height: this.frame.height }
    }

    return {
      width: this.width + this.wm.theme.margin * 2,
      height: this.height + this.wm.theme.margin * 2,
    }
  }

  private drawDecorations() {
    let how = ''
    if (this.fullscreen) {
      how = 'fullscreen'
      /* nothing */
    } else if (this.decorate) {
      how = 'decorate'
      this.frame?.setTitle(this.name)
      this.frame?.refreshGeometry()
      if (this.blackGraphicsContext) {
        // draw  single pixel to trigger a surface commit, actual content is already on the server side
        this.wm.xConnection.polyPoint(CoordMode.Origin, this.frameId, this.blackGraphicsContext, 1, [{ x: 0, y: 0 }])
      }
    }
    this.wm.xConnection.flush()
    this.session.logger.debug(`XWindow: draw decoration, win ${this.id}, ${how}`)
  }

  private setPendingState() {
    if (this.surface === undefined) {
      return
    }

    const { width, height } = this.getFrameSize()
    const { x, y } = this.getChildPosition()

    fini(this.surface.pendingState.opaquePixmanRegion)
    if (this.hasAlpha) {
      init(this.surface.pendingState.opaquePixmanRegion)
    } else {
      /* We leave an extra pixel around the X window area to
       * make sure we don't sample from the undefined alpha
       * channel when filtering. */
      initRect(
        this.surface.pendingState.opaquePixmanRegion,
        createRect({ x: x - 1, y: y - 1 }, { width: this.width + 2, height: this.height + 2 }),
      )
    }

    let inputX: number
    let inputY: number
    let inputW: number
    let inputH: number
    if (this.decorate && !this.fullscreen && this.frame) {
      const { x, y, width, height } = this.frame?.inputRect()
      inputX = x
      inputY = y
      inputW = width
      inputH = height
    } else {
      inputX = x
      inputY = y
      inputW = width
      inputH = height
    }

    this.session.logger.debug(`XWindow: win ${this.id} geometry: ${inputX},${inputY} ${inputW}x${inputH}`)

    fini(this.surface.pendingState.inputPixmanRegion)
    initRect(
      this.surface.pendingState.inputPixmanRegion,
      createRect({ x: inputX, y: inputY }, { width: inputW, height: inputH }),
    )

    this.shsurf?.setWindowGeometry(inputX, inputY, inputW, inputH)

    if (this.name) {
      this.shsurf?.setTitle(this.name)
    }
  }

  private sendConfigure({ width, height }: Size) {
    let newWidth, newHeight
    let vborder, hborder

    if (this.decorate && !this.fullscreen) {
      hborder = 2 * this.wm.theme.borderWidth
      vborder = this.wm.theme.titlebarHeight + this.wm.theme.borderWidth
    } else {
      hborder = 0
      vborder = 0
    }

    if (width > hborder) {
      newWidth = width - hborder
    } else {
      newWidth = 1
    }

    if (height > vborder) {
      newHeight = height - vborder
    } else {
      newHeight = 1
    }

    if (this.width !== newWidth || this.height !== newHeight) {
      this.width = newWidth
      this.height = newHeight

      this.frame?.resizeInside(this.width, this.height)
    }

    if (this.configureTaskRegistration) {
      return
    }

    this.configureTaskRegistration = queueCancellableMicrotask(() => {
      this.configure()
    })
  }

  private isTypeInactive(): boolean {
    return (
      this.type === this.wm.atoms._NET_WM_WINDOW_TYPE_TOOLTIP ||
      this.type === this.wm.atoms._NET_WM_WINDOW_TYPE_DROPDOWN_MENU ||
      this.type === this.wm.atoms._NET_WM_WINDOW_TYPE_DND ||
      this.type === this.wm.atoms._NET_WM_WINDOW_TYPE_COMBO ||
      this.type === this.wm.atoms._NET_WM_WINDOW_TYPE_POPUP_MENU ||
      this.type === this.wm.atoms._NET_WM_WINDOW_TYPE_UTILITY
    )
  }

  private isPositioned() {
    if (this.mapRequestX === Number.MIN_SAFE_INTEGER || this.mapRequestY === Number.MIN_SAFE_INTEGER) {
      this.session.logger.debug(`XWindow warning: win ${this.id} did not see map request`)
    }
    return this.mapRequestX !== 0 || this.mapRequestY !== 0
  }

  private configure() {
    if (this.configureTaskRegistration) {
      this.configureTaskRegistration()
      this.configureTaskRegistration = undefined
    }
    this.setAllowCommits(false)

    const { x, y } = this.getChildPosition()
    this.wm.configureWindow(this.id, {
      x,
      y,
      width: this.width,
      height: this.height,
    })

    this.configureFrame()
    this.scheduleRepaint()
  }
}
