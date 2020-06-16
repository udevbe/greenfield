// @ts-ignore
import pixman from './pixman'
// @ts-ignore
import xkbcommon from './xkbcommon'
// @ts-ignore
import libxkbcommonWasm from '../assets/libxkbcommon.wasm.asset'
// @ts-ignore
import libpixmanWasm from '../assets/libpixman.wasm.asset'
// @ts-ignore
import libxkbcommonData from '../assets/libxkbcommon.data.asset'

const assets = {
  'libpixman.wasm': libpixmanWasm,
  'libxkbcommon.data': libxkbcommonData,
  'libxkbcommon.wasm': libxkbcommonWasm
}

// @ts-ignore
const assetLocator = (path: string) => assets[path]

function loadNativeModule (module: { calledRun: any; onRuntimeInitialized: () => void }) {
  return new Promise(resolve => {
    if (module.calledRun) {
      resolve()
    } else {
      module.onRuntimeInitialized = () => resolve()
    }
  })
}

function isWasmSupported () {
  try {
    if (typeof window.WebAssembly === 'object' &&
      typeof window.WebAssembly.instantiate === 'function') {
      const module = new window.WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00))
      if (module instanceof window.WebAssembly.Module) { return new window.WebAssembly.Instance(module) instanceof window.WebAssembly.Instance }
    }
  } catch (e) {}
  return false
}

const lib = {
  pixman: null,
  xkbcommon: null
}

async function init () {
  if (isWasmSupported()) {
    const libpixman = pixman({ locateFile: assetLocator })
    const libxkbcommon = xkbcommon({ locateFile: assetLocator })
    await Promise.all([
      loadNativeModule(libpixman),
      loadNativeModule(libxkbcommon)
    ])

    lib.pixman = libpixman
    lib.xkbcommon = libxkbcommon
  } else {
    throw new Error('WebAssembly is not supported on your browser.')
  }
}

export function isInitialized () {
  return lib.pixman !== null && lib.xkbcommon !== null
}

export { init, lib }
