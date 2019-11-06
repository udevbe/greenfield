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

import Rect from '../math/Rect'

export default class EncodedFrameFragment {
  /**
   * @param {!string}encodingType
   * @param {!number}fragmentX
   * @param {!number}fragmentY
   * @param {!number}fragmentWidth
   * @param {!number}fragmentHeight
   * @param {!Uint8Array}opaque
   * @param {!Uint8Array}alpha
   * @return {!EncodedFrameFragment}
   */
  static create (encodingType, fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha) {
    const geo = Rect.create(fragmentX, fragmentY, fragmentX + fragmentWidth, fragmentY + fragmentHeight)
    return new EncodedFrameFragment(encodingType, geo, opaque, alpha)
  }

  /**
   * @param {!string}encodingType
   * @param {!Rect}geo
   * @param {!Uint8Array}opaque
   * @param {!Uint8Array}alpha
   * @private
   */
  constructor (encodingType, geo, opaque, alpha) {
    /**
     * @type {!string}
     * @const
     */
    this.encodingType = encodingType
    /**
     * @type {!Rect}
     * @const
     */
    this.geo = geo
    /**
     * @type {!Uint8Array}
     * @const
     */
    this.opaque = opaque
    /**
     * @type {!Uint8Array}
     * @const
     */
    this.alpha = alpha
  }
}
