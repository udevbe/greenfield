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
import { Client, ClientProps } from './Client'
import { render } from 'preact'

// load web assembly libraries
const wasmLibs = initWasm()

const clients = new Signal([] as ClientProps[])

function Controls(props: {
  session: CompositorSession
  proxyConnector: RemoteCompositorConnector
  webConnector: WebCompositorConnector
}) {
  return (
    <div id="controls">
      <div>
        <h4>Remote</h4>
        <ProxyConnector {...props} clients={clients} />
      </div>
      <div>
        <h4>Web</h4>
        <WebAppLauncher {...props} clients={clients} />
      </div>
      <div id="clients">
        <h4>Clients</h4>
        <ul>
          {clients.value.map((client) => (
            <li>
              <Client key={client.id} {...client} />
            </li>
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
  const compositorSessionId = 'test123'
  const session = await createCompositorSession(compositorSessionId)
  const proxyConnector = createConnector(session, 'remote')
  const webConnector = createConnector(session, 'web')

  session.userShell.events.clientDestroyed = (client: CompositorClient) => {
    clients.value = clients.value.filter((otherClient) => otherClient.id !== client.id)
  }
  session.userShell.events.clientUnresponsiveUpdated = (client: CompositorClient, unresponsive: boolean) => {
    clients.value = clients.value.map((otherClient) => ({
      ...otherClient,
      unresponsive: otherClient.id === client.id ? unresponsive : otherClient.unresponsive,
    }))
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
