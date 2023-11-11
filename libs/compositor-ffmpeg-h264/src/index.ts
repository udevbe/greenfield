export { init } from './H264Worker'
export type FfmpegH264Frame = {
  ptr: number
  yPlane: Uint8Array
  uPlane: Uint8Array
  vPlane: Uint8Array
  stride: number
}
