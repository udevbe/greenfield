import Session from '../Session'
import { Seat } from '../Seat'
import { DataSource } from '../DataSource'
import { createBrowserDataSource } from './BrowserDataSource'

// For reasons unknown, the browser has to support the clipboard mimetype (even though it doesn't do anything with the clipboard data...)
// *and* it also doesn't tell us which mimetypes it supports
// *and* each browser supports different mimetypes,
// so we just slim it down to the lowest common set of mimetypes... :(
const allowedMimeTypes = ['text/plain', 'text/html', 'image/png']

let browserOffers: ClipboardItems | undefined
let browserOffersTotalSize = 0

async function blobFromDataSource(mimeType: string, dataSource: DataSource): Promise<Blob> {
  const [readFD, writeFD] = await dataSource.client.userData.webfs.mkfifo()
  dataSource.send(mimeType, writeFD)
  dataSource.client.connection.flush()
  const dataBlob = await readFD.readBlob()
  return new Blob([dataBlob], { type: mimeType })
}

function handleWaylandDataSourceUpdate(seat: Seat) {
  const dataSource = seat.selectionDataSource
  if (dataSource) {
    const clipboardDataEntries = dataSource.mimeTypes
      .map((mimeType) => {
        for (const allowedMimeType of allowedMimeTypes) {
          if (mimeType.indexOf(allowedMimeType) !== -1) {
            return allowedMimeType
          }
        }
        return mimeType
      })
      .filter((mimeType) => allowedMimeTypes.includes(mimeType))
      .map((mimeType) => [mimeType, blobFromDataSource(mimeType, dataSource)])
    if (clipboardDataEntries.length === 0) {
      navigator.clipboard.writeText('')
    } else {
      navigator.clipboard.write([new ClipboardItem(Object.fromEntries(clipboardDataEntries))])
    }
  } else {
    navigator.clipboard.writeText('')
  }
}

async function updateBrowserOffers(newOffers: ClipboardItems) {
  // Compare offers with previous offers. If they have changed then we update the selection.
  // Ideally we'd use a clipboardchange event but this is not yet implemented: https://bugs.chromium.org/p/chromium/issues/detail?id=933608
  // so we have to resort to this hack.
  if (browserOffers) {
    if (browserOffers.length !== newOffers.length) {
      browserOffers = newOffers
      const offerBlobs = await Promise.all(
        newOffers.flatMap((newOffer) => newOffer.types.map((mimeType) => newOffer.getType(mimeType))),
      )
      browserOffersTotalSize = offerBlobs.reduce((total, newBlob) => total + newBlob.size, 0)
      return true
    }

    const browserOfferMimeTypes = browserOffers.flatMap((browserOffer) => browserOffer.types)
    const newOfferMimeTypes = newOffers.flatMap((browserOffer) => browserOffer.types)

    if (new Set([...browserOfferMimeTypes, ...newOfferMimeTypes]).size !== browserOfferMimeTypes.length) {
      browserOffers = newOffers
      const offerBlobs = await Promise.all(
        newOffers.flatMap((newOffer) => newOffer.types.map((mimeType) => newOffer.getType(mimeType))),
      )
      browserOffersTotalSize = offerBlobs.reduce((total, newBlob) => total + newBlob.size, 0)
      return true
    }

    const offerBlobs = await Promise.all(
      newOffers.flatMap((newOffer) => newOffer.types.map((mimeType) => newOffer.getType(mimeType))),
    )
    const newSize = offerBlobs.reduce((total, newBlob) => total + newBlob.size, 0)
    if (newSize !== browserOffersTotalSize) {
      browserOffers = newOffers
      browserOffersTotalSize = newSize
      return true
    }
  } else {
    browserOffers = newOffers
    return true
  }

  return false
}

async function handleBrowserDataSourceUpdate(seat: Seat, offers: ClipboardItems) {
  const isUpdated = await updateBrowserOffers(offers)
  if (isUpdated) {
    seat.setSelectionInternal(createBrowserDataSource(offers), seat.nextSerial())
  }
}

function checkBrowserClipboard(session: Session) {
  navigator.clipboard
    .read()
    .then((offers) => handleBrowserDataSourceUpdate(session.globals.seat, offers))
    .catch((e) => {
      if (e.code === 0) {
        // no data in clipboard is considered an error, but we don't consider it as one...
        return
      }
      console.log(e)
      // most likely the user denied clipboard access
      session.logger.warn(`Error while trying to access browser clipboard.`)
    })
}

export async function initBrowserSelection(session: Session) {
  checkBrowserClipboard(session)
  window.addEventListener('focus', () => checkBrowserClipboard(session))
  session.globals.seat.selectionListeners.push(() => handleWaylandDataSourceUpdate(session.globals.seat))
}
