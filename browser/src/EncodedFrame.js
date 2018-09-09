import EncodedFrameFragment from './EncodedFrameFragment'
import EncodingTypes from './EncodingTypes'
import Size from './Size'

export default class EncodedFrame {
  /**
   * @param {!ArrayBuffer}buffer
   * @return {!EncodedFrame}
   */
  static create (buffer) {
    const dataView = new DataView(buffer)
    let offset = 0

    const serial = dataView.getUint32(offset, true)
    offset += 4

    const encodingType = EncodingTypes[dataView.getUint16(offset, true)]
    offset += 2

    const encodingOptions = dataView.getUint16(offset, true) // unused for now
    offset += 2

    const width = dataView.getUint16(offset, true)
    offset += 2

    const height = dataView.getUint16(offset, true)
    offset += 2

    const encodedFragmentElements = dataView.getUint32(offset, true)
    offset += 4

    const encodedFragments = []
    for (let i = 0; i < encodedFragmentElements; i++) {
      const fragmentX = dataView.getUint16(offset, true)
      offset += 2
      const fragmentY = dataView.getUint16(offset, true)
      offset += 2
      const fragmentWidth = dataView.getUint16(offset, true)
      offset += 2
      const fragmentHeight = dataView.getUint16(offset, true)
      offset += 2
      const opaqueLength = dataView.getUint32(offset, true)
      offset += 4
      const opaque = new Uint8Array(buffer, offset, opaqueLength)
      offset += opaqueLength
      const alphaLength = dataView.getUint32(offset, true)
      offset += 4
      const alpha = new Uint8Array(buffer, offset, alphaLength)
      offset += alphaLength

      encodedFragments.push(EncodedFrameFragment.create(encodingType, fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha))
    }
    return new EncodedFrame(serial, encodingType, encodingOptions, Size.create(width, height), encodedFragments)
  }

  /**
   * @private
   * @param {!number}serial
   * @param {!string}encodingType
   * @param {!number}encodingOptions
   * @param {!Size}size
   * @param {!Array<EncodedFrameFragment>}fragments
   */
  constructor (serial, encodingType, encodingOptions, size, fragments) {
    /**
     * @type {number}
     * @const
     */
    this.serial = serial
    /**
     * @type {string}
     * @const
     */
    this.encodingType = encodingType
    /**
     * @type {number}
     * @const
     */
    this.encodingOptions = encodingOptions
    /**
     * @type {Size}
     * @const
     */
    this.size = size
    /**
     * @type {Array<EncodedFrameFragment>}
     * @const
     */
    this.fragments = fragments
  }
}
