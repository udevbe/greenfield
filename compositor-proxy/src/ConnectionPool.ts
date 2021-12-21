import { RetransmittingWebSocket, WebSocketLike } from 'retransmitting-websocket'

const connections: Record<string, RetransmittingWebSocket> = {}

export function upsertWebSocket(
  connectionId: string,
  webSocketLike: WebSocketLike,
  config?: ConstructorParameters<typeof RetransmittingWebSocket>[0],
): { retransmittingWebSocket: RetransmittingWebSocket; isNew: boolean } {
  let retransmittingWebSocket = connections[connectionId]
  const isNew = retransmittingWebSocket === undefined
  if (isNew) {
    retransmittingWebSocket = new RetransmittingWebSocket(config)
    // FIXME when to cleanup/delete the retransmitting websocket?
    connections[connectionId] = retransmittingWebSocket
    retransmittingWebSocket.addEventListener('close', () => {
      delete connections[connectionId]
    })
  }
  retransmittingWebSocket.useWebSocket(webSocketLike)

  return { retransmittingWebSocket, isNew }
}
