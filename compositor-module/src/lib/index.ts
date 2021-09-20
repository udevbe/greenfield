// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pixman from './libpixman'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import xkbcommon from './libxkbcommon'

type libpixman = {
  HEAPU8: Uint8Array
  _malloc(bytes: number): number
  _pixman_region32_init(pixmanRegion: number): void
  _pixman_region32_fini(pixmanRegion: number): void
  _pixman_region32_init_rect(pixmanRegion: number, x0: number, y0: number, x1: number, y1: number): void
  _pixman_region32_union(result: number, left: number, right: number): void
  _pixman_region32_intersect(result: number, left: number, right: number): void
  // TODO check if this one is works/is correct?
  _pixman_region32_union_rect(result: number, left: number, x: number, y: number, width: number, height: number): void
  _free(pixmanRegion: number): void
  _pixman_region32_contains_point(pixmanRegion: number, x: number, y: number, box: number | null): number
  _pixman_region32_copy(dest: number, source: number): void
  _pixman_region32_contains_rectangle(region: number, box: number): number
  _pixman_region32_not_empty(region: number): number
  _pixman_region32_equal(region1: number, region2: number): number
  _pixman_region32_rectangles(region: number, nRects: number): number
  _pixman_region32_subtract(regD: number, regM: number, regS: number): void
}

type libxkbcommon = {
  // TODO
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

const lib: {
  pixman: libpixman
  xkbcommon: libxkbcommon
} = {
  // @ts-ignore
  pixman: undefined,
  // @ts-ignore
  xkbcommon: undefined,
}

async function init(): Promise<void> {
  if (isWasmSupported()) {
    const libpixman: Promise<libpixman> = pixman()
    const libxkbcommon: Promise<any> = xkbcommon()

    lib.pixman = await libpixman
    lib.xkbcommon = await libxkbcommon
  } else {
    throw new Error('WebAssembly is not supported on your browser.')
  }
}

export { init, lib }
