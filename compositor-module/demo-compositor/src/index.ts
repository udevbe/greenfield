import {
  CompositorSession,
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createCompositorProxyConnector,
  createCompositorRemoteSocket,
  createCompositorSession,
  createKeyEventFromKeyboardEvent,
  initWasm,
} from '../../src'

function initializeCanvas(session: CompositorSession, canvas: HTMLCanvasElement, myId: string) {
  // register canvas with compositor session
  session.userShell.actions.initScene(myId, canvas)

  // make sure the canvas has focus and receives input inputs
  canvas.onmouseover = () => canvas.focus()
  canvas.tabIndex = 1
  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault()
  canvas.onblur = () => session.userShell.actions.input.blur()

  //wire up dom input events to compositor input events
  const pointerMoveHandler = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    session.userShell.actions.input.pointerMove(createButtonEventFromMouseEvent(event, false, myId))
  }

  // @ts-ignore
  if (canvas.onpointerrawupdate) {
    // @ts-ignore
    canvas.onpointerrawupdate = pointerMoveHandler
  } else {
    canvas.onpointermove = pointerMoveHandler
  }

  canvas.onpointerdown = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    session.userShell.actions.input.buttonDown(createButtonEventFromMouseEvent(event, false, myId))
  }
  canvas.onpointerup = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    session.userShell.actions.input.buttonUp(createButtonEventFromMouseEvent(event, true, myId))
    canvas.releasePointerCapture(event.pointerId)
  }
  canvas.onwheel = (event: WheelEvent) => {
    event.stopPropagation()
    event.preventDefault()
    session.userShell.actions.input.axis(createAxisEventFromWheelEvent(event, myId))
  }
  canvas.onkeydown = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, true)
    if (keyEvent) {
      session.userShell.actions.input.key(keyEvent)
    }
  }
  canvas.onkeyup = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, false)
    if (keyEvent) {
      session.userShell.actions.input.key(keyEvent)
    }
  }
}

function linkUserShellEvents(session: CompositorSession) {
  const userShell = session.userShell

  userShell.events.notify = (variant: string, message: string) => window.alert(message)
}

async function main() {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const compositorSessionId = 'test123'
  const session = createCompositorSession(compositorSessionId, {
    // We only enable error & warn logging. Uncomment others to get more fine grained logging.
    debug(object: any) {
      // console.log(`${object}`)
    },
    error(object: any) {
      console.error(`${object}`)
    },
    info(object: any) {
      // console.info(`${object}`)
    },
    trace(object: any) {
      // console.trace(`${object}`)
    },
    warn(object: any) {
      console.log(`${object}`)
    },
  })

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = 1280
  canvas.height = 720
  canvas.style.width = `${canvas.width}`
  canvas.style.height = `${canvas.height}`

  // hook up the canvas to our compositor
  initializeCanvas(session, canvas, 'myOutputId')
  linkUserShellEvents(session)

  const remoteSocket = createCompositorRemoteSocket(session)
  const compositorProxyConnector = createCompositorProxyConnector(session, remoteSocket)

  const connect8081Button: HTMLButtonElement = document.createElement('button')
  connect8081Button.textContent = `connect to ws://localhost:8081?compositorSessionId=${compositorSessionId}`

  connect8081Button.onclick = async () => {
    const compositorProxyURL = new URL('ws://localhost:8081')
    compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
    compositorProxyConnector.connectTo(compositorProxyURL)
  }

  const connect8082Button: HTMLButtonElement = document.createElement('button')
  connect8082Button.textContent = `connect to ws://localhost:8082?compositorSessionId=${compositorSessionId}`

  connect8082Button.onclick = async () => {
    const compositorProxyURL = new URL('ws://localhost:8082')
    compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
    compositorProxyConnector.connectTo(compositorProxyURL)
  }

  const container: HTMLDivElement = document.createElement('div')
  container.appendChild(connect8081Button)
  container.appendChild(connect8082Button)

  // make compositor global protocol objects available to client
  session.globals.register()

  // show the html elements on the user's screen
  document.body.appendChild(canvas)
  document.body.appendChild(container)
}

window.onload = () => main()
