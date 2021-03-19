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

import { EncodedFrame } from './EncodedFrame'
import { WlShmFormat } from './WlShmFormat'

export type SupportedWlShmFormat = typeof WlShmFormat['argb8888'] | typeof WlShmFormat['xrgb8888']

export interface FrameEncoderFactory {
  (width: number, height: number, wlShmFormat: SupportedWlShmFormat): FrameEncoder
}

export interface FrameEncoder {
  encodeBuffer(
    pixelBuffer: unknown,
    bufferFormat: SupportedWlShmFormat,
    bufferWidth: number,
    bufferHeight: number,
    bufferStride: number,
    serial: number,
  ): Promise<EncodedFrame>
}
