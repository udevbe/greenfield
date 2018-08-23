var Module = {
  onRuntimeInitialized: function () {
    postMessage({type: 'decoderReady'})
  }
}

importScripts('TinyH264Decoder.js', 'TinyH264.js')

const h264Decoders = {}

addEventListener('message', (e) => {
  const message = e.data
  const renderStateId = message.renderStateId
  const messageType = message.type
  switch (messageType) {
    case 'decode': {
      let decoder = h264Decoders[renderStateId]
      if (!decoder) {
        decoder = new H264bsdDecoder(Module)
        decoder.onPictureReady = (output, width, height) => {
          postMessage({
            type: 'pictureReady',
            width: width,
            height: height,
            renderStateId: renderStateId,
            data: output.buffer
          }, [output.buffer])
        }
        h264Decoders[renderStateId] = decoder
      }
      decoder.decode(message.data)
      break
    }
    case 'release': {
      const decoder = h264Decoders[renderStateId]
      if (decoder) {
        decoder.release()
        delete h264Decoders[renderStateId]
      }
      break
    }
  }
})
