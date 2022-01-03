import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { Encoder } from '../../encoding/Encoder'

export default class wl_surface_interceptor {
  bufferResourceId: number
  sendBufferResourceId: number
  encoder: Encoder
  userData: { communicationChannel: RetransmittingWebSocket }
  wlClient: unknown
  encodeAndSendBuffer(syncSerial: number): void
  R1(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number
  R6(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number
}
