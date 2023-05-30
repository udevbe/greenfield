import { createLogger } from './Logger'
import { unlink } from 'fs/promises'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'
import { config } from './config'
import { createApp } from './App'
import { OPTIONSPreflightRequest } from './AppController'
import { HttpRequest, HttpResponse, us_listen_socket_close } from 'uWebSockets.js'
import { closeAllProxySessions, createProxySession, findProxySessionByCompositorSessionId } from './ProxySession'
import { args } from './Args'
import { launchApplication, NativeAppContext } from './NativeAppContext'

const logger = createLogger('main')

const allowOrigin = config.server.http.allowOrigin

async function POSTApplication(httpResponse: HttpResponse, req: HttpRequest) {
  let aborted = false
  httpResponse.onAborted(() => {
    aborted = true
  })

  const compositorSessionId = req.getHeader('x-compositor-session-id')
  if (compositorSessionId.length === 0) {
    httpResponse
      .writeStatus('403 Forbidden')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .endWithoutBody()
    return
  }

  const proxySession = findProxySessionByCompositorSessionId(compositorSessionId)
  if (proxySession === undefined) {
    httpResponse
      .writeStatus('403 Forbidden')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .endWithoutBody()
    return
  }

  const requestPath = req.getUrl()
  const applicationEntry = Object.entries(config.public.applications).find(([, { path }]) => path === requestPath)
  if (applicationEntry === undefined) {
    httpResponse
      .writeStatus('404 Not Found')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end('Application not found.', true)
    return
  }
  const [name, { executable }] = applicationEntry

  let appContext: NativeAppContext
  try {
    logger.info(`Launching application ${name}`)
    appContext = await launchApplication(executable, proxySession, name)
  } catch (e) {
    logger.error(e)
    httpResponse
      .writeStatus('500 Internal Server Error')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end('Application could not be started.', true)
    return
  }

  if (aborted) {
    appContext.kill('SIGHUP')
    return
  }

  // start a timer to terminate the app if no connection is made
  appContext.onDisconnect()

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

  httpResponse.cork(() => {
    httpResponse
      .writeStatus('201 Created')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'application/json')
      .end(JSON.stringify(reply), true)
  })
}

function deleteStartingFile() {
  unlink('/var/run/compositor-proxy/starting').catch(() => {
    // not being able to delete the starting file is not fatal
    // TODO log this?
  })
}

export function run() {
  logger.info('Starting compositor proxy.')
  const compositorSessionId = args['static-session-id']
  if (compositorSessionId === null) {
    logger.error('--static-session-id= must be set. Run with --help for options')
    process.exit(1)
  }
  logger.info('Using a static session id.')

  createProxySession(compositorSessionId)

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
    templatedApp.options(path, OPTIONSPreflightRequest('POST')).post(path, POSTApplication)
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

run()
