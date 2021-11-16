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

export class EncodedFrame {
  private constructor(
    public readonly serial: number,
    private readonly encodingType: number,
    private readonly width: number,
    private readonly height: number,
    private readonly opaque: Buffer,
    private readonly alpha?: Buffer,
  ) {}

  static create(
    serial: number,
    encodingType: number,
    width: number,
    height: number,
    opaque: Buffer,
    alpha?: Buffer,
  ): EncodedFrame {
    return new EncodedFrame(serial, encodingType, width, height, opaque, alpha)
  }

  /**
   * A single byte array as native buffer. Layout:
   * [
   * serial: uin32LE
   * encodingType: uint32LE,
   * width: uint32LE,
   * height: uint32LE,
   * opaque_size: uint32LE,
   * opaque: uint8[opaque_size],
   * alpha_size: uint32LE,
   * alpha: uint8[alpha_size],
   * ]
   */
  toBuffer(): Buffer {
    const totalFrameSize =
      4 + // serial: uin32LE
      4 + // encodingType: uint32LE
      4 + // width: uint32LE
      4 + // height: uint32LE
      4 + // fragment opaque length (uin32LE)
      this.opaque.length + // opaque (uint8array)
      4 + // fragment alpha length (uin32LE)
      (this.alpha?.length ?? 0) // alpha (uint8array)
    const frameBuffer = Buffer.allocUnsafe(totalFrameSize)

    let offset = 0

    frameBuffer.writeUInt32LE(this.serial, offset)
    offset += 4

    frameBuffer.writeUInt32LE(this.encodingType, offset)
    offset += 4

    frameBuffer.writeUInt32LE(this.width, offset)
    offset += 4

    frameBuffer.writeUInt32LE(this.height, offset)
    offset += 4

    frameBuffer.writeUInt32LE(this.opaque.length, offset)
    offset += 4

    this.opaque.copy(frameBuffer, offset)
    offset += this.opaque.length

    frameBuffer.writeUInt32LE(this.alpha?.length ?? 0, offset)
    if (this.alpha !== undefined) {
      offset += 4
      this.alpha.copy(frameBuffer, offset)
    }

    return frameBuffer
  }
}
