import { EncoderApi } from './api'
import { WebFS } from './WebFS'
import { FrameCallbackFactory } from './FrameCallbackFactory'

declare module 'westfield-runtime-server' {
  export interface ClientUserData {
    readonly encoderApi?: EncoderApi
    readonly webfs: WebFS
    readonly frameCallbackFactory: FrameCallbackFactory
  }
}
