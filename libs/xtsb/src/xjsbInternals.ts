import { TypedArray } from './connection'

export interface RequestChecker extends Promise<void> {
  check(): Promise<void>
}

export type UnmarshallResult<T> = {
  value: T
  offset: number
}

export interface Unmarshaller<T> {
  (buffer: ArrayBuffer, offset: number): UnmarshallResult<T>
}

export interface EventHandler<T> {
  (event: T): void | Promise<void>
}
export const errors: { [key: number]: [Unmarshaller<any>, new (errorBody: any) => Error] } = {}

export function xcbComplexList<T>(
  buffer: ArrayBuffer,
  offset: number,
  listLength: number,
  unmarshall: Unmarshaller<T>,
): UnmarshallResult<T[]> {
  const value: T[] = []
  for (let i = 0; i < listLength; i++) {
    const valueWithOffset = unmarshall(buffer, offset)
    offset = valueWithOffset.offset
    value.push(valueWithOffset.value)
  }
  return { value, offset }
}

export function xcbSimpleList<T extends TypedArray>(
  buffer: ArrayBuffer,
  offset: number,
  listLength: number,
  typedArrayConstructor: new (buffer: ArrayBuffer, offset: number, listLength: number) => T,
  primitiveLength: number,
): UnmarshallResult<T> {
  const value = new typedArrayConstructor(buffer, offset, listLength)
  offset += listLength * primitiveLength
  return { value, offset }
}

export function typePad(alignSize: number, offset: number): number {
  return -offset & (alignSize > 4 ? 3 : alignSize - 1)
}

export function concatArrayBuffers(buffers: ArrayBuffer[], totalByteLength: number): ArrayBuffer {
  if (buffers.length === 1 && buffers[0].byteLength === totalByteLength) {
    return buffers[0]
  }

  const concat = new Uint8Array(totalByteLength)
  let offset = 0
  buffers.forEach((value) => {
    concat.set(new Uint8Array(value), offset)
    offset += value.byteLength
  })
  return concat.buffer
}

export function marshallXcbComplexList<T>(
  buffer: ArrayBuffer,
  offset: number,
  listLength: number,
  unmarshall: Unmarshaller<T>,
): UnmarshallResult<T[]> {
  const value: T[] = []
  for (let i = 0; i < listLength; i++) {
    const valueWithOffset = unmarshall(buffer, offset)
    offset = valueWithOffset.offset
    value.push(valueWithOffset.value)
  }
  return { value, offset }
}

export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
