'use strict'

export default class H264NALDecoder {
  /**
   * @return {Promise<H264NALDecoder>}
   */
  static create () {
    return new Promise((resolve) => {
      const tinyH264Worker = new window.Worker('TinyH264Worker.js')
      const browserH264Decoder = new H264NALDecoder(tinyH264Worker)
      tinyH264Worker.addEventListener('message', (e) => {
        const message = /** @type {{type:string, width:number, height:number, data:ArrayBuffer}} */e.data
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

  /**
   * @param {Worker}tinyH264Worker
   */
  constructor (tinyH264Worker) {
    this._tinyH264Worker = tinyH264Worker
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
    this._tinyH264Worker.postMessage({type: 'decode', data: h264Nal.buffer}, [h264Nal.buffer])
    this._busy = true
  }

  /**
   * @param {{width:number, height:number, data: ArrayBuffer}}message
   * @private
   */
  _onPictureReady (message) {
    const width = message.width
    const height = message.height
    const buffer = message.data

    if (this._decodeQueue.length > 0) {
      const h264Nal = this._decodeQueue.shift()
      this._tinyH264Worker.postMessage({type: 'decode', data: h264Nal.buffer}, [h264Nal.buffer])
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
    this._tinyH264Worker.terminate()
  }
}
