import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { NativeWaylandClientSession } from '../../NativeWaylandClientSession'
import { MessageDestination } from '../../../../../westfield/server/node/proxy'

export default class wl_subsurface_interceptor {
  userData: {
    protocolChannel: RetransmittingWebSocket
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession?: NativeWaylandClientSession
  }
  creationArgs: [number, number]

  R4(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  R5(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination
}
