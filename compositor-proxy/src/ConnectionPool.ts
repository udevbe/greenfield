import { RetransmittingWebSocket, WebSocketLike } from 'retransmitting-websocket'
import { ReadyState } from 'retransmitting-websocket'

const boundConnections: Record<string, RetransmittingWebSocket> = {}
const unboundConnections: RetransmittingWebSocket[] = []

export function upsertWebSocket(
  connectionId: string,
  webSocketLike: WebSocketLike,
): { retransmittingWebSocket: RetransmittingWebSocket; isNew: boolean } {
  let retransmittingWebSocket = boundConnections[connectionId]
  const isNew = retransmittingWebSocket === undefined
  if (isNew) {
    retransmittingWebSocket = unboundConnections.shift() ?? new RetransmittingWebSocket()
    boundConnections[connectionId] = retransmittingWebSocket
    retransmittingWebSocket.addEventListener('close', () => {
      delete boundConnections[connectionId]
    })
  }
  retransmittingWebSocket.useWebSocket(webSocketLike)

  return { retransmittingWebSocket, isNew }
}

export function registerUnboundClientConnection(retransmittingWebSocket: RetransmittingWebSocket) {
  unboundConnections.push(retransmittingWebSocket)
}

export function closeAllWebSockets(): Promise<void[]> {
  const allWebSocket = [...Object.values(boundConnections), ...unboundConnections]
  return Promise.all(
    allWebSocket
      .filter(
        (retransmittingWebSocket: RetransmittingWebSocket) =>
          retransmittingWebSocket.readyState === ReadyState.OPEN ||
          retransmittingWebSocket.readyState === ReadyState.CONNECTING,
      )
      .map(
        (retransmittingWebSocket: RetransmittingWebSocket) =>
          new Promise<void>((resolve) => {
            retransmittingWebSocket.addEventListener('close', () => resolve())
            retransmittingWebSocket.close()
          }),
      ),
  )
}
