import { EncoderApi } from './api'
import { WebFS } from './WebFS'
import { FrameCallbackFactory } from './FrameCallbackFactory'
import { ClientEncodersFeedback } from './remotestreaming/EncoderFeedback'

declare module 'westfield-runtime-server' {
  export interface ClientUserData {
    readonly encoderApi?: EncoderApi
    readonly webfs: WebFS
    readonly frameCallbackFactory: FrameCallbackFactory
    readonly clientEncodersFeedback?: ClientEncodersFeedback
  }
}
