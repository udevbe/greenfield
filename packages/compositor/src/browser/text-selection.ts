import { Seat } from '../Seat'
import Session from '../Session'
import { BrowserTextDataSource, createBrowserTextDataSource } from './BrowserTextDataSource'
import { DataSource } from '../DataSource'

const allowedMimeType = 'text/plain'
let browserTextOffer: string | undefined
const textDecoder = new TextDecoder()

async function blobFromDataSource(mimeType: string, dataSource: DataSource): Promise<Blob> {
  const [readFD, writeFD] = await dataSource.inputOutput.mkfifo()
  dataSource.send(mimeType, writeFD)
  const dataBlob = await readFD.readBlob()
  return new Blob([dataBlob], { type: mimeType })
}

async function handleWaylandDataSourceTextUpdate(seat: Seat) {
  const dataSource = seat.selectionDataSource
  if (dataSource) {
    if (dataSource instanceof BrowserTextDataSource) {
      return
    }

    const hasText = dataSource.mimeTypes.includes('text/plain')
    if (hasText) {
      const dataSourceBlob = await blobFromDataSource(allowedMimeType, dataSource)
      const textArrayBuffer = await dataSourceBlob.arrayBuffer()
      const text = textDecoder.decode(textArrayBuffer)
      return navigator.clipboard.writeText(text)
    }
  }
  return navigator.clipboard.writeText('')
}

async function handleBrowserDataSourceTextUpdate(seat: Seat, text: string) {
  const isUpdated = browserTextOffer !== text
  if (isUpdated) {
    browserTextOffer = text
    seat.setSelectionInternal(createBrowserTextDataSource(text), seat.session.display.nextEventSerial())
  }
}

function checkBrowserClipboardText(session: Session) {
  navigator.clipboard
    .readText()
    .then((text) => handleBrowserDataSourceTextUpdate(session.globals.seat, text))
    .catch((e) => {
      if (e.code === 0) {
        // no data in clipboard is considered an error, but we don't consider it as one...
        return
      }
      throw e
    })
}

export function initBrowserTextSelection(session: Session) {
  if ('readText' in navigator.clipboard) {
    checkBrowserClipboardText(session)
    window.addEventListener('focus', () => checkBrowserClipboardText(session))
  }
  if ('writeText' in navigator.clipboard) {
    session.globals.seat.selectionListeners.push(() => handleWaylandDataSourceTextUpdate(session.globals.seat))
  }
}
