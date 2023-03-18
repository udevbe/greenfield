import { Client } from 'westfield-runtime-server'

export function deliverContentToAudioStream(client: Client, messageData: ArrayBuffer) {
  // TODO queue and/or play audio using webcodecs API or a WASM based AAC to PCM decoder
}
