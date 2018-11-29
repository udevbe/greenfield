'use strict'

export default class SurfaceState {
  /**
   * @param {?WlBufferResource}wlBuffer
   * @param {?EncodedFrame}bufferContents
   * @param {Array<Rect>}bufferDamageRects
   * @param {number}opaquePixmanRegion
   * @param {number}inputPixmanRegion
   * @param {number}dx
   * @param {number}dy
   * @param {number}bufferTransform
   * @param {number}bufferScale
   * @param {Array<Callback>}frameCallbacks
   * @param {*}roleState
   */
  static create (
    wlBuffer,
    bufferContents,
    bufferDamageRects,
    opaquePixmanRegion,
    inputPixmanRegion,
    dx,
    dy,
    bufferTransform,
    bufferScale,
    frameCallbacks,
    roleState
  ) {
    return new SurfaceState(
      wlBuffer,
      bufferContents,
      bufferDamageRects,
      opaquePixmanRegion,
      inputPixmanRegion,
      dx,
      dy,
      bufferTransform,
      bufferScale,
      frameCallbacks,
      roleState
    )
  }

  /**
   * @param {?WlBufferResource}wlBuffer
   * @param {?EncodedFrame}bufferContents
   * @param {Array<Rect>}bufferDamageRects
   * @param {number}opaquePixmanRegion
   * @param {number}inputPixmanRegion
   * @param {number}dx
   * @param {number}dy
   * @param {number}bufferTransform
   * @param {number}bufferScale
   * @param {Array<Callback>}frameCallbacks
   * @param {*}roleState
   */
  constructor (
    wlBuffer,
    bufferContents,
    bufferDamageRects,
    opaquePixmanRegion,
    inputPixmanRegion,
    dx,
    dy,
    bufferTransform,
    bufferScale,
    frameCallbacks,
    roleState
  ) {
    /**
     * @type {?WlBufferResource}
     */
    this.wlBuffer = wlBuffer
    /**
     * @type {?EncodedFrame}
     */
    this.bufferContents = bufferContents
    /**
     * @type {Array<Rect>}
     */
    this.bufferDamageRects = bufferDamageRects
    /**
     * @type {number}
     */
    this.opaquePixmanRegion = opaquePixmanRegion
    /**
     * @type {number}
     */
    this.inputPixmanRegion = inputPixmanRegion
    /**
     * @type {number}
     */
    this.dx = dx
    /**
     * @type {number}
     */
    this.dy = dy
    /**
     * @type {number}
     */
    this.bufferTransform = bufferTransform
    /**
     * @type {number}
     */
    this.bufferScale = bufferScale
    /**
     * @type {Array<Callback>}
     */
    this.frameCallbacks = frameCallbacks
    /**
     * @type {*}
     */
    this.roleState = roleState
  }
}
