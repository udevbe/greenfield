import {
  Client,
  WebBitmapbufFactoryRequests,
  WebBitmapbufFactoryResource,
  Global,
  Registry,
  WlBufferResource,
} from 'westfield-runtime-server'
import Session from '../Session'
import { ImageBitmapBuffer } from '../ImageBitmapBuffer'
import { FD } from 'westfield-runtime-common'

export class WebBuffersFactory implements WebBitmapbufFactoryRequests {
  private global?: Global

  static create(session: Session): WebBuffersFactory {
    return new WebBuffersFactory(session)
  }

  private constructor(private readonly session: Session) {}

  createBuffer(resource: WebBitmapbufFactoryResource, id: number, bitmap: FD): void {
    const bufferResource = new WlBufferResource(resource.client, id, resource.version)
    bufferResource.implementation = ImageBitmapBuffer.create(bufferResource, bitmap as ImageBitmap)
  }

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, WebBitmapbufFactoryResource.protocolName, 1, (client, id, version) => {
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
    const gfWebBufferFactoryResource = new WebBitmapbufFactoryResource(client, id, version)
    gfWebBufferFactoryResource.implementation = this
  }
}
