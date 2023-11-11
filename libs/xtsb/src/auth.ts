import { XConnectionSocket } from './connection'
import { pack, unpackFrom } from './struct'
import { typePad, Unmarshaller, xcbComplexList, xcbSimpleList } from './xjsbInternals'
import { DEPTH, FORMAT, SCREEN, Setup, SetupFailed, VISUALTYPE } from './xcb'

function paddedLength(len?: number): number {
  if (len) {
    return ((len + 3) >> 2) << 2
  } else {
    return 0
  }
}

function paddedString(str: string) {
  if (str.length === 0) {
    return ''
  }

  const pad = paddedLength(str.length) - str.length
  let res = str
  for (let i = 0; i < pad; ++i) {
    res += String.fromCharCode(0)
  }

  return res
}

function getByteOrder(): number {
  const isLittleEndian = new Uint32Array(new Uint8Array([1, 2, 3, 4]).buffer)[0] === 0x04030201
  if (isLittleEndian) {
    return 'l'.charCodeAt(0)
  } else {
    return 'B'.charCodeAt(0)
  }
}

export async function authenticate(
  xConnectionSocket: XConnectionSocket,
  displayNum: string,
  authHost: string,
  socketFamily: 'IPv4' | 'IPv6' | undefined,
  cookie?: { authName: string; authData: string },
): Promise<Setup> {
  return new Promise<Setup>(async (resolve) => {
    xConnectionSocket.onData = (data) => {
      xConnectionSocket.onData = undefined
      const setup = readServerHello(data)
      resolve(setup)
    }
    writeClientHello(xConnectionSocket, displayNum, authHost, socketFamily, cookie)
  })
}

async function writeClientHello(
  xConnectionSocket: XConnectionSocket,
  displayNum: string,
  authHost: string,
  socketFamily: 'IPv4' | 'IPv6' | undefined,
  cookie?: { authName: string; authData: string },
): Promise<void> {
  if (!cookie || paddedString(cookie.authData).length === 0 || paddedString(cookie.authName).length === 0) {
    throw new Error('No Xauth Cookie found :(')
  }

  const byteOrder = getByteOrder()
  const protocolMajor = 11 // TODO: config? env?
  const protocolMinor = 0
  const authReq = pack(
    `<BxHHHHxx${paddedString(cookie.authName).length}s${paddedString(cookie.authData).length}s`,
    byteOrder,
    protocolMajor,
    protocolMinor,
    cookie.authName.length,
    cookie.authData.length,
    paddedString(cookie.authName),
    paddedString(cookie.authData),
  )

  xConnectionSocket.write(new Uint8Array(authReq))
}

const unmarshallVISUALTYPE: Unmarshaller<VISUALTYPE> = (buffer, offset = 0) => {
  const [visualId, _class, bitsPerRgbValue, colormapEntries, redMask, greenMask, blueMask] = unpackFrom(
    '<IBBHIII4x',
    buffer,
    offset,
  )
  offset += 24

  return {
    value: {
      visualId,
      _class,
      bitsPerRgbValue,
      colormapEntries,
      redMask,
      greenMask,
      blueMask,
    },
    offset,
  }
}

const unmarshallDEPTH: Unmarshaller<DEPTH> = (buffer, offset = 0) => {
  const [depth, visualsLen] = unpackFrom('<BxH4x', buffer, offset)
  offset += 8
  const visualsWithOffset = xcbComplexList(buffer, offset, visualsLen, unmarshallVISUALTYPE)
  offset = visualsWithOffset.offset
  const visuals = visualsWithOffset.value

  return {
    value: {
      depth,
      visualsLen,
      visuals,
    },
    offset,
  }
}

const unmarshallSCREEN: Unmarshaller<SCREEN> = (buffer, offset = 0) => {
  const [
    root,
    defaultColormap,
    whitePixel,
    blackPixel,
    currentInputMasks,
    widthInPixels,
    heightInPixels,
    widthInMillimeters,
    heightInMillimeters,
    minInstalledMaps,
    maxInstalledMaps,
    rootVisual,
    backingStores,
    saveUnders,
    rootDepth,
    allowedDepthsLen,
  ] = unpackFrom('<IIIIIHHHHHHIBBBB', buffer, offset)
  offset += 40
  const allowedDepthsWithOffset = xcbComplexList(buffer, offset, allowedDepthsLen, unmarshallDEPTH)
  offset = allowedDepthsWithOffset.offset
  const allowedDepths = allowedDepthsWithOffset.value

  return {
    value: {
      root,
      defaultColormap,
      whitePixel,
      blackPixel,
      currentInputMasks,
      widthInPixels,
      heightInPixels,
      widthInMillimeters,
      heightInMillimeters,
      minInstalledMaps,
      maxInstalledMaps,
      rootVisual,
      backingStores,
      saveUnders,
      rootDepth,
      allowedDepthsLen,
      allowedDepths,
    },
    offset,
  }
}

const unmarshallFORMAT: Unmarshaller<FORMAT> = (buffer, offset = 0) => {
  const [depth, bitsPerPixel, scanlinePad] = unpackFrom('<BBB5x', buffer, offset)
  offset += 8

  return {
    value: {
      depth,
      bitsPerPixel,
      scanlinePad,
    },
    offset,
  }
}

const unmarshallSetup: Unmarshaller<Setup> = (buffer, offset = 0) => {
  const [
    status,
    protocolMajorVersion,
    protocolMinorVersion,
    length,
    releaseNumber,
    resourceIdBase,
    resourceIdMask,
    motionBufferSize,
    vendorLen,
    maximumRequestLength,
    rootsLen,
    pixmapFormatsLen,
    imageByteOrder,
    bitmapFormatBitOrder,
    bitmapFormatScanlineUnit,
    bitmapFormatScanlinePad,
    minKeycode,
    maxKeycode,
  ] = unpackFrom('<BxHHHIIIIHHBBBBBBBB4x', buffer, offset)
  offset += 40
  const vendorWithOffset = xcbSimpleList(buffer, offset, vendorLen, Int8Array, 1)
  offset = vendorWithOffset.offset
  const vendor = vendorWithOffset.value
  offset += typePad(8, offset)
  const pixmapFormatsWithOffset = xcbComplexList(buffer, offset, pixmapFormatsLen, unmarshallFORMAT)
  offset = pixmapFormatsWithOffset.offset
  const pixmapFormats = pixmapFormatsWithOffset.value
  offset += typePad(4, offset)
  const rootsWithOffset = xcbComplexList(buffer, offset, rootsLen, unmarshallSCREEN)
  offset = rootsWithOffset.offset
  const roots = rootsWithOffset.value

  return {
    value: {
      status,
      protocolMajorVersion,
      protocolMinorVersion,
      length,
      releaseNumber,
      resourceIdBase,
      resourceIdMask,
      motionBufferSize,
      vendorLen,
      maximumRequestLength,
      rootsLen,
      pixmapFormatsLen,
      imageByteOrder,
      bitmapFormatBitOrder,
      bitmapFormatScanlineUnit,
      bitmapFormatScanlinePad,
      minKeycode,
      maxKeycode,
      vendor,
      pixmapFormats,
      roots,
    },
    offset,
  }
}

const unmarshallSetupFailed: Unmarshaller<SetupFailed> = (buffer, offset = 0) => {
  const [status, reasonLen, protocolMajorVersion, protocolMinorVersion, length] = unpackFrom('<BBHHH', buffer, offset)
  offset += 8
  const reasonWithOffset = xcbSimpleList(buffer, offset, reasonLen, Int8Array, 1)
  offset = reasonWithOffset.offset
  const reason = reasonWithOffset.value

  return {
    value: {
      status,
      reasonLen,
      protocolMajorVersion,
      protocolMinorVersion,
      length,
      reason,
    },
    offset,
  }
}

function readServerHello(buffer: Uint8Array): Setup {
  const retCode = buffer[0]
  if (retCode === 0) {
    // error
    const setupFailed = unmarshallSetupFailed(buffer, 0).value
    throw new Error(`X server connection failed: ${setupFailed.reason.toString()}`)
  }

  return unmarshallSetup(buffer.buffer, buffer.byteOffset).value
}
