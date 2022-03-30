import { App, HttpRequest, HttpResponse, us_listen_socket } from 'uWebSockets.js'
import { UWebSocketLike } from './UWebSocketLike'
import { CloseEventLike, MessageEventLike, ReadyState } from 'retransmitting-websocket'
import { CompositorProxySession } from './CompositorProxySession'
import {
  DELWebFD,
  GETWebFD,
  GETWebFDStream,
  webSocketOpen,
  POSTMkFifo,
  POSTMkstempMmap,
  PUTWebFDStream,
} from './AppController'

function withParams(
  paramCount: number,
  fdAction: (
    compositorProxySession: CompositorProxySession,
    res: HttpResponse,
    req: HttpRequest,
    params: string[],
  ) => void,
) {
  return (compositorProxySession: CompositorProxySession, res: HttpResponse, req: HttpRequest) => {
    const params: string[] = new Array<string>(paramCount)
    for (let i = 0; i < paramCount; i++) {
      params[i] = req.getParameter(i)
    }
    fdAction(compositorProxySession, res, req, params)
  }
}

function withAuth(
  compositorProxySession: CompositorProxySession,
  authorizedAction: (compositorProxySession: CompositorProxySession, res: HttpResponse, req: HttpRequest) => void,
) {
  return (res: HttpResponse, req: HttpRequest) => {
    if (req.getHeader('x-compositor-session-id') === compositorProxySession.compositorSessionId) {
      authorizedAction(compositorProxySession, res, req)
    } else {
      res
        .writeStatus('401 Unauthorized')
        .writeHeader('Content-Type', 'text/plain')
        .end('No or invalid x-compositor-session-id header.')
    }
  }
}

export function createApp(
  compositorProxySession: CompositorProxySession,
  { host, port }: { host: string; port: number },
): Promise<us_listen_socket> {
  return new Promise<us_listen_socket>((resolve, reject) => {
    App()
      .post('/mkfifo', withAuth(compositorProxySession, POSTMkFifo))
      .post('/mkstemp-mmap', withAuth(compositorProxySession, POSTMkstempMmap))
      .get('/webfd/:fd', withAuth(compositorProxySession, withParams(1, GETWebFD)))
      .del('/webfd/:fd', withAuth(compositorProxySession, withParams(1, DELWebFD)))
      .get('/webfd/:fd/stream', withAuth(compositorProxySession, withParams(1, GETWebFDStream)))
      .put('/webfd/:fd/stream', withAuth(compositorProxySession, withParams(1, PUTWebFDStream)))
      .ws('/', {
        // TODO set some more sensible numbers & implement backpressure when sending over websocket
        // sendPingsAutomatically: 10000,
        // maxPayloadLength: 4194304,
        // maxBackpressure: 4194304,
        upgrade: (res, req, context) => {
          /* This immediately calls open handler, you must not use res after this call */
          res.upgrade(
            {
              searchParams: new URLSearchParams(req.getQuery()),
            },
            /* Spell these correctly */
            req.getHeader('sec-websocket-key'),
            req.getHeader('sec-websocket-protocol'),
            req.getHeader('sec-websocket-extensions'),
            context,
          )
        },
        open(ws) {
          const uWebSocketLike = new UWebSocketLike(ws)
          ws.websocketlike = uWebSocketLike
          webSocketOpen(compositorProxySession, uWebSocketLike, ws.searchParams)
        },
        message(ws, message) {
          const messageEventLike: MessageEventLike = {
            type: 'message',
            // TODO see if we can remove this copy
            // we need to copy the data as uwebsocket will free the data as soon as this function exits, regardless of any references to it...
            data: message.slice(0),
            target: ws.websocketlike,
          }
          ws.websocketlike.emit('message', messageEventLike)
        },
        close(ws, code, message) {
          ws.websocketlike.readyState = ReadyState.CLOSING
          const closeEventLike: CloseEventLike = {
            type: 'close',
            code,
            reason: Buffer.from(message).toString(),
            target: ws.websocketlike,
            wasClean: code === 1000,
          }
          ws.websocketlike.emit('close', closeEventLike)
          ws.websocketlike.readyState = ReadyState.CLOSED
        },
      })
      .listen(host, port, (listenSocket) => {
        if (listenSocket) {
          resolve(listenSocket)
        } else {
          reject(new Error(`Failed to start compositor proxy on host: ${host} with port ${port}`))
        }
      })
  })
}
