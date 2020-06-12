// Copyright 2020 Erik De Rijcke
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

import BufferContents from "../BufferContents";
import Size from '../Size'
import EncodedFrameFragment from './EncodedFrameFragment'
import EncodingTypes, {EncodingMimeTypes} from './EncodingMimeTypes'

export default class EncodedFrame implements BufferContents<EncodedFrameFragment[], EncodingMimeTypes[keyof EncodingMimeTypes]> {
  readonly serial: number;
  readonly mimeType: EncodingMimeTypes[keyof EncodingMimeTypes];
  readonly encodingOptions: number;
  readonly size: Size;
  readonly pixelContent: EncodedFrameFragment[];

  static create(u8Buffer: Uint8Array): EncodedFrame {
    const dataView = new DataView(u8Buffer.buffer, u8Buffer.byteOffset)
    let offset = 0

    const serial = dataView.getUint32(offset, true)
    offset += 4

    const encodingTypeCode = dataView.getUint16(offset, true);
    if (encodingTypeCode !== 0 && encodingTypeCode !== 1) {
      throw new Error(`Received invalid encoding type, code = ${encodingTypeCode}`)
    }
    const encodingType = EncodingTypes[encodingTypeCode]
    offset += 2

    const encodingOptions = dataView.getUint16(offset, true) // unused for now
    offset += 2

    const width = dataView.getUint16(offset, true)
    offset += 2

    const height = dataView.getUint16(offset, true)
    offset += 2

    const encodedFragmentElements = dataView.getUint32(offset, true)
    offset += 4

    const encodedFragments = []
    for (let i = 0; i < encodedFragmentElements; i++) {
      const fragmentX = dataView.getUint16(offset, true)
      offset += 2
      const fragmentY = dataView.getUint16(offset, true)
      offset += 2
      const fragmentWidth = dataView.getUint16(offset, true)
      offset += 2
      const fragmentHeight = dataView.getUint16(offset, true)
      offset += 2
      const opaqueLength = dataView.getUint32(offset, true)
      offset += 4
      const opaque = new Uint8Array(u8Buffer.buffer, u8Buffer.byteOffset + offset, opaqueLength)
      offset += opaqueLength
      const alphaLength = dataView.getUint32(offset, true)
      offset += 4
      const alpha = new Uint8Array(u8Buffer.buffer, u8Buffer.byteOffset + offset, alphaLength)
      offset += alphaLength

      encodedFragments.push(EncodedFrameFragment.create(encodingType, fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha))
    }
    return new EncodedFrame(serial, encodingType, encodingOptions, Size.create(width, height), encodedFragments)
  }

  constructor(serial: number, mimeType: EncodingMimeTypes[keyof EncodingMimeTypes], encodingOptions: number, size: Size, fragments: EncodedFrameFragment[]) {
    this.serial = serial
    this.mimeType = mimeType
    this.encodingOptions = encodingOptions
    this.size = size
    this.pixelContent = fragments
  }
}
