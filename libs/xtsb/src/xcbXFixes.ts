import { RECTANGLE, PIXMAP, unmarshallRECTANGLE, TIMESTAMP, CURSOR, WINDOW, ATOM, GCONTEXT } from './xcb'
import { SK } from './xcbShape'
import { PICTURE } from './xcbRender'
//
// This file generated automatically from xfixes.xml by ts_client.py.
// Edit at your peril.
//

import { XConnection, chars, pad } from './connection'
import Protocol from './Protocol'
import type { Unmarshaller, EventHandler, RequestChecker } from './xjsbInternals'
import { xcbSimpleList, xcbComplexList, typePad, errors, concatArrayBuffers } from './xjsbInternals'
import { unpackFrom, pack } from './struct'

export class XFixes extends Protocol {
  static MAJOR_VERSION = 5
  static MINOR_VERSION = 0
}

const errorInits: ((firstError: number) => void)[] = []

let protocolExtension: XFixes | undefined = undefined

export async function getXFixes(xConnection: XConnection): Promise<XFixes> {
  if (protocolExtension && protocolExtension.xConnection === xConnection) {
    return protocolExtension
  }
  const queryExtensionReply = await xConnection.queryExtension(chars('XFIXES'))
  if (queryExtensionReply.present === 0) {
    throw new Error('XFixes extension not present.')
  }
  const { majorOpcode, firstEvent, firstError } = queryExtensionReply
  protocolExtension = new XFixes(xConnection, majorOpcode, firstEvent, firstError)
  errorInits.forEach((init) => init(firstError))
  return protocolExtension
}

export type QueryVersionCookie = Promise<QueryVersionReply>

export type QueryVersionReply = {
  responseType: number
  majorVersion: number
  minorVersion: number
}

export const unmarshallQueryVersionReply: Unmarshaller<QueryVersionReply> = (buffer, offset = 0) => {
  const [responseType, majorVersion, minorVersion] = unpackFrom('<Bx2x4xII16x', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
      majorVersion,
      minorVersion,
    },
    offset,
  }
}

export enum SaveSetMode {
  Insert = 0,
  Delete = 1,
}

export enum SaveSetTarget {
  Nearest = 0,
  Root = 1,
}

export enum SaveSetMapping {
  Map = 0,
  Unmap = 1,
}

export enum SelectionEvent {
  SetSelectionOwner = 0,
  SelectionWindowDestroy = 1,
  SelectionClientClose = 2,
}

export enum SelectionEventMask {
  SetSelectionOwner = 1,
  SelectionWindowDestroy = 2,
  SelectionClientClose = 4,
}

export type SelectionNotifyEvent = {
  responseType: number
  subtype: SelectionEvent
  window: WINDOW
  owner: WINDOW
  selection: ATOM
  timestamp: TIMESTAMP
  selectionTimestamp: TIMESTAMP
}

export const unmarshallSelectionNotifyEvent: Unmarshaller<SelectionNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, subtype, window, owner, selection, timestamp, selectionTimestamp] = unpackFrom(
    '<BB2xIIIII8x',
    buffer,
    offset,
  )
  offset += 32

  return {
    value: {
      responseType,
      subtype,
      window,
      owner,
      selection,
      timestamp,
      selectionTimestamp,
    },
    offset,
  }
}
export const marshallSelectionNotifyEvent = (instance: SelectionNotifyEvent): ArrayBuffer => {
  const buffers: ArrayBuffer[] = []
  {
    const { subtype, window, owner, selection, timestamp, selectionTimestamp } = instance
    buffers.push(pack('<xB2xIIIII8x', subtype, window, owner, selection, timestamp, selectionTimestamp))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface SelectionNotifyEventHandler extends EventHandler<SelectionNotifyEvent> {}

export enum CursorNotify {
  DisplayCursor = 0,
}

export enum CursorNotifyMask {
  DisplayCursor = 1,
}

export type CursorNotifyEvent = {
  responseType: number
  subtype: CursorNotify
  window: WINDOW
  cursorSerial: number
  timestamp: TIMESTAMP
  name: ATOM
}

export const unmarshallCursorNotifyEvent: Unmarshaller<CursorNotifyEvent> = (buffer, offset = 0) => {
  const [responseType, subtype, window, cursorSerial, timestamp, name] = unpackFrom('<BB2xIIII12x', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
      subtype,
      window,
      cursorSerial,
      timestamp,
      name,
    },
    offset,
  }
}
export const marshallCursorNotifyEvent = (instance: CursorNotifyEvent): ArrayBuffer => {
  const buffers: ArrayBuffer[] = []
  {
    const { subtype, window, cursorSerial, timestamp, name } = instance
    buffers.push(pack('<xB2xIIII12x', subtype, window, cursorSerial, timestamp, name))
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface CursorNotifyEventHandler extends EventHandler<CursorNotifyEvent> {}

export type GetCursorImageCookie = Promise<GetCursorImageReply>

export type GetCursorImageReply = {
  responseType: number
  x: number
  y: number
  width: number
  height: number
  xhot: number
  yhot: number
  cursorSerial: number
  cursorImage: Uint32Array
}

export const unmarshallGetCursorImageReply: Unmarshaller<GetCursorImageReply> = (buffer, offset = 0) => {
  const [responseType, x, y, width, height, xhot, yhot, cursorSerial] = unpackFrom('<Bx2x4xhhHHHHI8x', buffer, offset)
  offset += 32
  const cursorImageWithOffset = xcbSimpleList(buffer, offset, width * height, Uint32Array, 4)
  offset = cursorImageWithOffset.offset
  const cursorImage = cursorImageWithOffset.value

  return {
    value: {
      responseType,
      x,
      y,
      width,
      height,
      xhot,
      yhot,
      cursorSerial,
      cursorImage,
    },
    offset,
  }
}

export type RegionError = {
  responseType: number
}

export const unmarshallBadRegionError: Unmarshaller<RegionError> = (buffer, offset = 0) => {
  const [responseType] = unpackFrom('<Bx2x', buffer, offset)
  offset += 4

  return {
    value: {
      responseType,
    },
    offset,
  }
}
export const marshallBadRegionError = (): ArrayBuffer => {
  const byteLength = 0
  const buffers: ArrayBuffer[] = []
  return concatArrayBuffers(buffers, byteLength)
}

export class BadRegion extends Error {
  readonly xError: RegionError
  constructor(error: RegionError) {
    super(JSON.stringify(error))
    this.name = 'RegionError'
    this.xError = error
  }
}

export enum Region {
  None = 0,
}

export type FetchRegionCookie = Promise<FetchRegionReply>

export type FetchRegionReply = {
  responseType: number
  extents: RECTANGLE
  rectangles: RECTANGLE[]
}

export const unmarshallFetchRegionReply: Unmarshaller<FetchRegionReply> = (buffer, offset = 0) => {
  const [responseType] = unpackFrom('<Bx2x4x', buffer, offset)
  offset += 8
  const extentsWithOffset = unmarshallRECTANGLE(buffer, offset)
  const extents = extentsWithOffset.value
  offset = extentsWithOffset.offset
  offset += typePad(8, offset)
  // FIXME length is wrong and should come from unpackFrom
  const length = 1
  const rectanglesWithOffset = xcbComplexList(buffer, offset, length / 2, unmarshallRECTANGLE)
  offset = rectanglesWithOffset.offset
  const rectangles = rectanglesWithOffset.value

  return {
    value: {
      responseType,
      extents,
      rectangles,
    },
    offset,
  }
}

export type GetCursorNameCookie = Promise<GetCursorNameReply>

export type GetCursorNameReply = {
  responseType: number
  atom: ATOM
  nbytes: number
  name: Int8Array
}

export const unmarshallGetCursorNameReply: Unmarshaller<GetCursorNameReply> = (buffer, offset = 0) => {
  const [responseType, atom, nbytes] = unpackFrom('<Bx2x4xIH18x', buffer, offset)
  offset += 32
  const nameWithOffset = xcbSimpleList(buffer, offset, nbytes, Int8Array, 1)
  offset = nameWithOffset.offset
  const name = nameWithOffset.value

  return {
    value: {
      responseType,
      atom,
      nbytes,
      name,
    },
    offset,
  }
}

export type GetCursorImageAndNameCookie = Promise<GetCursorImageAndNameReply>

export type GetCursorImageAndNameReply = {
  responseType: number
  x: number
  y: number
  width: number
  height: number
  xhot: number
  yhot: number
  cursorSerial: number
  cursorAtom: ATOM
  nbytes: number
  cursorImage: Uint32Array
  name: Int8Array
}

export const unmarshallGetCursorImageAndNameReply: Unmarshaller<GetCursorImageAndNameReply> = (buffer, offset = 0) => {
  const [responseType, x, y, width, height, xhot, yhot, cursorSerial, cursorAtom, nbytes] = unpackFrom(
    '<Bx2x4xhhHHHHIIH2x',
    buffer,
    offset,
  )
  offset += 32
  const cursorImageWithOffset = xcbSimpleList(buffer, offset, width * height, Uint32Array, 4)
  offset = cursorImageWithOffset.offset
  const cursorImage = cursorImageWithOffset.value
  offset += typePad(1, offset)
  const nameWithOffset = xcbSimpleList(buffer, offset, nbytes, Int8Array, 1)
  offset = nameWithOffset.offset
  const name = nameWithOffset.value

  return {
    value: {
      responseType,
      x,
      y,
      width,
      height,
      xhot,
      yhot,
      cursorSerial,
      cursorAtom,
      nbytes,
      cursorImage,
      name,
    },
    offset,
  }
}

export enum BarrierDirections {
  PositiveX = 1,
  PositiveY = 2,
  NegativeX = 4,
  NegativeY = 8,
}

declare module './xcbXFixes' {
  interface XFixes {
    queryVersion(clientMajorVersion: number, clientMinorVersion: number): QueryVersionCookie
  }
}

XFixes.prototype.queryVersion = function (clientMajorVersion: number, clientMinorVersion: number): QueryVersionCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', clientMajorVersion, clientMinorVersion))

  return this.xConnection.sendRequest<QueryVersionReply>(
    requestParts,
    this.majorOpcode,
    unmarshallQueryVersionReply,
    0,
    'queryVersion',
  )
}

declare module './xcbXFixes' {
  interface XFixes {
    changeSaveSet(mode: SaveSetMode, target: SaveSetTarget, map: SaveSetMapping, window: WINDOW): RequestChecker
  }
}

XFixes.prototype.changeSaveSet = function (
  mode: SaveSetMode,
  target: SaveSetTarget,
  map: SaveSetMapping,
  window: WINDOW,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xBBBxI', mode, target, map, window))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 1, 'changeSaveSet')
}

declare module './xcbXFixes' {
  interface XFixes {
    selectSelectionInput(window: WINDOW, selection: ATOM, eventMask: number): RequestChecker
  }
}

XFixes.prototype.selectSelectionInput = function (window: WINDOW, selection: ATOM, eventMask: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIII', window, selection, eventMask))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 2, 'selectSelectionInput')
}

declare module './xcbXFixes' {
  interface XFixes {
    selectCursorInput(window: WINDOW, eventMask: number): RequestChecker
  }
}

XFixes.prototype.selectCursorInput = function (window: WINDOW, eventMask: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', window, eventMask))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 3, 'selectCursorInput')
}

declare module './xcbXFixes' {
  interface XFixes {
    getCursorImage(): GetCursorImageCookie
  }
}

XFixes.prototype.getCursorImage = function (): GetCursorImageCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.xConnection.sendRequest<GetCursorImageReply>(
    requestParts,
    this.majorOpcode,
    unmarshallGetCursorImageReply,
    4,
    'getCursorImage',
  )
}

export type REGION = number

declare module './xcbXFixes' {
  interface XFixes {
    createRegion(region: REGION, rectanglesLen: number, rectangles: RECTANGLE[]): RequestChecker
  }
}

XFixes.prototype.createRegion = function (
  region: REGION,
  rectanglesLen: number,
  rectangles: RECTANGLE[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', region))
  rectangles.forEach(({ x, y, width, height }) => {
    requestParts.push(pack('<hhHH', x, y, width, height))
  })

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 5, 'createRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    createRegionFromBitmap(region: REGION, bitmap: PIXMAP): RequestChecker
  }
}

XFixes.prototype.createRegionFromBitmap = function (region: REGION, bitmap: PIXMAP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', region, bitmap))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 6, 'createRegionFromBitmap')
}

declare module './xcbXFixes' {
  interface XFixes {
    createRegionFromWindow(region: REGION, window: WINDOW, kind: SK): RequestChecker
  }
}

XFixes.prototype.createRegionFromWindow = function (region: REGION, window: WINDOW, kind: SK): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIB3x', region, window, kind))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 7, 'createRegionFromWindow')
}

declare module './xcbXFixes' {
  interface XFixes {
    createRegionFromGC(region: REGION, gc: GCONTEXT): RequestChecker
  }
}

XFixes.prototype.createRegionFromGC = function (region: REGION, gc: GCONTEXT): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', region, gc))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 8, 'createRegionFromGC')
}

declare module './xcbXFixes' {
  interface XFixes {
    createRegionFromPicture(region: REGION, picture: PICTURE): RequestChecker
  }
}

XFixes.prototype.createRegionFromPicture = function (region: REGION, picture: PICTURE): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', region, picture))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 9, 'createRegionFromPicture')
}

declare module './xcbXFixes' {
  interface XFixes {
    destroyRegion(region: REGION): RequestChecker
  }
}

XFixes.prototype.destroyRegion = function (region: REGION): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', region))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 10, 'destroyRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    setRegion(region: REGION, rectanglesLen: number, rectangles: RECTANGLE[]): RequestChecker
  }
}

XFixes.prototype.setRegion = function (region: REGION, rectanglesLen: number, rectangles: RECTANGLE[]): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', region))
  rectangles.forEach(({ x, y, width, height }) => {
    requestParts.push(pack('<hhHH', x, y, width, height))
  })

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 11, 'setRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    copyRegion(source: REGION, destination: REGION): RequestChecker
  }
}

XFixes.prototype.copyRegion = function (source: REGION, destination: REGION): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', source, destination))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 12, 'copyRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    unionRegion(source1: REGION, source2: REGION, destination: REGION): RequestChecker
  }
}

XFixes.prototype.unionRegion = function (source1: REGION, source2: REGION, destination: REGION): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIII', source1, source2, destination))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 13, 'unionRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    intersectRegion(source1: REGION, source2: REGION, destination: REGION): RequestChecker
  }
}

XFixes.prototype.intersectRegion = function (source1: REGION, source2: REGION, destination: REGION): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIII', source1, source2, destination))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 14, 'intersectRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    subtractRegion(source1: REGION, source2: REGION, destination: REGION): RequestChecker
  }
}

XFixes.prototype.subtractRegion = function (source1: REGION, source2: REGION, destination: REGION): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIII', source1, source2, destination))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 15, 'subtractRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    invertRegion(source: REGION, bounds: RECTANGLE, destination: REGION): RequestChecker
  }
}

XFixes.prototype.invertRegion = function (source: REGION, bounds: RECTANGLE, destination: REGION): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', source))
  requestParts.push(pack('<hhHH', bounds.x, bounds.y, bounds.width, bounds.height))

  requestParts.push(pack('<I', destination))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 16, 'invertRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    translateRegion(region: REGION, dx: number, dy: number): RequestChecker
  }
}

XFixes.prototype.translateRegion = function (region: REGION, dx: number, dy: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIhh', region, dx, dy))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 17, 'translateRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    regionExtents(source: REGION, destination: REGION): RequestChecker
  }
}

XFixes.prototype.regionExtents = function (source: REGION, destination: REGION): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', source, destination))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 18, 'regionExtents')
}

declare module './xcbXFixes' {
  interface XFixes {
    fetchRegion(region: REGION): FetchRegionCookie
  }
}

XFixes.prototype.fetchRegion = function (region: REGION): FetchRegionCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', region))

  return this.xConnection.sendRequest<FetchRegionReply>(
    requestParts,
    this.majorOpcode,
    unmarshallFetchRegionReply,
    19,
    'fetchRegion',
  )
}

declare module './xcbXFixes' {
  interface XFixes {
    setGCClipRegion(gc: GCONTEXT, region: REGION, xOrigin: number, yOrigin: number): RequestChecker
  }
}

XFixes.prototype.setGCClipRegion = function (
  gc: GCONTEXT,
  region: REGION,
  xOrigin: number,
  yOrigin: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIhh', gc, region, xOrigin, yOrigin))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 20, 'setGCClipRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    setWindowShapeRegion(dest: WINDOW, destKind: SK, xOffset: number, yOffset: number, region: REGION): RequestChecker
  }
}

XFixes.prototype.setWindowShapeRegion = function (
  dest: WINDOW,
  destKind: SK,
  xOffset: number,
  yOffset: number,
  region: REGION,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIB3xhhI', dest, destKind, xOffset, yOffset, region))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 21, 'setWindowShapeRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    setPictureClipRegion(picture: PICTURE, region: REGION, xOrigin: number, yOrigin: number): RequestChecker
  }
}

XFixes.prototype.setPictureClipRegion = function (
  picture: PICTURE,
  region: REGION,
  xOrigin: number,
  yOrigin: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIhh', picture, region, xOrigin, yOrigin))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 22, 'setPictureClipRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    setCursorName(cursor: CURSOR, name: Int8Array): RequestChecker
  }
}

XFixes.prototype.setCursorName = function (cursor: CURSOR, name: Int8Array): RequestChecker {
  const nbytes = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIH2x', cursor, nbytes))
  requestParts.push(pad(name.buffer))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 23, 'setCursorName')
}

declare module './xcbXFixes' {
  interface XFixes {
    getCursorName(cursor: CURSOR): GetCursorNameCookie
  }
}

XFixes.prototype.getCursorName = function (cursor: CURSOR): GetCursorNameCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', cursor))

  return this.xConnection.sendRequest<GetCursorNameReply>(
    requestParts,
    this.majorOpcode,
    unmarshallGetCursorNameReply,
    24,
    'getCursorName',
  )
}

declare module './xcbXFixes' {
  interface XFixes {
    getCursorImageAndName(): GetCursorImageAndNameCookie
  }
}

XFixes.prototype.getCursorImageAndName = function (): GetCursorImageAndNameCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.xConnection.sendRequest<GetCursorImageAndNameReply>(
    requestParts,
    this.majorOpcode,
    unmarshallGetCursorImageAndNameReply,
    25,
    'getCursorImageAndName',
  )
}

declare module './xcbXFixes' {
  interface XFixes {
    changeCursor(source: CURSOR, destination: CURSOR): RequestChecker
  }
}

XFixes.prototype.changeCursor = function (source: CURSOR, destination: CURSOR): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', source, destination))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 26, 'changeCursor')
}

declare module './xcbXFixes' {
  interface XFixes {
    changeCursorByName(src: CURSOR, name: Int8Array): RequestChecker
  }
}

XFixes.prototype.changeCursorByName = function (src: CURSOR, name: Int8Array): RequestChecker {
  const nbytes = name.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIH2x', src, nbytes))
  requestParts.push(pad(name.buffer))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 27, 'changeCursorByName')
}

declare module './xcbXFixes' {
  interface XFixes {
    expandRegion(
      source: REGION,
      destination: REGION,
      left: number,
      right: number,
      top: number,
      bottom: number,
    ): RequestChecker
  }
}

XFixes.prototype.expandRegion = function (
  source: REGION,
  destination: REGION,
  left: number,
  right: number,
  top: number,
  bottom: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIHHHH', source, destination, left, right, top, bottom))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 28, 'expandRegion')
}

declare module './xcbXFixes' {
  interface XFixes {
    hideCursor(window: WINDOW): RequestChecker
  }
}

XFixes.prototype.hideCursor = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 29, 'hideCursor')
}

declare module './xcbXFixes' {
  interface XFixes {
    showCursor(window: WINDOW): RequestChecker
  }
}

XFixes.prototype.showCursor = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 30, 'showCursor')
}

export type BARRIER = number

declare module './xcbXFixes' {
  interface XFixes {
    createPointerBarrier(
      barrier: BARRIER,
      window: WINDOW,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      directions: number,
      devices: Uint16Array,
    ): RequestChecker
  }
}

XFixes.prototype.createPointerBarrier = function (
  barrier: BARRIER,
  window: WINDOW,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  directions: number,
  devices: Uint16Array,
): RequestChecker {
  const numDevices = devices.length
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIIHHHHI2xH', barrier, window, x1, y1, x2, y2, directions, numDevices))
  requestParts.push(pad(devices.buffer))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 31, 'createPointerBarrier')
}

declare module './xcbXFixes' {
  interface XFixes {
    deletePointerBarrier(barrier: BARRIER): RequestChecker
  }
}

XFixes.prototype.deletePointerBarrier = function (barrier: BARRIER): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', barrier))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 32, 'deletePointerBarrier')
}

export const SelectionNotifyEvent = 0 as const
export const CursorNotifyEvent = 1 as const
errorInits.push((firstError) => {
  errors[firstError + 0] = [unmarshallBadRegionError, BadRegion]
})
