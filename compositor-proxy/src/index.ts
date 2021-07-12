import { URL } from 'url'
import WebSocket from 'ws'
import { config } from './config'
import { createCompositorProxySession } from './CompositorProxySession'
import { createLogger } from './Logger'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'

// @ts-ignore
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

  // @ts-ignore
  const port = +(process.env.PORT ?? config.server.bindPort)
  // @ts-ignore
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
    compositorProxySession.handleConnection(ws)
  })

  console.log('Listening to port ' + port)
}

main()
