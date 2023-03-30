import { Signal } from '@preact/signals'

export type ClientProps = {
  readonly id: string
  unresponsive: Signal<boolean>
  readonly onClose: () => void
  readonly origin: string
}
export function Client(props: ClientProps) {
  return (
    <div class="client">
      {props.origin}
      <div>
        {props.unresponsive ? 'App not responding' : null}
        <button onClick={props.onClose}>🗑️</button>
      </div>
    </div>
  )
}
