import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { NativeWaylandClientSession } from '../../NativeWaylandClientSession'
import { MessageDestination } from '../../../../../westfield/server/node/proxy'

export default class wl_subcompositor_interceptor {
  userData: {
    protocolChannel: RetransmittingWebSocket
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession?: NativeWaylandClientSession
  }

  R1(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination
}
