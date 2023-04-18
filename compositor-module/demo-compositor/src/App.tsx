import { WebAppLauncher } from './WebAppLauncher'
import { Signal } from '@preact/signals'
import { ProxyConnector } from './ProxyConnector'
import {
  CompositorClient,
  CompositorSession,
  createCompositorSession,
  createConnector,
  initWasm,
  RemoteCompositorConnector,
  WebCompositorConnector,
} from '../../src'
import { ClientProps } from './Client'
import { render } from 'preact'
import { Window, WindowProps } from './Window'

// load web assembly libraries
const wasmLibs = initWasm()

const clients = new Signal([] as ClientProps[])
const windows = new Signal([] as WindowProps[])

function Controls(props: {
  session: CompositorSession
  proxyConnector: RemoteCompositorConnector
  webConnector: WebCompositorConnector
}) {
  return (
    <div id="controls">
      <div>
        <ProxyConnector {...props} clients={clients} />
      </div>
      <div>
        <WebAppLauncher {...props} clients={clients} />
      </div>
      <hr />
      <div id="windows">
        <ul>
          {windows.value.map((window) => (
            <Window {...window} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function elementById(id: string) {
  const element = document.getElementById(id)
  if (element === null) {
    throw new Error(`BUG. No element with id "${id}"`)
  }
  return element
}

export async function main() {
  // load web assembly libraries
  await wasmLibs

  // create new compositor context
  const arr = new Uint8Array(8)
  window.crypto.getRandomValues(arr)
  const id = Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('')

  const session = await createCompositorSession(id)
  const proxyConnector = createConnector(session, 'remote')
  const webConnector = createConnector(session, 'web')

  session.userShell.events.clientDestroyed = (client: CompositorClient) => {
    clients.value = clients.value.filter((otherClient) => otherClient.id !== client.id)
  }
  session.userShell.events.clientUnresponsiveUpdated = (client: CompositorClient, unresponsive: boolean) => {
    const clientProps = clients.value.find((otherClient) => otherClient.id === client.id)
    if (clientProps === undefined) {
      return
    }
    clientProps.unresponsive.value = unresponsive
  }
  session.userShell.events.surfaceCreated = (compositorSurface) => {
    const clientProps = clients.value.find((client) => client.id === compositorSurface.client.id)
    if (clientProps === undefined) {
      // bug?
      return
    }
    windows.value = [
      ...windows.value,
      {
        title: new Signal('title'),
        appId: new Signal('application id'),
        id: compositorSurface.id,
        clientId: compositorSurface.client.id,
        onClose: clientProps.onClose,
        unresponsive: clientProps.unresponsive,
        origin: clientProps.origin,
      },
    ]
  }
  session.userShell.events.surfaceDestroyed = (compositorSurface) => {
    windows.value = windows.value.filter(
      (window) => window.clientId !== compositorSurface.client.id || window.id !== compositorSurface.id,
    )
  }
  session.userShell.events.surfaceTitleUpdated = (compositorSurface, title) => {
    const window = windows.value.find(
      (window) => compositorSurface.client.id === window.clientId && compositorSurface.id === window.id,
    )
    if (window === undefined) {
      return
    }
    window.title.value = title
  }
  session.userShell.events.surfaceAppIdUpdated = (compositorSurface, appId) => {
    const window = windows.value.find(
      (window) => compositorSurface.client.id === window.clientId && compositorSurface.id === window.id,
    )
    if (window === undefined) {
      return
    }
    window.appId.value = appId
  }
  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas = elementById('output') as HTMLCanvasElement
  // hook up the canvas to our compositor
  session.userShell.actions.initScene('myOutputId', canvas)
  // make compositor global protocol objects available to client
  session.globals.register()

  render(
    <Controls session={session} proxyConnector={proxyConnector} webConnector={webConnector} />,
    elementById('controls-container'),
  )
}

window.onload = () => main()
