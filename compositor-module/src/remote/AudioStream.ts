import { Client } from 'westfield-runtime-server'
import { getOrCreateAudioPlayer } from './AudioPlayer'

export async function deliverContentToAudioStream(client: Client, messageData: ArrayBuffer) {
  // TODO get pipewire node id from message data
  const player = await getOrCreateAudioPlayer(0)
  player.decodeAndPlay(new Uint8Array(messageData, 8))
}
