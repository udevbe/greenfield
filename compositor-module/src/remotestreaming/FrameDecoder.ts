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

import Surface from '../Surface'
import DecodedFrame, { DecodedPixelContent } from './DecodedFrame'
import EncodedFrame from './EncodedFrame'
import { fullFrame, splitAlpha } from './EncodingOptions'

class FrameDecoder {
  static create(): FrameDecoder {
    return new FrameDecoder()
  }

  async decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame> {
    const decodedContents = await this[encodedFrame.mimeType](surface, encodedFrame)
    return DecodedFrame.create(encodedFrame.mimeType, decodedContents, encodedFrame.size)
  }

  ['video/h264'](surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    return surface.h264BufferContentDecoder.decode(encodedFrame)
  }

  async ['image/png'](surface: Surface, encodedFrame: EncodedFrame): Promise<{ bitmap: ImageBitmap, blob: Blob }> {
    const isFullFrame = fullFrame(encodedFrame.encodingOptions)
    const hasSplitAlpha = splitAlpha(encodedFrame.encodingOptions)

    if (isFullFrame && !hasSplitAlpha) {
      // Full frame without a separate alpha. Let the browser do all the drawing.
      const frame = encodedFrame.pixelContent[0]
      const blob = new Blob([frame.opaque], { type: 'image/png' })
      const bitmap = await createImageBitmap(blob, 0, 0, frame.geo.width, frame.geo.height)
      return { bitmap, blob }
    } else {
      // we don't support/care about fragmented pngs (and definitely not with a separate alpha channel as png has it internal)
      throw new Error(`Unsupported buffer. Encoding type: ${encodedFrame.mimeType}, full frame:${isFullFrame}, split alpha: ${hasSplitAlpha}`)
    }
  }
}

export default FrameDecoder
