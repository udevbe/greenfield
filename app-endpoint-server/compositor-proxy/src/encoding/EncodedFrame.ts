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

import { EncodedFrameFragment } from './EncodedFrameFragment'

export class EncodedFrame {
  static create(
    serial: number,
    encodingType: number,
    encodingOptions: number,
    width: number,
    height: number,
    fragments: EncodedFrameFragment[],
  ): EncodedFrame {
    return new EncodedFrame(serial, encodingType, encodingOptions, width, height, fragments)
  }

  constructor(
    public readonly serial: number,
    private readonly _encodingType: number,
    private readonly _encodingOptions: number,
    private readonly _width: number,
    private readonly _height: number,
    private readonly _fragments: EncodedFrameFragment[],
  ) {}

  /**
   * A single byte array as native buffer. Layout:
   * [
   * serial: uin32LE
   * encodingType: uint16LE,
   * encodingOptions: uint16LE,
   * width: uint16LE,
   * height: uint16LE,
   * fragmentElements: uint32LE,
   * fragments: uint8[fragmentElements * fragmentSize],
   * ]
   */
  toBuffer(): Buffer {
    let fragmentsSize = 0

    this._fragments.forEach((fragment) => {
      fragmentsSize += fragment.size
    })

    const totalFrameSize =
      4 + // serial: uin32LE
      2 + // encodingType: uint16LE
      2 + // encodingOptions: uint16LE
      2 + // width: uint16LE
      2 + // height: uint16LE
      4 + // fragmentElements: uint32LE
      fragmentsSize // fragments data: uint8[]
    const frameBuffer = Buffer.allocUnsafe(totalFrameSize)

    let offset = 0

    frameBuffer.writeUInt32LE(this.serial, offset)
    offset += 4

    frameBuffer.writeUInt16LE(this._encodingType, offset)
    offset += 2

    frameBuffer.writeUInt16LE(this._encodingOptions, offset)
    offset += 2

    frameBuffer.writeUInt16LE(this._width, offset)
    offset += 2

    frameBuffer.writeUInt16LE(this._height, offset)
    offset += 2

    frameBuffer.writeUInt32LE(this._fragments.length, offset)
    offset += 4

    this._fragments.forEach((fragment) => {
      offset = fragment.writeToBuffer(frameBuffer, offset)
    })

    return frameBuffer
  }
}
