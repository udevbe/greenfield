import type { CompositorProxySession } from './CompositorProxySession'
import type { HttpRequest, HttpResponse } from 'uWebSockets.js'
import fs from 'fs'
import { TRANSFER_CHUNK_SIZE } from './webfs/ProxyWebFS'
import { Readable, Writable } from 'stream'
import { WebSocketLike } from 'retransmitting-websocket'
import { upsertWebSocket } from './ConnectionPool'
import { createLogger } from './Logger'
import { URLSearchParams } from 'url'

const logger = createLogger('app')

export function postMkFifo(compositorProxySession: CompositorProxySession, res: HttpResponse, req: HttpRequest) {
  const jsonPipe = JSON.stringify(compositorProxySession.nativeCompositorSession.webFS.mkpipe())
  res.writeStatus('201 Created').writeHeader('Content-Type', 'application/json').end(jsonPipe)
}

export function postMkstempMmap(compositorProxySession: CompositorProxySession, res: HttpResponse, req: HttpRequest) {
  const bufferChunks: Uint8Array[] = []

  res.onAborted(() => {
    /* nothing todo here */
  })
  res.onData((chunk, isLast) => {
    bufferChunks.push(new Uint8Array(chunk))
    if (isLast) {
      const buffer = Buffer.concat(bufferChunks)
      if (buffer.byteLength === 0) {
        res
          .writeStatus('400 Bad Request')
          .writeHeader('Content-Type', 'text/plain')
          .end('Bad argument. Data can not be empty.')
        return
      }
      const jsonShmWebFD = JSON.stringify(compositorProxySession.nativeCompositorSession.webFS.mkstempMmap(buffer))
      res.writeStatus('201 Created').writeHeader('Content-Type', 'application/json').end(jsonShmWebFD)
    }
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

export function getWebFD(
  compositorProxySession: CompositorProxySession,
  httpResponse: HttpResponse,
  httpRequest: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  const count = asNumber(new URLSearchParams(httpRequest.getQuery()).get('count'))
  if (fd === undefined || count === undefined) {
    httpResponse.writeStatus('400 Bad Request').writeHeader('Content-Type', 'text/plain').end('Bad argument.')
    return
  }

  let lastOffset = 0
  let dataChunk: Uint8Array | undefined = undefined

  httpResponse.onAborted(() => dataChunk === undefined)

  const readBuffer = new Uint8Array(count)
  fs.read(fd, readBuffer, 0, count, 0, (err, bytesRead, chunk) => {
    httpResponse.cork(() => {
      if (err) {
        // TODO check error and write better status
        if (err.code === 'EBADF') {
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Content-Type', 'text/plain')
            .end(`${err.name}: ${err.message}`)
        }
        return
      }
      httpResponse.writeStatus('200 OK').writeHeader('Content-Type', 'application/octet-stream')
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

export function delWebFD(
  compositorProxySession: CompositorProxySession,
  httpResponse: HttpResponse,
  httpRequest: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    httpResponse.writeStatus('400 Bad Request').writeHeader('Content-Type', 'text/plain').end('Bad argument.')
    return
  }

  httpResponse.onAborted(() => {
    /* do nothing */
  })

  fs.close(fd, (err) => {
    httpResponse.cork(() => {
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
            .end(`${err.name}: ${err.message}`)
        }
        return
      }
      httpResponse.writeStatus('200 OK').end()
    })
  })
}

function pipeReadableToHttpResponse(httpResponse: HttpResponse, readable: Readable) {
  let lastOffset = 0
  let dataChunk: Uint8Array | undefined = undefined

  httpResponse
    .onAborted(() => {
      readable.destroy()
    })
    .onWritable((newOffset: number) => {
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
          readable.resume()
        }
      })
      return ok
    })

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
          httpResponse.writeStatus('500 Internal Server Error').end()
        }
      })
    })
    .on('end', () => httpResponse.cork(() => httpResponse.end()))
    .once('data', () =>
      httpResponse.cork(() =>
        httpResponse.writeStatus('200 OK').writeHeader('Content-Type', 'application/octet-stream'),
      ),
    )
    .on('data', (chunk) => {
      httpResponse.cork(() => {
        dataChunk = chunk
        lastOffset = httpResponse.getWriteOffset()
        if (!httpResponse.write(chunk)) {
          readable.pause()
        }
      })
    })
}

export function getWebFDStream(
  compositorProxySession: CompositorProxySession,
  res: HttpResponse,
  req: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    res.writeStatus('400 Bad Request').writeHeader('Content-Type', 'text/plain').end('Bad argument')
    return
  }

  pipeReadableToHttpResponse(res, fs.createReadStream('ignored', { fd, highWaterMark: TRANSFER_CHUNK_SIZE }))
}

function pipeHttpRequestToWritable(httpResponse: HttpResponse, writable: Writable) {
  writable
    .on('drain', () => httpResponse.resume())
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
          httpResponse.writeStatus('500 Internal Server Error').end()
        }
      })
    })
    .on('finish', () => {
      httpResponse.cork(() => {
        httpResponse.writeStatus('200 OK').end()
      })
    })

  httpResponse
    .onAborted(() => writable.end())
    .onData((chunk, isLast) => {
      if (!writable.write(new Uint8Array(chunk.slice(0))) && !isLast) {
        httpResponse.pause()
      }
      if (isLast) {
        writable.end()
      }
    })
}

export function putWebFDStream(
  compositorProxySession: CompositorProxySession,
  res: HttpResponse,
  req: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    res.writeStatus('400 Bad Request').writeHeader('Content-Type', 'text/plain').end('Bad argument.')
    return
  }

  pipeHttpRequestToWritable(res, fs.createWriteStream('ignored', { fd, highWaterMark: TRANSFER_CHUNK_SIZE }))
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
  if (connectionId !== null) {
    const { retransmittingWebSocket, isNew } = upsertWebSocket(connectionId, ws)
    if (!isNew) {
      // reconnecting, no need to do anything
      return
    }

    if (searchParams.has('xwmFD')) {
      const wmFD = Number.parseInt(searchParams.get('xwmFD') ?? '0')
      compositorProxySession.handleXWMConnection(retransmittingWebSocket, wmFD)
    } else {
      compositorProxySession.handleConnection(retransmittingWebSocket)
    }
  } else {
    const message = 'Bad or missing query parameters.'
    logger.error(message)
    ws.close(4403, message)
  }
}
