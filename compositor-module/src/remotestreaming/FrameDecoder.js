import EncodingOptions from './EncodingOptions'
import DecodedFrame from './DecodedFrame'

class FrameDecoder {
  static create () {
    return new FrameDecoder()
  }

  /**
   * @param {Surface}surface
   * @param {EncodedFrame}encodedFrame
   * @return {Promise<DecodedFrame>}
   */
  async decode (surface, encodedFrame) {
    const decodedContents = await this[encodedFrame.mimeType](surface, encodedFrame)
    return DecodedFrame.create(encodedFrame.mimeType, decodedContents, encodedFrame.serial, encodedFrame.size)
  }

  /**
   * @param {Surface}surface
   * @param {EncodedFrame}encodedFrame
   * @return {Promise<{opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}>}
   */
  ['video/h264'] (surface, encodedFrame) {
    return surface.h264BufferContentDecoder.decode(encodedFrame)
  }

  /**
   * @param {Surface}surface
   * @param {EncodedFrame}encodedFrame
   * @return {Promise<ImageBitmap>}
   * @private
   */
  ['image/png'] (surface, encodedFrame) {
    const fullFrame = EncodingOptions.fullFrame(encodedFrame.encodingOptions)
    const splitAlpha = EncodingOptions.splitAlpha(encodedFrame.encodingOptions)

    if (fullFrame && !splitAlpha) {
      // Full frame without a separate alpha. Let the browser do all the drawing.
      const frame = encodedFrame.pixelContent[0]
      const opaqueImageBlob = new Blob([frame.opaque], { type: 'image/png' })
      return createImageBitmap(opaqueImageBlob, 0, 0, frame.geo.width, frame.geo.height)
    } else {
      // we don't support/care about fragmented pngs (and definitely not with a separate alpha channel as png has it internal)
      throw new Error(`Unsupported buffer. Encoding type: ${encodedFrame.mimeType}, full frame:${fullFrame}, split alpha: ${splitAlpha}`)
    }
  }
}

export default FrameDecoder
