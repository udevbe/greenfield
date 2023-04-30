import { Signal, signal } from '@preact/signals'
import { ProxyConnection, ProxyConnectionProps } from './ProxyConnection'
import { CompositorSession, RemoteClientConnectionListener, RemoteCompositorConnector } from '../../src'
import { ClientProps } from './Client'

const connections = signal([] as ProxyConnectionProps[])
const connectionURL = signal('localhost:8081')

function removeConnection(removedConnectionProps: ProxyConnectionProps, proxyListener: RemoteClientConnectionListener) {
  proxyListener.close()
  connections.value = connections.value.filter((connection) => connection !== removedConnectionProps)
}

function addConnection(
  session: CompositorSession,
  compositorProxyConnector: RemoteCompositorConnector,
  clients: Signal<ClientProps[]>,
) {
  const url = new URL(connectionURL.value)
  url.searchParams.append('compositorSessionId', session.compositorSessionId)

  const proxyListener = compositorProxyConnector.launch(url)
  const proxyConnectionProps: ProxyConnectionProps = {
    session,
    url,
    name: connectionURL.value,
    proxyListener,
    remove: () => {
      removeConnection(proxyConnectionProps, proxyListener)
    },
    clients,
    proxySessionKey: proxyListener.proxySessionKey ?? '',
  }

  connections.value = [...connections.value, proxyConnectionProps]

  proxyListener.remoteIdentityChanged = (remoteIdentity) => {
    proxyConnectionProps.proxySessionKey = remoteIdentity
    connections.value = [...connections.value]
  }
}

function onInput(event: Event) {
  if (event.target && event.target instanceof HTMLInputElement) {
    connectionURL.value = event.target.value
  }
}

export type ProxyConnectorProps = {
  session: CompositorSession
  proxyConnector: RemoteCompositorConnector
  clients: Signal<ClientProps[]>
}

export function ProxyConnector(props: ProxyConnectorProps) {
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addConnection(props.session, props.proxyConnector, props.clients)
    }
  }

  return (
    <div>
      <label class="launch-input-label">
        🖥️ <input type="text" value={connectionURL} onInput={onInput} onKeyUp={onKeyUp} />
      </label>
      <div>
        <ul>
          {connections.value.map((connection) => (
            <li>
              <ProxyConnection key={connection.proxySessionKey} {...connection} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
