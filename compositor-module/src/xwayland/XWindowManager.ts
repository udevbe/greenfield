import { Client, WlPointerButtonState } from 'westfield-runtime-server'
import type {
  ATOM,
  ButtonPressEvent,
  ButtonReleaseEvent,
  ClientMessageEvent,
  ConfigureNotifyEvent,
  ConfigureRequestEvent,
  CreateNotifyEvent,
  DestroyNotifyEvent,
  EnterNotifyEvent,
  FocusInEvent,
  LeaveNotifyEvent,
  MapNotifyEvent,
  MapRequestEvent,
  MotionNotifyEvent,
  PropertyNotifyEvent,
  ReparentNotifyEvent,
  SCREEN,
  SelectionRequestEvent,
  UnmapNotifyEvent,
  WINDOW,
  XConnection,
  XFixes,
} from 'xtsb'
import {
  Atom,
  chars,
  ColormapAlloc,
  Composite,
  ConfigWindow,
  Cursor,
  EventMask,
  getComposite,
  getRender,
  getXFixes,
  ImageFormat,
  InputFocus,
  marshallClientMessageEvent,
  NotifyDetail,
  NotifyMode,
  PropMode,
  Render,
  SelectionNotifyEvent,
  StackMode,
  Time,
  Window,
  WindowClass,
} from 'xtsb'
import { SelectionEventMask } from 'xtsb/dist/types/xcbXFixes'
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
import { XWindowManagerConnection } from './XWindowManagerConnection'
import XWaylandShell from './XWaylandShell'
import XWaylandShellSurface from './XWaylandShellSurface'
import { XWindow } from './XWindow'
import { FrameFlag, FrameStatus, themeCreate, ThemeLocation, XWindowTheme } from './XWindowFrame'

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

function selectionInit() {
  //TODO see weston's selection.c file
}

function dndInit() {
  // TODO see weston's dnd.c
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
  static async create(
    session: Session,
    xWaylandConnetion: XWindowManagerConnection,
    client: Client,
    xWaylandShell: XWaylandShell,
  ): Promise<XWindowManager> {
    const xConnection = await xWaylandConnetion.setup()
    xConnection.onPostEventLoop = () => {
      xConnection.flush()
    }
    xConnection.defaultExceptionHandler = (error: Error) => {
      console.error(JSON.stringify(error))
    }

    // TODO listen for any event here
    // TODO see weston weston_wm_handle_selection_event
    // xConnection.onEvent = xWindowManager.handleSelectionEvent(event)
    // TODO see weston weston_wm_handle_dnd_event
    // xConnection.onEvent = xWindowManager.handleDndEvent(event)

    xConnection.onButtonPressEvent = (event) => xWindowManager.handleButton(event)
    xConnection.onButtonReleaseEvent = (event) => xWindowManager.handleButton(event)
    xConnection.onEnterNotifyEvent = (event) => xWindowManager.handleEnter(event)
    xConnection.onLeaveNotifyEvent = (event) => xWindowManager.handleLeave(event)
    xConnection.onMotionNotifyEvent = (event) => xWindowManager.handleMotion(event)
    xConnection.onCreateNotifyEvent = (event) => xWindowManager.handleCreateNotify(event)
    xConnection.onMapRequestEvent = (event) => xWindowManager.handleMapRequest(event)
    xConnection.onMapNotifyEvent = (event) => xWindowManager.handleMapNotify(event)
    xConnection.onUnmapNotifyEvent = (event) => xWindowManager.handleUnmapNotify(event)
    xConnection.onReparentNotifyEvent = (event) => xWindowManager.handleReparentNotify(event)
    xConnection.onConfigureRequestEvent = (event) => xWindowManager.handleConfigureRequest(event)
    xConnection.onConfigureNotifyEvent = (event) => xWindowManager.handleConfigureNotify(event)
    xConnection.onDestroyNotifyEvent = (event) => xWindowManager.handleDestroyNotify(event)
    xConnection.onMappingNotifyEvent = () => session.logger.trace('XCB_MAPPING_NOTIFY')
    xConnection.onPropertyNotifyEvent = (event) => {
      if (!xWindowManager.handleSelectionPropertyNotify(event)) {
        xWindowManager.handlePropertyNotify(event)
      }
    }
    xConnection.onClientMessageEvent = (event) => xWindowManager.handleClientMessage(event)
    xConnection.onFocusInEvent = (event) => xWindowManager.handleFocusIn(event)

    const xWmResources = await setupResources(xConnection)
    const visualAndColormap = setupVisualAndColormap(xConnection)

    xConnection.changeWindowAttributes(xConnection.setup.roots[0].root, {
      eventMask: EventMask.SubstructureNotify | EventMask.SubstructureRedirect | EventMask.PropertyChange,
    })
    const { composite, xwmAtoms } = xWmResources
    composite.redirectSubwindows(xConnection.setup.roots[0].root, Composite.Redirect.Manual)

    const selectionWindow = xConnection.allocateID()
    xConnection.createWindow(
      WindowClass.CopyFromParent,
      selectionWindow,
      xConnection.setup.roots[0].root,
      0,
      0,
      10,
      10,
      0,
      WindowClass.InputOutput,
      xConnection.setup.roots[0].rootVisual,
      {
        eventMask: EventMask.PropertyChange,
      },
    )
    xConnection.setSelectionOwner(selectionWindow, xWmResources.xwmAtoms.CLIPBOARD_MANAGER, Time.CurrentTime)
    const mask =
      SelectionEventMask.SetSelectionOwner |
      SelectionEventMask.SelectionWindowDestroy |
      SelectionEventMask.SelectionClientClose
    xWmResources.xFixes.selectSelectionInput(selectionWindow, xWmResources.xwmAtoms.CLIPBOARD, mask)
    xWmResources.xFixes.onSelectionNotifyEvent = (event: XFixes.SelectionNotifyEvent) => {
      xWindowManager.handleXFixesSelectionNotify(event)
    }
    xConnection.onSelectionNotifyEvent = (event) => {
      xWindowManager.handleSelectionNotify(event)
    }
    xConnection.onSelectionRequestEvent = (event) => {
      xWindowManager.handleSelectionRequest(event)
    }
    session.globals.seat.selectionListeners.push(() => xWindowManager.setSelection())

    // TODO
    dndInit()

    const wmWindow = createWMWindow(xConnection, xConnection.setup.roots[0], xwmAtoms)
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
    )
    xWindowManager.setSelection()

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

    session.globals.seat.activationListeners.push((surface) => xWindowManager.activate(surface))

    xConnection.flush()
    return xWindowManager
  }

  readonly windowHash: { [key: number]: XWindow } = {}
  focusWindow?: XWindow
  readonly atoms: XWMAtoms
  private readonly composite: Composite.Composite
  private readonly render: Render.Render
  private readonly formatRgb: Render.PICTFORMINFO
  private readonly formatRgba: Render.PICTFORMINFO
  readonly visualId: number
  readonly colormap: number
  unpairedWindowList: XWindow[] = []
  readonly theme: XWindowTheme = themeCreate()
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
  private selectionRequestEvent?: SelectionRequestEvent
  private selectionOwner?: WINDOW
  private selectionTimestamp = 0

  constructor(
    public readonly session: Session,
    public readonly xConnection: XConnection,
    public readonly client: Client,
    public readonly xWaylandShell: XWaylandShell,
    public readonly screen: SCREEN,
    { xwmAtoms, composite, render, xFixes, formatRgb, formatRgba }: XWindowManagerResources,
    { visualId, colormap }: VisualAndColormap,
    public readonly wmWindow: WINDOW,
    private readonly selectionWindow: WINDOW,
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

    // Do not let X clients change the focus behind the compositor's
    // back. Reset the focus to the old one if it changed.
    //
    // Note: Some applications rely on being able to change focus, for ex. Steam:
    // Because of that, we allow changing focus between surfaces belonging to the
    // same application. We must be careful to ignore requests that are too old
    // though, because otherwise it may lead to race conditions:
    // const requestedFocus = this.windowHash[event.event]
    // if (
    //   this.focusWindow &&
    //   requestedFocus &&
    //   requestedFocus.pid === this.focusWindow.pid
    //   TODO implement sequence number for events in xtsb
    //   && validateFocusSerial(this.lastFocusSequence, event.sequence)
    // ) {
    //   this.setFocusWindow(requestedFocus)
    // } else {
    this.setFocusWindow(this.focusWindow)
    // }
  }

  private isOurResource(id: number) {
    const { resourceIdMask, resourceIdBase } = this.xConnection.setup
    return (id & ~resourceIdMask) === resourceIdBase
  }

  lookupXWindow(window: WINDOW): XWindow | undefined {
    return this.windowHash[window]
  }

  configureWindow(id: WINDOW, valueList: ConfigureValueList): void {
    this.xConnection.configureWindow(id, valueList)
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

  private setFocusWindow(window: XWindow | undefined) {
    const unfocusWindow = this.focusWindow
    this.focusWindow = window

    if (unfocusWindow) {
      unfocusWindow.frame?.unsetFlag(FrameFlag.FRAME_FLAG_ACTIVE)
      unfocusWindow.setNetWmState()
    }

    if (window === undefined) {
      this.xConnection.setInputFocus(InputFocus.PointerRoot, Window.None, Time.CurrentTime)
      return
    }

    if (window.overrideRedirect) {
      return
    }

    window.frame?.setFlag(FrameFlag.FRAME_FLAG_ACTIVE)

    const clientMessage = marshallClientMessageEvent({
      responseType: 0,
      format: 32,
      window: window.id,
      _type: this.atoms.WM_PROTOCOLS,
      data: {
        data32: new Uint32Array([this.atoms.WM_TAKE_FOCUS, Time.CurrentTime]),
      },
    })

    if (window.hints && !window.hints.input) {
      this.xConnection.sendEvent(0, window.id, EventMask.NoEvent, new Int8Array(clientMessage))
    } else {
      this.xConnection.sendEvent(0, window.id, EventMask.SubstructureRedirect, new Int8Array(clientMessage))
      this.xConnection.setInputFocus(InputFocus.PointerRoot, window.id, Time.CurrentTime)
    }
    this.configureWindow(window.frameId, { stackMode: StackMode.Above })
    window.setNetWmState()
  }

  activate(surface: Surface): void {
    const role = surface.role as XWaylandShellSurface | undefined
    if (role === undefined) {
      return
    }

    const window = role.window

    if (this.focusWindow === window || (window && window.overrideRedirect)) {
      return
    }

    if (window) {
      this.setNetActiveWindow(window.id)
    } else {
      this.setNetActiveWindow(Window.None)
    }

    this.setFocusWindow(window)
    this.xConnection.flush()
  }

  private setSelection() {
    const source = this.session.globals.seat.selectionDataSource
    if (source === undefined) {
      if (this.selectionOwner === this.selectionWindow) {
        this.xConnection.setSelectionOwner(Atom.None, this.atoms.CLIPBOARD, this.selectionTimestamp)
      } else {
        return
      }
    }

    // TODO check if the source object is implemented using XWayland and return early
    // if (source?.send === dataSourceSend) {
    //   return
    // }

    this.xConnection.setSelectionOwner(this.selectionWindow, this.atoms.CLIPBOARD, Time.CurrentTime)
  }

  private handleXFixesSelectionNotify(event: XFixes.SelectionNotifyEvent) {
    // TODO selection.c L619
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
    }
  }

  private handleSelectionNotify(event: SelectionNotifyEvent) {
    // TODO selection.c L297
  }

  private handleSelectionPropertyNotify(event: PropertyNotifyEvent): boolean {
    // TODO selection.c L554
    return false
  }

  private handleSelectionRequest(event: SelectionRequestEvent) {
    // TODO selection.c L578
  }
}
