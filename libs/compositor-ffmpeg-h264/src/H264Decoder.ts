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

import { libavh264 } from './H264Worker'
import { FfmpegH264Frame } from './index'

export class H264Decoder {
  private readonly codecContext: number
  private readonly dataIn: number

  private readonly yPlaneOut: number
  private readonly strideOut: number

  private readonly uPlaneOut: number

  private readonly vPlaneOut: number

  private readonly widthOut: number
  private readonly heightOut: number

  constructor(
    private readonly libavH264Module: libavh264,
    private readonly onPictureReady: (output: FfmpegH264Frame, width: number, height: number) => void,
  ) {
    this.codecContext = this.libavH264Module._create_codec_context()
    this.dataIn = this.libavH264Module._malloc(1024 * 1024)

    this.yPlaneOut = this.libavH264Module._malloc(4)
    this.uPlaneOut = this.libavH264Module._malloc(4)
    this.vPlaneOut = this.libavH264Module._malloc(4)

    this.widthOut = this.libavH264Module._malloc(4)
    this.heightOut = this.libavH264Module._malloc(4)
    this.strideOut = this.libavH264Module._malloc(4)
  }

  release() {
    this.libavH264Module._destroy_codec_context(this.codecContext)
    this.libavH264Module._free(this.dataIn)
    this.libavH264Module._free(this.yPlaneOut)

    this.libavH264Module._free(this.widthOut)
    this.libavH264Module._free(this.heightOut)
  }

  decode(nal: Uint8Array) {
    this.libavH264Module.HEAPU8.set(nal, this.dataIn)
    const ptr = this.libavH264Module._decode(
      this.codecContext,
      this.dataIn,
      nal.byteLength,

      this.yPlaneOut,
      this.uPlaneOut,
      this.vPlaneOut,

      this.widthOut,
      this.heightOut,
      this.strideOut,
    )

    const yPlanePtr = this.libavH264Module.getValue(this.yPlaneOut, 'i8*')
    const uPlanePtr = this.libavH264Module.getValue(this.uPlaneOut, 'i8*')
    const vPlanePtr = this.libavH264Module.getValue(this.vPlaneOut, 'i8*')

    const width = this.libavH264Module.getValue(this.widthOut, 'i32')
    const height = this.libavH264Module.getValue(this.heightOut, 'i32')
    const stride = this.libavH264Module.getValue(this.strideOut, 'i32')

    // We assume I420 output else this will fail miserably
    // TODO we should probably handle other formats as well
    const lumaSize = height * stride
    const chromaSize = (height * stride) / 2

    if (yPlanePtr === 0) {
      return
    }

    const yPlane = new Uint8Array(this.libavH264Module.HEAPU8.subarray(yPlanePtr, yPlanePtr + lumaSize))
    const uPlane = new Uint8Array(this.libavH264Module.HEAPU8.subarray(uPlanePtr, uPlanePtr + chromaSize))
    const vPlane = new Uint8Array(this.libavH264Module.HEAPU8.subarray(vPlanePtr, vPlanePtr + chromaSize))

    this.onPictureReady(
      {
        ptr,
        yPlane,
        uPlane,
        vPlane,
        stride,
      },
      width,
      height,
    )
  }

  closeFrame(framePtr: number) {
    this.libavH264Module._close_frame(framePtr)
  }
}
