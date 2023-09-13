import './index.css'
import { Signal } from '@preact/signals'
import { CompositorClient, createAppLauncher, createCompositorSession, initWasm } from '../../src'
import { render } from 'preact'
import { AppBar, AppEntryProps } from './AppBar'

// load web assembly libraries
const wasmLibs = initWasm()

const appEntries = new Signal([] as AppEntryProps[])

function elementById(id: string) {
  const element = document.getElementById(id)
  if (element === null) {
    throw new Error(`BUG. No element with id "${id}"`)
  }
  return element
}

function appEntryPropsAction(clientId: string, action: (appEntryProps: AppEntryProps) => void): void {
  for (const appEntryProp of appEntries.value) {
    const clients = appEntryProp.clients.value

    const matchingClient = clients.find((otherClient) => otherClient.id === clientId)
    if (matchingClient === undefined) {
      continue
    }

    action(appEntryProp)
    return
  }
}

export async function main() {
  // load web assembly libraries
  await wasmLibs

  // create new compositor context
  const session = await createCompositorSession()
  const remoteAppLauncher = createAppLauncher(session, 'remote')
  const webAppLauncher = createAppLauncher(session, 'web')

  session.userShell.events.clientUnresponsiveUpdated = (client: CompositorClient, unresponsive: boolean) => {
    appEntryPropsAction(client.id, (appEntryProps) => {
      appEntryProps.unresponsive.value = unresponsive
    })
  }

  session.userShell.events.surfaceCreated = (compositorSurface) => {
    appEntryPropsAction(compositorSurface.client.id, (appEntryProps) => {
      appEntryProps.windows.value = [...appEntryProps.windows.value, { ...compositorSurface, title: new Signal() }]
    })
  }

  session.userShell.events.surfaceDestroyed = (compositorSurface) => {
    appEntryPropsAction(compositorSurface.client.id, (appEntryProps) => {
      appEntryProps.windows.value = appEntryProps.windows.value.filter((value) => value.id !== compositorSurface.id)
    })
  }

  session.userShell.events.surfaceActivationUpdated = (compositorSurface, active) => {
    appEntryPropsAction(compositorSurface.client.id, (appEntryProps) => {
      if (active) {
        appEntryProps.lastActiveWindow.value = appEntryProps.windows.value.find(
          (window) => window.id === compositorSurface.id,
        )
      }
    })
  }

  session.userShell.events.surfaceTitleUpdated = (compositorSurface, title) => {
    appEntryPropsAction(compositorSurface.client.id, (appEntryProps) => {
      const window = appEntryProps.windows.value.find(
        (otherCompositorSurface) => otherCompositorSurface.id === compositorSurface.id,
      )
      if (window) {
        window.title.value = title
      }
    })
  }

  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas = elementById('output') as HTMLCanvasElement
  // hook up the canvas to our compositor
  session.userShell.actions.initScene('myOutputId', canvas)
  // make compositor global protocol objects available to client
  session.globals.register()

  render(
    <AppBar remoteAppLauncher={remoteAppLauncher} webAppLauncher={webAppLauncher} appEntries={appEntries} />,
    elementById('controls-container'),
  )
}
