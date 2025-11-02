import {
  Configschema,
  createLogger,
  createSession,
  createSessionController,
  initSurfaceBufferEncoding,
  launchApplication,
  Session,
  SessionController,
} from '@gfld/compositor-proxy'
import { IncomingMessage } from 'node:http'
import { Socket } from 'node:net'
import assert from 'node:assert'

process.on('uncaughtException', (e) => {
  logger.error('\tname: ' + e.name + ' message: ' + e.message)
  logger.error('error object stack: ')
  logger.error(e.stack ?? '')
})

const logger = createLogger('session-process')

export type ToSessionProcessMessage =
  | {
      type: 'start'
      payload: {
        compositorSessionId: string
        config: Configschema
      }
    }
  | {
      type: 'launchApp'
      payload: {
        name: string
        executable: string
        args: string[]
        env: Record<string, string>
        serial: number
      }
      reply?: Extract<ToMainProcessMessage, { type: 'launchAppSuccess' } | { type: 'launchAppFailed' }>
    }
  | {
      type: 'wsUpgrade'
      payload: {
        request: { headers: IncomingMessage['headers']; method: IncomingMessage['method']; url: IncomingMessage['url'] }
      }
    }

export type ToMainProcessMessage =
  | {
      type: 'launchAppSuccess'
      payload: {
        replySerial: number
        pid: string
        key: string
      }
    }
  | {
      type: 'launchAppFailed'
      payload: {
        replySerial: number
        message: string
      }
    }

function isIpcMessage(message: any): message is ToSessionProcessMessage {
  return (
    message.type === 'start' || message.type === 'stop' || message.type === 'launchApp' || message.type === 'wsUpgrade'
  )
}

process.on('message', (message, sendHandle) => {
  assert(isIpcMessage(message), `Received message is not an IPC message. Got: ${JSON.stringify(message)})`)

  switch (message.type) {
    case 'start':
      start(message.payload)
      break
    case 'launchApp':
      launchApp(message.payload)
      break
    case 'wsUpgrade':
      wsUpgrade(message.payload, sendHandle as Socket)
      break
  }
})

let context: { session: Session; sessionController: SessionController } | undefined = undefined

function start({ config, compositorSessionId }: Extract<ToSessionProcessMessage, { type: 'start' }>['payload']) {
  assert(context === undefined, 'Already started.')

  initSurfaceBufferEncoding()

  const session = createSession(compositorSessionId, config)
  const sessionController = createSessionController(session)
  context = {
    session,
    sessionController,
  }
  session.closeListeners.push(() => {
    process.exit()
  })
  logger.info(`Session started.`)
}

async function launchApp({
  serial,
  name,
  executable,
  args,
  env,
}: Extract<
  ToSessionProcessMessage,
  {
    type: 'launchApp'
  }
>['payload']) {
  assert(context !== undefined, 'Not yet started.')

  try {
    const nativeAppContext = await launchApplication(name, executable, args, env, context.session)
    // start a timer to terminate the app if no connection is made
    nativeAppContext.onDisconnect()
    const launchAppSuccess: ToMainProcessMessage = {
      type: 'launchAppSuccess',
      payload: { replySerial: serial, pid: `${nativeAppContext.pid}`, key: nativeAppContext.key },
    }
    process.send!(launchAppSuccess)
  } catch (e: any) {
    const launchAppFailed: ToMainProcessMessage = {
      type: 'launchAppFailed',
      payload: { replySerial: serial, message: e.message },
    }
    process.send!(launchAppFailed)
  }
}

function wsUpgrade({ request }: Extract<ToSessionProcessMessage, { type: 'wsUpgrade' }>['payload'], socket: Socket) {
  assert(context !== undefined, 'Not yet started.')

  socket.resume()
  context.sessionController.onWsUpgrade(request, socket)
}
