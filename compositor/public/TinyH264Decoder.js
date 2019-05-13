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

window = this

function TinyH264Decoder (module) {
  this.module = module

  this.onPictureReady = null

  this.pStorage = module._h264bsdAlloc()
  this.pWidth = module._malloc(4)
  this.pHeight = module._malloc(4)
  this.pPicture = module._malloc(4)

  this._decBuffer = module._malloc(1024 * 1024)

  module._h264bsdInit(this.pStorage, 0)
}

TinyH264Decoder.RDY = 0
TinyH264Decoder.PIC_RDY = 1
TinyH264Decoder.HDRS_RDY = 2
TinyH264Decoder.ERROR = 3
TinyH264Decoder.PARAM_SET_ERROR = 4
TinyH264Decoder.MEMALLOC_ERROR = 5

/**
 * Clean up memory used by the decoder
 */
TinyH264Decoder.prototype.release = function () {
  const module = this.module
  const pStorage = this.pStorage

  if (pStorage !== 0) {
    module._h264bsdShutdown(pStorage)
    module._h264bsdFree(pStorage)
  }

  module._free(this.pWidth)
  module._free(this.pHeight)
  module._free(this.pPicture)

  this.pStorage = 0

  this.pWidth = 0
  this.pHeight = 0
}

TinyH264Decoder.prototype.decode = function (nal) {
  this.module.HEAPU8.set(nal, this._decBuffer)

  const retCode = this.module._h264bsdDecode(this.pStorage, this._decBuffer, nal.byteLength, this.pPicture, this.pWidth, this.pHeight)
  if (retCode === TinyH264Decoder.PIC_RDY) {
    const width = this.module.getValue(this.pWidth, 'i32')
    const height = this.module.getValue(this.pHeight, 'i32')
    const picPtr = this.module.getValue(this.pPicture, 'i8*')
    const pic = new Uint8Array(this.module.HEAPU8.subarray(picPtr, picPtr + (width * height) * 3 / 2))
    this.onPictureReady(pic, width, height)
  }
}
