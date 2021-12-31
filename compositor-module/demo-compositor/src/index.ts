import {
  createCompositorProxyConnector,
  createCompositorRemoteSocket,
  createCompositorSession,
  initWasm,
} from '../../src'

async function main() {
  // load web assembly libraries
  await initWasm()

  // create new compositor context
  const compositorSessionId = 'test123'
  const session = createCompositorSession(compositorSessionId)

  // Get an HTML5 canvas for use as an output for the compositor. Multiple outputs can be used.
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = 1440
  canvas.height = 900
  canvas.style.width = `${canvas.width}`
  canvas.style.height = `${canvas.height}`

  // hook up the canvas to our compositor
  session.userShell.actions.initScene('myOutputId', canvas)
  session.userShell.events.notify = (variant: string, message: string) => window.alert(message)
  session.userShell.events.unresponsive = (compositorSurface, unresponse) => {
    if (unresponse) {
      const disconnectButton = document.createElement('button')
      disconnectButton.id = JSON.stringify(compositorSurface)
      disconnectButton.textContent = `Client: ${compositorSurface.client.id} unresponsive. Force disconnect?`
      disconnectButton.onclick = () => {
        session.userShell.actions.closeClient(compositorSurface.client)
        disconnectButton.remove()
      }
      document.body.appendChild(disconnectButton)
    } else {
      document.getElementById(JSON.stringify(compositorSurface))?.remove()
    }
  }

  const remoteSocket = createCompositorRemoteSocket(session)
  const compositorProxyConnector = createCompositorProxyConnector(session, remoteSocket)

  const connect8081Button: HTMLButtonElement = document.createElement('button')
  connect8081Button.textContent = `connect to ws://localhost:8081?compositorSessionId=${compositorSessionId}`

  connect8081Button.onclick = () => {
    const compositorProxyURL = new URL('ws://localhost:8081')
    compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
    compositorProxyConnector.connectTo(compositorProxyURL)
  }

  const connect8082Button: HTMLButtonElement = document.createElement('button')
  connect8082Button.textContent = `connect to ws://192.168.0.194:8081?compositorSessionId=${compositorSessionId}`

  connect8082Button.onclick = () => {
    const compositorProxyURL = new URL('ws://192.168.0.194:8081')
    compositorProxyURL.searchParams.append('compositorSessionId', compositorSessionId)
    compositorProxyConnector.connectTo(compositorProxyURL)
  }

  const container: HTMLDivElement = document.createElement('div')
  container.appendChild(connect8081Button)
  container.appendChild(connect8082Button)

  // make compositor global protocol objects available to client
  session.globals.register()

  // show the html elements on the user's screen
  document.body.appendChild(canvas)
  document.body.appendChild(container)
}

window.onload = () => main()
