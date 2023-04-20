const aacPlayers: Record<number, AACPlayer> = {}

export async function getOrCreateAACPlayer(id: number): Promise<AACPlayer> {
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
    aacPlayer = new AACPlayer(audioWriter)
    aacPlayers[id] = aacPlayer
  }
  return aacPlayer
}

export class AACPlayer {
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
      codec: 'mp4a.40.5',
      sampleRate: 48000,
      numberOfChannels: 2,
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

  private playData(audioData: AudioData) {
    this.audioWriter.ready
      .then(() => this.audioWriter.write(audioData))
      .then(() => {
        const nextAudioData = this.decodedAudioQueue.shift()
        if (nextAudioData) {
          this.playData(nextAudioData)
        }
      })
  }

  private tryPlayData(audioData: AudioData) {
    if (this.decodedAudioQueue.length) {
      this.decodedAudioQueue.push(audioData)
      return
    }

    this.playData(audioData)
  }
}
