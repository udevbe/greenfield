import {
  CompositorSession,
  CompositorSurface,
  CompositorSurfaceState,
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createCompositorProxyConnector,
  createCompositorRemoteSocket,
  createCompositorSession,
  createKeyEventFromKeyboardEvent,
  initWasm,
} from 'greenfield-compositor'

// claim set:
// {
//   "iss": "Online JWT Builder",
//   "iat": 1618412733,
//   "exp": 1744643120,
//   "aud": "localhost:3000",
//   "sub": "demouser",
//   "name": "demo user"
// }
// key (HS256): qwertyuiopasdfghjklzxcvbnm123456
const JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTg0MTI3MzMsImV4cCI6MTc0NDY0MzEyMCwiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJzdWIiOiJkZW1vdXNlciIsIm5hbWUiOiJkZW1vIHVzZXIifQ.cvrbNdOI4EqjPuSinH0FtMCtQqsOKK_HYC_MclN7Od4'

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
  userShell.events.createUserSurface = (
    compositorSurface: CompositorSurface,
    compositorSurfaceState: CompositorSurfaceState,
  ) => {
    // create view on our scene for the newly created surface
    userShell.actions.createView(compositorSurface, 'myOutputId')
  }
}

async function main() {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const session = createCompositorSession()

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

  const remoteGtk3URLButton: HTMLButtonElement = document.createElement('button')
  remoteGtk3URLButton.textContent = 'GTK3-Demo'
  const remoteKwriteURLButton: HTMLButtonElement = document.createElement('button')
  remoteKwriteURLButton.textContent = 'KWrite'

  const urlInput: HTMLInputElement = document.createElement('input')
  urlInput.type = 'text'
  urlInput.style.width = '600px'
  const launchButton: HTMLButtonElement = document.createElement('button')
  launchButton.textContent = 'Launch'

  const container: HTMLDivElement = document.createElement('div')
  container.appendChild(remoteGtk3URLButton)
  container.appendChild(remoteKwriteURLButton)
  container.appendChild(urlInput)
  container.appendChild(launchButton)

  remoteGtk3URLButton.onclick = () => (urlInput.value = `docker:udevbe/gtk3-demo:latest`)
  remoteKwriteURLButton.onclick = () => (urlInput.value = `docker:udevbe/kwrite:latest`)

  launchButton.onclick = () => {
    const urlString = urlInput.value
    const url = new URL(urlString)
    const image = url.pathname

    // const applicationLaunchResponse = await fetch(
    //   `http://localhost:8000/compositor/${session.compositorSessionId}/application/${image}`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       Authorization: JWT_TOKEN,
    //     },
    //   },
    // )
    // if (applicationLaunchResponse.status === 201) {
    //   const compositorProxyURL = applicationLaunchResponse.headers.get('location')
    //   if (compositorProxyURL) {
    //     await compositorProxyConnector.connectTo(new URL(compositorProxyURL))
    //   }
    // }

    const compositorProxyURL = new URL('ws://localhost:8081')
    compositorProxyURL.searchParams.append('compositorSessionId', '02bea934-7cfe-4324-9024-9bda9ef56cc8')
    compositorProxyConnector.connectTo(compositorProxyURL)
  }

  // make compositor global protocol objects available to client
  session.globals.register()

  // show the html elements on the user's screen
  document.body.appendChild(canvas)
  document.body.appendChild(container)
}

window.onload = () => main()
