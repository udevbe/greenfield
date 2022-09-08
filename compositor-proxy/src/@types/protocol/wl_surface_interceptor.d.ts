import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { Encoder } from '../../encoding/Encoder'
import { FrameFeedback } from '../../FrameFeedback'
import { NativeClientSession } from '../../NativeClientSession'

export default class wl_surface_interceptor {
  destroyed: boolean
  frameFeedback: FrameFeedback
  bufferResourceId?: number
  sendBufferResourceId: number
  encoder: Encoder
  userData: {
    communicationChannel: RetransmittingWebSocket
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession?: NativeClientSession
  }
  wlClient: unknown
  id: number

  encodeAndSendBuffer(syncSerial: number): void

  R0(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number

  R1(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number

  R3(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number

  R6(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number
}
