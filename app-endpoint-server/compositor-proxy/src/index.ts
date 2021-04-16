import Logger from 'pino'
import { URL } from 'url'
import WebSocket from 'ws'
import { serverConfig } from '../config'
import { createCompositorProxySession } from './CompositorProxySession'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'

const urlProtocolAndDomain = `${serverConfig.protocol}${serverConfig.hostname}:${serverConfig.port}` as const
const compositorSessionId = process.env.COMPOSITOR_SESSION_ID || '02bea934-7cfe-4324-9024-9bda9ef56cc8'

export const loggerConfig = {
  prettyPrint: Boolean(process.env.DEBUG),
  // level: Boolean(process.env.DEBUG) ? 20 : 30,
}

const logger = Logger({
  ...loggerConfig,
  name: `app-endpoint-session-process`,
})

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
    const searchParams = new URL(`${urlProtocolAndDomain}${request.url}`).searchParams
    if (searchParams.get('compositorSessionId') !== compositorSessionId) {
      ws.close(4403)
      return
    }
    compositorProxySession.handleConnection(ws)
  })

  console.log('Listening to port ' + serverConfig.port)
}

main()
