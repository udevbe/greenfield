import { createLogger } from './Logger'
import { unlink } from 'fs/promises'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'
import { createApp } from './App'
import { closeAllProxySessions, createProxySession, ProxySession } from './ProxySession'
import { args } from './Args'
import { launchApplication, NativeAppContext } from './NativeAppContext'
import { Configschema } from './@types/config'
import { IncomingMessage, ServerResponse } from 'http'

const logger = createLogger('main')

const allowHeaders = 'Content-Type, X-Compositor-Session-Id'
const maxAge = '36000'

function deleteStartingFile() {
  unlink('/var/run/compositor-proxy/starting').catch(() => {
    // not being able to delete the starting file is not fatal
    // TODO log this?
  })
}

function handleOptions(proxySession: ProxySession, request: IncomingMessage, response: ServerResponse, url: URL) {
  const origin = request.headers['origin']
  const accessControlRequestMethod = request.headers['access-control-request-method']
  if (origin === '' || accessControlRequestMethod === '') {
    // not a preflight check, abort
    response.writeHead(200, 'OK').end()
    return
  }

  response
    .writeHead(204, 'No Content', {
      'Access-Control-Allow-Origin': proxySession.config.server.http.allowOrigin,
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': allowHeaders,
      'Access-Control-Max-Age': maxAge,
    })
    .end()
}

async function handlePost(proxySession: ProxySession, request: IncomingMessage, response: ServerResponse, url: URL) {
  let name: string | undefined
  let executable: string | undefined
  for (const [appName, { path, executable: appExecutable }] of Object.entries(
    proxySession.config.public.applications,
  )) {
    if (url.pathname === path) {
      name = appName
      executable = appExecutable
      break
    }
  }

  if (name === undefined || executable === undefined) {
    response
      .writeHead(404, 'Not Found', {
        'Access-Control-Allow-Origin': proxySession.config.server.http.allowOrigin,
        'Content-Type': 'text/plain',
      })
      .end('Application not found.')
    return
  }

  let appContext: NativeAppContext
  try {
    logger.info(`Launching application ${name}`)
    appContext = await launchApplication(executable, proxySession, name)
  } catch (e) {
    logger.error(e)
    response
      .writeHead(500, 'Internal Server Error', {
        'Access-Control-Allow-Origin': proxySession.config.server.http.allowOrigin,
        'Content-Type': 'text/plain',
      })
      .end('Application could not be started.')
    return
  }

  if (request.destroyed) {
    appContext.kill('SIGHUP')
    return
  }

  // start a timer to terminate the app if no connection is made
  appContext.onDisconnect()

  const proxyURL = new URL(proxySession.config.public.baseURL)
  proxyURL.pathname += proxyURL.pathname.endsWith('/') ? 'signal' : '/signal'
  proxyURL.searchParams.set('compositorSessionId', proxySession.compositorSessionId)
  proxyURL.searchParams.set('key', appContext.key)

  const reply: { baseURL: string; signalURL: string; key: string; name: string } = {
    baseURL: proxySession.config.public.baseURL,
    signalURL: proxyURL.href,
    key: appContext.key,
    name: appContext.name,
  }

  response
    .writeHead(201, 'Created', {
      'Access-Control-Allow-Origin': proxySession.config.server.http.allowOrigin,
      'Content-Type': 'application/json',
    })
    .end(JSON.stringify(reply))
}

function run() {
  logger.info('Starting compositor proxy.')
  const compositorSessionId = args['session-id']
  if (compositorSessionId === undefined) {
    logger.error('--session-id= must be set. Run with --help for options')
    process.exit(1)
  }

  const config: Configschema = {
    server: {
      http: {
        allowOrigin: args['allow-origin'],
        bindIP: args['bind-ip'],
        bindPort: +args['bind-port'],
      },
    },
    public: {
      baseURL: args['base-url'],
      applications: args['application'],
    },
    encoder: {
      h264Encoder: args['encoder'],
      renderDevice: args['render-device'],
    },
  }

  const proxySession = createProxySession(compositorSessionId, config)

  process.on('uncaughtException', (e) => {
    logger.error('\tname: ' + e.name + ' message: ' + e.message)
    logger.error('error object stack: ')
    logger.error(e.stack ?? '')
  })
  initSurfaceBufferEncoding()

  const server = createApp(proxySession)
  server.on('request', (request, response) => {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`)
    if (request.method === 'POST') {
      handlePost(proxySession, request, response, url)
      return
    }
    if (request.method === 'OPTIONS') {
      handleOptions(proxySession, request, response, url)
    }
  })

  const port = config.server.http.bindPort
  const host = config.server.http.bindIP

  server.on('listening', () => {
    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM. Closing connections.')
      server.closeAllConnections()
      closeAllProxySessions()
      logger.info('All Connections closed. Goodbye.')
      process.exit()
    })

    logger.info(`Compositor proxy started. Listening on ${host}:${port}`)
    deleteStartingFile()
  })
  server.on('error', (err) => {
    logger.error(err.message)
  })
  server.listen(port, host)
}

run()
