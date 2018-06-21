'use strict'

export default class BrowserH264Decoder {
  static create () {
    return new Promise((resolve) => {
      const tinyH264Worker = new window.Worker('TinyH264Worker.js')
      const browserH264Decoder = new BrowserH264Decoder(tinyH264Worker)
      tinyH264Worker.addEventListener('message', (e) => {
        const message = e.data
        switch (message.type) {
          case 'pictureReady':
            browserH264Decoder._onPictureReady(message)
            break
          case 'decoderReady':
            window.setTimeout(() => {
              resolve(browserH264Decoder)
            }, 33)
            break
        }
      })
    })
  }

  constructor (h264BsdWorker) {
    this._h264BsdWorker = h264BsdWorker
    this._busy = false
    this._decodeQueue = []
  }

  /**
   * @param {Uint8Array} h264Nal
   */
  decode (h264Nal) {
    if (this._busy) {
      // TODO We could drop older frames if the queue becomes too big. This means the server is sending frames faster
      // than we can decode. This can happen if the server hasn't yet received our suddenly greatly increased decoding
      // time feedback.
      console.log('Decoder busy. Queueing h264 NAL')
      this._decodeQueue.push(h264Nal)
      return
    }
    this._h264BsdWorker.postMessage({type: 'decode', data: h264Nal.buffer}, [h264Nal.buffer])
    this._busy = true
  }

  _onPictureReady (message) {
    const width = message.width
    const height = message.height
    const buffer = message.data

    if (this._decodeQueue.length > 0) {
      const h264Nal = this._decodeQueue.shift()
      this._h264BsdWorker.postMessage({type: 'decode', data: h264Nal.buffer}, [h264Nal.buffer])
    } else {
      this._busy = false
    }
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
