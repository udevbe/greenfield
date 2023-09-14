import westfieldAddon from './westfield-addon'

export const {
  createDisplay,
  setClientDestroyedCallback,
  setWireMessageCallback,
  setWireMessageEndCallback,
  destroyDisplay,
  addSocketAuto,
  destroyClient,
  sendEvents,
  dispatchRequests,
  flush,
  getFd,
  initShm,
  initDrm,
  setRegistryCreatedCallback,
  setSyncDoneCallback,
  emitGlobals,
  createWlMessage,
  initWlInterface,
  createWlInterface,
  createWlResource,
  destroyWlResourceSilently,
  setupXWayland,
  teardownXWayland,
  setBufferCreatedCallback,
  createMemoryMappedFile,
  getServerObjectIdsBatch,
  makePipe,
  equalValueExternal,
  getXWaylandDisplay,
  getCredentials,
} = westfieldAddon

export type {
  WlClient,
  WlDisplay,
  WlRegistry,
  WlInterface,
  WlMessage,
  WlResource,
  ExternalType,
  DRMHandle,
  XWaylandHandle
} from './westfield-addon'

export type MessageDestination = {
  native: boolean
  browser: boolean
  neverReplies?: boolean
}

export class Fixed {
  static parse(number: number): Fixed {
    return new Fixed((number * 256.0) >> 0)
  }

  /**
   * Represent fixed as a signed 24-bit integer.
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

  /**
   * use parseFixed instead
   */
  constructor(public readonly _raw: number) {}
}

interface WlDisplayInterceptorConstructor {
  new (
    wlClient: unknown,
    interceptors: Record<number, any>,
    version: number,
    wlResource: unknown,
    userData: unknown,
  ): any
}

export class MessageInterceptor {
  static create(
    wlClient: unknown,
    wlDisplay: unknown,
    wlDisplayInterceptorConstructor: WlDisplayInterceptorConstructor,
    userData: unknown,
    interceptors: Record<number, any>,
  ): MessageInterceptor {
    interceptors[1] = new wlDisplayInterceptorConstructor(wlClient, interceptors, 1, wlDisplay, userData)
    return new MessageInterceptor(interceptors)
  }

  constructor(public readonly interceptors: Record<number, any>) {}

  /**
   * @return  where the message should be sent to
   */
  interceptRequest(
    objectId: number,
    opcode: number,
    message: { buffer: ArrayBuffer; fds: number[]; bufferOffset: number; consumed: number; size: number },
  ): MessageDestination {
    const interceptor = this.interceptors[objectId]
    let destination: MessageDestination = {
      native: true,
      browser: false,
    }
    if (interceptor) {
      destination = {
        native: false,
        browser: true,
      }
      const interception = interceptor[`R${opcode}`]
      if (interception) {
        destination = interception.call(interceptor, message)
      }
    }
    return destination
  }

  interceptEvent(
    objectId: number,
    opcode: number,
    message: { buffer: ArrayBuffer; fds: number[]; bufferOffset: number; consumed: number; size: number },
  ) {
    const interceptor = this.interceptors[objectId]
    if (interceptor) {
      const interception = interceptor[`E${opcode}`]
      if (interception) {
        interception.call(interceptor, message)
      }
    }
  }
}

export const nativeGlobalNames: number[] = []
export type WireMessage = { buffer: ArrayBuffer; fds: number[]; bufferOffset: number; consumed: number; size: number }
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ts is lacking TextDecoder as a global in nodejs: https://github.com/microsoft/TypeScript/issues/31535
const textDecoder = new TextDecoder()

function checkMessageSize(wireMsg: WireMessage, consumption: number) {
  if (wireMsg.consumed + consumption > wireMsg.size) {
    throw new Error(`Request too short. Message max. size: ${wireMsg.size}, have: ${wireMsg.consumed + consumption}`)
  } else {
    wireMsg.consumed += consumption
  }
}

const signatureUnmarshalling = {
  u(wireMsg: WireMessage): number {
    // unsigned integer {number}
    const argSize = 4
    checkMessageSize(wireMsg, argSize)

    const arg = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize

    return arg
  },
  i(wireMsg: WireMessage): number {
    // integer {number}
    const argSize = 4
    checkMessageSize(wireMsg, argSize)

    const arg = new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    return arg
  },
  f(wireMsg: WireMessage): Fixed {
    // float {number}
    const argSize = 4
    checkMessageSize(wireMsg, argSize)

    const arg = new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    return new Fixed(arg >> 0)
  },
  o(wireMsg: WireMessage): number {
    const argSize = 4
    checkMessageSize(wireMsg, argSize)

    const arg = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    return arg
  },
  n(wireMsg: WireMessage): number {
    const argSize = 4
    checkMessageSize(wireMsg, argSize)

    const arg = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    return arg
  },
  s(wireMsg: WireMessage, optional: boolean): string | null {
    // {String}
    const argSize = 4
    checkMessageSize(wireMsg, argSize)

    const stringSize = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += 4
    if (optional && stringSize === 0) {
      return null
    } else {
      const alignedSize = (stringSize + 3) & ~3
      checkMessageSize(wireMsg, alignedSize)
      const byteArray = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset, stringSize - 1)
      wireMsg.bufferOffset += alignedSize
      return textDecoder.decode(byteArray)
    }
  },
  a(wireMsg: WireMessage, optional: boolean): ArrayBuffer | null {
    const argSize = 4
    checkMessageSize(wireMsg, argSize)

    const arraySize = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += 4
    if (optional && arraySize === 0) {
      return null
    } else {
      const alignedSize = (arraySize + 3) & ~3
      checkMessageSize(wireMsg, alignedSize)
      const arg = wireMsg.buffer.slice(wireMsg.bufferOffset, wireMsg.bufferOffset + arraySize)
      wireMsg.bufferOffset += alignedSize
      return arg
    }
  },
  h(wireMsg: WireMessage): number {
    if (wireMsg.fds.length) {
      return wireMsg.fds.shift() as number
    } else {
      throw new Error('File descriptor expected.')
    }
  },
} as const

export function unmarshallArgs(
  message: WireMessage,
  argsSignature: string,
): (string | number | Fixed | ArrayBuffer | null)[] {
  const argsSigLength = argsSignature.length
  const args = []
  let optional = false
  for (let i = 0; i < argsSigLength; i++) {
    let signature = argsSignature[i]
    optional = signature === '?'

    if (optional) {
      signature = argsSignature[++i]
    }

    // FIXME either validate each signature character individually (slow) or just assume it's valid and cast it
    args.push(signatureUnmarshalling[signature as keyof typeof signatureUnmarshalling](message, optional))
  }
  return args
}
