import { createConnector, createCompositorSession, initWasm } from '../../src'

const proxyHost = 'localhost'

async function main() {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const compositorSessionId = 'test123'
  const session = await createCompositorSession(compositorSessionId)

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1080
  canvas.style.width = `${canvas.width}`
  canvas.style.height = `${canvas.height}`

  // hook up the canvas to our compositor
  session.userShell.actions.initScene('myOutputId', canvas)
  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)
  session.userShell.events.unresponsive = (compositorClient, unresponsive) => {
    if (unresponsive) {
      const disconnectButton = document.createElement('button')
      disconnectButton.id = `client-id-${compositorClient.id}`
      disconnectButton.textContent = `Client: client-id-${compositorClient.id} unresponsive. Force disconnect?`
      disconnectButton.onclick = () => {
        session.userShell.actions.closeClient(compositorClient)
        disconnectButton.remove()
      }
      document.body.appendChild(disconnectButton)
    } else {
      document.getElementById(`client-id-${compositorClient.id}`)?.remove()
    }
  }
  session.userShell.events.clientDestroyed = (compositorClient) =>
    document.getElementById(`client-id-${compositorClient.id}`)?.remove()

  const compositorProxyConnector = createConnector(session, 'remote')
  const compositorWebConnector = createConnector(session, 'web')

  const connect8081Button: HTMLButtonElement = document.createElement('button')
  connect8081Button.textContent = `connect to ${proxyHost}:8081 with compositorSessionId: ${compositorSessionId}`
  connect8081Button.onclick = () => {
    const compositorProxyURL = new URL(`ws://${proxyHost}:8081`)
    compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
    compositorProxyConnector.listen(compositorProxyURL)
  }

  const connect8082Button: HTMLButtonElement = document.createElement('button')
  connect8082Button.textContent = `connect to ${proxyHost}:8082 with compositorSessionId: ${compositorSessionId}`
  connect8082Button.onclick = () => {
    const compositorProxyURL = new URL(`ws://${proxyHost}:8082`)
    compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
    compositorProxyConnector.listen(compositorProxyURL)
  }

  const demoWebAppButton: HTMLButtonElement = document.createElement('button')
  demoWebAppButton.textContent = `Launch demo webapp`
  demoWebAppButton.onclick = () => {
    const webAppURL = new URL(`${location.origin}/demo-webapp/app.js`)
    compositorWebConnector.listen(webAppURL)
  }

  const demoWebAppWGPUButton: HTMLButtonElement = document.createElement('button')
  demoWebAppWGPUButton.textContent = `Launch demo webapp wgpu`
  demoWebAppWGPUButton.onclick = () => {
    const webAppURL = new URL(`${location.origin}/demo-webapp-wgpu/app.js`)
    compositorWebConnector.listen(webAppURL)
  }

  const container: HTMLDivElement = document.createElement('div')
  container.appendChild(connect8081Button)
  container.appendChild(connect8082Button)
  container.appendChild(demoWebAppButton)
  container.appendChild(demoWebAppWGPUButton)

  // make compositor global protocol objects available to client
  session.globals.register()

  // show the html elements on the user's screen
  document.body.appendChild(canvas)
  document.body.appendChild(container)
}

window.onload = () => main()
