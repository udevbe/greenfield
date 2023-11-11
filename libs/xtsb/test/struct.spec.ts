import { TextDecoder, TextEncoder } from 'util'
import { calcsize, pack, unpack } from '../src/struct'

describe('struct lib', () => {
  const firstValue = 1
  const secondValue = 2
  const thirdValue = 3
  const fourthValue = -4
  const fifthValue = 5.2
  const sixthValue = -6.3

  it('can unpack uint8', (done) => {
    // Given
    const uint8Array = new Uint8Array([firstValue, secondValue, thirdValue])

    // When
    const unpackResult = unpack('3B', uint8Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)

    done()
  })
  it('can unpack int8', (done) => {
    // Given
    const int8Array = new Int8Array([firstValue, secondValue, thirdValue, fourthValue])

    // When
    const unpackResult = unpack('4b', int8Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)
    expect(unpackResult[3]).toBe(fourthValue)

    done()
  })
  it('can unpack uint16 LE', (done) => {
    // Given
    const uint16Array = new Uint16Array([firstValue, secondValue, thirdValue])

    // When
    const unpackResult = unpack('<3H', uint16Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)

    done()
  })
  it('can unpack int16 LE', (done) => {
    // Given
    const int16Array = new Int16Array([firstValue, secondValue, thirdValue, fourthValue])

    // When
    const unpackResult = unpack('<4h', int16Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)
    expect(unpackResult[3]).toBe(fourthValue)

    done()
  })
  it('can unpack uint32 LE', (done) => {
    // Given
    const uint32Array = new Uint32Array([firstValue, secondValue, thirdValue])

    // When
    const unpackResult = unpack('<3I', uint32Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)

    done()
  })
  it('can unpack int32 LE', (done) => {
    // Given
    const int32Array = new Int32Array([firstValue, secondValue, thirdValue, fourthValue])

    // When
    const unpackResult = unpack('<4i', int32Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)
    expect(unpackResult[3]).toBe(fourthValue)

    done()
  })
  it('can unpack float LE', (done) => {
    // Given
    const float32Array = new Float32Array([firstValue, secondValue, thirdValue, fourthValue, fifthValue, sixthValue])

    // When
    const unpackResult = unpack('<6f', float32Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)
    expect(unpackResult[3]).toBe(fourthValue)
    expect(unpackResult[4]).toBeCloseTo(fifthValue, 5)
    expect(unpackResult[5]).toBeCloseTo(sixthValue, 5)

    done()
  })
  it('can unpack double LE', (done) => {
    // Given
    const float64Array = new Float64Array([firstValue, secondValue, thirdValue, fourthValue, fifthValue, sixthValue])

    // When
    const unpackResult = unpack('<6d', float64Array.buffer)

    // Then
    expect(unpackResult[0]).toBe(firstValue)
    expect(unpackResult[1]).toBe(secondValue)
    expect(unpackResult[2]).toBe(thirdValue)
    expect(unpackResult[3]).toBe(fourthValue)
    expect(unpackResult[4]).toBeCloseTo(fifthValue, 5)
    expect(unpackResult[5]).toBeCloseTo(sixthValue, 5)

    done()
  })
  it('can unpack string', (done) => {
    // Given
    const uint8Array = new TextEncoder().encode('abc')

    // When
    const unpackResult = unpack('3s', uint8Array.buffer)

    // Then
    expect(unpackResult[0]).toBe('abc')

    done()
  })

  it('can pack uint8', (done) => {
    // Given
    const data = [firstValue, secondValue, thirdValue]

    // When
    const arrayBuffer = pack('<BBB', ...data)

    // Then
    const buffer = new Uint8Array(arrayBuffer)

    expect(buffer[0]).toBe(firstValue)
    expect(buffer[1]).toBe(secondValue)
    expect(buffer[2]).toBe(thirdValue)

    done()
  })
  it('can pack int8', (done) => {
    // Given
    const data = [firstValue, secondValue, thirdValue, fourthValue]

    // When
    const arrayBuffer = pack('<bbbb', ...data)

    // Then
    const buffer = new Int8Array(arrayBuffer)

    expect(buffer[0]).toBe(firstValue)
    expect(buffer[1]).toBe(secondValue)
    expect(buffer[2]).toBe(thirdValue)
    expect(buffer[3]).toBe(fourthValue)

    done()
  })
  it('can pack uint16', (done) => {
    // Given
    const data = [firstValue, secondValue, thirdValue]

    // When
    const arrayBuffer = pack('<3H', ...data)

    // Then
    const buffer = new Uint16Array(arrayBuffer)

    expect(buffer[0]).toBe(firstValue)
    expect(buffer[1]).toBe(secondValue)
    expect(buffer[2]).toBe(thirdValue)

    done()
  })
  it('can pack int16', (done) => {
    // Given
    const data = [firstValue, secondValue, thirdValue, fourthValue]

    // When
    const arrayBuffer = pack('<hhhh', ...data)

    // Then
    const buffer = new Int16Array(arrayBuffer)

    expect(buffer[0]).toBe(firstValue)
    expect(buffer[1]).toBe(secondValue)
    expect(buffer[2]).toBe(thirdValue)
    expect(buffer[3]).toBe(fourthValue)

    done()
  })
  it('can pack uint32', (done) => {
    // Given
    const data = [firstValue, secondValue, thirdValue]

    // When
    const arrayBuffer = pack('<3I', ...data)

    // Then
    const buffer = new Uint32Array(arrayBuffer)

    expect(buffer[0]).toBe(firstValue)
    expect(buffer[1]).toBe(secondValue)
    expect(buffer[2]).toBe(thirdValue)

    done()
  })
  it('can pack float', (done) => {
    // Given
    const data = [firstValue, secondValue, thirdValue, fourthValue, fifthValue, sixthValue]

    // When
    const arrayBuffer = pack('<6f', ...data)

    // Then
    const buffer = new Float32Array(arrayBuffer)

    expect(buffer[0]).toBe(firstValue)
    expect(buffer[1]).toBe(secondValue)
    expect(buffer[2]).toBe(thirdValue)
    expect(buffer[3]).toBe(fourthValue)
    expect(buffer[4]).toBeCloseTo(fifthValue, 5)
    expect(buffer[5]).toBeCloseTo(sixthValue, 5)

    done()
  })
  it('can pack double', (done) => {
    // Given
    const data = [firstValue, secondValue, thirdValue, fourthValue, fifthValue, sixthValue]

    // When
    const arrayBuffer = pack('<dddddd', ...data)

    // Then
    const buffer = new Float64Array(arrayBuffer)

    expect(buffer[0]).toBe(firstValue)
    expect(buffer[1]).toBe(secondValue)
    expect(buffer[2]).toBe(thirdValue)
    expect(buffer[3]).toBe(fourthValue)
    expect(buffer[4]).toBeCloseTo(fifthValue, 5)
    expect(buffer[5]).toBeCloseTo(sixthValue, 5)

    done()
  })
  it('can pack string', (done) => {
    // Given
    const data = 'abc'

    // When
    const arrayBuffer = pack('3s', data)

    // Then
    const buffer = new Uint8Array(arrayBuffer)
    const text = new TextDecoder().decode(buffer)

    expect(text).toBe(data)

    done()
  })
})
