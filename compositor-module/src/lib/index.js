import pixman from './pixman'
import xkbcommon from './xkbcommon'
import libxkbcommonWasm from './libxkbcommon.wasm.asset'
import libpixmanWasm from './libpixman.wasm.asset'
import libxkbcommonData from './libxkbcommon.data.asset'

const assets = {
  'libpixman.wasm': libpixmanWasm,
  'libxkbcommon.data': libxkbcommonData,
  'libxkbcommon.wasm': libxkbcommonWasm
}

const assetLocator = path => assets[path]

/**
 * @param {*}module
 */
function loadNativeModule (module) {
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
