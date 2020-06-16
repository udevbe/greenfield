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
// @ts-ignore
import { lib } from './lib'
import Point from './math/Point'
import Rect from './math/Rect'

/**
 *
 *            A region object describes an area.
 *
 *            Region objects are used to describe the opaque and input
 *            regions of a surface.
 */
class Region implements WlRegionRequests {
  readonly resource: WlRegionResource
  readonly pixmanRegion: number

  static create(wlRegionResource: WlRegionResource): Region {
    const pixmanRegion = Region.createPixmanRegion()
    const region = new Region(wlRegionResource, pixmanRegion)
    wlRegionResource.implementation = region
    wlRegionResource.onDestroy().then(() => {
      Region.destroyPixmanRegion(pixmanRegion)
    })
    return region
  }

  // TODO move to stand-alone exported function
  static createPixmanRegion(): number {
    // @ts-ignore
    const pixmanRegion = lib.pixman._malloc(20)// region struct is pointer + 4*uint32 = 5*4 = 20
    // @ts-ignore
    lib.pixman._pixman_region32_init(pixmanRegion)
    return pixmanRegion
  }

  // TODO move to stand-alone exported function
  static fini(pixmanRegion: number) {
    // FIXME double free somewhere in the code, so disable this for now
    // lib.pixman._pixman_region32_fini(pixmanRegion)
  }

  // TODO move to stand-alone exported function
  static initInfinite(pixmanRegion: number) {
    // @ts-ignore
    lib.pixman._pixman_region32_init_rect(pixmanRegion, -0x3FFFFFFF, -0x3FFFFFFF, 0x7FFFFFFF, 0x7FFFFFFF)
  }

  // TODO move to stand-alone exported function
  static initRect(pixmanRegion: number, rect: Rect) {
    // @ts-ignore
    lib.pixman._pixman_region32_init_rect(pixmanRegion, rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0)
  }

  // TODO move to stand-alone exported function
  static union(result: number, left: number, right: number) {
    // @ts-ignore
    lib.pixman._pixman_region32_union(result, left, right)
  }

  // TODO move to stand-alone exported function
  static intersect(result: number, left: number, right: number) {
    // @ts-ignore
    lib.pixman._pixman_region32_intersect(result, left, right)
  }

  // TODO move to stand-alone exported function
  static unionRect(result: number, left: number, x: number, y: number, width: number, height: number) {
    // @ts-ignore
    lib.pixman._pixman_region32_union_rect(result, left, x, y, width, height)
  }

  // TODO move to stand-alone exported function
  static destroyPixmanRegion(pixmanRegion: number) {
    // FIXME double free somewhere in the code, so disable this for now
    // lib.pixman._pixman_region32_fini(pixmanRegion)
    // lib.pixman._free(pixmanRegion)
  }

  // TODO move to stand-alone exported function
  static rectangles(pixmanRegion: number): Rect[] {
    // @ts-ignore
    const nroRectsPtr = lib.pixman._malloc(4) // uint32
    // @ts-ignore
    const pixmanBoxPtr = lib.pixman._pixman_region32_rectangles(pixmanRegion, nroRectsPtr)
    const rectangles = []
    // @ts-ignore
    const nroRects = new Uint32Array(lib.pixman.HEAPU8.buffer, nroRectsPtr, 1)[0]
    // @ts-ignore
    const rectangleStructs = new Uint32Array(lib.pixman.HEAPU8.buffer, pixmanBoxPtr, (4 * nroRects))
    for (let i = 0; i < nroRects; i++) {
      const x0 = rectangleStructs[i * 4]
      const y0 = rectangleStructs[(i * 4) + 1]
      const x1 = rectangleStructs[(i * 4) + 2]
      const y1 = rectangleStructs[(i * 4) + 3]
      rectangles.push(Rect.create(x0, y0, x1, y1))
    }
    // @ts-ignore
    lib.pixman._free(nroRectsPtr)

    return rectangles
  }

  private constructor(wlRegionResource: WlRegionResource, pixmanRegion: number) {
    this.resource = wlRegionResource
    this.pixmanRegion = pixmanRegion
  }

  /**
   *
   * Destroy the region. This will invalidate the object ID.
   *
   *
   * @param {!WlRegionResource} resource
   *
   * @since 1
   * @override
   */
  destroy(resource: WlRegionResource) {
    resource.destroy()
  }

  /**
   *
   *  Add the specified rectangle to the region.
   *
   *
   * @param {!WlRegionResource} resource
   * @param {!number} x undefined
   * @param {!number} y undefined
   * @param {!number} width undefined
   * @param {!number} height undefined
   *
   * @since 1
   * @override
   */
  add(resource: WlRegionResource, x: number, y: number, width: number, height: number) {
    // @ts-ignore
    lib.pixman._pixman_region32_union_rect(this.pixmanRegion, this.pixmanRegion, x, y, width, height)
  }

  /**
   *
   * Subtract the specified rectangle from the region.
   *
   *
   * @param {!WlRegionResource} resource
   * @param {!number} x undefined
   * @param {!number} y undefined
   * @param {!number} width undefined
   * @param {!number} height undefined
   *
   * @since 1
   * @override
   */
  subtract(resource: WlRegionResource, x: number, y: number, width: number, height: number) {
    // @ts-ignore
    const deltaPixmanRegion = lib.pixman._malloc(20)
    // @ts-ignore
    lib.pixman._pixman_region32_init_rect(deltaPixmanRegion, x, y, width, height)
    // @ts-ignore
    lib.pixman._pixman_region32_subtract(this.pixmanRegion, this.pixmanRegion, deltaPixmanRegion)
    Region.destroyPixmanRegion(deltaPixmanRegion)
  }

  // TODO move to stand-alone exported function
  static contains(pixmanRegion: number, point: Point): boolean {
    // @ts-ignore
    return lib.pixman._pixman_region32_contains_point(pixmanRegion, point.x, point.y, null) !== 0
  }

  // TODO move to stand-alone exported function
  static copyTo(destination: number, source: number) {
    // @ts-ignore
    lib.pixman._pixman_region32_copy(destination, source)
  }
}

export default Region
