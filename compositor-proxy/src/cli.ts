import { createLogger } from './Logger'
import { unlink } from 'fs/promises'
import { initSurfaceBufferEncoding } from './SurfaceBufferEncoding'
import { createApp } from './App'
import { closeAllProxySessions, createProxySession, ProxySession } from './ProxySession'
import { launchApplication, NativeAppContext } from './NativeAppContext'
import { Configschema } from './@types/config'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parseArgs, ParseArgsConfig } from 'util'

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

type ArgValues = {
  help: boolean
  'session-id': string | undefined
  'bind-ip': string
  'bind-port': string
  'allow-origin': string
  'base-url': string
  'render-device': string
  encoder: 'x264' | 'nvh264' | 'vaapih264'
  application: Record<string, { path: string; executable: string }>
}

const options: Record<keyof ArgValues, NonNullable<ParseArgsConfig['options']>[string]> = {
  help: {
    type: 'boolean',
    default: false,
    short: 'h',
  },
  'session-id': {
    type: 'string',
  },
  'bind-ip': {
    type: 'string',
    default: '0.0.0.0',
  },
  'bind-port': {
    type: 'string',
    default: '8081',
  },
  'allow-origin': {
    type: 'string',
    default: '*',
  },
  'base-url': {
    type: 'string',
    default: 'ws://localhost:8081',
  },
  'render-device': {
    type: 'string',
    default: '/dev/dri/renderD128',
  },
  encoder: {
    type: 'string',
    default: 'x264',
  },
  application: {
    type: 'string',
    multiple: true,
    default: ['gtk4-demo:/usr/bin/gtk4-demo:/gtk4-demo'],
  },
}

const parseArgsConfig: ParseArgsConfig = {
  strict: true,
  allowPositionals: false,
  options,
}

function parseApplicationArg(rawArg: string[]): ArgValues['application'] {
  const applicationValue: ArgValues['application'] = {}
  for (const rawEntry of rawArg) {
    const values = rawEntry.trim().split(':')
    if (values.length !== 3) {
      console.error('Invalid argument for "application"')
      printHelp()
      process.exit(1)
    }

    const [name, executable, path] = values
    applicationValue[name] = { executable, path }
  }
  return applicationValue
}

function parseEncoderArg(rawArg: string): ArgValues['encoder'] {
  switch (rawArg) {
    case 'x264':
    case 'nvh264':
    case 'vaapih264':
      return rawArg
    default: {
      console.error('Invalid argument for "encoder"')
      printHelp()
      process.exit(1)
    }
  }
}

const argMappers: Record<
  Extract<keyof ArgValues, 'encoder' | 'application'>,
  (rawValue: any) => ArgValues[keyof ArgValues]
> = {
  encoder: parseEncoderArg,
  application: parseApplicationArg,
}

export const args = Object.fromEntries(
  Object.entries(parseArgs(parseArgsConfig).values).map(([key, value]) => {
    switch (key) {
      case 'encoder':
      case 'application':
        return [key, argMappers[key](value)]
      default:
        return [key, value]
    }
  }),
) as ArgValues

export function printHelp() {
  console.log(`
\tUsage
\t  $ compositor-proxy --session-id=SESSION-ID <options>

\tOptions
\t  --session-id=SESSION-ID                         Use and accept this and only this session id when communicating.
\t                                                      Mandatory.
\t  --bind-ip=IP                                    The ip or hostname to listen on.
\t                                                      Optional. Default: "0.0.0.0".c
\t  --bind-port=PORT                                The port to listen on. 
\t                                                      Optional. Default "8081".
\t  --allow-origin=ORIGIN                           CORS allowed origins, used when doing cross-origin requests. Value can be * or comma seperated domains. 
\t                                                      Optional. Default "*".
\t  --base-url=URL                                  The public base url to use when other services connect to this endpoint. 
\t                                                      Optional. Default "http://localhost:8081".
\t  --render-device=PATH                            Path of the render device that should be used for hardware acceleration. 
\t                                                      Optional. Default "/dev/dri/renderD128".
\t  --encoder=ENCODER                               The h264 encoder to use. "x264", "nvh264" and "vaapih264" are supported. 
\t                                                      "x264" is a pure software encoder. "nvh264" is a hw accelerated encoder for Nvidia based GPUs. 
\t                                                      "vaapih264" is an experimental encoder for intel GPUs.
\t                                                      Optional. Default "x264".
\t  --application=NAME:EXECUTABLE_PATH:HTTP_PATH    Maps an application with NAME and EXECUTABLE_PATH to an HTTP_PATH. This option can be repeated 
\t                                                      with different values to map multiple applications.
\t                                                      Optional. Default: "gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo".
\t  --help, -h                                      Print this help text.
\t
\t The environment variable "LOG_LEVEL" is used to set the logging level. Accepted values are: "fatal", "error", "warn", "info", "debug", "trace"
\t
\tExamples
\t  $ compositor-proxy --session-id=test123 --application=gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo
  `)
}

const help = args['help']
if (help) {
  printHelp()
  process.exit(0)
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

  const server = createServer({ noDelay: true, keepAlive: true })

  const app = createApp(proxySession)
  server.on('upgrade', (request, socket, head) => {
    app.onWsUpgrade(request, socket, head)
  })

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
