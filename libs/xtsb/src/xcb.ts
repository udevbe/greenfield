//
// This file generated automatically from xproto.xml by ts_client.py.
// Edit at your peril.
//

import { XConnection, pad, TypedArray } from './connection'
import type { Unmarshaller, EventHandler, RequestChecker } from './xjsbInternals'
import { xcbSimpleList, xcbComplexList, typePad, notUndefined, errors, concatArrayBuffers } from './xjsbInternals'
import { unpackFrom, pack } from './struct'

export type CHAR2B = {
  byte1: number
  byte2: number
}

export const unmarshallCHAR2B: Unmarshaller<CHAR2B> = (buffer, offset = 0) => {
  const [byte1, byte2] = unpackFrom('<BB', buffer, offset)
  offset += 2

  return {
    value: {
      byte1,
      byte2,
    },
    offset,
  }
}
export const marshallCHAR2B = (instance: CHAR2B): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { byte1, byte2 } = instance
    buffers.push(pack('<BB', byte1, byte2))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type WINDOW = number

export type PIXMAP = number

export type CURSOR = number

export type FONT = number

export type GCONTEXT = number

export type COLORMAP = number

export type ATOM = number

export type DRAWABLE = number

export type FONTABLE = number

export type BOOL32 = number

export type VISUALID = number

export type TIMESTAMP = number

export type KEYSYM = number

export type KEYCODE = number

export type KEYCODE32 = number

export type BUTTON = number

export type POINT = {
  x: number
  y: number
}

export const unmarshallPOINT: Unmarshaller<POINT> = (buffer, offset = 0) => {
  const [x, y] = unpackFrom('<hh', buffer, offset)
  offset += 4

  return {
    value: {
      x,
      y,
    },
    offset,
  }
}
export const marshallPOINT = (instance: POINT): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { x, y } = instance
    buffers.push(pack('<hh', x, y))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type RECTANGLE = {
  x: number
  y: number
  width: number
  height: number
}

export const unmarshallRECTANGLE: Unmarshaller<RECTANGLE> = (buffer, offset = 0) => {
  const [x, y, width, height] = unpackFrom('<hhHH', buffer, offset)
  offset += 8

  return {
    value: {
      x,
      y,
      width,
      height,
    },
    offset,
  }
}
export const marshallRECTANGLE = (instance: RECTANGLE): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { x, y, width, height } = instance
    buffers.push(pack('<hhHH', x, y, width, height))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type ARC = {
  x: number
  y: number
  width: number
  height: number
  angle1: number
  angle2: number
}

export const unmarshallARC: Unmarshaller<ARC> = (buffer, offset = 0) => {
  const [x, y, width, height, angle1, angle2] = unpackFrom('<hhHHhh', buffer, offset)
  offset += 12

  return {
    value: {
      x,
      y,
      width,
      height,
      angle1,
      angle2,
    },
    offset,
  }
}
export const marshallARC = (instance: ARC): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { x, y, width, height, angle1, angle2 } = instance
    buffers.push(pack('<hhHHhh', x, y, width, height, angle1, angle2))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type FORMAT = {
  depth: number
  bitsPerPixel: number
  scanlinePad: number
}

export const unmarshallFORMAT: Unmarshaller<FORMAT> = (buffer, offset = 0) => {
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
export const marshallFORMAT = (instance: FORMAT): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { depth, bitsPerPixel, scanlinePad } = instance
    buffers.push(pack('<BBB5x', depth, bitsPerPixel, scanlinePad))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export enum VisualClass {
  StaticGray = 0,
  GrayScale = 1,
  StaticColor = 2,
  PseudoColor = 3,
  TrueColor = 4,
  DirectColor = 5,
}

export type VISUALTYPE = {
  visualId: VISUALID
  _class: VisualClass
  bitsPerRgbValue: number
  colormapEntries: number
  redMask: number
  greenMask: number
  blueMask: number
}

export const unmarshallVISUALTYPE: Unmarshaller<VISUALTYPE> = (buffer, offset = 0) => {
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
export const marshallVISUALTYPE = (instance: VISUALTYPE): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { visualId, _class, bitsPerRgbValue, colormapEntries, redMask, greenMask, blueMask } = instance
    buffers.push(pack('<IBBHIII4x', visualId, _class, bitsPerRgbValue, colormapEntries, redMask, greenMask, blueMask))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type DEPTH = {
  depth: number
  visualsLen: number
  visuals: VISUALTYPE[]
}

export const unmarshallDEPTH: Unmarshaller<DEPTH> = (buffer, offset = 0) => {
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
export const marshallDEPTH = (instance: DEPTH): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const { depth, visualsLen } = instance
  buffers.push(pack('<BxH4x', depth, visualsLen))
  byteLength += 8
  {
    instance.visuals.forEach((complex) => {
      const buffer = marshallVISUALTYPE(complex)
      buffers.push(buffer)
      byteLength += buffer.byteLength
    })
  }
  return concatArrayBuffers(buffers, byteLength)
}

export enum EventMask {
  NoEvent = 0,
  KeyPress = 1,
  KeyRelease = 2,
  ButtonPress = 4,
  ButtonRelease = 8,
  EnterWindow = 16,
  LeaveWindow = 32,
  PointerMotion = 64,
  PointerMotionHint = 128,
  Button1Motion = 256,
  Button2Motion = 512,
  Button3Motion = 1024,
  Button4Motion = 2048,
  Button5Motion = 4096,
  ButtonMotion = 8192,
  KeymapState = 16384,
  Exposure = 32768,
  VisibilityChange = 65536,
  StructureNotify = 131072,
  ResizeRedirect = 262144,
  SubstructureNotify = 524288,
  SubstructureRedirect = 1048576,
  FocusChange = 2097152,
  PropertyChange = 4194304,
  ColorMapChange = 8388608,
  OwnerGrabButton = 16777216,
}

export enum BackingStore {
  NotUseful = 0,
  WhenMapped = 1,
  Always = 2,
}

export type SCREEN = {
  root: WINDOW
  defaultColormap: COLORMAP
  whitePixel: number
  blackPixel: number
  currentInputMasks: number
  widthInPixels: number
  heightInPixels: number
  widthInMillimeters: number
  heightInMillimeters: number
  minInstalledMaps: number
  maxInstalledMaps: number
  rootVisual: VISUALID
  backingStores: BackingStore
  saveUnders: number
  rootDepth: number
  allowedDepthsLen: number
  allowedDepths: DEPTH[]
}

export const unmarshallSCREEN: Unmarshaller<SCREEN> = (buffer, offset = 0) => {
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
export const marshallSCREEN = (instance: SCREEN): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const {
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
  } = instance
  buffers.push(
    pack(
      '<IIIIIHHHHHHIBBBB',
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
    ),
  )
  byteLength += 40
  {
    instance.allowedDepths.forEach((complex) => {
      const buffer = marshallDEPTH(complex)
      buffers.push(buffer)
      byteLength += buffer.byteLength
    })
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type SetupRequest = {
  byteOrder: number
  protocolMajorVersion: number
  protocolMinorVersion: number
  authorizationProtocolNameLen: number
  authorizationProtocolDataLen: number
  authorizationProtocolName: Int8Array
  authorizationProtocolData: Int8Array
}

export const unmarshallSetupRequest: Unmarshaller<SetupRequest> = (buffer, offset = 0) => {
  const [
    byteOrder,
    protocolMajorVersion,
    protocolMinorVersion,
    authorizationProtocolNameLen,
    authorizationProtocolDataLen,
  ] = unpackFrom('<BxHHHH2x', buffer, offset)
  offset += 12
  const authorizationProtocolNameWithOffset = xcbSimpleList(buffer, offset, authorizationProtocolNameLen, Int8Array, 1)
  offset = authorizationProtocolNameWithOffset.offset
  const authorizationProtocolName = authorizationProtocolNameWithOffset.value
  offset += typePad(1, offset)
  const authorizationProtocolDataWithOffset = xcbSimpleList(buffer, offset, authorizationProtocolDataLen, Int8Array, 1)
  offset = authorizationProtocolDataWithOffset.offset
  const authorizationProtocolData = authorizationProtocolDataWithOffset.value

  return {
    value: {
      byteOrder,
      protocolMajorVersion,
      protocolMinorVersion,
      authorizationProtocolNameLen,
      authorizationProtocolDataLen,
      authorizationProtocolName,
      authorizationProtocolData,
    },
    offset,
  }
}
export const marshallSetupRequest = (instance: SetupRequest): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const {
    byteOrder,
    protocolMajorVersion,
    protocolMinorVersion,
    authorizationProtocolNameLen,
    authorizationProtocolDataLen,
  } = instance
  buffers.push(
    pack(
      '<BxHHHH2x',
      byteOrder,
      protocolMajorVersion,
      protocolMinorVersion,
      authorizationProtocolNameLen,
      authorizationProtocolDataLen,
    ),
  )
  byteLength += 12
  {
    const buffer = instance.authorizationProtocolName.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  {
    const padding = typePad(1, byteLength)
    buffers.push(new ArrayBuffer(padding))
    byteLength += padding
  }
  {
    const buffer = instance.authorizationProtocolData.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type SetupFailed = {
  status: number
  reasonLen: number
  protocolMajorVersion: number
  protocolMinorVersion: number
  length: number
  reason: Int8Array
}

export const unmarshallSetupFailed: Unmarshaller<SetupFailed> = (buffer, offset = 0) => {
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
export const marshallSetupFailed = (instance: SetupFailed): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const { status, reasonLen, protocolMajorVersion, protocolMinorVersion, length } = instance
  buffers.push(pack('<BBHHH', status, reasonLen, protocolMajorVersion, protocolMinorVersion, length))
  byteLength += 8
  {
    const buffer = instance.reason.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type SetupAuthenticate = {
  status: number
  length: number
  reason: Int8Array
}

export const unmarshallSetupAuthenticate: Unmarshaller<SetupAuthenticate> = (buffer, offset = 0) => {
  const [status, length] = unpackFrom('<B5xH', buffer, offset)
  offset += 8
  const reasonWithOffset = xcbSimpleList(buffer, offset, length * 4, Int8Array, 1)
  offset = reasonWithOffset.offset
  const reason = reasonWithOffset.value

  return {
    value: {
      status,
      length,
      reason,
    },
    offset,
  }
}
export const marshallSetupAuthenticate = (instance: SetupAuthenticate): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const { status, length } = instance
  buffers.push(pack('<B5xH', status, length))
  byteLength += 8
  {
    const buffer = instance.reason.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  return concatArrayBuffers(buffers, byteLength)
}

export enum ImageOrder {
  LSBFirst = 0,
  MSBFirst = 1,
}

export type Setup = {
  status: number
  protocolMajorVersion: number
  protocolMinorVersion: number
  length: number
  releaseNumber: number
  resourceIdBase: number
  resourceIdMask: number
  motionBufferSize: number
  vendorLen: number
  maximumRequestLength: number
  rootsLen: number
  pixmapFormatsLen: number
  imageByteOrder: ImageOrder
  bitmapFormatBitOrder: ImageOrder
  bitmapFormatScanlineUnit: number
  bitmapFormatScanlinePad: number
  minKeycode: KEYCODE
  maxKeycode: KEYCODE
  vendor: Int8Array
  pixmapFormats: FORMAT[]
  roots: SCREEN[]
}

export const unmarshallSetup: Unmarshaller<Setup> = (buffer, offset = 0) => {
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
export const marshallSetup = (instance: Setup): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const {
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
  } = instance
  buffers.push(
    pack(
      '<BxHHHIIIIHHBBBBBBBB4x',
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
    ),
  )
  byteLength += 40
  {
    const buffer = instance.vendor.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  {
    const padding = typePad(8, byteLength)
    buffers.push(new ArrayBuffer(padding))
    byteLength += padding
  }
  {
    instance.pixmapFormats.forEach((complex) => {
      const buffer = marshallFORMAT(complex)
      buffers.push(buffer)
      byteLength += buffer.byteLength
    })
  }
  {
    const padding = typePad(4, byteLength)
    buffers.push(new ArrayBuffer(padding))
    byteLength += padding
  }
  {
    instance.roots.forEach((complex) => {
      const buffer = marshallSCREEN(complex)
      buffers.push(buffer)
      byteLength += buffer.byteLength
    })
  }
  return concatArrayBuffers(buffers, byteLength)
}

export enum ModMask {
  Shift = 1,
  Lock = 2,
  Control = 4,
  _1 = 8,
  _2 = 16,
  _3 = 32,
  _4 = 64,
  _5 = 128,
  Any = 32768,
}

export enum KeyButMask {
  Shift = 1,
  Lock = 2,
  Control = 4,
  Mod1 = 8,
  Mod2 = 16,
  Mod3 = 32,
  Mod4 = 64,
  Mod5 = 128,
  Button1 = 256,
  Button2 = 512,
  Button3 = 1024,
  Button4 = 2048,
  Button5 = 4096,
}

export enum Window {
  None = 0,
}

/**
 *
 * a key was pressed/released
 *
 * See:
 *
 * {@link XConnection.grabKey}
 *
 * {@link XConnection.grabKeyboard}
 */
export type KeyPressEvent = {
  responseType: number
  /**
   * The keycode (a number representing a physical key on the keyboard) of the key
   * which was pressed.
   */
  detail: KEYCODE
  /**
   * Time when the event was generated (in milliseconds).
   */
  time: TIMESTAMP
  /**
   * The root window of `child`.
   */
  root: WINDOW
  event: WINDOW
  child: WINDOW
  /**
   * The X coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootX: number
  /**
   * The Y coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootY: number
  /**
   * If `same_screen` is true, this is the X coordinate relative to the `event`
   * window's origin. Otherwise, `event_x` will be set to zero.
   */
  eventX: number
  /**
   * If `same_screen` is true, this is the Y coordinate relative to the `event`
   * window's origin. Otherwise, `event_y` will be set to zero.
   */
  eventY: number
  /**
   * The logical state of the pointer buttons and modifier keys just prior to the
   * event.
   */
  state: number
  /**
   * Whether the `event` window is on the same screen as the `root` window.
   */
  sameScreen: number
}

export const unmarshallKeyPressEvent: Unmarshaller<KeyPressEvent> = (buffer, offset = 0) => {
  const [responseType, detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen] = unpackFrom(
    '<BB2xIIIIhhhhHBx',
    buffer,
    offset,
  )
  offset += 32

  return {
    value: {
      responseType,
      detail,
      time,
      root,
      event,
      child,
      rootX,
      rootY,
      eventX,
      eventY,
      state,
      sameScreen,
    },
    offset,
  }
}
export const marshallKeyPressEvent = (instance: KeyPressEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen } = instance
    buffers.push(
      pack('<xB2xIIIIhhhhHBx', detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface KeyPressEventHandler extends EventHandler<KeyPressEvent> {}

/**
 *
 * a key was pressed/released
 *
 * See:
 *
 * {@link XConnection.grabKey}
 *
 * {@link XConnection.grabKeyboard}
 */
export type KeyReleaseEvent = {
  responseType: number
  /**
   * The keycode (a number representing a physical key on the keyboard) of the key
   * which was pressed.
   */
  detail: KEYCODE
  /**
   * Time when the event was generated (in milliseconds).
   */
  time: TIMESTAMP
  /**
   * The root window of `child`.
   */
  root: WINDOW
  event: WINDOW
  child: WINDOW
  /**
   * The X coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootX: number
  /**
   * The Y coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootY: number
  /**
   * If `same_screen` is true, this is the X coordinate relative to the `event`
   * window's origin. Otherwise, `event_x` will be set to zero.
   */
  eventX: number
  /**
   * If `same_screen` is true, this is the Y coordinate relative to the `event`
   * window's origin. Otherwise, `event_y` will be set to zero.
   */
  eventY: number
  /**
   * The logical state of the pointer buttons and modifier keys just prior to the
   * event.
   */
  state: number
  /**
   * Whether the `event` window is on the same screen as the `root` window.
   */
  sameScreen: number
}

export const unmarshallKeyReleaseEvent: Unmarshaller<KeyReleaseEvent> = (buffer, offset = 0) => {
  const [responseType, detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen] = unpackFrom(
    '<BB2xIIIIhhhhHBx',
    buffer,
    offset,
  )
  offset += 32

  return {
    value: {
      responseType,
      detail,
      time,
      root,
      event,
      child,
      rootX,
      rootY,
      eventX,
      eventY,
      state,
      sameScreen,
    },
    offset,
  }
}
export const marshallKeyReleaseEvent = (instance: KeyReleaseEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen } = instance
    buffers.push(
      pack('<xB2xIIIIhhhhHBx', detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface KeyReleaseEventHandler extends EventHandler<KeyReleaseEvent> {}

export enum ButtonMask {
  _1 = 256,
  _2 = 512,
  _3 = 1024,
  _4 = 2048,
  _5 = 4096,
  Any = 32768,
}

/**
 *
 * a mouse button was pressed/released
 *
 * See:
 *
 * {@link XConnection.grabButton}
 *
 * {@link XConnection.grabPointer}
 */
export type ButtonPressEvent = {
  responseType: number
  /**
   * The keycode (a number representing a physical key on the keyboard) of the key
   * which was pressed.
   */
  detail: BUTTON
  /**
   * Time when the event was generated (in milliseconds).
   */
  time: TIMESTAMP
  /**
   * The root window of `child`.
   */
  root: WINDOW
  event: WINDOW
  child: WINDOW
  /**
   * The X coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootX: number
  /**
   * The Y coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootY: number
  /**
   * If `same_screen` is true, this is the X coordinate relative to the `event`
   * window's origin. Otherwise, `event_x` will be set to zero.
   */
  eventX: number
  /**
   * If `same_screen` is true, this is the Y coordinate relative to the `event`
   * window's origin. Otherwise, `event_y` will be set to zero.
   */
  eventY: number
  /**
   * The logical state of the pointer buttons and modifier keys just prior to the
   * event.
   */
  state: number
  /**
   * Whether the `event` window is on the same screen as the `root` window.
   */
  sameScreen: number
}

export const unmarshallButtonPressEvent: Unmarshaller<ButtonPressEvent> = (buffer, offset = 0) => {
  const [responseType, detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen] = unpackFrom(
    '<BB2xIIIIhhhhHBx',
    buffer,
    offset,
  )
  offset += 32

  return {
    value: {
      responseType,
      detail,
      time,
      root,
      event,
      child,
      rootX,
      rootY,
      eventX,
      eventY,
      state,
      sameScreen,
    },
    offset,
  }
}
export const marshallButtonPressEvent = (instance: ButtonPressEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen } = instance
    buffers.push(
      pack('<xB2xIIIIhhhhHBx', detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ButtonPressEventHandler extends EventHandler<ButtonPressEvent> {}

/**
 *
 * a mouse button was pressed/released
 *
 * See:
 *
 * {@link XConnection.grabButton}
 *
 * {@link XConnection.grabPointer}
 */
export type ButtonReleaseEvent = {
  responseType: number
  /**
   * The keycode (a number representing a physical key on the keyboard) of the key
   * which was pressed.
   */
  detail: BUTTON
  /**
   * Time when the event was generated (in milliseconds).
   */
  time: TIMESTAMP
  /**
   * The root window of `child`.
   */
  root: WINDOW
  event: WINDOW
  child: WINDOW
  /**
   * The X coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootX: number
  /**
   * The Y coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootY: number
  /**
   * If `same_screen` is true, this is the X coordinate relative to the `event`
   * window's origin. Otherwise, `event_x` will be set to zero.
   */
  eventX: number
  /**
   * If `same_screen` is true, this is the Y coordinate relative to the `event`
   * window's origin. Otherwise, `event_y` will be set to zero.
   */
  eventY: number
  /**
   * The logical state of the pointer buttons and modifier keys just prior to the
   * event.
   */
  state: number
  /**
   * Whether the `event` window is on the same screen as the `root` window.
   */
  sameScreen: number
}

export const unmarshallButtonReleaseEvent: Unmarshaller<ButtonReleaseEvent> = (buffer, offset = 0) => {
  const [responseType, detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen] = unpackFrom(
    '<BB2xIIIIhhhhHBx',
    buffer,
    offset,
  )
  offset += 32

  return {
    value: {
      responseType,
      detail,
      time,
      root,
      event,
      child,
      rootX,
      rootY,
      eventX,
      eventY,
      state,
      sameScreen,
    },
    offset,
  }
}
export const marshallButtonReleaseEvent = (instance: ButtonReleaseEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen } = instance
    buffers.push(
      pack('<xB2xIIIIhhhhHBx', detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ButtonReleaseEventHandler extends EventHandler<ButtonReleaseEvent> {}

export enum Motion {
  Normal = 0,
  Hint = 1,
}

/**
 *
 * a key was pressed
 *
 * See:
 *
 * {@link XConnection.grabKey}
 *
 * {@link XConnection.grabKeyboard}
 */
export type MotionNotifyEvent = {
  responseType: number
  /**
   * The keycode (a number representing a physical key on the keyboard) of the key
   * which was pressed.
   */
  detail: Motion
  /**
   * Time when the event was generated (in milliseconds).
   */
  time: TIMESTAMP
  /**
   * The root window of `child`.
   */
  root: WINDOW
  event: WINDOW
  child: WINDOW
  /**
   * The X coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootX: number
  /**
   * The Y coordinate of the pointer relative to the `root` window at the time of
   * the event.
   */
  rootY: number
  /**
   * If `same_screen` is true, this is the X coordinate relative to the `event`
   * window's origin. Otherwise, `event_x` will be set to zero.
   */
  eventX: number
  /**
   * If `same_screen` is true, this is the Y coordinate relative to the `event`
   * window's origin. Otherwise, `event_y` will be set to zero.
   */
  eventY: number
  /**
   * The logical state of the pointer buttons and modifier keys just prior to the
   * event.
   */
  state: number
  /**
   * Whether the `event` window is on the same screen as the `root` window.
   */
  sameScreen: number
}

export const unmarshallMotionNotifyEvent: Unmarshaller<MotionNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen] = unpackFrom(
    '<BB2xIIIIhhhhHBx',
    buffer,
    offset,
  )
  offset += 32

  return {
    value: {
      responseType,
      detail,
      time,
      root,
      event,
      child,
      rootX,
      rootY,
      eventX,
      eventY,
      state,
      sameScreen,
    },
    offset,
  }
}
export const marshallMotionNotifyEvent = (instance: MotionNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen } = instance
    buffers.push(
      pack('<xB2xIIIIhhhhHBx', detail, time, root, event, child, rootX, rootY, eventX, eventY, state, sameScreen),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface MotionNotifyEventHandler extends EventHandler<MotionNotifyEvent> {}

export enum NotifyDetail {
  Ancestor = 0,
  Virtual = 1,
  Inferior = 2,
  Nonlinear = 3,
  NonlinearVirtual = 4,
  Pointer = 5,
  PointerRoot = 6,
  None = 7,
}

export enum NotifyMode {
  Normal = 0,
  Grab = 1,
  Ungrab = 2,
  WhileGrabbed = 3,
}

/**
 *
 * the pointer is in a different window
 */
export type EnterNotifyEvent = {
  responseType: number
  detail: NotifyDetail
  time: TIMESTAMP
  /**
   * The root window for the final cursor position.
   */
  root: WINDOW
  /**
   * The window on which the event was generated.
   */
  event: WINDOW
  /**
   * If the `event` window has subwindows and the final pointer position is in one
   * of them, then `child` is set to that subwindow, `XCB_WINDOW_NONE` otherwise.
   */
  child: WINDOW
  /**
   * The pointer X coordinate relative to `root`'s origin at the time of the event.
   */
  rootX: number
  /**
   * The pointer Y coordinate relative to `root`'s origin at the time of the event.
   */
  rootY: number
  /**
   * If `event` is on the same screen as `root`, this is the pointer X coordinate
   * relative to the event window's origin.
   */
  eventX: number
  /**
   * If `event` is on the same screen as `root`, this is the pointer Y coordinate
   * relative to the event window's origin.
   */
  eventY: number
  state: number
  /**
   *
   */
  mode: NotifyMode
  sameScreenFocus: number
}

export const unmarshallEnterNotifyEvent: Unmarshaller<EnterNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, detail, time, root, event, child, rootX, rootY, eventX, eventY, state, mode, sameScreenFocus] =
    unpackFrom('<BB2xIIIIhhhhHBB', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
      detail,
      time,
      root,
      event,
      child,
      rootX,
      rootY,
      eventX,
      eventY,
      state,
      mode,
      sameScreenFocus,
    },
    offset,
  }
}
export const marshallEnterNotifyEvent = (instance: EnterNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, time, root, event, child, rootX, rootY, eventX, eventY, state, mode, sameScreenFocus } = instance
    buffers.push(
      pack(
        '<xB2xIIIIhhhhHBB',
        detail,
        time,
        root,
        event,
        child,
        rootX,
        rootY,
        eventX,
        eventY,
        state,
        mode,
        sameScreenFocus,
      ),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface EnterNotifyEventHandler extends EventHandler<EnterNotifyEvent> {}

/**
 *
 * the pointer is in a different window
 */
export type LeaveNotifyEvent = {
  responseType: number
  detail: NotifyDetail
  time: TIMESTAMP
  /**
   * The root window for the final cursor position.
   */
  root: WINDOW
  /**
   * The window on which the event was generated.
   */
  event: WINDOW
  /**
   * If the `event` window has subwindows and the final pointer position is in one
   * of them, then `child` is set to that subwindow, `XCB_WINDOW_NONE` otherwise.
   */
  child: WINDOW
  /**
   * The pointer X coordinate relative to `root`'s origin at the time of the event.
   */
  rootX: number
  /**
   * The pointer Y coordinate relative to `root`'s origin at the time of the event.
   */
  rootY: number
  /**
   * If `event` is on the same screen as `root`, this is the pointer X coordinate
   * relative to the event window's origin.
   */
  eventX: number
  /**
   * If `event` is on the same screen as `root`, this is the pointer Y coordinate
   * relative to the event window's origin.
   */
  eventY: number
  state: number
  /**
   *
   */
  mode: NotifyMode
  sameScreenFocus: number
}

export const unmarshallLeaveNotifyEvent: Unmarshaller<LeaveNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, detail, time, root, event, child, rootX, rootY, eventX, eventY, state, mode, sameScreenFocus] =
    unpackFrom('<BB2xIIIIhhhhHBB', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
      detail,
      time,
      root,
      event,
      child,
      rootX,
      rootY,
      eventX,
      eventY,
      state,
      mode,
      sameScreenFocus,
    },
    offset,
  }
}
export const marshallLeaveNotifyEvent = (instance: LeaveNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, time, root, event, child, rootX, rootY, eventX, eventY, state, mode, sameScreenFocus } = instance
    buffers.push(
      pack(
        '<xB2xIIIIhhhhHBB',
        detail,
        time,
        root,
        event,
        child,
        rootX,
        rootY,
        eventX,
        eventY,
        state,
        mode,
        sameScreenFocus,
      ),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface LeaveNotifyEventHandler extends EventHandler<LeaveNotifyEvent> {}

/**
 *
 * NOT YET DOCUMENTED
 */
export type FocusInEvent = {
  responseType: number
  /**
   *
   */
  detail: NotifyDetail
  /**
   * The window on which the focus event was generated. This is the window used by
   * the X server to report the event.
   */
  event: WINDOW
  /**
   *
   */
  mode: NotifyMode
}

export const unmarshallFocusInEvent: Unmarshaller<FocusInEvent> = (buffer, offset = 0) => {
  const [responseType, detail, event, mode] = unpackFrom('<BB2xIB3x', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      detail,
      event,
      mode,
    },
    offset,
  }
}
export const marshallFocusInEvent = (instance: FocusInEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, event, mode } = instance
    buffers.push(pack('<xB2xIB3x', detail, event, mode))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface FocusInEventHandler extends EventHandler<FocusInEvent> {}

/**
 *
 * NOT YET DOCUMENTED
 */
export type FocusOutEvent = {
  responseType: number
  /**
   *
   */
  detail: NotifyDetail
  /**
   * The window on which the focus event was generated. This is the window used by
   * the X server to report the event.
   */
  event: WINDOW
  /**
   *
   */
  mode: NotifyMode
}

export const unmarshallFocusOutEvent: Unmarshaller<FocusOutEvent> = (buffer, offset = 0) => {
  const [responseType, detail, event, mode] = unpackFrom('<BB2xIB3x', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      detail,
      event,
      mode,
    },
    offset,
  }
}
export const marshallFocusOutEvent = (instance: FocusOutEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { detail, event, mode } = instance
    buffers.push(pack('<xB2xIB3x', detail, event, mode))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface FocusOutEventHandler extends EventHandler<FocusOutEvent> {}

export type KeymapNotifyEvent = {
  responseType: number
  keys: Uint8Array
}

export const unmarshallKeymapNotifyEvent: Unmarshaller<KeymapNotifyEvent> = (buffer, offset = 0) => {
  const [responseType] = unpackFrom('<B', buffer, offset)
  offset += 1
  const keysWithOffset = xcbSimpleList(buffer, offset, 31, Uint8Array, 1)
  offset = keysWithOffset.offset
  const keys = keysWithOffset.value

  return {
    value: {
      responseType,
      keys,
    },
    offset,
  }
}
export const marshallKeymapNotifyEvent = (instance: KeymapNotifyEvent): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const buffer = instance.keys.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface KeymapNotifyEventHandler extends EventHandler<KeymapNotifyEvent> {}

/**
 *
 * NOT YET DOCUMENTED
 */
export type ExposeEvent = {
  responseType: number
  /**
   * The exposed (damaged) window.
   */
  window: WINDOW
  /**
   * The X coordinate of the left-upper corner of the exposed rectangle, relative to
   * the `window`'s origin.
   */
  x: number
  /**
   * The Y coordinate of the left-upper corner of the exposed rectangle, relative to
   * the `window`'s origin.
   */
  y: number
  /**
   * The width of the exposed rectangle.
   */
  width: number
  /**
   * The height of the exposed rectangle.
   */
  height: number
  /**
   * The amount of `Expose` events following this one. Simple applications that do
   * not want to optimize redisplay by distinguishing between subareas of its window
   * can just ignore all Expose events with nonzero counts and perform full
   * redisplays on events with zero counts.
   */
  count: number
}

export const unmarshallExposeEvent: Unmarshaller<ExposeEvent> = (buffer, offset = 0) => {
  const [responseType, window, x, y, width, height, count] = unpackFrom('<Bx2xIHHHHH2x', buffer, offset)
  offset += 20

  return {
    value: {
      responseType,
      window,
      x,
      y,
      width,
      height,
      count,
    },
    offset,
  }
}
export const marshallExposeEvent = (instance: ExposeEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { window, x, y, width, height, count } = instance
    buffers.push(pack('<xx2xIHHHHH2x', window, x, y, width, height, count))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ExposeEventHandler extends EventHandler<ExposeEvent> {}

export type GraphicsExposureEvent = {
  responseType: number
  drawable: DRAWABLE
  x: number
  y: number
  width: number
  height: number
  minorOpcode: number
  count: number
  majorOpcode: number
}

export const unmarshallGraphicsExposureEvent: Unmarshaller<GraphicsExposureEvent> = (buffer, offset = 0) => {
  const [responseType, drawable, x, y, width, height, minorOpcode, count, majorOpcode] = unpackFrom(
    '<Bx2xIHHHHHHB3x',
    buffer,
    offset,
  )
  offset += 24

  return {
    value: {
      responseType,
      drawable,
      x,
      y,
      width,
      height,
      minorOpcode,
      count,
      majorOpcode,
    },
    offset,
  }
}
export const marshallGraphicsExposureEvent = (instance: GraphicsExposureEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { drawable, x, y, width, height, minorOpcode, count, majorOpcode } = instance
    buffers.push(pack('<xx2xIHHHHHHB3x', drawable, x, y, width, height, minorOpcode, count, majorOpcode))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface GraphicsExposureEventHandler extends EventHandler<GraphicsExposureEvent> {}

export type NoExposureEvent = {
  responseType: number
  drawable: DRAWABLE
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallNoExposureEvent: Unmarshaller<NoExposureEvent> = (buffer, offset = 0) => {
  const [responseType, drawable, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      drawable,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallNoExposureEvent = (instance: NoExposureEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { drawable, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', drawable, minorOpcode, majorOpcode))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface NoExposureEventHandler extends EventHandler<NoExposureEvent> {}

export enum Visibility {
  Unobscured = 0,
  PartiallyObscured = 1,
  FullyObscured = 2,
}

export type VisibilityNotifyEvent = {
  responseType: number
  window: WINDOW
  state: Visibility
}

export const unmarshallVisibilityNotifyEvent: Unmarshaller<VisibilityNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, window, state] = unpackFrom('<Bx2xIB3x', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      window,
      state,
    },
    offset,
  }
}
export const marshallVisibilityNotifyEvent = (instance: VisibilityNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { window, state } = instance
    buffers.push(pack('<xx2xIB3x', window, state))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface VisibilityNotifyEventHandler extends EventHandler<VisibilityNotifyEvent> {}

export type CreateNotifyEvent = {
  responseType: number
  parent: WINDOW
  window: WINDOW
  x: number
  y: number
  width: number
  height: number
  borderWidth: number
  overrideRedirect: number
}

export const unmarshallCreateNotifyEvent: Unmarshaller<CreateNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, parent, window, x, y, width, height, borderWidth, overrideRedirect] = unpackFrom(
    '<Bx2xIIhhHHHBx',
    buffer,
    offset,
  )
  offset += 24

  return {
    value: {
      responseType,
      parent,
      window,
      x,
      y,
      width,
      height,
      borderWidth,
      overrideRedirect,
    },
    offset,
  }
}
export const marshallCreateNotifyEvent = (instance: CreateNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { parent, window, x, y, width, height, borderWidth, overrideRedirect } = instance
    buffers.push(pack('<xx2xIIhhHHHBx', parent, window, x, y, width, height, borderWidth, overrideRedirect))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface CreateNotifyEventHandler extends EventHandler<CreateNotifyEvent> {}

/**
 *
 * a window is destroyed
 *
 * See:
 *
 * {@link XConnection.destroyWindow}
 */
export type DestroyNotifyEvent = {
  responseType: number
  /**
   * The reconfigured window or its parent, depending on whether `StructureNotify`
   * or `SubstructureNotify` was selected.
   */
  event: WINDOW
  /**
   * The window that is destroyed.
   */
  window: WINDOW
}

export const unmarshallDestroyNotifyEvent: Unmarshaller<DestroyNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, event, window] = unpackFrom('<Bx2xII', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      event,
      window,
    },
    offset,
  }
}
export const marshallDestroyNotifyEvent = (instance: DestroyNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window } = instance
    buffers.push(pack('<xx2xII', event, window))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface DestroyNotifyEventHandler extends EventHandler<DestroyNotifyEvent> {}

/**
 *
 * a window is unmapped
 *
 * See:
 *
 * {@link XConnection.unmapWindow}
 */
export type UnmapNotifyEvent = {
  responseType: number
  /**
   * The reconfigured window or its parent, depending on whether `StructureNotify`
   * or `SubstructureNotify` was selected.
   */
  event: WINDOW
  /**
   * The window that was unmapped.
   */
  window: WINDOW
  /**
   * Set to 1 if the event was generated as a result of a resizing of the window's
   * parent when `window` had a win_gravity of `UnmapGravity`.
   */
  fromConfigure: number
}

export const unmarshallUnmapNotifyEvent: Unmarshaller<UnmapNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, event, window, fromConfigure] = unpackFrom('<Bx2xIIB3x', buffer, offset)
  offset += 16

  return {
    value: {
      responseType,
      event,
      window,
      fromConfigure,
    },
    offset,
  }
}
export const marshallUnmapNotifyEvent = (instance: UnmapNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window, fromConfigure } = instance
    buffers.push(pack('<xx2xIIB3x', event, window, fromConfigure))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface UnmapNotifyEventHandler extends EventHandler<UnmapNotifyEvent> {}

/**
 *
 * a window was mapped
 *
 * See:
 *
 * {@link XConnection.mapWindow}
 */
export type MapNotifyEvent = {
  responseType: number
  /**
   * The window which was mapped or its parent, depending on whether
   * `StructureNotify` or `SubstructureNotify` was selected.
   */
  event: WINDOW
  /**
   * The window that was mapped.
   */
  window: WINDOW
  /**
   * Window managers should ignore this window if `override_redirect` is 1.
   */
  overrideRedirect: number
}

export const unmarshallMapNotifyEvent: Unmarshaller<MapNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, event, window, overrideRedirect] = unpackFrom('<Bx2xIIB3x', buffer, offset)
  offset += 16

  return {
    value: {
      responseType,
      event,
      window,
      overrideRedirect,
    },
    offset,
  }
}
export const marshallMapNotifyEvent = (instance: MapNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window, overrideRedirect } = instance
    buffers.push(pack('<xx2xIIB3x', event, window, overrideRedirect))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface MapNotifyEventHandler extends EventHandler<MapNotifyEvent> {}

/**
 *
 * window wants to be mapped
 *
 * See:
 *
 * {@link XConnection.mapWindow}
 */
export type MapRequestEvent = {
  responseType: number
  /**
   * The parent of `window`.
   */
  parent: WINDOW
  /**
   * The window to be mapped.
   */
  window: WINDOW
}

export const unmarshallMapRequestEvent: Unmarshaller<MapRequestEvent> = (buffer, offset = 0) => {
  const [responseType, parent, window] = unpackFrom('<Bx2xII', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      parent,
      window,
    },
    offset,
  }
}
export const marshallMapRequestEvent = (instance: MapRequestEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { parent, window } = instance
    buffers.push(pack('<xx2xII', parent, window))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface MapRequestEventHandler extends EventHandler<MapRequestEvent> {}

export type ReparentNotifyEvent = {
  responseType: number
  event: WINDOW
  window: WINDOW
  parent: WINDOW
  x: number
  y: number
  overrideRedirect: number
}

export const unmarshallReparentNotifyEvent: Unmarshaller<ReparentNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, event, window, parent, x, y, overrideRedirect] = unpackFrom('<Bx2xIIIhhB3x', buffer, offset)
  offset += 24

  return {
    value: {
      responseType,
      event,
      window,
      parent,
      x,
      y,
      overrideRedirect,
    },
    offset,
  }
}
export const marshallReparentNotifyEvent = (instance: ReparentNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window, parent, x, y, overrideRedirect } = instance
    buffers.push(pack('<xx2xIIIhhB3x', event, window, parent, x, y, overrideRedirect))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ReparentNotifyEventHandler extends EventHandler<ReparentNotifyEvent> {}

/**
 *
 * NOT YET DOCUMENTED
 *
 * See:
 *
 * {@link XConnection.freeColormap}
 */
export type ConfigureNotifyEvent = {
  responseType: number
  /**
   * The reconfigured window or its parent, depending on whether `StructureNotify`
   * or `SubstructureNotify` was selected.
   */
  event: WINDOW
  /**
   * The window whose size, position, border, and/or stacking order was changed.
   */
  window: WINDOW
  /**
   * If `XCB_NONE`, the `window` is on the bottom of the stack with respect to
   * sibling windows. However, if set to a sibling window, the `window` is placed on
   * top of this sibling window.
   */
  aboveSibling: WINDOW
  /**
   * The X coordinate of the upper-left outside corner of `window`, relative to the
   * parent window's origin.
   */
  x: number
  /**
   * The Y coordinate of the upper-left outside corner of `window`, relative to the
   * parent window's origin.
   */
  y: number
  /**
   * The inside width of `window`, not including the border.
   */
  width: number
  /**
   * The inside height of `window`, not including the border.
   */
  height: number
  /**
   * The border width of `window`.
   */
  borderWidth: number
  /**
   * Window managers should ignore this window if `override_redirect` is 1.
   */
  overrideRedirect: number
}

export const unmarshallConfigureNotifyEvent: Unmarshaller<ConfigureNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, event, window, aboveSibling, x, y, width, height, borderWidth, overrideRedirect] = unpackFrom(
    '<Bx2xIIIhhHHHBx',
    buffer,
    offset,
  )
  offset += 28

  return {
    value: {
      responseType,
      event,
      window,
      aboveSibling,
      x,
      y,
      width,
      height,
      borderWidth,
      overrideRedirect,
    },
    offset,
  }
}
export const marshallConfigureNotifyEvent = (instance: ConfigureNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window, aboveSibling, x, y, width, height, borderWidth, overrideRedirect } = instance
    buffers.push(
      pack('<xx2xIIIhhHHHBx', event, window, aboveSibling, x, y, width, height, borderWidth, overrideRedirect),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ConfigureNotifyEventHandler extends EventHandler<ConfigureNotifyEvent> {}

export type ConfigureRequestEvent = {
  responseType: number
  stackMode: StackMode
  parent: WINDOW
  window: WINDOW
  sibling: WINDOW
  x: number
  y: number
  width: number
  height: number
  borderWidth: number
  valueMask: number
}

export const unmarshallConfigureRequestEvent: Unmarshaller<ConfigureRequestEvent> = (buffer, offset = 0) => {
  const [responseType, stackMode, parent, window, sibling, x, y, width, height, borderWidth, valueMask] = unpackFrom(
    '<BB2xIIIhhHHHH',
    buffer,
    offset,
  )
  offset += 28

  return {
    value: {
      responseType,
      stackMode,
      parent,
      window,
      sibling,
      x,
      y,
      width,
      height,
      borderWidth,
      valueMask,
    },
    offset,
  }
}
export const marshallConfigureRequestEvent = (instance: ConfigureRequestEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { stackMode, parent, window, sibling, x, y, width, height, borderWidth, valueMask } = instance
    buffers.push(
      pack('<xB2xIIIhhHHHH', stackMode, parent, window, sibling, x, y, width, height, borderWidth, valueMask),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ConfigureRequestEventHandler extends EventHandler<ConfigureRequestEvent> {}

export type GravityNotifyEvent = {
  responseType: number
  event: WINDOW
  window: WINDOW
  x: number
  y: number
}

export const unmarshallGravityNotifyEvent: Unmarshaller<GravityNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, event, window, x, y] = unpackFrom('<Bx2xIIhh', buffer, offset)
  offset += 16

  return {
    value: {
      responseType,
      event,
      window,
      x,
      y,
    },
    offset,
  }
}
export const marshallGravityNotifyEvent = (instance: GravityNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window, x, y } = instance
    buffers.push(pack('<xx2xIIhh', event, window, x, y))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface GravityNotifyEventHandler extends EventHandler<GravityNotifyEvent> {}

export type ResizeRequestEvent = {
  responseType: number
  window: WINDOW
  width: number
  height: number
}

export const unmarshallResizeRequestEvent: Unmarshaller<ResizeRequestEvent> = (buffer, offset = 0) => {
  const [responseType, window, width, height] = unpackFrom('<Bx2xIHH', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      window,
      width,
      height,
    },
    offset,
  }
}
export const marshallResizeRequestEvent = (instance: ResizeRequestEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { window, width, height } = instance
    buffers.push(pack('<xx2xIHH', window, width, height))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ResizeRequestEventHandler extends EventHandler<ResizeRequestEvent> {}

export enum Place {
  OnTop = 0,
  OnBottom = 1,
}

/**
 *
 * NOT YET DOCUMENTED
 *
 * See:
 *
 * {@link XConnection.circulateWindow}
 */
export type CirculateNotifyEvent = {
  responseType: number
  /**
   * Either the restacked window or its parent, depending on whether
   * `StructureNotify` or `SubstructureNotify` was selected.
   */
  event: WINDOW
  /**
   * The restacked window.
   */
  window: WINDOW
  /**
   *
   */
  place: Place
}

export const unmarshallCirculateNotifyEvent: Unmarshaller<CirculateNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, event, window, place] = unpackFrom('<Bx2xII4xB3x', buffer, offset)
  offset += 20

  return {
    value: {
      responseType,
      event,
      window,
      place,
    },
    offset,
  }
}
export const marshallCirculateNotifyEvent = (instance: CirculateNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window, place } = instance
    buffers.push(pack('<xx2xII4xB3x', event, window, place))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface CirculateNotifyEventHandler extends EventHandler<CirculateNotifyEvent> {}

/**
 *
 * NOT YET DOCUMENTED
 *
 * See:
 *
 * {@link XConnection.circulateWindow}
 */
export type CirculateRequestEvent = {
  responseType: number
  /**
   * Either the restacked window or its parent, depending on whether
   * `StructureNotify` or `SubstructureNotify` was selected.
   */
  event: WINDOW
  /**
   * The restacked window.
   */
  window: WINDOW
  /**
   *
   */
  place: Place
}

export const unmarshallCirculateRequestEvent: Unmarshaller<CirculateRequestEvent> = (buffer, offset = 0) => {
  const [responseType, event, window, place] = unpackFrom('<Bx2xII4xB3x', buffer, offset)
  offset += 20

  return {
    value: {
      responseType,
      event,
      window,
      place,
    },
    offset,
  }
}
export const marshallCirculateRequestEvent = (instance: CirculateRequestEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { event, window, place } = instance
    buffers.push(pack('<xx2xII4xB3x', event, window, place))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface CirculateRequestEventHandler extends EventHandler<CirculateRequestEvent> {}

export enum Property {
  NewValue = 0,
  Delete = 1,
}

/**
 *
 * a window property changed
 *
 * See:
 *
 * {@link XConnection.changeProperty}
 */
export type PropertyNotifyEvent = {
  responseType: number
  /**
   * The window whose associated property was changed.
   */
  window: WINDOW
  /**
   * The property's atom, to indicate which property was changed.
   */
  atom: ATOM
  /**
   * A timestamp of the server time when the property was changed.
   */
  time: TIMESTAMP
  /**
   *
   */
  state: Property
}

export const unmarshallPropertyNotifyEvent: Unmarshaller<PropertyNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, window, atom, time, state] = unpackFrom('<Bx2xIIIB3x', buffer, offset)
  offset += 20

  return {
    value: {
      responseType,
      window,
      atom,
      time,
      state,
    },
    offset,
  }
}
export const marshallPropertyNotifyEvent = (instance: PropertyNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { window, atom, time, state } = instance
    buffers.push(pack('<xx2xIIIB3x', window, atom, time, state))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface PropertyNotifyEventHandler extends EventHandler<PropertyNotifyEvent> {}

export type SelectionClearEvent = {
  responseType: number
  time: TIMESTAMP
  owner: WINDOW
  selection: ATOM
}

export const unmarshallSelectionClearEvent: Unmarshaller<SelectionClearEvent> = (buffer, offset = 0) => {
  const [responseType, time, owner, selection] = unpackFrom('<Bx2xIII', buffer, offset)
  offset += 16

  return {
    value: {
      responseType,
      time,
      owner,
      selection,
    },
    offset,
  }
}
export const marshallSelectionClearEvent = (instance: SelectionClearEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { time, owner, selection } = instance
    buffers.push(pack('<xx2xIII', time, owner, selection))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface SelectionClearEventHandler extends EventHandler<SelectionClearEvent> {}

export enum Time {
  CurrentTime = 0,
}

export enum Atom {
  None = 0,
  Any = 0,
  PRIMARY = 1,
  SECONDARY = 2,
  ARC = 3,
  ATOM = 4,
  BITMAP = 5,
  CARDINAL = 6,
  COLORMAP = 7,
  CURSOR = 8,
  cutBuffer0 = 9,
  cutBuffer1 = 10,
  cutBuffer2 = 11,
  cutBuffer3 = 12,
  cutBuffer4 = 13,
  cutBuffer5 = 14,
  cutBuffer6 = 15,
  cutBuffer7 = 16,
  DRAWABLE = 17,
  FONT = 18,
  INTEGER = 19,
  PIXMAP = 20,
  POINT = 21,
  RECTANGLE = 22,
  resourceManager = 23,
  rgbColorMap = 24,
  rgbBestMap = 25,
  rgbBlueMap = 26,
  rgbDefaultMap = 27,
  rgbGrayMap = 28,
  rgbGreenMap = 29,
  rgbRedMap = 30,
  STRING = 31,
  VISUALID = 32,
  WINDOW = 33,
  wmCommand = 34,
  wmHints = 35,
  wmClientMachine = 36,
  wmIconName = 37,
  wmIconSize = 38,
  wmName = 39,
  wmNormalHints = 40,
  wmSizeHints = 41,
  wmZoomHints = 42,
  minSpace = 43,
  normSpace = 44,
  maxSpace = 45,
  endSpace = 46,
  superscriptX = 47,
  superscriptY = 48,
  subscriptX = 49,
  subscriptY = 50,
  underlinePosition = 51,
  underlineThickness = 52,
  strikeoutAscent = 53,
  strikeoutDescent = 54,
  italicAngle = 55,
  xHeight = 56,
  quadWidth = 57,
  WEIGHT = 58,
  pointSize = 59,
  RESOLUTION = 60,
  COPYRIGHT = 61,
  NOTICE = 62,
  fontName = 63,
  familyName = 64,
  fullName = 65,
  capHeight = 66,
  wmClass = 67,
  wmTransientFor = 68,
}

export type SelectionRequestEvent = {
  responseType: number
  time: TIMESTAMP
  owner: WINDOW
  requestor: WINDOW
  selection: ATOM
  target: ATOM
  property: ATOM
}

export const unmarshallSelectionRequestEvent: Unmarshaller<SelectionRequestEvent> = (buffer, offset = 0) => {
  const [responseType, time, owner, requestor, selection, target, property] = unpackFrom('<Bx2xIIIIII', buffer, offset)
  offset += 28

  return {
    value: {
      responseType,
      time,
      owner,
      requestor,
      selection,
      target,
      property,
    },
    offset,
  }
}
export const marshallSelectionRequestEvent = (instance: SelectionRequestEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { time, owner, requestor, selection, target, property } = instance
    buffers.push(pack('<xx2xIIIIII', time, owner, requestor, selection, target, property))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface SelectionRequestEventHandler extends EventHandler<SelectionRequestEvent> {}

export type SelectionNotifyEvent = {
  responseType: number
  time: TIMESTAMP
  requestor: WINDOW
  selection: ATOM
  target: ATOM
  property: ATOM
}

export const unmarshallSelectionNotifyEvent: Unmarshaller<SelectionNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, time, requestor, selection, target, property] = unpackFrom('<Bx2xIIIII', buffer, offset)
  offset += 24

  return {
    value: {
      responseType,
      time,
      requestor,
      selection,
      target,
      property,
    },
    offset,
  }
}
export const marshallSelectionNotifyEvent = (instance: SelectionNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { time, requestor, selection, target, property } = instance
    buffers.push(pack('<xx2xIIIII', time, requestor, selection, target, property))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface SelectionNotifyEventHandler extends EventHandler<SelectionNotifyEvent> {}

export enum ColormapState {
  Uninstalled = 0,
  Installed = 1,
}

export enum Colormap {
  None = 0,
}

/**
 *
 * the colormap for some window changed
 *
 * See:
 *
 * {@link XConnection.freeColormap}
 */
export type ColormapNotifyEvent = {
  responseType: number
  /**
   * The window whose associated colormap is changed, installed or uninstalled.
   */
  window: WINDOW
  /**
   * The colormap which is changed, installed or uninstalled. This is `XCB_NONE`
   * when the colormap is changed by a call to `FreeColormap`.
   */
  colormap: COLORMAP
  _new: number
  /**
   *
   */
  state: ColormapState
}

export const unmarshallColormapNotifyEvent: Unmarshaller<ColormapNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, window, colormap, _new, state] = unpackFrom('<Bx2xIIBB2x', buffer, offset)
  offset += 16

  return {
    value: {
      responseType,
      window,
      colormap,
      _new,
      state,
    },
    offset,
  }
}
export const marshallColormapNotifyEvent = (instance: ColormapNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { window, colormap, _new, state } = instance
    buffers.push(pack('<xx2xIIBB2x', window, colormap, _new, state))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ColormapNotifyEventHandler extends EventHandler<ColormapNotifyEvent> {}

export type ClientMessageData = Partial<{
  data8: Uint8Array
  data16: Uint16Array
  data32: Uint32Array
}>

const unmarshallClientMessageData: Unmarshaller<ClientMessageData> = (buffer, offset = 0) => {
  let size = 0

  const data8WithOffset = xcbSimpleList(buffer, offset, 20, Uint8Array, 1)
  const data8 = data8WithOffset.value
  size = Math.max(size, data8WithOffset.offset - offset)
  const data16WithOffset = xcbSimpleList(buffer, offset, 10, Uint16Array, 2)
  const data16 = data16WithOffset.value
  size = Math.max(size, data16WithOffset.offset - offset)
  const data32WithOffset = xcbSimpleList(buffer, offset, 5, Uint32Array, 4)
  const data32 = data32WithOffset.value
  size = Math.max(size, data32WithOffset.offset - offset)
  offset += size

  return {
    value: {
      data8,
      data16,
      data32,
    },
    offset,
  }
}

export const marshallClientMessageData = (instance: Partial<ClientMessageData>): ArrayBuffer => {
  if (instance.data8 !== undefined) {
    return instance.data8.buffer
  }

  if (instance.data16 !== undefined) {
    return instance.data16.buffer
  }

  if (instance.data32 !== undefined) {
    return instance.data32.buffer
  }

  throw new Error('Empty union argument')
}

/**
 *
 * NOT YET DOCUMENTED
 *
 * This event represents a ClientMessage, sent by another X11 client. An example
 * is a client sending the `_NET_WM_STATE` ClientMessage to the root window
 * to indicate the fullscreen window state, effectively requesting that the window
 * manager puts it into fullscreen mode.
 *
 * See:
 *
 * {@link XConnection.sendEvent}
 */
export type ClientMessageEvent = {
  responseType: number
  /**
   * Specifies how to interpret `data`. Can be either 8, 16 or 32.
   */
  format: number
  window: WINDOW
  /**
   * An atom which indicates how the data should be interpreted by the receiving
   * client.
   */
  _type: ATOM
  /**
   * The data itself (20 bytes max).
   */
  data: ClientMessageData
}

export const unmarshallClientMessageEvent: Unmarshaller<ClientMessageEvent> = (buffer, offset = 0) => {
  const [responseType, format, window, _type] = unpackFrom('<BB2xII', buffer, offset)
  offset += 12
  const dataWithOffset = unmarshallClientMessageData(buffer, offset)
  const data = dataWithOffset.value
  offset = dataWithOffset.offset

  return {
    value: {
      responseType,
      format,
      window,
      _type,
      data,
    },
    offset,
  }
}
export const marshallClientMessageEvent = (instance: ClientMessageEvent): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const { format, window, _type } = instance
  buffers.push(pack('<xB2xII', format, window, _type))
  byteLength += 12
  {
    const buffer = marshallClientMessageData(instance.data)
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface ClientMessageEventHandler extends EventHandler<ClientMessageEvent> {}

export enum Mapping {
  Modifier = 0,
  Keyboard = 1,
  Pointer = 2,
}

/**
 *
 * keyboard mapping changed
 */
export type MappingNotifyEvent = {
  responseType: number
  /**
   *
   */
  request: Mapping
  /**
   * The first number in the range of the altered mapping.
   */
  firstKeycode: KEYCODE
  /**
   * The number of keycodes altered.
   */
  count: number
}

export const unmarshallMappingNotifyEvent: Unmarshaller<MappingNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, request, firstKeycode, count] = unpackFrom('<Bx2xBBBx', buffer, offset)
  offset += 8

  return {
    value: {
      responseType,
      request,
      firstKeycode,
      count,
    },
    offset,
  }
}
export const marshallMappingNotifyEvent = (instance: MappingNotifyEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { request, firstKeycode, count } = instance
    buffers.push(pack('<xx2xBBBx', request, firstKeycode, count))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface MappingNotifyEventHandler extends EventHandler<MappingNotifyEvent> {}

/**
 *
 * generic event (with length)
 */
export type GeGenericEvent = {
  responseType: number
}

export const unmarshallGeGenericEvent: Unmarshaller<GeGenericEvent> = (buffer, offset = 0) => {
  const [responseType] = unpackFrom('<Bx2x4x2x22x', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
    },
    offset,
  }
}
export const marshallGeGenericEvent = (instance: GeGenericEvent): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface GeGenericEventHandler extends EventHandler<GeGenericEvent> {}

export type RequestError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallRequestError: Unmarshaller<RequestError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallRequestError = (instance: RequestError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadRequest extends Error {
  readonly xError: RequestError
  constructor(error: RequestError) {
    super(JSON.stringify(error))
    this.name = 'RequestError'
    this.xError = error
  }
}

export type ValueError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallValueError: Unmarshaller<ValueError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallValueError = (instance: ValueError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadValue extends Error {
  readonly xError: ValueError
  constructor(error: ValueError) {
    super(JSON.stringify(error))
    this.name = 'ValueError'
    this.xError = error
  }
}

export type WindowError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallWindowError: Unmarshaller<WindowError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallWindowError = (instance: WindowError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadWindow extends Error {
  readonly xError: WindowError
  constructor(error: WindowError) {
    super(JSON.stringify(error))
    this.name = 'WindowError'
    this.xError = error
  }
}

export type PixmapError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallPixmapError: Unmarshaller<PixmapError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallPixmapError = (instance: PixmapError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadPixmap extends Error {
  readonly xError: PixmapError
  constructor(error: PixmapError) {
    super(JSON.stringify(error))
    this.name = 'PixmapError'
    this.xError = error
  }
}

export type AtomError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallAtomError: Unmarshaller<AtomError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallAtomError = (instance: AtomError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadAtom extends Error {
  readonly xError: AtomError
  constructor(error: AtomError) {
    super(JSON.stringify(error))
    this.name = 'AtomError'
    this.xError = error
  }
}

export type CursorError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallCursorError: Unmarshaller<CursorError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallCursorError = (instance: CursorError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadCursor extends Error {
  readonly xError: CursorError
  constructor(error: CursorError) {
    super(JSON.stringify(error))
    this.name = 'CursorError'
    this.xError = error
  }
}

export type FontError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallFontError: Unmarshaller<FontError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallFontError = (instance: FontError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadFont extends Error {
  readonly xError: FontError
  constructor(error: FontError) {
    super(JSON.stringify(error))
    this.name = 'FontError'
    this.xError = error
  }
}

export type MatchError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallMatchError: Unmarshaller<MatchError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallMatchError = (instance: MatchError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadMatch extends Error {
  readonly xError: MatchError
  constructor(error: MatchError) {
    super(JSON.stringify(error))
    this.name = 'MatchError'
    this.xError = error
  }
}

export type DrawableError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallDrawableError: Unmarshaller<DrawableError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallDrawableError = (instance: DrawableError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadDrawable extends Error {
  readonly xError: DrawableError
  constructor(error: DrawableError) {
    super(JSON.stringify(error))
    this.name = 'DrawableError'
    this.xError = error
  }
}

export type AccessError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallAccessError: Unmarshaller<AccessError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallAccessError = (instance: AccessError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadAccess extends Error {
  readonly xError: AccessError
  constructor(error: AccessError) {
    super(JSON.stringify(error))
    this.name = 'AccessError'
    this.xError = error
  }
}

export type AllocError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallAllocError: Unmarshaller<AllocError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallAllocError = (instance: AllocError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadAlloc extends Error {
  readonly xError: AllocError
  constructor(error: AllocError) {
    super(JSON.stringify(error))
    this.name = 'AllocError'
    this.xError = error
  }
}

export type ColormapError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallColormapError: Unmarshaller<ColormapError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallColormapError = (instance: ColormapError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadColormap extends Error {
  readonly xError: ColormapError
  constructor(error: ColormapError) {
    super(JSON.stringify(error))
    this.name = 'ColormapError'
    this.xError = error
  }
}

export type GContextError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallGContextError: Unmarshaller<GContextError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallGContextError = (instance: GContextError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadGContext extends Error {
  readonly xError: GContextError
  constructor(error: GContextError) {
    super(JSON.stringify(error))
    this.name = 'GContextError'
    this.xError = error
  }
}

export type IDChoiceError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallIDChoiceError: Unmarshaller<IDChoiceError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallIDChoiceError = (instance: IDChoiceError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadIDChoice extends Error {
  readonly xError: IDChoiceError
  constructor(error: IDChoiceError) {
    super(JSON.stringify(error))
    this.name = 'IDChoiceError'
    this.xError = error
  }
}

export type NameError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallNameError: Unmarshaller<NameError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallNameError = (instance: NameError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadName extends Error {
  readonly xError: NameError
  constructor(error: NameError) {
    super(JSON.stringify(error))
    this.name = 'NameError'
    this.xError = error
  }
}

export type LengthError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallLengthError: Unmarshaller<LengthError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallLengthError = (instance: LengthError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadLength extends Error {
  readonly xError: LengthError
  constructor(error: LengthError) {
    super(JSON.stringify(error))
    this.name = 'LengthError'
    this.xError = error
  }
}

export type ImplementationError = {
  responseType: number
  badValue: number
  minorOpcode: number
  majorOpcode: number
}

export const unmarshallImplementationError: Unmarshaller<ImplementationError> = (buffer, offset = 0) => {
  const [responseType, badValue, minorOpcode, majorOpcode] = unpackFrom('<Bx2xIHBx', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      badValue,
      minorOpcode,
      majorOpcode,
    },
    offset,
  }
}
export const marshallImplementationError = (instance: ImplementationError): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { badValue, minorOpcode, majorOpcode } = instance
    buffers.push(pack('<xx2xIHBx', badValue, minorOpcode, majorOpcode))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export class BadImplementation extends Error {
  readonly xError: ImplementationError
  constructor(error: ImplementationError) {
    super(JSON.stringify(error))
    this.name = 'ImplementationError'
    this.xError = error
  }
}

export enum WindowClass {
  CopyFromParent = 0,
  InputOutput = 1,
  InputOnly = 2,
}

export enum CW {
  BackPixmap = 1,
  BackPixel = 2,
  BorderPixmap = 4,
  BorderPixel = 8,
  BitGravity = 16,
  WinGravity = 32,
  BackingStore = 64,
  BackingPlanes = 128,
  BackingPixel = 256,
  OverrideRedirect = 512,
  SaveUnder = 1024,
  EventMask = 2048,
  DontPropagate = 4096,
  Colormap = 8192,
  Cursor = 16384,
}

export enum BackPixmap {
  None = 0,
  ParentRelative = 1,
}

export enum Gravity {
  BitForget = 0,
  WinUnmap = 0,
  NorthWest = 1,
  North = 2,
  NorthEast = 3,
  West = 4,
  Center = 5,
  East = 6,
  SouthWest = 7,
  South = 8,
  SouthEast = 9,
  Static = 10,
}

export enum MapState {
  Unmapped = 0,
  Unviewable = 1,
  Viewable = 2,
}

export type GetWindowAttributesCookie = Promise<GetWindowAttributesReply>

export type GetWindowAttributesReply = {
  responseType: number
  /**
   *
   */
  backingStore: BackingStore
  /**
   * The associated visual structure of `window`.
   */
  visual: VISUALID
  /**
   *
   */
  _class: WindowClass
  /**
   *
   */
  bitGravity: Gravity
  /**
   *
   */
  winGravity: Gravity
  /**
   * Planes to be preserved if possible.
   */
  backingPlanes: number
  /**
   * Value to be used when restoring planes.
   */
  backingPixel: number
  /**
   * Boolean, should bits under be saved?
   */
  saveUnder: number
  mapIsInstalled: number
  /**
   *
   */
  mapState: MapState
  /**
   * Window managers should ignore this window if `override_redirect` is 1.
   */
  overrideRedirect: number
  /**
   * Color map to be associated with window.
   */
  colormap: COLORMAP
  /**
   * Set of events all people have interest in.
   */
  allEventMasks: number
  /**
   * My event mask.
   */
  yourEventMask: number
  /**
   * Set of events that should not propagate.
   */
  doNotPropagateMask: number
}

export const unmarshallGetWindowAttributesReply: Unmarshaller<GetWindowAttributesReply> = (buffer, offset = 0) => {
  const [
    responseType,
    backingStore,
    visual,
    _class,
    bitGravity,
    winGravity,
    backingPlanes,
    backingPixel,
    saveUnder,
    mapIsInstalled,
    mapState,
    overrideRedirect,
    colormap,
    allEventMasks,
    yourEventMask,
    doNotPropagateMask,
  ] = unpackFrom('<BB2x4xIHBBIIBBBBIIIH2x', buffer, offset)
  offset += 44

  return {
    value: {
      responseType,
      backingStore,
      visual,
      _class,
      bitGravity,
      winGravity,
      backingPlanes,
      backingPixel,
      saveUnder,
      mapIsInstalled,
      mapState,
      overrideRedirect,
      colormap,
      allEventMasks,
      yourEventMask,
      doNotPropagateMask,
    },
    offset,
  }
}

export enum SetMode {
  Insert = 0,
  Delete = 1,
}

export enum ConfigWindow {
  X = 1,
  Y = 2,
  Width = 4,
  Height = 8,
  BorderWidth = 16,
  Sibling = 32,
  StackMode = 64,
}

export enum StackMode {
  Above = 0,
  Below = 1,
  TopIf = 2,
  BottomIf = 3,
  Opposite = 4,
}

export enum Circulate {
  RaiseLowest = 0,
  LowerHighest = 1,
}

export type GetGeometryCookie = Promise<GetGeometryReply>

export type GetGeometryReply = {
  responseType: number
  /**
   * The depth of the drawable (bits per pixel for the object).
   */
  depth: number
  /**
   * Root window of the screen containing `drawable`.
   */
  root: WINDOW
  /**
   * The X coordinate of `drawable`. If `drawable` is a window, the coordinate
   * specifies the upper-left outer corner relative to its parent's origin. If
   * `drawable` is a pixmap, the X coordinate is always 0.
   */
  x: number
  /**
   * The Y coordinate of `drawable`. If `drawable` is a window, the coordinate
   * specifies the upper-left outer corner relative to its parent's origin. If
   * `drawable` is a pixmap, the Y coordinate is always 0.
   */
  y: number
  /**
   * The width of `drawable`.
   */
  width: number
  /**
   * The height of `drawable`.
   */
  height: number
  /**
   * The border width (in pixels).
   */
  borderWidth: number
}

export const unmarshallGetGeometryReply: Unmarshaller<GetGeometryReply> = (buffer, offset = 0) => {
  const [responseType, depth, root, x, y, width, height, borderWidth] = unpackFrom('<BB2x4xIhhHHH2x', buffer, offset)
  offset += 24

  return {
    value: {
      responseType,
      depth,
      root,
      x,
      y,
      width,
      height,
      borderWidth,
    },
    offset,
  }
}

export type QueryTreeCookie = Promise<QueryTreeReply>

export type QueryTreeReply = {
  responseType: number
  /**
   * The root window of `window`.
   */
  root: WINDOW
  /**
   * The parent window of `window`.
   */
  parent: WINDOW
  /**
   * The number of child windows.
   */
  childrenLen: number
  children: Uint32Array
}

export const unmarshallQueryTreeReply: Unmarshaller<QueryTreeReply> = (buffer, offset = 0) => {
  const [responseType, root, parent, childrenLen] = unpackFrom('<Bx2x4xIIH14x', buffer, offset)
  offset += 32
  const childrenWithOffset = xcbSimpleList(buffer, offset, childrenLen, Uint32Array, 4)
  offset = childrenWithOffset.offset
  const children = childrenWithOffset.value

  return {
    value: {
      responseType,
      root,
      parent,
      childrenLen,
      children,
    },
    offset,
  }
}

export type InternAtomCookie = Promise<InternAtomReply>

export type InternAtomReply = {
  responseType: number
  atom: ATOM
}

export const unmarshallInternAtomReply: Unmarshaller<InternAtomReply> = (buffer, offset = 0) => {
  const [responseType, atom] = unpackFrom('<Bx2x4xI', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      atom,
    },
    offset,
  }
}

export type GetAtomNameCookie = Promise<GetAtomNameReply>

export type GetAtomNameReply = {
  responseType: number
  nameLen: number
  name: Int8Array
}

export const unmarshallGetAtomNameReply: Unmarshaller<GetAtomNameReply> = (buffer, offset = 0) => {
  const [responseType, nameLen] = unpackFrom('<Bx2x4xH22x', buffer, offset)
  offset += 32
  const nameWithOffset = xcbSimpleList(buffer, offset, nameLen, Int8Array, 1)
  offset = nameWithOffset.offset
  const name = nameWithOffset.value

  return {
    value: {
      responseType,
      nameLen,
      name,
    },
    offset,
  }
}

export enum PropMode {
  Replace = 0,
  Prepend = 1,
  Append = 2,
}

export enum GetPropertyType {
  Any = 0,
}

export type GetPropertyCookie = Promise<GetPropertyReply>

export type GetPropertyReply = {
  responseType: number
  /**
   * Specifies whether the data should be viewed as a list of 8-bit, 16-bit, or
   * 32-bit quantities. Possible values are 8, 16, and 32. This information allows
   * the X server to correctly perform byte-swap operations as necessary.
   */
  format: number
  /**
   * The actual type of the property (an atom).
   */
  _type: ATOM
  /**
   * The number of bytes remaining to be read in the property if a partial read was
   * performed.
   */
  bytesAfter: number
  /**
   * The length of value. You should use the corresponding accessor instead of this
   * field.
   */
  valueLen: number
  value: Uint8Array
}

export const unmarshallGetPropertyReply: Unmarshaller<GetPropertyReply> = (buffer, offset = 0) => {
  const [responseType, format, _type, bytesAfter, valueLen] = unpackFrom('<BB2x4xIII12x', buffer, offset)
  offset += 32
  const valueWithOffset = xcbSimpleList(buffer, offset, valueLen * (format / 8), Uint8Array, 1)
  offset = valueWithOffset.offset
  const value = valueWithOffset.value

  return {
    value: {
      responseType,
      format,
      _type,
      bytesAfter,
      valueLen,
      value,
    },
    offset,
  }
}

export type ListPropertiesCookie = Promise<ListPropertiesReply>

export type ListPropertiesReply = {
  responseType: number
  atomsLen: number
  atoms: Uint32Array
}

export const unmarshallListPropertiesReply: Unmarshaller<ListPropertiesReply> = (buffer, offset = 0) => {
  const [responseType, atomsLen] = unpackFrom('<Bx2x4xH22x', buffer, offset)
  offset += 32
  const atomsWithOffset = xcbSimpleList(buffer, offset, atomsLen, Uint32Array, 4)
  offset = atomsWithOffset.offset
  const atoms = atomsWithOffset.value

  return {
    value: {
      responseType,
      atomsLen,
      atoms,
    },
    offset,
  }
}

export type GetSelectionOwnerCookie = Promise<GetSelectionOwnerReply>

export type GetSelectionOwnerReply = {
  responseType: number
  /**
   * The current selection owner window.
   */
  owner: WINDOW
}

export const unmarshallGetSelectionOwnerReply: Unmarshaller<GetSelectionOwnerReply> = (buffer, offset = 0) => {
  const [responseType, owner] = unpackFrom('<Bx2x4xI', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      owner,
    },
    offset,
  }
}

export enum SendEventDest {
  PointerWindow = 0,
  ItemFocus = 1,
}

export enum GrabMode {
  Sync = 0,
  Async = 1,
}

export enum GrabStatus {
  Success = 0,
  AlreadyGrabbed = 1,
  InvalidTime = 2,
  NotViewable = 3,
  Frozen = 4,
}

export enum Cursor {
  None = 0,
}

export type GrabPointerCookie = Promise<GrabPointerReply>

export type GrabPointerReply = {
  responseType: number
  status: GrabStatus
}

export const unmarshallGrabPointerReply: Unmarshaller<GrabPointerReply> = (buffer, offset = 0) => {
  const [responseType, status] = unpackFrom('<BB2x4x', buffer, offset)
  offset += 8

  return {
    value: {
      responseType,
      status,
    },
    offset,
  }
}

export enum ButtonIndex {
  Any = 0,
  _1 = 1,
  _2 = 2,
  _3 = 3,
  _4 = 4,
  _5 = 5,
}

export type GrabKeyboardCookie = Promise<GrabKeyboardReply>

export type GrabKeyboardReply = {
  responseType: number
  status: GrabStatus
}

export const unmarshallGrabKeyboardReply: Unmarshaller<GrabKeyboardReply> = (buffer, offset = 0) => {
  const [responseType, status] = unpackFrom('<BB2x4x', buffer, offset)
  offset += 8

  return {
    value: {
      responseType,
      status,
    },
    offset,
  }
}

export enum Grab {
  Any = 0,
}

export enum Allow {
  AsyncPointer = 0,
  SyncPointer = 1,
  ReplayPointer = 2,
  AsyncKeyboard = 3,
  SyncKeyboard = 4,
  ReplayKeyboard = 5,
  AsyncBoth = 6,
  SyncBoth = 7,
}

export type QueryPointerCookie = Promise<QueryPointerReply>

export type QueryPointerReply = {
  responseType: number
  /**
   * If `same_screen` is False, then the pointer is not on the same screen as the
   * argument window, `child` is None, and `win_x` and `win_y` are zero. If
   * `same_screen` is True, then `win_x` and `win_y` are the pointer coordinates
   * relative to the argument window's origin, and child is the child containing the
   * pointer, if any.
   */
  sameScreen: number
  /**
   * The root window the pointer is logically on.
   */
  root: WINDOW
  /**
   * The child window containing the pointer, if any, if `same_screen` is true. If
   * `same_screen` is false, `XCB_NONE` is returned.
   */
  child: WINDOW
  /**
   * The pointer X position, relative to `root`.
   */
  rootX: number
  /**
   * The pointer Y position, relative to `root`.
   */
  rootY: number
  /**
   * The pointer X coordinate, relative to `child`, if `same_screen` is true. Zero
   * otherwise.
   */
  winX: number
  /**
   * The pointer Y coordinate, relative to `child`, if `same_screen` is true. Zero
   * otherwise.
   */
  winY: number
  /**
   * The current logical state of the modifier keys and the buttons. Note that the
   * logical state of a device (as seen by means of the protocol) may lag the
   * physical state if device event processing is frozen.
   */
  mask: number
}

export const unmarshallQueryPointerReply: Unmarshaller<QueryPointerReply> = (buffer, offset = 0) => {
  const [responseType, sameScreen, root, child, rootX, rootY, winX, winY, mask] = unpackFrom(
    '<BB2x4xIIhhhhH2x',
    buffer,
    offset,
  )
  offset += 28

  return {
    value: {
      responseType,
      sameScreen,
      root,
      child,
      rootX,
      rootY,
      winX,
      winY,
      mask,
    },
    offset,
  }
}

export type TIMECOORD = {
  time: TIMESTAMP
  x: number
  y: number
}

export const unmarshallTIMECOORD: Unmarshaller<TIMECOORD> = (buffer, offset = 0) => {
  const [time, x, y] = unpackFrom('<Ihh', buffer, offset)
  offset += 8

  return {
    value: {
      time,
      x,
      y,
    },
    offset,
  }
}
export const marshallTIMECOORD = (instance: TIMECOORD): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { time, x, y } = instance
    buffers.push(pack('<Ihh', time, x, y))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type GetMotionEventsCookie = Promise<GetMotionEventsReply>

export type GetMotionEventsReply = {
  responseType: number
  eventsLen: number
  events: TIMECOORD[]
}

export const unmarshallGetMotionEventsReply: Unmarshaller<GetMotionEventsReply> = (buffer, offset = 0) => {
  const [responseType, eventsLen] = unpackFrom('<Bx2x4xI20x', buffer, offset)
  offset += 32
  const eventsWithOffset = xcbComplexList(buffer, offset, eventsLen, unmarshallTIMECOORD)
  offset = eventsWithOffset.offset
  const events = eventsWithOffset.value

  return {
    value: {
      responseType,
      eventsLen,
      events,
    },
    offset,
  }
}

export type TranslateCoordinatesCookie = Promise<TranslateCoordinatesReply>

export type TranslateCoordinatesReply = {
  responseType: number
  sameScreen: number
  child: WINDOW
  dstX: number
  dstY: number
}

export const unmarshallTranslateCoordinatesReply: Unmarshaller<TranslateCoordinatesReply> = (buffer, offset = 0) => {
  const [responseType, sameScreen, child, dstX, dstY] = unpackFrom('<BB2x4xIhh', buffer, offset)
  offset += 16

  return {
    value: {
      responseType,
      sameScreen,
      child,
      dstX,
      dstY,
    },
    offset,
  }
}

export enum InputFocus {
  None = 0,
  PointerRoot = 1,
  Parent = 2,
  FollowKeyboard = 3,
}

export type GetInputFocusCookie = Promise<GetInputFocusReply>

export type GetInputFocusReply = {
  responseType: number
  revertTo: InputFocus
  focus: WINDOW
}

export const unmarshallGetInputFocusReply: Unmarshaller<GetInputFocusReply> = (buffer, offset = 0) => {
  const [responseType, revertTo, focus] = unpackFrom('<BB2x4xI', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      revertTo,
      focus,
    },
    offset,
  }
}

export type QueryKeymapCookie = Promise<QueryKeymapReply>

export type QueryKeymapReply = {
  responseType: number
  keys: Uint8Array
}

export const unmarshallQueryKeymapReply: Unmarshaller<QueryKeymapReply> = (buffer, offset = 0) => {
  const [responseType] = unpackFrom('<Bx2x4x', buffer, offset)
  offset += 8
  const keysWithOffset = xcbSimpleList(buffer, offset, 32, Uint8Array, 1)
  offset = keysWithOffset.offset
  const keys = keysWithOffset.value

  return {
    value: {
      responseType,
      keys,
    },
    offset,
  }
}

export enum FontDraw {
  LeftToRight = 0,
  RightToLeft = 1,
}

export type FONTPROP = {
  name: ATOM
  value: number
}

export const unmarshallFONTPROP: Unmarshaller<FONTPROP> = (buffer, offset = 0) => {
  const [name, value] = unpackFrom('<II', buffer, offset)
  offset += 8

  return {
    value: {
      name,
      value,
    },
    offset,
  }
}
export const marshallFONTPROP = (instance: FONTPROP): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { name, value } = instance
    buffers.push(pack('<II', name, value))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type CHARINFO = {
  leftSideBearing: number
  rightSideBearing: number
  characterWidth: number
  ascent: number
  descent: number
  attributes: number
}

export const unmarshallCHARINFO: Unmarshaller<CHARINFO> = (buffer, offset = 0) => {
  const [leftSideBearing, rightSideBearing, characterWidth, ascent, descent, attributes] = unpackFrom(
    '<hhhhhH',
    buffer,
    offset,
  )
  offset += 12

  return {
    value: {
      leftSideBearing,
      rightSideBearing,
      characterWidth,
      ascent,
      descent,
      attributes,
    },
    offset,
  }
}
export const marshallCHARINFO = (instance: CHARINFO): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { leftSideBearing, rightSideBearing, characterWidth, ascent, descent, attributes } = instance
    buffers.push(pack('<hhhhhH', leftSideBearing, rightSideBearing, characterWidth, ascent, descent, attributes))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type QueryFontCookie = Promise<QueryFontReply>

export type QueryFontReply = {
  responseType: number
  /**
   * minimum bounds over all existing char
   */
  minBounds: CHARINFO
  /**
   * maximum bounds over all existing char
   */
  maxBounds: CHARINFO
  /**
   * first character
   */
  minCharOrByte2: number
  /**
   * last character
   */
  maxCharOrByte2: number
  /**
   * char to print for undefined character
   */
  defaultChar: number
  /**
   * how many properties there are
   */
  propertiesLen: number
  /**
   *
   */
  drawDirection: FontDraw
  minByte1: number
  maxByte1: number
  /**
   * flag if all characters have nonzero size
   */
  allCharsExist: number
  /**
   * baseline to top edge of raster
   */
  fontAscent: number
  /**
   * baseline to bottom edge of raster
   */
  fontDescent: number
  charInfosLen: number
  properties: FONTPROP[]
  charInfos: CHARINFO[]
}

export const unmarshallQueryFontReply: Unmarshaller<QueryFontReply> = (buffer, offset = 0) => {
  const [responseType] = unpackFrom('<Bx2x4x', buffer, offset)
  offset += 8
  const minBoundsWithOffset = unmarshallCHARINFO(buffer, offset)
  const minBounds = minBoundsWithOffset.value
  offset = minBoundsWithOffset.offset
  offset += typePad(12, offset)
  const maxBoundsWithOffset = unmarshallCHARINFO(buffer, offset)
  const maxBounds = maxBoundsWithOffset.value
  offset = maxBoundsWithOffset.offset
  const [
    minCharOrByte2,
    maxCharOrByte2,
    defaultChar,
    propertiesLen,
    drawDirection,
    minByte1,
    maxByte1,
    allCharsExist,
    fontAscent,
    fontDescent,
    charInfosLen,
  ] = unpackFrom('<4xHHHHBBBBhhI', buffer, offset)
  offset += 24
  offset += typePad(8, offset)
  const propertiesWithOffset = xcbComplexList(buffer, offset, propertiesLen, unmarshallFONTPROP)
  offset = propertiesWithOffset.offset
  const properties = propertiesWithOffset.value
  offset += typePad(12, offset)
  const charInfosWithOffset = xcbComplexList(buffer, offset, charInfosLen, unmarshallCHARINFO)
  offset = charInfosWithOffset.offset
  const charInfos = charInfosWithOffset.value

  return {
    value: {
      responseType,
      minBounds,
      maxBounds,
      minCharOrByte2,
      maxCharOrByte2,
      defaultChar,
      propertiesLen,
      drawDirection,
      minByte1,
      maxByte1,
      allCharsExist,
      fontAscent,
      fontDescent,
      charInfosLen,
      properties,
      charInfos,
    },
    offset,
  }
}

export type QueryTextExtentsCookie = Promise<QueryTextExtentsReply>

export type QueryTextExtentsReply = {
  responseType: number
  drawDirection: FontDraw
  fontAscent: number
  fontDescent: number
  overallAscent: number
  overallDescent: number
  overallWidth: number
  overallLeft: number
  overallRight: number
}

export const unmarshallQueryTextExtentsReply: Unmarshaller<QueryTextExtentsReply> = (buffer, offset = 0) => {
  const [
    responseType,
    drawDirection,
    fontAscent,
    fontDescent,
    overallAscent,
    overallDescent,
    overallWidth,
    overallLeft,
    overallRight,
  ] = unpackFrom('<BB2x4xhhhhiii', buffer, offset)
  offset += 28

  return {
    value: {
      responseType,
      drawDirection,
      fontAscent,
      fontDescent,
      overallAscent,
      overallDescent,
      overallWidth,
      overallLeft,
      overallRight,
    },
    offset,
  }
}

export type STR = {
  nameLen: number
  name: Int8Array
}

export const unmarshallSTR: Unmarshaller<STR> = (buffer, offset = 0) => {
  const [nameLen] = unpackFrom('<B', buffer, offset)
  offset += 1
  const nameWithOffset = xcbSimpleList(buffer, offset, nameLen, Int8Array, 1)
  offset = nameWithOffset.offset
  const name = nameWithOffset.value

  return {
    value: {
      nameLen,
      name,
    },
    offset,
  }
}
export const marshallSTR = (instance: STR): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const { nameLen } = instance
  buffers.push(pack('<B', nameLen))
  byteLength += 1
  {
    const buffer = instance.name.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type ListFontsCookie = Promise<ListFontsReply>

export type ListFontsReply = {
  responseType: number
  /**
   * The number of font names.
   */
  namesLen: number
  names: STR[]
}

export const unmarshallListFontsReply: Unmarshaller<ListFontsReply> = (buffer, offset = 0) => {
  const [responseType, namesLen] = unpackFrom('<Bx2x4xH22x', buffer, offset)
  offset += 32
  const namesWithOffset = xcbComplexList(buffer, offset, namesLen, unmarshallSTR)
  offset = namesWithOffset.offset
  const names = namesWithOffset.value

  return {
    value: {
      responseType,
      namesLen,
      names,
    },
    offset,
  }
}

export type ListFontsWithInfoCookie = Promise<ListFontsWithInfoReply>

export type ListFontsWithInfoReply = {
  responseType: number
  /**
   * The number of matched font names.
   */
  nameLen: number
  /**
   * minimum bounds over all existing char
   */
  minBounds: CHARINFO
  /**
   * maximum bounds over all existing char
   */
  maxBounds: CHARINFO
  /**
   * first character
   */
  minCharOrByte2: number
  /**
   * last character
   */
  maxCharOrByte2: number
  /**
   * char to print for undefined character
   */
  defaultChar: number
  /**
   * how many properties there are
   */
  propertiesLen: number
  /**
   *
   */
  drawDirection: FontDraw
  minByte1: number
  maxByte1: number
  /**
   * flag if all characters have nonzero size
   */
  allCharsExist: number
  /**
   * baseline to top edge of raster
   */
  fontAscent: number
  /**
   * baseline to bottom edge of raster
   */
  fontDescent: number
  /**
   * An indication of how many more fonts will be returned. This is only a hint and
   * may be larger or smaller than the number of fonts actually returned. A zero
   * value does not guarantee that no more fonts will be returned.
   */
  repliesHint: number
  properties: FONTPROP[]
  name: Int8Array
}

export const unmarshallListFontsWithInfoReply: Unmarshaller<ListFontsWithInfoReply> = (buffer, offset = 0) => {
  const [responseType, nameLen] = unpackFrom('<BB2x4x', buffer, offset)
  offset += 8
  const minBoundsWithOffset = unmarshallCHARINFO(buffer, offset)
  const minBounds = minBoundsWithOffset.value
  offset = minBoundsWithOffset.offset
  offset += typePad(12, offset)
  const maxBoundsWithOffset = unmarshallCHARINFO(buffer, offset)
  const maxBounds = maxBoundsWithOffset.value
  offset = maxBoundsWithOffset.offset
  const [
    minCharOrByte2,
    maxCharOrByte2,
    defaultChar,
    propertiesLen,
    drawDirection,
    minByte1,
    maxByte1,
    allCharsExist,
    fontAscent,
    fontDescent,
    repliesHint,
  ] = unpackFrom('<4xHHHHBBBBhhI', buffer, offset)
  offset += 24
  offset += typePad(8, offset)
  const propertiesWithOffset = xcbComplexList(buffer, offset, propertiesLen, unmarshallFONTPROP)
  offset = propertiesWithOffset.offset
  const properties = propertiesWithOffset.value
  offset += typePad(1, offset)
  const nameWithOffset = xcbSimpleList(buffer, offset, nameLen, Int8Array, 1)
  offset = nameWithOffset.offset
  const name = nameWithOffset.value

  return {
    value: {
      responseType,
      nameLen,
      minBounds,
      maxBounds,
      minCharOrByte2,
      maxCharOrByte2,
      defaultChar,
      propertiesLen,
      drawDirection,
      minByte1,
      maxByte1,
      allCharsExist,
      fontAscent,
      fontDescent,
      repliesHint,
      properties,
      name,
    },
    offset,
  }
}

export type GetFontPathCookie = Promise<GetFontPathReply>

export type GetFontPathReply = {
  responseType: number
  pathLen: number
  path: STR[]
}

export const unmarshallGetFontPathReply: Unmarshaller<GetFontPathReply> = (buffer, offset = 0) => {
  const [responseType, pathLen] = unpackFrom('<Bx2x4xH22x', buffer, offset)
  offset += 32
  const pathWithOffset = xcbComplexList(buffer, offset, pathLen, unmarshallSTR)
  offset = pathWithOffset.offset
  const path = pathWithOffset.value

  return {
    value: {
      responseType,
      pathLen,
      path,
    },
    offset,
  }
}

export enum GC {
  Function = 1,
  PlaneMask = 2,
  Foreground = 4,
  Background = 8,
  LineWidth = 16,
  LineStyle = 32,
  CapStyle = 64,
  JoinStyle = 128,
  FillStyle = 256,
  FillRule = 512,
  Tile = 1024,
  Stipple = 2048,
  TileStippleOriginX = 4096,
  TileStippleOriginY = 8192,
  Font = 16384,
  SubwindowMode = 32768,
  GraphicsExposures = 65536,
  ClipOriginX = 131072,
  ClipOriginY = 262144,
  ClipMask = 524288,
  DashOffset = 1048576,
  DashList = 2097152,
  ArcMode = 4194304,
}

export enum GX {
  clear = 0,
  and = 1,
  andReverse = 2,
  copy = 3,
  andInverted = 4,
  noop = 5,
  xor = 6,
  or = 7,
  nor = 8,
  equiv = 9,
  invert = 10,
  orReverse = 11,
  copyInverted = 12,
  orInverted = 13,
  nand = 14,
  set = 15,
}

export enum LineStyle {
  Solid = 0,
  OnOffDash = 1,
  DoubleDash = 2,
}

export enum CapStyle {
  NotLast = 0,
  Butt = 1,
  Round = 2,
  Projecting = 3,
}

export enum JoinStyle {
  Miter = 0,
  Round = 1,
  Bevel = 2,
}

export enum FillStyle {
  Solid = 0,
  Tiled = 1,
  Stippled = 2,
  OpaqueStippled = 3,
}

export enum FillRule {
  EvenOdd = 0,
  Winding = 1,
}

export enum SubwindowMode {
  ClipByChildren = 0,
  IncludeInferiors = 1,
}

export enum ArcMode {
  Chord = 0,
  PieSlice = 1,
}

export enum ClipOrdering {
  Unsorted = 0,
  YSorted = 1,
  YXSorted = 2,
  YXBanded = 3,
}

export enum CoordMode {
  Origin = 0,
  Previous = 1,
}

export type SEGMENT = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export const unmarshallSEGMENT: Unmarshaller<SEGMENT> = (buffer, offset = 0) => {
  const [x1, y1, x2, y2] = unpackFrom('<hhhh', buffer, offset)
  offset += 8

  return {
    value: {
      x1,
      y1,
      x2,
      y2,
    },
    offset,
  }
}
export const marshallSEGMENT = (instance: SEGMENT): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { x1, y1, x2, y2 } = instance
    buffers.push(pack('<hhhh', x1, y1, x2, y2))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export enum PolyShape {
  Complex = 0,
  Nonconvex = 1,
  Convex = 2,
}

export enum ImageFormat {
  XYBitmap = 0,
  XYPixmap = 1,
  ZPixmap = 2,
}

export type GetImageCookie = Promise<GetImageReply>

export type GetImageReply = {
  responseType: number
  depth: number
  visual: VISUALID
  data: Uint8Array
}

export const unmarshallGetImageReply: Unmarshaller<GetImageReply> = (buffer, offset = 0) => {
  const [responseType, depth, visual] = unpackFrom('<BB2x4xI20x', buffer, offset)
  offset += 32
  // FIXME length is wrong and should come from unpackFrom
  const length = 1
  const dataWithOffset = xcbSimpleList(buffer, offset, length * 4, Uint8Array, 1)
  offset = dataWithOffset.offset
  const data = dataWithOffset.value

  return {
    value: {
      responseType,
      depth,
      visual,
      data,
    },
    offset,
  }
}

export enum ColormapAlloc {
  None = 0,
  All = 1,
}

export type ListInstalledColormapsCookie = Promise<ListInstalledColormapsReply>

export type ListInstalledColormapsReply = {
  responseType: number
  cmapsLen: number
  cmaps: Uint32Array
}

export const unmarshallListInstalledColormapsReply: Unmarshaller<ListInstalledColormapsReply> = (
  buffer,
  offset = 0,
) => {
  const [responseType, cmapsLen] = unpackFrom('<Bx2x4xH22x', buffer, offset)
  offset += 32
  const cmapsWithOffset = xcbSimpleList(buffer, offset, cmapsLen, Uint32Array, 4)
  offset = cmapsWithOffset.offset
  const cmaps = cmapsWithOffset.value

  return {
    value: {
      responseType,
      cmapsLen,
      cmaps,
    },
    offset,
  }
}

export type AllocColorCookie = Promise<AllocColorReply>

export type AllocColorReply = {
  responseType: number
  red: number
  green: number
  blue: number
  pixel: number
}

export const unmarshallAllocColorReply: Unmarshaller<AllocColorReply> = (buffer, offset = 0) => {
  const [responseType, red, green, blue, pixel] = unpackFrom('<Bx2x4xHHH2xI', buffer, offset)
  offset += 20

  return {
    value: {
      responseType,
      red,
      green,
      blue,
      pixel,
    },
    offset,
  }
}

export type AllocNamedColorCookie = Promise<AllocNamedColorReply>

export type AllocNamedColorReply = {
  responseType: number
  pixel: number
  exactRed: number
  exactGreen: number
  exactBlue: number
  visualRed: number
  visualGreen: number
  visualBlue: number
}

export const unmarshallAllocNamedColorReply: Unmarshaller<AllocNamedColorReply> = (buffer, offset = 0) => {
  const [responseType, pixel, exactRed, exactGreen, exactBlue, visualRed, visualGreen, visualBlue] = unpackFrom(
    '<Bx2x4xIHHHHHH',
    buffer,
    offset,
  )
  offset += 24

  return {
    value: {
      responseType,
      pixel,
      exactRed,
      exactGreen,
      exactBlue,
      visualRed,
      visualGreen,
      visualBlue,
    },
    offset,
  }
}

export type AllocColorCellsCookie = Promise<AllocColorCellsReply>

export type AllocColorCellsReply = {
  responseType: number
  pixelsLen: number
  masksLen: number
  pixels: Uint32Array
  masks: Uint32Array
}

export const unmarshallAllocColorCellsReply: Unmarshaller<AllocColorCellsReply> = (buffer, offset = 0) => {
  const [responseType, pixelsLen, masksLen] = unpackFrom('<Bx2x4xHH20x', buffer, offset)
  offset += 32
  const pixelsWithOffset = xcbSimpleList(buffer, offset, pixelsLen, Uint32Array, 4)
  offset = pixelsWithOffset.offset
  const pixels = pixelsWithOffset.value
  offset += typePad(4, offset)
  const masksWithOffset = xcbSimpleList(buffer, offset, masksLen, Uint32Array, 4)
  offset = masksWithOffset.offset
  const masks = masksWithOffset.value

  return {
    value: {
      responseType,
      pixelsLen,
      masksLen,
      pixels,
      masks,
    },
    offset,
  }
}

export type AllocColorPlanesCookie = Promise<AllocColorPlanesReply>

export type AllocColorPlanesReply = {
  responseType: number
  pixelsLen: number
  redMask: number
  greenMask: number
  blueMask: number
  pixels: Uint32Array
}

export const unmarshallAllocColorPlanesReply: Unmarshaller<AllocColorPlanesReply> = (buffer, offset = 0) => {
  const [responseType, pixelsLen, redMask, greenMask, blueMask] = unpackFrom('<Bx2x4xH2xIII8x', buffer, offset)
  offset += 32
  const pixelsWithOffset = xcbSimpleList(buffer, offset, pixelsLen, Uint32Array, 4)
  offset = pixelsWithOffset.offset
  const pixels = pixelsWithOffset.value

  return {
    value: {
      responseType,
      pixelsLen,
      redMask,
      greenMask,
      blueMask,
      pixels,
    },
    offset,
  }
}

export enum ColorFlag {
  Red = 1,
  Green = 2,
  Blue = 4,
}

export type COLORITEM = {
  pixel: number
  red: number
  green: number
  blue: number
  flags: number
}

export const unmarshallCOLORITEM: Unmarshaller<COLORITEM> = (buffer, offset = 0) => {
  const [pixel, red, green, blue, flags] = unpackFrom('<IHHHBx', buffer, offset)
  offset += 12

  return {
    value: {
      pixel,
      red,
      green,
      blue,
      flags,
    },
    offset,
  }
}
export const marshallCOLORITEM = (instance: COLORITEM): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { pixel, red, green, blue, flags } = instance
    buffers.push(pack('<IHHHBx', pixel, red, green, blue, flags))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type RGB = {
  red: number
  green: number
  blue: number
}

export const unmarshallRGB: Unmarshaller<RGB> = (buffer, offset = 0) => {
  const [red, green, blue] = unpackFrom('<HHH2x', buffer, offset)
  offset += 8

  return {
    value: {
      red,
      green,
      blue,
    },
    offset,
  }
}
export const marshallRGB = (instance: RGB): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  {
    const { red, green, blue } = instance
    buffers.push(pack('<HHH2x', red, green, blue))
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type QueryColorsCookie = Promise<QueryColorsReply>

export type QueryColorsReply = {
  responseType: number
  colorsLen: number
  colors: RGB[]
}

export const unmarshallQueryColorsReply: Unmarshaller<QueryColorsReply> = (buffer, offset = 0) => {
  const [responseType, colorsLen] = unpackFrom('<Bx2x4xH22x', buffer, offset)
  offset += 32
  const colorsWithOffset = xcbComplexList(buffer, offset, colorsLen, unmarshallRGB)
  offset = colorsWithOffset.offset
  const colors = colorsWithOffset.value

  return {
    value: {
      responseType,
      colorsLen,
      colors,
    },
    offset,
  }
}

export type LookupColorCookie = Promise<LookupColorReply>

export type LookupColorReply = {
  responseType: number
  exactRed: number
  exactGreen: number
  exactBlue: number
  visualRed: number
  visualGreen: number
  visualBlue: number
}

export const unmarshallLookupColorReply: Unmarshaller<LookupColorReply> = (buffer, offset = 0) => {
  const [responseType, exactRed, exactGreen, exactBlue, visualRed, visualGreen, visualBlue] = unpackFrom(
    '<Bx2x4xHHHHHH',
    buffer,
    offset,
  )
  offset += 20

  return {
    value: {
      responseType,
      exactRed,
      exactGreen,
      exactBlue,
      visualRed,
      visualGreen,
      visualBlue,
    },
    offset,
  }
}

export enum Pixmap {
  None = 0,
}

export enum Font {
  None = 0,
}

export enum QueryShapeOf {
  LargestCursor = 0,
  FastestTile = 1,
  FastestStipple = 2,
}

export type QueryBestSizeCookie = Promise<QueryBestSizeReply>

export type QueryBestSizeReply = {
  responseType: number
  width: number
  height: number
}

export const unmarshallQueryBestSizeReply: Unmarshaller<QueryBestSizeReply> = (buffer, offset = 0) => {
  const [responseType, width, height] = unpackFrom('<Bx2x4xHH', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      width,
      height,
    },
    offset,
  }
}

export type QueryExtensionCookie = Promise<QueryExtensionReply>

export type QueryExtensionReply = {
  responseType: number
  /**
   * Whether the extension is present on this X11 server.
   */
  present: number
  /**
   * The major opcode for requests.
   */
  majorOpcode: number
  /**
   * The first event code, if any.
   */
  firstEvent: number
  /**
   * The first error code, if any.
   */
  firstError: number
}

export const unmarshallQueryExtensionReply: Unmarshaller<QueryExtensionReply> = (buffer, offset = 0) => {
  const [responseType, present, majorOpcode, firstEvent, firstError] = unpackFrom('<Bx2x4xBBBB', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      present,
      majorOpcode,
      firstEvent,
      firstError,
    },
    offset,
  }
}

export type ListExtensionsCookie = Promise<ListExtensionsReply>

export type ListExtensionsReply = {
  responseType: number
  namesLen: number
  names: STR[]
}

export const unmarshallListExtensionsReply: Unmarshaller<ListExtensionsReply> = (buffer, offset = 0) => {
  const [responseType, namesLen] = unpackFrom('<BB2x4x24x', buffer, offset)
  offset += 32
  const namesWithOffset = xcbComplexList(buffer, offset, namesLen, unmarshallSTR)
  offset = namesWithOffset.offset
  const names = namesWithOffset.value

  return {
    value: {
      responseType,
      namesLen,
      names,
    },
    offset,
  }
}

export type GetKeyboardMappingCookie = Promise<GetKeyboardMappingReply>

export type GetKeyboardMappingReply = {
  responseType: number
  keysymsPerKeycode: number
  keysyms: Uint32Array
}

export const unmarshallGetKeyboardMappingReply: Unmarshaller<GetKeyboardMappingReply> = (buffer, offset = 0) => {
  const [responseType, keysymsPerKeycode] = unpackFrom('<BB2x4x24x', buffer, offset)
  offset += 32
  // FIXME length is wrong and should come from unpackFrom
  const length = 1
  const keysymsWithOffset = xcbSimpleList(buffer, offset, length, Uint32Array, 4)
  offset = keysymsWithOffset.offset
  const keysyms = keysymsWithOffset.value

  return {
    value: {
      responseType,
      keysymsPerKeycode,
      keysyms,
    },
    offset,
  }
}

export enum KB {
  KeyClickPercent = 1,
  BellPercent = 2,
  BellPitch = 4,
  BellDuration = 8,
  Led = 16,
  LedMode = 32,
  Key = 64,
  AutoRepeatMode = 128,
}

export enum LedMode {
  Off = 0,
  On = 1,
}

export enum AutoRepeatMode {
  Off = 0,
  On = 1,
  Default = 2,
}

export type GetKeyboardControlCookie = Promise<GetKeyboardControlReply>

export type GetKeyboardControlReply = {
  responseType: number
  globalAutoRepeat: AutoRepeatMode
  ledMask: number
  keyClickPercent: number
  bellPercent: number
  bellPitch: number
  bellDuration: number
  autoRepeats: Uint8Array
}

export const unmarshallGetKeyboardControlReply: Unmarshaller<GetKeyboardControlReply> = (buffer, offset = 0) => {
  const [responseType, globalAutoRepeat, ledMask, keyClickPercent, bellPercent, bellPitch, bellDuration] = unpackFrom(
    '<BB2x4xIBBHH2x',
    buffer,
    offset,
  )
  offset += 20
  const autoRepeatsWithOffset = xcbSimpleList(buffer, offset, 32, Uint8Array, 1)
  offset = autoRepeatsWithOffset.offset
  const autoRepeats = autoRepeatsWithOffset.value

  return {
    value: {
      responseType,
      globalAutoRepeat,
      ledMask,
      keyClickPercent,
      bellPercent,
      bellPitch,
      bellDuration,
      autoRepeats,
    },
    offset,
  }
}

export type GetPointerControlCookie = Promise<GetPointerControlReply>

export type GetPointerControlReply = {
  responseType: number
  accelerationNumerator: number
  accelerationDenominator: number
  threshold: number
}

export const unmarshallGetPointerControlReply: Unmarshaller<GetPointerControlReply> = (buffer, offset = 0) => {
  const [responseType, accelerationNumerator, accelerationDenominator, threshold] = unpackFrom(
    '<Bx2x4xHHH18x',
    buffer,
    offset,
  )
  offset += 32

  return {
    value: {
      responseType,
      accelerationNumerator,
      accelerationDenominator,
      threshold,
    },
    offset,
  }
}

export enum Blanking {
  NotPreferred = 0,
  Preferred = 1,
  Default = 2,
}

export enum Exposures {
  NotAllowed = 0,
  Allowed = 1,
  Default = 2,
}

export type GetScreenSaverCookie = Promise<GetScreenSaverReply>

export type GetScreenSaverReply = {
  responseType: number
  timeout: number
  interval: number
  preferBlanking: Blanking
  allowExposures: Exposures
}

export const unmarshallGetScreenSaverReply: Unmarshaller<GetScreenSaverReply> = (buffer, offset = 0) => {
  const [responseType, timeout, interval, preferBlanking, allowExposures] = unpackFrom('<Bx2x4xHHBB18x', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
      timeout,
      interval,
      preferBlanking,
      allowExposures,
    },
    offset,
  }
}

export enum HostMode {
  Insert = 0,
  Delete = 1,
}

export enum Family {
  Internet = 0,
  DECnet = 1,
  Chaos = 2,
  ServerInterpreted = 5,
  Internet6 = 6,
}

export type HOST = {
  family: Family
  addressLen: number
  address: Uint8Array
}

export const unmarshallHOST: Unmarshaller<HOST> = (buffer, offset = 0) => {
  const [family, addressLen] = unpackFrom('<BxH', buffer, offset)
  offset += 4
  const addressWithOffset = xcbSimpleList(buffer, offset, addressLen, Uint8Array, 1)
  offset = addressWithOffset.offset
  const address = addressWithOffset.value

  return {
    value: {
      family,
      addressLen,
      address,
    },
    offset,
  }
}
export const marshallHOST = (instance: HOST): ArrayBuffer => {
  let byteLength = 0
  const buffers: ArrayBuffer[] = []
  const { family, addressLen } = instance
  buffers.push(pack('<BxH', family, addressLen))
  byteLength += 4
  {
    const buffer = instance.address.buffer
    buffers.push(buffer)
    byteLength += buffer.byteLength
  }
  return concatArrayBuffers(buffers, byteLength)
}

export type ListHostsCookie = Promise<ListHostsReply>

export type ListHostsReply = {
  responseType: number
  mode: AccessControl
  hostsLen: number
  hosts: HOST[]
}

export const unmarshallListHostsReply: Unmarshaller<ListHostsReply> = (buffer, offset = 0) => {
  const [responseType, mode, hostsLen] = unpackFrom('<BB2x4xH22x', buffer, offset)
  offset += 32
  const hostsWithOffset = xcbComplexList(buffer, offset, hostsLen, unmarshallHOST)
  offset = hostsWithOffset.offset
  const hosts = hostsWithOffset.value

  return {
    value: {
      responseType,
      mode,
      hostsLen,
      hosts,
    },
    offset,
  }
}

export enum AccessControl {
  Disable = 0,
  Enable = 1,
}

export enum CloseDown {
  DestroyAll = 0,
  RetainPermanent = 1,
  RetainTemporary = 2,
}

export enum Kill {
  AllTemporary = 0,
}

export enum ScreenSaver {
  Reset = 0,
  Active = 1,
}

export enum MappingStatus {
  Success = 0,
  Busy = 1,
  Failure = 2,
}

export type SetPointerMappingCookie = Promise<SetPointerMappingReply>

export type SetPointerMappingReply = {
  responseType: number
  status: MappingStatus
}

export const unmarshallSetPointerMappingReply: Unmarshaller<SetPointerMappingReply> = (buffer, offset = 0) => {
  const [responseType, status] = unpackFrom('<BB2x4x', buffer, offset)
  offset += 8

  return {
    value: {
      responseType,
      status,
    },
    offset,
  }
}

export type GetPointerMappingCookie = Promise<GetPointerMappingReply>

export type GetPointerMappingReply = {
  responseType: number
  mapLen: number
  map: Uint8Array
}

export const unmarshallGetPointerMappingReply: Unmarshaller<GetPointerMappingReply> = (buffer, offset = 0) => {
  const [responseType, mapLen] = unpackFrom('<BB2x4x24x', buffer, offset)
  offset += 32
  const mapWithOffset = xcbSimpleList(buffer, offset, mapLen, Uint8Array, 1)
  offset = mapWithOffset.offset
  const map = mapWithOffset.value

  return {
    value: {
      responseType,
      mapLen,
      map,
    },
    offset,
  }
}

export enum MapIndex {
  Shift = 0,
  Lock = 1,
  Control = 2,
  _1 = 3,
  _2 = 4,
  _3 = 5,
  _4 = 6,
  _5 = 7,
}

export type SetModifierMappingCookie = Promise<SetModifierMappingReply>

export type SetModifierMappingReply = {
  responseType: number
  status: MappingStatus
}

export const unmarshallSetModifierMappingReply: Unmarshaller<SetModifierMappingReply> = (buffer, offset = 0) => {
  const [responseType, status] = unpackFrom('<BB2x4x', buffer, offset)
  offset += 8

  return {
    value: {
      responseType,
      status,
    },
    offset,
  }
}

export type GetModifierMappingCookie = Promise<GetModifierMappingReply>

export type GetModifierMappingReply = {
  responseType: number
  keycodesPerModifier: number
  keycodes: Uint8Array
}

export const unmarshallGetModifierMappingReply: Unmarshaller<GetModifierMappingReply> = (buffer, offset = 0) => {
  const [responseType, keycodesPerModifier] = unpackFrom('<BB2x4x24x', buffer, offset)
  offset += 32
  const keycodesWithOffset = xcbSimpleList(buffer, offset, keycodesPerModifier * 8, Uint8Array, 1)
  offset = keycodesWithOffset.offset
  const keycodes = keycodesWithOffset.value

  return {
    value: {
      responseType,
      keycodesPerModifier,
      keycodes,
    },
    offset,
  }
}

declare module './connection' {
  interface XConnection {
    /**
     * Creates a window
     *
     * Creates an unmapped window as child of the specified `parent` window. A
     * CreateNotify event will be generated. The new window is placed on top in the
     * stacking order with respect to siblings.
     *
     * The coordinate system has the X axis horizontal and the Y axis vertical with
     * the origin [0, 0] at the upper-left corner. Coordinates are integral, in terms
     * of pixels, and coincide with pixel centers. Each window and pixmap has its own
     * coordinate system. For a window, the origin is inside the border at the inside,
     * upper-left corner.
     *
     * The created window is not yet displayed (mapped), call `xcb_map_window` to
     * display it.
     *
     * The created window will initially use the same cursor as its parent.
     * @param wid The ID with which you will refer to the new window, created by
     * `xcb_generate_id`.
     * @param depth Specifies the new window's depth (TODO: what unit?).
     *      * The special value `XCB_COPY_FROM_PARENT` means the depth is taken from the
     * `parent` window.
     * @param visual Specifies the id for the new window's visual.
     *      * The special value `XCB_COPY_FROM_PARENT` means the visual is taken from the
     * `parent` window.
     * @param class
     * @param parent The parent window of the new window.
     * @param border_width TODO:
     *      * Must be zero if the `class` is `InputOnly` or a `xcb_match_error_t` occurs.
     * @param x The X coordinate of the new window.
     * @param y The Y coordinate of the new window.
     * @param width The width of the new window.
     * @param height The height of the new window.
     *
     * See also:
     *
     * {@link XConnection.mapWindow}
     *
     * {@link CreateNotifyEvent}
     */
    createWindow(
      depth: number,
      wid: WINDOW,
      parent: WINDOW,
      x: number,
      y: number,
      width: number,
      height: number,
      borderWidth: number,
      _class: WindowClass,
      visual: VISUALID,
      valueList: Partial<{
        backgroundPixmap: PIXMAP
        backgroundPixel: number
        borderPixmap: PIXMAP
        borderPixel: number
        bitGravity: Gravity
        winGravity: Gravity
        backingStore: BackingStore
        backingPlanes: number
        backingPixel: number
        overrideRedirect: BOOL32
        saveUnder: BOOL32
        eventMask: number
        doNotPropogateMask: number
        colormap: COLORMAP
        cursor: CURSOR
      }>,
    ): RequestChecker
  }
}

XConnection.prototype.createWindow = function (
  depth: number,
  wid: WINDOW,
  parent: WINDOW,
  x: number,
  y: number,
  width: number,
  height: number,
  borderWidth: number,
  _class: WindowClass,
  visual: VISUALID,
  valueList: Partial<{
    backgroundPixmap: PIXMAP
    backgroundPixel: number
    borderPixmap: PIXMAP
    borderPixel: number
    bitGravity: Gravity
    winGravity: Gravity
    backingStore: BackingStore
    backingPlanes: number
    backingPixel: number
    overrideRedirect: BOOL32
    saveUnder: BOOL32
    eventMask: number
    doNotPropogateMask: number
    colormap: COLORMAP
    cursor: CURSOR
  }>,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  const valueListFormats: { [key: string]: string } = {
    backgroundPixmap: 'I',
    backgroundPixel: 'I',
    borderPixmap: 'I',
    borderPixel: 'I',
    bitGravity: 'I',
    winGravity: 'I',
    backingStore: 'I',
    backingPlanes: 'I',
    backingPixel: 'I',
    overrideRedirect: 'I',
    saveUnder: 'I',
    eventMask: 'I',
    doNotPropogateMask: 'I',
    colormap: 'I',
    cursor: 'I',
  }

  const valueListBitmasks: { [key: string]: number } = {
    backgroundPixmap: CW.BackPixmap,
    backgroundPixel: CW.BackPixel,
    borderPixmap: CW.BorderPixmap,
    borderPixel: CW.BorderPixel,
    bitGravity: CW.BitGravity,
    winGravity: CW.WinGravity,
    backingStore: CW.BackingStore,
    backingPlanes: CW.BackingPlanes,
    backingPixel: CW.BackingPixel,
    overrideRedirect: CW.OverrideRedirect,
    saveUnder: CW.SaveUnder,
    eventMask: CW.EventMask,
    doNotPropogateMask: CW.DontPropagate,
    colormap: CW.Colormap,
    cursor: CW.Cursor,
  }
  const valueMaskSortedList = Object.keys(valueList).sort((a, b) => valueListBitmasks[a] - valueListBitmasks[b])
  const valueMask = valueMaskSortedList.map((value) => valueListBitmasks[value]).reduce((mask, bit) => mask | bit, 0)

  const valueListValues = Object.entries(valueList)
    .sort(([key], [otherKey]) => valueMaskSortedList.indexOf(key) - valueMaskSortedList.indexOf(otherKey))
    .map(([_, value]) => value)
    .filter(notUndefined)
  requestParts.push(
    pack('<xB2xIIhhHHHHII', depth, wid, parent, x, y, width, height, borderWidth, _class, visual, valueMask),
  )
  requestParts.push(pack(`<${valueMaskSortedList.map((key) => valueListFormats[key]).join('')}`, ...valueListValues))

  return this.sendVoidRequest(requestParts, 1, 0, 'createWindow')
}

declare module './connection' {
  interface XConnection {
    /**
     * change window attributes
     *
     * Changes the attributes specified by `value_mask` for the specified `window`.
     * @param window The window to change.
     * @param value_mask
     * @param value_list Values for each of the attributes specified in the bitmask `value_mask`. The
     * order has to correspond to the order of possible `value_mask` bits. See the
     * example.
     */
    changeWindowAttributes(
      window: WINDOW,
      valueList: Partial<{
        backgroundPixmap: PIXMAP
        backgroundPixel: number
        borderPixmap: PIXMAP
        borderPixel: number
        bitGravity: Gravity
        winGravity: Gravity
        backingStore: BackingStore
        backingPlanes: number
        backingPixel: number
        overrideRedirect: BOOL32
        saveUnder: BOOL32
        eventMask: number
        doNotPropogateMask: number
        colormap: COLORMAP
        cursor: CURSOR
      }>,
    ): RequestChecker
  }
}

XConnection.prototype.changeWindowAttributes = function (
  window: WINDOW,
  valueList: Partial<{
    backgroundPixmap: PIXMAP
    backgroundPixel: number
    borderPixmap: PIXMAP
    borderPixel: number
    bitGravity: Gravity
    winGravity: Gravity
    backingStore: BackingStore
    backingPlanes: number
    backingPixel: number
    overrideRedirect: BOOL32
    saveUnder: BOOL32
    eventMask: number
    doNotPropogateMask: number
    colormap: COLORMAP
    cursor: CURSOR
  }>,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  const valueListFormats: { [key: string]: string } = {
    backgroundPixmap: 'I',
    backgroundPixel: 'I',
    borderPixmap: 'I',
    borderPixel: 'I',
    bitGravity: 'I',
    winGravity: 'I',
    backingStore: 'I',
    backingPlanes: 'I',
    backingPixel: 'I',
    overrideRedirect: 'I',
    saveUnder: 'I',
    eventMask: 'I',
    doNotPropogateMask: 'I',
    colormap: 'I',
    cursor: 'I',
  }

  const valueListBitmasks: { [key: string]: number } = {
    backgroundPixmap: CW.BackPixmap,
    backgroundPixel: CW.BackPixel,
    borderPixmap: CW.BorderPixmap,
    borderPixel: CW.BorderPixel,
    bitGravity: CW.BitGravity,
    winGravity: CW.WinGravity,
    backingStore: CW.BackingStore,
    backingPlanes: CW.BackingPlanes,
    backingPixel: CW.BackingPixel,
    overrideRedirect: CW.OverrideRedirect,
    saveUnder: CW.SaveUnder,
    eventMask: CW.EventMask,
    doNotPropogateMask: CW.DontPropagate,
    colormap: CW.Colormap,
    cursor: CW.Cursor,
  }
  const valueMaskSortedList = Object.keys(valueList).sort((a, b) => valueListBitmasks[a] - valueListBitmasks[b])
  const valueMask = valueMaskSortedList.map((value) => valueListBitmasks[value]).reduce((mask, bit) => mask | bit, 0)

  const valueListValues = Object.entries(valueList)
    .sort(([key], [otherKey]) => valueMaskSortedList.indexOf(key) - valueMaskSortedList.indexOf(otherKey))
    .map(([_, value]) => value)
    .filter(notUndefined)
  requestParts.push(pack('<xx2xII', window, valueMask))
  requestParts.push(pack(`<${valueMaskSortedList.map((key) => valueListFormats[key]).join('')}`, ...valueListValues))

  return this.sendVoidRequest(requestParts, 2, 0, 'changeWindowAttributes')
}

declare module './connection' {
  interface XConnection {
    /**
     * Gets window attributes
     *
     * Gets the current attributes for the specified `window`.
     * @param window The window to get the attributes from.
     */
    getWindowAttributes(window: WINDOW): GetWindowAttributesCookie
  }
}

XConnection.prototype.getWindowAttributes = function (window: WINDOW): GetWindowAttributesCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendRequest<GetWindowAttributesReply>(
    requestParts,
    3,
    unmarshallGetWindowAttributesReply,
    0,
    'getWindowAttributes',
  )
}

declare module './connection' {
  interface XConnection {
    /**
     * Destroys a window
     *
     * Destroys the specified window and all of its subwindows. A DestroyNotify event
     * is generated for each destroyed window (a DestroyNotify event is first generated
     * for any given window's inferiors). If the window was mapped, it will be
     * automatically unmapped before destroying.
     *
     * Calling DestroyWindow on the root window will do nothing.
     * @param window The window to destroy.
     *
     * See also:
     *
     * {@link DestroyNotifyEvent}
     *
     * {@link XConnection.mapWindow}
     *
     * {@link XConnection.unmapWindow}
     */
    destroyWindow(window: WINDOW): RequestChecker
  }
}

XConnection.prototype.destroyWindow = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendVoidRequest(requestParts, 4, 0, 'destroyWindow')
}

declare module './connection' {
  interface XConnection {
    destroySubwindows(window: WINDOW): RequestChecker
  }
}

XConnection.prototype.destroySubwindows = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendVoidRequest(requestParts, 5, 0, 'destroySubwindows')
}

declare module './connection' {
  interface XConnection {
    /**
     * Changes a client's save set
     *
     * TODO: explain what the save set is for.
     *
     * This function either adds or removes the specified window to the client's (your
     * application's) save set.
     * @param mode Insert to add the specified window to the save set or Delete to delete it from the save set.
     * @param window The window to add or delete to/from your save set.
     *
     * See also:
     *
     * {@link XConnection.reparentWindow}
     */
    changeSaveSet(mode: SetMode, window: WINDOW): RequestChecker
  }
}

XConnection.prototype.changeSaveSet = function (mode: SetMode, window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xI', mode, window))

  return this.sendVoidRequest(requestParts, 6, 0, 'changeSaveSet')
}

declare module './connection' {
  interface XConnection {
    /**
     * Reparents a window
     *
     * Makes the specified window a child of the specified parent window. If the
     * window is mapped, it will automatically be unmapped before reparenting and
     * re-mapped after reparenting. The window is placed in the stacking order on top
     * with respect to sibling windows.
     *
     * After reparenting, a ReparentNotify event is generated.
     * @param window The window to reparent.
     * @param parent The new parent of the window.
     * @param x The X position of the window within its new parent.
     * @param y The Y position of the window within its new parent.
     *
     * See also:
     *
     * {@link ReparentNotifyEvent}
     *
     * {@link XConnection.mapWindow}
     *
     * {@link XConnection.unmapWindow}
     */
    reparentWindow(window: WINDOW, parent: WINDOW, x: number, y: number): RequestChecker
  }
}

XConnection.prototype.reparentWindow = function (window: WINDOW, parent: WINDOW, x: number, y: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIhh', window, parent, x, y))

  return this.sendVoidRequest(requestParts, 7, 0, 'reparentWindow')
}

declare module './connection' {
  interface XConnection {
    /**
     * Makes a window visible
     *
     * Maps the specified window. This means making the window visible (as long as its
     * parent is visible).
     *
     * This MapWindow request will be translated to a MapRequest request if a window
     * manager is running. The window manager then decides to either map the window or
     * not. Set the override-redirect window attribute to true if you want to bypass
     * this mechanism.
     *
     * If the window manager decides to map the window (or if no window manager is
     * running), a MapNotify event is generated.
     *
     * If the window becomes viewable and no earlier contents for it are remembered,
     * the X server tiles the window with its background. If the window's background
     * is undefined, the existing screen contents are not altered, and the X server
     * generates zero or more Expose events.
     *
     * If the window type is InputOutput, an Expose event will be generated when the
     * window becomes visible. The normal response to an Expose event should be to
     * repaint the window.
     * @param window The window to make visible.
     *
     * See also:
     *
     * {@link MapNotifyEvent}
     *
     * {@link ExposeEvent}
     *
     * {@link XConnection.unmapWindow}
     */
    mapWindow(window: WINDOW): RequestChecker
  }
}

XConnection.prototype.mapWindow = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendVoidRequest(requestParts, 8, 0, 'mapWindow')
}

declare module './connection' {
  interface XConnection {
    mapSubwindows(window: WINDOW): RequestChecker
  }
}

XConnection.prototype.mapSubwindows = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendVoidRequest(requestParts, 9, 0, 'mapSubwindows')
}

declare module './connection' {
  interface XConnection {
    /**
     * Makes a window invisible
     *
     * Unmaps the specified window. This means making the window invisible (and all
     * its child windows).
     *
     * Unmapping a window leads to the `UnmapNotify` event being generated. Also,
     * `Expose` events are generated for formerly obscured windows.
     * @param window The window to make invisible.
     *
     * See also:
     *
     * {@link UnmapNotifyEvent}
     *
     * {@link ExposeEvent}
     *
     * {@link XConnection.mapWindow}
     */
    unmapWindow(window: WINDOW): RequestChecker
  }
}

XConnection.prototype.unmapWindow = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendVoidRequest(requestParts, 10, 0, 'unmapWindow')
}

declare module './connection' {
  interface XConnection {
    unmapSubwindows(window: WINDOW): RequestChecker
  }
}

XConnection.prototype.unmapSubwindows = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendVoidRequest(requestParts, 11, 0, 'unmapSubwindows')
}

declare module './connection' {
  interface XConnection {
    /**
     * Configures window attributes
     *
     * Configures a window's size, position, border width and stacking order.
     * @param window The window to configure.
     * @param value_mask Bitmask of attributes to change.
     * @param value_list New values, corresponding to the attributes in value_mask. The order has to
     * correspond to the order of possible `value_mask` bits. See the example.
     *
     * See also:
     *
     * {@link MapNotifyEvent}
     *
     * {@link ExposeEvent}
     */
    configureWindow(
      window: WINDOW,
      valueList: Partial<{
        x: number
        y: number
        width: number
        height: number
        borderWidth: number
        sibling: WINDOW
        stackMode: StackMode
      }>,
    ): RequestChecker
  }
}

XConnection.prototype.configureWindow = function (
  window: WINDOW,
  valueList: Partial<{
    x: number
    y: number
    width: number
    height: number
    borderWidth: number
    sibling: WINDOW
    stackMode: StackMode
  }>,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  const valueListFormats: { [key: string]: string } = {
    x: 'i',
    y: 'i',
    width: 'I',
    height: 'I',
    borderWidth: 'I',
    sibling: 'I',
    stackMode: 'I',
  }

  const valueListBitmasks: { [key: string]: number } = {
    x: ConfigWindow.X,
    y: ConfigWindow.Y,
    width: ConfigWindow.Width,
    height: ConfigWindow.Height,
    borderWidth: ConfigWindow.BorderWidth,
    sibling: ConfigWindow.Sibling,
    stackMode: ConfigWindow.StackMode,
  }
  const valueMaskSortedList = Object.keys(valueList).sort((a, b) => valueListBitmasks[a] - valueListBitmasks[b])
  const valueMask = valueMaskSortedList.map((value) => valueListBitmasks[value]).reduce((mask, bit) => mask | bit, 0)

  const valueListValues = Object.entries(valueList)
    .sort(([key], [otherKey]) => valueMaskSortedList.indexOf(key) - valueMaskSortedList.indexOf(otherKey))
    .map(([_, value]) => value)
    .filter(notUndefined)
  requestParts.push(pack('<xx2xIH2x', window, valueMask))
  requestParts.push(pack(`<${valueMaskSortedList.map((key) => valueListFormats[key]).join('')}`, ...valueListValues))

  return this.sendVoidRequest(requestParts, 12, 0, 'configureWindow')
}

declare module './connection' {
  interface XConnection {
    /**
     * Change window stacking order
     *
     * If `direction` is `XCB_CIRCULATE_RAISE_LOWEST`, the lowest mapped child (if
     * any) will be raised to the top of the stack.
     *
     * If `direction` is `XCB_CIRCULATE_LOWER_HIGHEST`, the highest mapped child will
     * be lowered to the bottom of the stack.
     * @param direction
     * @param window The window to raise/lower (depending on `direction`).
     */
    circulateWindow(direction: Circulate, window: WINDOW): RequestChecker
  }
}

XConnection.prototype.circulateWindow = function (direction: Circulate, window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xI', direction, window))

  return this.sendVoidRequest(requestParts, 13, 0, 'circulateWindow')
}

declare module './connection' {
  interface XConnection {
    /**
     * Get current window geometry
     *
     * Gets the current geometry of the specified drawable (either `Window` or `Pixmap`).
     * @param drawable The drawable (`Window` or `Pixmap`) of which the geometry will be received.
     *
     * See also:
     */
    getGeometry(drawable: DRAWABLE): GetGeometryCookie
  }
}

XConnection.prototype.getGeometry = function (drawable: DRAWABLE): GetGeometryCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', drawable))

  return this.sendRequest<GetGeometryReply>(requestParts, 14, unmarshallGetGeometryReply, 0, 'getGeometry')
}

declare module './connection' {
  interface XConnection {
    /**
     * query the window tree
     *
     * Gets the root window ID, parent window ID and list of children windows for the
     * specified `window`. The children are listed in bottom-to-top stacking order.
     * @param window The `window` to query.
     *
     * See also:
     */
    queryTree(window: WINDOW): QueryTreeCookie
  }
}

XConnection.prototype.queryTree = function (window: WINDOW): QueryTreeCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendRequest<QueryTreeReply>(requestParts, 15, unmarshallQueryTreeReply, 0, 'queryTree')
}

declare module './connection' {
  interface XConnection {
    /**
     * Get atom identifier by name
     *
     * Retrieves the identifier (xcb_atom_t TODO) for the atom with the specified
     * name. Atoms are used in protocols like EWMH, for example to store window titles
     * (`_NET_WM_NAME` atom) as property of a window.
     *
     * If `only_if_exists` is 0, the atom will be created if it does not already exist.
     * If `only_if_exists` is 1, `XCB_ATOM_NONE` will be returned if the atom does
     * not yet exist.
     * @param name_len The length of the following `name`.
     * @param name The name of the atom.
     * @param only_if_exists Return a valid atom id only if the atom already exists.
     *
     * See also:
     *
     * {@link XConnection.getAtomName}
     */
    internAtom(onlyIfExists: number, name: Int8Array): InternAtomCookie
  }
}

XConnection.prototype.internAtom = function (onlyIfExists: number, name: Int8Array): InternAtomCookie {
  const nameLen = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xH2x', onlyIfExists, nameLen))
  requestParts.push(pad(name.buffer))

  return this.sendRequest<InternAtomReply>(requestParts, 16, unmarshallInternAtomReply, 0, 'internAtom')
}

declare module './connection' {
  interface XConnection {
    getAtomName(atom: ATOM): GetAtomNameCookie
  }
}

XConnection.prototype.getAtomName = function (atom: ATOM): GetAtomNameCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', atom))

  return this.sendRequest<GetAtomNameReply>(requestParts, 17, unmarshallGetAtomNameReply, 0, 'getAtomName')
}

declare module './connection' {
  interface XConnection {
    /**
     * Changes a window property
     *
     * Sets or updates a property on the specified `window`. Properties are for
     * example the window title (`WM_NAME`) or its minimum size (`WM_NORMAL_HINTS`).
     * Protocols such as EWMH also use properties - for example EWMH defines the
     * window title, encoded as UTF-8 string, in the `_NET_WM_NAME` property.
     * @param window The window whose property you want to change.
     * @param mode
     * @param property The property you want to change (an atom).
     * @param type The type of the property you want to change (an atom).
     * @param format Specifies whether the data should be viewed as a list of 8-bit, 16-bit or
     * 32-bit quantities. Possible values are 8, 16 and 32. This information allows
     * the X server to correctly perform byte-swap operations as necessary.
     * @param data_len Specifies the number of elements (see `format`).
     * @param data The property data.
     *
     * See also:
     *
     * {@link XConnection.internAtom}
     */
    changeProperty(
      mode: PropMode,
      window: WINDOW,
      property: ATOM,
      _type: ATOM,
      format: number,
      data: TypedArray,
    ): RequestChecker
  }
}

XConnection.prototype.changeProperty = function (
  mode: PropMode,
  window: WINDOW,
  property: ATOM,
  _type: ATOM,
  format: number,
  data: TypedArray,
): RequestChecker {
  const dataLen = data.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIIB3xI', mode, window, property, _type, format, dataLen))
  requestParts.push(pad(data.buffer))

  return this.sendVoidRequest(requestParts, 18, 0, 'changeProperty')
}

declare module './connection' {
  interface XConnection {
    deleteProperty(window: WINDOW, property: ATOM): RequestChecker
  }
}

XConnection.prototype.deleteProperty = function (window: WINDOW, property: ATOM): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', window, property))

  return this.sendVoidRequest(requestParts, 19, 0, 'deleteProperty')
}

declare module './connection' {
  interface XConnection {
    /**
     * Gets a window property
     *
     * Gets the specified `property` from the specified `window`. Properties are for
     * example the window title (`WM_NAME`) or its minimum size (`WM_NORMAL_HINTS`).
     * Protocols such as EWMH also use properties - for example EWMH defines the
     * window title, encoded as UTF-8 string, in the `_NET_WM_NAME` property.
     *
     * TODO: talk about `type`
     *
     * TODO: talk about `delete`
     *
     * TODO: talk about the offset/length thing. what's a valid use case?
     * @param window The window whose property you want to get.
     * @param delete Whether the property should actually be deleted. For deleting a property, the
     * specified `type` has to match the actual property type.
     * @param property The property you want to get (an atom).
     * @param type The type of the property you want to get (an atom).
     * @param long_offset Specifies the offset (in 32-bit multiples) in the specified property where the
     * data is to be retrieved.
     * @param long_length Specifies how many 32-bit multiples of data should be retrieved (e.g. if you
     * set `long_length` to 4, you will receive 16 bytes of data).
     *
     * See also:
     *
     * {@link XConnection.internAtom}
     */
    getProperty(
      _delete: number,
      window: WINDOW,
      property: ATOM,
      _type: ATOM,
      longOffset: number,
      longLength: number,
    ): GetPropertyCookie
  }
}

XConnection.prototype.getProperty = function (
  _delete: number,
  window: WINDOW,
  property: ATOM,
  _type: ATOM,
  longOffset: number,
  longLength: number,
): GetPropertyCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIIII', _delete, window, property, _type, longOffset, longLength))

  return this.sendRequest<GetPropertyReply>(requestParts, 20, unmarshallGetPropertyReply, 0, 'getProperty')
}

declare module './connection' {
  interface XConnection {
    listProperties(window: WINDOW): ListPropertiesCookie
  }
}

XConnection.prototype.listProperties = function (window: WINDOW): ListPropertiesCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendRequest<ListPropertiesReply>(requestParts, 21, unmarshallListPropertiesReply, 0, 'listProperties')
}

declare module './connection' {
  interface XConnection {
    /**
     * Sets the owner of a selection
     *
     * Makes `window` the owner of the selection `selection` and updates the
     * last-change time of the specified selection.
     *
     * TODO: briefly explain what a selection is.
     * @param selection The selection.
     * @param owner The new owner of the selection.
     *      * The special value `XCB_NONE` means that the selection will have no owner.
     * @param time Timestamp to avoid race conditions when running X over the network.
     *      * The selection will not be changed if `time` is earlier than the current
     * last-change time of the `selection` or is later than the current X server time.
     * Otherwise, the last-change time is set to the specified time.
     *      * The special value `XCB_CURRENT_TIME` will be replaced with the current server
     * time.
     *
     * See also:
     *
     * {@link XConnection.setSelectionOwner}
     */
    setSelectionOwner(owner: WINDOW, selection: ATOM, time: TIMESTAMP): RequestChecker
  }
}

XConnection.prototype.setSelectionOwner = function (owner: WINDOW, selection: ATOM, time: TIMESTAMP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIII', owner, selection, time))

  return this.sendVoidRequest(requestParts, 22, 0, 'setSelectionOwner')
}

declare module './connection' {
  interface XConnection {
    /**
     * Gets the owner of a selection
     *
     * Gets the owner of the specified selection.
     *
     * TODO: briefly explain what a selection is.
     * @param selection The selection.
     *
     * See also:
     *
     * {@link XConnection.setSelectionOwner}
     */
    getSelectionOwner(selection: ATOM): GetSelectionOwnerCookie
  }
}

XConnection.prototype.getSelectionOwner = function (selection: ATOM): GetSelectionOwnerCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', selection))

  return this.sendRequest<GetSelectionOwnerReply>(
    requestParts,
    23,
    unmarshallGetSelectionOwnerReply,
    0,
    'getSelectionOwner',
  )
}

declare module './connection' {
  interface XConnection {
    convertSelection(requestor: WINDOW, selection: ATOM, target: ATOM, property: ATOM, time: TIMESTAMP): RequestChecker
  }
}

XConnection.prototype.convertSelection = function (
  requestor: WINDOW,
  selection: ATOM,
  target: ATOM,
  property: ATOM,
  time: TIMESTAMP,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIIII', requestor, selection, target, property, time))

  return this.sendVoidRequest(requestParts, 24, 0, 'convertSelection')
}

declare module './connection' {
  interface XConnection {
    /**
     * send an event
     *
     * Identifies the `destination` window, determines which clients should receive
     * the specified event and ignores any active grabs.
     *
     * The `event` must be one of the core events or an event defined by an extension,
     * so that the X server can correctly byte-swap the contents as necessary. The
     * contents of `event` are otherwise unaltered and unchecked except for the
     * `send_event` field which is forced to 'true'.
     * @param destination The window to send this event to. Every client which selects any event within
     * `event_mask` on `destination` will get the event.
     *      * The special value `XCB_SEND_EVENT_DEST_POINTER_WINDOW` refers to the window
     * that contains the mouse pointer.
     *      * The special value `XCB_SEND_EVENT_DEST_ITEM_FOCUS` refers to the window which
     * has the keyboard focus.
     * @param event_mask Event_mask for determining which clients should receive the specified event.
     * See `destination` and `propagate`.
     * @param propagate If `propagate` is true and no clients have selected any event on `destination`,
     * the destination is replaced with the closest ancestor of `destination` for
     * which some client has selected a type in `event_mask` and for which no
     * intervening window has that type in its do-not-propagate-mask. If no such
     * window exists or if the window is an ancestor of the focus window and
     * `InputFocus` was originally specified as the destination, the event is not sent
     * to any clients. Otherwise, the event is reported to every client selecting on
     * the final destination any of the types specified in `event_mask`.
     * @param event The event to send to the specified `destination`.
     *
     * See also:
     *
     * {@link ConfigureNotifyEvent}
     */
    sendEvent(propagate: number, destination: WINDOW, eventMask: number, event: Int8Array): RequestChecker
  }
}

XConnection.prototype.sendEvent = function (
  propagate: number,
  destination: WINDOW,
  eventMask: number,
  event: Int8Array,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xII', propagate, destination, eventMask))
  requestParts.push(pad(event.buffer))

  return this.sendVoidRequest(requestParts, 25, 0, 'sendEvent')
}

declare module './connection' {
  interface XConnection {
    /**
     * Grab the pointer
     *
     * Actively grabs control of the pointer. Further pointer events are reported only to the grabbing client. Overrides any active pointer grab by this client.
     * @param event_mask Specifies which pointer events are reported to the client.
     *      * TODO: which values?
     * @param confine_to Specifies the window to confine the pointer in (the user will not be able to
     * move the pointer out of that window).
     *      * The special value `XCB_NONE` means don't confine the pointer.
     * @param cursor Specifies the cursor that should be displayed or `XCB_NONE` to not change the
     * cursor.
     * @param owner_events If 1, the `grab_window` will still get the pointer events. If 0, events are not
     * reported to the `grab_window`.
     * @param grab_window Specifies the window on which the pointer should be grabbed.
     * @param time The time argument allows you to avoid certain circumstances that come up if
     * applications take a long time to respond or if there are long network delays.
     * Consider a situation where you have two applications, both of which normally
     * grab the pointer when clicked on. If both applications specify the timestamp
     * from the event, the second application may wake up faster and successfully grab
     * the pointer before the first application. The first application then will get
     * an indication that the other application grabbed the pointer before its request
     * was processed.
     *      * The special value `XCB_CURRENT_TIME` will be replaced with the current server
     * time.
     * @param pointer_mode
     * @param keyboard_mode
     *
     * See also:
     *
     * {@link XConnection.grabKeyboard}
     */
    grabPointer(
      ownerEvents: number,
      grabWindow: WINDOW,
      eventMask: number,
      pointerMode: GrabMode,
      keyboardMode: GrabMode,
      confineTo: WINDOW,
      cursor: CURSOR,
      time: TIMESTAMP,
    ): GrabPointerCookie
  }
}

XConnection.prototype.grabPointer = function (
  ownerEvents: number,
  grabWindow: WINDOW,
  eventMask: number,
  pointerMode: GrabMode,
  keyboardMode: GrabMode,
  confineTo: WINDOW,
  cursor: CURSOR,
  time: TIMESTAMP,
): GrabPointerCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack('<xB2xIHBBIII', ownerEvents, grabWindow, eventMask, pointerMode, keyboardMode, confineTo, cursor, time),
  )

  return this.sendRequest<GrabPointerReply>(requestParts, 26, unmarshallGrabPointerReply, 0, 'grabPointer')
}

declare module './connection' {
  interface XConnection {
    /**
     * release the pointer
     *
     * Releases the pointer and any queued events if you actively grabbed the pointer
     * before using `xcb_grab_pointer`, `xcb_grab_button` or within a normal button
     * press.
     *
     * EnterNotify and LeaveNotify events are generated.
     * @param time Timestamp to avoid race conditions when running X over the network.
     *      * The pointer will not be released if `time` is earlier than the
     * last-pointer-grab time or later than the current X server time.
     * @param name_len Length (in bytes) of `name`.
     * @param name A pattern describing an X core font.
     *
     * See also:
     *
     * {@link XConnection.grabPointer}
     *
     * {@link XConnection.grabButton}
     *
     * {@link EnterNotifyEvent}
     *
     * {@link LeaveNotifyEvent}
     */
    ungrabPointer(time: TIMESTAMP): RequestChecker
  }
}

XConnection.prototype.ungrabPointer = function (time: TIMESTAMP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', time))

  return this.sendVoidRequest(requestParts, 27, 0, 'ungrabPointer')
}

declare module './connection' {
  interface XConnection {
    /**
     * Grab pointer button(s)
     *
     * This request establishes a passive grab. The pointer is actively grabbed as
     * described in GrabPointer, the last-pointer-grab time is set to the time at
     * which the button was pressed (as transmitted in the ButtonPress event), and the
     * ButtonPress event is reported if all of the following conditions are true:
     *
     * The pointer is not grabbed and the specified button is logically pressed when
     * the specified modifier keys are logically down, and no other buttons or
     * modifier keys are logically down.
     *
     * The grab-window contains the pointer.
     *
     * The confine-to window (if any) is viewable.
     *
     * A passive grab on the same button/key combination does not exist on any
     * ancestor of grab-window.
     *
     * The interpretation of the remaining arguments is the same as for GrabPointer.
     * The active grab is terminated automatically when the logical state of the
     * pointer has all buttons released, independent of the logical state of modifier
     * keys. Note that the logical state of a device (as seen by means of the
     * protocol) may lag the physical state if device event processing is frozen. This
     * request overrides all previous passive grabs by the same client on the same
     * button/key combinations on the same window. A modifier of AnyModifier is
     * equivalent to issuing the request for all possible modifier combinations
     * (including the combination of no modifiers). It is not required that all
     * specified modifiers have currently assigned keycodes. A button of AnyButton is
     * equivalent to issuing the request for all possible buttons. Otherwise, it is
     * not required that the button specified currently be assigned to a physical
     * button.
     *
     * An Access error is generated if some other client has already issued a
     * GrabButton request with the same button/key combination on the same window.
     * When using AnyModifier or AnyButton, the request fails completely (no grabs are
     * established), and an Access error is generated if there is a conflicting grab
     * for any combination. The request has no effect on an active grab.
     * @param owner_events If 1, the `grab_window` will still get the pointer events. If 0, events are not
     * reported to the `grab_window`.
     * @param grab_window Specifies the window on which the pointer should be grabbed.
     * @param event_mask Specifies which pointer events are reported to the client.
     *      * TODO: which values?
     * @param confine_to Specifies the window to confine the pointer in (the user will not be able to
     * move the pointer out of that window).
     *      * The special value `XCB_NONE` means don't confine the pointer.
     * @param cursor Specifies the cursor that should be displayed or `XCB_NONE` to not change the
     * cursor.
     * @param modifiers The modifiers to grab.
     *      * Using the special value `XCB_MOD_MASK_ANY` means grab the pointer with all
     * possible modifier combinations.
     * @param pointer_mode
     * @param keyboard_mode
     * @param button
     */
    grabButton(
      ownerEvents: number,
      grabWindow: WINDOW,
      eventMask: number,
      pointerMode: GrabMode,
      keyboardMode: GrabMode,
      confineTo: WINDOW,
      cursor: CURSOR,
      button: ButtonIndex,
      modifiers: number,
    ): RequestChecker
  }
}

XConnection.prototype.grabButton = function (
  ownerEvents: number,
  grabWindow: WINDOW,
  eventMask: number,
  pointerMode: GrabMode,
  keyboardMode: GrabMode,
  confineTo: WINDOW,
  cursor: CURSOR,
  button: ButtonIndex,
  modifiers: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack(
      '<xB2xIHBBIIBxH',
      ownerEvents,
      grabWindow,
      eventMask,
      pointerMode,
      keyboardMode,
      confineTo,
      cursor,
      button,
      modifiers,
    ),
  )

  return this.sendVoidRequest(requestParts, 28, 0, 'grabButton')
}

declare module './connection' {
  interface XConnection {
    ungrabButton(button: ButtonIndex, grabWindow: WINDOW, modifiers: number): RequestChecker
  }
}

XConnection.prototype.ungrabButton = function (
  button: ButtonIndex,
  grabWindow: WINDOW,
  modifiers: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIH2x', button, grabWindow, modifiers))

  return this.sendVoidRequest(requestParts, 29, 0, 'ungrabButton')
}

declare module './connection' {
  interface XConnection {
    changeActivePointerGrab(cursor: CURSOR, time: TIMESTAMP, eventMask: number): RequestChecker
  }
}

XConnection.prototype.changeActivePointerGrab = function (
  cursor: CURSOR,
  time: TIMESTAMP,
  eventMask: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIH2x', cursor, time, eventMask))

  return this.sendVoidRequest(requestParts, 30, 0, 'changeActivePointerGrab')
}

declare module './connection' {
  interface XConnection {
    /**
     * Grab the keyboard
     *
     * Actively grabs control of the keyboard and generates FocusIn and FocusOut
     * events. Further key events are reported only to the grabbing client.
     *
     * Any active keyboard grab by this client is overridden. If the keyboard is
     * actively grabbed by some other client, `AlreadyGrabbed` is returned. If
     * `grab_window` is not viewable, `GrabNotViewable` is returned. If the keyboard
     * is frozen by an active grab of another client, `GrabFrozen` is returned. If the
     * specified `time` is earlier than the last-keyboard-grab time or later than the
     * current X server time, `GrabInvalidTime` is returned. Otherwise, the
     * last-keyboard-grab time is set to the specified time.
     * @param owner_events If 1, the `grab_window` will still get the pointer events. If 0, events are not
     * reported to the `grab_window`.
     * @param grab_window Specifies the window on which the pointer should be grabbed.
     * @param time Timestamp to avoid race conditions when running X over the network.
     *      * The special value `XCB_CURRENT_TIME` will be replaced with the current server
     * time.
     * @param pointer_mode
     * @param keyboard_mode
     *
     * See also:
     *
     * {@link XConnection.grabPointer}
     */
    grabKeyboard(
      ownerEvents: number,
      grabWindow: WINDOW,
      time: TIMESTAMP,
      pointerMode: GrabMode,
      keyboardMode: GrabMode,
    ): GrabKeyboardCookie
  }
}

XConnection.prototype.grabKeyboard = function (
  ownerEvents: number,
  grabWindow: WINDOW,
  time: TIMESTAMP,
  pointerMode: GrabMode,
  keyboardMode: GrabMode,
): GrabKeyboardCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIBB2x', ownerEvents, grabWindow, time, pointerMode, keyboardMode))

  return this.sendRequest<GrabKeyboardReply>(requestParts, 31, unmarshallGrabKeyboardReply, 0, 'grabKeyboard')
}

declare module './connection' {
  interface XConnection {
    ungrabKeyboard(time: TIMESTAMP): RequestChecker
  }
}

XConnection.prototype.ungrabKeyboard = function (time: TIMESTAMP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', time))

  return this.sendVoidRequest(requestParts, 32, 0, 'ungrabKeyboard')
}

declare module './connection' {
  interface XConnection {
    /**
     * Grab keyboard key(s)
     *
     * Establishes a passive grab on the keyboard. In the future, the keyboard is
     * actively grabbed (as for `GrabKeyboard`), the last-keyboard-grab time is set to
     * the time at which the key was pressed (as transmitted in the KeyPress event),
     * and the KeyPress event is reported if all of the following conditions are true:
     *
     * The keyboard is not grabbed and the specified key (which can itself be a
     * modifier key) is logically pressed when the specified modifier keys are
     * logically down, and no other modifier keys are logically down.
     *
     * Either the grab_window is an ancestor of (or is) the focus window, or the
     * grab_window is a descendant of the focus window and contains the pointer.
     *
     * A passive grab on the same key combination does not exist on any ancestor of
     * grab_window.
     *
     * The interpretation of the remaining arguments is as for XGrabKeyboard.  The active grab is terminated
     * automatically when the logical state of the keyboard has the specified key released (independent of the
     * logical state of the modifier keys), at which point a KeyRelease event is reported to the grabbing window.
     *
     * Note that the logical state of a device (as seen by client applications) may lag the physical state if
     * device event processing is frozen.
     *
     * A modifiers argument of AnyModifier is equivalent to issuing the request for all possible modifier combinations (including the combination of no modifiers).  It is not required that all modifiers specified
     * have currently assigned KeyCodes.  A keycode argument of AnyKey is equivalent to issuing the request for
     * all possible KeyCodes.  Otherwise, the specified keycode must be in the range specified by min_keycode
     * and max_keycode in the connection setup, or a BadValue error results.
     *
     * If some other client has issued a XGrabKey with the same key combination on the same window, a BadAccess
     * error results.  When using AnyModifier or AnyKey, the request fails completely, and a BadAccess error
     * results (no grabs are established) if there is a conflicting grab for any combination.
     * @param owner_events If 1, the `grab_window` will still get the pointer events. If 0, events are not
     * reported to the `grab_window`.
     * @param grab_window Specifies the window on which the pointer should be grabbed.
     * @param key The keycode of the key to grab.
     *      * The special value `XCB_GRAB_ANY` means grab any key.
     * @param cursor Specifies the cursor that should be displayed or `XCB_NONE` to not change the
     * cursor.
     * @param modifiers The modifiers to grab.
     *      * Using the special value `XCB_MOD_MASK_ANY` means grab the pointer with all
     * possible modifier combinations.
     * @param pointer_mode
     * @param keyboard_mode
     *
     * See also:
     *
     * {@link XConnection.grabKeyboard}
     */
    grabKey(
      ownerEvents: number,
      grabWindow: WINDOW,
      modifiers: number,
      key: KEYCODE,
      pointerMode: GrabMode,
      keyboardMode: GrabMode,
    ): RequestChecker
  }
}

XConnection.prototype.grabKey = function (
  ownerEvents: number,
  grabWindow: WINDOW,
  modifiers: number,
  key: KEYCODE,
  pointerMode: GrabMode,
  keyboardMode: GrabMode,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIHBBB3x', ownerEvents, grabWindow, modifiers, key, pointerMode, keyboardMode))

  return this.sendVoidRequest(requestParts, 33, 0, 'grabKey')
}

declare module './connection' {
  interface XConnection {
    /**
     * release a key combination
     *
     * Releases the key combination on `grab_window` if you grabbed it using
     * `xcb_grab_key` before.
     * @param key The keycode of the specified key combination.
     *      * Using the special value `XCB_GRAB_ANY` means releasing all possible key codes.
     * @param grab_window The window on which the grabbed key combination will be released.
     * @param modifiers The modifiers of the specified key combination.
     *      * Using the special value `XCB_MOD_MASK_ANY` means releasing the key combination
     * with every possible modifier combination.
     *
     * See also:
     *
     * {@link XConnection.grabKey}
     */
    ungrabKey(key: KEYCODE, grabWindow: WINDOW, modifiers: number): RequestChecker
  }
}

XConnection.prototype.ungrabKey = function (key: KEYCODE, grabWindow: WINDOW, modifiers: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIH2x', key, grabWindow, modifiers))

  return this.sendVoidRequest(requestParts, 34, 0, 'ungrabKey')
}

declare module './connection' {
  interface XConnection {
    /**
     * release queued events
     *
     * Releases queued events if the client has caused a device (pointer/keyboard) to
     * freeze due to grabbing it actively. This request has no effect if `time` is
     * earlier than the last-grab time of the most recent active grab for this client
     * or if `time` is later than the current X server time.
     * @param mode
     * @param time Timestamp to avoid race conditions when running X over the network.
     *      * The special value `XCB_CURRENT_TIME` will be replaced with the current server
     * time.
     */
    allowEvents(mode: Allow, time: TIMESTAMP): RequestChecker
  }
}

XConnection.prototype.allowEvents = function (mode: Allow, time: TIMESTAMP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xI', mode, time))

  return this.sendVoidRequest(requestParts, 35, 0, 'allowEvents')
}

declare module './connection' {
  interface XConnection {
    grabServer(): RequestChecker
  }
}

XConnection.prototype.grabServer = function (): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendVoidRequest(requestParts, 36, 0, 'grabServer')
}

declare module './connection' {
  interface XConnection {
    ungrabServer(): RequestChecker
  }
}

XConnection.prototype.ungrabServer = function (): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendVoidRequest(requestParts, 37, 0, 'ungrabServer')
}

declare module './connection' {
  interface XConnection {
    /**
     * get pointer coordinates
     *
     * Gets the root window the pointer is logically on and the pointer coordinates
     * relative to the root window's origin.
     * @param window A window to check if the pointer is on the same screen as `window` (see the
     * `same_screen` field in the reply).
     */
    queryPointer(window: WINDOW): QueryPointerCookie
  }
}

XConnection.prototype.queryPointer = function (window: WINDOW): QueryPointerCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendRequest<QueryPointerReply>(requestParts, 38, unmarshallQueryPointerReply, 0, 'queryPointer')
}

declare module './connection' {
  interface XConnection {
    getMotionEvents(window: WINDOW, start: TIMESTAMP, stop: TIMESTAMP): GetMotionEventsCookie
  }
}

XConnection.prototype.getMotionEvents = function (
  window: WINDOW,
  start: TIMESTAMP,
  stop: TIMESTAMP,
): GetMotionEventsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIII', window, start, stop))

  return this.sendRequest<GetMotionEventsReply>(requestParts, 39, unmarshallGetMotionEventsReply, 0, 'getMotionEvents')
}

declare module './connection' {
  interface XConnection {
    translateCoordinates(srcWindow: WINDOW, dstWindow: WINDOW, srcX: number, srcY: number): TranslateCoordinatesCookie
  }
}

XConnection.prototype.translateCoordinates = function (
  srcWindow: WINDOW,
  dstWindow: WINDOW,
  srcX: number,
  srcY: number,
): TranslateCoordinatesCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIhh', srcWindow, dstWindow, srcX, srcY))

  return this.sendRequest<TranslateCoordinatesReply>(
    requestParts,
    40,
    unmarshallTranslateCoordinatesReply,
    0,
    'translateCoordinates',
  )
}

declare module './connection' {
  interface XConnection {
    /**
     * move mouse pointer
     *
     * Moves the mouse pointer to the specified position.
     *
     * If `src_window` is not `XCB_NONE` (TODO), the move will only take place if the
     * pointer is inside `src_window` and within the rectangle specified by (`src_x`,
     * `src_y`, `src_width`, `src_height`). The rectangle coordinates are relative to
     * `src_window`.
     *
     * If `dst_window` is not `XCB_NONE` (TODO), the pointer will be moved to the
     * offsets (`dst_x`, `dst_y`) relative to `dst_window`. If `dst_window` is
     * `XCB_NONE` (TODO), the pointer will be moved by the offsets (`dst_x`, `dst_y`)
     * relative to the current position of the pointer.
     * @param src_window If `src_window` is not `XCB_NONE` (TODO), the move will only take place if the
     * pointer is inside `src_window` and within the rectangle specified by (`src_x`,
     * `src_y`, `src_width`, `src_height`). The rectangle coordinates are relative to
     * `src_window`.
     * @param dst_window If `dst_window` is not `XCB_NONE` (TODO), the pointer will be moved to the
     * offsets (`dst_x`, `dst_y`) relative to `dst_window`. If `dst_window` is
     * `XCB_NONE` (TODO), the pointer will be moved by the offsets (`dst_x`, `dst_y`)
     * relative to the current position of the pointer.
     *
     * See also:
     *
     * {@link XConnection.setInputFocus}
     */
    warpPointer(
      srcWindow: WINDOW,
      dstWindow: WINDOW,
      srcX: number,
      srcY: number,
      srcWidth: number,
      srcHeight: number,
      dstX: number,
      dstY: number,
    ): RequestChecker
  }
}

XConnection.prototype.warpPointer = function (
  srcWindow: WINDOW,
  dstWindow: WINDOW,
  srcX: number,
  srcY: number,
  srcWidth: number,
  srcHeight: number,
  dstX: number,
  dstY: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIhhHHhh', srcWindow, dstWindow, srcX, srcY, srcWidth, srcHeight, dstX, dstY))

  return this.sendVoidRequest(requestParts, 41, 0, 'warpPointer')
}

declare module './connection' {
  interface XConnection {
    /**
     * Sets input focus
     *
     * Changes the input focus and the last-focus-change time. If the specified `time`
     * is earlier than the current last-focus-change time, the request is ignored (to
     * avoid race conditions when running X over the network).
     *
     * A FocusIn and FocusOut event is generated when focus is changed.
     * @param focus The window to focus. All keyboard events will be reported to this window. The
     * window must be viewable (TODO), or a `xcb_match_error_t` occurs (TODO).
     *      * If `focus` is `XCB_NONE` (TODO), all keyboard events are
     * discarded until a new focus window is set.
     *      * If `focus` is `XCB_POINTER_ROOT` (TODO), focus is on the root window of the
     * screen on which the pointer is on currently.
     * @param time Timestamp to avoid race conditions when running X over the network.
     *      * The special value `XCB_CURRENT_TIME` will be replaced with the current server
     * time.
     * @param revert_to Specifies what happens when the `focus` window becomes unviewable (if `focus`
     * is neither `XCB_NONE` nor `XCB_POINTER_ROOT`).
     *
     * See also:
     *
     * {@link FocusInEvent}
     *
     * {@link FocusOutEvent}
     */
    setInputFocus(revertTo: InputFocus, focus: WINDOW, time: TIMESTAMP): RequestChecker
  }
}

XConnection.prototype.setInputFocus = function (revertTo: InputFocus, focus: WINDOW, time: TIMESTAMP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xII', revertTo, focus, time))

  return this.sendVoidRequest(requestParts, 42, 0, 'setInputFocus')
}

declare module './connection' {
  interface XConnection {
    getInputFocus(): GetInputFocusCookie
  }
}

XConnection.prototype.getInputFocus = function (): GetInputFocusCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<GetInputFocusReply>(requestParts, 43, unmarshallGetInputFocusReply, 0, 'getInputFocus')
}

declare module './connection' {
  interface XConnection {
    queryKeymap(): QueryKeymapCookie
  }
}

XConnection.prototype.queryKeymap = function (): QueryKeymapCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<QueryKeymapReply>(requestParts, 44, unmarshallQueryKeymapReply, 0, 'queryKeymap')
}

declare module './connection' {
  interface XConnection {
    /**
     * opens a font
     *
     * Opens any X core font matching the given `name` (for example "-misc-fixed-*").
     *
     * Note that X core fonts are deprecated (but still supported) in favor of
     * client-side rendering using Xft.
     * @param fid The ID with which you will refer to the font, created by `xcb_generate_id`.
     * @param name_len Length (in bytes) of `name`.
     * @param name A pattern describing an X core font.
     *
     * See also:
     */
    openFont(fid: FONT, name: Int8Array): RequestChecker
  }
}

XConnection.prototype.openFont = function (fid: FONT, name: Int8Array): RequestChecker {
  const nameLen = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIH2x', fid, nameLen))
  requestParts.push(pad(name.buffer))

  return this.sendVoidRequest(requestParts, 45, 0, 'openFont')
}

declare module './connection' {
  interface XConnection {
    closeFont(font: FONT): RequestChecker
  }
}

XConnection.prototype.closeFont = function (font: FONT): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', font))

  return this.sendVoidRequest(requestParts, 46, 0, 'closeFont')
}

declare module './connection' {
  interface XConnection {
    /**
     * query font metrics
     *
     * Queries information associated with the font.
     * @param font The fontable (Font or Graphics Context) to query.
     */
    queryFont(font: FONTABLE): QueryFontCookie
  }
}

XConnection.prototype.queryFont = function (font: FONTABLE): QueryFontCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', font))

  return this.sendRequest<QueryFontReply>(requestParts, 47, unmarshallQueryFontReply, 0, 'queryFont')
}

declare module './connection' {
  interface XConnection {
    /**
     * get text extents
     *
     * Query text extents from the X11 server. This request returns the bounding box
     * of the specified 16-bit character string in the specified `font` or the font
     * contained in the specified graphics context.
     *
     * `font_ascent` is set to the maximum of the ascent metrics of all characters in
     * the string. `font_descent` is set to the maximum of the descent metrics.
     * `overall_width` is set to the sum of the character-width metrics of all
     * characters in the string. For each character in the string, let W be the sum of
     * the character-width metrics of all characters preceding it in the string. Let L
     * be the left-side-bearing metric of the character plus W. Let R be the
     * right-side-bearing metric of the character plus W. The lbearing member is set
     * to the minimum L of all characters in the string. The rbearing member is set to
     * the maximum R.
     *
     * For fonts defined with linear indexing rather than 2-byte matrix indexing, each
     * `xcb_char2b_t` structure is interpreted as a 16-bit number with byte1 as the
     * most significant byte. If the font has no defined default character, undefined
     * characters in the string are taken to have all zero metrics.
     *
     * Characters with all zero metrics are ignored. If the font has no defined
     * default_char, the undefined characters in the string are also ignored.
     * @param font The `font` to calculate text extents in. You can also pass a graphics context.
     * @param string_len The number of characters in `string`.
     * @param string The text to get text extents for.
     */
    queryTextExtents(font: FONTABLE, stringLen: number, _string: CHAR2B[]): QueryTextExtentsCookie
  }
}

XConnection.prototype.queryTextExtents = function (
  font: FONTABLE,
  stringLen: number,
  _string: CHAR2B[],
): QueryTextExtentsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<x'))
  requestParts.push(pack('<B', stringLen & 1))
  requestParts.push(pack('<2xI', font))
  _string.forEach(({ byte1, byte2 }) => {
    requestParts.push(pack('<BB', byte1, byte2))
  })

  return this.sendRequest<QueryTextExtentsReply>(
    requestParts,
    48,
    unmarshallQueryTextExtentsReply,
    0,
    'queryTextExtents',
  )
}

declare module './connection' {
  interface XConnection {
    /**
     * get matching font names
     *
     * Gets a list of available font names which match the given `pattern`.
     * @param pattern_len The length (in bytes) of `pattern`.
     * @param pattern A font pattern, for example "-misc-fixed-*".
     *      * The asterisk (*) is a wildcard for any number of characters. The question mark
     * (?) is a wildcard for a single character. Use of uppercase or lowercase does
     * not matter.
     * @param max_names The maximum number of fonts to be returned.
     */
    listFonts(maxNames: number, pattern: Int8Array): ListFontsCookie
  }
}

XConnection.prototype.listFonts = function (maxNames: number, pattern: Int8Array): ListFontsCookie {
  const patternLen = pattern.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xHH', maxNames, patternLen))
  requestParts.push(pad(pattern.buffer))

  return this.sendRequest<ListFontsReply>(requestParts, 49, unmarshallListFontsReply, 0, 'listFonts')
}

declare module './connection' {
  interface XConnection {
    /**
     * get matching font names and information
     *
     * Gets a list of available font names which match the given `pattern`.
     * @param pattern_len The length (in bytes) of `pattern`.
     * @param pattern A font pattern, for example "-misc-fixed-*".
     *      * The asterisk (*) is a wildcard for any number of characters. The question mark
     * (?) is a wildcard for a single character. Use of uppercase or lowercase does
     * not matter.
     * @param max_names The maximum number of fonts to be returned.
     */
    listFontsWithInfo(maxNames: number, pattern: Int8Array): ListFontsWithInfoCookie
  }
}

XConnection.prototype.listFontsWithInfo = function (maxNames: number, pattern: Int8Array): ListFontsWithInfoCookie {
  const patternLen = pattern.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xHH', maxNames, patternLen))
  requestParts.push(pad(pattern.buffer))

  return this.sendRequest<ListFontsWithInfoReply>(
    requestParts,
    50,
    unmarshallListFontsWithInfoReply,
    0,
    'listFontsWithInfo',
  )
}

declare module './connection' {
  interface XConnection {
    setFontPath(font: STR[]): RequestChecker
  }
}

XConnection.prototype.setFontPath = function (font: STR[]): RequestChecker {
  const fontQty = font.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xH2x', fontQty))
  font.forEach(({ nameLen, name }) => {
    requestParts.push(pack('<B', nameLen))
    requestParts.push(pad(name.buffer))
  })

  return this.sendVoidRequest(requestParts, 51, 0, 'setFontPath')
}

declare module './connection' {
  interface XConnection {
    getFontPath(): GetFontPathCookie
  }
}

XConnection.prototype.getFontPath = function (): GetFontPathCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<GetFontPathReply>(requestParts, 52, unmarshallGetFontPathReply, 0, 'getFontPath')
}

declare module './connection' {
  interface XConnection {
    /**
     * Creates a pixmap
     *
     * Creates a pixmap. The pixmap can only be used on the same screen as `drawable`
     * is on and only with drawables of the same `depth`.
     * @param depth TODO
     * @param pid The ID with which you will refer to the new pixmap, created by
     * `xcb_generate_id`.
     * @param drawable Drawable to get the screen from.
     * @param width The width of the new pixmap.
     * @param height The height of the new pixmap.
     *
     * See also:
     */
    createPixmap(depth: number, pid: PIXMAP, drawable: DRAWABLE, width: number, height: number): RequestChecker
  }
}

XConnection.prototype.createPixmap = function (
  depth: number,
  pid: PIXMAP,
  drawable: DRAWABLE,
  width: number,
  height: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIHH', depth, pid, drawable, width, height))

  return this.sendVoidRequest(requestParts, 53, 0, 'createPixmap')
}

declare module './connection' {
  interface XConnection {
    /**
     * Destroys a pixmap
     *
     * Deletes the association between the pixmap ID and the pixmap. The pixmap
     * storage will be freed when there are no more references to it.
     * @param pixmap The pixmap to destroy.
     */
    freePixmap(pixmap: PIXMAP): RequestChecker
  }
}

XConnection.prototype.freePixmap = function (pixmap: PIXMAP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', pixmap))

  return this.sendVoidRequest(requestParts, 54, 0, 'freePixmap')
}

declare module './connection' {
  interface XConnection {
    /**
     * Creates a graphics context
     *
     * Creates a graphics context. The graphics context can be used with any drawable
     * that has the same root and depth as the specified drawable.
     * @param cid The ID with which you will refer to the graphics context, created by
     * `xcb_generate_id`.
     * @param drawable Drawable to get the root/depth from.
     *
     * See also:
     */
    createGC(
      cid: GCONTEXT,
      drawable: DRAWABLE,
      valueList: Partial<{
        function: GX
        planeMask: number
        foreground: number
        background: number
        lineWidth: number
        lineStyle: LineStyle
        capStyle: CapStyle
        joinStyle: JoinStyle
        fillStyle: FillStyle
        fillRule: FillRule
        tile: PIXMAP
        stipple: PIXMAP
        tileStippleXOrigin: number
        tileStippleYOrigin: number
        font: FONT
        subwindowMode: SubwindowMode
        graphicsExposures: BOOL32
        clipXOrigin: number
        clipYOrigin: number
        clipMask: PIXMAP
        dashOffset: number
        dashes: number
        arcMode: ArcMode
      }>,
    ): RequestChecker
  }
}

XConnection.prototype.createGC = function (
  cid: GCONTEXT,
  drawable: DRAWABLE,
  valueList: Partial<{
    function: GX
    planeMask: number
    foreground: number
    background: number
    lineWidth: number
    lineStyle: LineStyle
    capStyle: CapStyle
    joinStyle: JoinStyle
    fillStyle: FillStyle
    fillRule: FillRule
    tile: PIXMAP
    stipple: PIXMAP
    tileStippleXOrigin: number
    tileStippleYOrigin: number
    font: FONT
    subwindowMode: SubwindowMode
    graphicsExposures: BOOL32
    clipXOrigin: number
    clipYOrigin: number
    clipMask: PIXMAP
    dashOffset: number
    dashes: number
    arcMode: ArcMode
  }>,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  const valueListFormats: { [key: string]: string } = {
    function: 'I',
    planeMask: 'I',
    foreground: 'I',
    background: 'I',
    lineWidth: 'I',
    lineStyle: 'I',
    capStyle: 'I',
    joinStyle: 'I',
    fillStyle: 'I',
    fillRule: 'I',
    tile: 'I',
    stipple: 'I',
    tileStippleXOrigin: 'i',
    tileStippleYOrigin: 'i',
    font: 'I',
    subwindowMode: 'I',
    graphicsExposures: 'I',
    clipXOrigin: 'i',
    clipYOrigin: 'i',
    clipMask: 'I',
    dashOffset: 'I',
    dashes: 'I',
    arcMode: 'I',
  }

  const valueListBitmasks: { [key: string]: number } = {
    function: GC.Function,
    planeMask: GC.PlaneMask,
    foreground: GC.Foreground,
    background: GC.Background,
    lineWidth: GC.LineWidth,
    lineStyle: GC.LineStyle,
    capStyle: GC.CapStyle,
    joinStyle: GC.JoinStyle,
    fillStyle: GC.FillStyle,
    fillRule: GC.FillRule,
    tile: GC.Tile,
    stipple: GC.Stipple,
    tileStippleXOrigin: GC.TileStippleOriginX,
    tileStippleYOrigin: GC.TileStippleOriginY,
    font: GC.Font,
    subwindowMode: GC.SubwindowMode,
    graphicsExposures: GC.GraphicsExposures,
    clipXOrigin: GC.ClipOriginX,
    clipYOrigin: GC.ClipOriginY,
    clipMask: GC.ClipMask,
    dashOffset: GC.DashOffset,
    dashes: GC.DashList,
    arcMode: GC.ArcMode,
  }
  const valueMaskSortedList = Object.keys(valueList).sort((a, b) => valueListBitmasks[a] - valueListBitmasks[b])
  const valueMask = valueMaskSortedList.map((value) => valueListBitmasks[value]).reduce((mask, bit) => mask | bit, 0)

  const valueListValues = Object.entries(valueList)
    .sort(([key], [otherKey]) => valueMaskSortedList.indexOf(key) - valueMaskSortedList.indexOf(otherKey))
    .map(([_, value]) => value)
    .filter(notUndefined)
  requestParts.push(pack('<xx2xIII', cid, drawable, valueMask))
  requestParts.push(pack(`<${valueMaskSortedList.map((key) => valueListFormats[key]).join('')}`, ...valueListValues))

  return this.sendVoidRequest(requestParts, 55, 0, 'createGC')
}

declare module './connection' {
  interface XConnection {
    /**
     * change graphics context components
     *
     * Changes the components specified by `value_mask` for the specified graphics context.
     * @param gc The graphics context to change.
     * @param value_mask
     * @param value_list Values for each of the components specified in the bitmask `value_mask`. The
     * order has to correspond to the order of possible `value_mask` bits. See the
     * example.
     */
    changeGC(
      gc: GCONTEXT,
      valueList: Partial<{
        function: GX
        planeMask: number
        foreground: number
        background: number
        lineWidth: number
        lineStyle: LineStyle
        capStyle: CapStyle
        joinStyle: JoinStyle
        fillStyle: FillStyle
        fillRule: FillRule
        tile: PIXMAP
        stipple: PIXMAP
        tileStippleXOrigin: number
        tileStippleYOrigin: number
        font: FONT
        subwindowMode: SubwindowMode
        graphicsExposures: BOOL32
        clipXOrigin: number
        clipYOrigin: number
        clipMask: PIXMAP
        dashOffset: number
        dashes: number
        arcMode: ArcMode
      }>,
    ): RequestChecker
  }
}

XConnection.prototype.changeGC = function (
  gc: GCONTEXT,
  valueList: Partial<{
    function: GX
    planeMask: number
    foreground: number
    background: number
    lineWidth: number
    lineStyle: LineStyle
    capStyle: CapStyle
    joinStyle: JoinStyle
    fillStyle: FillStyle
    fillRule: FillRule
    tile: PIXMAP
    stipple: PIXMAP
    tileStippleXOrigin: number
    tileStippleYOrigin: number
    font: FONT
    subwindowMode: SubwindowMode
    graphicsExposures: BOOL32
    clipXOrigin: number
    clipYOrigin: number
    clipMask: PIXMAP
    dashOffset: number
    dashes: number
    arcMode: ArcMode
  }>,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  const valueListFormats: { [key: string]: string } = {
    function: 'I',
    planeMask: 'I',
    foreground: 'I',
    background: 'I',
    lineWidth: 'I',
    lineStyle: 'I',
    capStyle: 'I',
    joinStyle: 'I',
    fillStyle: 'I',
    fillRule: 'I',
    tile: 'I',
    stipple: 'I',
    tileStippleXOrigin: 'i',
    tileStippleYOrigin: 'i',
    font: 'I',
    subwindowMode: 'I',
    graphicsExposures: 'I',
    clipXOrigin: 'i',
    clipYOrigin: 'i',
    clipMask: 'I',
    dashOffset: 'I',
    dashes: 'I',
    arcMode: 'I',
  }

  const valueListBitmasks: { [key: string]: number } = {
    function: GC.Function,
    planeMask: GC.PlaneMask,
    foreground: GC.Foreground,
    background: GC.Background,
    lineWidth: GC.LineWidth,
    lineStyle: GC.LineStyle,
    capStyle: GC.CapStyle,
    joinStyle: GC.JoinStyle,
    fillStyle: GC.FillStyle,
    fillRule: GC.FillRule,
    tile: GC.Tile,
    stipple: GC.Stipple,
    tileStippleXOrigin: GC.TileStippleOriginX,
    tileStippleYOrigin: GC.TileStippleOriginY,
    font: GC.Font,
    subwindowMode: GC.SubwindowMode,
    graphicsExposures: GC.GraphicsExposures,
    clipXOrigin: GC.ClipOriginX,
    clipYOrigin: GC.ClipOriginY,
    clipMask: GC.ClipMask,
    dashOffset: GC.DashOffset,
    dashes: GC.DashList,
    arcMode: GC.ArcMode,
  }
  const valueMaskSortedList = Object.keys(valueList).sort((a, b) => valueListBitmasks[a] - valueListBitmasks[b])
  const valueMask = valueMaskSortedList.map((value) => valueListBitmasks[value]).reduce((mask, bit) => mask | bit, 0)

  const valueListValues = Object.entries(valueList)
    .sort(([key], [otherKey]) => valueMaskSortedList.indexOf(key) - valueMaskSortedList.indexOf(otherKey))
    .map(([_, value]) => value)
    .filter(notUndefined)
  requestParts.push(pack('<xx2xII', gc, valueMask))
  requestParts.push(pack(`<${valueMaskSortedList.map((key) => valueListFormats[key]).join('')}`, ...valueListValues))

  return this.sendVoidRequest(requestParts, 56, 0, 'changeGC')
}

declare module './connection' {
  interface XConnection {
    copyGC(srcGc: GCONTEXT, dstGc: GCONTEXT, valueMask: number): RequestChecker
  }
}

XConnection.prototype.copyGC = function (srcGc: GCONTEXT, dstGc: GCONTEXT, valueMask: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIII', srcGc, dstGc, valueMask))

  return this.sendVoidRequest(requestParts, 57, 0, 'copyGC')
}

declare module './connection' {
  interface XConnection {
    setDashes(gc: GCONTEXT, dashOffset: number, dashes: Uint8Array): RequestChecker
  }
}

XConnection.prototype.setDashes = function (gc: GCONTEXT, dashOffset: number, dashes: Uint8Array): RequestChecker {
  const dashesLen = dashes.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIHH', gc, dashOffset, dashesLen))
  requestParts.push(pad(dashes.buffer))

  return this.sendVoidRequest(requestParts, 58, 0, 'setDashes')
}

declare module './connection' {
  interface XConnection {
    setClipRectangles(
      ordering: ClipOrdering,
      gc: GCONTEXT,
      clipXOrigin: number,
      clipYOrigin: number,
      rectanglesLen: number,
      rectangles: RECTANGLE[],
    ): RequestChecker
  }
}

XConnection.prototype.setClipRectangles = function (
  ordering: ClipOrdering,
  gc: GCONTEXT,
  clipXOrigin: number,
  clipYOrigin: number,
  rectanglesLen: number,
  rectangles: RECTANGLE[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIhh', ordering, gc, clipXOrigin, clipYOrigin))
  rectangles.forEach(({ x, y, width, height }) => {
    requestParts.push(pack('<hhHH', x, y, width, height))
  })

  return this.sendVoidRequest(requestParts, 59, 0, 'setClipRectangles')
}

declare module './connection' {
  interface XConnection {
    /**
     * Destroys a graphics context
     *
     * Destroys the specified `gc` and all associated storage.
     * @param gc The graphics context to destroy.
     */
    freeGC(gc: GCONTEXT): RequestChecker
  }
}

XConnection.prototype.freeGC = function (gc: GCONTEXT): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', gc))

  return this.sendVoidRequest(requestParts, 60, 0, 'freeGC')
}

declare module './connection' {
  interface XConnection {
    clearArea(exposures: number, window: WINDOW, x: number, y: number, width: number, height: number): RequestChecker
  }
}

XConnection.prototype.clearArea = function (
  exposures: number,
  window: WINDOW,
  x: number,
  y: number,
  width: number,
  height: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIhhHH', exposures, window, x, y, width, height))

  return this.sendVoidRequest(requestParts, 61, 0, 'clearArea')
}

declare module './connection' {
  interface XConnection {
    /**
     * copy areas
     *
     * Copies the specified rectangle from `src_drawable` to `dst_drawable`.
     * @param dst_drawable The destination drawable (Window or Pixmap).
     * @param src_drawable The source drawable (Window or Pixmap).
     * @param gc The graphics context to use.
     * @param src_x The source X coordinate.
     * @param src_y The source Y coordinate.
     * @param dst_x The destination X coordinate.
     * @param dst_y The destination Y coordinate.
     * @param width The width of the area to copy (in pixels).
     * @param height The height of the area to copy (in pixels).
     */
    copyArea(
      srcDrawable: DRAWABLE,
      dstDrawable: DRAWABLE,
      gc: GCONTEXT,
      srcX: number,
      srcY: number,
      dstX: number,
      dstY: number,
      width: number,
      height: number,
    ): RequestChecker
  }
}

XConnection.prototype.copyArea = function (
  srcDrawable: DRAWABLE,
  dstDrawable: DRAWABLE,
  gc: GCONTEXT,
  srcX: number,
  srcY: number,
  dstX: number,
  dstY: number,
  width: number,
  height: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIIhhhhHH', srcDrawable, dstDrawable, gc, srcX, srcY, dstX, dstY, width, height))

  return this.sendVoidRequest(requestParts, 62, 0, 'copyArea')
}

declare module './connection' {
  interface XConnection {
    copyPlane(
      srcDrawable: DRAWABLE,
      dstDrawable: DRAWABLE,
      gc: GCONTEXT,
      srcX: number,
      srcY: number,
      dstX: number,
      dstY: number,
      width: number,
      height: number,
      bitPlane: number,
    ): RequestChecker
  }
}

XConnection.prototype.copyPlane = function (
  srcDrawable: DRAWABLE,
  dstDrawable: DRAWABLE,
  gc: GCONTEXT,
  srcX: number,
  srcY: number,
  dstX: number,
  dstY: number,
  width: number,
  height: number,
  bitPlane: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack('<xx2xIIIhhhhHHI', srcDrawable, dstDrawable, gc, srcX, srcY, dstX, dstY, width, height, bitPlane),
  )

  return this.sendVoidRequest(requestParts, 63, 0, 'copyPlane')
}

declare module './connection' {
  interface XConnection {
    polyPoint(
      coordinateMode: CoordMode,
      drawable: DRAWABLE,
      gc: GCONTEXT,
      pointsLen: number,
      points: POINT[],
    ): RequestChecker
  }
}

XConnection.prototype.polyPoint = function (
  coordinateMode: CoordMode,
  drawable: DRAWABLE,
  gc: GCONTEXT,
  pointsLen: number,
  points: POINT[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xII', coordinateMode, drawable, gc))
  points.forEach(({ x, y }) => {
    requestParts.push(pack('<hh', x, y))
  })

  return this.sendVoidRequest(requestParts, 64, 0, 'polyPoint')
}

declare module './connection' {
  interface XConnection {
    /**
     * draw lines
     *
     * Draws `points_len`-1 lines between each pair of points (point[i], point[i+1])
     * in the `points` array. The lines are drawn in the order listed in the array.
     * They join correctly at all intermediate points, and if the first and last
     * points coincide, the first and last lines also join correctly. For any given
     * line, a pixel is not drawn more than once. If thin (zero line-width) lines
     * intersect, the intersecting pixels are drawn multiple times. If wide lines
     * intersect, the intersecting pixels are drawn only once, as though the entire
     * request were a single, filled shape.
     * @param drawable The drawable to draw the line(s) on.
     * @param gc The graphics context to use.
     * @param points_len The number of `xcb_point_t` structures in `points`.
     * @param points An array of points.
     * @param coordinate_mode
     */
    polyLine(
      coordinateMode: CoordMode,
      drawable: DRAWABLE,
      gc: GCONTEXT,
      pointsLen: number,
      points: POINT[],
    ): RequestChecker
  }
}

XConnection.prototype.polyLine = function (
  coordinateMode: CoordMode,
  drawable: DRAWABLE,
  gc: GCONTEXT,
  pointsLen: number,
  points: POINT[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xII', coordinateMode, drawable, gc))
  points.forEach(({ x, y }) => {
    requestParts.push(pack('<hh', x, y))
  })

  return this.sendVoidRequest(requestParts, 65, 0, 'polyLine')
}

declare module './connection' {
  interface XConnection {
    /**
     * draw lines
     *
     * Draws multiple, unconnected lines. For each segment, a line is drawn between
     * (x1, y1) and (x2, y2). The lines are drawn in the order listed in the array of
     * `xcb_segment_t` structures and does not perform joining at coincident
     * endpoints. For any given line, a pixel is not drawn more than once. If lines
     * intersect, the intersecting pixels are drawn multiple times.
     *
     * TODO: include the xcb_segment_t data structure
     *
     * TODO: an example
     * @param drawable A drawable (Window or Pixmap) to draw on.
     * @param gc The graphics context to use.
     *      * TODO: document which attributes of a gc are used
     * @param segments_len The number of `xcb_segment_t` structures in `segments`.
     * @param segments An array of `xcb_segment_t` structures.
     */
    polySegment(drawable: DRAWABLE, gc: GCONTEXT, segmentsLen: number, segments: SEGMENT[]): RequestChecker
  }
}

XConnection.prototype.polySegment = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  segmentsLen: number,
  segments: SEGMENT[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', drawable, gc))
  segments.forEach(({ x1, y1, x2, y2 }) => {
    requestParts.push(pack('<hhhh', x1, y1, x2, y2))
  })

  return this.sendVoidRequest(requestParts, 66, 0, 'polySegment')
}

declare module './connection' {
  interface XConnection {
    polyRectangle(drawable: DRAWABLE, gc: GCONTEXT, rectanglesLen: number, rectangles: RECTANGLE[]): RequestChecker
  }
}

XConnection.prototype.polyRectangle = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  rectanglesLen: number,
  rectangles: RECTANGLE[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', drawable, gc))
  rectangles.forEach(({ x, y, width, height }) => {
    requestParts.push(pack('<hhHH', x, y, width, height))
  })

  return this.sendVoidRequest(requestParts, 67, 0, 'polyRectangle')
}

declare module './connection' {
  interface XConnection {
    polyArc(drawable: DRAWABLE, gc: GCONTEXT, arcsLen: number, arcs: ARC[]): RequestChecker
  }
}

XConnection.prototype.polyArc = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  arcsLen: number,
  arcs: ARC[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', drawable, gc))
  arcs.forEach(({ x, y, width, height, angle1, angle2 }) => {
    requestParts.push(pack('<hhHHhh', x, y, width, height, angle1, angle2))
  })

  return this.sendVoidRequest(requestParts, 68, 0, 'polyArc')
}

declare module './connection' {
  interface XConnection {
    fillPoly(
      drawable: DRAWABLE,
      gc: GCONTEXT,
      shape: PolyShape,
      coordinateMode: CoordMode,
      pointsLen: number,
      points: POINT[],
    ): RequestChecker
  }
}

XConnection.prototype.fillPoly = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  shape: PolyShape,
  coordinateMode: CoordMode,
  pointsLen: number,
  points: POINT[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIBB2x', drawable, gc, shape, coordinateMode))
  points.forEach(({ x, y }) => {
    requestParts.push(pack('<hh', x, y))
  })

  return this.sendVoidRequest(requestParts, 69, 0, 'fillPoly')
}

declare module './connection' {
  interface XConnection {
    /**
     * Fills rectangles
     *
     * Fills the specified rectangle(s) in the order listed in the array. For any
     * given rectangle, each pixel is not drawn more than once. If rectangles
     * intersect, the intersecting pixels are drawn multiple times.
     * @param drawable The drawable (Window or Pixmap) to draw on.
     * @param gc The graphics context to use.
     *      * The following graphics context components are used: function, plane-mask,
     * fill-style, subwindow-mode, clip-x-origin, clip-y-origin, and clip-mask.
     *      * The following graphics context mode-dependent components are used:
     * foreground, background, tile, stipple, tile-stipple-x-origin, and
     * tile-stipple-y-origin.
     * @param rectangles_len The number of `xcb_rectangle_t` structures in `rectangles`.
     * @param rectangles The rectangles to fill.
     */
    polyFillRectangle(drawable: DRAWABLE, gc: GCONTEXT, rectanglesLen: number, rectangles: RECTANGLE[]): RequestChecker
  }
}

XConnection.prototype.polyFillRectangle = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  rectanglesLen: number,
  rectangles: RECTANGLE[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', drawable, gc))
  rectangles.forEach(({ x, y, width, height }) => {
    requestParts.push(pack('<hhHH', x, y, width, height))
  })

  return this.sendVoidRequest(requestParts, 70, 0, 'polyFillRectangle')
}

declare module './connection' {
  interface XConnection {
    polyFillArc(drawable: DRAWABLE, gc: GCONTEXT, arcsLen: number, arcs: ARC[]): RequestChecker
  }
}

XConnection.prototype.polyFillArc = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  arcsLen: number,
  arcs: ARC[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', drawable, gc))
  arcs.forEach(({ x, y, width, height, angle1, angle2 }) => {
    requestParts.push(pack('<hhHHhh', x, y, width, height, angle1, angle2))
  })

  return this.sendVoidRequest(requestParts, 71, 0, 'polyFillArc')
}

declare module './connection' {
  interface XConnection {
    putImage(
      format: ImageFormat,
      drawable: DRAWABLE,
      gc: GCONTEXT,
      width: number,
      height: number,
      dstX: number,
      dstY: number,
      leftPad: number,
      depth: number,
      dataLen: number,
      data: Uint8Array,
    ): RequestChecker
  }
}

XConnection.prototype.putImage = function (
  format: ImageFormat,
  drawable: DRAWABLE,
  gc: GCONTEXT,
  width: number,
  height: number,
  dstX: number,
  dstY: number,
  leftPad: number,
  depth: number,
  dataLen: number,
  data: Uint8Array,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIHHhhBB2x', format, drawable, gc, width, height, dstX, dstY, leftPad, depth))
  requestParts.push(pad(data.buffer))

  return this.sendVoidRequest(requestParts, 72, 0, 'putImage')
}

declare module './connection' {
  interface XConnection {
    getImage(
      format: ImageFormat,
      drawable: DRAWABLE,
      x: number,
      y: number,
      width: number,
      height: number,
      planeMask: number,
    ): GetImageCookie
  }
}

XConnection.prototype.getImage = function (
  format: ImageFormat,
  drawable: DRAWABLE,
  x: number,
  y: number,
  width: number,
  height: number,
  planeMask: number,
): GetImageCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIhhHHI', format, drawable, x, y, width, height, planeMask))

  return this.sendRequest<GetImageReply>(requestParts, 73, unmarshallGetImageReply, 0, 'getImage')
}

declare module './connection' {
  interface XConnection {
    polyText8(
      drawable: DRAWABLE,
      gc: GCONTEXT,
      x: number,
      y: number,
      itemsLen: number,
      items: Uint8Array,
    ): RequestChecker
  }
}

XConnection.prototype.polyText8 = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  x: number,
  y: number,
  itemsLen: number,
  items: Uint8Array,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIhh', drawable, gc, x, y))
  requestParts.push(pad(items.buffer))

  return this.sendVoidRequest(requestParts, 74, 0, 'polyText8')
}

declare module './connection' {
  interface XConnection {
    polyText16(
      drawable: DRAWABLE,
      gc: GCONTEXT,
      x: number,
      y: number,
      itemsLen: number,
      items: Uint8Array,
    ): RequestChecker
  }
}

XConnection.prototype.polyText16 = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  x: number,
  y: number,
  itemsLen: number,
  items: Uint8Array,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIhh', drawable, gc, x, y))
  requestParts.push(pad(items.buffer))

  return this.sendVoidRequest(requestParts, 75, 0, 'polyText16')
}

declare module './connection' {
  interface XConnection {
    /**
     * Draws text
     *
     * Fills the destination rectangle with the background pixel from `gc`, then
     * paints the text with the foreground pixel from `gc`. The upper-left corner of
     * the filled rectangle is at [x, y - font-ascent]. The width is overall-width,
     * the height is font-ascent + font-descent. The overall-width, font-ascent and
     * font-descent are as returned by `xcb_query_text_extents` (TODO).
     *
     * Note that using X core fonts is deprecated (but still supported) in favor of
     * client-side rendering using Xft.
     * @param drawable The drawable (Window or Pixmap) to draw text on.
     * @param string_len The length of the `string`. Note that this parameter limited by 255 due to
     * using 8 bits!
     * @param string The string to draw. Only the first 255 characters are relevant due to the data
     * type of `string_len`.
     * @param x The x coordinate of the first character, relative to the origin of `drawable`.
     * @param y The y coordinate of the first character, relative to the origin of `drawable`.
     * @param gc The graphics context to use.
     *      * The following graphics context components are used: plane-mask, foreground,
     * background, font, subwindow-mode, clip-x-origin, clip-y-origin, and clip-mask.
     *
     * See also:
     *
     * {@link XConnection.imageText16}
     */
    imageText8(drawable: DRAWABLE, gc: GCONTEXT, x: number, y: number, _string: Int8Array): RequestChecker
  }
}

XConnection.prototype.imageText8 = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  x: number,
  y: number,
  _string: Int8Array,
): RequestChecker {
  const stringLen = _string.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIhh', stringLen, drawable, gc, x, y))
  requestParts.push(pad(_string.buffer))

  return this.sendVoidRequest(requestParts, 76, 0, 'imageText8')
}

declare module './connection' {
  interface XConnection {
    /**
     * Draws text
     *
     * Fills the destination rectangle with the background pixel from `gc`, then
     * paints the text with the foreground pixel from `gc`. The upper-left corner of
     * the filled rectangle is at [x, y - font-ascent]. The width is overall-width,
     * the height is font-ascent + font-descent. The overall-width, font-ascent and
     * font-descent are as returned by `xcb_query_text_extents` (TODO).
     *
     * Note that using X core fonts is deprecated (but still supported) in favor of
     * client-side rendering using Xft.
     * @param drawable The drawable (Window or Pixmap) to draw text on.
     * @param string_len The length of the `string` in characters. Note that this parameter limited by
     * 255 due to using 8 bits!
     * @param string The string to draw. Only the first 255 characters are relevant due to the data
     * type of `string_len`. Every character uses 2 bytes (hence the 16 in this
     * request's name).
     * @param x The x coordinate of the first character, relative to the origin of `drawable`.
     * @param y The y coordinate of the first character, relative to the origin of `drawable`.
     * @param gc The graphics context to use.
     *      * The following graphics context components are used: plane-mask, foreground,
     * background, font, subwindow-mode, clip-x-origin, clip-y-origin, and clip-mask.
     *
     * See also:
     *
     * {@link XConnection.imageText8}
     */
    imageText16(drawable: DRAWABLE, gc: GCONTEXT, x: number, y: number, _string: CHAR2B[]): RequestChecker
  }
}

XConnection.prototype.imageText16 = function (
  drawable: DRAWABLE,
  gc: GCONTEXT,
  x: number,
  y: number,
  _string: CHAR2B[],
): RequestChecker {
  const stringLen = _string.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIhh', stringLen, drawable, gc, x, y))
  _string.forEach(({ byte1, byte2 }) => {
    requestParts.push(pack('<BB', byte1, byte2))
  })

  return this.sendVoidRequest(requestParts, 77, 0, 'imageText16')
}

declare module './connection' {
  interface XConnection {
    createColormap(alloc: ColormapAlloc, mid: COLORMAP, window: WINDOW, visual: VISUALID): RequestChecker
  }
}

XConnection.prototype.createColormap = function (
  alloc: ColormapAlloc,
  mid: COLORMAP,
  window: WINDOW,
  visual: VISUALID,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIII', alloc, mid, window, visual))

  return this.sendVoidRequest(requestParts, 78, 0, 'createColormap')
}

declare module './connection' {
  interface XConnection {
    freeColormap(cmap: COLORMAP): RequestChecker
  }
}

XConnection.prototype.freeColormap = function (cmap: COLORMAP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', cmap))

  return this.sendVoidRequest(requestParts, 79, 0, 'freeColormap')
}

declare module './connection' {
  interface XConnection {
    copyColormapAndFree(mid: COLORMAP, srcCmap: COLORMAP): RequestChecker
  }
}

XConnection.prototype.copyColormapAndFree = function (mid: COLORMAP, srcCmap: COLORMAP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', mid, srcCmap))

  return this.sendVoidRequest(requestParts, 80, 0, 'copyColormapAndFree')
}

declare module './connection' {
  interface XConnection {
    installColormap(cmap: COLORMAP): RequestChecker
  }
}

XConnection.prototype.installColormap = function (cmap: COLORMAP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', cmap))

  return this.sendVoidRequest(requestParts, 81, 0, 'installColormap')
}

declare module './connection' {
  interface XConnection {
    uninstallColormap(cmap: COLORMAP): RequestChecker
  }
}

XConnection.prototype.uninstallColormap = function (cmap: COLORMAP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', cmap))

  return this.sendVoidRequest(requestParts, 82, 0, 'uninstallColormap')
}

declare module './connection' {
  interface XConnection {
    listInstalledColormaps(window: WINDOW): ListInstalledColormapsCookie
  }
}

XConnection.prototype.listInstalledColormaps = function (window: WINDOW): ListInstalledColormapsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.sendRequest<ListInstalledColormapsReply>(
    requestParts,
    83,
    unmarshallListInstalledColormapsReply,
    0,
    'listInstalledColormaps',
  )
}

declare module './connection' {
  interface XConnection {
    /**
     * Allocate a color
     *
     * Allocates a read-only colormap entry corresponding to the closest RGB value
     * supported by the hardware. If you are using TrueColor, you can take a shortcut
     * and directly calculate the color pixel value to avoid the round trip. But, for
     * example, on 16-bit color setups (VNC), you can easily get the closest supported
     * RGB value to the RGB value you are specifying.
     * @param cmap TODO
     * @param red The red value of your color.
     * @param green The green value of your color.
     * @param blue The blue value of your color.
     */
    allocColor(cmap: COLORMAP, red: number, green: number, blue: number): AllocColorCookie
  }
}

XConnection.prototype.allocColor = function (
  cmap: COLORMAP,
  red: number,
  green: number,
  blue: number,
): AllocColorCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIHHH2x', cmap, red, green, blue))

  return this.sendRequest<AllocColorReply>(requestParts, 84, unmarshallAllocColorReply, 0, 'allocColor')
}

declare module './connection' {
  interface XConnection {
    allocNamedColor(cmap: COLORMAP, name: Int8Array): AllocNamedColorCookie
  }
}

XConnection.prototype.allocNamedColor = function (cmap: COLORMAP, name: Int8Array): AllocNamedColorCookie {
  const nameLen = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIH2x', cmap, nameLen))
  requestParts.push(pad(name.buffer))

  return this.sendRequest<AllocNamedColorReply>(requestParts, 85, unmarshallAllocNamedColorReply, 0, 'allocNamedColor')
}

declare module './connection' {
  interface XConnection {
    allocColorCells(contiguous: number, cmap: COLORMAP, colors: number, planes: number): AllocColorCellsCookie
  }
}

XConnection.prototype.allocColorCells = function (
  contiguous: number,
  cmap: COLORMAP,
  colors: number,
  planes: number,
): AllocColorCellsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIHH', contiguous, cmap, colors, planes))

  return this.sendRequest<AllocColorCellsReply>(requestParts, 86, unmarshallAllocColorCellsReply, 0, 'allocColorCells')
}

declare module './connection' {
  interface XConnection {
    allocColorPlanes(
      contiguous: number,
      cmap: COLORMAP,
      colors: number,
      reds: number,
      greens: number,
      blues: number,
    ): AllocColorPlanesCookie
  }
}

XConnection.prototype.allocColorPlanes = function (
  contiguous: number,
  cmap: COLORMAP,
  colors: number,
  reds: number,
  greens: number,
  blues: number,
): AllocColorPlanesCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIHHHH', contiguous, cmap, colors, reds, greens, blues))

  return this.sendRequest<AllocColorPlanesReply>(
    requestParts,
    87,
    unmarshallAllocColorPlanesReply,
    0,
    'allocColorPlanes',
  )
}

declare module './connection' {
  interface XConnection {
    freeColors(cmap: COLORMAP, planeMask: number, pixelsLen: number, pixels: Uint32Array): RequestChecker
  }
}

XConnection.prototype.freeColors = function (
  cmap: COLORMAP,
  planeMask: number,
  pixelsLen: number,
  pixels: Uint32Array,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', cmap, planeMask))
  requestParts.push(pad(pixels.buffer))

  return this.sendVoidRequest(requestParts, 88, 0, 'freeColors')
}

declare module './connection' {
  interface XConnection {
    storeColors(cmap: COLORMAP, itemsLen: number, items: COLORITEM[]): RequestChecker
  }
}

XConnection.prototype.storeColors = function (cmap: COLORMAP, itemsLen: number, items: COLORITEM[]): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', cmap))
  items.forEach(({ pixel, red, green, blue, flags }) => {
    requestParts.push(pack('<IHHHBx', pixel, red, green, blue, flags))
  })

  return this.sendVoidRequest(requestParts, 89, 0, 'storeColors')
}

declare module './connection' {
  interface XConnection {
    storeNamedColor(flags: number, cmap: COLORMAP, pixel: number, name: Int8Array): RequestChecker
  }
}

XConnection.prototype.storeNamedColor = function (
  flags: number,
  cmap: COLORMAP,
  pixel: number,
  name: Int8Array,
): RequestChecker {
  const nameLen = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIIH2x', flags, cmap, pixel, nameLen))
  requestParts.push(pad(name.buffer))

  return this.sendVoidRequest(requestParts, 90, 0, 'storeNamedColor')
}

declare module './connection' {
  interface XConnection {
    queryColors(cmap: COLORMAP, pixelsLen: number, pixels: Uint32Array): QueryColorsCookie
  }
}

XConnection.prototype.queryColors = function (
  cmap: COLORMAP,
  pixelsLen: number,
  pixels: Uint32Array,
): QueryColorsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', cmap))
  requestParts.push(pad(pixels.buffer))

  return this.sendRequest<QueryColorsReply>(requestParts, 91, unmarshallQueryColorsReply, 0, 'queryColors')
}

declare module './connection' {
  interface XConnection {
    lookupColor(cmap: COLORMAP, name: Int8Array): LookupColorCookie
  }
}

XConnection.prototype.lookupColor = function (cmap: COLORMAP, name: Int8Array): LookupColorCookie {
  const nameLen = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIH2x', cmap, nameLen))
  requestParts.push(pad(name.buffer))

  return this.sendRequest<LookupColorReply>(requestParts, 92, unmarshallLookupColorReply, 0, 'lookupColor')
}

declare module './connection' {
  interface XConnection {
    createCursor(
      cid: CURSOR,
      source: PIXMAP,
      mask: PIXMAP,
      foreRed: number,
      foreGreen: number,
      foreBlue: number,
      backRed: number,
      backGreen: number,
      backBlue: number,
      x: number,
      y: number,
    ): RequestChecker
  }
}

XConnection.prototype.createCursor = function (
  cid: CURSOR,
  source: PIXMAP,
  mask: PIXMAP,
  foreRed: number,
  foreGreen: number,
  foreBlue: number,
  backRed: number,
  backGreen: number,
  backBlue: number,
  x: number,
  y: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack('<xx2xIIIHHHHHHHH', cid, source, mask, foreRed, foreGreen, foreBlue, backRed, backGreen, backBlue, x, y),
  )

  return this.sendVoidRequest(requestParts, 93, 0, 'createCursor')
}

declare module './connection' {
  interface XConnection {
    /**
     * create cursor
     *
     * Creates a cursor from a font glyph. X provides a set of standard cursor shapes
     * in a special font named cursor. Applications are encouraged to use this
     * interface for their cursors because the font can be customized for the
     * individual display type.
     *
     * All pixels which are set to 1 in the source will use the foreground color (as
     * specified by `fore_red`, `fore_green` and `fore_blue`). All pixels set to 0
     * will use the background color (as specified by `back_red`, `back_green` and
     * `back_blue`).
     * @param cid The ID with which you will refer to the cursor, created by `xcb_generate_id`.
     * @param source_font In which font to look for the cursor glyph.
     * @param mask_font In which font to look for the mask glyph.
     * @param source_char The glyph of `source_font` to use.
     * @param mask_char The glyph of `mask_font` to use as a mask: Pixels which are set to 1 define
     * which source pixels are displayed. All pixels which are set to 0 are not
     * displayed.
     * @param fore_red The red value of the foreground color.
     * @param fore_green The green value of the foreground color.
     * @param fore_blue The blue value of the foreground color.
     * @param back_red The red value of the background color.
     * @param back_green The green value of the background color.
     * @param back_blue The blue value of the background color.
     */
    createGlyphCursor(
      cid: CURSOR,
      sourceFont: FONT,
      maskFont: FONT,
      sourceChar: number,
      maskChar: number,
      foreRed: number,
      foreGreen: number,
      foreBlue: number,
      backRed: number,
      backGreen: number,
      backBlue: number,
    ): RequestChecker
  }
}

XConnection.prototype.createGlyphCursor = function (
  cid: CURSOR,
  sourceFont: FONT,
  maskFont: FONT,
  sourceChar: number,
  maskChar: number,
  foreRed: number,
  foreGreen: number,
  foreBlue: number,
  backRed: number,
  backGreen: number,
  backBlue: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack(
      '<xx2xIIIHHHHHHHH',
      cid,
      sourceFont,
      maskFont,
      sourceChar,
      maskChar,
      foreRed,
      foreGreen,
      foreBlue,
      backRed,
      backGreen,
      backBlue,
    ),
  )

  return this.sendVoidRequest(requestParts, 94, 0, 'createGlyphCursor')
}

declare module './connection' {
  interface XConnection {
    /**
     * Deletes a cursor
     *
     * Deletes the association between the cursor resource ID and the specified
     * cursor. The cursor is freed when no other resource references it.
     * @param cursor The cursor to destroy.
     */
    freeCursor(cursor: CURSOR): RequestChecker
  }
}

XConnection.prototype.freeCursor = function (cursor: CURSOR): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', cursor))

  return this.sendVoidRequest(requestParts, 95, 0, 'freeCursor')
}

declare module './connection' {
  interface XConnection {
    recolorCursor(
      cursor: CURSOR,
      foreRed: number,
      foreGreen: number,
      foreBlue: number,
      backRed: number,
      backGreen: number,
      backBlue: number,
    ): RequestChecker
  }
}

XConnection.prototype.recolorCursor = function (
  cursor: CURSOR,
  foreRed: number,
  foreGreen: number,
  foreBlue: number,
  backRed: number,
  backGreen: number,
  backBlue: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIHHHHHH', cursor, foreRed, foreGreen, foreBlue, backRed, backGreen, backBlue))

  return this.sendVoidRequest(requestParts, 96, 0, 'recolorCursor')
}

declare module './connection' {
  interface XConnection {
    queryBestSize(_class: QueryShapeOf, drawable: DRAWABLE, width: number, height: number): QueryBestSizeCookie
  }
}

XConnection.prototype.queryBestSize = function (
  _class: QueryShapeOf,
  drawable: DRAWABLE,
  width: number,
  height: number,
): QueryBestSizeCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xIHH', _class, drawable, width, height))

  return this.sendRequest<QueryBestSizeReply>(requestParts, 97, unmarshallQueryBestSizeReply, 0, 'queryBestSize')
}

declare module './connection' {
  interface XConnection {
    /**
     * check if extension is present
     *
     * Determines if the specified extension is present on this X11 server.
     *
     * Every extension has a unique `major_opcode` to identify requests, the minor
     * opcodes and request formats are extension-specific. If the extension provides
     * events and errors, the `first_event` and `first_error` fields in the reply are
     * set accordingly.
     *
     * There should rarely be a need to use this request directly, XCB provides the
     * `xcb_get_extension_data` function instead.
     * @param name_len The length of `name` in bytes.
     * @param name The name of the extension to query, for example "RANDR". This is case
     * sensitive!
     *
     * See also:
     */
    queryExtension(name: Int8Array): QueryExtensionCookie
  }
}

XConnection.prototype.queryExtension = function (name: Int8Array): QueryExtensionCookie {
  const nameLen = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xH2x', nameLen))
  requestParts.push(pad(name.buffer))

  return this.sendRequest<QueryExtensionReply>(requestParts, 98, unmarshallQueryExtensionReply, 0, 'queryExtension')
}

declare module './connection' {
  interface XConnection {
    listExtensions(): ListExtensionsCookie
  }
}

XConnection.prototype.listExtensions = function (): ListExtensionsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<ListExtensionsReply>(requestParts, 99, unmarshallListExtensionsReply, 0, 'listExtensions')
}

declare module './connection' {
  interface XConnection {
    changeKeyboardMapping(firstKeycode: KEYCODE, keysymsPerKeycode: number, keysyms: Uint32Array): RequestChecker
  }
}

XConnection.prototype.changeKeyboardMapping = function (
  firstKeycode: KEYCODE,
  keysymsPerKeycode: number,
  keysyms: Uint32Array,
): RequestChecker {
  const keycodeCount = keysyms.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xBB2x', keycodeCount, firstKeycode, keysymsPerKeycode))
  requestParts.push(pad(keysyms.buffer))

  return this.sendVoidRequest(requestParts, 100, 0, 'changeKeyboardMapping')
}

declare module './connection' {
  interface XConnection {
    getKeyboardMapping(firstKeycode: KEYCODE, count: number): GetKeyboardMappingCookie
  }
}

XConnection.prototype.getKeyboardMapping = function (firstKeycode: KEYCODE, count: number): GetKeyboardMappingCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xBB', firstKeycode, count))

  return this.sendRequest<GetKeyboardMappingReply>(
    requestParts,
    101,
    unmarshallGetKeyboardMappingReply,
    0,
    'getKeyboardMapping',
  )
}

declare module './connection' {
  interface XConnection {
    changeKeyboardControl(
      valueList: Partial<{
        keyClickPercent: number
        bellPercent: number
        bellPitch: number
        bellDuration: number
        led: number
        ledMode: LedMode
        key: KEYCODE32
        autoRepeatMode: AutoRepeatMode
      }>,
    ): RequestChecker
  }
}

XConnection.prototype.changeKeyboardControl = function (
  valueList: Partial<{
    keyClickPercent: number
    bellPercent: number
    bellPitch: number
    bellDuration: number
    led: number
    ledMode: LedMode
    key: KEYCODE32
    autoRepeatMode: AutoRepeatMode
  }>,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  const valueListFormats: { [key: string]: string } = {
    keyClickPercent: 'i',
    bellPercent: 'i',
    bellPitch: 'i',
    bellDuration: 'i',
    led: 'I',
    ledMode: 'I',
    key: 'I',
    autoRepeatMode: 'I',
  }

  const valueListBitmasks: { [key: string]: number } = {
    keyClickPercent: KB.KeyClickPercent,
    bellPercent: KB.BellPercent,
    bellPitch: KB.BellPitch,
    bellDuration: KB.BellDuration,
    led: KB.Led,
    ledMode: KB.LedMode,
    key: KB.Key,
    autoRepeatMode: KB.AutoRepeatMode,
  }
  const valueMaskSortedList = Object.keys(valueList).sort((a, b) => valueListBitmasks[a] - valueListBitmasks[b])
  const valueMask = valueMaskSortedList.map((value) => valueListBitmasks[value]).reduce((mask, bit) => mask | bit, 0)

  const valueListValues = Object.entries(valueList)
    .sort(([key], [otherKey]) => valueMaskSortedList.indexOf(key) - valueMaskSortedList.indexOf(otherKey))
    .map(([_, value]) => value)
    .filter(notUndefined)
  requestParts.push(pack('<xx2xI', valueMask))
  requestParts.push(pack(`<${valueMaskSortedList.map((key) => valueListFormats[key]).join('')}`, ...valueListValues))

  return this.sendVoidRequest(requestParts, 102, 0, 'changeKeyboardControl')
}

declare module './connection' {
  interface XConnection {
    getKeyboardControl(): GetKeyboardControlCookie
  }
}

XConnection.prototype.getKeyboardControl = function (): GetKeyboardControlCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<GetKeyboardControlReply>(
    requestParts,
    103,
    unmarshallGetKeyboardControlReply,
    0,
    'getKeyboardControl',
  )
}

declare module './connection' {
  interface XConnection {
    bell(percent: number): RequestChecker
  }
}

XConnection.prototype.bell = function (percent: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xb2x', percent))

  return this.sendVoidRequest(requestParts, 104, 0, 'bell')
}

declare module './connection' {
  interface XConnection {
    changePointerControl(
      accelerationNumerator: number,
      accelerationDenominator: number,
      threshold: number,
      doAcceleration: number,
      doThreshold: number,
    ): RequestChecker
  }
}

XConnection.prototype.changePointerControl = function (
  accelerationNumerator: number,
  accelerationDenominator: number,
  threshold: number,
  doAcceleration: number,
  doThreshold: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack('<xx2xhhhBB', accelerationNumerator, accelerationDenominator, threshold, doAcceleration, doThreshold),
  )

  return this.sendVoidRequest(requestParts, 105, 0, 'changePointerControl')
}

declare module './connection' {
  interface XConnection {
    getPointerControl(): GetPointerControlCookie
  }
}

XConnection.prototype.getPointerControl = function (): GetPointerControlCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<GetPointerControlReply>(
    requestParts,
    106,
    unmarshallGetPointerControlReply,
    0,
    'getPointerControl',
  )
}

declare module './connection' {
  interface XConnection {
    setScreenSaver(
      timeout: number,
      interval: number,
      preferBlanking: Blanking,
      allowExposures: Exposures,
    ): RequestChecker
  }
}

XConnection.prototype.setScreenSaver = function (
  timeout: number,
  interval: number,
  preferBlanking: Blanking,
  allowExposures: Exposures,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xhhBB', timeout, interval, preferBlanking, allowExposures))

  return this.sendVoidRequest(requestParts, 107, 0, 'setScreenSaver')
}

declare module './connection' {
  interface XConnection {
    getScreenSaver(): GetScreenSaverCookie
  }
}

XConnection.prototype.getScreenSaver = function (): GetScreenSaverCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<GetScreenSaverReply>(requestParts, 108, unmarshallGetScreenSaverReply, 0, 'getScreenSaver')
}

declare module './connection' {
  interface XConnection {
    changeHosts(mode: HostMode, family: Family, address: Uint8Array): RequestChecker
  }
}

XConnection.prototype.changeHosts = function (mode: HostMode, family: Family, address: Uint8Array): RequestChecker {
  const addressLen = address.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2xBxH', mode, family, addressLen))
  requestParts.push(pad(address.buffer))

  return this.sendVoidRequest(requestParts, 109, 0, 'changeHosts')
}

declare module './connection' {
  interface XConnection {
    listHosts(): ListHostsCookie
  }
}

XConnection.prototype.listHosts = function (): ListHostsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<ListHostsReply>(requestParts, 110, unmarshallListHostsReply, 0, 'listHosts')
}

declare module './connection' {
  interface XConnection {
    setAccessControl(mode: AccessControl): RequestChecker
  }
}

XConnection.prototype.setAccessControl = function (mode: AccessControl): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2x', mode))

  return this.sendVoidRequest(requestParts, 111, 0, 'setAccessControl')
}

declare module './connection' {
  interface XConnection {
    setCloseDownMode(mode: CloseDown): RequestChecker
  }
}

XConnection.prototype.setCloseDownMode = function (mode: CloseDown): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2x', mode))

  return this.sendVoidRequest(requestParts, 112, 0, 'setCloseDownMode')
}

declare module './connection' {
  interface XConnection {
    /**
     * kills a client
     *
     * Forces a close down of the client that created the specified `resource`.
     * @param resource Any resource belonging to the client (for example a Window), used to identify
     * the client connection.
     *      * The special value of `XCB_KILL_ALL_TEMPORARY`, the resources of all clients
     * that have terminated in `RetainTemporary` (TODO) are destroyed.
     *
     * See also:
     */
    killClient(resource: number): RequestChecker
  }
}

XConnection.prototype.killClient = function (resource: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', resource))

  return this.sendVoidRequest(requestParts, 113, 0, 'killClient')
}

declare module './connection' {
  interface XConnection {
    rotateProperties(window: WINDOW, delta: number, atoms: Uint32Array): RequestChecker
  }
}

XConnection.prototype.rotateProperties = function (window: WINDOW, delta: number, atoms: Uint32Array): RequestChecker {
  const atomsLen = atoms.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIHh', window, atomsLen, delta))
  requestParts.push(pad(atoms.buffer))

  return this.sendVoidRequest(requestParts, 114, 0, 'rotateProperties')
}

declare module './connection' {
  interface XConnection {
    forceScreenSaver(mode: ScreenSaver): RequestChecker
  }
}

XConnection.prototype.forceScreenSaver = function (mode: ScreenSaver): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2x', mode))

  return this.sendVoidRequest(requestParts, 115, 0, 'forceScreenSaver')
}

declare module './connection' {
  interface XConnection {
    setPointerMapping(map: Uint8Array): SetPointerMappingCookie
  }
}

XConnection.prototype.setPointerMapping = function (map: Uint8Array): SetPointerMappingCookie {
  const mapLen = map.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2x', mapLen))
  requestParts.push(pad(map.buffer))

  return this.sendRequest<SetPointerMappingReply>(
    requestParts,
    116,
    unmarshallSetPointerMappingReply,
    0,
    'setPointerMapping',
  )
}

declare module './connection' {
  interface XConnection {
    getPointerMapping(): GetPointerMappingCookie
  }
}

XConnection.prototype.getPointerMapping = function (): GetPointerMappingCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<GetPointerMappingReply>(
    requestParts,
    117,
    unmarshallGetPointerMappingReply,
    0,
    'getPointerMapping',
  )
}

declare module './connection' {
  interface XConnection {
    setModifierMapping(keycodes: Uint8Array): SetModifierMappingCookie
  }
}

XConnection.prototype.setModifierMapping = function (keycodes: Uint8Array): SetModifierMappingCookie {
  const keycodesPerModifier = keycodes.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xB2x', keycodesPerModifier))
  requestParts.push(pad(keycodes.buffer))

  return this.sendRequest<SetModifierMappingReply>(
    requestParts,
    118,
    unmarshallSetModifierMappingReply,
    0,
    'setModifierMapping',
  )
}

declare module './connection' {
  interface XConnection {
    getModifierMapping(): GetModifierMappingCookie
  }
}

XConnection.prototype.getModifierMapping = function (): GetModifierMappingCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendRequest<GetModifierMappingReply>(
    requestParts,
    119,
    unmarshallGetModifierMappingReply,
    0,
    'getModifierMapping',
  )
}

declare module './connection' {
  interface XConnection {
    noOperation(): RequestChecker
  }
}

XConnection.prototype.noOperation = function (): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.sendVoidRequest(requestParts, 127, 0, 'noOperation')
}

export const KeyPressEvent = 2 as const
export const KeyReleaseEvent = 3 as const
export const ButtonPressEvent = 4 as const
export const ButtonReleaseEvent = 5 as const
export const MotionNotifyEvent = 6 as const
export const EnterNotifyEvent = 7 as const
export const LeaveNotifyEvent = 8 as const
export const FocusInEvent = 9 as const
export const FocusOutEvent = 10 as const
export const KeymapNotifyEvent = 11 as const
export const ExposeEvent = 12 as const
export const GraphicsExposureEvent = 13 as const
export const NoExposureEvent = 14 as const
export const VisibilityNotifyEvent = 15 as const
export const CreateNotifyEvent = 16 as const
export const DestroyNotifyEvent = 17 as const
export const UnmapNotifyEvent = 18 as const
export const MapNotifyEvent = 19 as const
export const MapRequestEvent = 20 as const
export const ReparentNotifyEvent = 21 as const
export const ConfigureNotifyEvent = 22 as const
export const ConfigureRequestEvent = 23 as const
export const GravityNotifyEvent = 24 as const
export const ResizeRequestEvent = 25 as const
export const CirculateNotifyEvent = 26 as const
export const CirculateRequestEvent = 27 as const
export const PropertyNotifyEvent = 28 as const
export const SelectionClearEvent = 29 as const
export const SelectionRequestEvent = 30 as const
export const SelectionNotifyEvent = 31 as const
export const ColormapNotifyEvent = 32 as const
export const ClientMessageEvent = 33 as const
export const MappingNotifyEvent = 34 as const
export const GeGenericEvent = 35 as const
errors[1] = [unmarshallRequestError, BadRequest]
errors[2] = [unmarshallValueError, BadValue]
errors[3] = [unmarshallWindowError, BadWindow]
errors[4] = [unmarshallPixmapError, BadPixmap]
errors[5] = [unmarshallAtomError, BadAtom]
errors[6] = [unmarshallCursorError, BadCursor]
errors[7] = [unmarshallFontError, BadFont]
errors[8] = [unmarshallMatchError, BadMatch]
errors[9] = [unmarshallDrawableError, BadDrawable]
errors[10] = [unmarshallAccessError, BadAccess]
errors[11] = [unmarshallAllocError, BadAlloc]
errors[12] = [unmarshallColormapError, BadColormap]
errors[13] = [unmarshallGContextError, BadGContext]
errors[14] = [unmarshallIDChoiceError, BadIDChoice]
errors[15] = [unmarshallNameError, BadName]
errors[16] = [unmarshallLengthError, BadLength]
errors[17] = [unmarshallImplementationError, BadImplementation]
