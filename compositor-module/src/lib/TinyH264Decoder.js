//
//  Copyright (c) 2013 Sam Leitch. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
//  IN THE SOFTWARE.
//

/**
 * This class wraps the details of the h264bsd library.
 * Module object is an Emscripten module provided globally by TinyH264.js
 *
 * In order to use this class, you first queue encoded data using queueData.
 * Each call to decode() will decode a single encoded element.
 * When decode() returns H264bsdDecoder.PIC_RDY, a picture is ready in the output buffer.
 * You can also use the onPictureReady() function to determine when a picture is ready.
 * The output buffer can be accessed by calling getNextOutputPicture()
 * An output picture may also be decoded using an H264bsdCanvas.
 * When you're done decoding, make sure to call release() to clean up internal buffers.
 */
class TinyH264Decoder {
  constructor (tinyH264Module, onPictureReady) {
    this.tinyH264Module = tinyH264Module

    this.onPictureReady = onPictureReady

    this.pStorage = this.tinyH264Module._h264bsdAlloc()
    this.pWidth = this.tinyH264Module._malloc(4)
    this.pHeight = this.tinyH264Module._malloc(4)
    this.pPicture = this.tinyH264Module._malloc(4)

    this._decBuffer = this.tinyH264Module._malloc(1024 * 1024)

    this.tinyH264Module._h264bsdInit(this.pStorage, 0)
  }

  release () {
    const pStorage = this.pStorage

    if (pStorage !== 0) {
      this.tinyH264Module._h264bsdShutdown(pStorage)
      this.tinyH264Module._h264bsdFree(pStorage)
    }

    this.tinyH264Module._free(this.pWidth)
    this.tinyH264Module._free(this.pHeight)
    this.tinyH264Module._free(this.pPicture)

    this.pStorage = 0

    this.pWidth = 0
    this.pHeight = 0
  }

  decode (nal) {
    if (nal instanceof ArrayBuffer) {
      nal = new Uint8Array(nal)
    }

    this.tinyH264Module.HEAPU8.set(nal, this._decBuffer)

    const retCode = this.tinyH264Module._h264bsdDecode(this.pStorage, this._decBuffer, nal.byteLength, this.pPicture, this.pWidth, this.pHeight)
    if (retCode === TinyH264Decoder.PIC_RDY) {
      const width = this.tinyH264Module.getValue(this.pWidth, 'i32')
      const height = this.tinyH264Module.getValue(this.pHeight, 'i32')
      const picPtr = this.tinyH264Module.getValue(this.pPicture, 'i8*')
      const pic = new Uint8Array(this.tinyH264Module.HEAPU8.subarray(picPtr, picPtr + (width * height) * 3 / 2))
      this.onPictureReady(pic, width, height)
    }
  }
}

TinyH264Decoder.RDY = 0
TinyH264Decoder.PIC_RDY = 1
TinyH264Decoder.HDRS_RDY = 2
TinyH264Decoder.ERROR = 3
TinyH264Decoder.PARAM_SET_ERROR = 4

TinyH264Decoder.MEMALLOC_ERROR = 5

export default TinyH264Decoder
