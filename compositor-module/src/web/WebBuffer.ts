import { WlBufferRequests, WlBufferResource } from 'westfield-runtime-server'
import BufferImplementation from '../BufferImplementation'
import BufferContents from '../BufferContents'
import Surface from '../Surface'

export function isWebBufferContent(
  bufferContent: BufferContents<unknown> | undefined,
): bufferContent is WebBufferContents {
  if (bufferContent) {
    return bufferContent.mimeType === 'image/bitmap'
  }
  return false
}

export interface WebBufferContents extends BufferContents<ImageBitmap> {
  readonly mimeType: 'image/bitmap'
}

export class WebBuffer implements WlBufferRequests, BufferImplementation<BufferContents<ImageBitmap>> {
  static create(resource: WlBufferResource, imageBitmap: ImageBitmap): WebBuffer {
    return new WebBuffer(resource, imageBitmap)
  }

  private readonly contents: WebBufferContents
  released = false

  constructor(readonly resource: WlBufferResource, readonly imageBitmap: ImageBitmap) {
    this.contents = {
      contentSerial: 0,
      mimeType: 'image/bitmap',
      size: { width: imageBitmap.width, height: imageBitmap.height } as const,
      pixelContent: imageBitmap,
    } as const
  }

  destroy(resource: WlBufferResource): void {
    this.imageBitmap.close()
    resource.destroy()
  }

  getContents(surface: Surface, serial?: number): BufferContents<ImageBitmap> {
    return this.contents
  }

  release(): void {
    this.released = true
    this.resource.release()
  }
}
