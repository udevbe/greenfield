import { Encoder } from '../../encoding/Encoder'
import { WebSocketChannel } from '../../WebSocketChannel'

export default class wl_surface_interceptor {
  bufferResourceId: number
  encoder: Encoder
  userData: { communicationChannel: WebSocketChannel }
  wlClient: unknown
  R1(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number
  R6(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number
}
