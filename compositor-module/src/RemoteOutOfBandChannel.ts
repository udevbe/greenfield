// Copyright 2020 Erik De Rijcke
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

import Session from './Session'

export const enum RemoteOutOfBandListenOpcode {
  BufferCreation = 2,
  BufferContents = 3,
  FileContents = 4,
  WebSocketCreationRequest = 5,
  RecycledResourceIds = 6,
  XWMConnectionRequest = 7,
}
export const enum RemoteOutOfBandSendOpcode {
  ResourceDestroyed = 1,
  FileContents = 4,
  ForceKeyFrame = 5,
  ForceKeyFrameNow = 6,
}

export default class RemoteOutOfBandChannel {
  private readonly outOfBandListeners: { [key: number]: (outOfBandMsg: Uint8Array) => void } = {}

  static create(session: Session, onOutOfBandSend: (outData: ArrayBuffer) => void): RemoteOutOfBandChannel {
    return new RemoteOutOfBandChannel(session, onOutOfBandSend)
  }

  private constructor(
    private readonly session: Session,
    private readonly onOutOfBandSend: (outData: ArrayBuffer) => void,
  ) {}

  message(incomingMessage: ArrayBuffer): void {
    const dataView = new DataView(incomingMessage)
    const opcode = dataView.getUint32(0, true)

    const outOfBandHandler = this.outOfBandListeners[opcode]
    if (outOfBandHandler) {
      outOfBandHandler(new Uint8Array(incomingMessage, 4))
    } else {
      this.session.logger.warn(`[BUG?] Out of band using opcode: ${opcode} not found. Ignoring.`)
    }
  }

  setListener(opcode: number, listener: (outOfBandMsg: Uint8Array) => void): void {
    this.outOfBandListeners[opcode] = listener
  }

  removeListener(opcode: number): void {
    delete this.outOfBandListeners[opcode]
  }

  send(opcode: number, payload: ArrayBuffer): void {
    const sendBuffer = new ArrayBuffer(Uint32Array.BYTES_PER_ELEMENT + payload.byteLength)
    const dataView = new DataView(sendBuffer)
    dataView.setUint32(0, opcode, true)
    new Uint8Array(sendBuffer, Uint32Array.BYTES_PER_ELEMENT).set(new Uint8Array(payload))

    this.onOutOfBandSend(sendBuffer)
  }
}
