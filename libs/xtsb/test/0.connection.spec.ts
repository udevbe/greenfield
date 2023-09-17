import { ChildProcessWithoutNullStreams } from 'node:child_process'
import {
  BadWindow,
  ColormapAlloc,
  connect,
  DestroyNotifyEvent,
  EventMask,
  getRender,
  getShape,
  getXFixes,
  nodeConnectionSetup,
  unmarshallDestroyNotifyEvent,
  WindowClass,
  XConnection,
  XFixes,
} from '../src/index.node'
// @ts-ignore
import { setupXvfb } from './setupXvfb'

interface VisualAndColormap {
  visualId: number
  colormap: number
}

async function setupVisualAndColormap(xConnection: XConnection): Promise<VisualAndColormap> {
  const visuals = xConnection.setup.roots.map((screen) => {
    const depth = screen.allowedDepths.find((depth) => depth.depth === 32)
    return depth?.visuals
  })?.[0]

  if (visuals === undefined) {
    throw new Error('no 32 bit visualtype\n')
  }
  const visualId = visuals[0].visualId

  const colormap = xConnection.allocateID()
  await xConnection.createColormap(ColormapAlloc.None, colormap, xConnection.setup.roots[0].root, visualId).check()

  return {
    visualId,
    colormap,
  }
}

describe('Connection', () => {
  const displayNum = '99'
  const display = `:${displayNum}`
  let xvfbProc: ChildProcessWithoutNullStreams

  let connection: XConnection

  beforeAll(async () => {
    const { xProc, xAuthority } = await setupXvfb(display)
    xvfbProc = xProc
    connection = await connect(nodeConnectionSetup({ display, xAuthority }))
  })

  afterAll(() => {
    connection.close()
    xvfbProc.kill()
  })

  it('can receive a reply from a request.', async () => {
    // Given
    const windowId = connection.allocateID()

    // When
    connection.createWindow(0, windowId, connection.setup.roots[0].root, 0, 0, 1, 1, 0, WindowClass.InputOutput, 0, {})
    const queryTreeReply = await connection.queryTree(windowId)

    // Then
    expect(queryTreeReply.parent).toBe(connection.setup.roots[0].root)
    expect(queryTreeReply.root).toBe(connection.setup.roots[0].root)
    expect(queryTreeReply.childrenLen).toBe(0)
    expect(queryTreeReply.children.length).toBe(0)
  })

  it('can receive an error from a result request.', (done) => {
    // Given
    const windowId = connection.allocateID()

    // When
    connection.createWindow(0, windowId, connection.setup.roots[0].root, 0, 0, 1, 1, 0, WindowClass.InputOutput, 0, {})
    connection.queryTree(123).catch((error) => {
      expect(error).toBeInstanceOf(BadWindow)
      done()
    })
  })

  it('can receive an error from checked a request.', (done) => {
    // Given
    const windowId = connection.allocateID()

    // When
    connection
      .createWindow(0, windowId, 12345, 0, 0, 1, 1, 0, WindowClass.InputOutput, 0, {})
      .check()
      .catch((error) => {
        expect(error).toBeInstanceOf(BadWindow)
        done()
      })
  })

  it('can receive events.', async () => {
    // Given
    const { colormap, visualId } = await setupVisualAndColormap(connection)
    const windowId = connection.allocateID()

    // When
    await connection
      .createWindow(
        32,
        windowId,
        connection.setup.roots[0].root,
        0,
        0,
        484,
        341,
        0,
        WindowClass.InputOutput,
        visualId,
        {
          colormap,
          eventMask:
            EventMask.KeyPress |
            EventMask.KeyRelease |
            EventMask.ButtonPress |
            EventMask.ButtonRelease |
            EventMask.PointerMotion |
            EventMask.EnterWindow |
            EventMask.LeaveWindow |
            EventMask.SubstructureNotify |
            EventMask.SubstructureRedirect |
            EventMask.StructureNotify,
          borderPixel: connection.setup.roots[0].blackPixel,
        },
      )
      .check()

    await new Promise<void>((resolve) => {
      connection.handleEvent = (eventType, eventSequenceNumber, rawEvent) => {
        if (eventType === DestroyNotifyEvent) {
          const event = unmarshallDestroyNotifyEvent(rawEvent.buffer, rawEvent.byteOffset).value
          expect(event.window).toBe(windowId)
          resolve()
        }
      }

      connection.destroyWindow(windowId).check()
    })
  })

  it('can wait on a successful checked request.', async () => {
    // Given
    const windowId0 = connection.allocateID()
    const windowId1 = connection.allocateID()

    // When
    connection.createWindow(0, windowId0, connection.setup.roots[0].root, 0, 0, 1, 1, 0, WindowClass.InputOutput, 0, {
      eventMask: EventMask.StructureNotify,
    })
    await connection.destroyWindow(windowId0).check()
    await connection
      .createWindow(0, windowId1, connection.setup.roots[0].root, 0, 0, 1, 1, 0, WindowClass.InputOutput, 0, {})
      .check()
    const queryTreeReply = await connection.queryTree(windowId1)

    // Then
    expect(queryTreeReply.parent).toBe(connection.setup.roots[0].root)
    expect(queryTreeReply.root).toBe(connection.setup.roots[0].root)
    expect(queryTreeReply.childrenLen).toBe(0)
    expect(queryTreeReply.children.length).toBe(0)
  })

  it('can query extensions', async () => {
    const listExtensionsReply = await connection.listExtensions()
    listExtensionsReply.names.forEach((value) => {
      expect(value).not.toBeUndefined()
      expect(typeof value.name.chars()).toBe('string')
    })

    const xFixes = await getXFixes(connection)
    const render = await getRender(connection)
    const shape = await getShape(connection)

    expect(xFixes).not.toBeUndefined()
    expect(render).not.toBeUndefined()
    expect(shape).not.toBeUndefined()
  })

  it('can select an xfixes selection event', async () => {
    const listExtensionsReply = await connection.listExtensions()
    listExtensionsReply.names.forEach((value) => {
      expect(value).not.toBeUndefined()
      expect(typeof value.name.chars()).toBe('string')
    })

    const clipboard = (await connection.internAtom(0, new Int8Array(new TextEncoder().encode('CLIPBOARD').buffer))).atom

    const windowId = connection.allocateID()
    const { colormap, visualId } = await setupVisualAndColormap(connection)
    await connection
      .createWindow(
        32,
        windowId,
        connection.setup.roots[0].root,
        0,
        0,
        484,
        341,
        0,
        WindowClass.InputOutput,
        visualId,
        {
          colormap,
          eventMask:
            EventMask.KeyPress |
            EventMask.KeyRelease |
            EventMask.ButtonPress |
            EventMask.ButtonRelease |
            EventMask.PointerMotion |
            EventMask.EnterWindow |
            EventMask.LeaveWindow |
            EventMask.SubstructureNotify |
            EventMask.SubstructureRedirect |
            EventMask.StructureNotify,
          borderPixel: connection.setup.roots[0].blackPixel,
        },
      )
      .check()
    const xFixes = await getXFixes(connection)
    const versionReply = await xFixes.queryVersion(XFixes.XFixes.MAJOR_VERSION, XFixes.XFixes.MINOR_VERSION)
    if (versionReply.majorVersion < XFixes.XFixes.MAJOR_VERSION) {
      throw new Error(`XServer does not support xfixes version ${XFixes.XFixes.MAJOR_VERSION}`)
    }
    await expect(xFixes.getCursorImage()).resolves.not.toThrow()
  })
})
