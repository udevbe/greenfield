import {
  CompositorSession,
  createCompositorSession,
  createConnector,
  initWasm,
  RemoteClientConnectionListener,
  RemoteCompositorConnector,
  WebCompositorConnector,
} from '../../src'

function elementById(id: string) {
  const element = document.getElementById(id)
  if (element === null) {
    throw new Error(`BUG. No element with id "${id}"`)
  }
  return element
}

const unresponsiveClientTemplate = elementById('unresponsive-client') as HTMLTemplateElement
const unresponsiveClients = elementById('unresponsive-clients')

function createClientUnresponsiveElement(session: CompositorSession) {
  session.userShell.events.unresponsive = (compositorClient, unresponsive) => {
    if (unresponsive) {
      const disconnectButton = unresponsiveClientTemplate.content.cloneNode(true).childNodes[1] as HTMLButtonElement
      disconnectButton.id = `${compositorClient.id}`
      disconnectButton.textContent = `Client: ${compositorClient.id} unresponsive. Disconnect?`
      disconnectButton.onclick = () => {
        session.userShell.actions.closeClient(compositorClient)
        disconnectButton.remove()
      }
      unresponsiveClients.appendChild(disconnectButton)
    } else {
      document.getElementById(`${compositorClient.id}`)?.remove()
    }
  }
  session.userShell.events.clientDestroyed = (compositorClient) => {
    document.getElementById(`${compositorClient.id}`)?.remove()
  }

  return unresponsiveClients
}

function setupProxyConnectionHandlers(session: CompositorSession, compositorProxyConnector: RemoteCompositorConnector) {
  document.querySelectorAll<HTMLFormElement>('form.proxy-connection-container').forEach((proxyConnectionContainer) => {
    const proxyAddressInput = proxyConnectionContainer.elements.namedItem('proxy-address') as HTMLInputElement
    const proxyCheckbox = proxyConnectionContainer.elements.namedItem('proxy-connection-enabled') as HTMLInputElement
    const connectionStateOutput = proxyConnectionContainer.elements.namedItem('proxy-state') as HTMLOutputElement

    let proxyListener: RemoteClientConnectionListener
    proxyCheckbox.addEventListener('change', (e) => {
      if (proxyCheckbox.checked) {
        const compositorProxyURL = new URL(`ws://${proxyAddressInput.value}`)
        compositorProxyURL.searchParams.append('compositorSessionId', session.compositorSessionId)
        proxyListener = compositorProxyConnector.listen(compositorProxyURL)
        connectionStateOutput.innerText = proxyListener.state
        proxyListener.onConnectionStateChange = (state) => {
          connectionStateOutput.innerText = `Connection ${state}.`
        }
      } else {
        proxyListener.close()
      }
    })
  })
}

function setupWebAppLaunchHandlers(compositorWebConnector: WebCompositorConnector) {
  document.querySelectorAll<HTMLFormElement>('form.web-app-container').forEach((webAppContainer) => {
    const webAppAddress = webAppContainer.elements.namedItem('launch') as HTMLInputElement
    webAppAddress.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        const webAppURL = new URL(webAppAddress.value)
        compositorWebConnector.listen(webAppURL, (webAppFrame) => {
          document.body.appendChild(webAppFrame)
        })
      }
    })
  })
}

async function main() {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const compositorSessionId = 'test123'
  const session = await createCompositorSession(compositorSessionId)

  const controls = elementById('controls')
  const compositorProxyConnector = createConnector(session, 'remote')
  setupProxyConnectionHandlers(session, compositorProxyConnector)

  const compositorWebConnector = createConnector(session, 'web')
  setupWebAppLaunchHandlers(compositorWebConnector)

  controls.appendChild(createClientUnresponsiveElement(session))

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas = elementById('output') as HTMLCanvasElement
  // hook up the canvas to our compositor
  session.userShell.actions.initScene('myOutputId', canvas)
  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)
  // make compositor global protocol objects available to client
  session.globals.register()
}

window.onload = () => main()
