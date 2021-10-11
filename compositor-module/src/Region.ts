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

import { WlRegionRequests, WlRegionResource } from 'westfield-runtime-server'
import { lib } from './lib'
import { Point } from './math/Point'
import { Rect } from './math/Rect'

export function createPixmanRegion(): number {
  const pixmanRegion = lib.pixman._malloc(20) // region struct is pointer + 4*uint32 = 5*4 = 20
  lib.pixman._pixman_region32_init(pixmanRegion)
  return pixmanRegion
}

export function fini(pixmanRegion: number): void {
  lib.pixman._pixman_region32_fini(pixmanRegion)
}

export function init(pixmanRegion: number): void {
  lib.pixman._pixman_region32_init(pixmanRegion)
}

export function initInfinite(pixmanRegion: number): void {
  lib.pixman._pixman_region32_init_rect(pixmanRegion, -0x3fffffff, -0x3fffffff, 0x7fffffff, 0x7fffffff)
}

export function initRect(pixmanRegion: number, rect: Rect): void {
  lib.pixman._pixman_region32_init_rect(pixmanRegion, rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0)
}

export function union(result: number, left: number, right: number): void {
  lib.pixman._pixman_region32_union(result, left, right)
}

export function intersect(result: number, left: number, right: number): void {
  lib.pixman._pixman_region32_intersect(result, left, right)
}

export function unionRect(result: number, left: number, x: number, y: number, width: number, height: number): void {
  lib.pixman._pixman_region32_union_rect(result, left, x, y, width, height)
}

export function destroyPixmanRegion(pixmanRegion: number): void {
  lib.pixman._free(pixmanRegion)
}

export function contains(pixmanRegion: number, point: Point): boolean {
  return lib.pixman._pixman_region32_contains_point(pixmanRegion, point.x, point.y, null) !== 0
}

export function copyTo(destination: number, source: number): void {
  lib.pixman._pixman_region32_copy(destination, source)
}

export function clear(pixmanRegion: number): void {
  lib.pixman._pixman_region32_clear(pixmanRegion)
}

export function containsRectangle(pixmanRegion: number, box: Rect): boolean {
  const rectsPtr = lib.pixman._malloc(4) // uint32
  const rectStruct = new Int32Array(lib.pixman.HEAPU8.buffer, rectsPtr, 4)
  rectStruct[0] = box.x0
  rectStruct[1] = box.y0
  rectStruct[2] = box.x1
  rectStruct[3] = box.y1
  const contains = lib.pixman._pixman_region32_contains_rectangle(pixmanRegion, rectsPtr) !== 0
  lib.pixman._free(rectsPtr)
  return contains
}

export function notEmpty(pixmanRegion: number): boolean {
  return lib.pixman._pixman_region32_not_empty(pixmanRegion) !== 0
}

export function equal(pixmanRegion1: number, pixmanRegion2: number): boolean {
  return lib.pixman._pixman_region32_equal(pixmanRegion1, pixmanRegion2) !== 0
}

export function rectangles(pixmanRegion: number): Rect[] {
  const nroRectsPtr = lib.pixman._malloc(4) // uint32
  const pixmanBoxPtr = lib.pixman._pixman_region32_rectangles(pixmanRegion, nroRectsPtr)
  const rectangles = []
  const nroRects = new Uint32Array(lib.pixman.HEAPU8.buffer, nroRectsPtr, 1)[0]
  const rectangleStructs = new Int32Array(lib.pixman.HEAPU8.buffer, pixmanBoxPtr, 4 * nroRects)
  for (let i = 0; i < nroRects; i++) {
    const x0 = rectangleStructs[i * 4]
    const y0 = rectangleStructs[i * 4 + 1]
    const x1 = rectangleStructs[i * 4 + 2]
    const y1 = rectangleStructs[i * 4 + 3]
    rectangles.push({ x0, y0, x1, y1 })
  }
  lib.pixman._free(nroRectsPtr)

  return rectangles
}

class Region implements WlRegionRequests {
  readonly resource: WlRegionResource
  readonly pixmanRegion: number

  static create(wlRegionResource: WlRegionResource): Region {
    const pixmanRegion = createPixmanRegion()
    const region = new Region(wlRegionResource, pixmanRegion)
    wlRegionResource.implementation = region
    wlRegionResource.onDestroy().then(() => {
      fini(pixmanRegion)
      destroyPixmanRegion(pixmanRegion)
    })
    return region
  }

  private constructor(wlRegionResource: WlRegionResource, pixmanRegion: number) {
    this.resource = wlRegionResource
    this.pixmanRegion = pixmanRegion
  }

  destroy(resource: WlRegionResource): void {
    resource.destroy()
  }

  add(resource: WlRegionResource, x: number, y: number, width: number, height: number): void {
    lib.pixman._pixman_region32_union_rect(this.pixmanRegion, this.pixmanRegion, x, y, width, height)
  }

  subtract(resource: WlRegionResource, x: number, y: number, width: number, height: number): void {
    const deltaPixmanRegion = lib.pixman._malloc(20)
    lib.pixman._pixman_region32_init_rect(deltaPixmanRegion, x, y, width, height)
    lib.pixman._pixman_region32_subtract(this.pixmanRegion, this.pixmanRegion, deltaPixmanRegion)
    fini(deltaPixmanRegion)
    destroyPixmanRegion(deltaPixmanRegion)
  }
}

export default Region
