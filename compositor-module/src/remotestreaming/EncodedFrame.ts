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

import BufferContents from '../BufferContents'
import EncodingTypes, { EncodingMimeTypes } from './EncodingMimeTypes'

export type EncodedFrame = {
  readonly serial: number
  readonly mimeType: EncodingMimeTypes[keyof EncodingMimeTypes]
} & BufferContents<{ opaque: Uint8Array; alpha?: Uint8Array }>

export function createEncodedFrame(u8Buffer: Uint8Array): EncodedFrame {
  const dataView = new DataView(u8Buffer.buffer, u8Buffer.byteOffset)
  let offset = 0

  const serial = dataView.getUint32(offset, true)
  offset += 4

  const encodingTypeCode = dataView.getUint16(offset, true)
  if (encodingTypeCode !== 0 && encodingTypeCode !== 1) {
    throw new Error(`Received invalid encoding type, code = ${encodingTypeCode}`)
  }
  const encodingType = EncodingTypes[encodingTypeCode]
  offset += 4

  const width = dataView.getUint16(offset, true)
  offset += 4

  const height = dataView.getUint16(offset, true)
  offset += 4

  const opaqueLength = dataView.getUint32(offset, true)
  offset += 4
  const opaque = new Uint8Array(u8Buffer.buffer, u8Buffer.byteOffset + offset, opaqueLength)
  offset += opaqueLength

  const alphaLength = dataView.getUint32(offset, true)
  offset += 4
  const alpha =
    alphaLength === 0 ? undefined : new Uint8Array(u8Buffer.buffer, u8Buffer.byteOffset + offset, alphaLength)

  return { serial, mimeType: encodingType, size: { width, height }, pixelContent: { opaque, alpha } }
}
