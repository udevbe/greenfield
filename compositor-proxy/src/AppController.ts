import type { ProxySession } from './ProxySession'
import type { HttpRequest, HttpResponse } from 'uWebSockets.js'
import { read, close, createReadStream, createWriteStream } from 'fs'
import { TRANSFER_CHUNK_SIZE } from './io/ProxyInputOutput'
import { Readable, Writable } from 'stream'
import { createLogger } from './Logger'
import { URLSearchParams } from 'url'
import { config } from './config'
import { operations } from './@types/api'
import wl_surface_interceptor from './@types/protocol/wl_surface_interceptor'

const logger = createLogger('app')

const allowOrigin = config.server.http.allowOrigin
const allowHeaders = 'Content-Type, X-Compositor-Session-Id'
const maxAge = '36000'

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

export function POSTMkFifo(proxySession: ProxySession, res: HttpResponse) {
  const jsonPipe = JSON.stringify(proxySession.nativeCompositorSession.webFS.mkpipe())
  res
    .writeStatus('201 Created')
    .writeHeader('Access-Control-Allow-Origin', allowOrigin)
    .writeHeader('Content-Type', 'application/json')
    .end(jsonPipe)
}

export function POSTMkstempMmap(proxySession: ProxySession, res: HttpResponse) {
  const bufferChunks: Uint8Array[] = []

  res.onAborted(() => logger.info('POST /mkstemp-mmap aborted. Ignoring.'))
  res.onData((chunk, isLast) => {
    res.cork(() => {
      bufferChunks.push(new Uint8Array(chunk.slice(0)))
      if (isLast) {
        const buffer = Buffer.concat(bufferChunks)
        if (buffer.byteLength === 0) {
          logger.error('POST /mkstemp-mmap received empty body from client.')
          res
            .writeStatus('400 Bad Request')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
            .writeHeader('Content-Type', 'text/plain')
            .end('Data in HTTP request body can not be empty.')
          return
        }
        const jsonShmWebFD = JSON.stringify(proxySession.nativeCompositorSession.webFS.mkstempMmap(buffer))
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
  proxySession: ProxySession,
  httpResponse: HttpResponse,
  httpRequest: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  const countParam = new URLSearchParams(httpRequest.getQuery()).get('count')
  const count = asNumber(countParam)
  if (fd === undefined || count === undefined) {
    logger.error('GET /webfd received empty arguments from client.')
    httpResponse
      .writeStatus('400 Bad Request')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end(`File descriptor and count argument must be a positive integer. Got fd: ${fdParam}, count: ${count}`)
    return
  }

  let lastOffset = 0
  let dataChunk: Uint8Array | undefined = undefined

  httpResponse.onAborted(() => {
    logger.info('GET /webfd aborted. Ignoring.')
  })

  const readBuffer = new Uint8Array(count)
  read(fd, readBuffer, 0, count, 0, (err, bytesRead, chunk) => {
    httpResponse.cork(() => {
      if (err) {
        if (err.code === 'EBADF') {
          logger.error('GET /webfd received unknown fd from client.')
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          logger.error(`GET /webfd could not read fd received from client: ${err.name}: ${err.message}`)
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
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
  proxySession: ProxySession,
  httpResponse: HttpResponse,
  httpRequest: HttpRequest,
  [fdParam]: string[],
) {
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    logger.error('DEL /webfd received empty fd argument from client.')
    httpResponse
      .writeStatus('400 Bad Request')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .end(`File descriptor argument must be a positive integer. Got: ${fdParam}`)
    return
  }

  httpResponse.onAborted(() => {
    logger.info('DEL /webfd aborted. Ignoring.')
  })

  close(fd, (err) => {
    httpResponse.cork(() => {
      // TODO log error
      if (err) {
        if (err.code === 'EBADF') {
          logger.error('DEL /webfd received unknown fd from client.')
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          logger.error(`DEL /webfd could not close fd received from client: ${err.name}: ${err.message}`)
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
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
          logger.error(`Bad FD. Could not pipe readable stream: ${error.name}: ${error.message}`)
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          logger.error(`Could not pipe readable stream: ${error.name}: ${error.message}`)
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
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

export function GETWebFDStream(proxySession: ProxySession, res: HttpResponse, req: HttpRequest, [fdParam]: string[]) {
  const fd = asNumber(fdParam)
  const chunkSize = asNumber(new URLSearchParams(req.getQuery()).get('chunkSize')) ?? TRANSFER_CHUNK_SIZE
  if (fd === undefined) {
    // TODO log error
    res
      .writeStatus('400 Bad Request')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end(`File descriptor argument must be a positive integer. Got: ${fdParam}`)
    return
  }

  pipeReadableToHttpResponse(res, createReadStream('ignored', { fd, highWaterMark: chunkSize }))
}

function pipeHttpRequestToWritable(httpResponse: HttpResponse, writable: Writable) {
  let inError = false
  writable
    .on('drain', () => httpResponse.resume())
    // TODO log error
    .on('error', (error) => {
      httpResponse.cork(() => {
        inError = true
        // @ts-ignore
        if (error.code === 'EBADF') {
          logger.error('Attempted to stream data to a non-existing FD.', error)
          httpResponse
            .writeStatus('404 Not Found')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
            .writeHeader('Content-Type', 'text/plain')
            .end('File descriptor not found.')
        } else {
          logger.error('Unexpected error when trying to stream data to an FD.', error)
          httpResponse
            .writeStatus('500 Internal Server Error')
            .writeHeader('Access-Control-Allow-Origin', allowOrigin)
            .writeHeader('Content-Type', 'text/plain')
            .end(`${error.name}: ${error.message}`)
        }
      })
    })
    .on('close', () => {
      if (inError) {
        return
      }
      httpResponse.cork(() => {
        httpResponse.writeStatus('200 OK').writeHeader('Access-Control-Allow-Origin', allowOrigin).end()
      })
    })

  httpResponse
    .onAborted(() => writable.end())
    .onData((chunk, isLast) => {
      if (isLast) {
        if (chunk.byteLength > 0) {
          const data = new Uint8Array(chunk.slice(0))
          writable.end(data)
        } else {
          writable.end()
        }
      } else if (chunk.byteLength > 0) {
        const data = new Uint8Array(chunk.slice(0))
        if (!writable.write(data)) {
          httpResponse.pause()
        }
      }
    })
}

export function PUTWebFDStream(proxySession: ProxySession, res: HttpResponse, req: HttpRequest, [fdParam]: string[]) {
  const fd = asNumber(fdParam)
  if (fd === undefined) {
    // TODO log error
    res
      .writeStatus('400 Bad Request')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end(`FD argument must be an unsigned integer. Got: ${fdParam}`)
    return
  }

  pipeHttpRequestToWritable(
    res,
    createWriteStream('ignored', { fd, autoClose: true, highWaterMark: TRANSFER_CHUNK_SIZE }),
  )
}

/* Helper function for reading a posted JSON body */
function readJson<T>(res: HttpResponse) {
  return new Promise<T>((resolve, reject) => {
    const chunks: Uint8Array[] = []
    /* Register data cb */
    res.onData((ab, isLast) => {
      const chunk = new Uint8Array(new ArrayBuffer(ab.byteLength))
      chunk.set(new Uint8Array(ab))
      chunks.push(chunk)
      if (isLast) {
        resolve(JSON.parse(Buffer.concat(chunks).toString()))
      }
    })
    /* Register error cb */
    res.onAborted(reject)
  })
}

export async function POSTEncoderKeyframe(
  proxySession: ProxySession,
  httpResponse: HttpResponse,
  httpRequest: HttpRequest,
  [clientIdParam, surfaceIdParam]: string[],
) {
  const clientId = clientIdParam
  const surfaceId = asNumber(surfaceIdParam)
  if (clientId === undefined || surfaceId === undefined) {
    httpResponse
      .writeStatus('400 Bad Request')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end(`Surface id argument must be a positive integer. Got client id: ${clientId}, surface id: ${surfaceId}`)
    return
  }

  const keyframeRequest = await readJson<operations['keyframe']['requestBody']['content']['application/json']>(
    httpResponse,
  )
  // TODO validate keyframeRequest

  const clientEntry = proxySession.nativeCompositorSession.clients.find(
    (clientEntry) => clientEntry.clientId === clientId,
  )

  if (clientEntry === undefined) {
    httpResponse
      .writeStatus('404 Not Found')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end('Client not found.')
    return
  }

  const wlSurfaceInterceptor = clientEntry.nativeClientSession?.messageInterceptor.interceptors[
    surfaceId
  ] as wl_surface_interceptor
  if (wlSurfaceInterceptor === undefined) {
    logger.error(
      'Received a key frame unit request but no surface found that matches the request. Surface already destroyed?',
    )
    httpResponse
      .writeStatus('404 Not Found')
      .writeHeader('Access-Control-Allow-Origin', allowOrigin)
      .writeHeader('Content-Type', 'text/plain')
      .end('Surface not found.')
    return
  }
  // FIXME currently broken
  // if (wlSurfaceInterceptor.surfaceState?.bufferResourceId !== keyframeRequest.bufferId) {
  //   logger.error(
  //     'Received a key frame unit request but no buffer for surface found that matches the request. Buffer already destroyed?',
  //   )
  //   httpResponse
  //     .writeStatus('404 Not Found')
  //     .writeHeader('Access-Control-Allow-Origin', allowOrigin)
  //     .writeHeader('Content-Type', 'text/plain')
  //     .end('Surface not found.')
  //   return
  // }
  wlSurfaceInterceptor.encoder.requestKeyUnit()
  // wlSurfaceInterceptor.encodeAndSendBuffer({
  //   bufferResourceId: keyframeRequest.bufferId,
  //   bufferCreationSerial: keyframeRequest.bufferCreationSerial,
  //   bufferContentSerial: keyframeRequest.bufferContentSerial,
  // })

  httpResponse.writeStatus('202 Accepted').writeHeader('Access-Control-Allow-Origin', allowOrigin).end()
}
