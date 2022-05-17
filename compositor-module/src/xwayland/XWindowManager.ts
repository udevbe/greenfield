import { Client, WlPointerButtonState } from 'westfield-runtime-server'
import {
  ATOM,
  Atom,
  ButtonPressEvent,
  ButtonReleaseEvent,
  chars,
  ClientMessageEvent,
  ColormapAlloc,
  Composite,
  ConfigureNotifyEvent,
  ConfigureRequestEvent,
  ConfigWindow,
  CreateNotifyEvent,
  Cursor,
  DestroyNotifyEvent,
  EnterNotifyEvent,
  EventMask,
  FocusInEvent,
  getComposite,
  GetPropertyReply,
  GetPropertyType,
  getRender,
  getXFixes,
  ImageFormat,
  InputFocus,
  LeaveNotifyEvent,
  MapNotifyEvent,
  MapRequestEvent,
  marshallClientMessageEvent,
  marshallSelectionNotifyEvent,
  MotionNotifyEvent,
  NotifyDetail,
  NotifyMode,
  Property,
  PropertyNotifyEvent,
  PropMode,
  Render,
  ReparentNotifyEvent,
  SCREEN,
  SelectionNotifyEvent,
  SelectionRequestEvent,
  StackMode,
  Time,
  UnmapNotifyEvent,
  unmarshallButtonPressEvent,
  unmarshallButtonReleaseEvent,
  unmarshallClientMessageEvent,
  unmarshallConfigureNotifyEvent,
  unmarshallConfigureRequestEvent,
  unmarshallCreateNotifyEvent,
  unmarshallDestroyNotifyEvent,
  unmarshallEnterNotifyEvent,
  unmarshallFocusInEvent,
  unmarshallLeaveNotifyEvent,
  unmarshallMapNotifyEvent,
  unmarshallMapRequestEvent,
  unmarshallMotionNotifyEvent,
  unmarshallPropertyNotifyEvent,
  unmarshallReparentNotifyEvent,
  unmarshallSelectionNotifyEvent,
  unmarshallSelectionRequestEvent,
  unmarshallUnmapNotifyEvent,
  WINDOW,
  Window,
  WindowClass,
  XConnection,
  XFixes,
} from 'xtsb'
import eResize from '../assets/e-resize.png'
import leftPtr from '../assets/left_ptr.png'
import nResize from '../assets/n-resize.png'
import neResize from '../assets/ne-resize.png'
import nwResize from '../assets/nw-resize.png'
import sResize from '../assets/s-resize.png'
import seResize from '../assets/se-resize.png'
import swResize from '../assets/sw-resize.png'
import wResize from '../assets/w-resize.png'
import Session from '../Session'
import Surface from '../Surface'
import { CursorType } from './CursorType'
import { ICCCM_NORMAL_STATE, ICCCM_WITHDRAWN_STATE, SEND_EVENT_MASK } from './XConstants'
import XWaylandShell from './XWaylandShell'
import XWaylandShellSurface from './XWaylandShellSurface'
import { XWindow } from './XWindow'
import { FrameFlag, FrameStatus, themeCreate, ThemeLocation, XWindowTheme } from './XWindowFrame'
import { XWindowManagerConnection } from './XWindowManagerConnection'
import { createXDataSource, XDataSource } from './XDataSource'
import { GWebFD } from '../WebFS'
import { createXDnDDataSource, XDnDDataSource } from './XDnDDataSource'

type ConfigureValueList = Parameters<XConnection['configureWindow']>[1]

type NamedAtom = [name: string, value: number]

type XWMAtoms = {
  WM_PROTOCOLS: number
  WM_NORMAL_HINTS: number
  WM_TAKE_FOCUS: number
  WM_DELETE_WINDOW: number
  WM_STATE: number
  WM_S0: number
  WM_CLIENT_MACHINE: number
  _NET_WM_CM_S0: number
  _NET_WM_NAME: number
  _NET_WM_PID: number
  _NET_WM_ICON: number
  _NET_WM_STATE: number
  _NET_WM_STATE_MAXIMIZED_VERT: number
  _NET_WM_STATE_MAXIMIZED_HORZ: number
  _NET_WM_STATE_FULLSCREEN: number
  _NET_WM_STATE_FOCUSED: number
  _NET_WM_USER_TIME: number
  _NET_WM_ICON_NAME: number
  _NET_WM_DESKTOP: number
  _NET_WM_WINDOW_TYPE: number

  _NET_WM_WINDOW_TYPE_DESKTOP: number
  _NET_WM_WINDOW_TYPE_DOCK: number
  _NET_WM_WINDOW_TYPE_TOOLBAR: number
  _NET_WM_WINDOW_TYPE_MENU: number
  _NET_WM_WINDOW_TYPE_UTILITY: number
  _NET_WM_WINDOW_TYPE_SPLASH: number
  _NET_WM_WINDOW_TYPE_DIALOG: number
  _NET_WM_WINDOW_TYPE_DROPDOWN_MENU: number
  _NET_WM_WINDOW_TYPE_POPUP_MENU: number
  _NET_WM_WINDOW_TYPE_TOOLTIP: number
  _NET_WM_WINDOW_TYPE_NOTIFICATION: number
  _NET_WM_WINDOW_TYPE_COMBO: number
  _NET_WM_WINDOW_TYPE_DND: number
  _NET_WM_WINDOW_TYPE_NORMAL: number

  _NET_WM_MOVERESIZE: number
  _NET_SUPPORTING_WM_CHECK: number
  _NET_SUPPORTED: number
  _NET_ACTIVE_WINDOW: number
  _MOTIF_WM_HINTS: number
  CLIPBOARD: number
  CLIPBOARD_MANAGER: number
  TARGETS: number
  UTF8_STRING: number
  _WL_SELECTION: number
  INCR: number
  TIMESTAMP: number
  MULTIPLE: number
  COMPOUND_TEXT: number
  TEXT: number
  STRING: number
  'text/plain;charset=utf-8': number
  'text/plain': number
  XdndSelection: number
  XdndAware: number
  XdndEnter: number
  XdndLeave: number
  XdndDrop: number
  XdndStatus: number
  XdndFinished: number
  XdndTypeList: number
  XdndActionCopy: number
  _XWAYLAND_ALLOW_COMMITS: number
  WL_SURFACE_ID: number
  _NET_REQUEST_FRAME_EXTENTS: number
  _NET_FRAME_EXTENTS: number
  _NET_WORKAREA: number
  _NET_DESKTOP_GEOMETRY: number
  _NET_DESKTOP_VIEWPORT: number
  _NET_CURRENT_DESKTOP: number
  WM_HINTS: number
}

interface XWindowManagerResources {
  xFixes: XFixes.XFixes
  composite: Composite.Composite
  render: Render.Render
  xwmAtoms: XWMAtoms
  formatRgb: Render.PICTFORMINFO
  formatRgba: Render.PICTFORMINFO
}

interface VisualAndColormap {
  visualId: number
  colormap: number
}

const cursorImageNames = {
  [CursorType.XWM_CURSOR_BOTTOM]: { url: sResize, xhot: 15, yhot: 27, width: 32, height: 32 },
  [CursorType.XWM_CURSOR_LEFT_PTR]: { url: leftPtr, xhot: 3, yhot: 2, width: 32, height: 32 },
  [CursorType.XWM_CURSOR_BOTTOM_LEFT]: { url: swResize, xhot: 6, yhot: 27, width: 32, height: 32 },
  [CursorType.XWM_CURSOR_BOTTOM_RIGHT]: {
    url: seResize,
    xhot: 27,
    yhot: 27,
    width: 32,
    height: 32,
  },
  [CursorType.XWM_CURSOR_LEFT]: { url: wResize, xhot: 6, yhot: 15, width: 32, height: 32 },
  [CursorType.XWM_CURSOR_RIGHT]: { url: eResize, xhot: 27, yhot: 15, width: 32, height: 32 },
  [CursorType.XWM_CURSOR_TOP]: { url: nResize, xhot: 16, yhot: 6, width: 32, height: 32 },
  [CursorType.XWM_CURSOR_TOP_LEFT]: { url: nwResize, xhot: 6, yhot: 6, width: 32, height: 32 },
  [CursorType.XWM_CURSOR_TOP_RIGHT]: { url: neResize, xhot: 27, yhot: 6, width: 32, height: 32 },
} as const

const INCR_CHUNK_SIZE = 65536

async function setupResources(xConnection: XConnection): Promise<XWindowManagerResources> {
  const xFixesPromise = getXFixes(xConnection)
  const compositePromise = getComposite(xConnection)
  const renderPromise = getRender(xConnection)

  const atoms: NamedAtom[] = [
    ['WM_PROTOCOLS', 0],
    ['WM_NORMAL_HINTS', 0],
    ['WM_TAKE_FOCUS', 0],
    ['WM_DELETE_WINDOW', 0],
    ['WM_STATE', 0],
    ['WM_S0', 0],
    ['WM_CLIENT_MACHINE', 0],
    ['_NET_WM_CM_S0', 0],
    ['_NET_WM_NAME', 0],
    ['_NET_WM_PID', 0],
    ['_NET_WM_ICON', 0],
    ['_NET_WM_STATE', 0],
    ['_NET_WM_STATE_MAXIMIZED_VERT', 0],
    ['_NET_WM_STATE_MAXIMIZED_HORZ', 0],
    ['_NET_WM_STATE_FULLSCREEN', 0],
    ['_NET_WM_STATE_FOCUSED', 0],
    ['_NET_WM_USER_TIME', 0],
    ['_NET_WM_ICON_NAME', 0],
    ['_NET_WM_DESKTOP', 0],
    ['_NET_WM_WINDOW_TYPE', 0],

    ['_NET_WM_WINDOW_TYPE_DESKTOP', 0],
    ['_NET_WM_WINDOW_TYPE_DOCK', 0],
    ['_NET_WM_WINDOW_TYPE_TOOLBAR', 0],
    ['_NET_WM_WINDOW_TYPE_MENU', 0],
    ['_NET_WM_WINDOW_TYPE_UTILITY', 0],
    ['_NET_WM_WINDOW_TYPE_SPLASH', 0],
    ['_NET_WM_WINDOW_TYPE_DIALOG', 0],
    ['_NET_WM_WINDOW_TYPE_DROPDOWN_MENU', 0],
    ['_NET_WM_WINDOW_TYPE_POPUP_MENU', 0],
    ['_NET_WM_WINDOW_TYPE_TOOLTIP', 0],
    ['_NET_WM_WINDOW_TYPE_NOTIFICATION', 0],
    ['_NET_WM_WINDOW_TYPE_COMBO', 0],
    ['_NET_WM_WINDOW_TYPE_DND', 0],
    ['_NET_WM_WINDOW_TYPE_NORMAL', 0],

    ['_NET_WM_MOVERESIZE', 0],
    ['_NET_SUPPORTING_WM_CHECK', 0],
    ['_NET_SUPPORTED', 0],
    ['_NET_ACTIVE_WINDOW', 0],
    ['_MOTIF_WM_HINTS', 0],
    ['CLIPBOARD', 0],
    ['CLIPBOARD_MANAGER', 0],
    ['TARGETS', 0],
    ['UTF8_STRING', 0],
    ['_WL_SELECTION', 0],
    ['INCR', 0],
    ['TIMESTAMP', 0],
    ['MULTIPLE', 0],
    ['COMPOUND_TEXT', 0],
    ['TEXT', 0],
    ['STRING', 0],
    ['text/plain;charset=utf-8', 0],
    ['text/plain', 0],
    ['XdndSelection', 0],
    ['XdndAware', 0],
    ['XdndEnter', 0],
    ['XdndLeave', 0],
    ['XdndDrop', 0],
    ['XdndStatus', 0],
    ['XdndFinished', 0],
    ['XdndTypeList', 0],
    ['XdndActionCopy', 0],
    ['_XWAYLAND_ALLOW_COMMITS', 0],
    ['WL_SURFACE_ID', 0],
    ['_NET_REQUEST_FRAME_EXTENTS', 0],
    ['_NET_FRAME_EXTENTS', 0],
    ['_NET_WORKAREA', 0],
    ['_NET_DESKTOP_GEOMETRY', 0],
    ['_NET_DESKTOP_VIEWPORT', 0],
    ['_NET_SUPPORTED', 0],
    ['_NET_CURRENT_DESKTOP', 0],
    ['WM_HINTS', 0],
  ]

  const [xFixes, composite, render] = await Promise.all([xFixesPromise, compositePromise, renderPromise] as const)
  const xFixesVersionReply = xFixes.queryVersion(XFixes.XFixes.MAJOR_VERSION, XFixes.XFixes.MINOR_VERSION)
  const compositeVersionReply = composite.queryVersion(
    Composite.Composite.MAJOR_VERSION,
    Composite.Composite.MINOR_VERSION,
  )
  const renderVersionReply = render.queryVersion(Render.Render.MAJOR_VERSION, Render.Render.MINOR_VERSION)

  const [xFixesVersion, compositeVersion, renderVersion] = await Promise.all([
    xFixesVersionReply,
    compositeVersionReply,
    renderVersionReply,
  ])
  if (xFixesVersion.majorVersion < XFixes.XFixes.MAJOR_VERSION) {
    throw new Error(
      `XWayland does not support XFixes extension with major version ${XFixes.XFixes.MAJOR_VERSION}, server returned version ${xFixesVersion.majorVersion}`,
    )
  }
  if (compositeVersion.majorVersion < Composite.Composite.MAJOR_VERSION) {
    throw new Error(
      `XWayland does not support Composite extension with major version ${Composite.Composite.MAJOR_VERSION}, server returned version ${compositeVersion.majorVersion}`,
    )
  }
  if (renderVersion.majorVersion < Render.Render.MAJOR_VERSION) {
    throw new Error(
      `XWayland does not support Render extension with major version ${Render.Render.MAJOR_VERSION}, server returned version ${renderVersion.majorVersion}`,
    )
  }

  const formatsReply = render.queryPictFormats()
  const interAtomCookies = atoms.map(([name]) => xConnection.internAtom(0, chars(name)))

  const atomReplies = await Promise.all(interAtomCookies)
  atomReplies.forEach(({ atom }, index) => (atoms[index][1] = atom))

  const { formats } = await formatsReply
  let formatRgb: Render.PICTFORMINFO | undefined = undefined
  let formatRgba: Render.PICTFORMINFO | undefined = undefined
  formats.forEach((format) => {
    if (format.direct.redMask != 0xff && format.direct.redShift != 16) {
      return
    }
    if (format._type == Render.PictType.Direct && format.depth == 24) {
      formatRgb = format
    }
    if (
      format._type == Render.PictType.Direct &&
      format.depth == 32 &&
      format.direct.alphaMask == 0xff &&
      format.direct.alphaShift == 24
    ) {
      formatRgba = format
    }
  })

  if (formatRgb === undefined) {
    throw new Error('no direct RGB picture format found.')
  }
  if (formatRgba === undefined) {
    throw new Error('no direct RGBA picture format found.')
  }

  const xwmAtoms: XWMAtoms = Object.fromEntries(atoms) as XWMAtoms

  return {
    xFixes,
    composite,
    render,
    xwmAtoms,
    formatRgb,
    formatRgba,
  }
}

function setupVisualAndColormap(xConnection: XConnection): VisualAndColormap {
  const visuals = xConnection.setup.roots.map((screen) => {
    const depth = screen.allowedDepths.find((depth) => depth.depth === 32)
    return depth?.visuals
  })?.[0]

  if (visuals === undefined) {
    throw new Error('no 32 bit visualtype\n')
  }
  const visualId = visuals[0].visualId

  const colormap = xConnection.allocateID()
  xConnection.createColormap(ColormapAlloc.None, colormap, xConnection.setup.roots[0].root, visualId)

  return {
    visualId,
    colormap,
  }
}

function getCursorForLocation(location: ThemeLocation | undefined): CursorType {
  switch (location) {
    case ThemeLocation.THEME_LOCATION_RESIZING_TOP:
      return CursorType.XWM_CURSOR_TOP
    case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM:
      return CursorType.XWM_CURSOR_BOTTOM
    case ThemeLocation.THEME_LOCATION_RESIZING_LEFT:
      return CursorType.XWM_CURSOR_LEFT
    case ThemeLocation.THEME_LOCATION_RESIZING_RIGHT:
      return CursorType.XWM_CURSOR_RIGHT
    case ThemeLocation.THEME_LOCATION_RESIZING_TOP_LEFT:
      return CursorType.XWM_CURSOR_TOP_LEFT
    case ThemeLocation.THEME_LOCATION_RESIZING_TOP_RIGHT:
      return CursorType.XWM_CURSOR_TOP_RIGHT
    case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_LEFT:
      return CursorType.XWM_CURSOR_BOTTOM_LEFT
    case ThemeLocation.THEME_LOCATION_RESIZING_BOTTOM_RIGHT:
      return CursorType.XWM_CURSOR_BOTTOM_RIGHT
    case ThemeLocation.THEME_LOCATION_EXTERIOR:
    case ThemeLocation.THEME_LOCATION_TITLEBAR:
    default:
      return CursorType.XWM_CURSOR_LEFT_PTR
  }
}

function setNetSupported(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms) {
  // An immediately invoked lambda that uses function argument destructuring to filter out elements and return them as an array.
  const supported = (({
    _NET_WM_MOVERESIZE,
    _NET_WM_STATE,
    _NET_WM_STATE_FULLSCREEN,
    _NET_WM_STATE_MAXIMIZED_VERT,
    _NET_WM_STATE_MAXIMIZED_HORZ,
    _NET_ACTIVE_WINDOW,
  }: XWMAtoms) => [
    _NET_WM_MOVERESIZE,
    _NET_WM_STATE,
    _NET_WM_STATE_FULLSCREEN,
    _NET_WM_STATE_MAXIMIZED_VERT,
    _NET_WM_STATE_MAXIMIZED_HORZ,
    _NET_ACTIVE_WINDOW,
  ])(xwmAtoms)

  xConnection.changeProperty(
    PropMode.Replace,
    xConnection.setup.roots[0].root,
    xwmAtoms._NET_SUPPORTED,
    Atom.ATOM,
    32,
    new Uint32Array(supported),
  )
}

export function setNetActiveWindow(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms, window: WINDOW): void {
  xConnection.changeProperty(
    PropMode.Replace,
    screen.root,
    xwmAtoms._NET_ACTIVE_WINDOW,
    Atom.WINDOW,
    32,
    new Uint32Array([window]),
  )
}

function setNetWorkArea(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms) {
  const width = screen.widthInPixels
  const height = screen.heightInPixels
  xConnection.changeProperty(
    PropMode.Replace,
    screen.root,
    xwmAtoms._NET_WORKAREA,
    Atom.CARDINAL,
    32,
    new Uint32Array([0, 0, width, height]),
  )
}

function setNetDesktopViewport(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms) {
  xConnection.changeProperty(
    PropMode.Replace,
    screen.root,
    xwmAtoms._NET_DESKTOP_VIEWPORT,
    Atom.CARDINAL,
    32,
    // From EWMH: For Window Managers that don't support large desktops, this MUST always be set to (0,0).
    // https://specifications.freedesktop.org/wm-spec/1.3/ar01s03.html
    new Uint32Array([0, 0]),
  )
}

function setNetCurrentDesktop(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms) {
  xConnection.changeProperty(
    PropMode.Replace,
    screen.root,
    xwmAtoms._NET_CURRENT_DESKTOP,
    Atom.CARDINAL,
    32,
    new Uint32Array([0]),
  )
}

function setNetSupportingWmCheck(
  xConnection: XConnection,
  screen: SCREEN,
  xwmAtoms: XWMAtoms,
  wmWindow: number,
  compositorName: string,
) {
  xConnection.changeProperty(
    PropMode.Replace,
    wmWindow,
    xwmAtoms._NET_SUPPORTING_WM_CHECK,
    Atom.WINDOW,
    32,
    new Uint32Array([wmWindow]),
  )

  xConnection.changeProperty(
    PropMode.Replace,
    wmWindow,
    xwmAtoms._NET_WM_NAME,
    xwmAtoms.UTF8_STRING,
    8,
    chars(compositorName),
  )

  xConnection.changeProperty(
    PropMode.Replace,
    screen.root,
    xwmAtoms._NET_SUPPORTING_WM_CHECK,
    Atom.WINDOW,
    32,
    new Uint32Array([wmWindow]),
  )
}

function createWMWindow(xConnection: XConnection, screen: SCREEN, xwmAtoms: XWMAtoms): number {
  const wmWindow = xConnection.allocateID()
  xConnection.createWindow(
    WindowClass.CopyFromParent,
    wmWindow,
    screen.root,
    0,
    0,
    10,
    10,
    0,
    WindowClass.InputOutput,
    screen.rootVisual,
    {},
  )

  xConnection.setSelectionOwner(wmWindow, xwmAtoms.WM_S0, Time.CurrentTime)
  xConnection.setSelectionOwner(wmWindow, xwmAtoms._NET_WM_CM_S0, Time.CurrentTime)

  return wmWindow
}

export class XWindowManager {
  readonly windowHash: { [key: number]: XWindow } = {}
  focusWindow?: XWindow
  readonly atoms: XWMAtoms
  readonly visualId: number
  readonly colormap: number
  unpairedWindowList: XWindow[] = []
  readonly theme: XWindowTheme = themeCreate()
  private incr = false
  private readonly composite: Composite.Composite
  private readonly render: Render.Render
  private readonly formatRgb: Render.PICTFORMINFO
  private readonly formatRgba: Render.PICTFORMINFO
  private readonly imageDecodingCanvas: HTMLCanvasElement = document.createElement('canvas')
  private readonly imageDecodingContext: CanvasRenderingContext2D = this.imageDecodingCanvas.getContext('2d', {
    alpha: true,
    desynchronized: true,
  })!
  private cursors: { [key in CursorType]: Cursor } = {
    [CursorType.XWM_CURSOR_BOTTOM]: Cursor.None,
    [CursorType.XWM_CURSOR_LEFT_PTR]: Cursor.None,
    [CursorType.XWM_CURSOR_BOTTOM_LEFT]: Cursor.None,
    [CursorType.XWM_CURSOR_BOTTOM_RIGHT]: Cursor.None,
    [CursorType.XWM_CURSOR_LEFT]: Cursor.None,
    [CursorType.XWM_CURSOR_RIGHT]: Cursor.None,
    [CursorType.XWM_CURSOR_TOP]: Cursor.None,
    [CursorType.XWM_CURSOR_TOP_LEFT]: Cursor.None,
    [CursorType.XWM_CURSOR_TOP_RIGHT]: Cursor.None,
  }
  private lastCursor: CursorType = -1
  private doubleClickPeriod = 250
  // c/p related state
  private readonly xFixes: XFixes.XFixes
  private selectionRequest: SelectionRequestEvent = {
    responseType: 0,
    time: Time.CurrentTime,
    owner: Window.None,
    requestor: Window.None,
    selection: Atom.None,
    target: Atom.None,
    property: Atom.None,
  }
  private selectionOwner?: WINDOW
  private selectionTimestamp = 0
  private selectionTarget = Atom.None
  dataSourceFd?: GWebFD
  private selectionPropertySet = false
  private flushPropertyOnDelete = false
  private sourceData?: Uint8Array

  constructor(
    public readonly session: Session,
    public readonly xConnection: XConnection,
    public readonly client: Client,
    public readonly xWaylandShell: XWaylandShell,
    public readonly screen: SCREEN,
    { xwmAtoms, composite, render, xFixes, formatRgb, formatRgba }: XWindowManagerResources,
    { visualId, colormap }: VisualAndColormap,
    public readonly wmWindow: WINDOW,
    readonly selectionWindow: WINDOW,
    readonly dndWindow: WINDOW,
  ) {
    this.atoms = xwmAtoms
    this.composite = composite
    this.render = render
    this.xFixes = xFixes
    this.formatRgb = formatRgb
    this.formatRgba = formatRgba
    this.visualId = visualId
    this.colormap = colormap
    this.imageDecodingContext.imageSmoothingEnabled = false
  }

  static async create(
    session: Session,
    xWaylandConnetion: XWindowManagerConnection,
    client: Client,
    xWaylandShell: XWaylandShell,
  ): Promise<XWindowManager> {
    const xConnection = await xWaylandConnetion.setup()
    xConnection.defaultExceptionHandler = (error: Error) => console.error(JSON.stringify(error))
    const xWmResources = await setupResources(xConnection)

    const { composite, xwmAtoms } = xWmResources
    composite.redirectSubwindows(xConnection.setup.roots[0].root, Composite.Redirect.Manual)

    const selectionWindow = xConnection.allocateID()
    const dndWindow = xConnection.allocateID()
    const wmWindow = createWMWindow(xConnection, xConnection.setup.roots[0], xwmAtoms)
    const visualAndColormap = setupVisualAndColormap(xConnection)
    const xWindowManager = new XWindowManager(
      session,
      xConnection,
      client,
      xWaylandShell,
      xConnection.setup.roots[0],
      xWmResources,
      visualAndColormap,
      wmWindow,
      selectionWindow,
      dndWindow,
    )
    xConnection.handleEvent = async (eventType, eventSequenceNumber, rawEvent) => {
      if (await xWindowManager.handleSelectionEvent(eventType, rawEvent)) {
        return
      }

      if (await xWindowManager.handleDndEvent(eventType, rawEvent)) {
        return
      }

      // TODO dnd event see window-manager.c L2270
      switch (eventType) {
        case ButtonPressEvent:
          xWindowManager.handleButton(unmarshallButtonPressEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case ButtonReleaseEvent:
          xWindowManager.handleButton(unmarshallButtonReleaseEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case EnterNotifyEvent:
          xWindowManager.handleEnter(unmarshallEnterNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case LeaveNotifyEvent:
          xWindowManager.handleLeave(unmarshallLeaveNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case MotionNotifyEvent:
          xWindowManager.handleMotion(unmarshallMotionNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case CreateNotifyEvent:
          return xWindowManager.handleCreateNotify(
            unmarshallCreateNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value,
          )
        case MapRequestEvent:
          return xWindowManager.handleMapRequest(unmarshallMapRequestEvent(rawEvent.buffer, rawEvent.byteOffset).value)
        case MapNotifyEvent:
          xWindowManager.handleMapNotify(unmarshallMapNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case UnmapNotifyEvent:
          xWindowManager.handleUnmapNotify(unmarshallUnmapNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case ReparentNotifyEvent:
          return xWindowManager.handleReparentNotify(
            unmarshallReparentNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value,
          )
        case ConfigureRequestEvent:
          xWindowManager.handleConfigureRequest(
            unmarshallConfigureRequestEvent(rawEvent.buffer, rawEvent.byteOffset).value,
          )
          break
        case ConfigureNotifyEvent:
          xWindowManager.handleConfigureNotify(
            unmarshallConfigureNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value,
          )
          break
        case DestroyNotifyEvent:
          xWindowManager.handleDestroyNotify(unmarshallDestroyNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case PropertyNotifyEvent:
          xWindowManager.handlePropertyNotify(unmarshallPropertyNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
        case ClientMessageEvent:
          return xWindowManager.handleClientMessage(
            unmarshallClientMessageEvent(rawEvent.buffer, rawEvent.byteOffset).value,
          )
        case FocusInEvent:
          xWindowManager.handleFocusIn(unmarshallFocusInEvent(rawEvent.buffer, rawEvent.byteOffset).value)
          break
      }
    }
    xConnection.onPostEventLoop = () => xConnection.flush()

    xConnection.changeWindowAttributes(xConnection.setup.roots[0].root, {
      eventMask: EventMask.SubstructureNotify | EventMask.SubstructureRedirect | EventMask.PropertyChange,
    })
    xConnection.changeProperty(
      PropMode.Replace,
      xConnection.setup.roots[0].root,
      xwmAtoms._NET_SUPPORTED,
      Atom.ATOM,
      32,
      new Uint32Array([
        xwmAtoms._NET_WM_MOVERESIZE,
        xwmAtoms._NET_WM_STATE,
        xwmAtoms._NET_WM_STATE_FULLSCREEN,
        xwmAtoms._NET_WM_STATE_MAXIMIZED_VERT,
        xwmAtoms._NET_WM_STATE_MAXIMIZED_HORZ,
        xwmAtoms._NET_ACTIVE_WINDOW,
      ]),
    )

    xWindowManager.setNetActiveWindow(Window.None)
    xWindowManager.selectionInit()
    xWindowManager.dndInit()

    await xWindowManager.createCursors()
    xWindowManager.wmWindowSetCursor(xWindowManager.screen.root, CursorType.XWM_CURSOR_LEFT_PTR)

    session.globals.compositor.addSurfaceCreationListener((surface) => xWindowManager.handleCreateSurface(surface))

    // EWMH hints
    setNetSupported(xConnection, xConnection.setup.roots[0], xwmAtoms)
    setNetDesktopViewport(xConnection, xConnection.setup.roots[0], xwmAtoms)
    setNetCurrentDesktop(xConnection, xConnection.setup.roots[0], xwmAtoms)
    setNetWorkArea(xConnection, xConnection.setup.roots[0], xwmAtoms)
    setNetActiveWindow(xConnection, xConnection.setup.roots[0], xwmAtoms, Window.None)
    setNetSupportingWmCheck(xConnection, xConnection.setup.roots[0], xwmAtoms, wmWindow, 'Greenfield')

    // FIXME this makes xterm close somehow
    session.globals.seat.activationListeners.push((surface) => xWindowManager.activate(surface))

    xConnection.flush()
    return xWindowManager
  }

  lookupXWindow(window: WINDOW): XWindow | undefined {
    return this.windowHash[window]
  }

  configureWindow(id: WINDOW, valueList: ConfigureValueList): void {
    this.xConnection.configureWindow(id, valueList)
  }

  private async createCursors() {
    await Promise.all(
      Object.entries(cursorImageNames).map(
        // @ts-ignore
        async ([name, cursorImage]) => (this.cursors[name] = await this.loadCursor(cursorImage)),
      ),
    )
    this.lastCursor = -1
  }

  private async handleCreateSurface(surface: Surface) {
    if (surface.resource.client !== this.client) {
      return
    }

    this.session.logger.debug(`XWM: create surface ${surface.resource.id}@${surface.resource.client.id}`, surface)

    const window = this.unpairedWindowList.find((window) => window.surfaceId === surface.resource.id)
    if (window) {
      await window.xServerMapShellSurface(surface)
      window.surfaceId = 0
      this.unpairedWindowList = this.unpairedWindowList.filter((value) => value !== window)
    }
  }

  private setNetActiveWindow(window: Window) {
    this.xConnection.changeProperty(
      PropMode.Replace,
      this.screen.root,
      this.atoms._NET_ACTIVE_WINDOW,
      Atom.WINDOW,
      32,
      new Uint32Array([window]),
    )
  }

  private handleButton(event: ButtonPressEvent | ButtonReleaseEvent) {
    // TODO we want event codes from xtsb
    const buttonPress = 4
    this.session.logger.debug(
      `XCB_BUTTON_${event.responseType === buttonPress ? 'PRESS' : 'RELEASE'} (detail ${event.detail})`,
    )

    const window = this.lookupXWindow(event.event)

    if (window === undefined || !window.decorate) {
      return
    }

    if (event.detail !== 1 && event.detail !== 2) {
      return
    }

    const pointer = this.session.globals.seat.pointer

    const buttonState =
      event.responseType === buttonPress ? WlPointerButtonState.pressed : WlPointerButtonState.released

    // TODO constants from input.h ?
    const buttonId = event.detail === 1 ? 0x110 : 0x111

    let doubleClick = false
    if (buttonState === WlPointerButtonState.pressed) {
      if (event.time - window.lastButtonTime <= this.doubleClickPeriod) {
        doubleClick = true
        window.didDouble = true
      } else {
        window.didDouble = false
      }
    } else if (window.didDouble) {
      doubleClick = true
      window.didDouble = false
    }

    const windowFrame = window.frame
    if (windowFrame === undefined) {
      console.error('BUG. No window frame.')
      return
    }

    /* Make sure we're looking at the right location.  The frame
     * could have received a motion event from a pointer from a
     * different wl_seat, but under X it looks like our core
     * pointer moved.  Move the frame pointer to the button press
     * location before deciding what to do. */
    const location: ThemeLocation = doubleClick
      ? windowFrame.doubleClick(undefined, buttonId, buttonState)
      : windowFrame.pointerButton(undefined, buttonId, buttonState)

    const windowFrameStatus = windowFrame.status
    if (windowFrameStatus & FrameStatus.FRAME_STATUS_REPAINT) {
      window.scheduleRepaint()
    }

    if (windowFrameStatus & FrameStatus.FRAME_STATUS_MOVE) {
      window.shsurf?.move(pointer)
      windowFrame.statusClear(FrameStatus.FRAME_STATUS_MOVE)
    }

    if (windowFrameStatus & FrameStatus.FRAME_STATUS_RESIZE) {
      window.shsurf?.resize(pointer, location)
      windowFrame.statusClear(FrameStatus.FRAME_STATUS_RESIZE)
    }

    if (windowFrameStatus & FrameStatus.FRAME_STATUS_CLOSE) {
      window.close(event.time)
      windowFrame.statusClear(FrameStatus.FRAME_STATUS_CLOSE)
    }

    if (windowFrameStatus & FrameStatus.FRAME_STATUS_MAXIMIZE) {
      window.maximizedHorizontal = !window.maximizedHorizontal
      window.maximizedVertical = !window.maximizedVertical
      if (window.isMaximized()) {
        window.savedWidth = window.width
        window.savedHeight = window.height
        window.frame?.setFlag(FrameFlag.FRAME_FLAG_MAXIMIZED)
        window.shsurf?.setMaximized()
      } else {
        window.frame?.unsetFlag(FrameFlag.FRAME_FLAG_MAXIMIZED)
        window.maximizedHorizontal = false
        window.maximizedVertical = false
        window.setToplevel()
      }
      windowFrame.statusClear(FrameStatus.FRAME_STATUS_MAXIMIZE)
      window.setNetWmState()
    }
  }

  private handleEnter(event: EnterNotifyEvent) {
    const window = this.lookupXWindow(event.event)

    if (window === undefined || !window.decorate) {
      return
    }

    const location = window.frame?.pointerEnter(undefined, event.eventX, event.eventY)
    if (window.frame?.status && window.frame.status & FrameStatus.FRAME_STATUS_REPAINT) {
      window.scheduleRepaint()
    }

    const cursor = getCursorForLocation(location)
    this.wmWindowSetCursor(window.frameId, cursor)
  }

  private handleLeave(event: LeaveNotifyEvent) {
    const window = this.lookupXWindow(event.event)

    if (window === undefined || !window.decorate) {
      return
    }

    window.frame?.pointerLeave(undefined)
    if (window.frame?.status && window.frame?.status & FrameStatus.FRAME_STATUS_REPAINT) {
      window.scheduleRepaint()
    }

    this.wmWindowSetCursor(window.frameId, CursorType.XWM_CURSOR_LEFT_PTR)
  }

  private handleMotion(event: MotionNotifyEvent) {
    const window = this.lookupXWindow(event.event)

    if (window === undefined || !window.decorate) {
      return
    }

    const location = window.frame?.pointerMotion(undefined, event.eventX, event.eventY)
    if (window.frame?.status && window.frame?.status & FrameStatus.FRAME_STATUS_REPAINT) {
      window.scheduleRepaint()
    }

    const cursor = getCursorForLocation(location)
    this.wmWindowSetCursor(window.frameId, cursor)
  }

  private async handleCreateNotify(event: CreateNotifyEvent) {
    this.session.logger.debug(
      `XCB_CREATE_NOTIFY (window ${event.window}, at (${event.x}, ${event.y}), width ${event.width}, height ${
        event.height
      }${event.overrideRedirect ? 'override' : ''}${this.isOurResource(event.window) ? ', ours' : ''})`,
    )
    if (this.isOurResource(event.window)) {
      return
    }

    await this.createXWindow(event.window, event.width, event.height, event.x, event.y, event.overrideRedirect)
  }

  private async handleMapRequest(event: MapRequestEvent) {
    if (this.isOurResource(event.window)) {
      this.session.logger.debug(`XCB_MAP_REQUEST (window ${event.window}, ours)`)
      return
    }

    const window = this.lookupXWindow(event.window)
    if (window === undefined) {
      return
    }

    await window.readProperties()

    /* For a new Window, MapRequest happens before the Window is realized
     * in Xwayland. We do the real xcb_map_window() here as a response to
     * MapRequest. The Window will get realized (wl_surface created in
     * Wayland and WL_SURFACE_ID sent in X11) when it has been mapped for
     * real.
     *
     * MapRequest only happens for (X11) unmapped Windows. On UnmapNotify,
     * we reset shsurf to NULL, so even if X11 connection races far ahead
     * of the Wayland connection and the X11 client is repeatedly mapping
     * and unmapping, we will never have shsurf set on MapRequest.
     */
    if (window.shsurf !== undefined) {
      throw new Error('Assertion failed. X window should not have a shell surface on map request.')
    }

    window.mapRequestX = window.x
    window.mapRequestY = window.y

    if (window.frameId === Window.None) {
      await window.createFrame() /* sets frame_id */
    }
    if (window.frameId === Window.None) {
      throw new Error('Assertion failed. X window should have a parent window.')
    }

    this.session.logger.debug(
      `XCB_MAP_REQUEST (window ${window.id}, frame ${window.frameId}, ${window.width}x${window.height} @ ${window.mapRequestX},${window.mapRequestY})`,
    )

    window.setAllowCommits(false)
    window.setWmState(ICCCM_NORMAL_STATE)
    window.setNetWmState()
    window.setVirtualDesktop(0)
    window.setFrameExtents()
    const output = window.legacyFullscreen()
    if (output !== undefined) {
      window.fullscreen = true
      window.legacyFullscreenOutput = output
    }

    this.xConnection.mapWindow(event.window)
    this.xConnection.mapWindow(window.frameId)

    /* Mapped in the X server, we can draw immediately.
     * Cannot set pending state though, no weston_surface until
     * xserver_map_shell_surface() time. */
    window.scheduleRepaint()
  }

  private handleMapNotify(event: MapNotifyEvent) {
    if (this.isOurResource(event.window)) {
      this.session.logger.debug(`XCB_MAP_NOTIFY (window ${event.window}, ours)`)
      return
    }

    this.session.logger.debug(`XCB_MAP_NOTIFY (window ${event.window}${event.overrideRedirect ? ', override' : ''})`)
  }

  private handleUnmapNotify(event: UnmapNotifyEvent) {
    this.session.logger.debug(
      `XCB_UNMAP_NOTIFY (window ${event.window}, event ${event.event}${
        this.isOurResource(event.window) ? ', ours' : ''
      })`,
    )
    if (this.isOurResource(event.window)) {
      return
    }

    if (event.responseType & SEND_EVENT_MASK) {
      /* We just ignore the ICCCM 4.1.4 synthetic unmap notify
       * as it may come in after we've destroyed the window. */
      return
    }

    const window = this.lookupXWindow(event.window)
    if (!window) {
      return
    }

    if (window.surfaceId) {
      /* Make sure we're not on the unpaired surface list or we
       * could be assigned a surface during surface creation that
       * was mapped before this unmap request.
       */
      window.surfaceId = undefined
    }

    if (this.focusWindow === window) {
      this.focusWindow = undefined
    }
    if (window.surface && window.surfaceDestroyListener) {
      window.surface.resource.removeDestroyListener(window.surfaceDestroyListener)
    }
    if (window.shsurf) {
      const { keyboard, pointer } = window.shsurf.surface.session.globals.seat
      if (keyboard.focus === window.shsurf.surface) {
        keyboard.setFocus(undefined)
      }
      if (pointer.focus?.surface === window.shsurf.surface) {
        pointer.clearFocus()
      }
    }
    window.surface = undefined
    window.shsurf = undefined

    window.setWmState(ICCCM_WITHDRAWN_STATE)
    window.setVirtualDesktop(-1)

    if (window.frameId !== 0) {
      this.xConnection.unmapWindow(window.frameId)
    }
  }

  private async handleReparentNotify(event: ReparentNotifyEvent) {
    this.session.logger.debug(
      `XCB_REPARENT_NOTIFY (window ${event.window}, parent ${event.parent}, event ${event.event}${
        event.overrideRedirect ? ', override' : ''
      })`,
    )

    if (event.parent === this.screen.root) {
      await this.createXWindow(event.window, 10, 10, event.x, event.y, event.overrideRedirect)
    } else if (!this.isOurResource(event.parent)) {
      const window = this.lookupXWindow(event.window)
      if (!window) {
        return
      }
      window.destroy()
    }
  }

  private handleConfigureRequest(event: ConfigureRequestEvent) {
    const window = this.lookupXWindow(event.window)
    if (window === undefined) {
      return
    }

    if (window.fullscreen) {
      window.sendFullscreenConfigureNotify()
      return
    }

    if (event.valueMask & ConfigWindow.Width) {
      window.width = event.width
    }
    if (event.valueMask & ConfigWindow.Height) {
      window.height = event.height
    }

    if (window.frameId) {
      window.setAllowCommits(false)
      window.frame?.resizeInside(window.width, window.height)
    }

    const { x, y } = window.getChildPosition()
    const values: ConfigureValueList = {
      x,
      y,
      width: window.width,
      height: window.height,
      borderWidth: 0,
    }
    if (event.valueMask & ConfigWindow.Sibling) {
      values.sibling = event.sibling
    }
    if (event.valueMask & ConfigWindow.StackMode) {
      values.stackMode = event.stackMode
    }

    this.configureWindow(window.id, values)
    window.configureFrame()
    window.scheduleRepaint()
  }

  private handleConfigureNotify(event: ConfigureNotifyEvent) {
    this.session.logger.debug(
      `XCB_CONFIGURE_NOTIFY (window ${event.window}) ${event.x},${event.y} @ ${event.width}x${event.height}${
        event.overrideRedirect ? ', override' : ''
      })`,
    )

    const window = this.lookupXWindow(event.window)
    if (!window) {
      return
    }

    window.x = event.x
    window.y = event.y
    window.positionDirty = false

    if (window.overrideRedirect) {
      window.width = event.width
      window.height = event.height
      if (window.frameId) {
        window.frame?.resizeInside(window.width, window.height)

        /* We should check if shsurf has been created because sometimes
         * there are races
         * (configure_notify is sent before xserver_map_surface) */
        window.shsurf?.setXWayland(window.x, window.y)
      }
    }
  }

  private handleDestroyNotify(event: DestroyNotifyEvent) {
    this.session.logger.debug(
      `XCB_DESTROY_NOTIFY, win ${event.window}, event ${event.event}${event.window ? ', ours' : ''}`,
    )

    if (this.isOurResource(event.window)) {
      return
    }

    this.lookupXWindow(event.window)?.destroy()
  }

  private handlePropertyNotify(event: PropertyNotifyEvent) {
    const window = this.lookupXWindow(event.window)

    if (window === undefined) {
      return
    }

    window.propertiesDirty = true

    if (event.atom === this.atoms._NET_WM_NAME || event.atom === Atom.wmName) {
      window.scheduleRepaint()
    }
  }

  private async handleClientMessage(event: ClientMessageEvent) {
    this.session.logger.debug(
      `XCB_CLIENT_MESSAGE (${await this.getAtomName(event._type)} ${event.data.data32?.[0]} ${event.data.data32?.[1]} ${
        event.data.data32?.[2]
      } ${event.data.data32?.[3]} ${event.data.data32?.[4]} win ${event.window})`,
    )

    const window = this.lookupXWindow(event.window)
    /* The window may get created and destroyed before we actually
     * handle the message.  If it doesn't exist, bail.
     */
    if (!window) {
      return
    }

    if (event._type === this.atoms._NET_WM_MOVERESIZE) {
      window.handleMoveResize(event)
    } else if (event._type === this.atoms._NET_WM_STATE) {
      window.handleState(event)
    } else if (event._type === this.atoms.WL_SURFACE_ID) {
      await window.handleSurfaceId(event)
    } else if (event._type === this.atoms._NET_REQUEST_FRAME_EXTENTS) {
      window.handleRequestFrameExtends(event)
    }
  }

  private handleFocusIn(event: FocusInEvent) {
    /* Do not interfere with grabs */
    if (event.mode === NotifyMode.Grab || event.mode === NotifyMode.Ungrab) {
      return
    }
    // Ignore pointer focus change events
    if (event.detail === NotifyDetail.Pointer) {
      return
    }

    /* Do not let X clients change the focus behind the compositor's
     * back. Reset the focus to the old one if it changed. */
    if (this.focusWindow === undefined || event.event !== this.focusWindow.id) {
      this.sendFocusWindow(this.focusWindow)
    }
  }

  private isOurResource(id: number) {
    const { resourceIdMask, resourceIdBase } = this.xConnection.setup
    return (id & ~resourceIdMask) === resourceIdBase
  }

  private async createXWindow(
    id: WINDOW,
    width: number,
    height: number,
    x: number,
    y: number,
    overrideRedirect: number,
  ) {
    this.xConnection.changeWindowAttributes(id, { eventMask: EventMask.PropertyChange | EventMask.FocusChange })
    const window: XWindow = new XWindow(this, id, overrideRedirect !== 0, x, y, width, height, this.session)
    try {
      const geometryReply = await this.xConnection.getGeometry(id)
      /* technically we should use XRender and check the visual format's
          alpha_mask, but checking depth is simpler and works in all known cases */
      window.hasAlpha = geometryReply.depth === 32
      this.windowHash[id] = window
    } catch (e) {
      // ignore, window was most likely destroyed
    }
  }

  private async getAtomName(atom: ATOM) {
    if (atom === Atom.None) {
      return 'None'
    }

    const reply = await this.xConnection.getAtomName(atom)
    return reply.name.chars()
  }

  private wmWindowSetCursor(windowId: WINDOW, cursor: CursorType) {
    if (this.lastCursor === cursor) {
      return
    }

    this.lastCursor = cursor

    const newCursor = this.cursors[cursor]
    this.xConnection.changeWindowAttributes(windowId, { cursor: newCursor })
    this.xConnection.flush()
  }

  private async loadCursor(cursorImage: typeof cursorImageNames[CursorType]): Promise<Cursor> {
    // FIXME simply use build in browser cursor here instead of loading one through X...
    const { url, yhot, xhot, height, width } = cursorImage
    const response = await fetch(url)
    const cursorPNGImageData = await response
      .blob()
      .then((value) => value.arrayBuffer())
      .then((value) => new Uint8ClampedArray(value))

    const cursorImageBlob = new Blob([cursorPNGImageData], { type: 'image/png' })
    const cursorImageBitmap = await createImageBitmap(cursorImageBlob, 0, 0, width, height)
    this.imageDecodingCanvas.width = width
    this.imageDecodingCanvas.height = height
    this.imageDecodingContext.drawImage(cursorImageBitmap, 0, 0)
    const pixels = this.imageDecodingContext.getImageData(0, 0, width, height)

    return this.loadCursorImage({ pixels, xhot: xhot, yhot: yhot })
  }

  private loadCursorImage(cursorImage: { xhot: number; yhot: number; pixels: ImageData }): Cursor {
    const pix = this.xConnection.allocateID()
    this.xConnection.createPixmap(32, pix, this.screen.root, cursorImage.pixels.width, cursorImage.pixels.height)

    const pic = this.xConnection.allocateID()
    this.render.createPicture(pic, pix, this.formatRgba.id, {})

    const gc = this.xConnection.allocateID()
    this.xConnection.createGC(gc, pix, {})

    const stride = cursorImage.pixels.width * 4
    this.xConnection.putImage(
      ImageFormat.ZPixmap,
      pix,
      gc,
      cursorImage.pixels.width,
      cursorImage.pixels.height,
      0,
      0,
      0,
      32,
      stride * cursorImage.pixels.height,
      new Uint8Array(cursorImage.pixels.data.buffer),
    )
    this.xConnection.freeGC(gc)

    const cursor = this.xConnection.allocateID()
    this.render.createCursor(cursor, pic, cursorImage.xhot, cursorImage.yhot)

    this.render.freePicture(pic)
    this.xConnection.freePixmap(pix)

    return cursor
  }

  private sendFocusWindow(window: XWindow | undefined) {
    if (window) {
      if (window.overrideRedirect) {
        return
      }
      const clientMessage = marshallClientMessageEvent({
        responseType: ClientMessageEvent,
        format: 32,
        window: window.id,
        _type: this.atoms.WM_PROTOCOLS,
        data: {
          data32: new Uint32Array([this.atoms.WM_TAKE_FOCUS, Time.CurrentTime]),
        },
      })

      this.xConnection.sendEvent(0, window.id, EventMask.SubstructureRedirect, new Int8Array(clientMessage))
      this.xConnection.setInputFocus(InputFocus.PointerRoot, window.id, Time.CurrentTime)
      this.configureWindow(window.frameId, { stackMode: StackMode.Above })
    } else {
      this.xConnection.setInputFocus(InputFocus.PointerRoot, Window.None, Time.CurrentTime)
    }
  }

  activate(surface: Surface): void {
    const role = surface.role as XWaylandShellSurface | undefined
    if (role === undefined) {
      return
    }

    const window = role.window

    if (window) {
      this.setNetActiveWindow(window.id)
    } else {
      this.setNetActiveWindow(Window.None)
    }

    this.sendFocusWindow(window)

    if (this.focusWindow) {
      if (this.focusWindow.frame) {
        this.focusWindow.frame.unsetFlag(FrameFlag.FRAME_FLAG_ACTIVE)
      }
      this.focusWindow.scheduleRepaint()
    }
    this.focusWindow = window
    if (this.focusWindow) {
      if (this.focusWindow.frame) {
        this.focusWindow.frame.setFlag(FrameFlag.FRAME_FLAG_ACTIVE)
      }
      this.focusWindow.scheduleRepaint()
    }

    this.xConnection.flush()
  }

  private setSelection() {
    const source = this.session.globals.seat.selectionDataSource
    if (source === undefined) {
      if (this.selectionOwner === this.selectionWindow) {
        this.xConnection.setSelectionOwner(Window.None, this.atoms.CLIPBOARD, this.selectionTimestamp)
        return
      }
    }

    if (source instanceof XDataSource) {
      return
    }

    this.xConnection.setSelectionOwner(this.selectionWindow, this.atoms.CLIPBOARD, Time.CurrentTime)
  }

  private handleXFixesSelectionNotify(event: XFixes.SelectionNotifyEvent) {
    if (event.selection !== this.atoms.CLIPBOARD) {
      return
    }

    this.session.logger.debug(`xfixes selection notify event: owner ${event.owner}`)

    if (event.owner === Window.None) {
      if (this.selectionOwner !== this.selectionWindow) {
        /* A real X client selection went away, not our
         * proxy selection.  Clear the wayland selection. */
        const seat = this.session.globals.seat
        const serial = seat.nextSerial()
        seat.setSelectionInternal(undefined, serial)
      }

      this.selectionOwner = Window.None
      return
    }

    this.selectionOwner = event.owner

    /* We have to use XCB_TIME_CURRENT_TIME when we claim the
     * selection, so grab the actual timestamp here so we can
     * answer TIMESTAMP conversion requests correctly. */
    if (event.owner === this.selectionWindow) {
      this.selectionTimestamp = event.timestamp
      this.session.logger.debug(`our window, skipping`)
      return
    }

    this.incr = false
    this.xConnection.convertSelection(
      this.selectionWindow,
      this.atoms.CLIPBOARD,
      this.atoms.TARGETS,
      this.atoms._WL_SELECTION,
      event.timestamp,
    )
    this.xConnection.flush()
  }

  private handleSelectionNotify(event: SelectionNotifyEvent) {
    if (event.property === Atom.None) {
      /* convert selection failed */
    } else if (event.target === this.atoms.TARGETS) {
      return this.getSelectionTargets()
    } else {
      return this.getSelectionData()
    }
  }

  private async handleSelectionPropertyNotify(event: PropertyNotifyEvent): Promise<boolean> {
    if (event.window === this.selectionWindow) {
      if (event.state === Property.NewValue && event.atom === this.atoms._WL_SELECTION && this.incr) {
        await this.getIncrChunk()
      }
      return true
    } else if (event.window === this.selectionRequest.requestor) {
      if (event.state === Property.Delete && event.atom === this.selectionRequest.property && this.incr) {
        await this.sendIncrChunk()
      }
      return true
    }
    return false
  }

  private handleSelectionRequest(event: SelectionRequestEvent) {
    // this.session.logger.debug(`selection request, ${await this.xConnection.getAtomName(event.selection)}, `)
    // this.session.logger.debug(`target, ${this.xConnection.getAtomName(event.target)}, `)
    // this.session.logger.debug(`property, ${this.xConnection.getAtomName(event.property)}, `)

    this.selectionRequest = event
    this.incr = false
    this.flushPropertyOnDelete = false

    if (event.selection === this.atoms.CLIPBOARD_MANAGER) {
      /* The clipboard should already have grabbed
       * the first target, so just send selection notify
       * now.  This isn't synchronized with the clipboard
       * finishing getting the data, so there's a race here. */
      this.sendSelectionNotify(this.selectionRequest.property)
      return
    }

    if (event.target === this.atoms.TARGETS) {
      this.sendTargets()
    } else if (event.target === this.atoms.TIMESTAMP) {
      this.sendTimestamp()
    } else if (event.target === this.atoms.UTF8_STRING || event.target === this.atoms.TEXT) {
      this.sendData(this.atoms.UTF8_STRING, 'text/plain;charset=utf-8')
    } else {
      this.session.logger.warn(`can only handle UTF8_STRING targets...`)
      this.sendSelectionNotify(Atom.None)
    }
  }

  private sendSelectionNotify(property: Atom) {
    const event = marshallSelectionNotifyEvent({
      responseType: SelectionNotifyEvent,
      time: this.selectionRequest.time,
      requestor: this.selectionRequest.requestor,
      selection: this.selectionRequest.selection,
      target: this.selectionRequest.target,
      property,
    })
    this.xConnection.sendEvent(0, this.selectionRequest.requestor, EventMask.NoEvent, new Int8Array(event))
  }

  private sendTargets() {
    this.xConnection.changeProperty(
      PropMode.Replace,
      this.selectionRequest.requestor,
      this.selectionRequest.property,
      Atom.ATOM,
      32,
      new Uint32Array([this.atoms.TIMESTAMP, this.atoms.TARGETS, this.atoms.UTF8_STRING, this.atoms.TEXT]),
    )

    this.sendSelectionNotify(this.selectionRequest.property)
  }

  private sendTimestamp() {
    this.xConnection.changeProperty(
      PropMode.Replace,
      this.selectionRequest.requestor,
      this.selectionRequest.property,
      Atom.INTEGER,
      32,
      new Uint32Array([this.selectionTimestamp]),
    )

    this.sendSelectionNotify(this.selectionRequest?.property ?? 0)
  }

  private async sendData(target: Atom, mimeType: string) {
    if (this.session.globals.seat.selectionDataSource === undefined) {
      return
    }

    const pipe = await this.session.globals.seat.selectionDataSource.webfs.mkfifo()
    this.selectionTarget = target
    this.dataSourceFd = pipe[0]
    this.session.globals.seat.selectionDataSource?.send(mimeType, pipe[1])

    await this.readDataSource(this.dataSourceFd)
  }

  private async readDataSource(fd: GWebFD) {
    if (this.session.globals.seat.selectionDataSource === undefined) {
      return
    }

    const dataStream = await fd.readStream(INCR_CHUNK_SIZE)
    const reader = dataStream.getReader()
    try {
      let read = true
      do {
        const { value, done } = await reader.read()
        read = !done
        if (value) {
          this.readDataSourceData(value)
        } else if (done) {
          this.readDataSourceDone()
        }
      } while (read)
    } catch (e: unknown) {
      this.session.logger.error(`read error from data source ${e}`)
      this.sendSelectionNotify(Atom.None)
      // TODO check if we need to close the webfd?
    }
  }

  private readDataSourceData(data: Uint8Array) {
    this.sourceData = data
    if (data.byteLength >= INCR_CHUNK_SIZE) {
      if (!this.incr) {
        this.session.logger.info(`got ${data.byteLength} bytes, starting incr`)
        this.incr = true
        this.xConnection.changeProperty(
          PropMode.Replace,
          this.selectionRequest?.requestor ?? 0,
          this.selectionRequest?.property ?? 0,
          this.atoms.INCR,
          32,
          new Uint32Array([INCR_CHUNK_SIZE]),
        )
        this.selectionPropertySet = true
        this.flushPropertyOnDelete = true
        // TODO don't listen for read data anymore?
        this.sendSelectionNotify(this.selectionRequest?.property ?? 0)
      } else if (this.selectionPropertySet) {
        this.session.logger.info(`got ${data.byteLength} bytes, waiting for property delete`)
        this.flushPropertyOnDelete = true

        // TODO don't listen for read data anymore?
      } else {
        this.session.logger.info(`got ${data.byteLength} bytes, property deleted, setting new property`)
        this.flushSourceData()
      }
    }
  }

  private readDataSourceDone() {
    if (this.incr) {
      this.session.logger.info(`incr transfer complete`)

      this.flushPropertyOnDelete = true
      if (this.selectionPropertySet) {
        this.session.logger.info(`waiting for property delete`)
      } else {
        this.session.logger.info(`property deleted, setting new property`)
        this.flushSourceData()
      }
      this.xConnection.flush()
      this.dataSourceFd = undefined
      // TODO close webfd?
    } else {
      this.session.logger.info(`non incr transfer complete`)
      this.flushSourceData()
      this.sendSelectionNotify(this.selectionRequest?.property ?? 0)
      this.xConnection.flush()
      // TODO close webfd?
      this.selectionRequest.requestor = Atom.None
    }
  }

  private flushSourceData() {
    const sourceDataBuffer = this.sourceData ?? new Uint8Array(0)
    this.xConnection.changeProperty(
      PropMode.Replace,
      this.selectionRequest.requestor,
      this.selectionRequest.property,
      this.selectionTarget,
      8,
      sourceDataBuffer,
    )
    this.selectionPropertySet = true
    const length = sourceDataBuffer.length
    this.sourceData = undefined

    return length
  }

  private async getIncrChunk() {
    const reply = await this.xConnection.getProperty(
      0 /* delete */,
      this.selectionWindow,
      this.atoms._WL_SELECTION,
      GetPropertyType.Any,
      0,
      0x1fffffff,
    )
    if (reply.value.length > 0) {
      await this.writeProperty(reply)
    } else {
      // transfer complete
      // TODO close data_source_fd ?
    }
  }

  private async writeProperty(reply: GetPropertyReply) {
    if (this.dataSourceFd === undefined) {
      return
    }

    await this.dataSourceFd.write(new Blob([reply.value]))

    if (this.incr) {
      this.xConnection.deleteProperty(this.selectionWindow, this.atoms._WL_SELECTION)
    } else {
      // TODO close dataSourceFD ?
    }
  }

  private async sendIncrChunk() {
    this.selectionPropertySet = false
    if (this.flushPropertyOnDelete) {
      this.flushPropertyOnDelete = false
      const length = this.flushSourceData()

      if (this.dataSourceFd) {
        await this.readDataSource(this.dataSourceFd)
      } else if (length > 0) {
        /* Transfer is all done, but queue a flush for
         * the delete of the last chunk so we can set
         * the 0 sized property to signal the end of
         * the transfer. */
        this.flushPropertyOnDelete = true
      } else {
        this.selectionRequest.requestor = Window.None
      }
    }
  }

  private async getSelectionTargets() {
    const reply = await this.xConnection.getProperty(
      1 /*delete*/,
      this.selectionWindow,
      this.atoms._WL_SELECTION,
      GetPropertyType.Any,
      0,
      4096,
    )

    if (reply._type !== Atom.ATOM) {
      return
    }

    const xDataSource = createXDataSource(this)
    for (const valueElement of new Uint32Array(reply.value.buffer, reply.value.byteOffset)) {
      if (valueElement === this.atoms.UTF8_STRING) {
        xDataSource.mimeTypes.push('text/plain;charset=utf-8')
      }
    }

    this.session.globals.seat.setSelectionInternal(xDataSource, this.session.globals.seat.nextSerial())
  }

  private async getSelectionData() {
    const reply = await this.xConnection.getProperty(
      1 /* delete */,
      this.selectionWindow,
      this.atoms._WL_SELECTION,
      GetPropertyType.Any,
      0 /* offset */,
      0x1fffffff /* length */,
    )

    if (reply._type === this.atoms.INCR) {
      this.incr = true
    } else {
      this.incr = false
      await this.writeProperty(reply)
    }
  }

  private async handleSelectionEvent(eventType: number, rawEvent: Uint8Array) {
    switch (eventType & ~0x80) {
      case SelectionNotifyEvent:
        await this.handleSelectionNotify(unmarshallSelectionNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value)
        return true
      case PropertyNotifyEvent:
        return await this.handleSelectionPropertyNotify(
          unmarshallPropertyNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value,
        )
      case SelectionRequestEvent:
        this.handleSelectionRequest(unmarshallSelectionRequestEvent(rawEvent.buffer, rawEvent.byteOffset).value)
        return true
    }

    switch (eventType - this.xFixes.firstEvent) {
      case XFixes.SelectionNotifyEvent:
        return this.handleXFixesSelectionNotify(
          XFixes.unmarshallSelectionNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value,
        )
    }
    return false
  }

  private selectionInit() {
    this.selectionRequest.requestor = Window.None

    this.xConnection.createWindow(
      WindowClass.CopyFromParent,
      this.selectionWindow,
      this.screen.root,
      0,
      0,
      10,
      10,
      0,
      WindowClass.InputOutput,
      this.screen.rootVisual,
      {
        eventMask: EventMask.PropertyChange,
      },
    )

    const mask =
      XFixes.SelectionEventMask.SetSelectionOwner |
      XFixes.SelectionEventMask.SelectionWindowDestroy |
      XFixes.SelectionEventMask.SelectionClientClose

    this.xConnection.setSelectionOwner(this.selectionWindow, this.atoms.CLIPBOARD_MANAGER, Time.CurrentTime)
    this.xFixes.selectSelectionInput(this.selectionWindow, this.atoms.CLIPBOARD, mask)

    this.session.globals.seat.selectionListeners.push(() => this.setSelection())
  }

  private async handleDndEvent(eventType: number, rawEvent: Uint8Array) {
    switch (eventType - this.xFixes.firstEvent) {
      case XFixes.SelectionNotifyEvent: {
        const xFixesSelectionNotify = XFixes.unmarshallSelectionNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value
        return xFixesSelectionNotify.selection === this.atoms.XdndSelection
      }
    }

    switch (eventType & ~0x80) {
      case ClientMessageEvent: {
        const clientMessage = unmarshallClientMessageEvent(rawEvent.buffer, rawEvent.byteOffset).value
        if (clientMessage._type === this.atoms.XdndEnter) {
          await this.handleDnDEnter(clientMessage)
          return true
        } else if (clientMessage._type === this.atoms.XdndLeave) {
          return true
        } else if (clientMessage._type === this.atoms.XdndDrop) {
          return true
        }
        return false
      }
    }
    return false
  }

  private async handleDnDEnter(clientMessage: ClientMessageEvent) {
    // TODO see dnd.c L114
    const data32 = clientMessage.data.data32
    if (data32 === undefined) {
      throw new Error('BUG. Received X dnd enter client message with undefined data.')
    }
    const source = createXDnDDataSource(this, data32[0], data32[1] >> 24)

    let types: Uint32Array
    if (data32[1] & 1) {
      const reply = await this.xConnection.getProperty(
        0 /* delete */,
        source.window,
        this.atoms.XdndTypeList,
        Atom.Any,
        0,
        2048,
      )
      types = new Uint32Array(reply.value.buffer, reply.value.byteOffset, reply.valueLen)
    } else {
      types = new Uint32Array(data32.buffer, 2 * Uint32Array.BYTES_PER_ELEMENT, 3)
    }

    let hasText = false
    let name: string
    for (let i = 0; i < types.length; i++) {
      if (types[i] === Atom.None) {
        continue
      }

      name = await this.getAtomName(types[i])
      if (
        types[i] === this.atoms.UTF8_STRING ||
        types[i] === this.atoms['text/plain;charset=utf-8'] ||
        types[i] === this.atoms['text/plain']
      ) {
        if (hasText) {
          continue
        }

        hasText = true
        source.mimeTypes.push('text/plain;charset=utf-8')
      } else if (name.includes('/')) {
        source.mimeTypes.push(name)
      }
    }

    this.session.globals.seat.pointer.startDrag(source, undefined, undefined)
  }

  private dndInit() {
    const version = 4
    const mask =
      XFixes.SelectionEventMask.SetSelectionOwner |
      XFixes.SelectionEventMask.SelectionWindowDestroy |
      XFixes.SelectionEventMask.SelectionClientClose
    this.xFixes.selectSelectionInput(this.selectionWindow, this.atoms.XdndSelection, mask)
    this.xConnection.createWindow(
      WindowClass.CopyFromParent,
      this.dndWindow,
      this.screen.root,
      0,
      0,
      8192,
      8192,
      0,
      WindowClass.InputOnly,
      this.screen.rootVisual,
      {
        eventMask: EventMask.SubstructureNotify | EventMask.PropertyChange,
      },
    )
    this.xConnection.changeProperty(
      PropMode.Replace,
      this.dndWindow,
      this.atoms.XdndAware,
      Atom.ATOM,
      32,
      new Uint32Array([version]),
    )
  }
}
