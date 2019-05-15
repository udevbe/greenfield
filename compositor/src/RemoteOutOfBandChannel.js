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

export default class RemoteOutOfBandChannel {
  /**
   * @param {function(ArrayBuffer):void}onOutOfBandSend
   * @return {RemoteOutOfBandChannel}
   */
  static create (onOutOfBandSend) {
    return new RemoteOutOfBandChannel(onOutOfBandSend)
  }

  /**
   * @param {function(ArrayBuffer):void}onOutOfBandSend
   */
  constructor (onOutOfBandSend) {
    /**
     * Out of band listeners. Allows for messages & listeners not part of the ordinary wayland protocol.
     * @type {Object.<number, function(ArrayBuffer):void>}
     * @private
     */
    this._outOfBandListeners = {}
    /**
     * @type {function(ArrayBuffer): void}
     * @private
     */
    this._onOutOfBandSend = onOutOfBandSend
  }

  /**
   * @param {ArrayBuffer}incomingMessage
   */
  message (incomingMessage) {
    const dataView = new DataView(incomingMessage)
    const opcode = dataView.getUint32(0, true)

    const outOfBandHandler = this._outOfBandListeners[opcode]
    if (outOfBandHandler) {
      outOfBandHandler(incomingMessage.slice(4))
    } else {
      console.log(`[BUG?] Out of band using opcode: ${opcode} not found. Ignoring.`)
    }
  }

  /**
   * @param {number}opcode
   * @param {function(ArrayBuffer):void}listener
   */
  setListener (opcode, listener) {
    this._outOfBandListeners[opcode] = listener
  }

  /**
   * @param {number}opcode
   */
  removeListener (opcode) {
    delete this._outOfBandListeners[opcode]
  }

  /**
   * @param {number}opcode
   * @param {ArrayBuffer}payload
   */
  send (opcode, payload) {
    const sendBuffer = new ArrayBuffer(Uint32Array.BYTES_PER_ELEMENT + payload.byteLength)
    const dataView = new DataView(sendBuffer)
    dataView.setUint32(0, opcode, true)
    new Uint8Array(sendBuffer, Uint32Array.BYTES_PER_ELEMENT).set(new Uint8Array(payload))

    this._onOutOfBandSend(sendBuffer)
  }
}
