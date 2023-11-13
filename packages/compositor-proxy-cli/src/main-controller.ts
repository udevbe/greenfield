import { ToMainProcessMessage, ToSessionProcessMessage } from './SessionProcess.js'
import { ChildProcess } from 'node:child_process'
import { Configschema, createLogger } from '@gfld/compositor-proxy'
import { IncomingMessage, ServerResponse } from 'node:http'
import { args } from './main-args.js'
import { AppConfigSchema } from './app-config.js'

type RemoteAppContextAttributes = Readonly<{
  baseURL: string
  signalURL: string
  key: string
  pid: string
  name: string
  internal: boolean
}>

const allowHeaders = 'Content-Type, X-Compositor-Session-Id, Authorization, WWW-Authenticate'
const maxAge = '36000'
let messageSerial = 0

const logger = createLogger('main')
const basicAuth = args['basic-auth']
let user: string | undefined
let password: string | undefined
if (basicAuth) {
  ;[user, password] = basicAuth.split(':')
}

export function authRequest(
  request: IncomingMessage,
  response: ServerResponse,
  _url: URL,
):
  | {
      compositorSessionId: string
    }
  | undefined {
  if (user && password) {
    const authHeader = request.headers['authorization']
    if (authHeader === undefined) {
      response
        .writeHead(401, 'Not authenticated', {
          'www-authenticate': 'Basic realm="Login",charset="UTF-8"',
        })
        .end()
      return
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    const givenUser = auth[0]
    const givenPassword = auth[1]

    if (user !== givenUser || givenPassword !== password) {
      response
        .writeHead(401, 'Not authenticated', {
          'www-authenticate': 'Basic realm="Login",charset="UTF-8"',
        })
        .end()
      return
    }
  }

  const compositorSessionId = request.headers['x-compositor-session-id']
  if (typeof compositorSessionId === 'string') {
    return { compositorSessionId }
  }

  response.writeHead(403, 'Forbidden').end()
}

function isToMainProcessMessage(message: any): message is ToMainProcessMessage {
  return message.type === 'launchAppSuccess' || message.type === 'launchAppFailed'
}

function sendMessageWithReply<T extends Extract<ToSessionProcessMessage, { type: 'launchApp' }>>(
  childProcess: ChildProcess,
  message: T,
  timeout = 10000,
): Promise<NonNullable<T['reply']>> {
  return new Promise((resolve, reject) => {
    const sendSerial = message.payload.serial
    const timeoutHandle = setTimeout(() => {
      reject(new Error(`Sending message: ${JSON.stringify(message)} timed out with no reply after ${timeout}ms.`))
    }, timeout)
    const replyListener = (message: any) => {
      if (isToMainProcessMessage(message)) {
        if (message.payload.replySerial === sendSerial) {
          clearTimeout(timeoutHandle)
          childProcess.removeListener('message', replyListener)
          resolve(message)
        }
      }
    }
    childProcess.on('message', replyListener)
    childProcess.send(message)
  })
}

export function handleOptions(config: Configschema, request: IncomingMessage, response: ServerResponse, _url: URL) {
  const origin = request.headers['origin']
  const accessControlRequestMethod = request.headers['access-control-request-method']
  if (origin === '' || accessControlRequestMethod === '') {
    // not a preflight check, abort
    response.writeHead(200, 'OK').end()
    return
  }

  response
    .writeHead(204, 'No Content', {
      'Access-Control-Allow-Origin': config.server.http.allowOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': allowHeaders,
      'Access-Control-Max-Age': maxAge,
    })
    .end()
}

export async function handleGET(
  childProcess: ChildProcess,
  compositorSessionId: string,
  config: Configschema,
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
  applications: AppConfigSchema,
) {
  let appName: string | undefined
  let appExecutable: string | undefined
  let appArgs: string[] | undefined
  let appEnv: Record<string, string> | undefined
  for (const [path, { name, executable, args, env }] of Object.entries(applications)) {
    if (url.pathname === path) {
      appName = name
      appExecutable = executable
      appArgs = args
      appEnv = env
      break
    }
  }

  if (appName === undefined || appExecutable === undefined || appArgs === undefined || appEnv === undefined) {
    response
      .writeHead(404, 'Not Found', {
        'Access-Control-Allow-Origin': config.server.http.allowOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'text/plain',
      })
      .end('Application not found.')
    return
  }

  try {
    const launchApp: ToSessionProcessMessage = {
      type: 'launchApp',
      payload: { name: appName, executable: appExecutable, args: appArgs, env: appEnv, serial: messageSerial++ },
    }
    const messageReply = await sendMessageWithReply(childProcess, launchApp)
    if (messageReply.type === 'launchAppFailed') {
      response
        .writeHead(500, 'Internal Server Error', {
          'Access-Control-Allow-Origin': config.server.http.allowOrigin,
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'text/plain',
        })
        .end('Application could not be started.')
      return
    }

    const proxyURL = new URL(config.public.baseURL)
    proxyURL.pathname += proxyURL.pathname.endsWith('/') ? 'signal' : '/signal'
    proxyURL.searchParams.set('compositorSessionId', compositorSessionId)
    proxyURL.searchParams.set('key', messageReply.payload.key)

    const reply: RemoteAppContextAttributes = {
      baseURL: config.public.baseURL,
      signalURL: proxyURL.href,
      key: messageReply.payload.key,
      pid: messageReply.payload.pid,
      name: appName,
      internal: false,
    }

    response
      .writeHead(201, 'Created', {
        'Access-Control-Allow-Origin': config.server.http.allowOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      })
      .end(JSON.stringify(reply))
  } catch (e: any) {
    logger.error(e)
    response
      .writeHead(500, 'Internal Server Error', {
        'Access-Control-Allow-Origin': config.server.http.allowOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'text/plain',
      })
      .end('Application could not be started.')
    return
  }
}
