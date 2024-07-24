import { CompositorClient, createAppLauncher, createCompositorSession, initWasm } from '@gfld/compositor'

const wasmLibs = initWasm()

const urlSearchParams = new URLSearchParams(window.location.search);
const appType = urlSearchParams.get('type')
const appURL = urlSearchParams.get('url')

async function main() {
  if(appType === null) {
    console.error('Missing type search param')
    return
  }
  if(appType !== 'remote' && appType !== 'web') {
    console.error('Missing type search param')
    return
  }
  if(appURL === null) {
    console.error('Missing URL search param')
    return
  }

  await wasmLibs

  // create new compositor context
  const session = await createCompositorSession({ mode: 'fullscreen' })

  const appLauncher = createAppLauncher(session, appType)

  session.userShell.events.surfaceTitleUpdated = (compositorSurface, title) => {
    window.document.title = title
  }

  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas = document.getElementById('output') as HTMLCanvasElement
  // hook up the canvas to our compositor
  session.userShell.actions.initScene(() => ({ canvas, id: canvas.id }))
  // make compositor global protocol objects available to client
  session.globals.register()

  const appContext = appLauncher.launch(new URL(appURL), (childAppContext) => {
    // handle child context here
  })

  // handle app context here
}

window.onload = () => {
  main()
}
