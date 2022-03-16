import { unlink } from 'fs/promises'

import { App, us_listen_socket, us_listen_socket_close } from 'uWebSockets.js'
import { CloseEventLike, MessageEventLike, WebSocketLike, ReadyState } from 'retransmitting-websocket'
import { createCompositorProxySession } from './CompositorProxySession'
import { config } from './config'
import { closeAllWebSockets, upsertWebSocket } from './ConnectionPool'
import { createLogger } from './Logger'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'
import { UWebSocketLike } from './UWebSocketLike'

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
  } else if (searchParams.has('type') && searchParams.has('fd')) {
    // data transfer
    const fd = Number.parseInt(searchParams.get('fd') ?? '0')
    logger.info(`Handling incoming data transfer with params: ${searchParams}`)
    compositorProxySession.nativeCompositorSession.webFS.incomingDataTransfer(ws, {
      fd,
    })
  } else {
    const message = 'Bad or missing query parameters.'
    logger.error(message)
    ws.close(4403, message)
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
      .ws('/', {
        sendPingsAutomatically: 10000,
        maxPayloadLength: 4 * 1024 * 1024,
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
