/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *
 */

import {
  WlMessage,
  fileDescriptor,
  uint,
  int,
  fixed,
  object,
  objectOptional,
  newObject,
  string,
  stringOptional,
  array,
  u,
  i,
  oOptional,
  o,
  n,
  sOptional,
  s,
  h,
  FD,
  Fixed,
} from '@gfld/common'
import * as Westfield from '..'

/**
 *
 *      Clients can handle the 'done' event to get notified when
 *      the related request is done.
 *
 */
export class WlCallbackResource extends Westfield.Resource {
  static readonly protocolName = 'wl_callback'

  //@ts-ignore Should always be set when resource is created.
  implementation: any

  /**
   *
   *	Notify the client when the related request is done.
   *
   *
   * @param callbackData request-specific data for the callback
   *
   * @since 1
   *
   */
  done(callbackData: number) {
    this.client.marshall(this.id, 0, [uint(callbackData)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }
}

/**
 *
 *      A compositor.  This object is a singleton global.  The
 *      compositor is in charge of combining the contents of multiple
 *      surfaces into one displayable output.
 *
 */
export class WlCompositorResource extends Westfield.Resource {
  static readonly protocolName = 'wl_compositor'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlCompositorRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.createSurface(this, n(message))
  }
  [1](message: WlMessage) {
    return this.implementation.createRegion(this, n(message))
  }
}

export interface WlCompositorRequests {
  /**
   *
   *	Ask the compositor to create a new surface.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id the new surface
   *
   * @since 1
   *
   */
  createSurface(resource: WlCompositorResource, id: number): void

  /**
   *
   *	Ask the compositor to create a new region.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id the new region
   *
   * @since 1
   *
   */
  createRegion(resource: WlCompositorResource, id: number): void
}

/**
 *
 *      The wl_shm_pool object encapsulates a piece of memory shared
 *      between the compositor and client.  Through the wl_shm_pool
 *      object, the client can allocate shared memory wl_buffer objects.
 *      All objects created through the same pool share the same
 *      underlying mapped memory. Reusing the mapped memory avoids the
 *      setup/teardown overhead and is useful when interactively resizing
 *      a surface or for many small buffers.
 *
 */
export class WlShmPoolResource extends Westfield.Resource {
  static readonly protocolName = 'wl_shm_pool'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlShmPoolRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.createBuffer(
      this,
      n(message),
      i(message),
      i(message),
      i(message),
      i(message),
      u(message),
    )
  }
  [1](message: WlMessage) {
    return this.implementation.destroy(this)
  }
  [2](message: WlMessage) {
    return this.implementation.resize(this, i(message))
  }
}

export interface WlShmPoolRequests {
  /**
   *
   *	Create a wl_buffer object from the pool.
   *
   *	The buffer is created offset bytes into the pool and has
   *	width and height as specified.  The stride argument specifies
   *	the number of bytes from the beginning of one row to the beginning
   *	of the next.  The format is the pixel format of the buffer and
   *	must be one of those advertised through the wl_shm.format event.
   *
   *	A buffer will keep a reference to the pool it was created from
   *	so it is valid to destroy the pool immediately after creating
   *	a buffer from it.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id buffer to create
   * @param offset buffer byte offset within the pool
   * @param width buffer width, in pixels
   * @param height buffer height, in pixels
   * @param stride number of bytes from the beginning of one row to the beginning of the next row
   * @param format buffer pixel format
   *
   * @since 1
   *
   */
  createBuffer(
    resource: WlShmPoolResource,
    id: number,
    offset: number,
    width: number,
    height: number,
    stride: number,
    format: number,
  ): void

  /**
   *
   *	Destroy the shared memory pool.
   *
   *	The mmapped memory will be released when all
   *	buffers that have been created from this pool
   *	are gone.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlShmPoolResource): void

  /**
   *
   *	This request will cause the server to remap the backing memory
   *	for the pool from the file descriptor passed when the pool was
   *	created, but using the new size.  This request can only be
   *	used to make the pool bigger.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param size new size of the pool, in bytes
   *
   * @since 1
   *
   */
  resize(resource: WlShmPoolResource, size: number): void
}

/**
 *
 *      A singleton global object that provides support for shared
 *      memory.
 *
 *      Clients can create wl_shm_pool objects using the create_pool
 *      request.
 *
 *      At connection setup time, the wl_shm object emits one or more
 *      format events to inform clients about the valid pixel formats
 *      that can be used for buffers.
 *
 */
export class WlShmResource extends Westfield.Resource {
  static readonly protocolName = 'wl_shm'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlShmRequests

  /**
   *
   *	Informs the client about a valid pixel format that
   *	can be used for buffers. Known formats include
   *	argb8888 and xrgb8888.
   *
   *
   * @param format buffer pixel format
   *
   * @since 1
   *
   */
  format(format: number) {
    this.client.marshall(this.id, 0, [uint(format)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.createPool(this, n(message), h(message), i(message))
  }
}

export interface WlShmRequests {
  /**
   *
   *	Create a new wl_shm_pool object.
   *
   *	The pool can be used to create shared memory based buffer
   *	objects.  The server will mmap size bytes of the passed file
   *	descriptor, to use as backing memory for the pool.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id pool to create
   * @param fd file descriptor for the pool
   * @param size pool size, in bytes
   *
   * @since 1
   *
   */
  createPool(resource: WlShmResource, id: number, fd: FD, size: number): void
}

export enum WlShmError {
  /**
   * buffer format is not known
   */
  invalidFormat = 0,
  /**
   * invalid size or stride during pool or buffer creation
   */
  invalidStride = 1,
  /**
   * mmapping the file descriptor failed
   */
  invalidFd = 2,
}

export enum WlShmFormat {
  /**
   * 32-bit ARGB format, [31:0] A:R:G:B 8:8:8:8 little endian
   */
  argb8888 = 0,
  /**
   * 32-bit RGB format, [31:0] x:R:G:B 8:8:8:8 little endian
   */
  xrgb8888 = 1,
  /**
   * 8-bit color index format, [7:0] C
   */
  c8 = 0x20203843,
  /**
   * 8-bit RGB format, [7:0] R:G:B 3:3:2
   */
  rgb332 = 0x38424752,
  /**
   * 8-bit BGR format, [7:0] B:G:R 2:3:3
   */
  bgr233 = 0x38524742,
  /**
   * 16-bit xRGB format, [15:0] x:R:G:B 4:4:4:4 little endian
   */
  xrgb4444 = 0x32315258,
  /**
   * 16-bit xBGR format, [15:0] x:B:G:R 4:4:4:4 little endian
   */
  xbgr4444 = 0x32314258,
  /**
   * 16-bit RGBx format, [15:0] R:G:B:x 4:4:4:4 little endian
   */
  rgbx4444 = 0x32315852,
  /**
   * 16-bit BGRx format, [15:0] B:G:R:x 4:4:4:4 little endian
   */
  bgrx4444 = 0x32315842,
  /**
   * 16-bit ARGB format, [15:0] A:R:G:B 4:4:4:4 little endian
   */
  argb4444 = 0x32315241,
  /**
   * 16-bit ABGR format, [15:0] A:B:G:R 4:4:4:4 little endian
   */
  abgr4444 = 0x32314241,
  /**
   * 16-bit RBGA format, [15:0] R:G:B:A 4:4:4:4 little endian
   */
  rgba4444 = 0x32314152,
  /**
   * 16-bit BGRA format, [15:0] B:G:R:A 4:4:4:4 little endian
   */
  bgra4444 = 0x32314142,
  /**
   * 16-bit xRGB format, [15:0] x:R:G:B 1:5:5:5 little endian
   */
  xrgb1555 = 0x35315258,
  /**
   * 16-bit xBGR 1555 format, [15:0] x:B:G:R 1:5:5:5 little endian
   */
  xbgr1555 = 0x35314258,
  /**
   * 16-bit RGBx 5551 format, [15:0] R:G:B:x 5:5:5:1 little endian
   */
  rgbx5551 = 0x35315852,
  /**
   * 16-bit BGRx 5551 format, [15:0] B:G:R:x 5:5:5:1 little endian
   */
  bgrx5551 = 0x35315842,
  /**
   * 16-bit ARGB 1555 format, [15:0] A:R:G:B 1:5:5:5 little endian
   */
  argb1555 = 0x35315241,
  /**
   * 16-bit ABGR 1555 format, [15:0] A:B:G:R 1:5:5:5 little endian
   */
  abgr1555 = 0x35314241,
  /**
   * 16-bit RGBA 5551 format, [15:0] R:G:B:A 5:5:5:1 little endian
   */
  rgba5551 = 0x35314152,
  /**
   * 16-bit BGRA 5551 format, [15:0] B:G:R:A 5:5:5:1 little endian
   */
  bgra5551 = 0x35314142,
  /**
   * 16-bit RGB 565 format, [15:0] R:G:B 5:6:5 little endian
   */
  rgb565 = 0x36314752,
  /**
   * 16-bit BGR 565 format, [15:0] B:G:R 5:6:5 little endian
   */
  bgr565 = 0x36314742,
  /**
   * 24-bit RGB format, [23:0] R:G:B little endian
   */
  rgb888 = 0x34324752,
  /**
   * 24-bit BGR format, [23:0] B:G:R little endian
   */
  bgr888 = 0x34324742,
  /**
   * 32-bit xBGR format, [31:0] x:B:G:R 8:8:8:8 little endian
   */
  xbgr8888 = 0x34324258,
  /**
   * 32-bit RGBx format, [31:0] R:G:B:x 8:8:8:8 little endian
   */
  rgbx8888 = 0x34325852,
  /**
   * 32-bit BGRx format, [31:0] B:G:R:x 8:8:8:8 little endian
   */
  bgrx8888 = 0x34325842,
  /**
   * 32-bit ABGR format, [31:0] A:B:G:R 8:8:8:8 little endian
   */
  abgr8888 = 0x34324241,
  /**
   * 32-bit RGBA format, [31:0] R:G:B:A 8:8:8:8 little endian
   */
  rgba8888 = 0x34324152,
  /**
   * 32-bit BGRA format, [31:0] B:G:R:A 8:8:8:8 little endian
   */
  bgra8888 = 0x34324142,
  /**
   * 32-bit xRGB format, [31:0] x:R:G:B 2:10:10:10 little endian
   */
  xrgb2101010 = 0x30335258,
  /**
   * 32-bit xBGR format, [31:0] x:B:G:R 2:10:10:10 little endian
   */
  xbgr2101010 = 0x30334258,
  /**
   * 32-bit RGBx format, [31:0] R:G:B:x 10:10:10:2 little endian
   */
  rgbx1010102 = 0x30335852,
  /**
   * 32-bit BGRx format, [31:0] B:G:R:x 10:10:10:2 little endian
   */
  bgrx1010102 = 0x30335842,
  /**
   * 32-bit ARGB format, [31:0] A:R:G:B 2:10:10:10 little endian
   */
  argb2101010 = 0x30335241,
  /**
   * 32-bit ABGR format, [31:0] A:B:G:R 2:10:10:10 little endian
   */
  abgr2101010 = 0x30334241,
  /**
   * 32-bit RGBA format, [31:0] R:G:B:A 10:10:10:2 little endian
   */
  rgba1010102 = 0x30334152,
  /**
   * 32-bit BGRA format, [31:0] B:G:R:A 10:10:10:2 little endian
   */
  bgra1010102 = 0x30334142,
  /**
   * packed YCbCr format, [31:0] Cr0:Y1:Cb0:Y0 8:8:8:8 little endian
   */
  yuyv = 0x56595559,
  /**
   * packed YCbCr format, [31:0] Cb0:Y1:Cr0:Y0 8:8:8:8 little endian
   */
  yvyu = 0x55595659,
  /**
   * packed YCbCr format, [31:0] Y1:Cr0:Y0:Cb0 8:8:8:8 little endian
   */
  uyvy = 0x59565955,
  /**
   * packed YCbCr format, [31:0] Y1:Cb0:Y0:Cr0 8:8:8:8 little endian
   */
  vyuy = 0x59555956,
  /**
   * packed AYCbCr format, [31:0] A:Y:Cb:Cr 8:8:8:8 little endian
   */
  ayuv = 0x56555941,
  /**
   * 2 plane YCbCr Cr:Cb format, 2x2 subsampled Cr:Cb plane
   */
  nv12 = 0x3231564e,
  /**
   * 2 plane YCbCr Cb:Cr format, 2x2 subsampled Cb:Cr plane
   */
  nv21 = 0x3132564e,
  /**
   * 2 plane YCbCr Cr:Cb format, 2x1 subsampled Cr:Cb plane
   */
  nv16 = 0x3631564e,
  /**
   * 2 plane YCbCr Cb:Cr format, 2x1 subsampled Cb:Cr plane
   */
  nv61 = 0x3136564e,
  /**
   * 3 plane YCbCr format, 4x4 subsampled Cb (1) and Cr (2) planes
   */
  yuv410 = 0x39565559,
  /**
   * 3 plane YCbCr format, 4x4 subsampled Cr (1) and Cb (2) planes
   */
  yvu410 = 0x39555659,
  /**
   * 3 plane YCbCr format, 4x1 subsampled Cb (1) and Cr (2) planes
   */
  yuv411 = 0x31315559,
  /**
   * 3 plane YCbCr format, 4x1 subsampled Cr (1) and Cb (2) planes
   */
  yvu411 = 0x31315659,
  /**
   * 3 plane YCbCr format, 2x2 subsampled Cb (1) and Cr (2) planes
   */
  yuv420 = 0x32315559,
  /**
   * 3 plane YCbCr format, 2x2 subsampled Cr (1) and Cb (2) planes
   */
  yvu420 = 0x32315659,
  /**
   * 3 plane YCbCr format, 2x1 subsampled Cb (1) and Cr (2) planes
   */
  yuv422 = 0x36315559,
  /**
   * 3 plane YCbCr format, 2x1 subsampled Cr (1) and Cb (2) planes
   */
  yvu422 = 0x36315659,
  /**
   * 3 plane YCbCr format, non-subsampled Cb (1) and Cr (2) planes
   */
  yuv444 = 0x34325559,
  /**
   * 3 plane YCbCr format, non-subsampled Cr (1) and Cb (2) planes
   */
  yvu444 = 0x34325659,
}

/**
 *
 *      A buffer provides the content for a wl_surface. Buffers are
 *      created through factory interfaces such as wl_drm, wl_shm or
 *      similar. It has a width and a height and can be attached to a
 *      wl_surface, but the mechanism by which a client provides and
 *      updates the contents is defined by the buffer factory interface.
 *
 */
export class WlBufferResource extends Westfield.Resource {
  static readonly protocolName = 'wl_buffer'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlBufferRequests

  /**
   *
   *	Sent when this wl_buffer is no longer used by the compositor.
   *	The client is now free to reuse or destroy this buffer and its
   *	backing storage.
   *
   *	If a client receives a release event before the frame callback
   *	requested in the same wl_surface.commit that attaches this
   *	wl_buffer to a surface, then the client is immediately free to
   *	reuse the buffer and its backing storage, and does not need a
   *	second buffer for the next surface content update. Typically
   *	this is possible, when the compositor maintains a copy of the
   *	wl_surface contents, e.g. as a GL texture. This is an important
   *	optimization for GL(ES) compositors with wl_shm clients.
   *
   * @since 1
   *
   */
  release() {
    this.client.marshall(this.id, 0, [])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.destroy(this)
  }
}

export interface WlBufferRequests {
  /**
   *
   *	Destroy a buffer. If and how you need to release the backing
   *	storage is defined by the buffer factory interface.
   *
   *	For possible side-effects to a surface, see wl_surface.attach.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlBufferResource): void
}

/**
 *
 *      A wl_data_offer represents a piece of data offered for transfer
 *      by another client (the source client).  It is used by the
 *      copy-and-paste and drag-and-drop mechanisms.  The offer
 *      describes the different mime types that the data can be
 *      converted to and provides the mechanism for transferring the
 *      data directly from the source client.
 *
 */
export class WlDataOfferResource extends Westfield.Resource {
  static readonly protocolName = 'wl_data_offer'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlDataOfferRequests

  /**
   *
   *	Sent immediately after creating the wl_data_offer object.  One
   *	event per offered mime type.
   *
   *
   * @param mimeType offered mime type
   *
   * @since 1
   *
   */
  offer(mimeType: string) {
    this.client.marshall(this.id, 0, [string(mimeType)])
  }

  /**
   *
   *	This event indicates the actions offered by the data source. It
   *	will be sent right after wl_data_device.enter, or anytime the source
   *	side changes its offered actions through wl_data_source.set_actions.
   *
   *
   * @param sourceActions actions offered by the data source
   *
   * @since 3
   *
   */
  sourceActions(sourceActions: number) {
    this.client.marshall(this.id, 1, [uint(sourceActions)])
  }

  /**
   *
   *	This event indicates the action selected by the compositor after
   *	matching the source/destination side actions. Only one action (or
   *	none) will be offered here.
   *
   *	This event can be emitted multiple times during the drag-and-drop
   *	operation in response to destination side action changes through
   *	wl_data_offer.set_actions.
   *
   *	This event will no longer be emitted after wl_data_device.drop
   *	happened on the drag-and-drop destination, the client must
   *	honor the last action received, or the last preferred one set
   *	through wl_data_offer.set_actions when handling an "ask" action.
   *
   *	Compositors may also change the selected action on the fly, mainly
   *	in response to keyboard modifier changes during the drag-and-drop
   *	operation.
   *
   *	The most recent action received is always the valid one. Prior to
   *	receiving wl_data_device.drop, the chosen action may change (e.g.
   *	due to keyboard modifiers being pressed). At the time of receiving
   *	wl_data_device.drop the drag-and-drop destination must honor the
   *	last action received.
   *
   *	Action changes may still happen after wl_data_device.drop,
   *	especially on "ask" actions, where the drag-and-drop destination
   *	may choose another action afterwards. Action changes happening
   *	at this stage are always the result of inter-client negotiation, the
   *	compositor shall no longer be able to induce a different action.
   *
   *	Upon "ask" actions, it is expected that the drag-and-drop destination
   *	may potentially choose a different action and/or mime type,
   *	based on wl_data_offer.source_actions and finally chosen by the
   *	user (e.g. popping up a menu with the available options). The
   *	final wl_data_offer.set_actions and wl_data_offer.accept requests
   *	must happen before the call to wl_data_offer.finish.
   *
   *
   * @param dndAction action selected by the compositor
   *
   * @since 3
   *
   */
  action(dndAction: number) {
    this.client.marshall(this.id, 2, [uint(dndAction)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.accept(this, u(message), sOptional(message))
  }
  [1](message: WlMessage) {
    return this.implementation.receive(this, s(message), h(message))
  }
  [2](message: WlMessage) {
    return this.implementation.destroy(this)
  }
  [3](message: WlMessage) {
    return this.implementation.finish(this)
  }
  [4](message: WlMessage) {
    return this.implementation.setActions(this, u(message), u(message))
  }
}

export interface WlDataOfferRequests {
  /**
   *
   *	Indicate that the client can accept the given mime type, or
   *	NULL for not accepted.
   *
   *	For objects of version 2 or older, this request is used by the
   *	client to give feedback whether the client can receive the given
   *	mime type, or NULL if none is accepted; the feedback does not
   *	determine whether the drag-and-drop operation succeeds or not.
   *
   *	For objects of version 3 or newer, this request determines the
   *	final result of the drag-and-drop operation. If the end result
   *	is that no mime types were accepted, the drag-and-drop operation
   *	will be cancelled and the corresponding drag source will receive
   *	wl_data_source.cancelled. Clients may still use this event in
   *	conjunction with wl_data_source.action for feedback.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param serial serial number of the accept request
   * @param mimeType mime type accepted by the client
   *
   * @since 1
   *
   */
  accept(resource: WlDataOfferResource, serial: number, mimeType: string | undefined): void

  /**
   *
   *	To transfer the offered data, the client issues this request
   *	and indicates the mime type it wants to receive.  The transfer
   *	happens through the passed file descriptor (typically created
   *	with the pipe system call).  The source client writes the data
   *	in the mime type representation requested and then closes the
   *	file descriptor.
   *
   *	The receiving client reads from the read end of the pipe until
   *	EOF and then closes its end, at which point the transfer is
   *	complete.
   *
   *	This request may happen multiple times for different mime types,
   *	both before and after wl_data_device.drop. Drag-and-drop destination
   *	clients may preemptively fetch data or examine it more closely to
   *	determine acceptance.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param mimeType mime type desired by receiver
   * @param fd file descriptor for data transfer
   *
   * @since 1
   *
   */
  receive(resource: WlDataOfferResource, mimeType: string, fd: FD): void

  /**
   *
   *	Destroy the data offer.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlDataOfferResource): void

  /**
   *
   *	Notifies the compositor that the drag destination successfully
   *	finished the drag-and-drop operation.
   *
   *	Upon receiving this request, the compositor will emit
   *	wl_data_source.dnd_finished on the drag source client.
   *
   *	It is a client error to perform other requests than
   *	wl_data_offer.destroy after this one. It is also an error to perform
   *	this request after a NULL mime type has been set in
   *	wl_data_offer.accept or no action was received through
   *	wl_data_offer.action.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 3
   *
   */
  finish(resource: WlDataOfferResource): void

  /**
   *
   *	Sets the actions that the destination side client supports for
   *	this operation. This request may trigger the emission of
   *	wl_data_source.action and wl_data_offer.action events if the compositor
   *	needs to change the selected action.
   *
   *	This request can be called multiple times throughout the
   *	drag-and-drop operation, typically in response to wl_data_device.enter
   *	or wl_data_device.motion events.
   *
   *	This request determines the final result of the drag-and-drop
   *	operation. If the end result is that no action is accepted,
   *	the drag source will receive wl_drag_source.cancelled.
   *
   *	The dnd_actions argument must contain only values expressed in the
   *	wl_data_device_manager.dnd_actions enum, and the preferred_action
   *	argument must only contain one of those values set, otherwise it
   *	will result in a protocol error.
   *
   *	While managing an "ask" action, the destination drag-and-drop client
   *	may perform further wl_data_offer.receive requests, and is expected
   *	to perform one last wl_data_offer.set_actions request with a preferred
   *	action other than "ask" (and optionally wl_data_offer.accept) before
   *	requesting wl_data_offer.finish, in order to convey the action selected
   *	by the user. If the preferred action is not in the
   *	wl_data_offer.source_actions mask, an error will be raised.
   *
   *	If the "ask" action is dismissed (e.g. user cancellation), the client
   *	is expected to perform wl_data_offer.destroy right away.
   *
   *	This request can only be made on drag-and-drop offers, a protocol error
   *	will be raised otherwise.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param dndActions actions supported by the destination client
   * @param preferredAction action preferred by the destination client
   *
   * @since 3
   *
   */
  setActions(resource: WlDataOfferResource, dndActions: number, preferredAction: number): void
}

export enum WlDataOfferError {
  /**
   * finish request was called untimely
   */
  invalidFinish = 0,
  /**
   * action mask contains invalid values
   */
  invalidActionMask = 1,
  /**
   * action argument has an invalid value
   */
  invalidAction = 2,
  /**
   * offer doesn't accept this request
   */
  invalidOffer = 3,
}

/**
 *
 *      The wl_data_source object is the source side of a wl_data_offer.
 *      It is created by the source client in a data transfer and
 *      provides a way to describe the offered data and a way to respond
 *      to requests to transfer the data.
 *
 */
export class WlDataSourceResource extends Westfield.Resource {
  static readonly protocolName = 'wl_data_source'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlDataSourceRequests

  /**
   *
   *	Sent when a target accepts pointer_focus or motion events.  If
   *	a target does not accept any of the offered types, type is NULL.
   *
   *	Used for feedback during drag-and-drop.
   *
   *
   * @param mimeType mime type accepted by the target
   *
   * @since 1
   *
   */
  target(mimeType: string | undefined) {
    this.client.marshall(this.id, 0, [stringOptional(mimeType)])
  }

  /**
   *
   *	Request for data from the client.  Send the data as the
   *	specified mime type over the passed file descriptor, then
   *	close it.
   *
   *
   * @param mimeType mime type for the data
   * @param fd file descriptor for the data
   *
   * @since 1
   *
   */
  send(mimeType: string, fd: FD) {
    this.client.marshall(this.id, 1, [string(mimeType), fileDescriptor(fd)])
  }

  /**
   *
   *	This data source is no longer valid. There are several reasons why
   *	this could happen:
   *
   *	- The data source has been replaced by another data source.
   *	- The drag-and-drop operation was performed, but the drop destination
   *	  did not accept any of the mime types offered through
   *	  wl_data_source.target.
   *	- The drag-and-drop operation was performed, but the drop destination
   *	  did not select any of the actions present in the mask offered through
   *	  wl_data_source.action.
   *	- The drag-and-drop operation was performed but didn't happen over a
   *	  surface.
   *	- The compositor cancelled the drag-and-drop operation (e.g. compositor
   *	  dependent timeouts to avoid stale drag-and-drop transfers).
   *
   *	The client should clean up and destroy this data source.
   *
   *	For objects of version 2 or older, wl_data_source.cancelled will
   *	only be emitted if the data source was replaced by another data
   *	source.
   *
   * @since 1
   *
   */
  cancelled() {
    this.client.marshall(this.id, 2, [])
  }

  /**
   *
   *	The user performed the drop action. This event does not indicate
   *	acceptance, wl_data_source.cancelled may still be emitted afterwards
   *	if the drop destination does not accept any mime type.
   *
   *	However, this event might however not be received if the compositor
   *	cancelled the drag-and-drop operation before this event could happen.
   *
   *	Note that the data_source may still be used in the future and should
   *	not be destroyed here.
   *
   * @since 3
   *
   */
  dndDropPerformed() {
    this.client.marshall(this.id, 3, [])
  }

  /**
   *
   *	The drop destination finished interoperating with this data
   *	source, so the client is now free to destroy this data source and
   *	free all associated data.
   *
   *	If the action used to perform the operation was "move", the
   *	source can now delete the transferred data.
   *
   * @since 3
   *
   */
  dndFinished() {
    this.client.marshall(this.id, 4, [])
  }

  /**
   *
   *	This event indicates the action selected by the compositor after
   *	matching the source/destination side actions. Only one action (or
   *	none) will be offered here.
   *
   *	This event can be emitted multiple times during the drag-and-drop
   *	operation, mainly in response to destination side changes through
   *	wl_data_offer.set_actions, and as the data device enters/leaves
   *	surfaces.
   *
   *	It is only possible to receive this event after
   *	wl_data_source.dnd_drop_performed if the drag-and-drop operation
   *	ended in an "ask" action, in which case the final wl_data_source.action
   *	event will happen immediately before wl_data_source.dnd_finished.
   *
   *	Compositors may also change the selected action on the fly, mainly
   *	in response to keyboard modifier changes during the drag-and-drop
   *	operation.
   *
   *	The most recent action received is always the valid one. The chosen
   *	action may change alongside negotiation (e.g. an "ask" action can turn
   *	into a "move" operation), so the effects of the final action must
   *	always be applied in wl_data_offer.dnd_finished.
   *
   *	Clients can trigger cursor surface changes from this point, so
   *	they reflect the current action.
   *
   *
   * @param dndAction action selected by the compositor
   *
   * @since 3
   *
   */
  action(dndAction: number) {
    this.client.marshall(this.id, 5, [uint(dndAction)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.offer(this, s(message))
  }
  [1](message: WlMessage) {
    return this.implementation.destroy(this)
  }
  [2](message: WlMessage) {
    return this.implementation.setActions(this, u(message))
  }
}

export interface WlDataSourceRequests {
  /**
   *
   *	This request adds a mime type to the set of mime types
   *	advertised to targets.  Can be called several times to offer
   *	multiple types.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param mimeType mime type offered by the data source
   *
   * @since 1
   *
   */
  offer(resource: WlDataSourceResource, mimeType: string): void

  /**
   *
   *	Destroy the data source.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlDataSourceResource): void

  /**
   *
   *	Sets the actions that the source side client supports for this
   *	operation. This request may trigger wl_data_source.action and
   *	wl_data_offer.action events if the compositor needs to change the
   *	selected action.
   *
   *	The dnd_actions argument must contain only values expressed in the
   *	wl_data_device_manager.dnd_actions enum, otherwise it will result
   *	in a protocol error.
   *
   *	This request must be made once only, and can only be made on sources
   *	used in drag-and-drop, so it must be performed before
   *	wl_data_device.start_drag. Attempting to use the source other than
   *	for drag-and-drop will raise a protocol error.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param dndActions actions supported by the data source
   *
   * @since 3
   *
   */
  setActions(resource: WlDataSourceResource, dndActions: number): void
}

export enum WlDataSourceError {
  /**
   * action mask contains invalid values
   */
  invalidActionMask = 0,
  /**
   * source doesn't accept this request
   */
  invalidSource = 1,
}

/**
 *
 *      There is one wl_data_device per seat which can be obtained
 *      from the global wl_data_device_manager singleton.
 *
 *      A wl_data_device provides access to inter-client data transfer
 *      mechanisms such as copy-and-paste and drag-and-drop.
 *
 */
export class WlDataDeviceResource extends Westfield.Resource {
  static readonly protocolName = 'wl_data_device'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlDataDeviceRequests

  /**
   *
   *	The data_offer event introduces a new wl_data_offer object,
   *	which will subsequently be used in either the
   *	data_device.enter event (for drag-and-drop) or the
   *	data_device.selection event (for selections).  Immediately
   *	following the data_device_data_offer event, the new data_offer
   *	object will send out data_offer.offer events to describe the
   *	mime types it offers.
   *
   *
   * @return resource id. the new data_offer object
   *
   * @since 1
   *
   */
  dataOffer() {
    return this.client.marshallConstructor(this.id, 0, [newObject()])
  }

  /**
   *
   *	This event is sent when an active drag-and-drop pointer enters
   *	a surface owned by the client.  The position of the pointer at
   *	enter time is provided by the x and y arguments, in surface-local
   *	coordinates.
   *
   *
   * @param serial serial number of the enter event
   * @param surface client surface entered
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   * @param id source data_offer object
   *
   * @since 1
   *
   */
  enter(
    serial: number,
    surface: Westfield.WlSurfaceResource,
    x: Fixed,
    y: Fixed,
    id: Westfield.WlDataOfferResource | undefined,
  ) {
    this.client.marshall(this.id, 1, [uint(serial), object(surface), fixed(x), fixed(y), objectOptional(id)])
  }

  /**
   *
   *	This event is sent when the drag-and-drop pointer leaves the
   *	surface and the session ends.  The client must destroy the
   *	wl_data_offer introduced at enter time at this point.
   *
   * @since 1
   *
   */
  leave() {
    this.client.marshall(this.id, 2, [])
  }

  /**
   *
   *	This event is sent when the drag-and-drop pointer moves within
   *	the currently focused surface. The new position of the pointer
   *	is provided by the x and y arguments, in surface-local
   *	coordinates.
   *
   *
   * @param time timestamp with millisecond granularity
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   *
   * @since 1
   *
   */
  motion(time: number, x: Fixed, y: Fixed) {
    this.client.marshall(this.id, 3, [uint(time), fixed(x), fixed(y)])
  }

  /**
   *
   *	The event is sent when a drag-and-drop operation is ended
   *	because the implicit grab is removed.
   *
   *	The drag-and-drop destination is expected to honor the last action
   *	received through wl_data_offer.action, if the resulting action is
   *	"copy" or "move", the destination can still perform
   *	wl_data_offer.receive requests, and is expected to end all
   *	transfers with a wl_data_offer.finish request.
   *
   *	If the resulting action is "ask", the action will not be considered
   *	final. The drag-and-drop destination is expected to perform one last
   *	wl_data_offer.set_actions request, or wl_data_offer.destroy in order
   *	to cancel the operation.
   *
   * @since 1
   *
   */
  drop() {
    this.client.marshall(this.id, 4, [])
  }

  /**
   *
   *	The selection event is sent out to notify the client of a new
   *	wl_data_offer for the selection for this device.  The
   *	data_device.data_offer and the data_offer.offer events are
   *	sent out immediately before this event to introduce the data
   *	offer object.  The selection event is sent to a client
   *	immediately before receiving keyboard focus and when a new
   *	selection is set while the client has keyboard focus.  The
   *	data_offer is valid until a new data_offer or NULL is received
   *	or until the client loses keyboard focus.  The client must
   *	destroy the previous selection data_offer, if any, upon receiving
   *	this event.
   *
   *
   * @param id selection data_offer object
   *
   * @since 1
   *
   */
  selection(id: Westfield.WlDataOfferResource | undefined) {
    this.client.marshall(this.id, 5, [objectOptional(id)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.startDrag(
      this,
      oOptional<Westfield.WlDataSourceResource>(message, this.client.connection),
      o<Westfield.WlSurfaceResource>(message, this.client.connection),
      oOptional<Westfield.WlSurfaceResource>(message, this.client.connection),
      u(message),
    )
  }
  [1](message: WlMessage) {
    return this.implementation.setSelection(
      this,
      oOptional<Westfield.WlDataSourceResource>(message, this.client.connection),
      u(message),
    )
  }
  [2](message: WlMessage) {
    return this.implementation.release(this)
  }
}

export interface WlDataDeviceRequests {
  /**
   *
   *	This request asks the compositor to start a drag-and-drop
   *	operation on behalf of the client.
   *
   *	The source argument is the data source that provides the data
   *	for the eventual data transfer. If source is NULL, enter, leave
   *	and motion events are sent only to the client that initiated the
   *	drag and the client is expected to handle the data passing
   *	internally.
   *
   *	The origin surface is the surface where the drag originates and
   *	the client must have an active implicit grab that matches the
   *	serial.
   *
   *	The icon surface is an optional (can be NULL) surface that
   *	provides an icon to be moved around with the cursor.  Initially,
   *	the top-left corner of the icon surface is placed at the cursor
   *	hotspot, but subsequent wl_surface.attach request can move the
   *	relative position. Attach requests must be confirmed with
   *	wl_surface.commit as usual. The icon surface is given the role of
   *	a drag-and-drop icon. If the icon surface already has another role,
   *	it raises a protocol error.
   *
   *	The current and pending input regions of the icon wl_surface are
   *	cleared, and wl_surface.set_input_region is ignored until the
   *	wl_surface is no longer used as the icon surface. When the use
   *	as an icon ends, the current and pending input regions become
   *	undefined, and the wl_surface is unmapped.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param source data source for the eventual transfer
   * @param origin surface where the drag originates
   * @param icon drag-and-drop icon surface
   * @param serial serial number of the implicit grab on the origin
   *
   * @since 1
   *
   */
  startDrag(
    resource: WlDataDeviceResource,
    source: Westfield.WlDataSourceResource | undefined,
    origin: Westfield.WlSurfaceResource,
    icon: Westfield.WlSurfaceResource | undefined,
    serial: number,
  ): void

  /**
   *
   *	This request asks the compositor to set the selection
   *	to the data from the source on behalf of the client.
   *
   *	To unset the selection, set the source to NULL.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param source data source for the selection
   * @param serial serial number of the event that triggered this request
   *
   * @since 1
   *
   */
  setSelection(resource: WlDataDeviceResource, source: Westfield.WlDataSourceResource | undefined, serial: number): void

  /**
   *
   *	This request destroys the data device.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 2
   *
   */
  release(resource: WlDataDeviceResource): void
}

export enum WlDataDeviceError {
  /**
   * given wl_surface has another role
   */
  role = 0,
}

/**
 *
 *      The wl_data_device_manager is a singleton global object that
 *      provides access to inter-client data transfer mechanisms such as
 *      copy-and-paste and drag-and-drop.  These mechanisms are tied to
 *      a wl_seat and this interface lets a client get a wl_data_device
 *      corresponding to a wl_seat.
 *
 *      Depending on the version bound, the objects created from the bound
 *      wl_data_device_manager object will have different requirements for
 *      functioning properly. See wl_data_source.set_actions,
 *      wl_data_offer.accept and wl_data_offer.finish for details.
 *
 */
export class WlDataDeviceManagerResource extends Westfield.Resource {
  static readonly protocolName = 'wl_data_device_manager'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlDataDeviceManagerRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.createDataSource(this, n(message))
  }
  [1](message: WlMessage) {
    return this.implementation.getDataDevice(
      this,
      n(message),
      o<Westfield.WlSeatResource>(message, this.client.connection),
    )
  }
}

export interface WlDataDeviceManagerRequests {
  /**
   *
   *	Create a new data source.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id data source to create
   *
   * @since 1
   *
   */
  createDataSource(resource: WlDataDeviceManagerResource, id: number): void

  /**
   *
   *	Create a new data device for a given seat.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id data device to create
   * @param seat seat associated with the data device
   *
   * @since 1
   *
   */
  getDataDevice(resource: WlDataDeviceManagerResource, id: number, seat: Westfield.WlSeatResource): void
}

export enum WlDataDeviceManagerDndAction {
  /**
   * no action
   */
  none = 0,
  /**
   * copy action
   */
  copy = 1,
  /**
   * move action
   */
  move = 2,
  /**
   * ask action
   */
  ask = 4,
}

/**
 *
 *      This interface is implemented by servers that provide
 *      desktop-style user interfaces.
 *
 *      It allows clients to associate a wl_shell_surface with
 *      a basic surface.
 *
 */
export class WlShellResource extends Westfield.Resource {
  static readonly protocolName = 'wl_shell'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlShellRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.getShellSurface(
      this,
      n(message),
      o<Westfield.WlSurfaceResource>(message, this.client.connection),
    )
  }
}

export interface WlShellRequests {
  /**
   *
   *	Create a shell surface for an existing surface. This gives
   *	the wl_surface the role of a shell surface. If the wl_surface
   *	already has another role, it raises a protocol error.
   *
   *	Only one shell surface can be associated with a given surface.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id shell surface to create
   * @param surface surface to be given the shell surface role
   *
   * @since 1
   *
   */
  getShellSurface(resource: WlShellResource, id: number, surface: Westfield.WlSurfaceResource): void
}

export enum WlShellError {
  /**
   * given wl_surface has another role
   */
  role = 0,
}

/**
 *
 *      An interface that may be implemented by a wl_surface, for
 *      implementations that provide a desktop-style user interface.
 *
 *      It provides requests to treat surfaces like toplevel, fullscreen
 *      or popup windows, move, resize or maximize them, associate
 *      metadata like title and class, etc.
 *
 *      On the server side the object is automatically destroyed when
 *      the related wl_surface is destroyed. On the client side,
 *      wl_shell_surface_destroy() must be called before destroying
 *      the wl_surface object.
 *
 */
export class WlShellSurfaceResource extends Westfield.Resource {
  static readonly protocolName = 'wl_shell_surface'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlShellSurfaceRequests

  /**
   *
   *	Ping a client to check if it is receiving events and sending
   *	requests. A client is expected to reply with a pong request.
   *
   *
   * @param serial serial number of the ping
   *
   * @since 1
   *
   */
  ping(serial: number) {
    this.client.marshall(this.id, 0, [uint(serial)])
  }

  /**
   *
   *	The configure event asks the client to resize its surface.
   *
   *	The size is a hint, in the sense that the client is free to
   *	ignore it if it doesn't resize, pick a smaller size (to
   *	satisfy aspect ratio or resize in steps of NxM pixels).
   *
   *	The edges parameter provides a hint about how the surface
   *	was resized. The client may use this information to decide
   *	how to adjust its content to the new size (e.g. a scrolling
   *	area might adjust its content position to leave the viewable
   *	content unmoved).
   *
   *	The client is free to dismiss all but the last configure
   *	event it received.
   *
   *	The width and height arguments specify the size of the window
   *	in surface-local coordinates.
   *
   *
   * @param edges how the surface was resized
   * @param width new width of the surface
   * @param height new height of the surface
   *
   * @since 1
   *
   */
  configure(edges: number, width: number, height: number) {
    this.client.marshall(this.id, 1, [uint(edges), int(width), int(height)])
  }

  /**
   *
   *	The popup_done event is sent out when a popup grab is broken,
   *	that is, when the user clicks a surface that doesn't belong
   *	to the client owning the popup surface.
   *
   * @since 1
   *
   */
  popupDone() {
    this.client.marshall(this.id, 2, [])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.pong(this, u(message))
  }
  [1](message: WlMessage) {
    return this.implementation.move(this, o<Westfield.WlSeatResource>(message, this.client.connection), u(message))
  }
  [2](message: WlMessage) {
    return this.implementation.resize(
      this,
      o<Westfield.WlSeatResource>(message, this.client.connection),
      u(message),
      u(message),
    )
  }
  [3](message: WlMessage) {
    return this.implementation.setToplevel(this)
  }
  [4](message: WlMessage) {
    return this.implementation.setTransient(
      this,
      o<Westfield.WlSurfaceResource>(message, this.client.connection),
      i(message),
      i(message),
      u(message),
    )
  }
  [5](message: WlMessage) {
    return this.implementation.setFullscreen(
      this,
      u(message),
      u(message),
      oOptional<Westfield.WlOutputResource>(message, this.client.connection),
    )
  }
  [6](message: WlMessage) {
    return this.implementation.setPopup(
      this,
      o<Westfield.WlSeatResource>(message, this.client.connection),
      u(message),
      o<Westfield.WlSurfaceResource>(message, this.client.connection),
      i(message),
      i(message),
      u(message),
    )
  }
  [7](message: WlMessage) {
    return this.implementation.setMaximized(
      this,
      oOptional<Westfield.WlOutputResource>(message, this.client.connection),
    )
  }
  [8](message: WlMessage) {
    return this.implementation.setTitle(this, s(message))
  }
  [9](message: WlMessage) {
    return this.implementation.setClass(this, s(message))
  }
}

export interface WlShellSurfaceRequests {
  /**
   *
   *	A client must respond to a ping event with a pong request or
   *	the client may be deemed unresponsive.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param serial serial number of the ping event
   *
   * @since 1
   *
   */
  pong(resource: WlShellSurfaceResource, serial: number): void

  /**
   *
   *	Start a pointer-driven move of the surface.
   *
   *	This request must be used in response to a button press event.
   *	The server may ignore move requests depending on the state of
   *	the surface (e.g. fullscreen or maximized).
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param seat seat whose pointer is used
   * @param serial serial number of the implicit grab on the pointer
   *
   * @since 1
   *
   */
  move(resource: WlShellSurfaceResource, seat: Westfield.WlSeatResource, serial: number): void

  /**
   *
   *	Start a pointer-driven resizing of the surface.
   *
   *	This request must be used in response to a button press event.
   *	The server may ignore resize requests depending on the state of
   *	the surface (e.g. fullscreen or maximized).
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param seat seat whose pointer is used
   * @param serial serial number of the implicit grab on the pointer
   * @param edges which edge or corner is being dragged
   *
   * @since 1
   *
   */
  resize(resource: WlShellSurfaceResource, seat: Westfield.WlSeatResource, serial: number, edges: number): void

  /**
   *
   *	Map the surface as a toplevel surface.
   *
   *	A toplevel surface is not fullscreen, maximized or transient.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  setToplevel(resource: WlShellSurfaceResource): void

  /**
   *
   *	Map the surface relative to an existing surface.
   *
   *	The x and y arguments specify the location of the upper left
   *	corner of the surface relative to the upper left corner of the
   *	parent surface, in surface-local coordinates.
   *
   *	The flags argument controls details of the transient behaviour.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param parent parent surface
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   * @param flags transient surface behavior
   *
   * @since 1
   *
   */
  setTransient(
    resource: WlShellSurfaceResource,
    parent: Westfield.WlSurfaceResource,
    x: number,
    y: number,
    flags: number,
  ): void

  /**
   *
   *	Map the surface as a fullscreen surface.
   *
   *	If an output parameter is given then the surface will be made
   *	fullscreen on that output. If the client does not specify the
   *	output then the compositor will apply its policy - usually
   *	choosing the output on which the surface has the biggest surface
   *	area.
   *
   *	The client may specify a method to resolve a size conflict
   *	between the output size and the surface size - this is provided
   *	through the method parameter.
   *
   *	The framerate parameter is used only when the method is set
   *	to "driver", to indicate the preferred framerate. A value of 0
   *	indicates that the client does not care about framerate.  The
   *	framerate is specified in mHz, that is framerate of 60000 is 60Hz.
   *
   *	A method of "scale" or "driver" implies a scaling operation of
   *	the surface, either via a direct scaling operation or a change of
   *	the output mode. This will override any kind of output scaling, so
   *	that mapping a surface with a buffer size equal to the mode can
   *	fill the screen independent of buffer_scale.
   *
   *	A method of "fill" means we don't scale up the buffer, however
   *	any output scale is applied. This means that you may run into
   *	an edge case where the application maps a buffer with the same
   *	size of the output mode but buffer_scale 1 (thus making a
   *	surface larger than the output). In this case it is allowed to
   *	downscale the results to fit the screen.
   *
   *	The compositor must reply to this request with a configure event
   *	with the dimensions for the output on which the surface will
   *	be made fullscreen.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param method method for resolving size conflict
   * @param framerate framerate in mHz
   * @param output output on which the surface is to be fullscreen
   *
   * @since 1
   *
   */
  setFullscreen(
    resource: WlShellSurfaceResource,
    method: number,
    framerate: number,
    output: Westfield.WlOutputResource | undefined,
  ): void

  /**
   *
   *	Map the surface as a popup.
   *
   *	A popup surface is a transient surface with an added pointer
   *	grab.
   *
   *	An existing implicit grab will be changed to owner-events mode,
   *	and the popup grab will continue after the implicit grab ends
   *	(i.e. releasing the mouse button does not cause the popup to
   *	be unmapped).
   *
   *	The popup grab continues until the window is destroyed or a
   *	mouse button is pressed in any other client's window. A click
   *	in any of the client's surfaces is reported as normal, however,
   *	clicks in other clients' surfaces will be discarded and trigger
   *	the callback.
   *
   *	The x and y arguments specify the location of the upper left
   *	corner of the surface relative to the upper left corner of the
   *	parent surface, in surface-local coordinates.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param seat seat whose pointer is used
   * @param serial serial number of the implicit grab on the pointer
   * @param parent parent surface
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   * @param flags transient surface behavior
   *
   * @since 1
   *
   */
  setPopup(
    resource: WlShellSurfaceResource,
    seat: Westfield.WlSeatResource,
    serial: number,
    parent: Westfield.WlSurfaceResource,
    x: number,
    y: number,
    flags: number,
  ): void

  /**
   *
   *	Map the surface as a maximized surface.
   *
   *	If an output parameter is given then the surface will be
   *	maximized on that output. If the client does not specify the
   *	output then the compositor will apply its policy - usually
   *	choosing the output on which the surface has the biggest surface
   *	area.
   *
   *	The compositor will reply with a configure event telling
   *	the expected new surface size. The operation is completed
   *	on the next buffer attach to this surface.
   *
   *	A maximized surface typically fills the entire output it is
   *	bound to, except for desktop elements such as panels. This is
   *	the main difference between a maximized shell surface and a
   *	fullscreen shell surface.
   *
   *	The details depend on the compositor implementation.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param output output on which the surface is to be maximized
   *
   * @since 1
   *
   */
  setMaximized(resource: WlShellSurfaceResource, output: Westfield.WlOutputResource | undefined): void

  /**
   *
   *	Set a short title for the surface.
   *
   *	This string may be used to identify the surface in a task bar,
   *	window list, or other user interface elements provided by the
   *	compositor.
   *
   *	The string must be encoded in UTF-8.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param title surface title
   *
   * @since 1
   *
   */
  setTitle(resource: WlShellSurfaceResource, title: string): void

  /**
   *
   *	Set a class for the surface.
   *
   *	The surface class identifies the general class of applications
   *	to which the surface belongs. A common convention is to use the
   *	file name (or the full path if it is a non-standard location) of
   *	the application's .desktop file as the class.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param clazz surface class
   *
   * @since 1
   *
   */
  setClass(resource: WlShellSurfaceResource, clazz: string): void
}

export enum WlShellSurfaceResize {
  /**
   * no edge
   */
  none = 0,
  /**
   * top edge
   */
  top = 1,
  /**
   * bottom edge
   */
  bottom = 2,
  /**
   * left edge
   */
  left = 4,
  /**
   * top and left edges
   */
  topLeft = 5,
  /**
   * bottom and left edges
   */
  bottomLeft = 6,
  /**
   * right edge
   */
  right = 8,
  /**
   * top and right edges
   */
  topRight = 9,
  /**
   * bottom and right edges
   */
  bottomRight = 10,
}

export enum WlShellSurfaceTransient {
  /**
   * do not set keyboard focus
   */
  inactive = 0x1,
}

export enum WlShellSurfaceFullscreenMethod {
  /**
   * no preference, apply default policy
   */
  default = 0,
  /**
   * scale, preserve the surface's aspect ratio and center on output
   */
  scale = 1,
  /**
   * switch output mode to the smallest mode that can fit the surface, add black borders to compensate size mismatch
   */
  driver = 2,
  /**
   * no upscaling, center on output and add black borders to compensate size mismatch
   */
  fill = 3,
}

/**
 *
 *      A surface is a rectangular area that is displayed on the screen.
 *      It has a location, size and pixel contents.
 *
 *      The size of a surface (and relative positions on it) is described
 *      in surface-local coordinates, which may differ from the buffer
 *      coordinates of the pixel content, in case a buffer_transform
 *      or a buffer_scale is used.
 *
 *      A surface without a "role" is fairly useless: a compositor does
 *      not know where, when or how to present it. The role is the
 *      purpose of a wl_surface. Examples of roles are a cursor for a
 *      pointer (as set by wl_pointer.set_cursor), a drag icon
 *      (wl_data_device.start_drag), a sub-surface
 *      (wl_subcompositor.get_subsurface), and a window as defined by a
 *      shell protocol (e.g. wl_shell.get_shell_surface).
 *
 *      A surface can have only one role at a time. Initially a
 *      wl_surface does not have a role. Once a wl_surface is given a
 *      role, it is set permanently for the whole lifetime of the
 *      wl_surface object. Giving the current role again is allowed,
 *      unless explicitly forbidden by the relevant interface
 *      specification.
 *
 *      Surface roles are given by requests in other interfaces such as
 *      wl_pointer.set_cursor. The request should explicitly mention
 *      that this request gives a role to a wl_surface. Often, this
 *      request also creates a new protocol object that represents the
 *      role and adds additional functionality to wl_surface. When a
 *      client wants to destroy a wl_surface, they must destroy this 'role
 *      object' before the wl_surface.
 *
 *      Destroying the role object does not remove the role from the
 *      wl_surface, but it may stop the wl_surface from "playing the role".
 *      For instance, if a wl_subsurface object is destroyed, the wl_surface
 *      it was created for will be unmapped and forget its position and
 *      z-order. It is allowed to create a wl_subsurface for the same
 *      wl_surface again, but it is not allowed to use the wl_surface as
 *      a cursor (cursor is a different role than sub-surface, and role
 *      switching is not allowed).
 *
 */
export class WlSurfaceResource extends Westfield.Resource {
  static readonly protocolName = 'wl_surface'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlSurfaceRequests

  /**
   *
   *	This is emitted whenever a surface's creation, movement, or resizing
   *	results in some part of it being within the scanout region of an
   *	output.
   *
   *	Note that a surface may be overlapping with zero or more outputs.
   *
   *
   * @param output output entered by the surface
   *
   * @since 1
   *
   */
  enter(output: Westfield.WlOutputResource) {
    this.client.marshall(this.id, 0, [object(output)])
  }

  /**
   *
   *	This is emitted whenever a surface's creation, movement, or resizing
   *	results in it no longer having any part of it within the scanout region
   *	of an output.
   *
   *
   * @param output output left by the surface
   *
   * @since 1
   *
   */
  leave(output: Westfield.WlOutputResource) {
    this.client.marshall(this.id, 1, [object(output)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.destroy(this)
  }
  [1](message: WlMessage) {
    return this.implementation.attach(
      this,
      oOptional<Westfield.WlBufferResource>(message, this.client.connection),
      i(message),
      i(message),
    )
  }
  [2](message: WlMessage) {
    return this.implementation.damage(this, i(message), i(message), i(message), i(message))
  }
  [3](message: WlMessage) {
    return this.implementation.frame(this, n(message))
  }
  [4](message: WlMessage) {
    return this.implementation.setOpaqueRegion(
      this,
      oOptional<Westfield.WlRegionResource>(message, this.client.connection),
    )
  }
  [5](message: WlMessage) {
    return this.implementation.setInputRegion(
      this,
      oOptional<Westfield.WlRegionResource>(message, this.client.connection),
    )
  }
  [6](message: WlMessage) {
    return this.implementation.commit(this)
  }
  [7](message: WlMessage) {
    return this.implementation.setBufferTransform(this, i(message))
  }
  [8](message: WlMessage) {
    return this.implementation.setBufferScale(this, i(message))
  }
  [9](message: WlMessage) {
    return this.implementation.damageBuffer(this, i(message), i(message), i(message), i(message))
  }
}

export interface WlSurfaceRequests {
  /**
   *
   *	Deletes the surface and invalidates its object ID.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlSurfaceResource): void

  /**
   *
   *	Set a buffer as the content of this surface.
   *
   *	The new size of the surface is calculated based on the buffer
   *	size transformed by the inverse buffer_transform and the
   *	inverse buffer_scale. This means that the supplied buffer
   *	must be an integer multiple of the buffer_scale.
   *
   *	The x and y arguments specify the location of the new pending
   *	buffer's upper left corner, relative to the current buffer's upper
   *	left corner, in surface-local coordinates. In other words, the
   *	x and y, combined with the new surface size define in which
   *	directions the surface's size changes.
   *
   *	Surface contents are double-buffered state, see wl_surface.commit.
   *
   *	The initial surface contents are void; there is no content.
   *	wl_surface.attach assigns the given wl_buffer as the pending
   *	wl_buffer. wl_surface.commit makes the pending wl_buffer the new
   *	surface contents, and the size of the surface becomes the size
   *	calculated from the wl_buffer, as described above. After commit,
   *	there is no pending buffer until the next attach.
   *
   *	Committing a pending wl_buffer allows the compositor to read the
   *	pixels in the wl_buffer. The compositor may access the pixels at
   *	any time after the wl_surface.commit request. When the compositor
   *	will not access the pixels anymore, it will send the
   *	wl_buffer.release event. Only after receiving wl_buffer.release,
   *	the client may reuse the wl_buffer. A wl_buffer that has been
   *	attached and then replaced by another attach instead of committed
   *	will not receive a release event, and is not used by the
   *	compositor.
   *
   *	Destroying the wl_buffer after wl_buffer.release does not change
   *	the surface contents. However, if the client destroys the
   *	wl_buffer before receiving the wl_buffer.release event, the surface
   *	contents become undefined immediately.
   *
   *	If wl_surface.attach is sent with a NULL wl_buffer, the
   *	following wl_surface.commit will remove the surface content.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param buffer buffer of surface contents
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   *
   * @since 1
   *
   */
  attach(resource: WlSurfaceResource, buffer: Westfield.WlBufferResource | undefined, x: number, y: number): void

  /**
   *
   *	This request is used to describe the regions where the pending
   *	buffer is different from the current surface contents, and where
   *	the surface therefore needs to be repainted. The compositor
   *	ignores the parts of the damage that fall outside of the surface.
   *
   *	Damage is double-buffered state, see wl_surface.commit.
   *
   *	The damage rectangle is specified in surface-local coordinates,
   *	where x and y specify the upper left corner of the damage rectangle.
   *
   *	The initial value for pending damage is empty: no damage.
   *	wl_surface.damage adds pending damage: the new pending damage
   *	is the union of old pending damage and the given rectangle.
   *
   *	wl_surface.commit assigns pending damage as the current damage,
   *	and clears pending damage. The server will clear the current
   *	damage as it repaints the surface.
   *
   *	Alternatively, damage can be posted with wl_surface.damage_buffer
   *	which uses buffer coordinates instead of surface coordinates,
   *	and is probably the preferred and intuitive way of doing this.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   * @param width width of damage rectangle
   * @param height height of damage rectangle
   *
   * @since 1
   *
   */
  damage(resource: WlSurfaceResource, x: number, y: number, width: number, height: number): void

  /**
   *
   *	Request a notification when it is a good time to start drawing a new
   *	frame, by creating a frame callback. This is useful for throttling
   *	redrawing operations, and driving animations.
   *
   *	When a client is animating on a wl_surface, it can use the 'frame'
   *	request to get notified when it is a good time to draw and commit the
   *	next frame of animation. If the client commits an update earlier than
   *	that, it is likely that some updates will not make it to the display,
   *	and the client is wasting resources by drawing too often.
   *
   *	The frame request will take effect on the next wl_surface.commit.
   *	The notification will only be posted for one frame unless
   *	requested again. For a wl_surface, the notifications are posted in
   *	the order the frame requests were committed.
   *
   *	The server must send the notifications so that a client
   *	will not send excessive updates, while still allowing
   *	the highest possible update rate for clients that wait for the reply
   *	before drawing again. The server should give some time for the client
   *	to draw and commit after sending the frame callback events to let it
   *	hit the next output refresh.
   *
   *	A server should avoid signaling the frame callbacks if the
   *	surface is not visible in any way, e.g. the surface is off-screen,
   *	or completely obscured by other opaque surfaces.
   *
   *	The object returned by this request will be destroyed by the
   *	compositor after the callback is fired and as such the client must not
   *	attempt to use it after that point.
   *
   *	The callback_data passed in the callback is the current time, in
   *	milliseconds, with an undefined base.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param callback callback object for the frame request
   *
   * @since 1
   *
   */
  frame(resource: WlSurfaceResource, callback: number): void

  /**
   *
   *	This request sets the region of the surface that contains
   *	opaque content.
   *
   *	The opaque region is an optimization hint for the compositor
   *	that lets it optimize the redrawing of content behind opaque
   *	regions.  Setting an opaque region is not required for correct
   *	behaviour, but marking transparent content as opaque will result
   *	in repaint artifacts.
   *
   *	The opaque region is specified in surface-local coordinates.
   *
   *	The compositor ignores the parts of the opaque region that fall
   *	outside of the surface.
   *
   *	Opaque region is double-buffered state, see wl_surface.commit.
   *
   *	wl_surface.set_opaque_region changes the pending opaque region.
   *	wl_surface.commit copies the pending region to the current region.
   *	Otherwise, the pending and current regions are never changed.
   *
   *	The initial value for an opaque region is empty. Setting the pending
   *	opaque region has copy semantics, and the wl_region object can be
   *	destroyed immediately. A NULL wl_region causes the pending opaque
   *	region to be set to empty.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param region opaque region of the surface
   *
   * @since 1
   *
   */
  setOpaqueRegion(resource: WlSurfaceResource, region: Westfield.WlRegionResource | undefined): void

  /**
   *
   *	This request sets the region of the surface that can receive
   *	pointer and touch events.
   *
   *	Input events happening outside of this region will try the next
   *	surface in the server surface stack. The compositor ignores the
   *	parts of the input region that fall outside of the surface.
   *
   *	The input region is specified in surface-local coordinates.
   *
   *	Input region is double-buffered state, see wl_surface.commit.
   *
   *	wl_surface.set_input_region changes the pending input region.
   *	wl_surface.commit copies the pending region to the current region.
   *	Otherwise the pending and current regions are never changed,
   *	except cursor and icon surfaces are special cases, see
   *	wl_pointer.set_cursor and wl_data_device.start_drag.
   *
   *	The initial value for an input region is infinite. That means the
   *	whole surface will accept input. Setting the pending input region
   *	has copy semantics, and the wl_region object can be destroyed
   *	immediately. A NULL wl_region causes the input region to be set
   *	to infinite.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param region input region of the surface
   *
   * @since 1
   *
   */
  setInputRegion(resource: WlSurfaceResource, region: Westfield.WlRegionResource | undefined): void

  /**
   *
   *	Surface state (input, opaque, and damage regions, attached buffers,
   *	etc.) is double-buffered. Protocol requests modify the pending state,
   *	as opposed to the current state in use by the compositor. A commit
   *	request atomically applies all pending state, replacing the current
   *	state. After commit, the new pending state is as documented for each
   *	related request.
   *
   *	On commit, a pending wl_buffer is applied first, and all other state
   *	second. This means that all coordinates in double-buffered state are
   *	relative to the new wl_buffer coming into use, except for
   *	wl_surface.attach itself. If there is no pending wl_buffer, the
   *	coordinates are relative to the current surface contents.
   *
   *	All requests that need a commit to become effective are documented
   *	to affect double-buffered state.
   *
   *	Other interfaces may add further double-buffered surface state.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  commit(resource: WlSurfaceResource): void

  /**
   *
   *	This request sets an optional transformation on how the compositor
   *	interprets the contents of the buffer attached to the surface. The
   *	accepted values for the transform parameter are the values for
   *	wl_output.transform.
   *
   *	Buffer transform is double-buffered state, see wl_surface.commit.
   *
   *	A newly created surface has its buffer transformation set to normal.
   *
   *	wl_surface.set_buffer_transform changes the pending buffer
   *	transformation. wl_surface.commit copies the pending buffer
   *	transformation to the current one. Otherwise, the pending and current
   *	values are never changed.
   *
   *	The purpose of this request is to allow clients to render content
   *	according to the output transform, thus permitting the compositor to
   *	use certain optimizations even if the display is rotated. Using
   *	hardware overlays and scanning out a client buffer for fullscreen
   *	surfaces are examples of such optimizations. Those optimizations are
   *	highly dependent on the compositor implementation, so the use of this
   *	request should be considered on a case-by-case basis.
   *
   *	Note that if the transform value includes 90 or 270 degree rotation,
   *	the width of the buffer will become the surface height and the height
   *	of the buffer will become the surface width.
   *
   *	If transform is not one of the values from the
   *	wl_output.transform enum the invalid_transform protocol error
   *	is raised.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param transform transform for interpreting buffer contents
   *
   * @since 2
   *
   */
  setBufferTransform(resource: WlSurfaceResource, transform: number): void

  /**
   *
   *	This request sets an optional scaling factor on how the compositor
   *	interprets the contents of the buffer attached to the window.
   *
   *	Buffer scale is double-buffered state, see wl_surface.commit.
   *
   *	A newly created surface has its buffer scale set to 1.
   *
   *	wl_surface.set_buffer_scale changes the pending buffer scale.
   *	wl_surface.commit copies the pending buffer scale to the current one.
   *	Otherwise, the pending and current values are never changed.
   *
   *	The purpose of this request is to allow clients to supply higher
   *	resolution buffer data for use on high resolution outputs. It is
   *	intended that you pick the same buffer scale as the scale of the
   *	output that the surface is displayed on. This means the compositor
   *	can avoid scaling when rendering the surface on that output.
   *
   *	Note that if the scale is larger than 1, then you have to attach
   *	a buffer that is larger (by a factor of scale in each dimension)
   *	than the desired surface size.
   *
   *	If scale is not positive the invalid_scale protocol error is
   *	raised.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param scale positive scale for interpreting buffer contents
   *
   * @since 3
   *
   */
  setBufferScale(resource: WlSurfaceResource, scale: number): void

  /**
   *
   *	This request is used to describe the regions where the pending
   *	buffer is different from the current surface contents, and where
   *	the surface therefore needs to be repainted. The compositor
   *	ignores the parts of the damage that fall outside of the surface.
   *
   *	Damage is double-buffered state, see wl_surface.commit.
   *
   *	The damage rectangle is specified in buffer coordinates,
   *	where x and y specify the upper left corner of the damage rectangle.
   *
   *	The initial value for pending damage is empty: no damage.
   *	wl_surface.damage_buffer adds pending damage: the new pending
   *	damage is the union of old pending damage and the given rectangle.
   *
   *	wl_surface.commit assigns pending damage as the current damage,
   *	and clears pending damage. The server will clear the current
   *	damage as it repaints the surface.
   *
   *	This request differs from wl_surface.damage in only one way - it
   *	takes damage in buffer coordinates instead of surface-local
   *	coordinates. While this generally is more intuitive than surface
   *	coordinates, it is especially desirable when using wp_viewport
   *	or when a drawing library (like EGL) is unaware of buffer scale
   *	and buffer transform.
   *
   *	Note: Because buffer transformation changes and damage requests may
   *	be interleaved in the protocol stream, it is impossible to determine
   *	the actual mapping between surface and buffer damage until
   *	wl_surface.commit time. Therefore, compositors wishing to take both
   *	kinds of damage into account will have to accumulate damage from the
   *	two requests separately and only transform from one to the other
   *	after receiving the wl_surface.commit.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param x buffer-local x coordinate
   * @param y buffer-local y coordinate
   * @param width width of damage rectangle
   * @param height height of damage rectangle
   *
   * @since 4
   *
   */
  damageBuffer(resource: WlSurfaceResource, x: number, y: number, width: number, height: number): void
}

export enum WlSurfaceError {
  /**
   * buffer scale value is invalid
   */
  invalidScale = 0,
  /**
   * buffer transform value is invalid
   */
  invalidTransform = 1,
}

/**
 *
 *      A seat is a group of keyboards, pointer and touch devices. This
 *      object is published as a global during start up, or when such a
 *      device is hot plugged.  A seat typically has a pointer and
 *      maintains a keyboard focus and a pointer focus.
 *
 */
export class WlSeatResource extends Westfield.Resource {
  static readonly protocolName = 'wl_seat'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlSeatRequests

  /**
   *
   *	This is emitted whenever a seat gains or loses the pointer,
   *	keyboard or touch capabilities.  The argument is a capability
   *	enum containing the complete set of capabilities this seat has.
   *
   *	When the pointer capability is added, a client may create a
   *	wl_pointer object using the wl_seat.get_pointer request. This object
   *	will receive pointer events until the capability is removed in the
   *	future.
   *
   *	When the pointer capability is removed, a client should destroy the
   *	wl_pointer objects associated with the seat where the capability was
   *	removed, using the wl_pointer.release request. No further pointer
   *	events will be received on these objects.
   *
   *	In some compositors, if a seat regains the pointer capability and a
   *	client has a previously obtained wl_pointer object of version 4 or
   *	less, that object may start sending pointer events again. This
   *	behavior is considered a misinterpretation of the intended behavior
   *	and must not be relied upon by the client. wl_pointer objects of
   *	version 5 or later must not send events if created before the most
   *	recent event notifying the client of an added pointer capability.
   *
   *	The above behavior also applies to wl_keyboard and wl_touch with the
   *	keyboard and touch capabilities, respectively.
   *
   *
   * @param capabilities capabilities of the seat
   *
   * @since 1
   *
   */
  capabilities(capabilities: number) {
    this.client.marshall(this.id, 0, [uint(capabilities)])
  }

  /**
   *
   *	In a multiseat configuration this can be used by the client to help
   *	identify which physical devices the seat represents. Based on
   *	the seat configuration used by the compositor.
   *
   *
   * @param name seat identifier
   *
   * @since 2
   *
   */
  name(name: string) {
    this.client.marshall(this.id, 1, [string(name)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.getPointer(this, n(message))
  }
  [1](message: WlMessage) {
    return this.implementation.getKeyboard(this, n(message))
  }
  [2](message: WlMessage) {
    return this.implementation.getTouch(this, n(message))
  }
  [3](message: WlMessage) {
    return this.implementation.release(this)
  }
}

export interface WlSeatRequests {
  /**
   *
   *	The ID provided will be initialized to the wl_pointer interface
   *	for this seat.
   *
   *	This request only takes effect if the seat has the pointer
   *	capability, or has had the pointer capability in the past.
   *	It is a protocol violation to issue this request on a seat that has
   *	never had the pointer capability.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id seat pointer
   *
   * @since 1
   *
   */
  getPointer(resource: WlSeatResource, id: number): void

  /**
   *
   *	The ID provided will be initialized to the wl_keyboard interface
   *	for this seat.
   *
   *	This request only takes effect if the seat has the keyboard
   *	capability, or has had the keyboard capability in the past.
   *	It is a protocol violation to issue this request on a seat that has
   *	never had the keyboard capability.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id seat keyboard
   *
   * @since 1
   *
   */
  getKeyboard(resource: WlSeatResource, id: number): void

  /**
   *
   *	The ID provided will be initialized to the wl_touch interface
   *	for this seat.
   *
   *	This request only takes effect if the seat has the touch
   *	capability, or has had the touch capability in the past.
   *	It is a protocol violation to issue this request on a seat that has
   *	never had the touch capability.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id seat touch interface
   *
   * @since 1
   *
   */
  getTouch(resource: WlSeatResource, id: number): void

  /**
   *
   *	Using this request a client can tell the server that it is not going to
   *	use the seat object anymore.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 5
   *
   */
  release(resource: WlSeatResource): void
}

export enum WlSeatCapability {
  /**
   * the seat has pointer devices
   */
  pointer = 1,
  /**
   * the seat has one or more keyboards
   */
  keyboard = 2,
  /**
   * the seat has touch devices
   */
  touch = 4,
}

/**
 *
 *      The wl_pointer interface represents one or more input devices,
 *      such as mice, which control the pointer location and pointer_focus
 *      of a seat.
 *
 *      The wl_pointer interface generates motion, enter and leave
 *      events for the surfaces that the pointer is located over,
 *      and button and axis events for button presses, button releases
 *      and scrolling.
 *
 */
export class WlPointerResource extends Westfield.Resource {
  static readonly protocolName = 'wl_pointer'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlPointerRequests

  /**
   *
   *	Notification that this seat's pointer is focused on a certain
   *	surface.
   *
   *	When a seat's focus enters a surface, the pointer image
   *	is undefined and a client should respond to this event by setting
   *	an appropriate pointer image with the set_cursor request.
   *
   *
   * @param serial serial number of the enter event
   * @param surface surface entered by the pointer
   * @param surfaceX surface-local x coordinate
   * @param surfaceY surface-local y coordinate
   *
   * @since 1
   *
   */
  enter(serial: number, surface: Westfield.WlSurfaceResource, surfaceX: Fixed, surfaceY: Fixed) {
    this.client.marshall(this.id, 0, [uint(serial), object(surface), fixed(surfaceX), fixed(surfaceY)])
  }

  /**
   *
   *	Notification that this seat's pointer is no longer focused on
   *	a certain surface.
   *
   *	The leave notification is sent before the enter notification
   *	for the new focus.
   *
   *
   * @param serial serial number of the leave event
   * @param surface surface left by the pointer
   *
   * @since 1
   *
   */
  leave(serial: number, surface: Westfield.WlSurfaceResource) {
    this.client.marshall(this.id, 1, [uint(serial), object(surface)])
  }

  /**
   *
   *	Notification of pointer location change. The arguments
   *	surface_x and surface_y are the location relative to the
   *	focused surface.
   *
   *
   * @param time timestamp with millisecond granularity
   * @param surfaceX surface-local x coordinate
   * @param surfaceY surface-local y coordinate
   *
   * @since 1
   *
   */
  motion(time: number, surfaceX: Fixed, surfaceY: Fixed) {
    this.client.marshall(this.id, 2, [uint(time), fixed(surfaceX), fixed(surfaceY)])
  }

  /**
   *
   *	Mouse button click and release notifications.
   *
   *	The location of the click is given by the last motion or
   *	enter event.
   *	The time argument is a timestamp with millisecond
   *	granularity, with an undefined base.
   *
   *	The button is a button code as defined in the Linux kernel's
   *	linux/input-event-codes.h header file, e.g. BTN_LEFT.
   *
   *	Any 16-bit button code value is reserved for future additions to the
   *	kernel's event code list. All other button codes above 0xFFFF are
   *	currently undefined but may be used in future versions of this
   *	protocol.
   *
   *
   * @param serial serial number of the button event
   * @param time timestamp with millisecond granularity
   * @param button button that produced the event
   * @param state physical state of the button
   *
   * @since 1
   *
   */
  button(serial: number, time: number, button: number, state: number) {
    this.client.marshall(this.id, 3, [uint(serial), uint(time), uint(button), uint(state)])
  }

  /**
   *
   *	Scroll and other axis notifications.
   *
   *	For scroll events (vertical and horizontal scroll axes), the
   *	value parameter is the length of a vector along the specified
   *	axis in a coordinate space identical to those of motion events,
   *	representing a relative movement along the specified axis.
   *
   *	For devices that support movements non-parallel to axes multiple
   *	axis events will be emitted.
   *
   *	When applicable, for example for touch pads, the server can
   *	choose to emit scroll events where the motion vector is
   *	equivalent to a motion event vector.
   *
   *	When applicable, a client can transform its content relative to the
   *	scroll distance.
   *
   *
   * @param time timestamp with millisecond granularity
   * @param axis axis type
   * @param value length of vector in surface-local coordinate space
   *
   * @since 1
   *
   */
  axis(time: number, axis: number, value: Fixed) {
    this.client.marshall(this.id, 4, [uint(time), uint(axis), fixed(value)])
  }

  /**
   *
   *	Indicates the end of a set of events that logically belong together.
   *	A client is expected to accumulate the data in all events within the
   *	frame before proceeding.
   *
   *	All wl_pointer events before a wl_pointer.frame event belong
   *	logically together. For example, in a diagonal scroll motion the
   *	compositor will send an optional wl_pointer.axis_source event, two
   *	wl_pointer.axis events (horizontal and vertical) and finally a
   *	wl_pointer.frame event. The client may use this information to
   *	calculate a diagonal vector for scrolling.
   *
   *	When multiple wl_pointer.axis events occur within the same frame,
   *	the motion vector is the combined motion of all events.
   *	When a wl_pointer.axis and a wl_pointer.axis_stop event occur within
   *	the same frame, this indicates that axis movement in one axis has
   *	stopped but continues in the other axis.
   *	When multiple wl_pointer.axis_stop events occur within the same
   *	frame, this indicates that these axes stopped in the same instance.
   *
   *	A wl_pointer.frame event is sent for every logical event group,
   *	even if the group only contains a single wl_pointer event.
   *	Specifically, a client may get a sequence: motion, frame, button,
   *	frame, axis, frame, axis_stop, frame.
   *
   *	The wl_pointer.enter and wl_pointer.leave events are logical events
   *	generated by the compositor and not the hardware. These events are
   *	also grouped by a wl_pointer.frame. When a pointer moves from one
   *	surface to another, a compositor should group the
   *	wl_pointer.leave event within the same wl_pointer.frame.
   *	However, a client must not rely on wl_pointer.leave and
   *	wl_pointer.enter being in the same wl_pointer.frame.
   *	Compositor-specific policies may require the wl_pointer.leave and
   *	wl_pointer.enter event being split across multiple wl_pointer.frame
   *	groups.
   *
   * @since 5
   *
   */
  frame() {
    this.client.marshall(this.id, 5, [])
  }

  /**
   *
   *	Source information for scroll and other axes.
   *
   *	This event does not occur on its own. It is sent before a
   *	wl_pointer.frame event and carries the source information for
   *	all events within that frame.
   *
   *	The source specifies how this event was generated. If the source is
   *	wl_pointer.axis_source.finger, a wl_pointer.axis_stop event will be
   *	sent when the user lifts the finger off the device.
   *
   *	If the source is wl_pointer.axis_source.wheel,
   *	wl_pointer.axis_source.wheel_tilt or
   *	wl_pointer.axis_source.continuous, a wl_pointer.axis_stop event may
   *	or may not be sent. Whether a compositor sends an axis_stop event
   *	for these sources is hardware-specific and implementation-dependent;
   *	clients must not rely on receiving an axis_stop event for these
   *	scroll sources and should treat scroll sequences from these scroll
   *	sources as unterminated by default.
   *
   *	This event is optional. If the source is unknown for a particular
   *	axis event sequence, no event is sent.
   *	Only one wl_pointer.axis_source event is permitted per frame.
   *
   *	The order of wl_pointer.axis_discrete and wl_pointer.axis_source is
   *	not guaranteed.
   *
   *
   * @param axisSource source of the axis event
   *
   * @since 5
   *
   */
  axisSource(axisSource: number) {
    this.client.marshall(this.id, 6, [uint(axisSource)])
  }

  /**
   *
   *	Stop notification for scroll and other axes.
   *
   *	For some wl_pointer.axis_source types, a wl_pointer.axis_stop event
   *	is sent to notify a client that the axis sequence has terminated.
   *	This enables the client to implement kinetic scrolling.
   *	See the wl_pointer.axis_source documentation for information on when
   *	this event may be generated.
   *
   *	Any wl_pointer.axis events with the same axis_source after this
   *	event should be considered as the start of a new axis motion.
   *
   *	The timestamp is to be interpreted identical to the timestamp in the
   *	wl_pointer.axis event. The timestamp value may be the same as a
   *	preceding wl_pointer.axis event.
   *
   *
   * @param time timestamp with millisecond granularity
   * @param axis the axis stopped with this event
   *
   * @since 5
   *
   */
  axisStop(time: number, axis: number) {
    this.client.marshall(this.id, 7, [uint(time), uint(axis)])
  }

  /**
   *
   *	Discrete step information for scroll and other axes.
   *
   *	This event carries the axis value of the wl_pointer.axis event in
   *	discrete steps (e.g. mouse wheel clicks).
   *
   *	This event does not occur on its own, it is coupled with a
   *	wl_pointer.axis event that represents this axis value on a
   *	continuous scale. The protocol guarantees that each axis_discrete
   *	event is always followed by exactly one axis event with the same
   *	axis number within the same wl_pointer.frame. Note that the protocol
   *	allows for other events to occur between the axis_discrete and
   *	its coupled axis event, including other axis_discrete or axis
   *	events.
   *
   *	This event is optional; continuous scrolling devices
   *	like two-finger scrolling on touchpads do not have discrete
   *	steps and do not generate this event.
   *
   *	The discrete value carries the directional information. e.g. a value
   *	of -2 is two steps towards the negative direction of this axis.
   *
   *	The axis number is identical to the axis number in the associated
   *	axis event.
   *
   *	The order of wl_pointer.axis_discrete and wl_pointer.axis_source is
   *	not guaranteed.
   *
   *
   * @param axis axis type
   * @param discrete number of steps
   *
   * @since 5
   *
   */
  axisDiscrete(axis: number, discrete: number) {
    this.client.marshall(this.id, 8, [uint(axis), int(discrete)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.setCursor(
      this,
      u(message),
      oOptional<Westfield.WlSurfaceResource>(message, this.client.connection),
      i(message),
      i(message),
    )
  }
  [1](message: WlMessage) {
    return this.implementation.release(this)
  }
}

export interface WlPointerRequests {
  /**
   *
   *	Set the pointer surface, i.e., the surface that contains the
   *	pointer image (cursor). This request gives the surface the role
   *	of a cursor. If the surface already has another role, it raises
   *	a protocol error.
   *
   *	The cursor actually changes only if the pointer
   *	focus for this device is one of the requesting client's surfaces
   *	or the surface parameter is the current pointer surface. If
   *	there was a previous surface set with this request it is
   *	replaced. If surface is NULL, the pointer image is hidden.
   *
   *	The parameters hotspot_x and hotspot_y define the position of
   *	the pointer surface relative to the pointer location. Its
   *	top-left corner is always at (x, y) - (hotspot_x, hotspot_y),
   *	where (x, y) are the coordinates of the pointer location, in
   *	surface-local coordinates.
   *
   *	On surface.attach requests to the pointer surface, hotspot_x
   *	and hotspot_y are decremented by the x and y parameters
   *	passed to the request. Attach must be confirmed by
   *	wl_surface.commit as usual.
   *
   *	The hotspot can also be updated by passing the currently set
   *	pointer surface to this request with new values for hotspot_x
   *	and hotspot_y.
   *
   *	The current and pending input regions of the wl_surface are
   *	cleared, and wl_surface.set_input_region is ignored until the
   *	wl_surface is no longer used as the cursor. When the use as a
   *	cursor ends, the current and pending input regions become
   *	undefined, and the wl_surface is unmapped.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param serial serial number of the enter event
   * @param surface pointer surface
   * @param hotspotX surface-local x coordinate
   * @param hotspotY surface-local y coordinate
   *
   * @since 1
   *
   */
  setCursor(
    resource: WlPointerResource,
    serial: number,
    surface: Westfield.WlSurfaceResource | undefined,
    hotspotX: number,
    hotspotY: number,
  ): void

  /**
   *
   *	Using this request a client can tell the server that it is not going to
   *	use the pointer object anymore.
   *
   *	This request destroys the pointer proxy object, so clients must not call
   *	wl_pointer_destroy() after using this request.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 3
   *
   */
  release(resource: WlPointerResource): void
}

export enum WlPointerError {
  /**
   * given wl_surface has another role
   */
  role = 0,
}

export enum WlPointerButtonState {
  /**
   * the button is not pressed
   */
  released = 0,
  /**
   * the button is pressed
   */
  pressed = 1,
}

export enum WlPointerAxis {
  /**
   * vertical axis
   */
  verticalScroll = 0,
  /**
   * horizontal axis
   */
  horizontalScroll = 1,
}

export enum WlPointerAxisSource {
  /**
   * a physical wheel rotation
   */
  wheel = 0,
  /**
   * finger on a touch surface
   */
  finger = 1,
  /**
   * continuous coordinate space
   */
  continuous = 2,
  /**
   * a physical wheel tilt
   */
  wheelTilt = 3,
}

/**
 *
 *      The wl_keyboard interface represents one or more keyboards
 *      associated with a seat.
 *
 */
export class WlKeyboardResource extends Westfield.Resource {
  static readonly protocolName = 'wl_keyboard'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlKeyboardRequests

  /**
   *
   *	This event provides a file descriptor to the client which can be
   *	memory-mapped to provide a keyboard mapping description.
   *
   *
   * @param format keymap format
   * @param fd keymap file descriptor
   * @param size keymap size, in bytes
   *
   * @since 1
   *
   */
  keymap(format: number, fd: FD, size: number) {
    this.client.marshall(this.id, 0, [uint(format), fileDescriptor(fd), uint(size)])
  }

  /**
   *
   *	Notification that this seat's keyboard focus is on a certain
   *	surface.
   *
   *
   * @param serial serial number of the enter event
   * @param surface surface gaining keyboard focus
   * @param keys the currently pressed keys
   *
   * @since 1
   *
   */
  enter(serial: number, surface: Westfield.WlSurfaceResource, keys: ArrayBufferView) {
    this.client.marshall(this.id, 1, [uint(serial), object(surface), array(keys)])
  }

  /**
   *
   *	Notification that this seat's keyboard focus is no longer on
   *	a certain surface.
   *
   *	The leave notification is sent before the enter notification
   *	for the new focus.
   *
   *
   * @param serial serial number of the leave event
   * @param surface surface that lost keyboard focus
   *
   * @since 1
   *
   */
  leave(serial: number, surface: Westfield.WlSurfaceResource) {
    this.client.marshall(this.id, 2, [uint(serial), object(surface)])
  }

  /**
   *
   *	A key was pressed or released.
   *	The time argument is a timestamp with millisecond
   *	granularity, with an undefined base.
   *
   *
   * @param serial serial number of the key event
   * @param time timestamp with millisecond granularity
   * @param key key that produced the event
   * @param state physical state of the key
   *
   * @since 1
   *
   */
  key(serial: number, time: number, key: number, state: number) {
    this.client.marshall(this.id, 3, [uint(serial), uint(time), uint(key), uint(state)])
  }

  /**
   *
   *	Notifies clients that the modifier and/or group state has
   *	changed, and it should update its local state.
   *
   *
   * @param serial serial number of the modifiers event
   * @param modsDepressed depressed modifiers
   * @param modsLatched latched modifiers
   * @param modsLocked locked modifiers
   * @param group keyboard layout
   *
   * @since 1
   *
   */
  modifiers(serial: number, modsDepressed: number, modsLatched: number, modsLocked: number, group: number) {
    this.client.marshall(this.id, 4, [
      uint(serial),
      uint(modsDepressed),
      uint(modsLatched),
      uint(modsLocked),
      uint(group),
    ])
  }

  /**
   *
   *	Informs the client about the keyboard's repeat rate and delay.
   *
   *	This event is sent as soon as the wl_keyboard object has been created,
   *	and is guaranteed to be received by the client before any key press
   *	event.
   *
   *	Negative values for either rate or delay are illegal. A rate of zero
   *	will disable any repeating (regardless of the value of delay).
   *
   *	This event can be sent later on as well with a new value if necessary,
   *	so clients should continue listening for the event past the creation
   *	of wl_keyboard.
   *
   *
   * @param rate the rate of repeating keys in characters per second
   * @param delay delay in milliseconds since key down until repeating starts
   *
   * @since 4
   *
   */
  repeatInfo(rate: number, delay: number) {
    this.client.marshall(this.id, 5, [int(rate), int(delay)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.release(this)
  }
}

export interface WlKeyboardRequests {
  /**
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 3
   *
   */
  release(resource: WlKeyboardResource): void
}

export enum WlKeyboardKeymapFormat {
  /**
   * no keymap; client must understand how to interpret the raw keycode
   */
  noKeymap = 0,
  /**
   * libxkbcommon compatible; to determine the xkb keycode, clients must add 8 to the key event keycode
   */
  xkbV1 = 1,
}

export enum WlKeyboardKeyState {
  /**
   * key is not pressed
   */
  released = 0,
  /**
   * key is pressed
   */
  pressed = 1,
}

/**
 *
 *      The wl_touch interface represents a touchscreen
 *      associated with a seat.
 *
 *      Touch interactions can consist of one or more contacts.
 *      For each contact, a series of events is generated, starting
 *      with a down event, followed by zero or more motion events,
 *      and ending with an up event. Events relating to the same
 *      contact point can be identified by the ID of the sequence.
 *
 */
export class WlTouchResource extends Westfield.Resource {
  static readonly protocolName = 'wl_touch'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlTouchRequests

  /**
   *
   *	A new touch point has appeared on the surface. This touch point is
   *	assigned a unique ID. Future events from this touch point reference
   *	this ID. The ID ceases to be valid after a touch up event and may be
   *	reused in the future.
   *
   *
   * @param serial serial number of the touch down event
   * @param time timestamp with millisecond granularity
   * @param surface surface touched
   * @param id the unique ID of this touch point
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   *
   * @since 1
   *
   */
  down(serial: number, time: number, surface: Westfield.WlSurfaceResource, id: number, x: Fixed, y: Fixed) {
    this.client.marshall(this.id, 0, [uint(serial), uint(time), object(surface), int(id), fixed(x), fixed(y)])
  }

  /**
   *
   *	The touch point has disappeared. No further events will be sent for
   *	this touch point and the touch point's ID is released and may be
   *	reused in a future touch down event.
   *
   *
   * @param serial serial number of the touch up event
   * @param time timestamp with millisecond granularity
   * @param id the unique ID of this touch point
   *
   * @since 1
   *
   */
  up(serial: number, time: number, id: number) {
    this.client.marshall(this.id, 1, [uint(serial), uint(time), int(id)])
  }

  /**
   *
   *	A touch point has changed coordinates.
   *
   *
   * @param time timestamp with millisecond granularity
   * @param id the unique ID of this touch point
   * @param x surface-local x coordinate
   * @param y surface-local y coordinate
   *
   * @since 1
   *
   */
  motion(time: number, id: number, x: Fixed, y: Fixed) {
    this.client.marshall(this.id, 2, [uint(time), int(id), fixed(x), fixed(y)])
  }

  /**
   *
   *	Indicates the end of a set of events that logically belong together.
   *	A client is expected to accumulate the data in all events within the
   *	frame before proceeding.
   *
   *	A wl_touch.frame terminates at least one event but otherwise no
   *	guarantee is provided about the set of events within a frame. A client
   *	must assume that any state not updated in a frame is unchanged from the
   *	previously known state.
   *
   * @since 1
   *
   */
  frame() {
    this.client.marshall(this.id, 3, [])
  }

  /**
   *
   *	Sent if the compositor decides the touch stream is a global
   *	gesture. No further events are sent to the clients from that
   *	particular gesture. Touch cancellation applies to all touch points
   *	currently active on this client's surface. The client is
   *	responsible for finalizing the touch points, future touch points on
   *	this surface may reuse the touch point ID.
   *
   * @since 1
   *
   */
  cancel() {
    this.client.marshall(this.id, 4, [])
  }

  /**
   *
   *	Sent when a touchpoint has changed its shape.
   *
   *	This event does not occur on its own. It is sent before a
   *	wl_touch.frame event and carries the new shape information for
   *	any previously reported, or new touch points of that frame.
   *
   *	Other events describing the touch point such as wl_touch.down,
   *	wl_touch.motion or wl_touch.orientation may be sent within the
   *	same wl_touch.frame. A client should treat these events as a single
   *	logical touch point update. The order of wl_touch.shape,
   *	wl_touch.orientation and wl_touch.motion is not guaranteed.
   *	A wl_touch.down event is guaranteed to occur before the first
   *	wl_touch.shape event for this touch ID but both events may occur within
   *	the same wl_touch.frame.
   *
   *	A touchpoint shape is approximated by an ellipse through the major and
   *	minor axis length. The major axis length describes the longer diameter
   *	of the ellipse, while the minor axis length describes the shorter
   *	diameter. Major and minor are orthogonal and both are specified in
   *	surface-local coordinates. The center of the ellipse is always at the
   *	touchpoint location as reported by wl_touch.down or wl_touch.move.
   *
   *	This event is only sent by the compositor if the touch device supports
   *	shape reports. The client has to make reasonable assumptions about the
   *	shape if it did not receive this event.
   *
   *
   * @param id the unique ID of this touch point
   * @param major length of the major axis in surface-local coordinates
   * @param minor length of the minor axis in surface-local coordinates
   *
   * @since 6
   *
   */
  shape(id: number, major: Fixed, minor: Fixed) {
    this.client.marshall(this.id, 5, [int(id), fixed(major), fixed(minor)])
  }

  /**
   *
   *	Sent when a touchpoint has changed its orientation.
   *
   *	This event does not occur on its own. It is sent before a
   *	wl_touch.frame event and carries the new shape information for
   *	any previously reported, or new touch points of that frame.
   *
   *	Other events describing the touch point such as wl_touch.down,
   *	wl_touch.motion or wl_touch.shape may be sent within the
   *	same wl_touch.frame. A client should treat these events as a single
   *	logical touch point update. The order of wl_touch.shape,
   *	wl_touch.orientation and wl_touch.motion is not guaranteed.
   *	A wl_touch.down event is guaranteed to occur before the first
   *	wl_touch.orientation event for this touch ID but both events may occur
   *	within the same wl_touch.frame.
   *
   *	The orientation describes the clockwise angle of a touchpoint's major
   *	axis to the positive surface y-axis and is normalized to the -180 to
   *	+180 degree range. The granularity of orientation depends on the touch
   *	device, some devices only support binary rotation values between 0 and
   *	90 degrees.
   *
   *	This event is only sent by the compositor if the touch device supports
   *	orientation reports.
   *
   *
   * @param id the unique ID of this touch point
   * @param orientation angle between major axis and positive surface y-axis in degrees
   *
   * @since 6
   *
   */
  orientation(id: number, orientation: Fixed) {
    this.client.marshall(this.id, 6, [int(id), fixed(orientation)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.release(this)
  }
}

export interface WlTouchRequests {
  /**
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 3
   *
   */
  release(resource: WlTouchResource): void
}

/**
 *
 *      An output describes part of the compositor geometry.  The
 *      compositor works in the 'compositor coordinate system' and an
 *      output corresponds to a rectangular area in that space that is
 *      actually visible.  This typically corresponds to a monitor that
 *      displays part of the compositor space.  This object is published
 *      as global during start up, or when a monitor is hotplugged.
 *
 */
export class WlOutputResource extends Westfield.Resource {
  static readonly protocolName = 'wl_output'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlOutputRequests

  /**
   *
   *	The geometry event describes geometric properties of the output.
   *	The event is sent when binding to the output object and whenever
   *	any of the properties change.
   *
   *
   * @param x x position within the global compositor space
   * @param y y position within the global compositor space
   * @param physicalWidth width in millimeters of the output
   * @param physicalHeight height in millimeters of the output
   * @param subpixel subpixel orientation of the output
   * @param make textual description of the manufacturer
   * @param model textual description of the model
   * @param transform transform that maps framebuffer to output
   *
   * @since 1
   *
   */
  geometry(
    x: number,
    y: number,
    physicalWidth: number,
    physicalHeight: number,
    subpixel: number,
    make: string,
    model: string,
    transform: number,
  ) {
    this.client.marshall(this.id, 0, [
      int(x),
      int(y),
      int(physicalWidth),
      int(physicalHeight),
      int(subpixel),
      string(make),
      string(model),
      int(transform),
    ])
  }

  /**
   *
   *	The mode event describes an available mode for the output.
   *
   *	The event is sent when binding to the output object and there
   *	will always be one mode, the current mode.  The event is sent
   *	again if an output changes mode, for the mode that is now
   *	current.  In other words, the current mode is always the last
   *	mode that was received with the current flag set.
   *
   *	The size of a mode is given in physical hardware units of
   *	the output device. This is not necessarily the same as
   *	the output size in the global compositor space. For instance,
   *	the output may be scaled, as described in wl_output.scale,
   *	or transformed, as described in wl_output.transform.
   *
   *
   * @param flags bitfield of mode flags
   * @param width width of the mode in hardware units
   * @param height height of the mode in hardware units
   * @param refresh vertical refresh rate in mHz
   *
   * @since 1
   *
   */
  mode(flags: number, width: number, height: number, refresh: number) {
    this.client.marshall(this.id, 1, [uint(flags), int(width), int(height), int(refresh)])
  }

  /**
   *
   *	This event is sent after all other properties have been
   *	sent after binding to the output object and after any
   *	other property changes done after that. This allows
   *	changes to the output properties to be seen as
   *	atomic, even if they happen via multiple events.
   *
   * @since 2
   *
   */
  done() {
    this.client.marshall(this.id, 2, [])
  }

  /**
   *
   *	This event contains scaling geometry information
   *	that is not in the geometry event. It may be sent after
   *	binding the output object or if the output scale changes
   *	later. If it is not sent, the client should assume a
   *	scale of 1.
   *
   *	A scale larger than 1 means that the compositor will
   *	automatically scale surface buffers by this amount
   *	when rendering. This is used for very high resolution
   *	displays where applications rendering at the native
   *	resolution would be too small to be legible.
   *
   *	It is intended that scaling aware clients track the
   *	current output of a surface, and if it is on a scaled
   *	output it should use wl_surface.set_buffer_scale with
   *	the scale of the output. That way the compositor can
   *	avoid scaling the surface, and the client can supply
   *	a higher detail image.
   *
   *
   * @param factor scaling factor of output
   *
   * @since 2
   *
   */
  scale(factor: number) {
    this.client.marshall(this.id, 3, [int(factor)])
  }
  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.release(this)
  }
}

export interface WlOutputRequests {
  /**
   *
   *	Using this request a client can tell the server that it is not going to
   *	use the output object anymore.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 3
   *
   */
  release(resource: WlOutputResource): void
}

export enum WlOutputSubpixel {
  /**
   * unknown geometry
   */
  unknown = 0,
  /**
   * no geometry
   */
  none = 1,
  /**
   * horizontal RGB
   */
  horizontalRgb = 2,
  /**
   * horizontal BGR
   */
  horizontalBgr = 3,
  /**
   * vertical RGB
   */
  verticalRgb = 4,
  /**
   * vertical BGR
   */
  verticalBgr = 5,
}

export enum WlOutputTransform {
  /**
   * no transform
   */
  normal = 0,
  /**
   * 90 degrees counter-clockwise
   */
  _90 = 1,
  /**
   * 180 degrees counter-clockwise
   */
  _180 = 2,
  /**
   * 270 degrees counter-clockwise
   */
  _270 = 3,
  /**
   * 180 degree flip around a vertical axis
   */
  flipped = 4,
  /**
   * flip and rotate 90 degrees counter-clockwise
   */
  flipped90 = 5,
  /**
   * flip and rotate 180 degrees counter-clockwise
   */
  flipped180 = 6,
  /**
   * flip and rotate 270 degrees counter-clockwise
   */
  flipped270 = 7,
}

export enum WlOutputMode {
  /**
   * indicates this is the current mode
   */
  current = 0x1,
  /**
   * indicates this is the preferred mode
   */
  preferred = 0x2,
}

/**
 *
 *      A region object describes an area.
 *
 *      Region objects are used to describe the opaque and input
 *      regions of a surface.
 *
 */
export class WlRegionResource extends Westfield.Resource {
  static readonly protocolName = 'wl_region'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlRegionRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.destroy(this)
  }
  [1](message: WlMessage) {
    return this.implementation.add(this, i(message), i(message), i(message), i(message))
  }
  [2](message: WlMessage) {
    return this.implementation.subtract(this, i(message), i(message), i(message), i(message))
  }
}

export interface WlRegionRequests {
  /**
   *
   *	Destroy the region.  This will invalidate the object ID.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlRegionResource): void

  /**
   *
   *	Add the specified rectangle to the region.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param x region-local x coordinate
   * @param y region-local y coordinate
   * @param width rectangle width
   * @param height rectangle height
   *
   * @since 1
   *
   */
  add(resource: WlRegionResource, x: number, y: number, width: number, height: number): void

  /**
   *
   *	Subtract the specified rectangle from the region.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param x region-local x coordinate
   * @param y region-local y coordinate
   * @param width rectangle width
   * @param height rectangle height
   *
   * @since 1
   *
   */
  subtract(resource: WlRegionResource, x: number, y: number, width: number, height: number): void
}

/**
 *
 *      The global interface exposing sub-surface compositing capabilities.
 *      A wl_surface, that has sub-surfaces associated, is called the
 *      parent surface. Sub-surfaces can be arbitrarily nested and create
 *      a tree of sub-surfaces.
 *
 *      The root surface in a tree of sub-surfaces is the main
 *      surface. The main surface cannot be a sub-surface, because
 *      sub-surfaces must always have a parent.
 *
 *      A main surface with its sub-surfaces forms a (compound) window.
 *      For window management purposes, this set of wl_surface objects is
 *      to be considered as a single window, and it should also behave as
 *      such.
 *
 *      The aim of sub-surfaces is to offload some of the compositing work
 *      within a window from clients to the compositor. A prime example is
 *      a video player with decorations and video in separate wl_surface
 *      objects. This should allow the compositor to pass YUV video buffer
 *      processing to dedicated overlay hardware when possible.
 *
 */
export class WlSubcompositorResource extends Westfield.Resource {
  static readonly protocolName = 'wl_subcompositor'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlSubcompositorRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.destroy(this)
  }
  [1](message: WlMessage) {
    return this.implementation.getSubsurface(
      this,
      n(message),
      o<Westfield.WlSurfaceResource>(message, this.client.connection),
      o<Westfield.WlSurfaceResource>(message, this.client.connection),
    )
  }
}

export interface WlSubcompositorRequests {
  /**
   *
   *	Informs the server that the client will not be using this
   *	protocol object anymore. This does not affect any other
   *	objects, wl_subsurface objects included.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlSubcompositorResource): void

  /**
   *
   *	Create a sub-surface interface for the given surface, and
   *	associate it with the given parent surface. This turns a
   *	plain wl_surface into a sub-surface.
   *
   *	The to-be sub-surface must not already have another role, and it
   *	must not have an existing wl_subsurface object. Otherwise a protocol
   *	error is raised.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param id the new sub-surface object ID
   * @param surface the surface to be turned into a sub-surface
   * @param parent the parent surface
   *
   * @since 1
   *
   */
  getSubsurface(
    resource: WlSubcompositorResource,
    id: number,
    surface: Westfield.WlSurfaceResource,
    parent: Westfield.WlSurfaceResource,
  ): void
}

export enum WlSubcompositorError {
  /**
   * the to-be sub-surface is invalid
   */
  badSurface = 0,
}

/**
 *
 *      An additional interface to a wl_surface object, which has been
 *      made a sub-surface. A sub-surface has one parent surface. A
 *      sub-surface's size and position are not limited to that of the parent.
 *      Particularly, a sub-surface is not automatically clipped to its
 *      parent's area.
 *
 *      A sub-surface becomes mapped, when a non-NULL wl_buffer is applied
 *      and the parent surface is mapped. The order of which one happens
 *      first is irrelevant. A sub-surface is hidden if the parent becomes
 *      hidden, or if a NULL wl_buffer is applied. These rules apply
 *      recursively through the tree of surfaces.
 *
 *      The behaviour of a wl_surface.commit request on a sub-surface
 *      depends on the sub-surface's mode. The possible modes are
 *      synchronized and desynchronized, see methods
 *      wl_subsurface.set_sync and wl_subsurface.set_desync. Synchronized
 *      mode caches the wl_surface state to be applied when the parent's
 *      state gets applied, and desynchronized mode applies the pending
 *      wl_surface state directly. A sub-surface is initially in the
 *      synchronized mode.
 *
 *      Sub-surfaces have also other kind of state, which is managed by
 *      wl_subsurface requests, as opposed to wl_surface requests. This
 *      state includes the sub-surface position relative to the parent
 *      surface (wl_subsurface.set_position), and the stacking order of
 *      the parent and its sub-surfaces (wl_subsurface.place_above and
 *      .place_below). This state is applied when the parent surface's
 *      wl_surface state is applied, regardless of the sub-surface's mode.
 *      As the exception, set_sync and set_desync are effective immediately.
 *
 *      The main surface can be thought to be always in desynchronized mode,
 *      since it does not have a parent in the sub-surfaces sense.
 *
 *      Even if a sub-surface is in desynchronized mode, it will behave as
 *      in synchronized mode, if its parent surface behaves as in
 *      synchronized mode. This rule is applied recursively throughout the
 *      tree of surfaces. This means, that one can set a sub-surface into
 *      synchronized mode, and then assume that all its child and grand-child
 *      sub-surfaces are synchronized, too, without explicitly setting them.
 *
 *      If the wl_surface associated with the wl_subsurface is destroyed, the
 *      wl_subsurface object becomes inert. Note, that destroying either object
 *      takes effect immediately. If you need to synchronize the removal
 *      of a sub-surface to the parent surface update, unmap the sub-surface
 *      first by attaching a NULL wl_buffer, update parent, and then destroy
 *      the sub-surface.
 *
 *      If the parent wl_surface object is destroyed, the sub-surface is
 *      unmapped.
 *
 */
export class WlSubsurfaceResource extends Westfield.Resource {
  static readonly protocolName = 'wl_subsurface'

  //@ts-ignore Should always be set when resource is created.
  implementation: WlSubsurfaceRequests

  constructor(client: Westfield.Client, id: number, version: number) {
    super(client, id, version)
  }

  [0](message: WlMessage) {
    return this.implementation.destroy(this)
  }
  [1](message: WlMessage) {
    return this.implementation.setPosition(this, i(message), i(message))
  }
  [2](message: WlMessage) {
    return this.implementation.placeAbove(this, o<Westfield.WlSurfaceResource>(message, this.client.connection))
  }
  [3](message: WlMessage) {
    return this.implementation.placeBelow(this, o<Westfield.WlSurfaceResource>(message, this.client.connection))
  }
  [4](message: WlMessage) {
    return this.implementation.setSync(this)
  }
  [5](message: WlMessage) {
    return this.implementation.setDesync(this)
  }
}

export interface WlSubsurfaceRequests {
  /**
   *
   *	The sub-surface interface is removed from the wl_surface object
   *	that was turned into a sub-surface with a
   *	wl_subcompositor.get_subsurface request. The wl_surface's association
   *	to the parent is deleted, and the wl_surface loses its role as
   *	a sub-surface. The wl_surface is unmapped.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  destroy(resource: WlSubsurfaceResource): void

  /**
   *
   *	This schedules a sub-surface position change.
   *	The sub-surface will be moved so that its origin (top left
   *	corner pixel) will be at the location x, y of the parent surface
   *	coordinate system. The coordinates are not restricted to the parent
   *	surface area. Negative values are allowed.
   *
   *	The scheduled coordinates will take effect whenever the state of the
   *	parent surface is applied. When this happens depends on whether the
   *	parent surface is in synchronized mode or not. See
   *	wl_subsurface.set_sync and wl_subsurface.set_desync for details.
   *
   *	If more than one set_position request is invoked by the client before
   *	the commit of the parent surface, the position of a new request always
   *	replaces the scheduled position from any previous request.
   *
   *	The initial position is 0, 0.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param x x coordinate in the parent surface
   * @param y y coordinate in the parent surface
   *
   * @since 1
   *
   */
  setPosition(resource: WlSubsurfaceResource, x: number, y: number): void

  /**
   *
   *	This sub-surface is taken from the stack, and put back just
   *	above the reference surface, changing the z-order of the sub-surfaces.
   *	The reference surface must be one of the sibling surfaces, or the
   *	parent surface. Using any other surface, including this sub-surface,
   *	will cause a protocol error.
   *
   *	The z-order is double-buffered. Requests are handled in order and
   *	applied immediately to a pending state. The final pending state is
   *	copied to the active state the next time the state of the parent
   *	surface is applied. When this happens depends on whether the parent
   *	surface is in synchronized mode or not. See wl_subsurface.set_sync and
   *	wl_subsurface.set_desync for details.
   *
   *	A new sub-surface is initially added as the top-most in the stack
   *	of its siblings and parent.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param sibling the reference surface
   *
   * @since 1
   *
   */
  placeAbove(resource: WlSubsurfaceResource, sibling: Westfield.WlSurfaceResource): void

  /**
   *
   *	The sub-surface is placed just below the reference surface.
   *	See wl_subsurface.place_above.
   *
   *
   * @param resource The protocol resource of this implementation.
   * @param sibling the reference surface
   *
   * @since 1
   *
   */
  placeBelow(resource: WlSubsurfaceResource, sibling: Westfield.WlSurfaceResource): void

  /**
   *
   *	Change the commit behaviour of the sub-surface to synchronized
   *	mode, also described as the parent dependent mode.
   *
   *	In synchronized mode, wl_surface.commit on a sub-surface will
   *	accumulate the committed state in a cache, but the state will
   *	not be applied and hence will not change the compositor output.
   *	The cached state is applied to the sub-surface immediately after
   *	the parent surface's state is applied. This ensures atomic
   *	updates of the parent and all its synchronized sub-surfaces.
   *	Applying the cached state will invalidate the cache, so further
   *	parent surface commits do not (re-)apply old state.
   *
   *	See wl_subsurface for the recursive effect of this mode.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  setSync(resource: WlSubsurfaceResource): void

  /**
   *
   *	Change the commit behaviour of the sub-surface to desynchronized
   *	mode, also described as independent or freely running mode.
   *
   *	In desynchronized mode, wl_surface.commit on a sub-surface will
   *	apply the pending state directly, without caching, as happens
   *	normally with a wl_surface. Calling wl_surface.commit on the
   *	parent surface has no effect on the sub-surface's wl_surface
   *	state. This mode allows a sub-surface to be updated on its own.
   *
   *	If cached state exists when wl_surface.commit is called in
   *	desynchronized mode, the pending state is added to the cached
   *	state, and applied as a whole. This invalidates the cache.
   *
   *	Note: even if a sub-surface is set to desynchronized, a parent
   *	sub-surface may override it to behave as synchronized. For details,
   *	see wl_subsurface.
   *
   *	If a surface's parent surface behaves as desynchronized, then
   *	the cached state is applied on set_desync.
   *
   *
   * @param resource The protocol resource of this implementation.
   *
   * @since 1
   *
   */
  setDesync(resource: WlSubsurfaceResource): void
}

export enum WlSubsurfaceError {
  /**
   * wl_surface is not a sibling or the parent
   */
  badSurface = 0,
}
