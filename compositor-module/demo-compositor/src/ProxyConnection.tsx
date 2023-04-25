import { CompositorSession, RemoteClientConnectionListener } from '../../src'
import { useState } from 'preact/compat'
import { Signal } from '@preact/signals'
import { ClientProps } from './Client'

function ConnectionStateIcon(props: { state: RemoteClientConnectionListener['state'] }) {
  switch (props.state) {
    case 'open':
      return <span class="app-state">🟩 </span>
    case 'connecting':
      return <>⌛</>
    case 'closing':
    case 'closed':
    default:
      return <span class="app-state">🟥 </span>
  }
}

export type ProxyConnectionProps = {
  session: CompositorSession
  url: URL
  name: string
  proxyListener: RemoteClientConnectionListener
  clients: Signal<ClientProps[]>
  remove: () => void
  identity: string
}
export function ProxyConnection(props: ProxyConnectionProps) {
  const [connectionState, setConnectionState] = useState(props.proxyListener.state)
  props.proxyListener.onConnectionStateChange = (state) => {
    setConnectionState(state)
  }
  props.proxyListener.onClient = (client) => {
    props.clients.value = [
      ...props.clients.value,
      {
        id: client.id,
        unresponsive: new Signal(false),
        onClose: () => {
          props.session.userShell.actions.closeClient(client)
        },
        origin: props.name,
      },
    ]
  }

  return (
    <div class="compositor-proxy-connection">
      <ConnectionStateIcon state={connectionState} />
      <span class="app-url">{props.name}</span>
      <button class="app-close" onClick={props.remove}>
        🗑️
      </button>
    </div>
  )
}
