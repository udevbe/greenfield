import { unlink } from 'fs/promises'

import { App, HttpRequest, HttpResponse, us_listen_socket, us_listen_socket_close } from 'uWebSockets.js'
import { CloseEventLike, MessageEventLike, WebSocketLike, ReadyState } from 'retransmitting-websocket'
import { createCompositorProxySession } from './CompositorProxySession'
import { config } from './config'
import { closeAllWebSockets, upsertWebSocket } from './ConnectionPool'
import { createLogger } from './Logger'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'
import { UWebSocketLike } from './UWebSocketLike'
import { Readable, Writable } from 'stream'
import { closeFd, fdAsReadStream, fdAsWriteStream } from './webfs/ProxyWebFS'

const compositorSessionId = process.env.COMPOSITOR_SESSION_ID

const logger = createLogger('main')

logger.info('Starting compositor proxy...')
if (compositorSessionId === undefined) {
  logger.error('env COMPOSITOR_SESSION_ID must be set.')
  process.exit(1)
}

const compositorProxySession = createCompositorProxySession(compositorSessionId)

function deleteStartingFile() {
  unlink('/var/run/compositor-proxy/starting').catch(() => {
    // deleting the starting file is not fatal
    // TODO log this?
  })
}

function handleWebSocketConnection(ws: WebSocketLike, searchParams: URLSearchParams) {
  if (searchParams.get('compositorSessionId') !== compositorSessionId) {
    const message = 'Bad or missing compositorSessionId query parameter.'
    logger.error(message)
    ws.close(4403, message)
    return
  }

  const connectionId = searchParams.get('connectionId')
  if (connectionId !== null) {
    const { retransmittingWebSocket, isNew } = upsertWebSocket(connectionId, ws)
    if (!isNew) {
      // reconnecting, no need to do anything
      return
    }

    if (searchParams.has('xwmFD')) {
      const wmFD = Number.parseInt(searchParams.get('xwmFD') ?? '0')
      compositorProxySession.handleXWMConnection(retransmittingWebSocket, wmFD)
    } else {
      compositorProxySession.handleConnection(retransmittingWebSocket)
    }
  } else {
    const message = 'Bad or missing query parameters.'
    logger.error(message)
    ws.close(4403, message)
  }
}

function pipeHttpRequestToWritable(httpResponse: HttpResponse, writable: Writable) {
  writable
    .on('drain', () => httpResponse.resume())
    // TODO log error
    .on('error', (err) => httpResponse.writeStatus('500 Internal Server Error').end())
    .on('finish', () => httpResponse.writeStatus('200 OK').end())

  httpResponse
    .onAborted(() => writable.end())
    .onData((chunk, isLast) => {
      if (!writable.write(chunk.slice(0))) {
        httpResponse.pause()
      } else if (isLast) {
        writable.end()
      }
    })
}

function pipeReadableToHttpResponse(httpResponse: HttpResponse, readable: Readable) {
  let lastOffset = 0
  let dataChunk: Uint8Array | undefined = undefined

  httpResponse
    .onAborted(() => readable.destroy())
    .onWritable((newOffset: number) => {
      if (dataChunk === undefined) {
        return true
      }

      const offsetIncrement = newOffset - lastOffset
      dataChunk = new Uint8Array(
        dataChunk.buffer,
        dataChunk.byteOffset + offsetIncrement,
        dataChunk.byteLength - offsetIncrement,
      )
      const ok = httpResponse.write(dataChunk)
      if (ok) {
        dataChunk = undefined
        readable.resume()
      }

      return ok
    })

  readable
    // TODO log error
    .on('error', (error) => httpResponse.writeStatus('500 Internal Server Error').end())
    .on('end', () => httpResponse.writeStatus('200 OK').end())
    .on('data', (chunk) => {
      dataChunk = chunk
      lastOffset = httpResponse.getWriteOffset()
      if (!httpResponse.write(chunk)) {
        readable.pause()
      }
    })
}

function withFdParam(fdAction: (res: HttpResponse, req: HttpRequest, fd: number) => void) {
  return (res: HttpResponse, req: HttpRequest) => {
    const fdParam = req.getParameter(0)
    if (fdParam == null) {
      res.writeStatus('400 Bad Request')
      res.end()
      return
    }

    const fd = Number.parseInt(fdParam)
    if (Number.isNaN(fd)) {
      res.writeStatus('400 Bad Request')
      res.end()
      return
    }

    fdAction(res, req, fd)
  }
}

function withAuth(authorizedAction: (res: HttpResponse, req: HttpRequest) => void) {
  return (res: HttpResponse, req: HttpRequest) => {
    if (req.getHeader('x-compositor-session-id') === compositorSessionId) {
      authorizedAction(res, req)
    } else {
      res.writeStatus('401 Unauthorized')
      res.end()
    }
  }
}

async function main() {
  process.on('uncaughtException', (e) => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message)
    logger.error('error object stack: ')
    logger.error(e.stack ?? '')
  })
  initSurfaceBufferEncoding()

  const port = config.server.bindPort

  const serverStart = new Promise<us_listen_socket>((resolve, reject) => {
    App()
      .post(
        '/mkfifo',
        withAuth((res, req) => {
          // TODO
        }),
      )
      .post(
        '/mkstemp-mmap',
        withAuth((res, req) => {
          // TODO
        }),
      )
      .get(
        '/webfd/:fd',
        withAuth(
          withFdParam((res, req, fd) => {
            // TODO
          }),
        ),
      )
      .del(
        '/webfd/:fd',
        withAuth(
          withFdParam((res, req, fd) => {
            closeFd(fd, (err) => {
              if (err) {
              } else {
                res.writeStatus('200 OK').end()
              }
            })
          }),
        ),
      )
      .get(
        '/webfd/:fd/stream',
        withAuth(
          withFdParam((res, req, fd) => {
            pipeReadableToHttpResponse(res, fdAsReadStream(fd))
          }),
        ),
      )
      .put(
        '/webfd/:fd/stream',
        withAuth(
          withFdParam((res, req, fd) => {
            pipeHttpRequestToWritable(res, fdAsWriteStream(fd))
          }),
        ),
      )
      .ws('/', {
        sendPingsAutomatically: 10000,
        maxPayloadLength: 4 * 1024 * 1024,
        maxBackpressure: 4 * 1024 * 1024,
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
        open: (ws) => {
          const uWebSocketLike = new UWebSocketLike(ws)
          ws.websocketlike = uWebSocketLike
          handleWebSocketConnection(uWebSocketLike, ws.searchParams)
        },
        message: (ws, message, isBinary) => {
          const messageEventLike: MessageEventLike = {
            type: 'message',
            // we need to copy the data as uwebsocket will free the data as soon as this function exits, regardless of any references to it...
            data: message.slice(0),
            target: ws.websocketlike,
          }
          ws.websocketlike.emit('message', messageEventLike)
        },
        close: (ws, code, message) => {
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
      .listen(port, (listenSocket) => {
        resolve(listenSocket)
      })
  })

  const listenSocket = await serverStart

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM. Closing connections.')
    await closeAllWebSockets()
    us_listen_socket_close(listenSocket)
    logger.info('All Connections closed. Goodbye.')
    process.exit()
  })

  logger.info(`Compositor proxy started. Listening on port ${port}`)
  deleteStartingFile()
}

main()
