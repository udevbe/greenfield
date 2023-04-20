import { Client } from 'westfield-runtime-server'
import { getOrCreateAACPlayer } from './AACPlayer'

export async function deliverContentToAudioStream(client: Client, messageData: ArrayBuffer) {
  const audioData = new Uint8Array(messageData, 8)
  console.log('received audio sample')
  // TODO get pipewire node id from message data
  const player = await getOrCreateAACPlayer(0)
  player.decodeAndPlay(audioData)
}
