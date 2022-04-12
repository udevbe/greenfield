import request from 'supertest'
import { us_listen_socket, us_listen_socket_close } from 'uWebSockets.js'
import { createApp } from '../App'
import { CompositorProxySession, createCompositorProxySession } from '../CompositorProxySession'
import jestOpenAPI from 'jest-openapi'
import path from 'path'
import { Webfd } from './types'
import fs from 'fs'
import http from 'http'
import { createCompositorProxyWebFS } from './ProxyWebFS'
import { createMemoryMappedFile, makePipe } from 'westfield-proxy'

describe('compositor-proxy webfs', () => {
  const compositorSessionId = 'test_compositor_session_id'

  const ownPort = 8888
  const ownHostName = '0.0.0.0'
  const ownBasePath = `http://localhost:${ownPort}`
  let ownApp: us_listen_socket
  let ownCompositorProxySession: CompositorProxySession

  const otherPort = 8889
  const otherHostName = '0.0.0.0'
  const otherHost = `${otherHostName}:${otherPort}`
  const otherBasePath = `http://localhost:${otherPort}`
  let otherApp: us_listen_socket
  let otherCompositorProxySession: CompositorProxySession

  beforeEach(async () => {
    ownCompositorProxySession = createCompositorProxySession(compositorSessionId)
    ownApp = await createApp(ownCompositorProxySession, { host: ownHostName, port: ownPort })

    otherCompositorProxySession = createCompositorProxySession(compositorSessionId)
    otherApp = await createApp(otherCompositorProxySession, { host: otherHostName, port: otherPort })
  })

  afterEach(async () => {
    us_listen_socket_close(ownApp)
    us_listen_socket_close(otherApp)

    ownCompositorProxySession.nativeCompositorSession.destroy()
    otherCompositorProxySession.nativeCompositorSession.destroy()

    await ownCompositorProxySession.onDestroy()
    await otherCompositorProxySession.onDestroy()
  })

  it('creates a new local pipe pair when receiving a remote write-pipe webfd', (done) => {
    // Given
    const ownProxyWebFS = createCompositorProxyWebFS(compositorSessionId, ownBasePath)
    const otherPipefds = new Uint32Array(2)
    makePipe(otherPipefds)

    const [otherReadPipeHandle, otherWritePipeHandle] = otherPipefds
    const otherWebFD: Webfd = {
      handle: otherWritePipeHandle,
      type: 'pipe-write',
      host: otherBasePath,
    }

    const ownWritePipeHandle = ownProxyWebFS.webFDtoNativeFD(otherWebFD)

    const sendBuffer = Buffer.from([1, 2, 3, 4])
    // When
    fs.writeFile(ownWritePipeHandle, sendBuffer, (err) => {
      if (err) {
        done(err)
      }
      fs.close(ownWritePipeHandle)
    })

    // Then
    fs.readFile(otherReadPipeHandle, (err, data) => {
      if (err) {
        done(err)
        return
      }
      expect(data).toEqual(sendBuffer)
      done()
      fs.close(otherReadPipeHandle)
    })
  })
})

describe('compositor-proxy webfs rest api', () => {
  jestOpenAPI(path.resolve('./api.yaml'))

  const port = 8888
  const hostName = '0.0.0.0'
  const host = `${hostName}:${port}`
  const compositorSessionId = 'test_compositor_session_id'
  let app: us_listen_socket
  let compositorProxySession: CompositorProxySession

  beforeEach(async () => {
    compositorProxySession = createCompositorProxySession(compositorSessionId)
    app = await createApp(compositorProxySession, { host: hostName, port })
  })

  afterEach(async () => {
    us_listen_socket_close(app)
    compositorProxySession.nativeCompositorSession.destroy()
    await compositorProxySession.onDestroy()
  })

  it('creates a native pipe', (done) => {
    // Given
    // When
    request(host)
      .post('/mkfifo')
      .set('X-Compositor-Session-Id', compositorSessionId)
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
      .set('X-Compositor-Session-Id', compositorSessionId)
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
      .set('X-Compositor-Session-Id', compositorSessionId)
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

  it('closes a WebFd', (done) => {
    // Given
    const handle = createMemoryMappedFile(Buffer.from([1, 2, 3]))
    const webfd: Webfd = { handle, type: 'shm', host }
    // When
    request(host)
      .del(`/webfd/${webfd.handle}`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      // Then
      .expect(200)
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end((err, res) => {
        fs.close(handle)
        done(err, res)
      })
  })

  it('checks authorization when closing a WebFd', (done) => {
    // Given
    // When
    request(host)
      .del(`/webfd/123`)
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed FD when closing a WebFd', (done) => {
    // Given
    // When
    request(host)
      .del(`/webfd/abc`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for an unknown FD when closing a WebFd', (done) => {
    // Given
    // When
    request(host)
      .del(`/webfd/123`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      // Then
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('reads a chunk from a WebFD', (done) => {
    // Given
    const sendBuffer = Buffer.from([1, 2, 3])
    const handle = createMemoryMappedFile(sendBuffer)
    const webfd: Webfd = { handle, type: 'shm', host }
    // When
    request(host)
      .get(`/webfd/${webfd.handle}`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      .query({ count: 2 })
      // Then
      .expect(200)
      .expect('Content-Type', 'application/octet-stream')
      // TODO enable this once https://github.com/openapi-library/OpenAPIValidators/issues/275  is fixed
      //.expect((res) => expect(res).toSatisfyApiSpec())
      .expect(Buffer.from([1, 2]))
      .end((err, res) => {
        fs.close(handle)
        done(err, res)
      })
  })

  it('checks authorization when reading a chunk from a WebFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/webfd/123`)
      // Then
      .expect(401)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed fd when reading a chunk from a WebFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/webfd/abc`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for a malformed count query param when reading a chunk from a WebFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/webfd/123456`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      .query({ count: 'abc' })
      // Then
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })

  it('checks for unknown fd when reading a chunk from a WebFD', (done) => {
    // Given
    // When
    request(host)
      .get(`/webfd/123456`)
      .set('X-Compositor-Session-Id', compositorSessionId)
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
    const [readPipeHandle, writePipeHandle] = pipefds
    const sendBuffer = Buffer.from([1, 2, 3])
    // When
    request(host)
      .put(`/webfd/${writePipeHandle}/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      .send(sendBuffer)
      // Then
      .expect(200)
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end((err, res) => {
        fs.close(pipefds[0])
        fs.close(pipefds[1])
      })

    fs.readFile(readPipeHandle, (err, data) => {
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
    const [readPipeHandle, writePipeHandle] = pipefds
    // send 8MB of data
    const buffer = Buffer.allocUnsafe(8 * 1024 * 1024).fill('ABC')
    // When
    request(host)
      .put(`/webfd/${writePipeHandle}/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      .send(buffer)
      // Then
      .expect(200)
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end((err, res) => {
        fs.close(pipefds[0])
        fs.close(pipefds[1])
      })

    fs.readFile(readPipeHandle, (err, data) => {
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
      .put(`/webfd/123456/stream`)
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
      .put(`/webfd/abc/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
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
      .put(`/webfd/123456/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
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
    const [readPipeHandle, writePipeHandle] = pipefds
    const buffer = Buffer.from([1, 2, 3])

    // When
    fs.writeFile(writePipeHandle, buffer, null, (err) => {
      if (err) {
        done(err)
      }
      fs.close(writePipeHandle)
    })

    request(host)
      .get(`/webfd/${readPipeHandle}/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      // Then
      .expect(200)
      .expect('Content-Type', 'application/octet-stream')
      // TODO enable this once https://github.com/openapi-library/OpenAPIValidators/issues/275  is fixed
      //.expect((res) => expect(res).toSatisfyApiSpec())
      .expect(buffer)
      .end(done)
  })

  it('handles backpressure when streaming data from a webfd', (done) => {
    // Given
    const pipefds = new Uint32Array(2)
    makePipe(pipefds)
    const [readPipeHandle, writePipeHandle] = pipefds
    // send 8MB of data
    const buffer = Buffer.allocUnsafe(8 * 1024 * 1024).fill('ABC')

    // When
    fs.writeFile(writePipeHandle, buffer, null, (err) => {
      if (err) {
        done(err)
      }
      fs.close(writePipeHandle)
    })

    const httpRequest = http
      .request(
        {
          hostname: 'localhost',
          port: 8888,
          path: `/webfd/${readPipeHandle}/stream`,
          method: 'GET',
          headers: {
            ['X-Compositor-Session-Id']: compositorSessionId,
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
      )
      .end()
  })

  it('checks authorization when streaming data from a webfd', (done) => {
    // Given
    // When
    request(host)
      .get(`/webfd/123456/stream`)
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
      .get(`/webfd/abc/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
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
      .get(`/webfd/123456/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      // Then
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })
})
