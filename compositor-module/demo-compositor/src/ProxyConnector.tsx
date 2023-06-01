import { Signal, signal } from '@preact/signals'
import { ProxyApplication, ProxyConnectionProps } from './ProxyApplication'
import { AppContext, AppLauncher, CompositorSession } from '../../src'
import { ClientProps } from './Client'
import { useCallback } from 'preact/compat'

const connections = signal([] as ProxyConnectionProps[])

function handleNewAppContext(
  appContext: AppContext,
  session: CompositorSession,
  url: URL,
  clients: Signal<ClientProps[]>,
) {
  const proxyConnectionProps: ProxyConnectionProps = {
    session,
    url,
    name: url.href,
    appContext,
    close: () => {
      appContext.close()
    },
    clients,
    proxySessionKey: appContext.key ?? '',
    onStateChange: (state) => {
      if (state === 'terminated' || state === 'error') {
        connections.value = connections.value.filter((connection) => connection !== proxyConnectionProps)
      }
    },
  }

  connections.value = [...connections.value, proxyConnectionProps]

  appContext.onKeyChanged = (key) => {
    proxyConnectionProps.proxySessionKey = key
    connections.value = [...connections.value]
  }
}

function addConnection(
  session: CompositorSession,
  compositorProxyConnector: AppLauncher,
  clients: Signal<ClientProps[]>,
  connectionURL: string,
) {
  const url = new URL(
    connectionURL.startsWith('http://') || connectionURL.startsWith('https://')
      ? connectionURL
      : `http://${connectionURL}`,
  )

  const appContext = compositorProxyConnector.launch(url, (childAppContext) => {
    handleNewAppContext(childAppContext, session, url, clients)
  })

  handleNewAppContext(appContext, session, url, clients)
}

export type ProxyConnectorProps = {
  session: CompositorSession
  appLauncher: AppLauncher
  clients: Signal<ClientProps[]>
}

export function ProxyConnector(props: ProxyConnectorProps) {
  const onKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        event.target &&
        event.target instanceof HTMLInputElement &&
        event.target.value.trim() !== ''
      ) {
        addConnection(props.session, props.appLauncher, props.clients, event.target.value)
        event.target.value = ''
      }
    },
    [addConnection, props],
  )

  return (
    <div>
      <input
        class="w-full rounded-full border-2 border-gray-500 bg-gray-50 p-1 pl-3 text-sm outline-cyan-500"
        type="text"
        onKeyPress={onKeyPress}
        placeholder="🖥️ type a URL"
        name="remote"
      />
      <div class="flex list-none flex-col">
        {connections.value.map((connection) => (
          <ProxyApplication key={connection.proxySessionKey} {...connection} />
        ))}
      </div>
    </div>
  )
}
