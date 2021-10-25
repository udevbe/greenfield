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
import { Size } from '../math/Size'

export type OpaqueAndAlphaPlanes = {
  opaque: { buffer: Uint8Array; width: number; height: number }
  alpha?: { buffer: Uint8Array; width: number; height: number }
}

export type DecodedPixelContent = OpaqueAndAlphaPlanes | { bitmap: ImageBitmap; blob: Blob }
export type DecodedFrame = {
  readonly mimeType: 'video/h264' | 'image/png'
  readonly pixelContent: DecodedPixelContent
  readonly size: Size
} & BufferContents<DecodedPixelContent>

export function isDecodedFrame(buffer: any): buffer is DecodedFrame {
  return (
    buffer !== undefined &&
    (buffer.mimeType === 'video/h264' || buffer.mimeType === 'image/png') &&
    buffer.pixelContent !== undefined &&
    buffer.size !== undefined
  )
}

export function createDecodedFrame(
  mimeType: 'video/h264' | 'image/png',
  pixelContent: DecodedPixelContent,
  size: Size,
): DecodedFrame {
  return {
    mimeType,
    pixelContent,
    size,
  }
}
