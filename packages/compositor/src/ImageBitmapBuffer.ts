import { WlBufferRequests, WlBufferResource } from '@gfld/compositor-protocol'
import BufferImplementation from './BufferImplementation'
import BufferContents from './BufferContents'
import Surface from './Surface'

export function isImageBitmapBufferContent(
  bufferContent: BufferContents<unknown> | undefined,
): bufferContent is ImageBitmapBufferContents {
  if (bufferContent) {
    return bufferContent.mimeType === 'image/bitmap'
  }
  return false
}

export interface ImageBitmapBufferContents extends BufferContents<ImageBitmap> {
  readonly mimeType: 'image/bitmap'
}

export class LazyImageBitmapBuffer
  implements WlBufferRequests, BufferImplementation<Promise<ImageBitmapBufferContents>>
{
  static create(resource: WlBufferResource, lazyImageBitmap: () => Promise<ImageBitmap>): LazyImageBitmapBuffer {
    return new LazyImageBitmapBuffer(resource, lazyImageBitmap)
  }

  released = false
  private imageBitmap?: ImageBitmap

  constructor(
    readonly resource: WlBufferResource,
    private readonly lazyImageBitmap: () => Promise<ImageBitmap>,
  ) {}

  destroy(resource: WlBufferResource): void {
    this.imageBitmap?.close()
    this.imageBitmap = undefined
    resource.destroy()
  }

  async getContents(surface: Surface, serial?: number): Promise<ImageBitmapBufferContents> {
    const imageBitmap = await this.lazyImageBitmap()
    if (this.imageBitmap && this.imageBitmap !== imageBitmap) {
      this.imageBitmap.close()
    }
    this.imageBitmap = imageBitmap
    return {
      contentSerial: 0,
      mimeType: 'image/bitmap',
      size: { width: imageBitmap.width, height: imageBitmap.height } as const,
      pixelContent: imageBitmap,
    }
  }

  release(): void {
    this.released = true
    this.resource.release()
  }
}

export class ImageBitmapBuffer implements WlBufferRequests, BufferImplementation<BufferContents<ImageBitmap>> {
  static create(resource: WlBufferResource, imageBitmap: ImageBitmap): ImageBitmapBuffer {
    return new ImageBitmapBuffer(resource, imageBitmap)
  }

  private readonly contents: ImageBitmapBufferContents
  released = false

  constructor(
    readonly resource: WlBufferResource,
    readonly imageBitmap: ImageBitmap,
  ) {
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
