import { createLogger } from './Logger'
import { unlink } from 'fs/promises'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'
import { config } from './config'
import { createApp } from './App'
import { OPTIONSPreflightRequest } from './AppController'
import { HttpRequest, HttpResponse, us_listen_socket_close } from 'uWebSockets.js'
import { closeAllProxySessions, createProxySession, findProxySessionByCompositorSessionId } from './ProxySession'
import { args } from './Args'
import { launchApplication } from './NativeAppContext'

const logger = createLogger('main')

const allowOrigin = config.server.http.allowOrigin

function deleteStartingFile() {
  unlink('/var/run/compositor-proxy/starting').catch(() => {
    // not being able to delete the starting file is not fatal
    // TODO log this?
  })
}

export function run() {
  logger.info('Starting compositor proxy.')

  process.on('uncaughtException', (e) => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message)
    logger.error('error object stack: ')
    logger.error(e.stack ?? '')
  })
  initSurfaceBufferEncoding()

  const port = config.server.http.bindPort
  const host = config.server.http.bindIP
  const templatedApp = createApp()
  for (const { path } of Object.values(config.public.applications)) {
    if (path.startsWith('/mkfifo') || path.startsWith('/mkstemp-mmap') || path.startsWith('/client')) {
      throw new Error(`Config error. Public application path can not start with ${path}. Path is reserved.`)
    }
    templatedApp.post(path, POSTApplication)
    templatedApp.options(path, OPTIONSPreflightRequest('POST'))
    logger.info(`Registered application with path ${path}.`)
  }

  templatedApp.listen(host, port, (listenSocket) => {
    if (listenSocket) {
      process.on('SIGTERM', () => {
        logger.info('Received SIGTERM. Closing connections.')
        us_listen_socket_close(listenSocket)
        closeAllProxySessions()
        logger.info('All Connections closed. Goodbye.')
        process.exit()
      })

      logger.info(`Compositor proxy started. Listening on ${host}:${port}`)
      deleteStartingFile()
    } else {
      throw new Error(`Failed to start compositor proxy on host: ${host} with port ${port}`)
    }
  })
}

async function POSTApplication(httpResponse: HttpResponse, req: HttpRequest) {
  const compositorSessionId = req.getHeader('x-compositor-session-id')
  if (compositorSessionId.length === 0) {
    const message = '403 Bad compositorSessionId query parameter.'
    httpResponse.end(message, true)
    return
  }

  if (args['static-session-id'] && args['static-session-id'] !== compositorSessionId) {
    const message = '403 Bad compositorSessionId query parameter.'
    httpResponse.end(message, true)
    return
  }

  const requestPath = req.getUrl()
  const applicationEntry = Object.entries(config.public.applications).find(([, { path }]) => path === requestPath)
  if (applicationEntry === undefined) {
    httpResponse
      .writeStatus('404 Not Found')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end('Application not found.')
    return
  }
  const [name, { executable }] = applicationEntry

  logger.info(`Launching application ${name}`)

  const proxySession =
    findProxySessionByCompositorSessionId(compositorSessionId) ?? createProxySession(compositorSessionId)

  // FIXME check if application launched
  const appContext = await launchApplication(executable, proxySession, name)

  const proxyURL = new URL(config.public.baseURL.replace('http', 'ws'))
  proxyURL.pathname += proxyURL.pathname.endsWith('/') ? 'signal' : '/signal'
  proxyURL.searchParams.set('compositorSessionId', compositorSessionId)
  proxyURL.searchParams.set('key', appContext.key)

  const reply: { baseURL: string; signalURL: string; key: string; name: string } = {
    baseURL: config.public.baseURL,
    signalURL: proxyURL.href,
    key: appContext.key,
    name: appContext.name,
  }

  // httpResponse.cork(() => {
  httpResponse
    .writeStatus('201 Created')
    .writeHeader('Access-Control-Allow-Origin', allowOrigin)
    .writeHeader('Content-Type', 'application/json')
    .end(JSON.stringify(reply))
  // })
}

run()
