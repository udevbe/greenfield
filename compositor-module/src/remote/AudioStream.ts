import { Client } from 'westfield-runtime-server'

// dictionary AacEncoderConfig {
//   AacBitstreamFormat format = "aac";
// };


const audioContext = new AudioContext();
let audioBufferSource: AudioBufferSourceNode| null ;


export function deliverContentToAudioStream(client: Client, messageData: ArrayBuffer) {
  // TODO queue and/or play audio using webcodecs API or a WASM based AAC to PCM decoder


audioContext.decodeAudioData(messageData)
    .then(buffer => {
      playAudioBuffer(buffer);
    })
    .catch(error => {
      console.error('Error decoding audio data:', error);
    });
}

function playAudioBuffer(buffer: AudioBuffer | null) {

  if(audioBufferSource != null){
    audioBufferSource.stop();
  
  }
  audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = buffer;
  audioBufferSource.connect(audioContext.destination);
  audioBufferSource.start();
}


