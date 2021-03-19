import Logger from 'pino'
import { URL } from 'url'
import WebSocket from 'ws'
import { serverConfig } from '../config'
import { AppEndpointSession } from './AppEndpointSession'
import { SurfaceBufferEncoding } from './SurfaceBufferEncoding'

export const loggerConfig = {
  prettyPrint: Boolean(process.env.DEBUG),
  level: Boolean(process.env.DEBUG) ? '20' : '30',
}

const logger = Logger({
  ...loggerConfig,
  name: `app-endpoint-session-process`,
})

function main() {
  // TODO pass compositor session id when creating container
  const compositorSessionId = process.env.COMPOSITOR_SESSION_ID
  if (compositorSessionId === undefined) {
    console.log('env COMPOSITOR_SESSION_ID must be set.')
    process.exit(1)
  }
  const appEndpointSession = AppEndpointSession.create(compositorSessionId)

  process.on('uncaughtException', (e) => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message)
    logger.error('error object stack: ')
    logger.error(e.stack ?? '')
  })
  SurfaceBufferEncoding.init()

  const wss = new WebSocket.Server({ port: serverConfig.port, host: serverConfig.hostname })
  wss.on('connection', (ws) => {
    appEndpointSession.handleConnection(ws, new URL(ws.url).searchParams)
  })

  console.log('Listening to port ' + serverConfig.port)
}

main()
