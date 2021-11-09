declare module 'westfield-endpoint' {
  export interface MessageInterceptor {
    interceptors: Record<number, unknown>

    interceptEvent(
      objectId: number,
      opcode: number,
      message: {
        consumed: number
        fds: number[]
        bufferOffset: number
        size: number
        buffer: SharedArrayBuffer | ArrayBuffer
      },
    ): void

    interceptRequest(
      objectId: number,
      opcode: number,
      interceptedMessage: { consumed: number; fds: any[]; bufferOffset: number; size: number; buffer: ArrayBuffer },
    ): number
  }

  export const MessageInterceptor: {
    create(
      wlClient: unknown,
      wlDisplay: unknown,
      wl_display_interceptor: unknown,
      userData: unknown,
    ): MessageInterceptor
  }

  export const Endpoint: {
    equalValueExternal(objectA: unknown, objectB: unknown): boolean
    getXWaylandDisplay(xWayland: unknown): number
    setupXWayland(
      wlDisplay: unknown,
      onXWaylandStarting: (wmFd: number, wlClient: unknown) => void,
      onXWaylandDestroyed: () => void,
    ): unknown | undefined
    teardownXWayland(westfieldXWayland: unknown): void
    createMemoryMappedFile(buffer: Buffer): Promise<number>
    makePipe(resultBuffer: Uint32Array): void
    setClientDestroyedCallback(wlClient: unknown, callback: () => void): void
    setRegistryCreatedCallback(wlClient: unknown, callback: (wlRegistry: unknown, registryId: number) => void): void
    setRegistryCreatedCallback(wlClient: unknown, callback: (wlRegistry: unknown, registryId: number) => void): void
    setWireMessageCallback(
      wlClient: unknown,
      callback: (wlClient: unknown, message: ArrayBuffer, objectId: number, opcode: number) => number,
    ): void
    setWireMessageEndCallback(wlClient: unknown, callback: (wlClient: unknown, fdsIn: ArrayBuffer) => void): void
    setBufferCreatedCallback(wlClient: unknown, callback: (bufferId: number) => void): void
    sendEvents(wlClient: unknown, messageBuffer: Uint32Array, fdsBuffer: Uint32Array): void
    flush(wlClient: unknown): void
    getServerObjectIdsBatch(wlClient: unknown, uint32Array: Uint32Array): void
    emitGlobals(wlRegistry: unknown): void
    destroyClient(wlClient: unknown): void
    destroyWlResourceSilently(wlClient: unknown, deleteObjectId: number): void
    getFd(wlDisplay: unknown): number
    dispatchRequests(wlDisplay: unknown): void
    createDisplay(
      clientCreated: (wlClient: unknown) => void,
      globalCreated: (globalName: number) => void,
      globalDestroyed: (globalName: number) => void,
    ): unknown
    addSocketAuto(wlDisplay: unknown): string
    initShm(wlDisplay: unknown): void
    destroyDisplay(wlDisplay: unknown): void
    getShmBuffer(
      wlClient: unknown,
      bufferId: number,
    ): { buffer: Buffer; format: number; width: number; height: number; stride: number }
    shmBeginAccess(wlClient: unknown, bufferId: number): void
    shmEndAccess(wlClient: unknown, bufferId: number): void
  }

  export const WireMessageUtil: {
    unmarshallArgs(
      message: { buffer: ArrayBuffer; fds: Array<number>; bufferOffset: number; consumed: number; size: number },
      oii: string,
    ): any[]
  }

  export const nativeGlobalNames: number[]
}
