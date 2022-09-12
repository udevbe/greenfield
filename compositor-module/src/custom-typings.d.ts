import { EncoderApi } from './api'
import { WebFS } from './WebFS'
import { ClientEncodersFeedback } from './remotestreaming/EncoderFeedback'

declare module 'westfield-runtime-server' {
  export interface ClientUserData {
    readonly encoderApi?: EncoderApi
    readonly webfs: WebFS
    readonly clientEncodersFeedback?: ClientEncodersFeedback
  }
}
