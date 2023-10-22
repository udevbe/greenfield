import { Signal } from '@preact/signals'
import { CompositorClient, createAppLauncher, createCompositorSession, initWasm } from '@gfld/compositor'
import { render } from 'preact'
import { AppBar, AppEntryProps } from './AppBar'
import { act } from 'preact/test-utils'
import { CompositorSurface } from '@gfld/compositor/dist'

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

let surfaces: { clientId: string; id: number; title: string; active: boolean }[] = []

function updateTitle() {
  const activeSurface = surfaces.find((surface) => surface.active)
  if (activeSurface) {
    window.document.title = `${activeSurface.title} - Greenfield`
  } else {
    window.document.title = 'Greenfield'
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

  session.userShell.events.surfaceActivationUpdated = (compositorSurface, active) => {
    let surface = surfaces.find(
      (surface) => surface.id === compositorSurface.id && surface.clientId === compositorSurface.client.id,
    )
    if (surface) {
      surface.active = active
    } else {
      surface = { clientId: compositorSurface.client.id, id: compositorSurface.id, active, title: 'Greenfield' }
      surfaces.push(surface)
    }

    updateTitle()
  }

  session.userShell.events.surfaceTitleUpdated = (compositorSurface, title) => {
    let surface = surfaces.find(
      (surface) => surface.id === compositorSurface.id && surface.clientId === compositorSurface.client.id,
    )
    if (surface) {
      surface.title = title
    } else {
      surface = { clientId: compositorSurface.client.id, id: compositorSurface.id, active: false, title }
      surfaces.push(surface)
    }

    updateTitle()
  }

  session.userShell.events.surfaceDestroyed = (compositorSurface: CompositorSurface) => {
    surfaces = surfaces.filter(
      (surface) => !(surface.id === compositorSurface.id && surface.clientId === compositorSurface.client.id),
    )

    updateTitle()
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
