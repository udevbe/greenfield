import { ClientConnectionListener, createCompositorSession, createConnector, initWasm } from '../../src'

const proxyHost1 = 'localhost:8081'
const proxyHost2 = 'localhost:8082'

async function main() {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const compositorSessionId = 'test123'
  const session = await createCompositorSession(compositorSessionId)

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas: HTMLCanvasElement = document.createElement('canvas')

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

  const proxy1Checkbox: HTMLInputElement = document.createElement('input')
  const proxy1Label: HTMLLabelElement = document.createElement('label')
  proxy1Checkbox.id = 'proxy1'
  proxy1Label.htmlFor = proxy1Checkbox.id
  proxy1Label.innerText = `listen on ${proxyHost1}`
  proxy1Checkbox.type = 'checkbox'

  let proxy1Listener: ClientConnectionListener
  proxy1Checkbox.addEventListener('change', (e) => {
    if (proxy1Checkbox.checked) {
      const compositorProxyURL = new URL(`ws://${proxyHost1}`)
      compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
      proxy1Listener = compositorProxyConnector.listen(compositorProxyURL)
    } else {
      proxy1Listener.close()
    }
  })

  const proxy2Checkbox: HTMLInputElement = document.createElement('input')
  const proxy2Label: HTMLLabelElement = document.createElement('label')
  proxy2Checkbox.id = 'proxy2'
  proxy2Label.htmlFor = proxy2Checkbox.id
  proxy2Label.innerText = `listen on ${proxyHost2}`
  proxy2Checkbox.type = 'checkbox'
  proxy2Checkbox.textContent = `listen on ${proxyHost2}`

  let proxy2Listener: ClientConnectionListener
  proxy2Checkbox.addEventListener('change', () => {
    if (proxy2Checkbox.checked) {
      const compositorProxyURL = new URL(`ws://${proxyHost2}`)
      compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
      proxy2Listener = compositorProxyConnector.listen(compositorProxyURL)
    } else {
      proxy2Listener.close()
    }
  })

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
  container.appendChild(proxy1Checkbox)
  container.appendChild(proxy1Label)
  container.appendChild(proxy2Checkbox)
  container.appendChild(proxy2Label)
  container.appendChild(demoWebAppButton)
  container.appendChild(demoWebAppWGPUButton)

  // make compositor global protocol objects available to client
  session.globals.register()

  // show the html elements on the user's screen
  document.body.appendChild(canvas)
  document.body.appendChild(container)

  canvas.style.width = '100vw'
  canvas.style.height = `calc(100vh - ${container.offsetHeight}px - 5px)`
  document.body.style.overflow = 'hidden'
  document.body.style.margin = '0px'
}

window.onload = () => main()
