/**
 * @interface
 */
class FrameEncoder {
  /**
   * @param {Buffer}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @param {Array<Rect>}damageRects
   * @return {Promise<EncodedFrame>}
   */
  encodeBuffer (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, damageRects) {}
}

module.exports = FrameEncoder
