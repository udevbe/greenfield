import request from 'supertest'
import { us_listen_socket, us_listen_socket_close } from 'uWebSockets.js'
import { createApp } from './App'
import { CompositorProxySession, createCompositorProxySession } from './CompositorProxySession'
import jestOpenAPI from 'jest-openapi'
import path from 'path'
import { Webfd } from './webfs/types'
import { Endpoint } from 'westfield-endpoint'
import fs from 'fs'

describe('compositor-proxy', () => {
  jestOpenAPI(path.resolve('./api.yaml'))

  const port = 8888
  const host = `http://localhost:${port}`
  const compositorSessionId = 'test_compositor_session_id'
  let app: us_listen_socket
  let compositorProxySession: CompositorProxySession

  beforeEach(async () => {
    compositorProxySession = createCompositorProxySession(compositorSessionId)
    app = await createApp(compositorProxySession, port)
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
    const handle = Endpoint.createMemoryMappedFile(Buffer.from([1, 2, 3]))
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
    const handle = Endpoint.createMemoryMappedFile(Buffer.from([1, 2, 3]))
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
      .get(`/webfd/123`)
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
      .get(`/webfd/123`)
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
    Endpoint.makePipe(pipefds)
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

  it('checks authorization when streaming data to a webfd', (done) => {
    // Given
    // When
    request(host)
      .put(`/webfd/123/stream`)
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
      .put(`/webfd/123/stream`)
      .set('X-Compositor-Session-Id', compositorSessionId)
      .set('Content-Type', 'application/octet-stream')
      // Then
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect((res) => expect(res).toSatisfyApiSpec())
      .end(done)
  })
})
