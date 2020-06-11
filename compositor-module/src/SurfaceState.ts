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

import { WlBufferResource } from 'westfield-runtime-server'
import BufferContents from './BufferContents'
import Callback from './Callback'
import Rect from './math/Rect'

export interface SurfaceState {
  bufferDamageRects: Rect[];
  opaquePixmanRegion: number;
  inputPixmanRegion: number;
  dx: number;
  dy: number;
  bufferTransform: number;
  bufferScale: number;
  frameCallbacks: Callback[];

  bufferResource?: WlBufferResource;
  bufferContents?: BufferContents<any>;
  roleState?: any;
}

export function createSurfaceState(
  bufferDamageRects: Rect[],
  opaquePixmanRegion: number,
  inputPixmanRegion: number,
  dx: number,
  dy: number,
  bufferTransform: number,
  bufferScale: number,
  frameCallbacks: Callback[],
  bufferResource?: WlBufferResource,
  bufferContents?: BufferContents<any>,
  roleState?: any
) {
  return {
    bufferDamageRects,
    opaquePixmanRegion,
    inputPixmanRegion,
    dx,
    dy,
    bufferTransform,
    bufferScale,
    frameCallbacks,
    bufferResource,
    bufferContents,
    roleState
  }
}
