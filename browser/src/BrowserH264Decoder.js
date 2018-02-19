'use strict'

export default class BrowserH264Decoder {
  static create () {
    return new Promise((resolve) => {
      const h264BsdWorker = new window.Worker('TinyH264Worker.js')
      const browserH264Decoder = new BrowserH264Decoder(h264BsdWorker)
      h264BsdWorker.addEventListener('message', (e) => {
        const message = e.data
        switch (message.type) {
          case 'pictureReady':
            browserH264Decoder._onPictureReady(message)
            break
          case 'decoderReady':
            resolve(browserH264Decoder)
            break
        }
      })
    })
  }

  constructor (h264BsdWorker) {
    this._h264BsdWorker = h264BsdWorker
  }

  /**
   * @param {Uint8Array} h264Nal
   */
  decode (h264Nal) {
    this._h264BsdWorker.postMessage({type: 'decode', data: h264Nal.buffer}, [h264Nal.buffer])
  }

  _onPictureReady (message) {
    const width = message.width
    const height = message.height
    const buffer = message.data
    this.onPicture(new Uint8Array(buffer), width, height)
  }

  /**
   * @param {Uint8Array}buffer
   * @param {number}width
   * @param {number}height
   */
  onPicture (buffer, width, height) {}

  terminate () {
    this._h264BsdWorker.terminate()
  }
}
