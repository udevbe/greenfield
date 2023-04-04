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
    <div class="window-container">
      <div class="window-title">{props.title}</div>
      <div class="window-origin">{props.origin}</div>
      {props.unresponsive.value ? (
        <button class="window-close" onClick={props.onClose}>
          not responding 🗑️
        </button>
      ) : null}
    </div>
  )
}
