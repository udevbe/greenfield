import { InputOutput } from './InputOutput'
import { ClientEncodersFeedback } from './remote/EncoderFeedback'

declare module 'westfield-runtime-server' {
  export interface ClientUserData {
    readonly baseURL?: string
    readonly clientEncodersFeedback?: ClientEncodersFeedback
    readonly inputOutput: InputOutput
  }
}
