import { Signal } from '@preact/signals'
import { CompositorSession, WebCompositorConnector } from '../../src'
import { WebApp, WebAppProps } from './WebApp'
import { ClientProps } from './Client'

const webAppURL = new Signal('http://localhost:9000')
const webApps = new Signal([] as WebAppProps[])

function launchWebApp(
  session: CompositorSession,
  webConnector: WebCompositorConnector,
  clients: Signal<ClientProps[]>,
) {
  const url = new URL(webAppURL.value)
  const webAppListener = webConnector.launch(url)
  const webApp: WebAppProps = { url, onClose: () => webAppListener.close(), loaded: new Signal(false) }
  webApps.value = [...webApps.value, webApp]
  webAppListener.onClose = () => {
    webApps.value = webApps.value.filter((otherWebApp) => otherWebApp !== webApp)
  }

  webAppListener.onNeedIFrameAttach = (webAppFrame) => {
    document.body.appendChild(webAppFrame)
  }

  webAppListener.onClient = (client) => {
    webApp.loaded.value = true
    clients.value = [
      ...clients.value,
      {
        id: client.id,
        unresponsive: new Signal(false),
        onClose: () => {
          session.userShell.actions.closeClient(client)
        },
        origin: url.href,
      },
    ]
  }
}

function onInput(event: Event) {
  if (event.target && event.target instanceof HTMLInputElement) {
    webAppURL.value = event.target.value
  }
}

export type WebAppLauncherProps = {
  session: CompositorSession
  webConnector: WebCompositorConnector
  clients: Signal<ClientProps[]>
}
export function WebAppLauncher(props: WebAppLauncherProps) {
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      launchWebApp(props.session, props.webConnector, props.clients)
    }
  }

  return (
    <div>
      <label class="launch-input-label">
        🌐 <input type="text" name="launch" value={webAppURL} onInput={onInput} onKeyUp={onKeyUp} />
      </label>
      <div>
        <ul>
          {webApps.value.map((webApp) => (
            <li>
              <WebApp {...webApp} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
