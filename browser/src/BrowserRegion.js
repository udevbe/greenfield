'use strict'

import pixmanModule from './lib/libpixman-1'

const pixman = pixmanModule()

export default class BrowserRegion {
  /**
   *
   * @param {GrRegion} grRegionResource
   * @returns {BrowserRegion}
   */
  static create (grRegionResource) {
    const pixmanRegion = BrowserRegion.createPixmanRegion()
    const browserRegion = new BrowserRegion(grRegionResource, pixmanRegion)
    grRegionResource.implementation = browserRegion
    return browserRegion
  }

  static createPixmanRegion () {
    const pixmanRegion = pixman._malloc(20)// region struct is pointer + 4*uint32 = 5*4 = 20
    pixman._pixman_region32_init(pixmanRegion)
    return pixmanRegion
  }

  /**
   * @param {number} pixmanRegion
   */
  static fini (pixmanRegion) {
    pixman._pixman_region32_fini(pixmanRegion)
  }

  /**
   * @param {number} pixmanRegion
   */
  static initInfinite (pixmanRegion) {
    pixman._pixman_region32_init_rect(pixmanRegion, -0x3FFFFFFF, -0x3FFFFFFF, 0x7FFFFFFF, 0x7FFFFFFF)
  }

  /**
   * @param {number}pixmanRegion
   * @param {Rect}rect
   */
  static initRect (pixmanRegion, rect) {
    pixman._pixman_region32_init_rect(pixmanRegion, rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0)
  }

  static union (result, left, right) {
    pixman._pixman_region32_union(result, left, right)
  }

  static unionRect (result, left, x, y, width, height) {
    pixman._pixman_region32_union_rect(result, left, x, y, width, height)
  }

  static destroyPixmanRegion (pixmanRegion) {
    pixman._pixman_region32_fini(pixmanRegion)
    pixman._free(pixmanRegion)
  }

  /**
   * Use BrowserRegion.create(..) instead.
   * @private
   * @param grRegionResource
   * @param pixmanRegion
   */
  constructor (grRegionResource, pixmanRegion) {
    this.resource = grRegionResource
    this.pixmanRegion = pixmanRegion
  }

  /**
   *
   * Destroy the region. This will invalidate the object ID.
   *
   *
   * @param {GrRegion} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    BrowserRegion.destroyPixmanRegion(this.pixmanRegion)
    resource.destroy()
  }

  /**
   *
   *  Add the specified rectangle to the region.
   *
   *
   * @param {GrRegion} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
   */
  add (resource, x, y, width, height) {
    pixman._pixman_region32_union_rect(this.pixmanRegion, this.pixmanRegion, x, y, width, height)
  }

  /**
   *
   * Subtract the specified rectangle from the region.
   *
   *
   * @param {GrRegion} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
   */
  subtract (resource, x, y, width, height) {
    const deltaPixmanRegion = pixman._malloc(20)
    pixman._pixman_region32_init_rect(deltaPixmanRegion, x, y, width, height)
    pixman._pixman_region32_subtract(this.pixmanRegion, this.pixmanRegion, deltaPixmanRegion)
    BrowserRegion.destroyPixmanRegion(deltaPixmanRegion)
  }

  /**
   * @param {number} pixmanRegion
   * @param {Point}point
   * @return {Boolean}
   */
  static contains (pixmanRegion, point) {
    return pixman._pixman_region32_contains_point(pixmanRegion, point.x, point.y, null) !== 0
  }

  /**
   * @param {number} destination
   * @param {number} source
   */
  static copyTo (destination, source) {
    pixman._pixman_region32_copy(destination, source)
  }
}
