'use strict'

export default class BrowserH264Decoder {
  static create () {
    return new Promise((resolve) => {
      const decoder = new window.Worker('./lib/broadway/Decoder.js')
      const browserH264Decoder = new BrowserH264Decoder(decoder)
      decoder.addEventListener('message', (event) => {
        const data = event.data
        if (data.consoleLog) {
          console.log(data.consoleLog)
          return
        }
        browserH264Decoder._onPictureReady(event)
        this._onPictureDecoded()
      }, false)
      decoder.postMessage({
        type: 'Broadway.js - Worker init',
        options: {
          rgb: false,
          reuseMemory: true
        }
      })
      resolve(browserH264Decoder)
    })
  }

  constructor (decoder) {
    this._decoder = decoder
  }

  /**
   * @param {Uint8Array} h264Nal
   */
  decode (h264Nal) {
    this._decoder.postMessage({
      buf: h264Nal.buffer,
      offset: h264Nal.byteOffset,
      length: h264Nal.length
    }, [h264Nal.buffer])
  }

  _onPictureReady (message) {
    const data = message.data
    this.onPicture(new Uint8Array(data.buf, 0, data.length), data.width, data.height)
  }

  /**
   * @param {Uint8Array}buffer
   * @param {number}width
   * @param {number}height
   */
  onPicture (buffer, width, height) {}

  terminate () {
    this._decoder.terminate()
  }
}
