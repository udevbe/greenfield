import { App, HttpRequest, HttpResponse, us_listen_socket } from 'uWebSockets.js'
import {findProxySessionByIdentity, findProxySessionsByCompositorSessionId, ProxySession} from './ProxySession'
import {
  DELWebFD,
  GETWebFD,
  GETWebFDStream,
  OPTIONSPreflightRequest,
  POSTEncoderKeyframe,
  POSTMkFifo,
  POSTMkstempMmap,
  PUTWebFDStream,
} from './AppController'
import { connectionHandling, signalHandling } from './SignalingController'

function withParams(
  paramCount: number,
  fdAction: (proxySession: ProxySession, res: HttpResponse, req: HttpRequest, params: string[]) => void,
) {
  return (proxySession: ProxySession, res: HttpResponse, req: HttpRequest) => {
    const params: string[] = new Array<string>(paramCount)
    for (let i = 0; i < paramCount; i++) {
      params[i] = req.getParameter(i)
    }
    fdAction(proxySession, res, req, params)
  }
}

function withAuth(authorizedAction: (proxySession: ProxySession, res: HttpResponse, req: HttpRequest) => void) {
  return (res: HttpResponse, req: HttpRequest) => {
    const proxySession = findProxySessionByIdentity(req.getHeader('x-proxy-identity-id'))
    if (proxySession) {
      authorizedAction(proxySession, res, req)
    } else {
      res
        .writeStatus('401 Unauthorized')
        .writeHeader('Content-Type', 'text/plain')
        .end('No or invalid x-compositor-session-id header.')
    }
  }
}

export function createApp({ host, port }: { host: string; port: number }): Promise<us_listen_socket> {
  return new Promise<us_listen_socket>((resolve, reject) => {
    App()
      .options('/mkfifo', OPTIONSPreflightRequest('POST'))
      .post('/mkfifo', withAuth(POSTMkFifo))

      .options('/mkstemp-mmap', OPTIONSPreflightRequest('POST'))
      .post('/mkstemp-mmap', withAuth(POSTMkstempMmap))

      .options('/fd/:fd', OPTIONSPreflightRequest('GET, DEL'))
      .get('/fd/:fd', withAuth(withParams(1, GETWebFD)))
      .del('/fd/:fd', withAuth(withParams(1, DELWebFD)))

      .options('/fd/:fd/stream', OPTIONSPreflightRequest('GET, PUT'))
      .get('/fd/:fd/stream', withAuth(withParams(1, GETWebFDStream)))
      .put('/fd/:fd/stream', withAuth(withParams(1, PUTWebFDStream)))

      .options('/:clientId/:surfaceId/encoder/keyframe', OPTIONSPreflightRequest('POST'))
      .post('/:clientId/:surfaceId/encoder/keyframe', withAuth(withParams(2, POSTEncoderKeyframe)))

      .ws('/signaling', signalHandling())
      .ws('/', connectionHandling())

      .listen(host, port, (listenSocket) => {
        if (listenSocket) {
          resolve(listenSocket)
        } else {
          reject(new Error(`Failed to start compositor proxy on host: ${host} with port ${port}`))
        }
      })
  })
}
