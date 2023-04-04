import { Signal } from '@preact/signals'

export type WebAppProps = { url: URL; onClose: () => void; loaded: Signal<boolean> }

export function WebApp(props: WebAppProps) {
  return (
    <div class="web-app">
      {props.loaded.value ? <span class="app-state">🟩 </span> : <span class="app-state">🟥 </span>}
      <span class="app-url">{props.url.href}</span>
      <button class="app-close" onClick={props.onClose}>
        🗑️
      </button>
    </div>
  )
}
