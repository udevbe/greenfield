import { Signal } from '@preact/signals'
import { CompositorSession, WebCompositorConnector } from '../../src'
import { WebApp, WebAppProps } from './WebApp'
import { ClientProps } from './Client'
import { useCallback } from 'preact/compat'

const webApps = new Signal([] as WebAppProps[])

function launchWebApp(
  session: CompositorSession,
  webConnector: WebCompositorConnector,
  clients: Signal<ClientProps[]>,
  connectionURL: string,
) {
  const url = new URL(
    connectionURL.startsWith('http://') || connectionURL.startsWith('https://')
      ? connectionURL
      : `http://${connectionURL}`,
  )
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

export type WebAppLauncherProps = {
  session: CompositorSession
  webConnector: WebCompositorConnector
  clients: Signal<ClientProps[]>
}
export function WebAppLauncher(props: WebAppLauncherProps) {
  const onKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        event.target &&
        event.target instanceof HTMLInputElement &&
        event.target.value.trim() !== ''
      ) {
        launchWebApp(props.session, props.webConnector, props.clients, event.target.value)
        event.target.value = ''
      }
    },
    [launchWebApp, props],
  )

  return (
    <div>
      <form
        onSubmit={(ev) => {
          ev.preventDefault()
        }}
      >
        <input type="text" name="launch" onKeyPress={onKeyPress} placeholder="🌐 type a URL" />
      </form>
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
