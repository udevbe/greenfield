import { Signal } from '@preact/signals'

export type WindowProps = {
  appId: Signal<string>
  readonly clientId: string
  readonly id: number
  readonly onClose: () => void
  readonly origin: string
  title: Signal<string>
  unresponsive: Signal<boolean>
}

export function Window(props: WindowProps) {
  return (
    <div>
      <div class="font-medium">{props.title}</div>
      <div class="text-xs font-thin">{props.origin}</div>
      {props.unresponsive.value ? <button onClick={props.onClose}>not responding 🗑️</button> : null}
    </div>
  )
}
