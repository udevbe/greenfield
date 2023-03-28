import { CompositorSession, RemoteClientConnectionListener } from '../../src'
import { useState } from 'preact/compat'
import { Signal } from '@preact/signals'
import { ClientProps } from './Client'

function ConnectionStateIcon(props: { state: RemoteClientConnectionListener['state'] }) {
  switch (props.state) {
    case 'open':
      return <>🟢</>
    case 'connecting':
      return <>⌛</>
    case 'closing':
    case 'closed':
    default:
      return <>🔴</>
  }
}

export type ProxyConnectionProps = {
  session: CompositorSession
  url: URL
  name: string
  proxyListener: RemoteClientConnectionListener
  clients: Signal<ClientProps[]>
  remove: () => void
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
        unresponsive: false,
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
      {props.name}
      <button onClick={props.remove}>🗑️</button>
    </div>
  )
}
