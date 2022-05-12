import { DataSource } from '../DataSource'

export function createBrowserDataSource(offers: ClipboardItems): DataSource {
  return new BrowserDataSource()
}

class BrowserDataSource implements DataSource {
  accepted: boolean
  readonly client: Client
  compositorAction: WlDataDeviceManagerDndAction
  currentDndAction: WlDataDeviceManagerDndAction
  dndActions: number
  mimeTypes: string[]
  setSelection: boolean
  readonly version: 3 | number

  accept(mimeType: string | undefined): void {}

  action(action: WlDataDeviceManagerDndAction): void {}

  addDestroyListener(destroyListener: () => void): void {}

  cancel(force?: boolean): void {}

  destroyDataSource(): void {}

  dndDropPerformed(): void {}

  notifyFinish(): void {}

  onDestroy(): Promise<void> {
    return Promise.resolve(undefined)
  }

  removeDestroyListener(destroyListener: () => void): void {}

  send(mimeType: string, gWebFD: GWebFD): void {}
}
