/*
 *
 *        Copyright © 2023 Erik De Rijcke
 *
 *        Permission is hereby granted, free of charge, to any person
 *        obtaining a copy of this software and associated documentation files
 *        (the "Software"), to deal in the Software without restriction,
 *        including without limitation the rights to use, copy, modify, merge,
 *        publish, distribute, sublicense, and/or sell copies of the Software,
 *        and to permit persons to whom the Software is furnished to do so,
 *        subject to the following conditions:
 *
 *        The above copyright notice and this permission notice (including the
 *        next paragraph) shall be included in all copies or substantial
 *        portions of the Software.
 *
 *        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *        ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *        SOFTWARE.
 *
 */

import { WlMessage, n, h, FD } from '@gfld/common'
import * as Westfield from '..'

/**
 *
 *            A singleton global object that provides support for web buffers.
 *
 *            Clients can create wl_buffer objects using the create_buffer request.
 *
 */
export class WebBitmapbufFactoryResource extends Westfield.Resource {
  static readonly protocolName = 'web_bitmapbuf_factory'

  //@ts-ignore Should always be set when resource is created.
  implementation: WebBitmapbufFactoryRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.createBuffer(this, n(message), h(message))
  }
}

export interface WebBitmapbufFactoryRequests {
  /**
   *
   *                Create a wl_buffer object by wrapping an HTML bitmap, so it can be used with a surface.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id The buffer to create.
   * @param bitmap The bitmap contents
   *
   * @since 1
   *
   */
  createBuffer(resource: WebBitmapbufFactoryResource, id: number, bitmap: FD): void
}
