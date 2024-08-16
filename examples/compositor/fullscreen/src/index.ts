import { createAppLauncher, createCompositorSession, initWasm } from '@gfld/compositor'

const wasmLibs = initWasm()

async function main() {
  await wasmLibs

  // create new compositor context
  const session = await createCompositorSession({ mode: 'fullscreen' })
  // notify user of errors
  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)

  // Get an HTML5 canvas for use as an output for the compositor.
  const canvas = document.getElementById('output') as HTMLCanvasElement
  // hook up the canvas to our compositor
  session.userShell.actions.initScene(() => ({ canvas, id: canvas.id }))
  // make compositor global protocol objects available to client
  session.globals.register()

  const appContext = createAppLauncher(session, 'remote').launch(new URL('http://localhost:8081/gtk4-demo'), (childAppContext) => {
    childAppContext.onStateChange = (state) => {
      // log child app state
      console.log(`Child app is ${state}`)
    }
  })

  // log app state
  appContext.onStateChange = (state) => {
    console.log(`App state is ${state}`)
  }

  appContext.onNameChanged = (name) => {
    window.document.title = name
  }
  window.document.title = appContext.name ?? ""
}

window.onload = () => {
  main()
}
