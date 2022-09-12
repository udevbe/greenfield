import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { NativeClientSession } from '../../NativeClientSession'
import { MessageDestination } from '../../../../../westfield/server/node/proxy'

export default class wl_subsurface_interceptor {
  userData: {
    communicationChannel: RetransmittingWebSocket
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession?: NativeClientSession
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
