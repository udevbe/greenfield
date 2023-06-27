import {
  Configschema,
  createLogger,
  createSession,
  createSessionController,
  initSurfaceBufferEncoding,
  launchApplication,
  Session,
  SessionController,
} from '..'
import { IncomingMessage } from 'http'
import { Socket } from 'net'

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
  if (isIpcMessage(message)) {
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
  } else {
    throw new Error(`BUG. received message is not an IPC message. Got: ${JSON.stringify(message)})`)
  }
})

let context: { session: Session; sessionController: SessionController } | undefined = undefined

function start({ config, compositorSessionId }: Extract<ToSessionProcessMessage, { type: 'start' }>['payload']) {
  if (context !== undefined) {
    throw new Error('BUG. Already started')
  }
  initSurfaceBufferEncoding()

  const session = createSession(compositorSessionId, config)
  const sessionController = createSessionController(session)
  context = {
    session,
    sessionController,
  }
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
  if (context === undefined) {
    throw new Error('BUG. Not yet started')
  }

  try {
    logger.info(`Launching application ${name}`)
    const nativeAppContext = await launchApplication(name, executable, args, env, context.session)
    // start a timer to terminate the app if no connection is made
    nativeAppContext.onDisconnect()
    const launchAppSuccess: ToMainProcessMessage = {
      type: 'launchAppSuccess',
      payload: { replySerial: serial, key: nativeAppContext.key },
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
  if (context === undefined) {
    throw new Error('BUG. Not yet started')
  }

  socket.resume()
  context.sessionController.onWsUpgrade(request, socket)
}
