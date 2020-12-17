import {
  display,
  GrWebShmProxy,
  WlCompositorProxy,
  WlOutputProxy,
  WlSeatProxy,
  WlSurfaceProxy
} from 'westfield-runtime-client'

function createTestClient() {
  const testClient = new TestClient()
  display.getRegistry().listener = {
    global: (name: number, interface_: string, version: number): void => testClient.onGlobal(name, interface_, version),
    globalRemove: (name: number): void => testClient.onGlobalRemove(name)
  }
}

class TestClient {
  compositor?: WlCompositorProxy
  webShm?: GrWebShmProxy
  seat?: WlSeatProxy
  output?: WlOutputProxy
  surface?: WlSurfaceProxy
  globalList?: number[]
  outputList?: WlOutputProxy[]
  bufferCopyDone?: boolean

  onGlobal(name: number, interface_: string, version: number) {

  }

  onGlobalRemove(name: number) {

  }
}

function main() {

}

main()
