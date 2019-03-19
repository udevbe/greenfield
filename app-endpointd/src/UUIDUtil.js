'use strict'

// Maps for number <-> hex string conversion
const _byteToHex = []
const _hexToByte = {}
for (let i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1)
  _hexToByte[_byteToHex[i]] = i
}

// **`parse()` - Parse a UUID into it's component bytes**
/**
 *
 * @param {String}s
 */
function parse (s) {
  let i = 0
  const buf = new Uint8Array(16)
  s.toLowerCase().replace(/[0-9a-f]{2}/g, oct => {
    if (i < 16) { // Don't overflow!
      buf[i++] = _hexToByte[oct]
    }
  })
  return buf
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
/**
 * @param {Uint8Array}buf
 * @return {string}
 */
function unparse (buf) {
  let i = 0
  const bth = _byteToHex
  return bth[buf[i++]] + bth[buf[i++]] +
    bth[buf[i++]] + bth[buf[i++]] + '-' +
    bth[buf[i++]] + bth[buf[i++]] + '-' +
    bth[buf[i++]] + bth[buf[i++]] + '-' +
    bth[buf[i++]] + bth[buf[i++]] + '-' +
    bth[buf[i++]] + bth[buf[i++]] +
    bth[buf[i++]] + bth[buf[i++]] +
    bth[buf[i++]] + bth[buf[i++]]
}

module.exports = {
  parse,
  unparse
}
