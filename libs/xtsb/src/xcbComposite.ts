import { WINDOW, PIXMAP } from './xcb'
import { REGION } from './xcbXFixes'
//
// This file generated automatically from composite.xml by ts_client.py.
// Edit at your peril.
//

import { XConnection, chars } from './connection'
import Protocol from './Protocol'
import type { Unmarshaller, RequestChecker } from './xjsbInternals'

import { unpackFrom, pack } from './struct'

export class Composite extends Protocol {
  static MAJOR_VERSION = 0
  static MINOR_VERSION = 4
}

const errorInits: ((firstError: number) => void)[] = []

let protocolExtension: Composite | undefined = undefined

export async function getComposite(xConnection: XConnection): Promise<Composite> {
  if (protocolExtension && protocolExtension.xConnection === xConnection) {
    return protocolExtension
  }
  const queryExtensionReply = await xConnection.queryExtension(chars('Composite'))
  if (queryExtensionReply.present === 0) {
    throw new Error('Composite extension not present.')
  }
  const { majorOpcode, firstEvent, firstError } = queryExtensionReply
  protocolExtension = new Composite(xConnection, majorOpcode, firstEvent, firstError)
  errorInits.forEach((init) => init(firstError))
  return protocolExtension
}

export enum Redirect {
  Automatic = 0,
  Manual = 1,
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

export type GetOverlayWindowCookie = Promise<GetOverlayWindowReply>

export type GetOverlayWindowReply = {
  responseType: number
  overlayWin: WINDOW
}

export const unmarshallGetOverlayWindowReply: Unmarshaller<GetOverlayWindowReply> = (buffer, offset = 0) => {
  const [responseType, overlayWin] = unpackFrom('<Bx2x4xI20x', buffer, offset)
  offset += 32

  return {
    value: {
      responseType,
      overlayWin,
    },
    offset,
  }
}

declare module './xcbComposite' {
  interface Composite {
    queryVersion(clientMajorVersion: number, clientMinorVersion: number): QueryVersionCookie
  }
}

Composite.prototype.queryVersion = function (
  clientMajorVersion: number,
  clientMinorVersion: number,
): QueryVersionCookie {
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

declare module './xcbComposite' {
  interface Composite {
    redirectWindow(window: WINDOW, update: Redirect): RequestChecker
  }
}

Composite.prototype.redirectWindow = function (window: WINDOW, update: Redirect): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIB3x', window, update))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 1, 'redirectWindow')
}

declare module './xcbComposite' {
  interface Composite {
    redirectSubwindows(window: WINDOW, update: Redirect): RequestChecker
  }
}

Composite.prototype.redirectSubwindows = function (window: WINDOW, update: Redirect): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIB3x', window, update))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 2, 'redirectSubwindows')
}

declare module './xcbComposite' {
  interface Composite {
    unredirectWindow(window: WINDOW, update: Redirect): RequestChecker
  }
}

Composite.prototype.unredirectWindow = function (window: WINDOW, update: Redirect): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIB3x', window, update))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 3, 'unredirectWindow')
}

declare module './xcbComposite' {
  interface Composite {
    unredirectSubwindows(window: WINDOW, update: Redirect): RequestChecker
  }
}

Composite.prototype.unredirectSubwindows = function (window: WINDOW, update: Redirect): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xIB3x', window, update))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 4, 'unredirectSubwindows')
}

declare module './xcbComposite' {
  interface Composite {
    createRegionFromBorderClip(region: REGION, window: WINDOW): RequestChecker
  }
}

Composite.prototype.createRegionFromBorderClip = function (region: REGION, window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', region, window))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 5, 'createRegionFromBorderClip')
}

declare module './xcbComposite' {
  interface Composite {
    nameWindowPixmap(window: WINDOW, pixmap: PIXMAP): RequestChecker
  }
}

Composite.prototype.nameWindowPixmap = function (window: WINDOW, pixmap: PIXMAP): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xII', window, pixmap))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 6, 'nameWindowPixmap')
}

declare module './xcbComposite' {
  interface Composite {
    getOverlayWindow(window: WINDOW): GetOverlayWindowCookie
  }
}

Composite.prototype.getOverlayWindow = function (window: WINDOW): GetOverlayWindowCookie {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.xConnection.sendRequest<GetOverlayWindowReply>(
    requestParts,
    this.majorOpcode,
    unmarshallGetOverlayWindowReply,
    7,
    'getOverlayWindow',
  )
}

declare module './xcbComposite' {
  interface Composite {
    releaseOverlayWindow(window: WINDOW): RequestChecker
  }
}

Composite.prototype.releaseOverlayWindow = function (window: WINDOW): RequestChecker {
  const requestParts: ArrayBuffer[] = []

  requestParts.push(pack('<xx2xI', window))

  return this.xConnection.sendVoidRequest(requestParts, this.majorOpcode, 8, 'releaseOverlayWindow')
}
