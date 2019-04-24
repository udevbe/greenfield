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

import Point from './math/Point'

export default class SurfaceChild {
  /**
   * Use surface.SurfaceChildSelf instead.
   * @param {Surface} surface
   * @return {SurfaceChild}
   * @private
   */
  static create (surface) {
    return new SurfaceChild(surface)
  }

  /**
   * @param {Surface} surface
   * @private
   */
  constructor (surface) {
    /**
     * @type {Surface}
     */
    this.surface = surface
    /**
     * @type {Point}
     * @private
     */
    this._position = Point.create(0, 0)
  }

  /**
   * @param {Point} relativePoint
   */
  set position (relativePoint) {
    this._position = relativePoint
  }

  /**
   * @return {Point}
   */
  get position () {
    return this._position
  }
}
