import { DataSource } from '../../DataSource'
import DataOffer from '../../DataOffer'
import { WlDataDeviceManagerDndAction } from '@gfld/compositor-protocol'
import { XWindowManager } from './XWindowManager'
import { Time } from '@gfld/xtsb'
import { InputOutputFD } from '../../InputOutput'

export function createXDataSource(xWindowManager: XWindowManager): XDataSource {
  return new XDataSource(xWindowManager)
}

export class XDataSource implements DataSource {
  accepted = false
  compositorAction = WlDataDeviceManagerDndAction.none
  currentDndAction = WlDataDeviceManagerDndAction.none
  dataOffer?: DataOffer
  dndActions = 0
  mimeTypes: string[] = []
  setSelection = false
  readonly version = 3

  private destroyListeners: (() => void)[] = []
  // @ts-ignore
  private destroyResolve: (value: void | PromiseLike<void>) => void
  private destroyPromise = new Promise<void>((resolve) => (this.destroyResolve = resolve))

  constructor(
    private readonly xWindowManager: XWindowManager,
    readonly inputOutput = xWindowManager.client.userData.inputOutput,
  ) {
    this.destroyPromise.then(() => this.destroyListeners.forEach((listener) => listener()))
  }

  accept(mimeType: string | undefined): void {
    // noop
  }

  send(mimeType: string, fd: InputOutputFD): void {
    if (mimeType === 'text/plain;charset=utf-8' || mimeType === 'text/plain') {
      this.xWindowManager.xConnection.convertSelection(
        this.xWindowManager.selectionWindow,
        this.xWindowManager.atoms.CLIPBOARD,
        this.xWindowManager.atoms.UTF8_STRING,
        this.xWindowManager.atoms._WL_SELECTION,
        Time.CurrentTime,
      )
      this.xWindowManager.xConnection.flush()
      this.xWindowManager.dataSourceFd = fd
    }
  }

  cancel(): void {
    // noop
  }

  action(action: WlDataDeviceManagerDndAction): void {
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
