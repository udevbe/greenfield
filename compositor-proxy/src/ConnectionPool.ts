import { RetransmittingWebSocket, WebSocketLike } from 'retransmit.js'

const connections: Record<string, RetransmittingWebSocket> = {}

export function upsertWebSocket(
  connectionId: string,
  webSocketLike: WebSocketLike,
): { retransmittingWebSocket: RetransmittingWebSocket; isNew: boolean } {
  let retransmittingWebSocket = connections[connectionId]
  const isNew = retransmittingWebSocket === undefined
  if (isNew) {
    retransmittingWebSocket = new RetransmittingWebSocket()
    // FIXME when to cleanup/delete the retransmitting websocket?
    connections[connectionId] = retransmittingWebSocket
  }
  retransmittingWebSocket.useWebSocket(webSocketLike)

  return { retransmittingWebSocket, isNew }
}
