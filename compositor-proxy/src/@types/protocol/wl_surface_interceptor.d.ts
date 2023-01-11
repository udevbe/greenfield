import { Encoder } from '../../encoding/Encoder'
import { FrameFeedback } from '../../FrameFeedback'
import { NativeClientSession } from '../../NativeClientSession'
import { MessageDestination } from '../../../../../westfield/server/node/proxy'
import { PeerConnection } from 'node-datachannel'
import { ARQDataChannel } from '../../ARQDataChannel'

export default class wl_surface_interceptor {
  frameDataChannel: ARQDataChannel
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
    protocolChannel: ARQDataChannel
    peerConnection: PeerConnection
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession: NativeClientSession
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
