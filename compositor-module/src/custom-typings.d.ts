import RemoteOutOfBandChannel from './RemoteOutOfBandChannel'
import { WebFS } from './WebFS'
declare module 'westfield-runtime-server' {
  export interface ClientUserData {
    readonly webfs: WebFS
    readonly oobChannel: RemoteOutOfBandChannel
  }
}
