import { Signal } from '@preact/signals'

export type ClientProps = {
  readonly id: string
  unresponsive: Signal<boolean>
  readonly onClose: () => void
  readonly origin: string
}
