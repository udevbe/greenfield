import Session from '../Session'
import { Seat } from '../Seat'
import { DataSource } from '../DataSource'

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
    const dataSourceMimeTypes = dataSource.mimeTypes

    const clipboardData = Object.fromEntries(
      dataSourceMimeTypes
        .filter((mimeType) => allowedMimeTypes.includes(mimeType))
        .map((mimeType) => [mimeType, blobFromDataSource(mimeType, dataSource)]),
    )

    navigator.clipboard.write([new ClipboardItem(clipboardData)])
  } else {
    navigator.clipboard.write([])
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
