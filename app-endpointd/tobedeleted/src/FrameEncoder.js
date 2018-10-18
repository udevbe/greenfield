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
   * @param {Array<{x:number, y:number, width:number, height:number}>}bufferDamage
   * @return {Promise<EncodedFrame>}
   */
  encodeBuffer (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage) {}
}

module.exports = FrameEncoder
