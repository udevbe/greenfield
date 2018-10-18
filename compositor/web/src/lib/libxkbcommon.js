let Module = function (Module) {
  const FS = null
  const ERRNO_CODES = null
  Module = Module || {}

  var Module = typeof Module !== 'undefined' ? Module : {}
  Module['ENVIRONMENT'] = 'WEB'
  let moduleOverrides = {}
  let key
  for (key in Module) {
    if (Module.hasOwnProperty(key)) {
      moduleOverrides[key] = Module[key]
    }
  }
  Module['arguments'] = []
  Module['thisProgram'] = './this.program'
  Module['quit'] = (function (status, toThrow) {
    throw toThrow
  })
  Module['preRun'] = []
  Module['postRun'] = []
  let ENVIRONMENT_IS_WEB = false
  let ENVIRONMENT_IS_WORKER = false
  if (Module['ENVIRONMENT']) {
    if (Module['ENVIRONMENT'] === 'WEB') {
      ENVIRONMENT_IS_WEB = true
    } else if (Module['ENVIRONMENT'] === 'WORKER') {
      ENVIRONMENT_IS_WORKER = true
    } else {
      throw new Error('Module[\'ENVIRONMENT\'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.')
    }
  } else {
    ENVIRONMENT_IS_WEB = typeof window === 'object'
    ENVIRONMENT_IS_WORKER = typeof importScripts === 'function'
  }
  if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    Module['read'] = function shell_read (url) {
      const xhr = new XMLHttpRequest
      xhr.open('GET', url, false)
      xhr.send(null)
      return xhr.responseText
    }
    if (ENVIRONMENT_IS_WORKER) {
      Module['readBinary'] = function readBinary (url) {
        const xhr = new XMLHttpRequest
        xhr.open('GET', url, false)
        xhr.responseType = 'arraybuffer'
        xhr.send(null)
        return new Uint8Array(xhr.response)
      }
    }
    Module['readAsync'] = function readAsync (url, onload, onerror) {
      const xhr = new XMLHttpRequest
      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function xhr_onload () {
        if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
          onload(xhr.response)
          return
        }
        onerror()
      }
      xhr.onerror = onerror
      xhr.send(null)
    }
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments
    }
    Module['setWindowTitle'] = (function (title) {
      document.title = title
    })
  }
  Module['print'] = console.log.bind(console)
  Module['printErr'] = console.warn.bind(console) || Module['print']
  Module.print = Module['print']
  Module.printErr = Module['printErr']
  for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
      Module[key] = moduleOverrides[key]
    }
  }
  moduleOverrides = undefined
  const STACK_ALIGN = 16

  function staticAlloc (size) {
    assert(!staticSealed)
    const ret = STATICTOP
    STATICTOP = STATICTOP + size + 15 & -16
    return ret
  }

  function alignMemory (size, factor) {
    if (!factor) factor = STACK_ALIGN
    const ret = size = Math.ceil(size / factor) * factor
    return ret
  }

  const functionPointers = new Array(0)
  const GLOBAL_BASE = 1024
  let ABORT = 0
  let EXITSTATUS = 0

  function assert (condition, text) {
    if (!condition) {
      abort('Assertion failed: ' + text)
    }
  }

  function Pointer_stringify (ptr, length) {
    if (length === 0 || !ptr) return ''
    let hasUtf = 0
    let t
    let i = 0
    while (1) {
      t = HEAPU8[ptr + i >> 0]
      hasUtf |= t
      if (t == 0 && !length) break
      i++
      if (length && i == length) break
    }
    if (!length) length = i
    let ret = ''
    if (hasUtf < 128) {
      const MAX_CHUNK = 1024
      let curr
      while (length > 0) {
        curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)))
        ret = ret ? ret + curr : curr
        ptr += MAX_CHUNK
        length -= MAX_CHUNK
      }
      return ret
    }
    return UTF8ToString(ptr)
  }

  const UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined

  function UTF8ArrayToString (u8Array, idx) {
    let endPtr = idx
    while (u8Array[endPtr]) ++endPtr
    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
      return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
    } else {
      let u0, u1, u2, u3, u4, u5
      let str = ''
      while (1) {
        u0 = u8Array[idx++]
        if (!u0) return str
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0)
          continue
        }
        u1 = u8Array[idx++] & 63
        if ((u0 & 224) == 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1)
          continue
        }
        u2 = u8Array[idx++] & 63
        if ((u0 & 240) == 224) {
          u0 = (u0 & 15) << 12 | u1 << 6 | u2
        } else {
          u3 = u8Array[idx++] & 63
          if ((u0 & 248) == 240) {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3
          } else {
            u4 = u8Array[idx++] & 63
            if ((u0 & 252) == 248) {
              u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4
            } else {
              u5 = u8Array[idx++] & 63
              u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5
            }
          }
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0)
        } else {
          const ch = u0 - 65536
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
        }
      }
    }
  }

  function UTF8ToString (ptr) {
    return UTF8ArrayToString(HEAPU8, ptr)
  }

  function stringToUTF8Array (str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0
    const startIdx = outIdx
    const endIdx = outIdx + maxBytesToWrite - 1
    for (let i = 0; i < str.length; ++i) {
      let u = str.charCodeAt(i)
      if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023
      if (u <= 127) {
        if (outIdx >= endIdx) break
        outU8Array[outIdx++] = u
      } else if (u <= 2047) {
        if (outIdx + 1 >= endIdx) break
        outU8Array[outIdx++] = 192 | u >> 6
        outU8Array[outIdx++] = 128 | u & 63
      } else if (u <= 65535) {
        if (outIdx + 2 >= endIdx) break
        outU8Array[outIdx++] = 224 | u >> 12
        outU8Array[outIdx++] = 128 | u >> 6 & 63
        outU8Array[outIdx++] = 128 | u & 63
      } else if (u <= 2097151) {
        if (outIdx + 3 >= endIdx) break
        outU8Array[outIdx++] = 240 | u >> 18
        outU8Array[outIdx++] = 128 | u >> 12 & 63
        outU8Array[outIdx++] = 128 | u >> 6 & 63
        outU8Array[outIdx++] = 128 | u & 63
      } else if (u <= 67108863) {
        if (outIdx + 4 >= endIdx) break
        outU8Array[outIdx++] = 248 | u >> 24
        outU8Array[outIdx++] = 128 | u >> 18 & 63
        outU8Array[outIdx++] = 128 | u >> 12 & 63
        outU8Array[outIdx++] = 128 | u >> 6 & 63
        outU8Array[outIdx++] = 128 | u & 63
      } else {
        if (outIdx + 5 >= endIdx) break
        outU8Array[outIdx++] = 252 | u >> 30
        outU8Array[outIdx++] = 128 | u >> 24 & 63
        outU8Array[outIdx++] = 128 | u >> 18 & 63
        outU8Array[outIdx++] = 128 | u >> 12 & 63
        outU8Array[outIdx++] = 128 | u >> 6 & 63
        outU8Array[outIdx++] = 128 | u & 63
      }
    }
    outU8Array[outIdx] = 0
    return outIdx - startIdx
  }

  function stringToUTF8 (str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
  }

  function lengthBytesUTF8 (str) {
    let len = 0
    for (let i = 0; i < str.length; ++i) {
      let u = str.charCodeAt(i)
      if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023
      if (u <= 127) {
        ++len
      } else if (u <= 2047) {
        len += 2
      } else if (u <= 65535) {
        len += 3
      } else if (u <= 2097151) {
        len += 4
      } else if (u <= 67108863) {
        len += 5
      } else {
        len += 6
      }
    }
    return len
  }

  const UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined

  function allocateUTF8 (str) {
    const size = lengthBytesUTF8(str) + 1
    const ret = _malloc(size)
    if (ret) stringToUTF8Array(str, HEAP8, ret, size)
    return ret
  }

  const PAGE_SIZE = 16384
  const WASM_PAGE_SIZE = 65536
  const ASMJS_PAGE_SIZE = 16777216

  function alignUp (x, multiple) {
    if (x % multiple > 0) {
      x += multiple - x % multiple
    }
    return x
  }

  var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64

  function updateGlobalBuffer (buf) {
    Module['buffer'] = buffer = buf
  }

  function updateGlobalBufferViews () {
    Module['HEAP8'] = HEAP8 = new Int8Array(buffer)
    Module['HEAP16'] = HEAP16 = new Int16Array(buffer)
    Module['HEAP32'] = HEAP32 = new Int32Array(buffer)
    Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer)
    Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer)
    Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer)
    Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer)
    Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer)
  }

  var STATIC_BASE, STATICTOP, staticSealed
  let STACK_BASE, STACKTOP, STACK_MAX
  let DYNAMIC_BASE, DYNAMICTOP_PTR
  STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0
  staticSealed = false

  function abortOnCannotGrowMemory () {
    abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ')
  }

  function enlargeMemory () {
    abortOnCannotGrowMemory()
  }

  const TOTAL_STACK = Module['TOTAL_STACK'] || 5242880
  var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216
  if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr('TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')')
  if (Module['buffer']) {
    buffer = Module['buffer']
  } else {
    if (typeof window.WebAssembly === 'object' && typeof window.WebAssembly.Memory === 'function') {
      Module['wasmMemory'] = new window.WebAssembly.Memory({
        'initial': TOTAL_MEMORY / WASM_PAGE_SIZE,
        'maximum': TOTAL_MEMORY / WASM_PAGE_SIZE
      })
      buffer = Module['wasmMemory'].buffer
    } else {
      buffer = new ArrayBuffer(TOTAL_MEMORY)
    }
    Module['buffer'] = buffer
  }
  updateGlobalBufferViews()

  function getTotalMemory () {
    return TOTAL_MEMORY
  }

  HEAP32[0] = 1668509029
  HEAP16[1] = 25459
  if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw 'Runtime error: expected the system to be little-endian!'

  function callRuntimeCallbacks (callbacks) {
    while (callbacks.length > 0) {
      let callback = callbacks.shift()
      if (typeof callback == 'function') {
        callback()
        continue
      }
      let func = callback.func
      if (typeof func === 'number') {
        if (callback.arg === undefined) {
          Module['dynCall_v'](func)
        } else {
          Module['dynCall_vi'](func, callback.arg)
        }
      } else {
        func(callback.arg === undefined ? null : callback.arg)
      }
    }
  }

  const __ATPRERUN__ = []
  const __ATINIT__ = []
  const __ATMAIN__ = []
  const __ATEXIT__ = []
  const __ATPOSTRUN__ = []
  let runtimeInitialized = false
  let runtimeExited = false

  function preRun () {
    if (Module['preRun']) {
      if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']]
      while (Module['preRun'].length) {
        addOnPreRun(Module['preRun'].shift())
      }
    }
    callRuntimeCallbacks(__ATPRERUN__)
  }

  function ensureInitRuntime () {
    if (runtimeInitialized) return
    runtimeInitialized = true
    callRuntimeCallbacks(__ATINIT__)
  }

  function preMain () {
    callRuntimeCallbacks(__ATMAIN__)
  }

  function exitRuntime () {
    callRuntimeCallbacks(__ATEXIT__)
    runtimeExited = true
  }

  function postRun () {
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']]
      while (Module['postRun'].length) {
        addOnPostRun(Module['postRun'].shift())
      }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
  }

  function addOnPreRun (cb) {
    __ATPRERUN__.unshift(cb)
  }

  function addOnPostRun (cb) {
    __ATPOSTRUN__.unshift(cb)
  }

  function writeAsciiToMemory (str, buffer, dontAddNull) {
    for (let i = 0; i < str.length; ++i) {
      HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull) HEAP8[buffer >> 0] = 0
  }

  const Math_abs = Math.abs
  const Math_cos = Math.cos
  const Math_sin = Math.sin
  const Math_tan = Math.tan
  const Math_acos = Math.acos
  const Math_asin = Math.asin
  const Math_atan = Math.atan
  const Math_atan2 = Math.atan2
  const Math_exp = Math.exp
  const Math_log = Math.log
  const Math_sqrt = Math.sqrt
  const Math_ceil = Math.ceil
  const Math_floor = Math.floor
  const Math_pow = Math.pow
  const Math_imul = Math.imul
  const Math_fround = Math.fround
  const Math_round = Math.round
  const Math_min = Math.min
  const Math_max = Math.max
  const Math_clz32 = Math.clz32
  const Math_trunc = Math.trunc
  let runDependencies = 0
  let runDependencyWatcher = null
  let dependenciesFulfilled = null

  function addRunDependency (id) {
    runDependencies++
    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies)
    }
  }

  function removeRunDependency (id) {
    runDependencies--
    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies)
    }
    if (runDependencies == 0) {
      if (runDependencyWatcher !== null) {
        clearInterval(runDependencyWatcher)
        runDependencyWatcher = null
      }
      if (dependenciesFulfilled) {
        const callback = dependenciesFulfilled
        dependenciesFulfilled = null
        callback()
      }
    }
  }

  Module['preloadedImages'] = {}
  Module['preloadedAudios'] = {}
  const dataURIPrefix = 'data:application/octet-stream;base64,'

  function isDataURI (filename) {
    return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
  }

  function integrateWasmJS () {
    let wasmTextFile = 'libxkbcommon.wast'
    let wasmBinaryFile = 'libxkbcommon.wasm'
    let asmjsCodeFile = 'libxkbcommon.temp.asm.js'
    if (typeof Module['locateFile'] === 'function') {
      if (!isDataURI(wasmTextFile)) {
        wasmTextFile = Module['locateFile'](wasmTextFile)
      }
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = Module['locateFile'](wasmBinaryFile)
      }
      if (!isDataURI(asmjsCodeFile)) {
        asmjsCodeFile = Module['locateFile'](asmjsCodeFile)
      }
    }
    const wasmPageSize = 64 * 1024
    const info = {
      'global': null,
      'env': null,
      'asm2wasm': {
        'f64-rem': (function (x, y) {
          return x % y
        }),
        'debugger': (function () {
          debugger
        })
      },
      'parent': Module
    }
    let exports = null

    function mergeMemory (newBuffer) {
      const oldBuffer = Module['buffer']
      if (newBuffer.byteLength < oldBuffer.byteLength) {
        Module['printErr']('the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here')
      }
      const oldView = new Int8Array(oldBuffer)
      const newView = new Int8Array(newBuffer)
      newView.set(oldView)
      updateGlobalBuffer(newBuffer)
      updateGlobalBufferViews()
    }

    function fixImports (imports) {
      return imports
    }

    function getBinary () {
      try {
        if (Module['wasmBinary']) {
          return new Uint8Array(Module['wasmBinary'])
        }
        if (Module['readBinary']) {
          return Module['readBinary'](wasmBinaryFile)
        } else {
          throw 'on the web, we need the wasm binary to be preloaded and set on Module[\'wasmBinary\']. emcc.py will do that for you when generating HTML (but not JS)'
        }
      } catch (err) {
        abort(err)
      }
    }

    function getBinaryPromise () {
      if (!Module['wasmBinary'] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
        return fetch(wasmBinaryFile, {
          credentials: 'same-origin'
        }).then((function (response) {
          if (!response['ok']) {
            throw 'failed to load wasm binary file at \'' + wasmBinaryFile + '\''
          }
          return response['arrayBuffer']()
        })).catch((function () {
          return getBinary()
        }))
      }
      return new Promise((function (resolve, reject) {
        resolve(getBinary())
      }))
    }

    function doNativeWasm (global, env, providedBuffer) {
      if (typeof window.WebAssembly !== 'object') {
        Module['printErr']('no native wasm support detected')
        return false
      }
      if (!(Module['wasmMemory'] instanceof window.WebAssembly.Memory)) {
        Module['printErr']('no native wasm Memory in use')
        return false
      }
      env['memory'] = Module['wasmMemory']
      info['global'] = {
        'NaN': NaN,
        'Infinity': Infinity
      }
      info['global.Math'] = Math
      info['env'] = env

      function receiveInstance (instance, module) {
        exports = instance.exports
        if (exports.memory) mergeMemory(exports.memory)
        Module['asm'] = exports
        Module['usingWasm'] = true
        removeRunDependency('wasm-instantiate')
      }

      addRunDependency('wasm-instantiate')
      if (Module['instantiateWasm']) {
        try {
          return Module['instantiateWasm'](info, receiveInstance)
        } catch (e) {
          Module['printErr']('Module.instantiateWasm callback failed with error: ' + e)
          return false
        }
      }

      function receiveInstantiatedSource (output) {
        receiveInstance(output['instance'], output['module'])
      }

      function instantiateArrayBuffer (receiver) {
        getBinaryPromise().then((function (binary) {
          return window.WebAssembly.instantiate(binary, info)
        })).then(receiver).catch((function (reason) {
          Module['printErr']('failed to asynchronously prepare wasm: ' + reason)
          abort(reason)
        }))
      }

      if (!Module['wasmBinary'] && typeof window.WebAssembly.instantiateStreaming === 'function' && !isDataURI(wasmBinaryFile) && typeof fetch === 'function') {
        window.WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
          credentials: 'same-origin'
        }), info).then(receiveInstantiatedSource).catch((function (reason) {
          Module['printErr']('wasm streaming compile failed: ' + reason)
          Module['printErr']('falling back to ArrayBuffer instantiation')
          instantiateArrayBuffer(receiveInstantiatedSource)
        }))
      } else {
        instantiateArrayBuffer(receiveInstantiatedSource)
      }
      return {}
    }

    Module['asmPreload'] = Module['asm']
    const asmjsReallocBuffer = Module['reallocBuffer']
    const wasmReallocBuffer = (function (size) {
      const PAGE_MULTIPLE = Module['usingWasm'] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE
      size = alignUp(size, PAGE_MULTIPLE)
      const old = Module['buffer']
      const oldSize = old.byteLength
      if (Module['usingWasm']) {
        try {
          const result = Module['wasmMemory'].grow((size - oldSize) / wasmPageSize)
          if (result !== (-1 | 0)) {
            return Module['buffer'] = Module['wasmMemory'].buffer
          } else {
            return null
          }
        } catch (e) {
          return null
        }
      }
    })
    Module['reallocBuffer'] = (function (size) {
      if (finalMethod === 'asmjs') {
        return asmjsReallocBuffer(size)
      } else {
        return wasmReallocBuffer(size)
      }
    })
    var finalMethod = ''
    Module['asm'] = (function (global, env, providedBuffer) {
      env = fixImports(env)
      if (!env['table']) {
        let TABLE_SIZE = Module['wasmTableSize']
        if (TABLE_SIZE === undefined) TABLE_SIZE = 1024
        const MAX_TABLE_SIZE = Module['wasmMaxTableSize']
        if (typeof window.WebAssembly === 'object' && typeof window.WebAssembly.Table === 'function') {
          if (MAX_TABLE_SIZE !== undefined) {
            env['table'] = new window.WebAssembly.Table({
              'initial': TABLE_SIZE,
              'maximum': MAX_TABLE_SIZE,
              'element': 'anyfunc'
            })
          } else {
            env['table'] = new window.WebAssembly.Table({
              'initial': TABLE_SIZE,
              element: 'anyfunc'
            })
          }
        } else {
          env['table'] = new Array(TABLE_SIZE)
        }
        Module['wasmTable'] = env['table']
      }
      if (!env['memoryBase']) {
        env['memoryBase'] = Module['STATIC_BASE']
      }
      if (!env['tableBase']) {
        env['tableBase'] = 0
      }
      let exports
      exports = doNativeWasm(global, env, providedBuffer)
      if (!exports) abort('no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods')
      return exports
    })
  }

  integrateWasmJS()
  STATIC_BASE = GLOBAL_BASE
  STATICTOP = STATIC_BASE + 101600
  __ATINIT__.push()
  const STATIC_BUMP = 101600
  Module['STATIC_BASE'] = STATIC_BASE
  Module['STATIC_BUMP'] = STATIC_BUMP
  STATICTOP += 16

  function ___assert_fail (condition, filename, line, func) {
    abort('Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'])
  }

  function ___lock () {}

  const SYSCALLS = {
    varargs: 0,
    get: (function (varargs) {
      SYSCALLS.varargs += 4
      const ret = HEAP32[SYSCALLS.varargs - 4 >> 2]
      return ret
    }),
    getStr: (function () {
      const ret = Pointer_stringify(SYSCALLS.get())
      return ret
    }),
    get64: (function () {
      const low = SYSCALLS.get(), high = SYSCALLS.get()
      if (low >= 0) assert(high === 0)
      else assert(high === -1)
      return low
    }),
    getZero: (function () {
      assert(SYSCALLS.get() === 0)
    })
  }

  function ___syscall140 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(),
        result = SYSCALLS.get(), whence = SYSCALLS.get()
      const offset = offset_low
      FS.llseek(stream, offset, whence)
      HEAP32[result >> 2] = stream.position
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null
      return 0
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall145 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get()
      return SYSCALLS.doReadv(stream, iov, iovcnt)
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall146 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get()
      let ret = 0
      if (!___syscall146.buffers) {
        ___syscall146.buffers = [null, [], []]
        ___syscall146.printChar = (function (stream, curr) {
          const buffer = ___syscall146.buffers[stream]
          assert(buffer)
          if (curr === 0 || curr === 10) {
            (stream === 1 ? Module['print'] : Module['printErr'])(UTF8ArrayToString(buffer, 0))
            buffer.length = 0
          } else {
            buffer.push(curr)
          }
        })
      }
      for (let i = 0; i < iovcnt; i++) {
        const ptr = HEAP32[iov + i * 8 >> 2]
        const len = HEAP32[iov + (i * 8 + 4) >> 2]
        for (let j = 0; j < len; j++) {
          ___syscall146.printChar(stream, HEAPU8[ptr + j])
        }
        ret += len
      }
      return ret
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall192 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const addr = SYSCALLS.get(), len = SYSCALLS.get(), prot = SYSCALLS.get(), flags = SYSCALLS.get(),
        fd = SYSCALLS.get()
      let off = SYSCALLS.get()
      off <<= 12
      let ptr
      let allocated = false
      if (fd === -1) {
        ptr = _memalign(PAGE_SIZE, len)
        if (!ptr) return -ERRNO_CODES.ENOMEM
        _memset(ptr, 0, len)
        allocated = true
      } else {
        let info = FS.getStream(fd)
        if (!info) return -ERRNO_CODES.EBADF
        const res = FS.mmap(info, HEAPU8, addr, len, off, prot, flags)
        ptr = res.ptr
        allocated = res.allocated
      }
      SYSCALLS.mappings[ptr] = {
        malloc: ptr,
        len: len,
        allocated: allocated,
        fd: fd,
        flags: flags
      }
      return ptr
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall195 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const path = SYSCALLS.getStr(), buf = SYSCALLS.get()
      return SYSCALLS.doStat(FS.stat, path, buf)
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall197 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get()
      return SYSCALLS.doStat(FS.stat, stream.path, buf)
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___setErrNo (value) {
    if (Module['___errno_location']) HEAP32[Module['___errno_location']() >> 2] = value
    return value
  }

  function ___syscall221 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      return 0
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall5 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const pathname = SYSCALLS.getStr(), flags = SYSCALLS.get(), mode = SYSCALLS.get()
      const stream = FS.open(pathname, flags, mode)
      return stream.fd
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall54 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      return 0
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall6 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const stream = SYSCALLS.getStreamFromFD()
      FS.close(stream)
      return 0
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___syscall91 (which, varargs) {
    SYSCALLS.varargs = varargs
    try {
      const addr = SYSCALLS.get(), len = SYSCALLS.get()
      let info = SYSCALLS.mappings[addr]
      if (!info) return 0
      if (len === info.len) {
        const stream = FS.getStream(info.fd)
        SYSCALLS.doMsync(addr, stream, len, info.flags)
        FS.munmap(stream)
        SYSCALLS.mappings[addr] = null
        if (info.allocated) {
          _free(info.malloc)
        }
      }
      return 0
    } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e)
      return -e.errno
    }
  }

  function ___unlock () {}

  function _abort () {
    Module['abort']()
  }

  const _environ = STATICTOP
  STATICTOP += 16

  function ___buildEnvironment (env) {
    const MAX_ENV_VALUES = 64
    const TOTAL_ENV_SIZE = 1024
    let poolPtr
    let envPtr
    if (!___buildEnvironment.called) {
      ___buildEnvironment.called = true
      ENV['USER'] = ENV['LOGNAME'] = 'web_user'
      ENV['PATH'] = '/'
      ENV['PWD'] = '/'
      ENV['HOME'] = '/home/web_user'
      ENV['LANG'] = 'C.UTF-8'
      ENV['_'] = Module['thisProgram']
      poolPtr = staticAlloc(TOTAL_ENV_SIZE)
      envPtr = staticAlloc(MAX_ENV_VALUES * 4)
      HEAP32[envPtr >> 2] = poolPtr
      HEAP32[_environ >> 2] = envPtr
    } else {
      envPtr = HEAP32[_environ >> 2]
      poolPtr = HEAP32[envPtr >> 2]
    }
    const strings = []
    let totalSize = 0
    for (let key in env) {
      if (typeof env[key] === 'string') {
        var line = key + '=' + env[key]
        strings.push(line)
        totalSize += line.length
      }
    }
    if (totalSize > TOTAL_ENV_SIZE) {
      throw new Error('Environment size exceeded TOTAL_ENV_SIZE!')
    }
    const ptrSize = 4
    for (let i = 0; i < strings.length; i++) {
      var line = strings[i]
      writeAsciiToMemory(line, poolPtr)
      HEAP32[envPtr + i * ptrSize >> 2] = poolPtr
      poolPtr += line.length + 1
    }
    HEAP32[envPtr + strings.length * ptrSize >> 2] = 0
  }

  var ENV = {}

  function _getenv (name) {
    if (name === 0) return 0
    name = Pointer_stringify(name)
    if (!ENV.hasOwnProperty(name)) return 0
    if (_getenv.ret) _free(_getenv.ret)
    _getenv.ret = allocateUTF8(ENV[name])
    return _getenv.ret
  }

  function _emscripten_memcpy_big (dest, src, num) {
    HEAPU8.set(HEAPU8.subarray(src, src + num), dest)
    return dest
  }

  ___buildEnvironment(ENV)
  DYNAMICTOP_PTR = staticAlloc(4)
  STACK_BASE = STACKTOP = alignMemory(STATICTOP)
  STACK_MAX = STACK_BASE + TOTAL_STACK
  DYNAMIC_BASE = alignMemory(STACK_MAX)
  HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE
  staticSealed = true
  Module['wasmTableSize'] = 58
  Module['wasmMaxTableSize'] = 58
  Module.asmGlobalArg = {}
  Module.asmLibraryArg = {
    'abort': abort,
    'enlargeMemory': enlargeMemory,
    'getTotalMemory': getTotalMemory,
    'abortOnCannotGrowMemory': abortOnCannotGrowMemory,
    '___assert_fail': ___assert_fail,
    '___lock': ___lock,
    '___setErrNo': ___setErrNo,
    '___syscall140': ___syscall140,
    '___syscall145': ___syscall145,
    '___syscall146': ___syscall146,
    '___syscall192': ___syscall192,
    '___syscall195': ___syscall195,
    '___syscall197': ___syscall197,
    '___syscall221': ___syscall221,
    '___syscall5': ___syscall5,
    '___syscall54': ___syscall54,
    '___syscall6': ___syscall6,
    '___syscall91': ___syscall91,
    '___unlock': ___unlock,
    '_abort': _abort,
    '_emscripten_memcpy_big': _emscripten_memcpy_big,
    '_getenv': _getenv,
    'DYNAMICTOP_PTR': DYNAMICTOP_PTR,
    'STACKTOP': STACKTOP
  }
  const asm = Module['asm'](Module.asmGlobalArg, Module.asmLibraryArg, buffer)
  Module['asm'] = asm
  var _free = Module['_free'] = (function () {
    return Module['asm']['_free'].apply(null, arguments)
  })
  var _malloc = Module['_malloc'] = (function () {
    return Module['asm']['_malloc'].apply(null, arguments)
  })
  var _memalign = Module['_memalign'] = (function () {
    return Module['asm']['_memalign'].apply(null, arguments)
  })
  var _memset = Module['_memset'] = (function () {
    return Module['asm']['_memset'].apply(null, arguments)
  })
  const _xkb_context_new = Module['_xkb_context_new'] = (function () {
    return Module['asm']['_xkb_context_new'].apply(null, arguments)
  })
  const _xkb_keymap_get_as_string = Module['_xkb_keymap_get_as_string'] = (function () {
    return Module['asm']['_xkb_keymap_get_as_string'].apply(null, arguments)
  })
  const _xkb_keymap_new_from_string = Module['_xkb_keymap_new_from_string'] = (function () {
    return Module['asm']['_xkb_keymap_new_from_string'].apply(null, arguments)
  })
  const _xkb_state_new = Module['_xkb_state_new'] = (function () {
    return Module['asm']['_xkb_state_new'].apply(null, arguments)
  })
  const _xkb_state_serialize_layout = Module['_xkb_state_serialize_layout'] = (function () {
    return Module['asm']['_xkb_state_serialize_layout'].apply(null, arguments)
  })
  const _xkb_state_serialize_mods = Module['_xkb_state_serialize_mods'] = (function () {
    return Module['asm']['_xkb_state_serialize_mods'].apply(null, arguments)
  })
  const _xkb_state_update_key = Module['_xkb_state_update_key'] = (function () {
    return Module['asm']['_xkb_state_update_key'].apply(null, arguments)
  })
  Module['asm'] = asm
  Module['Pointer_stringify'] = Pointer_stringify
  Module['stringToUTF8'] = stringToUTF8
  Module['lengthBytesUTF8'] = lengthBytesUTF8
  Module['then'] = (function (func) {
    if (Module['calledRun']) {
      func(Module)
    } else {
      const old = Module['onRuntimeInitialized']
      Module['onRuntimeInitialized'] = (function () {
        if (old) old()
        func(Module)
      })
    }
    return Module
  })

  function ExitStatus (status) {
    this.name = 'ExitStatus'
    this.message = 'Program terminated with exit(' + status + ')'
    this.status = status
  }

  ExitStatus.prototype = new Error
  ExitStatus.prototype.constructor = ExitStatus
  let initialStackTop
  dependenciesFulfilled = function runCaller () {
    if (!Module['calledRun']) run()
    if (!Module['calledRun']) dependenciesFulfilled = runCaller
  }

  function run (args) {
    args = args || Module['arguments']
    if (runDependencies > 0) {
      return
    }
    preRun()
    if (runDependencies > 0) return
    if (Module['calledRun']) return

    function doRun () {
      if (Module['calledRun']) return
      Module['calledRun'] = true
      if (ABORT) return
      ensureInitRuntime()
      preMain()
      if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']()
      postRun()
    }

    if (Module['setStatus']) {
      Module['setStatus']('Running...')
      setTimeout((function () {
        setTimeout((function () {
          Module['setStatus']('')
        }), 1)
        doRun()
      }), 1)
    } else {
      doRun()
    }
  }

  Module['run'] = run

  function exit (status, implicit) {
    if (implicit && Module['noExitRuntime'] && status === 0) {
      return
    }
    if (Module['noExitRuntime']) {} else {
      ABORT = true
      EXITSTATUS = status
      STACKTOP = initialStackTop
      exitRuntime()
      if (Module['onExit']) Module['onExit'](status)
    }
    Module['quit'](status, new ExitStatus(status))
  }

  Module['exit'] = exit

  function abort (what) {
    if (Module['onAbort']) {
      Module['onAbort'](what)
    }
    if (what !== undefined) {
      Module.print(what)
      Module.printErr(what)
      what = JSON.stringify(what)
    } else {
      what = ''
    }
    ABORT = true
    EXITSTATUS = 1
    throw 'abort(' + what + '). Build with -s ASSERTIONS=1 for more info.'
  }

  Module['abort'] = abort
  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']]
    while (Module['preInit'].length > 0) {
      Module['preInit'].pop()()
    }
  }
  Module['noExitRuntime'] = true
  run()

  return Module
}
export default Module()
