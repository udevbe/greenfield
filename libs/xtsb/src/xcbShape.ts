import { unmarshallRECTANGLE, ClipOrdering, RECTANGLE, PIXMAP, WINDOW, TIMESTAMP } from './xcb'
//
// This file generated automatically from shape.xml by ts_client.py.
// Edit at your peril.
//

import { XConnection, chars } from './connection'
import Protocol from './Protocol'
import type { Unmarshaller, EventHandler, RequestChecker } from './xjsbInternals'
import { xcbComplexList, concatArrayBuffers } from './xjsbInternals'
import { unpackFrom, pack } from './struct'

export class Shape extends Protocol {
  static MAJOR_VERSION = 1
  static MINOR_VERSION = 1
}

const errorInits: ((firstError: number) => void)[] = []

let protocolExtension: Shape | undefined = undefined

export async function getShape(xConnection: XConnection): Promise<Shape> {
  if (protocolExtension && protocolExtension.xConnection === xConnection) {
    return protocolExtension
  }
  const queryExtensionReply = await xConnection.queryExtension(chars('SHAPE'))
  if (queryExtensionReply.present === 0) {
    throw new Error('Shape extension not present.')
  }
  const { majorOpcode, firstEvent, firstError } = queryExtensionReply
  protocolExtension = new Shape(xConnection, majorOpcode, firstEvent, firstError)
  errorInits.forEach((init) => init(firstError))
  return protocolExtension
}

export enum SO {
  Set = 0,
  Union = 1,
  Intersect = 2,
  Subtract = 3,
  Invert = 4,
}

export enum SK {
  Bounding = 0,
  Clip = 1,
  Input = 2,
}

export type NotifyEvent = {
  responseType: number
  shapeKind: SK
  affectedWindow: WINDOW
  extentsX: number
  extentsY: number
  extentsWidth: number
  extentsHeight: number
  serverTime: TIMESTAMP
  shaped: number
}

export const unmarshallNotifyEvent: Unmarshaller<NotifyEvent> = (buffer, offset = 0) => {
  const [responseType, shapeKind, affectedWindow, extentsX, extentsY, extentsWidth, extentsHeight, serverTime, shaped] =
    unpackFrom('<BB2xIhhHHIB11x', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
      shapeKind,
      affectedWindow,
      extentsX,
      extentsY,
      extentsWidth,
      extentsHeight,
      serverTime,
      shaped,
    },
    offset,
  }
}
export const marshallNotifyEvent = (instance: NotifyEvent): ArrayBuffer => {
  const buffers: ArrayBuffer[] = []
  {
    const { shapeKind, affectedWindow, extentsX, extentsY, extentsWidth, extentsHeight, serverTime, shaped } = instance
    buffers.push(
      pack(
        '<xB2xIhhHHIB11x',
        shapeKind,
        affectedWindow,
        extentsX,
        extentsY,
        extentsWidth,
        extentsHeight,
        serverTime,
        shaped,
      ),
    )
  }
  new Uint8Array(buffers[0])[0] = instance.responseType
  return concatArrayBuffers(buffers, 32)
}
export interface NotifyEventHandler extends EventHandler<NotifyEvent> {}

export type QueryVersionCookie = Promise<QueryVersionReply>

export type QueryVersionReply = {
  responseType: number
  majorVersion: number
  minorVersion: number
}

export const unmarshallQueryVersionReply: Unmarshaller<QueryVersionReply> = (buffer, offset = 0) => {
  const [responseType, majorVersion, minorVersion] = unpackFrom('<Bx2x4xHH', buffer, offset)
  offset += 12

  return {
    value: {
      responseType,
      majorVersion,
      minorVersion,
    },
    offset,
  }
}

export type QueryExtentsCookie = Promise<QueryExtentsReply>

export type QueryExtentsReply = {
  responseType: number
  boundingShaped: number
  clipShaped: number
  boundingShapeExtentsX: number
  boundingShapeExtentsY: number
  boundingShapeExtentsWidth: number
  boundingShapeExtentsHeight: number
  clipShapeExtentsX: number
  clipShapeExtentsY: number
  clipShapeExtentsWidth: number
  clipShapeExtentsHeight: number
}

export const unmarshallQueryExtentsReply: Unmarshaller<QueryExtentsReply> = (buffer, offset = 0) => {
  const [
    responseType,
    boundingShaped,
    clipShaped,
    boundingShapeExtentsX,
    boundingShapeExtentsY,
    boundingShapeExtentsWidth,
    boundingShapeExtentsHeight,
    clipShapeExtentsX,
    clipShapeExtentsY,
    clipShapeExtentsWidth,
    clipShapeExtentsHeight,
  ] = unpackFrom('<Bx2x4xBB2xhhHHhhHH', buffer, offset)
  offset += 28

  return {
    value: {
      responseType,
      boundingShaped,
      clipShaped,
      boundingShapeExtentsX,
      boundingShapeExtentsY,
      boundingShapeExtentsWidth,
      boundingShapeExtentsHeight,
      clipShapeExtentsX,
      clipShapeExtentsY,
      clipShapeExtentsWidth,
      clipShapeExtentsHeight,
    },
    offset,
  }
}

export type InputSelectedCookie = Promise<InputSelectedReply>

export type InputSelectedReply = {
  responseType: number
  enabled: number
}

export const unmarshallInputSelectedReply: Unmarshaller<InputSelectedReply> = (buffer, offset = 0) => {
  const [responseType, enabled] = unpackFrom('<BB2x4x', buffer, offset)
  offset += 8

  return {
    value: {
      responseType,
      enabled,
    },
    offset,
  }
}

export type GetRectanglesCookie = Promise<GetRectanglesReply>

export type GetRectanglesReply = {
  responseType: number
  ordering: ClipOrdering
  rectanglesLen: number
  rectangles: RECTANGLE[]
}

export const unmarshallGetRectanglesReply: Unmarshaller<GetRectanglesReply> = (buffer, offset = 0) => {
  const [responseType, ordering, rectanglesLen] = unpackFrom('<BB2x4xI20x', buffer, offset)
  offset += 32
  const rectanglesWithOffset = xcbComplexList(buffer, offset, rectanglesLen, unmarshallRECTANGLE)
  offset = rectanglesWithOffset.offset
  const rectangles = rectanglesWithOffset.value

  return {
    value: {
      responseType,
      ordering,
      rectanglesLen,
      rectangles,
    },
    offset,
  }
}

export type OP = number

export type KIND = number

declare module './xcbShape' {
  interface Shape {
    queryVersion(): QueryVersionCookie
  }
}

Shape.prototype.queryVersion = function (): QueryVersionCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2x'))

  return this.xConnection.sendRequest<QueryVersionReply>(
    requestParts,
    this.majorOpcode,
    unmarshallQueryVersionReply,
    0,
    'queryVersion',
  )
}

declare module './xcbShape' {
  interface Shape {
    rectangles(
      operation: SO,
      destinationKind: SK,
      ordering: ClipOrdering,
      destinationWindow: WINDOW,
      xOffset: number,
      yOffset: number,
      rectanglesLen: number,
      rectangles: RECTANGLE[],
    ): RequestChecker
  }
}

Shape.prototype.rectangles = function (
  operation: SO,
  destinationKind: SK,
  ordering: ClipOrdering,
  destinationWindow: WINDOW,
  xOffset: number,
  yOffset: number,
  rectanglesLen: number,
  rectangles: RECTANGLE[],
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xBBBxIhh', operation, destinationKind, ordering, destinationWindow, xOffset, yOffset))
  rectangles.forEach(({ x, y, width, height }) => {
    requestParts.push(pack('<hhHH', x, y, width, height))
  })

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 1, 'rectangles')
}

declare module './xcbShape' {
  interface Shape {
    mask(
      operation: SO,
      destinationKind: SK,
      destinationWindow: WINDOW,
      xOffset: number,
      yOffset: number,
      sourceBitmap: PIXMAP,
    ): RequestChecker
  }
}

Shape.prototype.mask = function (
  operation: SO,
  destinationKind: SK,
  destinationWindow: WINDOW,
  xOffset: number,
  yOffset: number,
  sourceBitmap: PIXMAP,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack('<xx2xBB2xIhhI', operation, destinationKind, destinationWindow, xOffset, yOffset, sourceBitmap),
  )

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 2, 'mask')
}

declare module './xcbShape' {
  interface Shape {
    combine(
      operation: SO,
      destinationKind: SK,
      sourceKind: SK,
      destinationWindow: WINDOW,
      xOffset: number,
      yOffset: number,
      sourceWindow: WINDOW,
    ): RequestChecker
  }
}

Shape.prototype.combine = function (
  operation: SO,
  destinationKind: SK,
  sourceKind: SK,
  destinationWindow: WINDOW,
  xOffset: number,
  yOffset: number,
  sourceWindow: WINDOW,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(
    pack('<xx2xBBBxIhhI', operation, destinationKind, sourceKind, destinationWindow, xOffset, yOffset, sourceWindow),
  )

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 3, 'combine')
}

declare module './xcbShape' {
  interface Shape {
    offset(destinationKind: SK, destinationWindow: WINDOW, xOffset: number, yOffset: number): RequestChecker
  }
}

Shape.prototype.offset = function (
  destinationKind: SK,
  destinationWindow: WINDOW,
  xOffset: number,
  yOffset: number,
): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xB3xIhh', destinationKind, destinationWindow, xOffset, yOffset))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 4, 'offset')
}

declare module './xcbShape' {
  interface Shape {
    queryExtents(destinationWindow: WINDOW): QueryExtentsCookie
  }
}

Shape.prototype.queryExtents = function (destinationWindow: WINDOW): QueryExtentsCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', destinationWindow))

  return this.xConnection.sendRequest<QueryExtentsReply>(
    requestParts,
    this.majorOpcode,
    unmarshallQueryExtentsReply,
    5,
    'queryExtents',
  )
}

declare module './xcbShape' {
  interface Shape {
    selectInput(destinationWindow: WINDOW, enable: number): RequestChecker
  }
}

Shape.prototype.selectInput = function (destinationWindow: WINDOW, enable: number): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIB3x', destinationWindow, enable))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 6, 'selectInput')
}

declare module './xcbShape' {
  interface Shape {
    inputSelected(destinationWindow: WINDOW): InputSelectedCookie
  }
}

Shape.prototype.inputSelected = function (destinationWindow: WINDOW): InputSelectedCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', destinationWindow))

  return this.xConnection.sendRequest<InputSelectedReply>(
    requestParts,
    this.majorOpcode,
    unmarshallInputSelectedReply,
    7,
    'inputSelected',
  )
}

declare module './xcbShape' {
  interface Shape {
    getRectangles(window: WINDOW, sourceKind: SK): GetRectanglesCookie
  }
}

Shape.prototype.getRectangles = function (window: WINDOW, sourceKind: SK): GetRectanglesCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIB3x', window, sourceKind))

  return this.xConnection.sendRequest<GetRectanglesReply>(
    requestParts,
    this.majorOpcode,
    unmarshallGetRectanglesReply,
    8,
    'getRectangles',
  )
}

export const NotifyEvent = 0 as const
