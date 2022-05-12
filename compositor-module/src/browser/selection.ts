import Session from '../Session'
import { Seat } from '../Seat'
import { DataSource } from '../DataSource'

// The browser somehow has to support the clipboard mimetype (even though it doesn't do anything with the clipboard data...)
// *and* it also doesn't tell us which mimetypes it supports
// *and* each browser supports different mimetypes,
// so we just slim it down to the lowest common set of mimetypes... :(
const allowedMimeTypes = ['text/plain', 'text/html', 'image/png']

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
function handleBrowserDataSourceUpdate(offers: ClipboardItems) {
  // TODO handle browser clipboard offers
}

export async function initBrowserSelection(session: Session) {
  // Ideally we'd use a clipboardchange event but this is not yet implemented: https://bugs.chromium.org/p/chromium/issues/detail?id=933608
  window.addEventListener('focus', () => {
    navigator.clipboard
      .read()
      .then((offers) => handleBrowserDataSourceUpdate(offers))
      .catch((e) => {
        // TODO log error?
        // most likely the user denied clipboard access
        session.logger.warn(`Error while trying to access browser clipboard.`)
      })
  })

  session.globals.seat.selectionListeners.push(() => handleWaylandDataSourceUpdate(session.globals.seat))
}
