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

export class EncodedFrameFragment {
  private constructor(private readonly opaque: Buffer, private readonly alpha: Buffer, public readonly size: number) {}

  static create(opaque: Buffer, alpha: Buffer): EncodedFrameFragment {
    const size =
      4 + // fragment opaque length (uin32LE)
      opaque.length + // opaque (uint8array)
      4 + // fragment alpha length (uin32LE)
      alpha.length // alpha (uint8array)
    return new EncodedFrameFragment(opaque, alpha, size)
  }

  writeToBuffer(buffer: Buffer, offset: number): void {
    buffer.writeUInt32LE(this.opaque.length, offset)
    offset += 4

    this.opaque.copy(buffer, offset)
    offset += this.opaque.length

    buffer.writeUInt32LE(this.alpha.length, offset)
    offset += 4

    this.alpha.copy(buffer, offset)
  }
}
