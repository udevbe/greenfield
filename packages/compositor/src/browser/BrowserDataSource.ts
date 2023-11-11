import { DataSource } from '../DataSource'
import { WlDataDeviceManagerDndAction } from '@gfld/compositor-protocol'
import DataOffer from '../DataOffer'
import { InputOutputFD } from '../InputOutput'
import { webInputOutput } from '../web/WebInputOutput'

export function createBrowserDataSource(offers: ClipboardItems): DataSource {
  const mimeTypes = offers.flatMap((offer) => offer.types)
  if (mimeTypes.includes('text/plain')) {
    mimeTypes.push('text/plain;charset=utf-8')
  }
  return new BrowserDataSource(offers, mimeTypes)
}

export class BrowserDataSource implements DataSource {
  readonly inputOutput = webInputOutput
  accepted = false
  compositorAction = WlDataDeviceManagerDndAction.none
  currentDndAction = WlDataDeviceManagerDndAction.none
  dataOffer?: DataOffer
  dndActions = 0
  setSelection = false
  readonly version = 3

  private destroyListeners: (() => void)[] = []
  // @ts-ignore
  private destroyResolve: (value: void | PromiseLike<void>) => void
  private destroyPromise = new Promise<void>((resolve) => (this.destroyResolve = resolve))

  constructor(
    private readonly offers: ClipboardItems,
    public mimeTypes: string[],
  ) {
    this.destroyPromise.then(() => this.destroyListeners.forEach((listener) => listener()))
  }

  send(mimeType: string, ioFD: InputOutputFD) {
    mimeType = mimeType === 'text/plain;charset=utf-8' ? 'text/plain' : mimeType
    const matchingOffer = this.offers.find((offer) => offer.types.includes(mimeType))
    if (matchingOffer) {
      matchingOffer
        .getType(mimeType)
        .then((offerData) => {
          if (offerData) {
            return ioFD.write(offerData)
          }
        })
        .then(() => ioFD.close())
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
