var Module = {
  onRuntimeInitialized: function () {
    decoder = new H264bsdDecoder(Module)
    decoder.onPictureReady = onPictureReady
    postMessage({'type': 'decoderReady'})
  }
}

importScripts('TinyH264Decoder.js', 'TinyH264.js')

var decoder = null

function onMessage (e) {
  var message = e.data
  switch (message.type) {
    case 'decode':
      decoder.decode(message.data)
      break
  }
}

function onPictureReady (output, width, height) {
  postMessage({
    'type': 'pictureReady',
    'width': width,
    'height': height,
    'data': output.buffer,
  }, [output.buffer])
}

addEventListener('message', onMessage)
