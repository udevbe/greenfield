import { AppContext, CompositorSession } from '../../src'
import { useState } from 'preact/compat'
import { Signal } from '@preact/signals'
import { ClientProps } from './Client'

function ConnectionStateIcon(props: { state: AppContext['state'] }) {
  switch (props.state) {
    case 'open':
      return <span class="app-state">🟩 </span>
    case 'connecting':
      return <>⌛</>
    case 'error':
      return <>💀</>
    case 'closed':
    default:
      return <span class="app-state">🟥 </span>
  }
}

export type ProxyConnectionProps = {
  session: CompositorSession
  url: URL
  name: string
  appContext: AppContext
  clients: Signal<ClientProps[]>
  close: () => void
  proxySessionKey: string
  onStateChange: (state: AppContext['state']) => void
}

export function ProxyApplication(props: ProxyConnectionProps) {
  const [connectionState, setConnectionState] = useState(props.appContext.state)
  props.appContext.onStateChange = (state) => {
    setConnectionState(state)
    props.onStateChange(state)
  }
  props.appContext.onClient = (client) => {
    props.clients.value = [
      ...props.clients.value,
      {
        id: client.id,
        unresponsive: new Signal(false),
        onClose: props.close,
        origin: props.name,
      },
    ]
  }

  return (
    <div class="compositor-proxy-connection">
      <ConnectionStateIcon state={connectionState} />
      <span class="app-url">{props.name}</span>
      <button class="app-close" onClick={props.close}>
        ✖
      </button>
    </div>
  )
}