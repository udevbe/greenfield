import { URL } from 'url'
import WebSocket from 'ws'
import { config } from './config'
import { createCompositorProxySession } from './CompositorProxySession'
import { createLogger } from './Logger'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'

const urlProtocolAndDomain = `ws://${config.server.bindIP}:${config.server.bindPort}` as const
const compositorSessionId = process.env.COMPOSITOR_SESSION_ID

const logger = createLogger('main')

function main() {
  if (compositorSessionId === undefined) {
    console.error('env COMPOSITOR_SESSION_ID must be set.')
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

    if (searchParams.has('type') && searchParams.has('fd')) {
      // data transfer
      const fd = Number.parseInt(searchParams.get('fd') ?? '0')
      compositorProxySession.nativeCompositorSession.appEndpointWebFS.incomingDataTransfer(ws, { fd })
    } else {
      compositorProxySession.handleConnection(ws)
    }
  })

  console.log('Listening to port ' + port)
}

main()
