import { Encoder } from '../../encoding/Encoder'
import { FrameFeedback } from '../../FrameFeedback'
import { MessageDestination } from '../../../../../westfield/server/node/proxy'
import type { Channel } from '../../Channel'
import { NativeAppContext } from '../../NativeAppContext'
import { NativeWaylandClientSession } from '../../NativeWaylandClientSession'

export default class wl_surface_interceptor {
  frameDataChannel: Channel
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
    protocolChannel: Channel
    drmContext: unknown
    messageInterceptors: Record<number, any>
    nativeClientSession: NativeWaylandClientSession
  }
  wlClient: unknown
  id: number

  /**
   * destroy
   */
  R0(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * attach
   */
  R1(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * damage
   */
  R2(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * frame
   */
  R3(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * set_opaque_region
   */
  R4(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * set_input_region
   */
  R5(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * commit
   */
  R6(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * enter
   */
  R7(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * leave
   */
  R8(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * set_buffer_transform
   */
  R9(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * set_buffer_scale
   */
  R10(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination

  /**
   * damage_buffer
   */
  R11(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination
}
