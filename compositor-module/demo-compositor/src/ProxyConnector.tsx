import { Signal, signal } from '@preact/signals'
import { ProxyConnection, ProxyConnectionProps } from './ProxyConnection'
import { CompositorSession, RemoteCompositorConnector } from '../../src'
import { ClientProps } from './Client'

const connections = signal([] as ProxyConnectionProps[])
const connectionURL = signal('localhost:8081')

function removeConnection(url: URL) {
  connections.value = connections.value.filter((connection) => connection.url.href !== url.href)
}

function addConnection(
  session: CompositorSession,
  compositorProxyConnector: RemoteCompositorConnector,
  clients: Signal<ClientProps[]>,
) {
  const url = new URL(`ws://${connectionURL.value}`)
  url.searchParams.append('compositorSessionId', session.compositorSessionId)

  if (connections.value.find((connection) => connection.url.href === url.href)) {
    return
  }

  connections.value = [
    ...connections.value,
    {
      session,
      url,
      name: connectionURL.value,
      proxyListener: compositorProxyConnector.listen(url),
      remove: () => {
        removeConnection(url)
      },
      clients,
    },
  ]
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
    <div class="compositor-proxy-connector">
      <input type="text" name="launch" value={connectionURL} onInput={onInput} onKeyUp={onKeyUp} />
      <div class="compositor-proxy-connections">
        <ul class="proxy-connection">
          {connections.value.map((connection) => (
            <li>
              <ProxyConnection {...connection} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
