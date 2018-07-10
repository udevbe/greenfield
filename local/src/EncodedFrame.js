module.exports = class EncodedFrame {
  /**
   * @param {number}encodingType
   * @param {number}width
   * @param {number}height
   * @param {Array<EncodedBuffer>}opaqueEncodedBuffers
   * @param {Array<EncodedBuffer>}alphaEncodedBuffers
   */
  static create (encodingType, width, height, opaqueEncodedBuffers, alphaEncodedBuffers) {
    return new EncodedFrame(encodingType, width, height, opaqueEncodedBuffers, alphaEncodedBuffers)
  }

  /**
   * @param {number}encodingType
   * @param {number}width
   * @param {number}height
   * @param {Array<EncodedBuffer>}opaqueEncodedBuffers
   * @param {Array<EncodedBuffer>}alphaEncodedBuffers
   */
  constructor (encodingType, width, height, opaqueEncodedBuffers, alphaEncodedBuffers) {
    /**
     * @type {number}
     * @private
     */
    this._encodingType = encodingType
    /**
     * @type {number}
     * @private
     */
    this._width = width
    /**
     * @type {number}
     * @private
     */
    this._height = height
    /**
     * @type {Array<EncodedBuffer>}
     * @private
     */
    this._opaqueEncodedBuffers = opaqueEncodedBuffers
    /**
     * @type {Array<EncodedBuffer>}
     * @private
     */
    this._alphaEncodedBuffers = alphaEncodedBuffers
  }

  /**
   * A single byte array as native buffer:
   * [
   * encodingType: uint8,
   * width: uint16,
   * height: uint16,
   * opaqueEncodedBuffersByteLength: uint32,
   * opaqueEncodedBuffers: uint8[opaqueLength]=[elementLength:uint32, element: uint8[], elementLength:uint32, element: uint8[], ...],
   * alphaEncodedBuffersByteLength: uint32,
   * alphaEncodedBuffers: uint8[alphaLength]=[elementLength:uint32, element: uint8[], elementLength:uint32, element: uint8[], ...],
   * ]
   * @return {Buffer}
   */
  toBuffer () {
    /**
     * @type {Array<Buffer>}
     */
    const opaqueBuffers = []
    let opaqueBuffersSize = 0
    /**
     * @type {Array<Buffer>}
     */
    const alphaBuffers = []
    let alphaBuffersSize = 0

    this._opaqueEncodedBuffers.forEach((opaqueEncodedBuffer) => {
      const opaqueBuffer = opaqueEncodedBuffer.toBuffer()
      opaqueBuffersSize += opaqueBuffer.length
      opaqueBuffers.push(opaqueBuffer)
    })

    this._alphaEncodedBuffers.forEach((alphaEncodedBuffer) => {
      const alphaBuffer = alphaEncodedBuffer.toBuffer()
      alphaBuffersSize += alphaBuffer.length
      alphaBuffers.push(alphaBuffer)
    })

    const frameBuffer = Buffer.allocUnsafe(1 + 2 + 2 + 4 + opaqueBuffersSize + 4 + alphaBuffersSize)
    let offset = 0

    frameBuffer.writeUInt8(this._encodingType, offset, true)
    offset += 1

    frameBuffer.writeUInt16BE(this._width, offset, true)
    offset += 2

    frameBuffer.writeUInt16BE(this._height, offset, true)
    offset += 2

    frameBuffer.writeUInt32BE(opaqueBuffersSize, offset, true)
    offset += 4

    opaqueBuffers.forEach((opaqueBuffer) => {
      opaqueBuffer.copy(frameBuffer, offset)
      offset += frameBuffer.length
    })

    frameBuffer.writeUInt32BE(alphaBuffersSize, offset, true)
    offset += 4

    alphaBuffers.forEach((alphaBuffer) => {
      alphaBuffer.copy(frameBuffer, offset)
      offset += frameBuffer.length
    })

    return frameBuffer
  }
}
