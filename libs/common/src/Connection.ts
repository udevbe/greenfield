/*
MIT License

Copyright (c) 2020 Erik De Rijcke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const textDecoder = new TextDecoder('utf8')

export class WlObject {
  [opcode: number]: (wlMessage: WlMessage) => void | Promise<void>
  private destroyListeners: ((wlObject: WlObject) => void)[] = []
  constructor(readonly id: number) {}

  destroy() {
    this.destroyListeners.forEach((destroyListener) => destroyListener(this))
    this.destroyListeners = []
  }

  addDestroyListener(destroyListener: (wlObject: WlObject) => void) {
    this.destroyListeners.push(destroyListener)
  }

  removeDestroyListener(destroyListener: (wlObject: WlObject) => void) {
    this.destroyListeners = this.destroyListeners.filter((item) => item !== destroyListener)
  }
}

export class Fixed {
  readonly _raw: number

  /**
   * use parseFixed instead
   * @param {number}raw
   */
  constructor(raw: number) {
    this._raw = raw
  }

  static parse(data: number): Fixed {
    return new Fixed((data * 256.0) >> 0)
  }

  /**
   * Represent fixed as a signed 24-bit integer.
   *
   */
  asInt(): number {
    return (this._raw / 256.0) >> 0
  }

  /**
   * Represent fixed as a signed 24-bit number with an 8-bit fractional part.
   *
   */
  asDouble(): number {
    return this._raw / 256.0
  }
}

/**
 * An FD's real type depends on the protocol message it is used in as well as the client type (remote or web).
 */
export type FD = unknown

export interface MessageMarshallingContext<
  V extends number | FD | Fixed | WlObject | 0 | string | ArrayBufferView | undefined,
  T extends 'u' | 'h' | 'i' | 'f' | 'o' | 'n' | 's' | 'a',
  S extends 0 | 4 | number,
> {
  value: V
  readonly type: T
  readonly size: number
  readonly optional: boolean
  readonly _marshallArg: (wireMsg: { buffer: ArrayBuffer; fds: Array<FD>; bufferOffset: number }) => void
  readonly toString: () => string
}

export interface WlMessage {
  buffer: Uint32Array
  fds: Array<FD>
  bufferOffset: number
  consumed: number
  size: number
}

export interface SendMessage {
  buffer: ArrayBuffer
  fds: Array<FD>
}

export function uint(arg: number): MessageMarshallingContext<number, 'u', 4> {
  return {
    value: arg,
    type: 'u',
    size: 4,
    optional: false,
    _marshallArg(wireMsg) {
      new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = arg
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function fileDescriptor(
  arg: FD,
  marshallArg: (wireMsg: { buffer: ArrayBuffer; fds: Array<FD>; bufferOffset: number }) => void = function (wireMsg) {
    wireMsg.fds.push(arg)
  },
): MessageMarshallingContext<FD, 'h', 0> {
  return {
    value: arg,
    type: 'h',
    size: 0, // file descriptors are not added to the message size because they are somewhat considered meta data.
    optional: false,
    _marshallArg: marshallArg,
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function int(arg: number): MessageMarshallingContext<number, 'i', 4> {
  return {
    value: arg,
    type: 'i',
    size: 4,
    optional: false,
    _marshallArg(wireMsg) {
      new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function fixed(arg: Fixed): MessageMarshallingContext<Fixed, 'f', 4> {
  return {
    value: arg,
    type: 'f',
    size: 4,
    optional: false,
    _marshallArg(wireMsg) {
      new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value._raw
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function object(arg: WlObject): MessageMarshallingContext<WlObject, 'o', 4> {
  return {
    value: arg,
    type: 'o',
    size: 4,
    optional: false,
    _marshallArg(wireMsg) {
      new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.id
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function objectOptional(arg?: WlObject): MessageMarshallingContext<WlObject | undefined, 'o', 4> {
  return {
    value: arg,
    type: 'o',
    size: 4,
    optional: true,
    _marshallArg(wireMsg) {
      new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value === undefined ? 0 : this.value.id
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function newObject(): MessageMarshallingContext<0, 'n', 4> {
  return {
    value: 0, // id filled in by marshallConstructor
    type: 'n',
    size: 4,
    optional: false,
    _marshallArg(wireMsg) {
      new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function string(arg: string): MessageMarshallingContext<string, 's', number> {
  return {
    value: `${arg}\0`,
    type: 's',
    size:
      4 +
      (function () {
        // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
        // length+1 for null terminator
        return (arg.length + 1 + 3) & ~3
      })(),
    optional: false,
    _marshallArg(wireMsg) {
      new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.length

      const strLen = this.value.length
      const buf8 = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, strLen)
      for (let i = 0; i < strLen; i++) {
        buf8[i] = this.value[i].charCodeAt(0)
      }
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function stringOptional(arg?: string): MessageMarshallingContext<string | undefined, 's', number> {
  return {
    value: arg ? `${arg}\0` : undefined,
    type: 's',
    size:
      4 +
      (function () {
        if (arg === undefined) {
          return 0
        } else {
          // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
          // length+1 for null terminator
          return (arg.length + 1 + 3) & ~3
        }
      })(),
    optional: true,
    _marshallArg(wireMsg) {
      if (this.value === undefined) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = 0
      } else {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.length

        const strLen = this.value.length
        const buf8 = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, strLen)
        for (let i = 0; i < strLen; i++) {
          buf8[i] = this.value[i].charCodeAt(0)
        }
      }
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function array(arg: ArrayBufferView): MessageMarshallingContext<ArrayBufferView, 'a', number> {
  return {
    value: arg,
    type: 'a',
    size:
      4 +
      (function () {
        // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
        return (arg.byteLength + 3) & ~3
      })(),
    optional: false,
    _marshallArg(wireMsg) {
      new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.byteLength

      const byteLength = this.value.byteLength
      new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, byteLength).set(
        new Uint8Array(this.value.buffer, 0, byteLength),
      )

      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

export function arrayOptional(
  arg?: ArrayBufferView,
): MessageMarshallingContext<ArrayBufferView | undefined, 'a', number> {
  return {
    value: arg,
    type: 'a',
    size:
      4 +
      (function () {
        if (arg === undefined) {
          return 0
        } else {
          // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
          return (arg.byteLength + 3) & ~3
        }
      })(),
    optional: true,
    _marshallArg(wireMsg) {
      if (this.value === undefined) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = 0
      } else {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.byteLength

        const byteLength = this.value.byteLength
        new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, byteLength).set(
          new Uint8Array(this.value.buffer, 0, byteLength),
        )
      }
      wireMsg.bufferOffset += this.size
    },
    toString() {
      return `{type: ${this.type}, value: ${this.value}}`
    },
  }
}

function checkMessageSize(message: WlMessage, consumption: number) {
  if (message.consumed + consumption > message.size) {
    throw new Error(`Request too short.`)
  } else {
    message.consumed += consumption
  }
}

export function u(message: WlMessage): number {
  checkMessageSize(message, 4)
  return message.buffer[message.bufferOffset++]
}

export function i(message: WlMessage): number {
  checkMessageSize(message, 4)
  const arg = new Int32Array(
    message.buffer.buffer,
    message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT,
    1,
  )[0]
  message.bufferOffset += 1
  return arg
}

export function f(message: WlMessage): Fixed {
  checkMessageSize(message, 4)
  const arg = new Int32Array(
    message.buffer.buffer,
    message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT,
    1,
  )[0]
  message.bufferOffset += 1
  return new Fixed(arg >> 0)
}

export function oOptional<T extends WlObject>(message: WlMessage, connection: Connection): T | undefined {
  checkMessageSize(message, 4)
  const arg = message.buffer[message.bufferOffset++]
  if (arg === 0) {
    return undefined
  } else {
    const wlObject = connection.wlObjects[arg]
    if (wlObject) {
      // TODO add an extra check to make sure we cast correctly
      return wlObject as T
    } else {
      throw new Error(`Unknown object id ${arg}`)
    }
  }
}

export function o<T extends WlObject>(message: WlMessage, connection: Connection): T {
  checkMessageSize(message, 4)
  const arg = message.buffer[message.bufferOffset++]

  const wlObject = connection.wlObjects[arg]
  if (wlObject) {
    // TODO add an extra check to make sure we cast correctly
    return wlObject as T
  } else {
    throw new Error(`Unknown object id ${arg}`)
  }
}

export function n(message: WlMessage): number {
  checkMessageSize(message, 4)
  return message.buffer[message.bufferOffset++]
}

export function sOptional(message: WlMessage): string | undefined {
  // {String}
  checkMessageSize(message, 4)
  const stringSize = message.buffer[message.bufferOffset++]
  if (stringSize === 0) {
    return undefined
  } else {
    const alignedSize = (stringSize + 3) & ~3
    checkMessageSize(message, alignedSize)
    // size -1 to eliminate null byte
    const byteArray = new Uint8Array(
      message.buffer.buffer,
      message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT,
      stringSize - 1,
    )
    message.bufferOffset += alignedSize / 4
    return textDecoder.decode(byteArray)
  }
}

export function s(message: WlMessage): string {
  // {String}
  checkMessageSize(message, 4)
  const stringSize = message.buffer[message.bufferOffset++]

  const alignedSize = (stringSize + 3) & ~3
  checkMessageSize(message, alignedSize)
  // size -1 to eliminate null byte
  const byteArray = new Uint8Array(
    message.buffer.buffer,
    message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT,
    stringSize - 1,
  )
  message.bufferOffset += alignedSize / 4
  return textDecoder.decode(byteArray)
}

export function aOptional(message: WlMessage, optional: boolean): ArrayBuffer | undefined {
  checkMessageSize(message, 4)
  const arraySize = message.buffer[message.bufferOffset++]
  if (arraySize === 0) {
    return undefined
  } else {
    const alignedSize = (arraySize + 3) & ~3
    checkMessageSize(message, alignedSize)
    const arg = message.buffer.buffer.slice(
      message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT,
      message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT + arraySize,
    )
    message.bufferOffset += alignedSize
    return arg
  }
}

export function a(message: WlMessage): ArrayBuffer {
  checkMessageSize(message, 4)
  const arraySize = message.buffer[message.bufferOffset++]

  const alignedSize = (arraySize + 3) & ~3
  checkMessageSize(message, alignedSize)
  const arg = message.buffer.buffer.slice(
    message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT,
    message.buffer.byteOffset + message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT + arraySize,
  )
  message.bufferOffset += alignedSize
  return arg
}

export function h(message: WlMessage): FD {
  // file descriptor {number}
  if (message.fds.length > 0) {
    const webFd = message.fds.shift()
    if (webFd === undefined) {
      throw new Error('No more webfds found in wl message.')
    }
    return webFd
  } else {
    throw new Error('Not enough file descriptors in message object.')
  }
}

export class Connection {
  // FIXME replace wlObjects with an array where newly created elements are added last, this way we can always destroy them in reverse order on client disconnect.
  readonly wlObjects: { [key: number]: WlObject } = {}
  closed = false
  onFlush?: (outMsg: SendMessage[]) => void
  private _outMessages: SendMessage[] = []
  private _inMessages: WlMessage[] = []
  // @ts-ignore
  private onCloseResolve: (value: PromiseLike<void> | void) => void
  readonly onClose = new Promise<void>((resolve) => (this.onCloseResolve = resolve))

  marshallMsg(id: number, opcode: number, size: number, argsArray: MessageMarshallingContext<any, any, any>[]) {
    const wireMsg = {
      buffer: new ArrayBuffer(size),
      fds: [],
      bufferOffset: 0,
    }

    // write actual wire message
    const bufu32 = new Uint32Array(wireMsg.buffer)
    const bufu16 = new Uint16Array(wireMsg.buffer)
    bufu32[0] = id
    bufu16[2] = opcode
    bufu16[3] = size
    wireMsg.bufferOffset = 8

    // write actual argument value to buffer
    argsArray.forEach((arg) => arg._marshallArg(wireMsg))
    this.onSend(wireMsg)
  }

  /**
   * Handle received wire messages.
   */
  async message(incomingWireMessages: { buffer: Uint32Array; fds: Array<FD> }): Promise<void> {
    if (this.closed) {
      return
    }

    // more than one message in queue means the message loop is in await, don't concurrently process the new
    // message, instead return early and let the resume-from-await pick up the newly queued message.
    if (
      this._inMessages.push({
        ...incomingWireMessages,
        bufferOffset: 0,
        consumed: 0,
        size: 0,
      }) > 1
    ) {
      return
    }

    while (this._inMessages.length) {
      this.flush()

      const messagesToProcess = [...this._inMessages]

      for (const wireMessages of messagesToProcess) {
        while (wireMessages.bufferOffset < wireMessages.buffer.length) {
          const id = wireMessages.buffer[wireMessages.bufferOffset]
          const sizeOpcode = wireMessages.buffer[wireMessages.bufferOffset + 1]
          wireMessages.size = sizeOpcode >>> 16
          const opcode = sizeOpcode & 0x0000ffff

          if (wireMessages.size > wireMessages.buffer.byteLength) {
            this.close()
            throw new Error('Request buffer too small')
          }

          const wlObject = this.wlObjects[id]
          if (wlObject === undefined) {
            this.close()
            throw new Error(`invalid object ${id}`)
          }

          wireMessages.bufferOffset += 2
          wireMessages.consumed = 8

          const action = wlObject[opcode]
          if (action === undefined) {
            this.close()
            throw new Error(`invalid opcode ${opcode}`)
          }

          try {
            const promiseOrVoid = action.call(wlObject, wireMessages)
            if (promiseOrVoid instanceof Promise) {
              await promiseOrVoid
            }
          } catch (e: any) {
            console.error(`
wlObject: ${wlObject.constructor.name}[${opcode}](..)
name: ${e.name} message: ${e.message} text: ${e.text}
error object stack:
${e.stack}
`)
            this.close()
            throw e
          }
          if (this.closed) {
            return
          }
        }
      }
      this.flush()

      this._inMessages = this._inMessages.filter((value) => !messagesToProcess.includes(value))
    }
    this.flush()
  }

  /**
   * This doesn't actually send the message, but queues it, so it can be sent on flush.
   */
  onSend(wireMsg: SendMessage) {
    if (this.closed) {
      return
    }
    this._outMessages.push(wireMsg)
  }

  flush() {
    if (this.closed) {
      return
    }
    if (this._outMessages.length === 0) {
      return
    }

    this.onFlush?.(this._outMessages)
    this._outMessages = []
  }

  close() {
    if (this.closed) {
      return
    }

    // destroy resources in descending order
    Object.values(this.wlObjects)
      .sort((a, b) => a.id - b.id)
      .forEach((wlObject) => wlObject.destroy())
    this.closed = true
    this.onCloseResolve()
  }

  registerWlObject(wlObject: WlObject) {
    if (this.closed) {
      return
    }
    if (wlObject.id in this.wlObjects) {
      throw new Error(`Illegal object id: ${wlObject.id}. Already registered.`)
    }
    this.wlObjects[wlObject.id] = wlObject
  }

  unregisterWlObject(wlObject: WlObject) {
    if (this.closed) {
      return
    }
    delete this.wlObjects[wlObject.id]
  }
}
