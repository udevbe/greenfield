import { Connection, MessageMarshallingContext, n, object, s, string, u, uint, WlMessage, WlObject } from '@gfld/common'

const SERVER_OBJECT_ID_BASE = 0xff000000

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientUserData {}

/**
 * Represents a client connection.
 */
export class Client implements DisplayRequests {
  userData: ClientUserData = {}
  readonly connection: Connection
  readonly displayResource: DisplayResource
  recycledIds: number[] = []
  // @ts-ignore
  private _destroyedResolver: (value?: PromiseLike<void> | void) => void
  private destroyPromise = new Promise<void>((resolve) => (this._destroyedResolver = resolve))
  private resourceDestroyListeners: ((resource: Resource) => void)[] = []
  private resourceCreatedListeners: ((resource: Resource) => void)[] = []
  /*
   * IDs allocated by the client are in the range [1, 0xfeffffff] while IDs allocated by the server are
   * in the range [0xff000000, 0xffffffff]. The 0 ID is reserved to represent a null or non-existent object
   */
  private _nextId: number = SERVER_OBJECT_ID_BASE

  constructor(
    readonly display: Display,
    readonly id: string,
  ) {
    this.connection = new Connection()
    this.displayResource = new DisplayResource(this, 1, 0)
    this.displayResource.implementation = this

    this.connection.onClose.then(() => this.close())
  }

  close() {
    if (!this.connection.closed) {
      const wlObjects = Object.values(this.connection.wlObjects).sort((a, b) => b.id - a.id)
      for (const wlObject of wlObjects) {
        wlObject.destroy()
      }

      this.connection.close()
      this._destroyedResolver()
    }
  }

  onClose() {
    return this.destroyPromise
  }

  registerResource(resource: Resource) {
    this.connection.registerWlObject(resource)
  }

  unregisterResource(resource: Resource) {
    if (this.connection.closed) {
      return
    }

    this.connection.unregisterWlObject(resource)
    if (resource.id < SERVER_OBJECT_ID_BASE) {
      this.displayResource.deleteId(resource.id)
    } else {
      this.recycledIds.push(resource.id)
    }
    this.resourceDestroyListeners.forEach((listener) => listener(resource))
  }

  addResourceCreatedListener(listener: (resource: Resource) => void) {
    this.resourceCreatedListeners.push(listener)
  }

  removeResourceCreatedListener(listener: (resource: Resource) => void) {
    const idx = this.resourceCreatedListeners.indexOf(listener)
    if (idx !== -1) {
      this.resourceCreatedListeners.splice(idx, 1)
    }
  }

  addResourceDestroyListener(listener: (resource: Resource) => void) {
    this.resourceDestroyListeners.push(listener)
  }

  removeResourceDestroyListener(listener: (resource: Resource) => void) {
    const idx = this.resourceDestroyListeners.indexOf(listener)
    if (idx !== -1) {
      this.resourceDestroyListeners.splice(idx, 1)
    }
  }

  marshallConstructor(id: number, opcode: number, argsArray: MessageMarshallingContext<any, any, any>[]): number {
    // determine required wire message length
    let size = 4 + 2 + 2 // id+size+opcode
    const serverSideId = this.getNextId()
    argsArray.forEach((arg) => {
      if (arg.type === 'n') {
        arg.value = serverSideId
      }
      size += arg.size // add size of the actual argument values
    })

    this.connection.marshallMsg(id, opcode, size, argsArray)
    return serverSideId
  }

  marshall(id: number, opcode: number, argsArray: MessageMarshallingContext<any, any, any>[]) {
    // determine required wire message length
    let size = 4 + 2 + 2 // id+size+opcode
    argsArray.forEach((arg) => (size += arg.size))
    this.connection.marshallMsg(id, opcode, size, argsArray)
  }

  sync(resource: DisplayResource, id: number) {
    const syncCallbackResource = new SyncCallbackResource(resource.client, id, 1)
    syncCallbackResource.done(resource.client.display.eventSerial)
    syncCallbackResource.destroy()
  }

  getRegistry(resource: DisplayResource, id: number) {
    this.display.registry.publishGlobals(this.display.registry.createRegistryResource(this, id))
  }

  getNextId() {
    if (this.recycledIds.length) {
      return this.recycledIds.shift()!
    } else {
      return this._nextId++
    }
  }
}

export class Resource extends WlObject {
  readonly client: Client
  readonly version: number

  constructor(client: Client, id: number, version: number) {
    super(id)
    this.client = client
    this.version = version
    this.client.registerResource(this)
  }

  postError(code: number, msg: string) {
    console.error(`Protocol error. client: ${this.client.id}, resource: ${this.id}, code: ${code}, message: ${msg}`)
    this.client.displayResource.error(this, code, msg)
  }

  destroy() {
    super.destroy()
    this.client.unregisterResource(this)
  }
}

export class Display {
  readonly registry: Registry = new Registry()
  readonly clients: { [key: string]: Client } = {}
  readonly onclientcreated?: (clienet: Client) => void
  readonly onclientdestroyed?: (client: Client) => void
  private _eventSerial = 0

  createClient(clientId: string) {
    const client = new Client(this, clientId)
    client.onClose().then(() => {
      this.onclientdestroyed?.(client)
      delete this.clients[client.id]
    })
    this.clients[client.id] = client
    this.onclientcreated?.(client)
    return client
  }

  flushClients() {
    Object.values(this.clients).forEach((client) => client.connection.flush())
  }

  nextEventSerial(): number {
    return ++this._eventSerial
  }

  get eventSerial(): number {
    return this._eventSerial
  }
}

export interface DisplayRequests {
  sync(resource: DisplayResource, id: number): void

  getRegistry(resource: DisplayResource, id: number): void
}

export class DisplayResource extends Resource {
  implementation?: DisplayRequests

  constructor(client: Client, id: number, version: number) {
    super(client, id, version)
  }

  /**
   * opcode 0 -> sync
   *
   */
  [0](message: WlMessage) {
    this.implementation?.sync(this, n(message))
  }

  /**
   * opcode 1 -> getRegistry
   *
   */
  [1](message: WlMessage) {
    this.implementation?.getRegistry(this, n(message))
  }

  /**
   *  The error event is sent out when a fatal (non-recoverable)
   *  error has occurred.  The object_id argument is the object
   *  where the error occurred, most often in response to a request
   *  to that object.  The code identifies the error and is defined
   *  by the object interface.  As such, each interface defines its
   *  own set of error codes.  The message is a brief description
   *  of the error, for (debugging) convenience.
   *
   * @param errorObject object where the error occurred
   * @param code error code
   * @param message error description
   */
  error(errorObject: Resource, code: number, message: string) {
    this.client.marshall(this.id, 0, [object(errorObject), uint(code), string(message)])
    this.client.connection.flush()
    this.client.connection.close()
  }

  /**
   *  This event is used internally by the object ID management
   *  logic.  When a client deletes an object, the server will send
   *  this event to acknowledge that it has seen the delete request.
   *  When the client receives this event, it will know that it can
   *  safely reuse the object ID.
   *
   * @param id deleted object ID
   */
  deleteId(id: number) {
    this.client.marshall(this.id, 1, [uint(id)])
  }
}

export class Global {
  readonly registry: Registry
  readonly implementation: any
  readonly interface_: string
  readonly version: number
  readonly name: number

  private readonly _bindCallback: (client: Client, id: number, version: number) => void

  /**
   * Use Registry.createGlobal(..) instead.
   */
  constructor(
    registry: Registry,
    implementation: any,
    interface_: string,
    version: number,
    name: number,
    bindCallback: (client: Client, id: number, version: number) => void,
  ) {
    this.registry = registry
    this.implementation = implementation
    this._bindCallback = bindCallback
    this.interface_ = interface_
    this.version = version
    this.name = name
  }

  /**
   *
   * Invoked when a client binds to this global. Subclasses implement this method so they can instantiate a
   * corresponding Resource subtype.
   *
   */
  bindClient(client: Client, id: number, version: number) {
    this._bindCallback(client, id, version)
  }

  destroy() {
    if (this.registry) {
      this.registry.destroyGlobal(this)
    }
  }
}

export class Registry implements RegistryRequests {
  private _registryResources: RegistryResource[] = []
  private _globals: { [key: number]: Global } = {}
  private _nextGlobalName = 0xffff0000

  /**
   * Register a global to make it available to clients
   */
  createGlobal(
    implementation: any,
    interface_: string,
    version: number,
    bindCallback: (client: Client, id: number, version: number) => void,
  ): Global {
    const name = ++this._nextGlobalName
    const global = new Global(this, implementation, interface_, version, name, bindCallback)
    this._globals[name] = global
    this._registryResources.forEach((registryResource) =>
      registryResource.global(global.name, global.interface_, global.version),
    )
    return global
  }

  /**
   * Unregister a global and revoke it from clients.
   *
   */
  destroyGlobal(global: Global) {
    if (this._globals[global.name]) {
      this._registryResources.forEach((registryResource) => registryResource.globalRemove(global.name))
      setTimeout(() => {
        delete this._globals[global.name]
      }, 5000)
    }
  }

  publishGlobals(registryResource: RegistryResource) {
    Object.entries(this._globals).forEach(([name, global]) =>
      registryResource.global(Number.parseInt(name), global.interface_, global.version),
    )
  }

  createRegistryResource(client: Client, id: number): RegistryResource {
    const registryResource = new RegistryResource(client, id, 1)
    registryResource.implementation = this
    this._registryResources.push(registryResource)
    return registryResource
  }

  /**
   * Binds a new, client-created object to the server using the
   * specified name as the identifier.
   */
  bind(client: Client, resource: RegistryResource, name: number, interface_: string, version: number, id: number) {
    this._globals[name].bindClient(client, id, version)
  }
}

export interface RegistryRequests {
  /**
   *  Binds a new, client-created object to the server using the
   * specified name as the identifier.
   */
  bind(client: Client, resource: RegistryResource, name: number, interface_: string, version: number, id: number): void
}

export class RegistryResource extends Resource {
  implementation?: RegistryRequests

  constructor(client: Client, id: number, version: number) {
    super(client, id, version)
  }

  global(name: number, interface_: string, version: number) {
    this.client.marshall(this.id, 0, [uint(name), string(interface_), uint(version)])
  }

  /**
   * Notify the client that the global with the given name id is removed.
   */
  globalRemove(name: number) {
    this.client.marshall(this.id, 1, [uint(name)])
  }

  /**
   * opcode 0 -> bind
   *
   */
  [0](message: WlMessage) {
    this.implementation?.bind(this.client, this, u(message), s(message), u(message), n(message))
  }
}

export class SyncCallbackResource extends Resource {
  constructor(client: Client, id: number, version: number) {
    super(client, id, version)
  }

  /**
   *
   * Notify the client when the related request is done.
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
}
