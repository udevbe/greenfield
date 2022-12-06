import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { Encoder } from '../../encoding/Encoder'
import { FrameFeedback } from '../../FrameFeedback'
import { NativeClientSession } from '../../NativeClientSession'
import { MessageDestination } from '../../../../../westfield/server/node/proxy'

export default class wl_surface_interceptor {
  destroyed: boolean
  frameFeedback?: FrameFeedback

  pendingBufferResourceId?: number
  pendingBufferDestroyListener?: () => void
  pendingFrameCallbacksIds: number[]

  surfaceState?: {
    readonly bufferResourceId: number
    readonly encodingPromise: Promise<void>
  }
  bufferDestroyListener?: () => void

  encoder: Encoder
  userData: {
    protocolChannel: RetransmittingWebSocket
    frameDataChannel: RetransmittingWebSocket
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession?: NativeClientSession
  }
  wlClient: unknown
  id: number

  encodeAndSendBuffer(args: {
    bufferResourceId: number
    bufferCreationSerial: number
    bufferContentSerial: number
  }): Promise<void>

  R0(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  R1(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  R3(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  R6(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination
}
