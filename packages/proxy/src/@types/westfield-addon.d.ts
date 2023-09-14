declare namespace westfieldAddon {
  export type WlClient = { _client_type: never }
  export type WlDisplay = { _display_type: never }
  export type WlRegistry = { _registry_type: never }
  export type WlInterface = { _interface_type: never }
  export type WlMessage = { _message_type: never }
  export type WlResource = { _resource_type: never }
  export type DRMHandle = { _drm_handle_type: never }
  export type XWaylandHandle = { _xWayland_handle_type: never }
  export type ExternalType =
    | WlClient
    | WlDisplay
    | WlRegistry
    | WlInterface
    | WlMessage
    | WlResource
    | DRMHandle
    | XWaylandHandle

  function createDisplay(
    onClientCreated: (wlClient: WlClient) => void,
    onGlobalCreated: (globalName: number) => void,
    onGlobalDestroyed: (globalName: number) => void,
  ): WlDisplay

  function setClientDestroyedCallback(wlClient: WlClient, onClientDestroyed: (wlClient: WlClient) => void): void

  function setWireMessageCallback(
    wlClient: WlClient,
    onWireMessage: (wlClient: WlClient, wiresMessages: ArrayBuffer, objectId: number, opcode: number) => number,
  ): void

  function setWireMessageEndCallback(
    wlClient: WlClient,
    onWireMessageEnd: (wlClient: WlClient, fdsIn: ArrayBuffer) => void,
  ): void

  function destroyDisplay(wlDisplay: WlDisplay): void

  function addSocketAuto(wlDisplay: WlDisplay): string

  function destroyClient(wlClient: WlClient): void

  function sendEvents(wlClient: WlClient, wireMessages: Uint32Array, fdsOut: Uint32Array): void

  function dispatchRequests(wlDisplay: WlDisplay): void

  function flush(wlClient: WlClient): void

  function getFd(wlDisplay: WlDisplay): number

  function initShm(wlDisplay: WlDisplay): void

  function initDrm(wlDisplay: WlDisplay): DRMHandle

  function setRegistryCreatedCallback(
    wlClient: WlClient,
    onRegistryCreated: (wlRegistry: WlRegistry, registryId: number) => void,
  ): void

  function setSyncDoneCallback(wlClient: WlClient, onSyncDone: (callbackId: number) => void): void

  function emitGlobals(wlRegistry: WlRegistry): void

  function createWlMessage(name: string, signature: string, wlInterfaces: WlInterface[]): WlMessage

  function initWlInterface(
    wlInterface: WlInterface,
    name: string,
    version: number,
    wlMessageRequests: WlMessage[],
    wlMessageEvents: WlMessage[],
  ): void

  function createWlInterface(): WlInterface

  function createWlResource(wlClient: WlClient, id: number, version: number, wlInterface: WlInterface): WlResource

  function destroyWlResourceSilently(wlClient: WlClient, wlResourceId: number): void

  function setupXWayland(
    wlDisplay: WlDisplay,
    onXWaylandStarting: (wmFd: number, wlClient: WlClient) => void,
    onXWaylandDestroyed: () => void,
  ): XWaylandHandle

  function teardownXWayland(westfieldXWayland: XWaylandHandle): void

  function setBufferCreatedCallback(wlClient: WlClient, onBufferCreated: (bufferId: number) => void): void

  function createMemoryMappedFile(contents: Buffer): number

  function getServerObjectIdsBatch(wlClient: WlClient, ids: Uint32Array): void

  function makePipe(resultBuffer: Uint32Array): void

  function equalValueExternal(objectA: ExternalType, objectB: ExternalType): boolean

  function getXWaylandDisplay(xWayland: XWaylandHandle): number

  function getCredentials(wlClient: WlClient, pidUidGid: Uint32Array): void
}

export = westfieldAddon
