import { unlink } from 'fs/promises'

import { us_listen_socket_close } from 'uWebSockets.js'
import { createCompositorProxySession } from './CompositorProxySession'
import { config } from './config'
import { createLogger } from './Logger'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'
import { createApp } from './App'
import { args } from './Args'

const logger = createLogger('main')

logger.info('Starting compositor proxy.')
const compositorSessionId = args['static-session-id']
if (compositorSessionId === null) {
  logger.error('--static-session-id= must be set. Run with --help for options')
  process.exit(1)
}
logger.info('Using a static session id.')

const compositorProxySession = createCompositorProxySession(compositorSessionId)

function deleteStartingFile() {
  unlink('/var/run/compositor-proxy/starting').catch(() => {
    // not being able to delete the starting file is not fatal
    // TODO log this?
  })
}

async function main() {
  process.on('uncaughtException', (e) => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message)
    logger.error('error object stack: ')
    logger.error(e.stack ?? '')
  })
  initSurfaceBufferEncoding()

  const port = config.server.http.bindPort
  const host = config.server.http.bindIP
  const listenSocket = await createApp(compositorProxySession, { host, port })

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM. Closing connections.')
    us_listen_socket_close(listenSocket)
    compositorProxySession.nativeCompositorSession.destroy()
    logger.info('All Connections closed. Goodbye.')
    process.exit()
  })

  logger.info(`Compositor proxy started. Listening on ${host}:${port}`)
  deleteStartingFile()
}

main()
