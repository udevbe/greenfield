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

'use strict'

export class EncodedFrameFragment {
  static create(
    fragmentX: number,
    fragmentY: number,
    fragmentWidth: number,
    fragmentHeight: number,
    opaque: Buffer,
    alpha: Buffer,
  ): EncodedFrameFragment {
    const size =
      2 + // fragmentX (uint16LE)
      2 + // fragmentY (uint16LE)
      2 + // fragmentWidth (uint16LE)
      2 + // fragmentHeight (uint16LE)
      4 + // fragment opaque length (uin32LE)
      opaque.length + // opaque (uint8array)
      4 + // fragment alpha length (uin32LE)
      alpha.length // alpha (uint8array)
    return new EncodedFrameFragment(fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha, size)
  }

  constructor(
    private readonly _fragmentX: number,
    private readonly _fragmentY: number,
    private readonly _fragmentWidth: number,
    private readonly _fragmentHeight: number,
    private readonly _opaque: Buffer,
    private readonly _alpha: Buffer,
    public readonly size: number,
  ) {}

  writeToBuffer(buffer: Buffer, offset: number): number {
    buffer.writeUInt16LE(this._fragmentX, offset)
    offset += 2

    buffer.writeUInt16LE(this._fragmentY, offset)
    offset += 2

    buffer.writeUInt16LE(this._fragmentWidth, offset)
    offset += 2

    buffer.writeUInt16LE(this._fragmentHeight, offset)
    offset += 2

    buffer.writeUInt32LE(this._opaque.length, offset)
    offset += 4

    this._opaque.copy(buffer, offset)
    offset += this._opaque.length

    buffer.writeUInt32LE(this._alpha.length, offset)
    offset += 4

    this._alpha.copy(buffer, offset)
    offset += this._alpha.length

    return offset
  }
}
