const aacPlayers: Record<number, AudioPlayer> = {}

export async function getOrCreateAACPlayer(id: number): Promise<AudioPlayer> {
  let aacPlayer = aacPlayers[id]
  if (aacPlayer === undefined) {
    const audioElement = document.createElement('audio')
    // audioElement.controls = true
    audioElement.autoplay = true
    // document.body.appendChild(audioElement)

    // @ts-ignore
    const generator = new MediaStreamTrackGenerator({ kind: 'audio' })
    const writable: WritableStream = generator.writable
    const audioWriter = writable.getWriter()
    audioElement.srcObject = new MediaStream([generator])
    aacPlayer = new AudioPlayer(audioWriter)
    aacPlayers[id] = aacPlayer
  }
  return aacPlayer
}

export class AudioPlayer {
  private decodedAudioQueue: AudioData[] = []

  private audioDecoder: AudioDecoder

  constructor(private audioWriter: WritableStreamDefaultWriter) {
    this.audioDecoder = new AudioDecoder({
      output: (audioData: AudioData) => {
        this.tryPlayData(audioData)
      },
      error: (error: DOMException) => {
        console.error('AudioDecoder error:', error)
      },
    })
    this.audioDecoder.configure({
      codec: 'opus',
      sampleRate: 48000,
      numberOfChannels: 2,
      // @ts-ignore
      opus: {
        frameDuration: 10000,
        complexity: 10,
        packetlossperc: 0,
        useinbandfec: false,
        usedtx: true,
      }
    })
  }

  decodeAndPlay(encodedData: AllowSharedBufferSource): void {
    this.audioDecoder.decode(
      new EncodedAudioChunk({
        type: 'key',
        data: encodedData,
        timestamp: 0,
      }),
    )
  }

  private playData() {
    this.audioWriter.ready
      .then(() => {
        const audioData = this.decodedAudioQueue[0]
        this.audioWriter.write(audioData)
      })
      .then(() => {
        this.decodedAudioQueue.shift()
        if (this.decodedAudioQueue.length) {
          this.playData()
        }
      })
  }

  private tryPlayData(audioData: AudioData) {
    this.decodedAudioQueue.push(audioData)
    if (this.decodedAudioQueue.length === 1) {
      this.playData()
    }
  }
}
