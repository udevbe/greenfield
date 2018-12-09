'use strict'
import WlRegionRequests from './protocol/WlRegionRequests'

import pixman from './lib/libpixman-1'
import Rect from './math/Rect'

/**
 *
 *            A region object describes an area.
 *
 *            Region objects are used to describe the opaque and input
 *            regions of a surface.
 * @implements WlRegionRequests
 */
class Region extends WlRegionRequests {
  /**
   *
   * @param {!WlRegionResource} wlRegionResource
   * @returns {!Region}
   */
  static create (wlRegionResource) {
    const pixmanRegion = Region.createPixmanRegion()
    const region = new Region(wlRegionResource, pixmanRegion)
    wlRegionResource.implementation = region
    wlRegionResource.onDestroy().then(() => { Region.destroyPixmanRegion(pixmanRegion) })
    return region
  }

  /**
   * @return {!number}
   */
  static createPixmanRegion () {
    const pixmanRegion = pixman._malloc(20)// region struct is pointer + 4*uint32 = 5*4 = 20
    pixman._pixman_region32_init(pixmanRegion)
    return pixmanRegion
  }

  /**
   * @param {!number} pixmanRegion
   */
  static fini (pixmanRegion) {
    pixman._pixman_region32_fini(pixmanRegion)
  }

  /**
   * @param {!number} pixmanRegion
   */
  static initInfinite (pixmanRegion) {
    pixman._pixman_region32_init_rect(pixmanRegion, -0x3FFFFFFF, -0x3FFFFFFF, 0x7FFFFFFF, 0x7FFFFFFF)
  }

  /**
   * @param {!number}pixmanRegion
   * @param {!Rect}rect
   */
  static initRect (pixmanRegion, rect) {
    pixman._pixman_region32_init_rect(pixmanRegion, rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0)
  }

  /**
   * @param {!number}result
   * @param {!number}left
   * @param {!number}right
   */
  static union (result, left, right) {
    pixman._pixman_region32_union(result, left, right)
  }

  /**
   * @param {!number}result
   * @param {!number}left
   * @param {!number}right
   */
  static intersect (result, left, right) {
    pixman._pixman_region32_intersect(result, left, right)
  }

  /**
   * @param {!number}result
   * @param {!number}left
   * @param {!number}x
   * @param {!number}y
   * @param {!number}width
   * @param {!number}height
   */
  static unionRect (result, left, x, y, width, height) {
    pixman._pixman_region32_union_rect(result, left, x, y, width, height)
  }

  /**
   * @param {!number}pixmanRegion
   */
  static destroyPixmanRegion (pixmanRegion) {
    pixman._pixman_region32_fini(pixmanRegion)
    pixman._free(pixmanRegion)
  }

  /**
   * @param {!number}pixmanRegion
   * @return {!Array<Rect>}
   */
  static rectangles (pixmanRegion) {
    const nroRectsPtr = pixman._malloc(4) // uint32
    const pixmanBoxPtr = pixman._pixman_region32_rectangles(pixmanRegion, nroRectsPtr)
    const rectangles = []
    const nroRects = new Uint32Array(pixman.HEAPU8.buffer, nroRectsPtr, 1)[0]
    const rectangleStructs = new Uint32Array(pixman.HEAPU8.buffer, pixmanBoxPtr, (4 * nroRects))
    for (let i = 0; i < nroRects; i++) {
      const x0 = rectangleStructs[i * 4]
      const y0 = rectangleStructs[(i * 4) + 1]
      const x1 = rectangleStructs[(i * 4) + 2]
      const y1 = rectangleStructs[(i * 4) + 3]
      rectangles.push(Rect.create(x0, y0, x1, y1))
    }
    pixman._free(nroRectsPtr)

    return rectangles
  }

  /**
   * Use Region.create(..) instead.
   * @private
   * @param {!WlRegionResource}wlRegionResource
   * @param {!number}pixmanRegion
   */
  constructor (wlRegionResource, pixmanRegion) {
    super()
    /**
     * @type {!WlRegionResource}
     * @const
     */
    this.resource = wlRegionResource
    /**
     * @type {!number}
     * @const
     */
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
  destroy (resource) {
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
  add (resource, x, y, width, height) {
    pixman._pixman_region32_union_rect(this.pixmanRegion, this.pixmanRegion, x, y, width, height)
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
  subtract (resource, x, y, width, height) {
    const deltaPixmanRegion = pixman._malloc(20)
    pixman._pixman_region32_init_rect(deltaPixmanRegion, x, y, width, height)
    pixman._pixman_region32_subtract(this.pixmanRegion, this.pixmanRegion, deltaPixmanRegion)
    Region.destroyPixmanRegion(deltaPixmanRegion)
  }

  /**
   * @param {!number} pixmanRegion
   * @param {!Point}point
   * @return {!boolean}
   */
  static contains (pixmanRegion, point) {
    return pixman._pixman_region32_contains_point(pixmanRegion, point.x, point.y, null) !== 0
  }

  /**
   * @param {!number} destination
   * @param {!number} source
   */
  static copyTo (destination, source) {
    pixman._pixman_region32_copy(destination, source)
  }
}

export default Region
