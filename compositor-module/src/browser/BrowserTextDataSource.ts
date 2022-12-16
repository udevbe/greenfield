import { DataSource } from '../DataSource'
import { WlDataDeviceManagerDndAction } from 'westfield-runtime-server'
import DataOffer from '../DataOffer'
import { InputOutputFD } from '../InputOutput'
import { webInputOutput } from '../web/WebInputOutput'

const textEncoder = new TextEncoder()

export function createBrowserTextDataSource(offer: string): DataSource {
  return new BrowserTextDataSource(offer)
}

export class BrowserTextDataSource implements DataSource {
  readonly inputOutput = webInputOutput
  accepted = false
  compositorAction = WlDataDeviceManagerDndAction.none
  currentDndAction = WlDataDeviceManagerDndAction.none
  dataOffer?: DataOffer
  dndActions = 0
  setSelection = false
  readonly version = 3
  public mimeTypes = ['text/plain;charset=utf-8', 'text/plain']

  private destroyListeners: (() => void)[] = []
  // @ts-ignore
  private destroyResolve: (value: void | PromiseLike<void>) => void
  private destroyPromise = new Promise<void>((resolve) => (this.destroyResolve = resolve))

  constructor(private readonly offer: string) {
    this.destroyPromise.then(() => this.destroyListeners.forEach((listener) => listener()))
  }

  send(mimeType: string, gWebFD: InputOutputFD) {
    const matchingOffer = this.mimeTypes.includes(mimeType)
    if (matchingOffer) {
      gWebFD.write(new Blob([textEncoder.encode(this.offer)])).then(() => gWebFD.close())
    }
  }

  accept(mimeType: string | undefined): void {
    // noop
  }

  action(action: WlDataDeviceManagerDndAction): void {
    // noop
  }

  cancel(force?: boolean): void {
    // noop
  }

  dndDropPerformed(): void {
    // noop
  }

  notifyFinish(): void {
    this.dataOffer = undefined
  }

  addDestroyListener(destroyListener: () => void): void {
    this.destroyListeners.push(destroyListener)
  }

  destroyDataSource(): void {
    this.destroyResolve()
  }

  onDestroy(): Promise<void> {
    return this.destroyPromise
  }

  removeDestroyListener(destroyListener: () => void): void {
    this.destroyListeners = this.destroyListeners.filter((listener) => listener !== destroyListener)
  }
}
