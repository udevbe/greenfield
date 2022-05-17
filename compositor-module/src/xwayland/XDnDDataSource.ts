import { DataSource } from '../DataSource'
import { WlDataDeviceManagerDndAction } from 'westfield-runtime-server'
import DataOffer from '../DataOffer'
import { ClientMessageEvent, EventMask, marshallClientMessageEvent, SendEventDest, Time, Window } from 'xtsb'
import { GWebFD } from '../WebFS'
import { XWindowManager } from './XWindowManager'

export function createXDnDDataSource(xWindowManager: XWindowManager, window: Window, version: number) {
  return new XDnDDataSource(xWindowManager, window, version)
}

export class XDnDDataSource implements DataSource {
  accepted = false
  compositorAction = WlDataDeviceManagerDndAction.none
  currentDndAction = WlDataDeviceManagerDndAction.none
  dataOffer?: DataOffer
  dndActions = 0
  mimeTypes: string[] = []
  setSelection = false

  private destroyListeners: (() => void)[] = []
  // @ts-ignore
  private destroyResolve: (value: void | PromiseLike<void>) => void
  private destroyPromise = new Promise<void>((resolve) => (this.destroyResolve = resolve))

  constructor(
    private readonly xWindowManager: XWindowManager,
    public readonly window: Window,
    readonly version: number,
    readonly webfs = xWindowManager.client.userData.webfs,
  ) {
    this.destroyPromise.then(() => this.destroyListeners.forEach((listener) => listener()))
  }

  accept(mimeType: string | undefined) {
    /* FIXME: If we rewrote UTF8_STRING to
     * text/plain;charset=utf-8 and the source doesn't support the
     * mime-type, we'll have to rewrite the mime-type back to
     * UTF8_STRING here. */

    const clientMessage = marshallClientMessageEvent({
      responseType: ClientMessageEvent,
      _type: this.xWindowManager.atoms.XdndStatus,
      format: 32,
      window: this.xWindowManager.dndWindow,
      data: {
        data32: new Uint32Array([
          this.xWindowManager.dndWindow,
          mimeType ? 3 : 2,
          0,
          0,
          this.xWindowManager.atoms.XdndActionCopy,
        ]),
      },
    })
    this.xWindowManager.xConnection.sendEvent(
      0,
      // FIXME in weston dndOwner is never set... so it's always zero which makes it the pointer window?!
      // this.xWindowManager.dndOwner,
      SendEventDest.PointerWindow,
      EventMask.SubstructureRedirect,
      new Int8Array(clientMessage),
    )
  }

  send(mimeType: string, gWebFD: GWebFD) {
    this.xWindowManager.xConnection.convertSelection(
      this.xWindowManager.selectionWindow,
      this.xWindowManager.atoms.XdndSelection,
      this.xWindowManager.atoms.UTF8_STRING,
      this.xWindowManager.atoms._WL_SELECTION,
      Time.CurrentTime,
    )
    this.xWindowManager.xConnection.flush()

    this.xWindowManager.dataSourceFd = gWebFD
  }

  cancel(force?: boolean) {
    // no-op
  }

  action(action: WlDataDeviceManagerDndAction): void {
    // no-op
  }

  dndDropPerformed(): void {
    // no-op
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
