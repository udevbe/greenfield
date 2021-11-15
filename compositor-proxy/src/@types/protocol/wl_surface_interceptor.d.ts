import { FrameEncoder } from '../../encoding/FrameEncoder'
import { WebSocketChannel } from '../../WebSocketChannel'

export default class wl_surface_interceptor {
  bufferResourceId: number
  encoder: FrameEncoder
  userData: { communicationChannel: WebSocketChannel }
  wlClient: unknown
  R1(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number
  R6(message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number }): number
}
