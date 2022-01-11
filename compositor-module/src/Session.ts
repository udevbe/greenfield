// Copyright 2020 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import { Client, Display } from 'westfield-runtime-server'
import Globals from './Globals'
import { ButtonCode, CompositorSession } from './index'
import RemoteOutOfBandChannel from './RemoteOutOfBandChannel'
import { FrameDecoder } from './remotestreaming/buffer-decoder'
import { createWasmFrameDecoder } from './remotestreaming/wasm-buffer-decoder'
import { createWebCodecFrameDecoder } from './remotestreaming/webcodec-buffer-decoder'
import Renderer from './render/Renderer'
import { createUserShellApi, UserShellApi } from './UserShellApi'
import WebFS from './WebFS'

export interface LogFn {
  /* tslint:disable:no-unnecessary-generics */

  // eslint-disable-next-line @typescript-eslint/ban-types
  <T extends object>(obj: T, msg?: string, ...args: any[]): void

  (msg: string, ...args: any[]): void
}

export type GreenfieldLogger = {
  /**
   * Log at `'error'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  error: LogFn
  /**
   * Log at `'warn'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  warn: LogFn
  /**
   * Log at `'info'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  info: LogFn
  /**
   * Log at `'debug'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  debug: LogFn
  /**
   * Log at `'trace'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  trace: LogFn
}

export type RemoteClientConnection = {
  remoteOutOfBandChannel: RemoteOutOfBandChannel
  client: Client
}

async function h264WebCodecsSupported(): Promise<boolean> {
  if ('VideoDecoder' in window) {
    const videoDecoderSupport = await VideoDecoder.isConfigSupported({ codec: 'avc1.42001e' /*h264 Baseline Level 3*/ })
    return videoDecoderSupport.supported
  }
  return false
}

class Session implements CompositorSession {
  readonly webFS: WebFS
  readonly globals: Globals
  readonly renderer: Renderer
  readonly userShell: UserShellApi
  public readonly frameDecoder: FrameDecoder
  private readonly remoteClientConnections: Record<string, RemoteClientConnection> = {}

  private constructor(
    public readonly display: Display,
    public readonly compositorSessionId: string,
    public readonly logger: GreenfieldLogger,
    frameDecoderFactory: (session: Session) => FrameDecoder,
  ) {
    this.webFS = WebFS.create(this.compositorSessionId)
    this.globals = Globals.create(this)
    this.renderer = Renderer.create(this)
    this.userShell = createUserShellApi(this)
    this.frameDecoder = frameDecoderFactory(this)
  }

  static async create(
    sessionId?: string,
    logger: GreenfieldLogger = {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: () => {
        /*noop*/
      },
      trace: () => {
        /*noop*/
      },
    },
  ): Promise<Session> {
    const display = new Display()
    const compositorSessionId =
      sessionId ??
      ((): string => {
        const randomBytes = new Uint8Array(128)
        crypto.getRandomValues(randomBytes)
        return `sid:${[...randomBytes].map((b) => b.toString(16).padStart(2, '0')).join('')}`
      })()
    let frameDecoderFactory: (session: Session) => FrameDecoder
    if (await h264WebCodecsSupported()) {
      frameDecoderFactory = createWebCodecFrameDecoder
      logger.info('Will use H.264 WebCodecs Decoder.')
    } else {
      logger.info('Will use H.264 WASM Decoder.')
      frameDecoderFactory = createWasmFrameDecoder
    }

    const session = new Session(display, compositorSessionId, logger, frameDecoderFactory)
    session.globals.seat.buttonBindings.push({
      modifiers: 0,
      button: ButtonCode.MAIN,
      handler: (pointer, event) => {
        if (pointer.grab !== pointer.defaultGrab) {
          return
        }
        if (pointer.focus === undefined) {
          return
        }
        pointer.focus.surface.getMainSurface().role?.desktopSurface?.activate()
      },
    })

    session.globals.seat.buttonBindings.push({
      modifiers: 0,
      button: ButtonCode.SECONDARY,
      handler: (pointer, event) => {
        if (pointer.grab !== pointer.defaultGrab) {
          return
        }
        if (pointer.focus === undefined) {
          return
        }
        pointer.focus.surface.getMainSurface().role?.desktopSurface?.activate()
      },
    })

    session.logger.info('Session created.')
    return session
  }

  terminate(): void {
    this.globals.unregister()
    Object.values(this.display.clients).forEach((client) => client.close())
  }

  flush(): void {
    this.display.flushClients()
  }

  getRemoteClientConnection(client: Client): RemoteClientConnection {
    return this.remoteClientConnections[client.id]
  }

  registerRemoteClientConnection(client: Client, remoteOutOfBandChannel: RemoteOutOfBandChannel): void {
    this.remoteClientConnections[client.id] = {
      client,
      remoteOutOfBandChannel,
    }
    client.onClose().then(() => delete this.remoteClientConnections[client.id])
  }
}

export default Session
