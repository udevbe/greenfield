import { App, HttpRequest, HttpResponse, us_listen_socket } from 'uWebSockets.js'
import { CompositorProxySession } from './CompositorProxySession'
import {
  DELWebFD,
  GETWebFD,
  GETWebFDStream,
  OPTIONSPreflightRequest,
  POSTEncoderKeyframe,
  POSTMkFifo,
  POSTMkstempMmap,
  PUTEncoderFeedback,
  PUTWebFDStream,
} from './AppController'
import { webRTCSignaling } from './SignalingController'

function withParams(
  paramCount: number,
  fdAction: (
    compositorProxySession: CompositorProxySession,
    res: HttpResponse,
    req: HttpRequest,
    params: string[],
  ) => void,
) {
  return (compositorProxySession: CompositorProxySession, res: HttpResponse, req: HttpRequest) => {
    const params: string[] = new Array<string>(paramCount)
    for (let i = 0; i < paramCount; i++) {
      params[i] = req.getParameter(i)
    }
    fdAction(compositorProxySession, res, req, params)
  }
}

function withAuth(
  compositorProxySession: CompositorProxySession,
  authorizedAction: (compositorProxySession: CompositorProxySession, res: HttpResponse, req: HttpRequest) => void,
) {
  return (res: HttpResponse, req: HttpRequest) => {
    if (req.getHeader('x-compositor-session-id') === compositorProxySession.compositorSessionId) {
      authorizedAction(compositorProxySession, res, req)
    } else {
      res
        .writeStatus('401 Unauthorized')
        .writeHeader('Content-Type', 'text/plain')
        .end('No or invalid x-compositor-session-id header.')
    }
  }
}

export function createApp(
  compositorProxySession: CompositorProxySession,
  { host, port }: { host: string; port: number },
): Promise<us_listen_socket> {
  return new Promise<us_listen_socket>((resolve, reject) => {
    App()
      .options('/mkfifo', OPTIONSPreflightRequest('POST'))
      .post('/mkfifo', withAuth(compositorProxySession, POSTMkFifo))

      .options('/mkstemp-mmap', OPTIONSPreflightRequest('POST'))
      .post('/mkstemp-mmap', withAuth(compositorProxySession, POSTMkstempMmap))

      .options('/fd/:fd', OPTIONSPreflightRequest('GET, DEL'))
      .get('/fd/:fd', withAuth(compositorProxySession, withParams(1, GETWebFD)))
      .del('/fd/:fd', withAuth(compositorProxySession, withParams(1, DELWebFD)))

      .options('/fd/:fd/stream', OPTIONSPreflightRequest('GET, PUT'))
      .get('/fd/:fd/stream', withAuth(compositorProxySession, withParams(1, GETWebFDStream)))
      .put('/fd/:fd/stream', withAuth(compositorProxySession, withParams(1, PUTWebFDStream)))

      .options('/:clientId/:surfaceId/encoder/keyframe', OPTIONSPreflightRequest('POST'))
      .post(
        '/:clientId/:surfaceId/encoder/keyframe',
        withAuth(compositorProxySession, withParams(2, POSTEncoderKeyframe)),
      )

      .options('/:clientId/encoder/feedback', OPTIONSPreflightRequest('PUT'))
      .put('/:clientId/encoder/feedback', withAuth(compositorProxySession, withParams(1, PUTEncoderFeedback)))

      .ws('/signaling', webRTCSignaling(compositorProxySession))

      .listen(host, port, (listenSocket) => {
        if (listenSocket) {
          resolve(listenSocket)
        } else {
          reject(new Error(`Failed to start compositor proxy on host: ${host} with port ${port}`))
        }
      })
  })
}
