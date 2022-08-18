import { Callback, createDefaultCallback, createProxyCallback } from './Callback'
import Surface from './Surface'
import { Client } from 'westfield-runtime-server'

export interface FrameCallbackFactory {
  create(surface: Surface, client: Client, resourceId: number, version: number): Callback
}

export class ProxyFrameCallbackFactory implements FrameCallbackFactory {
  create(surface: Surface, client: Client, resourceId: number, version: number): Callback {
    return createProxyCallback(surface)
  }
}

export class DefaultFrameCallbackFactory implements FrameCallbackFactory {
  create(surface: Surface, client: Client, resourceId: number, version: number): Callback {
    return createDefaultCallback(client, resourceId, version)
  }
}
