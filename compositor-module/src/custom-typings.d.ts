import { EncoderApi } from './api'
import RemoteOutOfBandChannel from './RemoteOutOfBandChannel'
import { WebFS } from './WebFS'
import { FrameCallbackFactory } from './FrameCallbackFactory'

declare module 'westfield-runtime-server' {
  export interface ClientUserData {
    readonly encoderApi: EncoderApi
    readonly webfs: WebFS
    readonly oobChannel: RemoteOutOfBandChannel
    readonly frameCallbackFactory: FrameCallbackFactory
  }
}
