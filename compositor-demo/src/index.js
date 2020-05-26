import {
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createKeyEventFromKeyboardEvent,
  initWasm,
  RemoteAppLauncher,
  RemoteSocket,
  Session,
  WebAppLauncher,
  WebAppSocket,
} from 'greenfield-compositor'

/**
 * @param {Session}session
 * @param {HTMLCanvasElement}canvas
 * @param {string}myId
 */
function initializeCanvas (session, canvas, myId) {
  // register canvas with compositor session
  session.userShell.actions.initScene(myId, canvas)

  // make sure the canvas has focus and receives input inputs
  canvas.onmouseover = () => canvas.focus()
  canvas.tabIndex = 1

  //wire up dom input events to compositor input events
  /**
   * @param {PointerEvent}event
   */
  canvas.onpointermove = (event) => {
    event.preventDefault()
    session.userShell.actions.input.pointerMove(createButtonEventFromMouseEvent(event, null, myId))
  }
  /**
   * @param {PointerEvent}event
   */
  canvas.onpointerdown = (event) => {
    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    session.userShell.actions.input.buttonDown(createButtonEventFromMouseEvent(event, false, myId))
  }
  /**
   * @param {PointerEvent}event
   */
  canvas.onpointerup = (event) => {
    event.preventDefault()
    session.userShell.actions.input.buttonUp(createButtonEventFromMouseEvent(event, true, myId))
    canvas.releasePointerCapture(event.pointerId)
  }
  /**
   * @param {WheelEvent}event
   */
  canvas.onwheel = (event) => {
    event.preventDefault()
    session.userShell.actions.input.axis(createAxisEventFromWheelEvent(event, myId))
  }
  /**
   * @param {KeyboardEvent}event
   */
  canvas.onkeydown = (event) => {
    event.preventDefault()
    session.userShell.actions.input.key(createKeyEventFromKeyboardEvent(event, true))
  }
  /**
   * @param {KeyboardEvent}event
   */
  canvas.onkeyup = (event) => {
    event.preventDefault()
    session.userShell.actions.input.key(createKeyEventFromKeyboardEvent(event, false))
  }
}

/**
 *
 * @param {Session}session
 */
function linkUserShellEvents (session) {
  const userShell = session.userShell

  userShell.events.notify = (variant, message) => window.alert(message)
  userShell.events.createUserSurface = (compositorSurface, compositorSurfaceState) => {
    // create view on our scene for the newly created surface
    userShell.actions.createView(compositorSurface, 'myOutputId')
    // request the client to make this surface active
    userShell.actions.requestActive(compositorSurface)
  }
  userShell.events.updateUserSeat = ({ keyboardFocus, pointerGrab, }) => {
    // raise the surface when a user clicks on it
    if (pointerGrab) {
      userShell.actions.raise(pointerGrab, 'myOutputId')
    }
  }
}

async function main () {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const session = Session.create()

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas = /** @type {HTMLCanvasElement} */ document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  canvas.style.width = canvas.width
  canvas.style.height = canvas.height
  // hook up the canvas to our compositor
  initializeCanvas(session, canvas, 'myOutputId')
  linkUserShellEvents(session)

  // create application launchers for web & remote applications
  const webAppSocket = WebAppSocket.create(session)
  const webAppLauncher = WebAppLauncher.create(webAppSocket)

  const remoteSocket = RemoteSocket.create(session)
  const remoteAppLauncher = RemoteAppLauncher.create(session, remoteSocket)

  const webShmAppURLButton = /** @type {HTMLButtonElement} */ document.createElement('button')
  webShmAppURLButton.textContent = 'WebSHM URL'
  const webGLURLButton = /** @type {HTMLButtonElement} */ document.createElement('button')
  webGLURLButton.textContent = 'WebGL URL'
  const remoteURLButton = /** @type {HTMLButtonElement} */ document.createElement('button')
  remoteURLButton.textContent = 'Remote GTK3-Demo URL'
  const urlInput = /** @type {HTMLInputElement} */ document.createElement('input')
  urlInput.type = 'text'
  urlInput.style.width = '595px'
  const launchButton = /** @type {HTMLButtonElement} */ document.createElement('button')
  launchButton.textContent = 'Launch'

  const container = /** @type {HTMLDivElement} */document.createElement('div')
  container.appendChild(webShmAppURLButton)
  container.appendChild(webGLURLButton)
  container.appendChild(remoteURLButton)
  container.appendChild(urlInput)
  container.appendChild(launchButton)

  webShmAppURLButton.onclick = () => urlInput.value = `${window.location.href}apps/simple-web-shm/app.js`
  webGLURLButton.onclick = () => urlInput.value = `${window.location.href}apps/simple-web-gl/app.js`
  remoteURLButton.onclick = () => urlInput.value = `ws://localhost:8081?launch=remote-gtk3-demo`

  launchButton.onclick = () => {
    const urlString = urlInput.value
    const url = new URL(urlString)
    if (url.protocol.startsWith('ws')) {
      remoteAppLauncher.launchURL(url)
    } else if (url.protocol.startsWith('http')) {
      webAppLauncher.launch(url)
    }
  }

  // make compositor global protocol objects available to client
  session.globals.register()

  document.body.appendChild(canvas)
  document.body.appendChild(container)
}

window.onload = () => main()
