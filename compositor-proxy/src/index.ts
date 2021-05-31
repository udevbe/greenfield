import { URL } from 'url'
import WebSocket from 'ws'
import { serverConfig } from '../config'
import { createCompositorProxySession } from './CompositorProxySession'
import { createLogger } from './Logger'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'

const urlProtocolAndDomain = `${serverConfig.protocol}${serverConfig.hostname}:${serverConfig.port}` as const
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

  const wss = new WebSocket.Server({ port: serverConfig.port, host: serverConfig.hostname })
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

  console.log('Listening to port ' + serverConfig.port)
}

main()
