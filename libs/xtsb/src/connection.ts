import { unpackFrom } from './struct'
import { GetInputFocusReply, Setup } from './xcb'
import { errors, RequestChecker, Unmarshaller } from './xjsbInternals'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export function chars(chars: string): Int8Array {
  return new Int8Array(textEncoder.encode(chars).buffer)
}

declare global {
  interface Int8Array {
    chars(): string
  }

  interface Uint8Array {
    chars(): string
  }
}

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array

Int8Array.prototype.chars = function () {
  return textDecoder.decode(this)
}

Uint8Array.prototype.chars = function () {
  return textDecoder.decode(this)
}

export function pad(buffer: ArrayBuffer): ArrayBuffer {
  if (buffer.byteLength % 4 === 0) {
    return buffer
  }

  const paddedBuffer = new ArrayBuffer((buffer.byteLength + 3) & ~0x3)
  new Uint8Array(paddedBuffer).set(new Uint8Array(buffer))
  return paddedBuffer
}

export interface XConnectionSocketFactory {
  (xConnectionOptions?: XConnectionOptions): Promise<XConnectionSocket>
}

export interface XConnectionSocket {
  onData?: (data: Uint8Array) => void

  write(data: Uint8Array): void

  close(): void
}

export interface XConnectionOptions {
  display?: string
  xAuthority?: string
}

type ReplyResolver = {
  resolve: (value?: any | PromiseLike<any>) => void
  resolveWithError: (reason?: any) => void
  requestName: string
  sequenceNumber: number
}

const unmarshallGetInputFocusReply: Unmarshaller<GetInputFocusReply> = (buffer, offset = 0) => {
  const [responseType, revertTo, focus] = unpackFrom('<BB2x4xI', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      revertTo,
      focus,
    },
    offset,
  }
}

export class XConnection {
  readonly socket: XConnectionSocket
  readonly setup: Setup

  handleEvent?: (eventType: number, eventSequenceNumber: number, rawEvent: Uint8Array) => Promise<void> | void
  defaultExceptionHandler?: (error: Error) => void
  onPreEventLoop?: () => void
  onPostEventLoop?: () => void
  private readonly unusedIds: number[] = []
  private nextResourceId: number
  private readonly resourceIdShift: number
  private requestSequenceNumber = 0
  private readonly replyResolvers: ReplyResolver[] = []
  private readonly receivedEvents: Uint8Array[] = []
  private sendBuffer: Uint8Array[] = []
  private receiveBuffer: Uint8Array[] = []

  constructor(socket: XConnectionSocket, setup: Setup) {
    this.nextResourceId = 0
    this.resourceIdShift = 0
    this.setup = setup

    while (!((setup.resourceIdMask >> this.resourceIdShift) & 1)) {
      this.resourceIdShift++
    }

    this.socket = socket
    socket.onData = (data) => this.onData(data)
  }

  flush(): void {
    this.sendBuffer.forEach((value) => this.socket.write(value))
    this.sendBuffer = []
  }

  resolveWithError(promise: Promise<any>, reject: (reason?: any) => void, requestName: string, sequenceNumber: number) {
    return (rawError: Uint8Array) => {
      const errorCode = rawError[1]
      const [errorUnmarshaller, ErrorClass] = errors[errorCode]
      const errorBody = errorUnmarshaller(rawError.buffer, rawError.byteOffset)
      const error = new ErrorClass({ error: errorBody.value, requestName, sequenceNumber })
      promise.catch((error: Error) => {
        if (this.defaultExceptionHandler) {
          this.defaultExceptionHandler(error)
        } else {
          throw error
        }
      })
      reject(error)
    }
  }

  allocateID(): number {
    if (this.unusedIds.length > 0) {
      return this.unusedIds.pop() as number
    }
    // TODO: handle overflow (XCMiscGetXIDRange from XC_MISC ext)
    return (++this.nextResourceId << this.resourceIdShift) + this.setup.resourceIdBase
  }

  releaseID(id: number): void {
    this.unusedIds.push(id)
  }

  close(): void {
    this.socket.close()
  }

  sendVoidRequest(
    requestParts: ArrayBuffer[],
    opcode: number,
    minorOpcode: number,
    requestName: string,
  ): RequestChecker {
    const requestBuffer = createRequestBuffer(requestParts)
    requestBuffer[0] = opcode
    if (minorOpcode) {
      requestBuffer[1] = minorOpcode
    }
    new Uint16Array(requestBuffer.buffer, requestBuffer.byteOffset)[1] = new Uint32Array(
      requestBuffer.buffer,
      requestBuffer.byteOffset,
    ).length

    let resolvePromise: (value: void | PromiseLike<void>) => void
    let rejectPromise: (reason?: any) => void
    const voidRequestPromise = new Promise<void>((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })
    this.requestSequenceNumber++
    this.replyResolvers.push({
      // @ts-ignore
      resolve: resolvePromise,
      resolveWithError: this.resolveWithError(
        voidRequestPromise,
        // @ts-ignore
        rejectPromise,
        requestName,
        this.requestSequenceNumber,
      ),
      requestName,
      sequenceNumber: this.requestSequenceNumber,
    })
    this.sendBuffer.push(requestBuffer)

    return {
      [Symbol.toStringTag]: voidRequestPromise[Symbol.toStringTag],
      check: (): Promise<void> => {
        // fire a poor man 'sync' call to ensure the xserver has processed our previous actual call.
        // tslint:disable-next-line:no-floating-promises
        this.sendRequest<GetInputFocusReply>([new ArrayBuffer(4)], 43, unmarshallGetInputFocusReply, 0, 'GetInputFocus')
        return voidRequestPromise
      },
      catch<TResult = never>(
        onrejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null,
      ): Promise<void | TResult> {
        return voidRequestPromise.catch(onrejected)
      },
      then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => PromiseLike<TResult1> | TResult1) | undefined | null,
        onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
      ): Promise<TResult1 | TResult2> {
        return voidRequestPromise.then(onfulfilled, onrejected)
      },
      finally(onfinally?: (() => void) | undefined | null): Promise<void> {
        return voidRequestPromise.finally(onfinally)
      },
    }
  }

  sendRequest<T>(
    requestParts: ArrayBuffer[],
    opcode: number,
    replyUnmarshaller: Unmarshaller<T>,
    minorOpcode: number,
    requestName: string,
  ): Promise<T> {
    const requestBuffer = createRequestBuffer(requestParts)
    requestBuffer[0] = opcode
    if (minorOpcode) {
      requestBuffer[1] = minorOpcode
    }
    new Uint16Array(requestBuffer.buffer, requestBuffer.byteOffset)[1] = new Uint32Array(
      requestBuffer.buffer,
      requestBuffer.byteOffset,
    ).length

    let promiseResolve: (value?: any | PromiseLike<any>) => void
    let promiseReject: (reason?: any) => void
    const promise = new Promise<Uint8Array>((resolve, reject) => {
      promiseResolve = resolve
      promiseReject = reject
    })

    this.requestSequenceNumber++
    this.replyResolvers.push({
      // @ts-ignore
      resolve: promiseResolve,
      // @ts-ignore
      resolveWithError: this.resolveWithError(promise, promiseReject, requestName, this.requestSequenceNumber),
      requestName,
      sequenceNumber: this.requestSequenceNumber,
    })

    this.sendBuffer.push(requestBuffer)
    this.flush()
    return promise.then((rawReply) => replyUnmarshaller(rawReply.buffer, rawReply.byteOffset).value)
  }

  private onData(data: Uint8Array) {
    let offset = 0
    let messages: Uint8Array

    // check if we need to prepend previously received partial data
    if (this.receiveBuffer.length > 0) {
      const length = this.receiveBuffer.reduce(
        (previousValue, currentValue) => previousValue + currentValue.byteLength,
        0,
      )
      const previousData = new Uint8Array(length)
      this.receiveBuffer.forEach((value) => {
        previousData.set(value, offset)
        offset += value.byteLength
      })
      this.receiveBuffer = []
      messages = new Uint8Array(previousData.byteLength + data.byteLength)
      messages.set(previousData, 0)
      messages.set(data, offset)
      offset = 0
    } else {
      messages = data
    }

    const eventPromises: Promise<void>[] = []
    while (messages.byteOffset + offset < messages.byteLength) {
      const bytesRemaining = messages.byteLength - messages.byteOffset
      // check for partial data (we need at least 32 bytes for it to be considered a message
      if (bytesRemaining < 32) {
        this.receiveBuffer.push(new Uint8Array(messages.buffer, messages.byteOffset + offset, bytesRemaining))
        return
      }

      const header = new Uint8Array(messages.buffer, messages.byteOffset + offset, 32)
      const type = header[0]

      if (type === 0) {
        // error
        const length = 32
        const packet = new Uint8Array(messages.buffer, messages.byteOffset + offset, length)
        const replySequenceNumber = packet[2] | (packet[3] << 8)
        this.resolvePreviousReplyResolvers(replySequenceNumber)
        const replyResolver = this.findAndRemoveReplyResolver(replySequenceNumber)
        replyResolver.resolveWithError(packet)
        offset += length
      } else if (type === 1) {
        // reply
        const replySequenceNumber = header[2] | (header[3] << 8)
        const length = 32 + 4 * (header[4] | (header[5] << 8) | (header[6] << 16) | (header[7] << 24))
        // check if we have enough bytes remaining to construct the reply
        if (length > bytesRemaining - offset) {
          this.receiveBuffer.push(
            new Uint8Array(messages.buffer, messages.byteOffset + offset, bytesRemaining - offset),
          )
          return
        }
        this.resolvePreviousReplyResolvers(replySequenceNumber)
        const replyResolver = this.findAndRemoveReplyResolver(replySequenceNumber)
        const packet = new Uint8Array(messages.buffer, messages.byteOffset + offset, length)
        replyResolver.resolve(packet)
        offset += length
      } else {
        // Event
        if (offset === 0 && this.onPreEventLoop) {
          this.onPreEventLoop()
        }
        const length = 32
        const packet = new Uint8Array(messages.buffer, messages.byteOffset + offset, length)
        eventPromises.push(this.onEvent(packet))
        offset += length
      }
    }
    Promise.all(eventPromises).then(() => this.onPostEventLoop?.())
  }

  private async onEvent(packet: Uint8Array) {
    if (this.receivedEvents.push(packet) > 1) {
      return
    }
    if (this.handleEvent === undefined) {
      return
    }

    let nextEvent
    while ((nextEvent = this.receivedEvents[0]) !== undefined) {
      const eventSequenceNumber = packet[2] | (packet[3] << 8)
      const voidOrPromise = this.handleEvent(nextEvent[0], eventSequenceNumber, nextEvent)
      if (voidOrPromise instanceof Promise) {
        await voidOrPromise
      }
      this.receivedEvents.shift()
    }
  }

  private findAndRemoveReplyResolver(replySequenceNumber: number): ReplyResolver {
    const requestNumberOffset = this.requestSequenceNumber - replySequenceNumber
    const replyResolverIndex = this.replyResolvers.length - requestNumberOffset - 1
    const replyResolver = this.replyResolvers[replyResolverIndex]
    this.replyResolvers.splice(replyResolverIndex, 1)
    return replyResolver
  }

  private resolvePreviousReplyResolvers(replySequenceNumber: number) {
    const requestNumberOffset = this.requestSequenceNumber - replySequenceNumber
    const replyResolverIndex = this.replyResolvers.length - requestNumberOffset - 1
    const deletedElements = this.replyResolvers.splice(0, replyResolverIndex)
    for (const previousReplyResolver of deletedElements) {
      previousReplyResolver.resolve()
    }
  }
}

function createRequestBuffer(requestParts: ArrayBuffer[]): Uint8Array {
  const requestSize = requestParts.reduce((previousValue, currentValue) => previousValue + currentValue.byteLength, 0)
  return requestParts.reduce<{ buffer: Uint8Array; offset: number }>(
    ({ buffer, offset }, currentValue) => {
      buffer.set(new Uint8Array(currentValue), offset)
      return { buffer, offset: offset + currentValue.byteLength }
    },
    { buffer: new Uint8Array(requestSize), offset: 0 },
  ).buffer
}

export interface SetupConnection {
  (): Promise<{ setup: Setup; xConnectionSocket: XConnectionSocket }>
}

export async function connect(setupConnection: SetupConnection): Promise<XConnection> {
  const { setup, xConnectionSocket } = await setupConnection()
  return new XConnection(xConnectionSocket, setup)
}
