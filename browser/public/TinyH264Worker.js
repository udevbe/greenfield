const Module = {
  onRuntimeInitialized: () => {
    const decoder = TinyH264Decoder.create()
    /**
     * @param {Uint8Array}output
     * @param {number}width
     * @param {number}height
     */
    decoder.onPictureReady = (output, width, height) => {
      Worker.postMessage({
        type: 'pictureReady',
        width: width,
        height: height,
        data: output.buffer
      }, [output.buffer])
    }

    Worker.addEventListener('message',
      /**
       * @param {MessageEvent}e
       */
      (e) => {
        decoder.decode(e.data.data)
      })
    Worker.postMessage({type: 'decoderReady'})
  }
}

class TinyH264Decoder {
  /**
   * @return {TinyH264Decoder}
   */
  static create () {
    const pStorage = Module._h264bsdAlloc()
    const pWidth = Module._malloc(4)
    const pHeight = Module._malloc(4)
    const pPicture = Module._malloc(4)
    const decBuffer = Module._malloc(1024 * 1024)

    Module._h264bsdInit(pStorage, 0)

    return new TinyH264Decoder(pStorage, pWidth, pHeight, pPicture, decBuffer)
  }

  /**
   * @param {number}pStorage
   * @param {number}pWidth
   * @param {number}pHeight
   * @param {number}pPicture
   * @param {number}decBuffer
   */
  constructor (pStorage, pWidth, pHeight, pPicture, decBuffer) {
    /**
     * @type {number}
     * @private
     */
    this._pStorage = pStorage
    /**
     * @type {number}
     * @private
     */
    this._pWidth = pWidth
    /**
     * @type {number}
     * @private
     */
    this._pHeight = pHeight
    /**
     * @type {number}
     * @private
     */
    this._pPicture = pPicture
    /**
     * @type {number}
     * @private
     */
    this._decBuffer = decBuffer
  }

  /**
   * @param {ArrayBuffer}nal
   */
  decode (nal) {
    Module.HEAPU8.set(new Uint8Array(nal), this._decBuffer)

    const retCode = Module._h264bsdDecode(this._pStorage, this._decBuffer, nal.byteLength, this._pPicture, this._pWidth, this._pHeight)
    if (retCode === TinyH264Decoder.PIC_RDY) {
      const width = Module.getValue(this._pWidth, 'i32')
      const height = Module.getValue(this._pHeight, 'i32')
      const picPtr = Module.getValue(this._pPicture, 'i8*')
      const pic = Module.HEAPU8.subarray(picPtr, picPtr + (((width * height) >> 1) * 3)) // YUV420
      this.onPictureReady(pic, width, height)
    }
  }

  release () {
    if (this._pStorage !== 0) {
      module._h264bsdShutdown(this._pStorage)
      module._h264bsdFree(this._pStorage)
    }

    Module._free(this._pWidth)
    Module._free(this._pHeight)
    Module._free(this._pPicture)

    this._pStorage = 0

    this._pWidth = 0
    this._pHeight = 0
  }

  /**
   * @param {Uint8Array}pic
   * @param {number}width
   * @param {number}height
   */
  onPictureReady (pic, width, height) {}
}

TinyH264Decoder.RDY = 0
TinyH264Decoder.PIC_RDY = 1
TinyH264Decoder.HDRS_RDY = 2
TinyH264Decoder.ERROR = 3
TinyH264Decoder.PARAM_SET_ERROR = 4
TinyH264Decoder.MEMALLOC_ERROR = 5

// This causes onRuntimeInitialized to be called
importScripts('TinyH264.js')
