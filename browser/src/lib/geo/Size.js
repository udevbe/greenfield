'use strict'

/**
 * Represents a 2-dimensional size value.
 */

export default class Size {
  constructor (w, h) {
    this.w = w
    this.h = h
  }

  toString () {
    return '(' + this.w + ', ' + this.h + ')'
  }

  getHalfSize () {
    return new Size(this.w >>> 1, this.h >>> 1)
  }
}
