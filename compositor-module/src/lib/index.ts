// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pixman from './pixman'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import xkbcommon from './xkbcommon'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import libxkbcommonWasm from '../assets/libxkbcommon.wasm.asset'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import libpixmanWasm from '../assets/libpixman.wasm.asset'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import libxkbcommonData from '../assets/libxkbcommon.data.asset'

const assets = {
  'libpixman.wasm': libpixmanWasm,
  'libxkbcommon.data': libxkbcommonData,
  'libxkbcommon.wasm': libxkbcommonWasm,
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const assetLocator = (path: string) => assets[path]

function loadNativeModule(module: { calledRun: any; onRuntimeInitialized: () => void }) {
  return new Promise<void>((resolve) => {
    if (module.calledRun) {
      resolve()
    } else {
      module.onRuntimeInitialized = () => resolve()
    }
  })
}

function isWasmSupported() {
  try {
    if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00))
      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance
      }
    }
  } catch (e) {}
  return false
}

const lib = {
  pixman: null,
  xkbcommon: null,
}

async function init(): Promise<void> {
  if (isWasmSupported()) {
    const libpixman = pixman({ locateFile: assetLocator })
    const libxkbcommon = xkbcommon({ locateFile: assetLocator })
    await Promise.all([loadNativeModule(libpixman), loadNativeModule(libxkbcommon)])

    lib.pixman = libpixman
    lib.xkbcommon = libxkbcommon
  } else {
    throw new Error('WebAssembly is not supported on your browser.')
  }
}

export function isInitialized(): boolean {
  return lib.pixman !== null && lib.xkbcommon !== null
}

export { init, lib }
