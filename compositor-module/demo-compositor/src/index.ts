import {
  CompositorSession,
  createCompositorSession,
  createConnector,
  initWasm,
  RemoteClientConnectionListener,
  RemoteCompositorConnector,
  WebCompositorConnector,
} from '../../src'

const proxyHost1 = 'localhost:8081'
const proxyHost2 = 'blacky.udev.be:8081'

const wgpuAppURL = `http://localhost:9001`
const demoAppURL = 'http://localhost:9000'

function createProxyConnectionElement(
  session: CompositorSession,
  compositorProxyConnector: RemoteCompositorConnector,
  proxyHost: string,
): HTMLDivElement {
  const proxyCheckbox: HTMLInputElement = document.createElement('input')
  proxyCheckbox.id = proxyHost
  proxyCheckbox.type = 'checkbox'
  proxyCheckbox.style.width = '15px'
  proxyCheckbox.style.height = '15px'
  proxyCheckbox.style.padding = '0'
  proxyCheckbox.style.margin = '0'
  proxyCheckbox.style.verticalAlign = 'bottom'
  proxyCheckbox.style.position = 'relative'
  proxyCheckbox.style.top = '-1px'

  const proxyLabel: HTMLLabelElement = document.createElement('label')
  proxyLabel.htmlFor = proxyCheckbox.id
  proxyLabel.innerText = `${proxyHost}`
  proxyLabel.style.display = 'block'
  proxyLabel.style.paddingLeft = '15px'
  proxyLabel.style.textIndent = '-15px'
  proxyLabel.prepend(proxyCheckbox)

  const connectionStateOutput = document.createElement('div')
  connectionStateOutput.innerText = `Connection closed.`
  connectionStateOutput.style.width = 'max-content'
  let proxyListener: RemoteClientConnectionListener
  proxyCheckbox.addEventListener('change', (e) => {
    if (proxyCheckbox.checked) {
      const compositorProxyURL = new URL(`ws://${proxyHost}`)
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

  const container: HTMLDivElement = document.createElement('div')
  container.style.margin = '5px'
  container.appendChild(proxyLabel)
  container.appendChild(connectionStateOutput)
  return container
}

function createClientUnresponsiveElement(session: CompositorSession): HTMLDivElement {
  const container: HTMLDivElement = document.createElement('div')
  container.style.margin = '5px'

  session.userShell.events.unresponsive = (compositorClient, unresponsive) => {
    if (unresponsive) {
      const disconnectButton = document.createElement('button')
      disconnectButton.id = `${compositorClient.id}`
      disconnectButton.style.maxWidth = 'min-content'
      disconnectButton.style.minWidth = '100%'
      disconnectButton.style.display = 'block'
      disconnectButton.textContent = `Client: ${compositorClient.id} unresponsive. Disconnect?`
      disconnectButton.onclick = () => {
        session.userShell.actions.closeClient(compositorClient)
        disconnectButton.remove()
      }
      container.appendChild(disconnectButton)
    } else {
      document.getElementById(`${compositorClient.id}`)?.remove()
    }
  }
  session.userShell.events.clientDestroyed = (compositorClient) => {
    document.getElementById(`${compositorClient.id}`)?.remove()
  }

  return container
}

function createWebAppElement(compositorWebConnector: WebCompositorConnector, appURL: string, name: string) {
  const appName = document.createElement('div')
  appName.innerText = name
  appName.style.width = 'max-content'

  const demoWebAppButton: HTMLButtonElement = document.createElement('button')
  demoWebAppButton.textContent = 'Launch'
  demoWebAppButton.onclick = () => {
    const webAppURL = new URL(appURL)
    compositorWebConnector.listen(webAppURL, (webAppFrame) => {
      document.body.appendChild(webAppFrame)
    })
  }

  const container: HTMLDivElement = document.createElement('div')
  container.style.margin = '5px'
  container.appendChild(appName)
  container.appendChild(demoWebAppButton)

  return container
}

async function main() {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const compositorSessionId = 'test123'
  const session = await createCompositorSession(compositorSessionId)

  const controls = document.createElement('div')
  controls.style.display = 'flex'
  controls.style.flexDirection = 'column'
  controls.style.borderRight = '1px solid'
  controls.style.backgroundColor = 'snow'
  const compositorProxyConnector = createConnector(session, 'remote')
  controls.appendChild(createProxyConnectionElement(session, compositorProxyConnector, proxyHost1))
  controls.appendChild(createProxyConnectionElement(session, compositorProxyConnector, proxyHost2))
  const compositorWebConnector = createConnector(session, 'web')
  controls.appendChild(createWebAppElement(compositorWebConnector, wgpuAppURL, wgpuAppURL))
  controls.appendChild(createWebAppElement(compositorWebConnector, demoAppURL, demoAppURL))
  controls.appendChild(createClientUnresponsiveElement(session))

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  // hook up the canvas to our compositor
  session.userShell.actions.initScene('myOutputId', canvas)
  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)
  // make compositor global protocol objects available to client
  session.globals.register()

  const canvasContainer: HTMLDivElement = document.createElement('div')
  canvasContainer.appendChild(canvas)
  canvasContainer.style.width = '100%'
  canvasContainer.style.height = '100%'

  const container = document.createElement('div')
  container.style.display = 'flex'
  container.style.height = '100%'
  container.appendChild(controls)
  container.appendChild(canvasContainer)

  // show the html elements on the user's screen
  document.body.style.margin = '0px'
  document.body.style.height = 'calc(100vh - 4px)'
  document.body.appendChild(container)
}

window.onload = () => main()
