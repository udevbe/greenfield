import {
  Client,
  Global,
  Registry,
  WlBufferResource,
  WlShmError,
  WlShmFormat,
  WlShmPoolRequests,
  WlShmPoolResource,
  WlShmRequests,
  WlShmResource,
} from '@gfld/compositor-protocol'
import Session from './Session'
import { FD } from '@gfld/common'
import { LazyImageBitmapBuffer } from './ImageBitmapBuffer'

const FORMATS = [WlShmFormat.argb8888, WlShmFormat.xrgb8888]
const INT32_MAX = 2147483647

export class Shm implements WlShmRequests {
  private global?: Global

  static create(session: Session): Shm {
    return new Shm()
  }

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, WlShmResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal(): void {
    if (!this.global) {
      return
    }
    this.global.destroy()
    this.global = undefined
  }

  bindClient(client: Client, id: number, version: number): void {
    const wlShmResource = new WlShmResource(client, id, version)
    wlShmResource.implementation = this
    for (const format of FORMATS) {
      wlShmResource.format(format)
    }
  }

  createPool(resource: WlShmResource, id: number, fd: FD, size: number): void {
    const poolMemory: Uint8Array = fd as Uint8Array
    const wlShmPoolResource = new WlShmPoolResource(resource.client, id, resource.version)
    const shmPool = new ShmPool(wlShmPoolResource, poolMemory)
    wlShmPoolResource.implementation = shmPool
    wlShmPoolResource.addDestroyListener(() => {
      shmPool.unref(false)
    })
  }
}

export class ShmPool implements WlShmPoolRequests {
  internalRefCount = 1
  externalRefCount = 0
  newSize = 0

  constructor(
    private readonly resource: WlShmPoolResource,
    public data: Uint8Array,
  ) {}

  private growMapping() {
    if (this.newSize < this.data.byteLength) {
      return undefined
    }

    return new Uint8Array(this.data.buffer, this.data.byteOffset, this.newSize)

    // que?
    // if (pool->size != 0 && pool->resource != NULL) {
    //   wl_resource_post_error(pool->resource,
    //     WL_SHM_ERROR_INVALID_FD,
    //     "leaked old mapping");
    // }
  }

  private finishResize() {
    if (this.data.byteLength === this.newSize) {
      return
    }

    const newMapping = this.growMapping()
    if (newMapping === undefined) {
      this.resource.postError(WlShmError.invalidFd, 'failed memory grow')
      return
    }
    this.data = newMapping
  }

  unref(external: boolean) {
    if (external) {
      this.externalRefCount--
      console.assert(this.externalRefCount >= 0)
      if (this.externalRefCount === 0) {
        this.finishResize()
      }
    } else {
      this.internalRefCount--
      console.assert(this.internalRefCount >= 0)
    }

    if (this.internalRefCount + this.externalRefCount > 0) {
      return
    }

    // TODO cleanup here?
  }

  async createBuffer(
    resource: WlShmPoolResource,
    id: number,
    offset: number,
    width: number,
    height: number,
    stride: number,
    format: number,
  ): Promise<void> {
    if (
      offset < 0 ||
      width <= 0 ||
      height <= 0 ||
      stride < width ||
      INT32_MAX / stride < height ||
      offset > this.data.byteLength - stride * height
    ) {
      resource.postError(WlShmError.invalidStride, `invalid width, height or stride (${width}x${height}, ${stride})`)
      return
    }

    const bufferResource = new WlBufferResource(resource.client, id, resource.version)

    let imageBitmapCreator: () => Promise<ImageBitmap>
    if (format === WlShmFormat.argb8888) {
      imageBitmapCreator = () => {
        const rawPixels = new Uint8ClampedArray(height * stride)
        rawPixels.set(new Uint8Array(this.data.buffer, this.data.byteOffset + offset, height * stride))
        const imageData = new ImageData(rawPixels, width, height)
        return createImageBitmap(imageData)
      }
    } else if (format === WlShmFormat.xrgb8888) {
      // TODO properly implement stride?
      const header = new DataView(new ArrayBuffer(14 + 40))
      // BMP identity header
      header.setUint8(0, 0x42)
      header.setUint8(1, 0x4d)
      // The size of the BMP file in bytes
      header.setUint32(2, height * stride, true)
      // The offset, i.e. starting address, of the byte where the bitmap image data (pixel array) can be found.
      header.setUint8(10, header.byteLength)
      // the size of this header, in bytes (40)
      header.setUint32(14, 40, true)
      // the bitmap width in pixels (signed integer)
      header.setInt32(18, width, true)
      // the bitmap height in pixels (signed integer)
      header.setInt32(22, -height, true)
      // the number of color planes (must be 1)
      header.setUint16(26, 1, true)
      // the number of bits per pixel, which is the color depth of the image. Typical values are 1, 4, 8, 16, 24 and 32.
      header.setUint16(28, 32, true)
      //the compression method being used.
      header.setUint32(30, 0, true)
      // the image size. This is the size of the raw bitmap data;
      header.setUint32(34, height * stride, true)
      // the horizontal resolution of the image. (pixel per metre, signed integer) (72 DPI × 39.3701 inches per meter yields 2834.6472)
      header.setInt32(38, 2835, true)
      // the horizontal resolution of the image. (pixel per metre, signed integer)
      header.setInt32(42, 2835, true)
      // the number of colors in the color palette, or 0 to default to 2n
      header.setUint32(46, 0, true)
      // the number of important colors used, or 0 when every color is important; generally ignored
      header.setUint32(50, 0, true)

      imageBitmapCreator = () => {
        const shmPixelData = new Uint8Array(this.data.buffer, this.data.byteOffset + offset, height * stride)
        const pixelData = new Uint8Array(shmPixelData.length)
        pixelData.set(shmPixelData)
        return createImageBitmap(new Blob([header, pixelData], { type: 'image/bmp' }))
      }
    } else {
      resource.postError(WlShmError.invalidFormat, `invalid format 0x${format.toString(16)}`)
      return
    }

    // FIXME use a new ShmBuffer type and make sure we can render a pointer sprite with it
    bufferResource.implementation = LazyImageBitmapBuffer.create(bufferResource, imageBitmapCreator)

    this.internalRefCount++
    bufferResource.addDestroyListener(() => {
      this.unref(false)
    })
  }

  destroy(resource: WlShmPoolResource): void {
    resource.destroy()
  }

  resize(resource: WlShmPoolResource, size: number): void {
    if (size < this.data.byteLength) {
      resource.postError(WlShmError.invalidFd, `Can't grow pool. Underlying ArrayBuffer too small.`)
      return
    }

    this.newSize = size

    /* If the compositor has taken references on this pool it
     * may be caching pointers into it. In that case we
     * defer the resize (which may move the entire mapping)
     * until the compositor finishes dereferencing the pool.
     */
    if (this.externalRefCount === 0) {
      this.finishResize()
    }
  }
}
