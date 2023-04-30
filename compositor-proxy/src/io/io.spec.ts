// @ts-ignore
import request from 'supertest'
import { us_listen_socket, us_listen_socket_close } from 'uWebSockets.js'
import { createApp } from '../App'
import { ProxySession, createProxySession } from '../ProxySession'
import jestOpenAPI from 'jest-openapi'
import { resolve } from 'path'
import { ProxyFD } from './types'
import { writeFile, close, readFile } from 'fs'
import { request as httpRequest } from 'http'
import { createProxyInputOutput } from './ProxyInputOutput'
import { createMemoryMappedFile, makePipe } from 'westfield-proxy'

describe('compositor-proxy i/o', () => {
  const compositorSessionId = 'test_compositor_session_id'

  const ownPort = 8888
  const ownHostName = '0.0.0.0'
  const ownBasePath = `http://localhost:${ownPort}`
  let ownApp: us_listen_socket
  let ownCompositorProxySession: ProxySession

  const otherPort = 8889
  const otherHostName = '0.0.0.0'
  const otherBasePath = `http://localhost:${otherPort}`
  let otherApp: us_listen_socket
  let otherCompositorProxySession: ProxySession

  beforeEach(async () => {
    ownCompositorProxySession = createProxySession(compositorSessionId)
    ownApp = await createApp({ host: ownHostName, port: ownPort })

    otherCompositorProxySession = createProxySession(compositorSessionId)
    otherApp = await createApp({ host: otherHostName, port: otherPort })
  })

  afterEach(async () => {
    ownCompositorProxySession.nativeCompositorSession.destroy()
    otherCompositorProxySession.nativeCompositorSession.destroy()
    us_listen_socket_close(ownApp)
    us_listen_socket_close(otherApp)
  })

  it('creates a new local pipe pair when receiving a remote write-pipe webfd', (done) => {
    // Given
    const ownProxyIO = createProxyInputOutput(ownCompositorProxySession, ownBasePath)
    const otherPipeFDs = new Uint32Array(2)
    makePipe(otherPipeFDs)

    const otherReadPipeHandle = otherPipeFDs[0]
    const otherWritePipeHandle = otherPipeFDs[1]

    const otherProxyFD: ProxyFD = {
      handle: otherWritePipeHandle,
      type: 'pipe-write',
      host: otherBasePath,
      proxySessionKey: otherCompositorProxySession.sessionKey,
    }

    const ownWritePipeHandle = ownProxyIO.proxyFDtoNativeFD(otherProxyFD)

    const sendBuffer = Buffer.from([1, 2, 3, 4])
    // When
    writeFile(ownWritePipeHandle, sendBuffer, (err) => {
      if (err) {
        done(err)
      }
      close(ownWritePipeHandle)
    })

    // Then
    readFile(otherReadPipeHandle, (err, data) => {
      if (err) {
        done(err)
        return
      }
      expect(data).toEqual(sendBuffer)
      done()
      close(otherReadPipeHandle)
    })
  })
})

describe('compositor-proxy io rest api', () => {
  jestOpenAPI(resolve('./api.yaml'))

  const port = 8888
  const hostName = '0.0.0.0'
  const host = `${hostName}:${port}`
  const compositorSessionId = 'test_compositor_session_id'
  let app: us_listen_socket
  let compositorProxySession: ProxySession

  beforeEach(async () => {
    compositorProxySession = createProxySession(compositorSessionId)
    app = await createApp({ host: hostName, port })
  })

  afterEach(async () => {
    us_listen_socket_close(app)
    compositorProxySession.nativeCompositorSession.destroy()
  })

  it('creates a native pipe', (done) => {
    // Given
    // When
    request(host)
      .post('/mkfifo')
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(201)
      .expect('Content-Type', 'application/json')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks authorization when creating a native pipe', (done) => {
    // Given
    // When
    request(host)
      .post('/mkfifo')
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('creates a temporary memory mapped file', (done) => {
    // Given
    // When
    request(host)
      .post('/mkstemp-mmap')
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      .send(Buffer.from([1, 2, 3]))
      // Then
      .expect(201)
      .expect('Content-Type', 'application/json')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for zero content size when creating a temporary memory mapped file', (done) => {
    // Given
    // When
    request(host)
      .post('/mkstemp-mmap')
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks authorization when creating a temporary memory mapped file', (done) => {
    // Given
    // When
    request(host)
      .post('/mkstemp-mmap')
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('closes a ProxyFD', (done) => {
    // Given
    const handle = createMemoryMappedFile(Buffer.from([1, 2, 3]))
    const proxyFD: ProxyFD = { handle, type: 'shm', host, proxySessionKey: compositorProxySession.sessionKey }
    // When
    request(host)
      .del(`/fd/${proxyFD.handle}`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(200)
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end((err, res) => {
        close(handle)
        done(err, res)
      })
  })

  it('checks authorization when closing a ProxyFd', (done) => {
    // Given
    // When
    request(host)
      .del(`/fd/123`)
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed FD when closing a ProxyFD', (done) => {
    // Given
    // When
    request(host)
      .del(`/fd/abc`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for an unknown FD when closing a ProxyFD', (done) => {
    // Given
    // When
    request(host)
      .del(`/fd/123`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('reads a chunk from a ProxyFD', (done) => {
    // Given
    const sendBuffer = Buffer.from([1, 2, 3])
    const handle = createMemoryMappedFile(sendBuffer)
    const proxyFD: ProxyFD = { handle, type: 'shm', host, proxySessionKey: compositorProxySession.sessionKey }
    // When
    request(host)
      .get(`/fd/${proxyFD.handle}`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .query({ count: 2 })
      // Then
      .expect(200)
      .expect('Content-Type', 'application/octet-stream')
      // TODO enable this once https://github.com/openapi-library/OpenAPIValidators/issues/275  is fixed
      //.expect((res) => expect(res).toSatisfyApiSpec())
      .expect(Buffer.from([1, 2]))
      .end((err, res) => {
        close(handle)
        done(err, res)
      })
  })

  it('checks authorization when reading a chunk from a ProxyFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/fd/123`)
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed fd when reading a chunk from a ProxyFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/fd/abc`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed count query param when reading a chunk from a ProxyFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/fd/123456`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .query({ count: 'abc' })
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for unknown fd when reading a chunk from a ProxyFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/fd/123456`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .query({ count: 123 })
      // Then
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('streams data to a webfd', (done) => {
    // Given
    const pipefds = new Uint32Array(2)
    makePipe(pipefds)
    const readPipeHandle = pipefds[0]
    const writePipeHandle = pipefds[1]
    const sendBuffer = Buffer.from([1, 2, 3])
    // When
    request(host)
      .put(`/fd/${writePipeHandle}/stream`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      .send(sendBuffer)
      // Then
      .expect(200)
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end((err, res) => {
        close(pipefds[0])
        close(pipefds[1])
      })

    readFile(readPipeHandle, (err, data) => {
      if (err) {
        done(err)
        return
      }
      expect(data).toEqual(sendBuffer)
      done()
    })
  })

  it('handles backpressure when streaming data to a webfd', (done) => {
    // Given
    const pipefds = new Uint32Array(2)
    makePipe(pipefds)
    const readPipeHandle = pipefds[0]
    const writePipeHandle = pipefds[1]
    // send 8MB of data
    const buffer = Buffer.allocUnsafe(8 * 1024 * 1024).fill('ABC')
    // When
    request(host)
      .put(`/fd/${writePipeHandle}/stream`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      .send(buffer)
      // Then
      .expect(200)
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end((err, res) => {
        close(pipefds[0])
        close(pipefds[1])
      })

    readFile(readPipeHandle, (err, data) => {
      if (err) {
        done(err)
        return
      }
      expect(data.byteLength).toEqual(buffer.byteLength)
      done()
    })
  })

  it('checks authorization when streaming data to a webfd', (done) => {
    // Given
    // When
    request(host)
      .put(`/fd/123456/stream`)
      .set('Content-Type', 'application/octet-stream')
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed fd when streaming data to a webfd', (done) => {
    // Given
    // When
    request(host)
      .put(`/fd/abc/stream`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for unknown fd when streaming data to a webfd', (done) => {
    // Given
    // When
    request(host)
      .put(`/fd/123456/stream`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      // Then
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('streams data from a webfd', (done) => {
    // Given
    const pipefds = new Uint32Array(2)
    makePipe(pipefds)
    const readPipeHandle = pipefds[0]
    const writePipeHandle = pipefds[1]
    const buffer = Buffer.from([1, 2, 3])

    // When
    writeFile(writePipeHandle, buffer, null, (err) => {
      if (err) done(err)
      close(writePipeHandle)
    })

    request(host)
      .get(`/fd/${readPipeHandle}/stream`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(200)
      .expect('Content-Type', 'application/octet-stream')
      // TODO enable this once https://github.com/openapi-library/OpenAPIValidators/issues/275  is fixed
      //.expect((res) => expect(res).toSatisfyApiSpec())
      .expect(buffer)
      .end(done)
  })

  it('streams data from a webfd using preferred chunk size', (done) => {
    // Given
    const pipeFDs = new Uint32Array(2)
    makePipe(pipeFDs)
    const readPipeHandle = pipeFDs[0]
    const writePipeHandle = pipeFDs[1]
    const buffer = Buffer.from([1, 2, 3])

    // When
    writeFile(writePipeHandle, buffer, null, (err) => {
      if (err) done(err)
      close(writePipeHandle)
    })

    const chunks: any[] = []
    request(host)
      .get(`/fd/${readPipeHandle}/stream`)
      .query({ chunkSize: 1 })
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(200)
      .expect('Content-Type', 'application/octet-stream')
      // TODO enable this once https://github.com/openapi-library/OpenAPIValidators/issues/275  is fixed
      //.expect((res) => expect(res).toSatisfyApiSpec())
      .buffer()
      .parse((res, callback) => {
        res.on('data', (chunk) => {
          chunks.push(chunk)
        })
        res.on('end', () => {
          callback(null, null)
        })
      })
      .end((err) => {
        if (err) {
          done(err)
          return
        }
        expect(chunks).toHaveLength(3)
        expect(Buffer.concat(chunks)).toEqual(buffer)
        done()
      })
  })

  it('handles backpressure when streaming data from a webfd', (done) => {
    // Given
    const pipefds = new Uint32Array(2)
    makePipe(pipefds)
    const readPipeHandle = pipefds[0]
    const writePipeHandle = pipefds[1]
    // send 8MB of data
    const buffer = Buffer.allocUnsafe(8 * 1024 * 1024).fill('ABC')

    // When
    writeFile(writePipeHandle, buffer, null, (err) => {
      if (err) {
        done(err)
      }
      close(writePipeHandle)
    })
    httpRequest(
      {
        hostname: 'localhost',
        port: 8888,
        path: `/fd/${readPipeHandle}/stream`,
        method: 'GET',
        headers: {
          ['X-Greenfield-Proxy-Session-Key']: compositorSessionId,
        },
      },
      (res) => {
        res.pause()
        const receiveChunks: Buffer[] = []
        const intervalId = setInterval(() => {
          // slowly read 1MB chunks to trigger backpressure
          const result: Buffer = res.read(1024 * 1024)
          if (result) {
            receiveChunks.push(result)
          }
        }, 250)
        res.on('close', () => {
          clearInterval(intervalId)
          const chunksLength = Buffer.concat(receiveChunks).byteLength
          expect(chunksLength).toBe(buffer.byteLength)
          done()
        })
      },
    ).end()
  })

  it('checks authorization when streaming data from a webfd', (done) => {
    // Given
    // When
    request(host)
      .get(`/fd/123456/stream`)
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed fd when streaming data from a webfd', (done) => {
    // Given
    // When
    request(host)
      .get(`/fd/abc/stream`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for unknown fd when streaming data from a webfd', (done) => {
    // Given
    // When
    request(host)
      .get(`/fd/123456/stream`)
      .set('X-Greenfield-Proxy-Session-Key', compositorSessionId)
      // Then
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })
})
