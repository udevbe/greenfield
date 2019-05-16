// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

var Module = {
  onRuntimeInitialized: function () {
    postMessage({ type: 'decoderReady' })
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
        decoder = new TinyH264Decoder(Module)
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
