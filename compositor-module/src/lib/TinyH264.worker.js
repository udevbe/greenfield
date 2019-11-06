import TinyH264Decoder from './TinyH264Decoder'
import TinyH264 from './TinyH264'
import tinyH264WasmURL from './TinyH264.wasm.asset'

const assets = {
  'TinyH264.wasm': tinyH264WasmURL
}

const h264Decoders = {}

/**
 * @param {*}module
 */
function loadNativeModule (module) {
  return new Promise(resolve => {
    if (module.calledRun) {
      resolve()
    } else {
      module.onRuntimeInitialized = () => resolve()
    }
  })
}

async function init () {
  const tinyH264 = TinyH264({ locateFile: path => assets[path] })
  await loadNativeModule(tinyH264)

  self.addEventListener('message', (e) => {
    const message = e.data
    const renderStateId = message.renderStateId
    const messageType = message.type
    switch (messageType) {
      case 'decode': {
        let decoder = h264Decoders[renderStateId]
        if (!decoder) {
          decoder = new TinyH264Decoder(tinyH264, (output, width, height) => {
            postMessage({
              type: 'pictureReady',
              width: width,
              height: height,
              renderStateId: renderStateId,
              data: output.buffer
            }, [output.buffer])
          })
          h264Decoders[renderStateId] = decoder
        }
        decoder.decode(new Uint8Array(message.data, message.offset, message.length))
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

  self.postMessage({ type: 'decoderReady' })
}

init()
