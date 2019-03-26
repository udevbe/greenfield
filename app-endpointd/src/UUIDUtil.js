// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

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
