import { unlink } from 'fs/promises'
import { URL } from 'url'
import WebSocket from 'ws'
import { config } from './config'
import { createCompositorProxySession } from './CompositorProxySession'
import { closeAllWebSockets, upsertWebSocket } from './ConnectionPool'
import { createLogger } from './Logger'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'

const urlProtocolAndDomain = `ws://${config.server.bindIP}:${config.server.bindPort}` as const
const compositorSessionId = process.env.COMPOSITOR_SESSION_ID

const logger = createLogger('main')

function deleteStartingFile() {
  unlink('/var/run/compositor-proxy/starting').catch(() => {
    // deleting the starting file is not fatal
    // TODO log this?
  })
}

function main() {
  logger.info('Starting compositor proxy...')
  if (compositorSessionId === undefined) {
    logger.error('env COMPOSITOR_SESSION_ID must be set.')
    process.exit(1)
  }

  const compositorProxySession = createCompositorProxySession(compositorSessionId)

  process.on('uncaughtException', (e) => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message)
    logger.error('error object stack: ')
    logger.error(e.stack ?? '')
  })
  initSurfaceBufferEncoding()

  const port = config.server.bindPort
  const wss = new WebSocket.Server({ port, host: config.server.bindIP })

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM. Closing connections.')
    await closeAllWebSockets()
    wss.close()
    logger.info('All Connections closed. Goodbye.')
    process.exit()
  })

  wss.on('connection', (ws, request) => {
    logger.debug(
      `Incoming websocket connection.\n\tURL: ${JSON.stringify(request.url)}\n\tHEADERS: ${JSON.stringify(
        request.headers,
      )}`,
    )
    const searchParams = new URL(`${urlProtocolAndDomain}${request.url}`).searchParams
    if (searchParams.get('compositorSessionId') !== compositorSessionId) {
      const message = 'Bad or missing compositorSessionId query parameter.'
      logger.error(message)
      ws.close(4403, message)
      return
    }
    const connectionId = searchParams.get('connectionId')
    if (connectionId === null) {
      const message = 'Missing connectionId query parameter.'
      logger.error(message)
      ws.close(4403, message)
      return
    }

    const { retransmittingWebSocket, isNew } = upsertWebSocket(connectionId, ws)
    if (!isNew) {
      // reconnecting, no need to do anything
      return
    }

    if (searchParams.has('type') && searchParams.has('fd')) {
      // data transfer
      const fd = Number.parseInt(searchParams.get('fd') ?? '0')
      compositorProxySession.nativeCompositorSession.appEndpointWebFS.incomingDataTransfer(retransmittingWebSocket, {
        fd,
      })
    } else if (searchParams.has('xwmFD')) {
      const wmFD = Number.parseInt(searchParams.get('xwmFD') ?? '0')
      compositorProxySession.handleXWMConnection(retransmittingWebSocket, wmFD)
    } else {
      compositorProxySession.handleConnection(retransmittingWebSocket)
    }
  })

  logger.info('Compositor proxy started. Listening on port ' + port)
  deleteStartingFile()
}

main()
