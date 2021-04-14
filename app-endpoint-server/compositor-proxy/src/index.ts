import Logger from 'pino'
import { URL } from 'url'
import WebSocket from 'ws'
import { serverConfig } from '../config'
import { CompositorProxySession } from './CompositorProxySession'
import { SurfaceBufferEncoding } from './SurfaceBufferEncoding'

export const loggerConfig = {
  prettyPrint: Boolean(process.env.DEBUG),
  // level: Boolean(process.env.DEBUG) ? 20 : 30,
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

  // TODO pass token public key when creating container
  const publicKey = process.env.TOKEN_PUBLIC_KEY
  if (publicKey === undefined) {
    console.log('env TOKEN_PUBLIC_KEY must be set.')
    process.exit(1)
  }

  const compositorProxySession = CompositorProxySession.create(compositorSessionId, publicKey)

  process.on('uncaughtException', (e) => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message)
    logger.error('error object stack: ')
    logger.error(e.stack ?? '')
  })
  SurfaceBufferEncoding.init()

  const wss = new WebSocket.Server({ port: serverConfig.port, host: serverConfig.hostname })
  wss.on('connection', (ws, request) => {
    if (request.url === undefined) {
      ws.close(4500, 'BUG? Expected an internal url property on incoming websocket request.')
      ws.terminate()
      return
    }

    const subProtocolWords = ws.protocol.split(' ')
    if (subProtocolWords[0] !== 'Authorization:' || subProtocolWords[1] !== 'Bearer') {
      ws.close(4401, 'Access denied.')
      ws.terminate()
    }

    const token = subProtocolWords[2]

    const searchParams = new URL(`${serverConfig.protocol}${serverConfig.hostname}:${serverConfig.port}${request.url}`)
      .searchParams
    compositorProxySession.handleConnection(ws, searchParams, token)
  })

  console.log('Listening to port ' + serverConfig.port)
}

main()
