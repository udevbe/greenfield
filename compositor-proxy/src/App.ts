import { App, HttpRequest, HttpResponse, TemplatedApp } from 'uWebSockets.js'
import { findProxySessionByCompositorSessionId, ProxySession } from './ProxySession'
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
import { channelHandling, signalHandling } from './AppWebSocketsController'

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
    const proxySession = findProxySessionByCompositorSessionId(req.getHeader('x-compositor-session-id'))
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

export function createApp(proxySession: ProxySession): TemplatedApp {
  return App()
    .options('/mkfifo', OPTIONSPreflightRequest(proxySession, 'POST'))
    .post('/mkfifo', withAuth(POSTMkFifo))

    .options('/mkstemp-mmap', OPTIONSPreflightRequest(proxySession, 'POST'))
    .post('/mkstemp-mmap', withAuth(POSTMkstempMmap))

    .options('/fd/:fd', OPTIONSPreflightRequest(proxySession, 'GET, DEL'))
    .get('/fd/:fd', withAuth(withParams(1, GETWebFD)))
    .del('/fd/:fd', withAuth(withParams(1, DELWebFD)))

    .options('/fd/:fd/stream', OPTIONSPreflightRequest(proxySession, 'GET, PUT'))
    .get('/fd/:fd/stream', withAuth(withParams(1, GETWebFDStream)))
    .put('/fd/:fd/stream', withAuth(withParams(1, PUTWebFDStream)))

    .options('/client/:clientId/surface/:surfaceId/encoder/keyframe', OPTIONSPreflightRequest(proxySession, 'POST'))
    .post('/client/:clientId/surface/:surfaceId/encoder/keyframe', withAuth(withParams(2, POSTEncoderKeyframe)))

    .ws('/signal', signalHandling())
    .ws('/channel', channelHandling())
}
