import {
  Client,
  GfWebBufferFactoryRequests,
  GfWebBufferFactoryResource,
  Global,
  Registry,
  WlBufferResource,
} from 'westfield-runtime-server'
import Session from '../Session'
import { WebBuffer } from './WebBuffer'
import { FD } from 'westfield-runtime-common'

export class WebBuffersFactory implements GfWebBufferFactoryRequests {
  private global?: Global

  static create(session: Session): WebBuffersFactory {
    return new WebBuffersFactory(session)
  }

  private constructor(private readonly session: Session) {}

  createBuffer(resource: GfWebBufferFactoryResource, id: number, bitmap: FD): void {
    const bufferResource = new WlBufferResource(resource.client, id, resource.version)
    bufferResource.implementation = WebBuffer.create(bufferResource, bitmap as ImageBitmap)
  }

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, GfWebBufferFactoryResource.protocolName, 1, (client, id, version) => {
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
    const gfWebBufferFactoryResource = new GfWebBufferFactoryResource(client, id, version)
    gfWebBufferFactoryResource.implementation = this
  }
}
