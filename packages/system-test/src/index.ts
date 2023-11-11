import {
  CompositorSession,
  CompositorSurface,
  CompositorSurfaceState,
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createCompositorProxyConnector,
  createCompositorRemoteSocket,
  createCompositorSession,
  createCompositorWebAppLauncher,
  createCompositorWebAppSocket,
  createKeyEventFromKeyboardEvent,
  initWasm,
} from "greenfield-compositor";

function initializeCanvas(
  session: CompositorSession,
  canvas: HTMLCanvasElement,
  myId: string
) {
  // register canvas with compositor session
  session.userShell.actions.initScene(myId, canvas);

  // make sure the canvas has focus and receives input inputs
  canvas.onmouseover = () => canvas.focus();
  canvas.tabIndex = 1;
  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault();
  canvas.onblur = () => session.userShell.actions.input.blur();

  //wire up dom input events to compositor input events
  const pointerMoveHandler = (event: PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    session.userShell.actions.input.pointerMove(
      createButtonEventFromMouseEvent(event, false, myId)
    );
  };

  // @ts-ignore
  if (canvas.onpointerrawupdate) {
    // @ts-ignore
    canvas.onpointerrawupdate = pointerMoveHandler;
  } else {
    canvas.onpointermove = pointerMoveHandler;
  }

  canvas.onpointerdown = (event: PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    session.userShell.actions.input.buttonDown(
      createButtonEventFromMouseEvent(event, false, myId)
    );
  };
  canvas.onpointerup = (event: PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    session.userShell.actions.input.buttonUp(
      createButtonEventFromMouseEvent(event, true, myId)
    );
    canvas.releasePointerCapture(event.pointerId);
  };
  canvas.onwheel = (event: WheelEvent) => {
    event.stopPropagation();
    event.preventDefault();
    session.userShell.actions.input.axis(
      createAxisEventFromWheelEvent(event, myId)
    );
  };
  canvas.onkeydown = (event: KeyboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const keyEvent = createKeyEventFromKeyboardEvent(event, true);
    if (keyEvent) {
      session.userShell.actions.input.key(keyEvent);
    }
  };
  canvas.onkeyup = (event: KeyboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const keyEvent = createKeyEventFromKeyboardEvent(event, false);
    if (keyEvent) {
      session.userShell.actions.input.key(keyEvent);
    }
  };
}

function linkUserShellEvents(session: CompositorSession) {
  const userShell = session.userShell;

  userShell.events.notify = (variant: string, message: string) =>
    window.alert(message);
  userShell.events.createUserSurface = (
    compositorSurface: CompositorSurface,
    compositorSurfaceState: CompositorSurfaceState
  ) => {
    // create view on our scene for the newly created surface
    userShell.actions.createView(compositorSurface, "myOutputId");
  };
}

async function main() {
  // load web assembly libraries
  await initWasm();

  // create new compositor context
  const session = createCompositorSession();

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  canvas.style.width = `${canvas.width}`;
  canvas.style.height = `${canvas.height}`;

  // hook up the canvas to our compositor
  initializeCanvas(session, canvas, "myOutputId");
  linkUserShellEvents(session);

  // create application launchers for web & remote applications
  const webAppSocket = createCompositorWebAppSocket(session);
  const webAppLauncher = createCompositorWebAppLauncher(webAppSocket);

  const remoteSocket = createCompositorRemoteSocket(session);
  const compositorProxyConnector = createCompositorProxyConnector(
    session,
    remoteSocket
  );

  // make compositor global protocol objects available to client
  session.globals.register();

  // show the html elements on the user's screen
  document.body.appendChild(canvas);
}

window.onload = () => main();
