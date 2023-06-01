import { AppContext, CompositorSession } from '../../src'
import { useState } from 'preact/compat'
import { Signal } from '@preact/signals'
import { ClientProps } from './Client'

function CloseIcon() {
  return (
    <svg width="1.25rem" height="1.25rem" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)">
        <circle cx="8.5" cy="8.5" r="8" />
        <g transform="matrix(0 1 -1 0 17 0)">
          <path d="m5.5 11.5 6-6" />
          <path d="m5.5 5.5 6 6" />
        </g>
      </g>
    </svg>
  )
}

function ConnectionStateIcon(props: { state: AppContext['state'] }) {
  switch (props.state) {
    case 'open':
      return <div class="max-h-[1.25rem] min-w-[1.25rem] rounded-full bg-lime-500"></div>
    case 'connecting':
      return <>⌛</>
    case 'error':
      return <>💀</>
    case 'closed':
    default:
      return <div class="min-w-[1.125rem] rounded-full bg-pink-500"></div>
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
    <div class="mt-2 flex max-w-[100%] content-center rounded-full border-2 border-gray-500 bg-gray-50 p-1 text-sm">
      <ConnectionStateIcon state={connectionState} />
      <div class="flex grow flex-col justify-center truncate pl-1">
        <span>{props.name}</span>
      </div>
      <button class="rounded-full stroke-current hover:text-pink-700" onClick={props.close}>
        <CloseIcon />
      </button>
    </div>
  )
}
