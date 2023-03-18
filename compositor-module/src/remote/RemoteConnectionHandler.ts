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

import { FD, SendMessage } from 'westfield-runtime-common'
import { Client, WlBufferResource } from 'westfield-runtime-server'
import RemoteOutOfBandChannel, {
  RemoteOutOfBandListenOpcode,
  RemoteOutOfBandSendOpcode,
} from './RemoteOutOfBandChannel'
import { StreamingBuffer } from './StreamingBuffer'
import Session from '../Session'
import XWaylandShell from './xwayland/XWaylandShell'
import { XWindowManager } from './xwayland/XWindowManager'
import { XWindowManagerConnection } from './xwayland/XWindowManagerConnection'
import { Configuration, EncoderApi, ProxyFD } from '../api'
import { ClientEncodersFeedback, createClientEncodersFeedback } from './EncoderFeedback'
import { deliverContentToBufferStream } from './BufferStream'
import { createRemoteInputOutput } from './RemoteInputOutput'
import type { Channel } from './Channel'
import { deliverContentToAudioStream } from './AudioStream'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' as const

export type RemoteClientContext = {
  clientEncoderFeedback: ClientEncodersFeedback
  encoderApi: EncoderApi
}

function base32Encode(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)

  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < view.byteLength; i++) {
    value = (value << 8) | view.getUint8(i)
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  return output
}

export function randomString(): string {
  const randomBytes = new Uint8Array(16)
  window.crypto.getRandomValues(randomBytes)
  return `ra${base32Encode(randomBytes).toLowerCase()}`
}

export function isProxyFD(fd: any): fd is ProxyFD {
  return typeof fd?.handle === 'number' && typeof fd?.host === 'string' && typeof fd?.type === 'string'
}

export class RemoteConnectionHandler {
  private readonly textEncoder: TextEncoder = new TextEncoder()
  private readonly textDecoder: TextDecoder = new TextDecoder()

  private constructor(private readonly session: Session) {}

  static create(session: Session): RemoteConnectionHandler {
    return new RemoteConnectionHandler(session)
  }

  onProtocolChannel(protocolChannel: Channel, compositorProxyURL: URL, client: Client): void {
    this.session.logger.info('[ProtocolChannel] - created.')
    let wasOpen = protocolChannel.isOpen
    protocolChannel.onClose = () => {
      if (!wasOpen) {
        throw new Error(`Failed to connect to application.`)
      }
    }
    const handleOpenProtocolChannel = () => {
      wasOpen = true
      this.session.logger.info('[ProtocolChannel] - open.')
      client.onClose().then(() => {
        this.session.logger.info('[client] - closed.')
        protocolChannel.close()
      })
      client.addResourceCreatedListener((resource) => {
        if (resource.id >= 0xff000000 && client.recycledIds.length === 0) {
          this.session.logger.warn('[client] - Ran out of reserved browser resource ids.')
          client.close()
        }
      })

      protocolChannel.onClose = () => {
        this.session.logger.info('[ProtocolChannel] - closed.')
        client.close()
      }
      protocolChannel.onError = (event) => {
        this.session.logger.warn(`[ProtocolChannel] - error`, event)
      }

      client.connection.onFlush = (wireMessages: SendMessage[]) => {
        this.flushWireMessages(client, protocolChannel, wireMessages)
      }

      const oobChannel = RemoteOutOfBandChannel.create(this.session, (sendBuffer) => {
        if (protocolChannel.isOpen) {
          try {
            protocolChannel.send(new Uint8Array(sendBuffer))
          } catch (e: any) {
            this.session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
            this.session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
            this.session.logger.error('error object stack: ')
            this.session.logger.error(e.stack)
            client.close()
          }
        }
      })
      this.setupClientOutOfBandHandlers(client, oobChannel)

      protocolChannel.onMessage = (event) => this.handleMessageEvent(client, event.buffer, oobChannel)

      client.onClose().then(() => {
        this.session.userShell.events.clientDestroyed?.({
          id: client.id,
        })
        client.userData.clientEncodersFeedback?.destroy()
      })
      this.session.userShell.events.clientCreated?.({
        id: client.id,
      })

      const protocol = compositorProxyURL.protocol === 'wss:' ? 'https:' : 'http:'
      const pathname = compositorProxyURL.pathname === '/' ? '' : compositorProxyURL.pathname
      const basePath = `${protocol}//${compositorProxyURL.host}${pathname}`
      const encoderApi = new EncoderApi(
        new Configuration({
          basePath,
          headers: {
            ['X-Compositor-Session-Id']: this.session.compositorSessionId,
          },
        }),
      )
      client.userData = {
        encoderApi,
        clientEncodersFeedback: createClientEncodersFeedback(client.id, encoderApi),
        inputOutput: createRemoteInputOutput(basePath, this.session.compositorSessionId),
      }
    }

    if (wasOpen) {
      handleOpenProtocolChannel()
    } else {
      protocolChannel.onOpen = handleOpenProtocolChannel
    }
  }

  setupFrameDataChannel(client: Client, frameDataChannel: Channel) {
    frameDataChannel.onMessage = (message) => {
      if (client.connection.closed) {
        return
      }
      deliverContentToBufferStream(client, message.buffer)
    }
  }

  setupAudioChannel(client: Client, audioChannel: Channel) {
    audioChannel.onMessage = (message) => {
      if (client.connection.closed) {
        return
      }
      deliverContentToAudioStream(client, message.buffer)
    }
  }

  async setupXWM(client: Client, xwmDataChannel: Channel): Promise<XWindowManager> {
    const xConnection = await XWindowManagerConnection.create(this.session, xwmDataChannel)
    client.onClose().then(() => xConnection.destroy())
    return XWindowManager.create(this.session, xConnection, client, XWaylandShell.create(this.session))
  }

  private setupClientOutOfBandHandlers(client: Client, outOfBandChannel: RemoteOutOfBandChannel) {
    // send out-of-band resource destroy. opcode: 1
    client.addResourceDestroyListener((resource) => {
      outOfBandChannel.send(RemoteOutOfBandSendOpcode.ResourceDestroyed, new Uint32Array([resource.id]).buffer)
    })

    // listen for buffer creation. opcode: 2
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.BufferCreation, (message) => {
      if (client.connection.closed) {
        return
      }

      const payload = new Uint32Array(message.buffer, message.byteOffset)
      const resourceId = payload[0]
      const creationSerial = payload[1]
      const wlBufferResource = new WlBufferResource(client, resourceId, 1)
      wlBufferResource.implementation = StreamingBuffer.create(wlBufferResource, creationSerial)
    })

    // listen for recycled resource ids
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.RecycledResourceIds, (outOfBandMessage) => {
      if (client.connection.closed) {
        return
      }

      const ids = new Uint32Array(outOfBandMessage.buffer, outOfBandMessage.byteOffset)
      client.recycledIds = Array.from(ids)
    })
  }

  private handleMessageEvent(client: Client, messageData: ArrayBuffer, wsOutOfBandChannel: RemoteOutOfBandChannel) {
    if (client.connection.closed) {
      return
    }

    try {
      const dataView = new DataView(messageData)
      const outOfBand = dataView.getUint32(0, true)
      if (outOfBand) {
        wsOutOfBandChannel.message(messageData)
      } else {
        let offset = 0
        const receiveBuffer = new Uint32Array(messageData, Uint32Array.BYTES_PER_ELEMENT)
        const fdsInCount = receiveBuffer[offset++]
        const fds = new Array<FD>(fdsInCount)
        for (let i = 0; i < fdsInCount; i++) {
          const { read, fd } = this.deserializeFD(receiveBuffer.subarray(offset))
          offset += read
          fds[i] = fd
        }
        const buffer = receiveBuffer.subarray(offset)
        client.connection.message({ buffer, fds }).catch((e: Error) => {
          // @ts-ignore
          this.session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
          this.session.logger.error('error object stack: ')
          // @ts-ignore
          this.session.logger.error(e.stack)
        })
      }
    } catch (e: any) {
      this.session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
      this.session.logger.error('error object stack: ')
      this.session.logger.error(e.stack)
    }
  }

  private flushWireMessages(client: Client, protocolChannel: Channel, wireMessages: SendMessage[]) {
    if (client.connection.closed) {
      return
    }

    let messageSize = 2 // +2 for indicator if it's an out-of-band message & event serial
    const serializedWireMessages = wireMessages.map((wireMessage) => {
      let size = 1 // +1 for fd length
      const serializedFds: Uint8Array[] = wireMessage.fds.map((fd: FD) => {
        if (isProxyFD(fd)) {
          const serializedFD = this.textEncoder.encode(JSON.stringify(fd))
          size += 1 + ((serializedFD.byteLength + 3) & ~3) / 4 // +1 for encoded fd length
          return serializedFD
        } else {
          // TODO InputOutputFD Communication between remote client and web client
          throw new Error(`TODO. FD Communication between remote client and web client not yet implemented.`)
        }
      })

      messageSize += size + wireMessage.buffer.byteLength / 4

      return {
        buffer: wireMessage.buffer,
        serializedFds,
      }
    })

    const sendBuffer = new Uint32Array(messageSize)
    let offset = 0
    sendBuffer[offset++] = 0 // no out-of-band opcode
    sendBuffer[offset++] = client.display.eventSerial // last event serial

    serializedWireMessages.forEach((serializedWireMessage) => {
      sendBuffer[offset++] = serializedWireMessage.serializedFds.length
      serializedWireMessage.serializedFds.forEach((serializedFd) => {
        sendBuffer[offset++] = serializedFd.byteLength
        new Uint8Array(sendBuffer.buffer, sendBuffer.byteOffset + offset * Uint32Array.BYTES_PER_ELEMENT).set(
          serializedFd,
        )
        // TODO we don't need to pad here as it's already padded?
        offset += ((serializedFd.byteLength + 3) & ~3) / 4
      })

      const message = new Uint32Array(serializedWireMessage.buffer)
      sendBuffer.set(message, offset)
      offset += message.length
    })

    if (protocolChannel.isOpen) {
      try {
        protocolChannel.send(sendBuffer)
      } catch (e: any) {
        this.session.logger.error(e)
        client.close()
      }
    }
  }

  private deserializeFD(sourceBuf: Uint32Array): { read: number; fd: FD } {
    const fdByteLength = sourceBuf[0]
    const fdBytes = new Uint8Array(sourceBuf.buffer, sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT, fdByteLength)

    const fdJSON = this.textDecoder.decode(fdBytes)
    const fd: FD = JSON.parse(fdJSON)

    return {
      read: 1 + ((fdByteLength + 3) & ~3) / 4,
      fd,
    }
  }
}
