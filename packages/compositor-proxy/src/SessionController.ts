import { createWebSocketStream, WebSocket, WebSocketServer } from 'ws'
import { Session } from './Session.js'
import { IncomingMessage } from 'node:http'
import { close, createReadStream, createWriteStream, read } from 'node:fs'
import { createLogger } from './Logger.js'
import wl_surface_interceptor from './protocol/wl_surface_interceptor.js'
import { isSignalingMessage, SignalingMessageType } from './NativeAppContext.js'
import { Socket } from 'node:net'

// 64*1024=64kb
const TRANSFER_CHUNK_SIZE = 65792 as const

const logger = createLogger('app')

type AppRequest = {
  headers: IncomingMessage['headers']
  url: IncomingMessage['url']
}

function mkfifo(session: Session, request: AppRequest, ws: WebSocket) {
  const jsonPipe = JSON.stringify(session.nativeWaylandCompositorSession.webFS.mkpipe())
  ws.send(jsonPipe, { binary: false })
  ws.close(4201, 'Created')
}

function mkstempMmap(session: Session, request: AppRequest, ws: WebSocket) {
  const bufferChunks: Buffer[] = []
  ws.onmessage = (event) => {
    const chunk = event.data as Buffer
    bufferChunks.push(chunk)
    if (chunk.byteLength === 0) {
      const buffer = Buffer.concat(bufferChunks)
      const jsonShmWebFD = JSON.stringify(session.nativeWaylandCompositorSession.webFS.mkstempMmap(buffer))
      ws.send(jsonShmWebFD, { binary: false })
      ws.close(4201, 'Created')
    }
  }
}

function asNumber(stringParam: string | null | undefined): number | undefined {
  if (stringParam == null) {
    return undefined
  }

  const numberValue = Number.parseInt(stringParam)
  if (Number.isNaN(numberValue)) {
    return undefined
  }

  return numberValue
}

function readFd(session: Session, request: AppRequest, ws: WebSocket, url: URL) {
  const fdParam = url.searchParams.get('fd')
  const countParam = url.searchParams.get('count')

  const fd = asNumber(fdParam)
  const count = asNumber(countParam)

  if (fd === undefined || count === undefined) {
    logger.error('read-fd received empty arguments from client.')
    ws.close(4400, `File descriptor and count argument must be a positive integer. Got fd: ${fdParam}, count: ${count}`)
    return
  }

  const readBuffer = new Uint8Array(count)
  let bytesRead = 0
  let bytesRemaining = count
  let hasError = false

  while (!hasError && bytesRemaining > 0) {
    read(fd, readBuffer.subarray(bytesRead, bytesRemaining), 0, count, 0, (err, read) => {
      if (err) {
        hasError = true
        if (err.code === 'EBADF') {
          logger.error('read-fd received unknown fd from client.')
          ws.close(4404, 'File descriptor not found.')
        } else {
          logger.error(`read-fd could not read fd received from client: ${err.name}: ${err.message}`)
          ws.close(4500, `Unexpected error: ${err.name}: ${err.message}`)
        }
        return
      }

      bytesRemaining -= read
      bytesRead += read
    })
  }

  ws.send(readBuffer, { binary: true })
  ws.close(4200, 'OK')
}

function closeFd(session: Session, request: AppRequest, ws: WebSocket, url: URL) {
  const fdParam = url.searchParams.get('fd')
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    logger.error('DEL /webfd received empty fd argument from client.')
    ws.close(4400, `File descriptor argument must be a positive integer. Got: ${fdParam}`)
    return
  }

  close(fd, (err) => {
    if (err) {
      if (err.code === 'EBADF') {
        logger.error('close-fd received unknown fd from client.')
        ws.close(4404, 'File descriptor not found.')
      } else {
        ws.close(4500, `Unexpected error: ${err.name}: ${err.message}`)
        logger.error(`could not close fd received from client: ${err.name}: ${err.message}`)
      }
      return
    }

    ws.close(4200, 'OK')
  })
}

function readFdAsStream(session: Session, request: AppRequest, ws: WebSocket, url: URL) {
  const fdParam = url.searchParams.get('fd')
  const chunkSizeParam = url.searchParams.get('chunkSize')

  const fd = asNumber(fdParam)
  const chunkSize = asNumber(chunkSizeParam) ?? TRANSFER_CHUNK_SIZE

  if (fd === undefined) {
    logger.error('read-fd-as-stream received unknown fd from client.')
    ws.close(4400, `File descriptor argument must be a positive integer. Got: ${fdParam}`)
    return
  }

  const fdReadStream = createReadStream('ignored', { fd, autoClose: true, highWaterMark: chunkSize })
  const wsStream = createWebSocketStream(ws, { highWaterMark: chunkSize, autoDestroy: true })

  fdReadStream.pipe(wsStream)
}

function writeFdAsStream(session: Session, request: AppRequest, ws: WebSocket, url: URL) {
  const fdParam = url.searchParams.get('fd')

  const fd = asNumber(fdParam)

  if (fd === undefined) {
    logger.error('read-fd-as-stream received unknown fd from client.')
    ws.close(4400, `File descriptor argument must be a positive integer. Got: ${fdParam}`)
    return
  }

  const fdWriteStream = createWriteStream('ignored', { fd, autoClose: true })
  const wsStream = createWebSocketStream(ws, { highWaterMark: TRANSFER_CHUNK_SIZE })

  wsStream.pipe(fdWriteStream)
}

function requestKeyFrame(session: Session, request: AppRequest, ws: WebSocket, url: URL) {
  const clientIdParam = url.searchParams.get('clientId')
  const surfaceIdParam = url.searchParams.get('surfaceId')

  const clientId = clientIdParam
  const surfaceId = asNumber(surfaceIdParam)

  if (clientId === undefined || surfaceId === undefined) {
    ws.close(
      4400,
      `Surface id argument must be a positive integer. Got client id: ${clientId}, surface id: ${surfaceId}`,
    )
    return
  }

  const clientEntry = session.nativeWaylandCompositorSession.clients.find(
    (clientEntry) => clientEntry.clientId === clientId,
  )

  if (clientEntry === undefined) {
    ws.close(4404, 'Client not found.')
    return
  }

  const wlSurfaceInterceptor = clientEntry.nativeClientSession?.messageInterceptor.interceptors[
    surfaceId
  ] as wl_surface_interceptor

  if (wlSurfaceInterceptor === undefined) {
    logger.error(
      'Received a key frame unit request but no surface found that matches the request. Surface already destroyed?',
    )
    ws.close(4404, 'Surface not found.')
    return
  }

  wlSurfaceInterceptor.encoder.requestKeyUnit()
  ws.close(4202)

  // FIXME implement case for immediate keyframe refresh
}

function signal(session: Session, request: AppRequest, ws: WebSocket, url: URL) {
  const signalingKey = url.searchParams.get('key')
  if (signalingKey === null) {
    ws.close(4403, 'Missing key query parameter.')
    return
  }

  const nativeAppContext = session.findNativeAppContextByKey(signalingKey)
  if (nativeAppContext === undefined) {
    ws.close(4403, 'Missing key query parameter.')
    return
  }

  if (nativeAppContext.signalingWebSocket !== undefined) {
    ws.close(4403, 'Client signaling connection already established.')
    return
  }

  logger.info(`New signaling connection from ${url.href}.`)
  nativeAppContext.onConnect(ws)

  ws.onmessage = (event) => {
    const messageData = event.data as string
    const messageObject = JSON.parse(messageData)
    if (nativeAppContext === undefined) {
      throw new Error('BUG. Got a websocket message without a native app context.')
    }

    if (isSignalingMessage(messageObject)) {
      switch (messageObject.type) {
        case SignalingMessageType.KILL_APP: {
          nativeAppContext.kill(messageObject.data.signal)
          break
        }
      }
    } else {
      throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
    }
  }

  ws.onclose = (event) => {
    logger.info(`Signaling connection closed. Code: ${event.code}. Message: ${event.reason}`)
    if (event.code === 1001) {
      nativeAppContext.kill('SIGHUP')
      return
    }
    if (event.code === 4001) {
      nativeAppContext.kill('SIGTERM')
      return
    }
    nativeAppContext.onDisconnect()
  }
}

function channel(session: Session, request: AppRequest, ws: WebSocket, url: URL) {
  const signalingKey = url.searchParams.get('key')
  const channelId = url.searchParams.get('id')

  if (signalingKey === null || channelId === null) {
    ws.close(4403, 'Missing key query parameter.')
    return
  }

  const nativeAppContext = session.findNativeAppContextByKey(signalingKey)
  if (nativeAppContext === undefined) {
    ws.close(4403, 'Missing key query parameter.')
    return
  }

  const channel = nativeAppContext.findChannelById(channelId)
  if (channel === undefined) {
    ws.close(4403, 'Bad channel id query parameter.')
    return
  }

  channel.doOpen(ws)
  logger.info(`Opened connection from ${url.href})}`)

  ws.onmessage = (event) => {
    channel.doMessage(event.data as Buffer)
  }

  ws.onclose = (event) => {
    if (event.code === 4001 || event.code === 1001) {
      // user closed connection or user navigated away
      channel.doClose()
    }
    if (channel) {
      channel.ws = undefined
    }
    logger.info(`Closed connection from ${url.href}). Code: ${event.code}. Message: ${event.reason}`)
  }
}

const wssPathActions: Record<
  string,
  (
    session: Session,
    request: { headers: IncomingMessage['headers']; method: IncomingMessage['method']; url: IncomingMessage['url'] },
    ws: WebSocket,
    url: URL,
  ) => void
> = {
  '/mkfifo': mkfifo,
  '/mkstemp-mmap': mkstempMmap,
  '/read-fd': readFd,
  '/close-fd': closeFd,
  '/read-fd-as-stream': readFdAsStream,
  '/write-fd-as-stream': writeFdAsStream,
  '/request-keyframe': requestKeyFrame,
  '/signal': signal,
  '/channel': channel,
}

export type SessionController = {
  onWsUpgrade(
    request: { headers: IncomingMessage['headers']; method: IncomingMessage['method']; url: IncomingMessage['url'] },
    socket: Socket,
  ): void
}

export function createSessionController(session: Session): SessionController {
  const wss = new WebSocketServer({ perMessageDeflate: false, noServer: true })

  return {
    onWsUpgrade(request, socket) {
      wss.handleUpgrade(request as IncomingMessage, socket, Buffer.from([]), (ws) => {
        ws.binaryType = 'nodebuffer'
        const url = new URL(request.url ?? '', `http://${request.headers.host}`)
        const compositorSessionId = url.searchParams.get('compositorSessionId')
        if (compositorSessionId !== session.compositorSessionId) {
          ws.close(4403)
          return
        }

        wssPathActions[url.pathname](session, request, ws, url)
      })
    },
  }
}
