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

import Rect from '../math/Rect'

// TODO use an object literal instead
export default class EncodedFrameFragment {
  static create(
    encodingType: string,
    fragmentX: number,
    fragmentY: number,
    fragmentWidth: number,
    fragmentHeight: number,
    opaque: Uint8Array,
    alpha: Uint8Array,
  ): EncodedFrameFragment {
    const geo = Rect.create(fragmentX, fragmentY, fragmentX + fragmentWidth, fragmentY + fragmentHeight)
    return new EncodedFrameFragment(encodingType, geo, opaque, alpha)
  }

  constructor(
    public readonly encodingType: string,
    public readonly geo: Rect,
    public readonly opaque: Uint8Array,
    public readonly alpha: Uint8Array,
  ) {}
}
