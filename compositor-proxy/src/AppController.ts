import type { CompositorProxySession } from './CompositorProxySession'
import type { HttpRequest, HttpResponse } from 'uWebSockets.js'
import fs from 'fs'
import { TRANSFER_CHUNK_SIZE } from './webfs/ProxyWebFS'
import { Readable, Writable } from 'stream'
import { WebSocketLike } from 'retransmitting-websocket'
import { upsertWebSocket } from './ClientConnectionPool'
import { createLogger } from './Logger'
import { URLSearchParams } from 'url'
import { config } from './config'

const logger = createLogger('app')

const allowOrigin = config.server.allowOrigin
const allowHeaders = 'Content-Type, X-Compositor-Session-Id'
const maxAge = '36000'

// TODO unit test Access-Control-Allow-Origin header on all handlers
// TODO unit test optionspreflightrequest
export function OPTIONSPreflightRequest(allowMethods: string) {
  return (res: HttpResponse, req: HttpRequest) => {
    const origin = req.getHeader('origin')
    const accessControlRequestMethod = req.getHeader('access-control-request-method')
    if (origin === '' || accessControlRequestMethod === '') {
      // not a preflight check, abort
      res.writeStatus('200 OK').end()
      return
    }

    res
      .writeStatus('204 No Content')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Access-Control-Allow-Methods', allowMethods)
      .writeHeader('Access-Control-Allow-Headers', allowHeaders)
      .writeHeader('Access-Control-Max-Age', maxAge)
      .end()
  }
}

export function POSTMkFifo(compositorProxySession: CompositorProxySession, res: HttpResponse) {
  const jsonPipe = JSON.stringify(compositorProxySession.nativeCompositorSession.webFS.mkpipe())
  res
    .writeStatus('201 Created')
    .writeHeader('Access-Control-Allow-Origin', allowOrigin)
    .writeHeader('Content-Type', 'application/json')
    .end(jsonPipe)
}

export function POSTMkstempMmap(compositorProxySession: CompositorProxySession, res: HttpResponse) {
  const bufferChunks: Uint8Array[] = []

  res.onAborted(() => {
    /* nothing todo here */
  })
  res.onData((chunk, isLast) => {
    res.cork(() => {
      bufferChunks.push(new Uint8Array(chunk.slice(0)))
      if (isLast) {
        const buffer = Buffer.concat(bufferChunks)
        if (buffer.byteLength === 0) {
          // TODO log error
          res
            .writeStatus('400 Bad Request')
            .writeHeader('Content-Type', 'text/plain')
            .end('Data in HTTP request body can not be empty.')
          return
        }
        const jsonShmWebFD = JSON.stringify(compositorProxySession.nativeCompositorSession.webFS.mkstempMmap(buffer))
        res
          .writeStatus('201 Created')
          .writeHeader('Access-Control-Allow-Origin', allowOrigin)
          .writeHeader('Content-Type', 'application/json')
          .end(jsonShmWebFD)
      }
    })
  })
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

export function GETWebFD(
  compositorProxySession: CompositorProxySession,
  httpResponse: HttpResponse,
  httpRequest: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  const countParam = new URLSearchParams(httpRequest.getQuery()).get('count')
  const count = asNumber(countParam)
  if (fd === undefined || count === undefined) {
    // TODO log error
    httpResponse
      .writeStatus('400 Bad Request')
      .writeHeader('Content-Type', 'text/plain')
      .end(`File descriptor and count argument must be a positive integer. Got fd: ${fdParam}, count: ${count}`)
    return
  }

  let lastOffset = 0
  let dataChunk: Uint8Array | undefined = undefined

  httpResponse.onAborted(() => dataChunk === undefined)

  const readBuffer = new Uint8Array(count)
  fs.read(fd, readBuffer, 0, count, 0, (err, bytesRead, chunk) => {
    httpResponse.cork(() => {
      if (err) {
        // TODO log error
        if (err.code === 'EBADF') {
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Content-Type', 'text/plain')
            .end(`Unexpected error: ${err.name}: ${err.message}`)
        }
        return
      }
      httpResponse
        .writeStatus('200 OK')
        .writeHeader('Access-Control-Allow-Origin', allowOrigin)
        .writeHeader('Content-Type', 'application/octet-stream')
      if (bytesRead === 0) {
        httpResponse.end(new ArrayBuffer(0))
        return
      }
      dataChunk = chunk
      lastOffset = httpResponse.getWriteOffset()
      const ok = httpResponse.write(new Uint8Array(chunk.buffer, chunk.byteOffset, bytesRead))
      if (ok) {
        httpResponse.end()
        return
      }
      httpResponse.onWritable((newOffset: number) => {
        let ok = true
        httpResponse.cork(() => {
          if (dataChunk === undefined) {
            return
          }

          const offsetIncrement = newOffset - lastOffset
          dataChunk = new Uint8Array(
            dataChunk.buffer,
            dataChunk.byteOffset + offsetIncrement,
            dataChunk.byteLength - offsetIncrement,
          )
          ok = httpResponse.write(dataChunk)
          if (ok) {
            dataChunk = undefined
            httpResponse.end()
          }
        })
        return ok
      })
    })
  })
}

export function DELWebFD(
  compositorProxySession: CompositorProxySession,
  httpResponse: HttpResponse,
  httpRequest: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    // TODO log error
    httpResponse
      .writeStatus('400 Bad Request')
      .writeHeader('Content-Type', 'text/plain')
      .end(`File descriptor argument must be a positive integer. Got: ${fdParam}`)
    return
  }

  httpResponse.onAborted(() => {
    /* do nothing */
  })

  fs.close(fd, (err) => {
    httpResponse.cork(() => {
      // TODO log error
      if (err) {
        if (err.code === 'EBADF') {
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Content-Type', 'text/plain')
            .end(`Unexpected error: ${err.name}: ${err.message}`)
        }
        return
      }
      httpResponse.writeStatus('200 OK').writeHeader('Access-Control-Allow-Origin', allowOrigin).end()
    })
  })
}

function pipeReadableToHttpResponse(httpResponse: HttpResponse, readable: Readable) {
  httpResponse
    .onAborted(() => readable.destroy())
    .onWritable(() => {
      readable.resume()
      return true
    })

  let headersWritten = false
  readable
    // TODO log error
    .on('error', (error) => {
      httpResponse.cork(() => {
        // @ts-ignore
        if (error.code === 'EBADF') {
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Content-Type', 'text/plain')
            .end(`Unexpected error: ${error.name}: ${error.message}`)
        }
      })
    })
    .on('end', () =>
      httpResponse.cork(() => {
        if (!headersWritten) {
          httpResponse
            .writeStatus('200 OK')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
            .writeHeader('Content-Type', 'application/octet-stream')
        }
        httpResponse.end()
      }),
    )
    .once('data', (chunk) => {
      httpResponse.cork(() => {
        httpResponse
          .writeStatus('200 OK')
          .writeHeader('Access-Control-Allow-Origin', allowOrigin)
          .writeHeader('Content-Type', 'application/octet-stream')
        headersWritten = true
        if (!httpResponse.write(chunk)) {
          readable.pause()
        }
      })

      readable.on('data', (chunk) => {
        httpResponse.cork(() => {
          if (!httpResponse.write(chunk)) {
            readable.pause()
          }
        })
      })
    })
}

export function GETWebFDStream(
  compositorProxySession: CompositorProxySession,
  res: HttpResponse,
  req: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  const chunkSize = asNumber(new URLSearchParams(req.getQuery()).get('chunkSize')) ?? TRANSFER_CHUNK_SIZE
  if (fd === undefined) {
    // TODO log error
    res
      .writeStatus('400 Bad Request')
      .writeHeader('Content-Type', 'text/plain')
      .end(`File descriptor argument must be a positive integer. Got: ${fdParam}`)
    return
  }

  pipeReadableToHttpResponse(res, fs.createReadStream('ignored', { fd, highWaterMark: chunkSize }))
}

function pipeHttpRequestToWritable(httpResponse: HttpResponse, writable: Writable) {
  writable
    .on('drain', () => httpResponse.resume())
    // TODO log error
    .on('error', (error) => {
      httpResponse.cork(() => {
        // @ts-ignore
        if (error.code === 'EBADF') {
          logger.error('Attempted to stream data to a non-existing FD.', error)
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          logger.error('Unexpected error when trying to stream data to an FD.', error)
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Content-Type', 'text/plain')
            .end(`${error.name}: ${error.message}`)
        }
      })
    })
    .on('finish', () => {
      httpResponse.cork(() => {
        httpResponse.writeStatus('200 OK').writeHeader('Access-Control-Allow-Origin', allowOrigin).end()
      })
    })

  httpResponse
    .onAborted(() => writable.end())
    .onData((chunk, isLast) => {
      const data = new Uint8Array(chunk.slice(0))
      if (isLast) {
        writable.end(data)
      } else if (!writable.write(data)) {
        httpResponse.pause()
      }
    })
}

export function PUTWebFDStream(
  compositorProxySession: CompositorProxySession,
  res: HttpResponse,
  req: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    // TODO log error
    res
      .writeStatus('400 Bad Request')
      .writeHeader('Content-Type', 'text/plain')
      .end(`FD argument must be an unsigned integer. Got: ${fdParam}`)
    return
  }

  pipeHttpRequestToWritable(
    res,
    fs.createWriteStream('ignored', { fd, autoClose: true, highWaterMark: TRANSFER_CHUNK_SIZE }),
  )
}

export function webSocketOpen(
  compositorProxySession: CompositorProxySession,
  ws: WebSocketLike,
  searchParams: URLSearchParams,
) {
  if (searchParams.get('compositorSessionId') !== compositorProxySession.compositorSessionId) {
    const message = 'Bad or missing compositorSessionId query parameter.'
    logger.error(message)
    ws.close(4403, message)
    return
  }

  const connectionId = searchParams.get('connectionId')
  if (connectionId === null) {
    const message = 'Bad or missing query parameters.'
    logger.error(message)
    ws.close(4403, message)
    return
  }

  if (searchParams.has('xwmFD')) {
    const wmFD = Number.parseInt(searchParams.get('xwmFD') ?? '0')
    compositorProxySession.handleXWMConnection(ws, wmFD)
  } else {
    const { retransmittingWebSocket, isNew } = upsertWebSocket(connectionId, ws)
    if (!isNew) {
      // reconnecting, no need to do anything
      return
    }
    compositorProxySession.handleConnection(retransmittingWebSocket)
  }
}
