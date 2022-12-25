import { EncoderApi } from './api'
import { InputOutput } from './InputOutput'
import { ClientEncodersFeedback } from './remote/EncoderFeedback'

declare module 'westfield-runtime-server' {
  export interface ClientUserData {
    readonly encoderApi?: EncoderApi
    readonly clientEncodersFeedback?: ClientEncodersFeedback
    readonly inputOutput: InputOutput
  }
}
