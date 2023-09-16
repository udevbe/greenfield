import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { NativeClientSession } from '../../NativeClientSession'
import type { MessageDestination } from '../wayland-server'

export default class wl_subcompositor_interceptor {
  userData: {
    protocolChannel: RetransmittingWebSocket
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession?: NativeClientSession
  }

  R1(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination
}
