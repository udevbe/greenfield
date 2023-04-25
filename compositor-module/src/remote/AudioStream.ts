import { Client } from 'westfield-runtime-server'
import { getOrCreateAACPlayer } from './AudioPlayer'

export async function deliverContentToAudioStream(client: Client, messageData: ArrayBuffer) {
  // TODO get pipewire node id from message data
  const player = await getOrCreateAACPlayer(0)
  player.decodeAndPlay(new Uint8Array(messageData, 8))
}
