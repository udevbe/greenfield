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

import { MessageEventLike, ReadyState, RetransmittingWebSocket, WebSocketLike } from 'retransmitting-websocket'
import { SendMessage, WebFD } from 'westfield-runtime-common'
import { Client, WlBufferResource, WlSurfaceResource } from 'westfield-runtime-server'
import RemoteOutOfBandChannel, {
  RemoteOutOfBandListenOpcode,
  RemoteOutOfBandSendOpcode,
} from './RemoteOutOfBandChannel'
import StreamingBuffer from './remotestreaming/StreamingBuffer'
import Session from './Session'
import XWaylandShell from './xwayland/XWaylandShell'
import { XWindowManager } from './xwayland/XWindowManager'
import { XWindowManagerConnection } from './xwayland/XWindowManagerConnection'
import { createRemoteWebFS } from './WebFS'
import { Configuration, EncoderApi } from './api'
import { ProxyFrameCallbackFactory } from './FrameCallbackFactory'
import Surface from './Surface'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' as const

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
  return base32Encode(randomBytes).toLowerCase()
}

type XWaylandConnectionState = {
  state: 'pending' | 'open'
  xConnection?: XWindowManagerConnection
  wlClient?: Client
  xwm?: XWindowManager
}

const xWaylandProxyStates: { [key: string]: XWaylandConnectionState } = {}

export function createRetransmittingWebSocket(url: URL, connectionId: string): WebSocketLike {
  const connectionURL = new URL(url.href)
  connectionURL.searchParams.set('connectionId', connectionId)
  return new RetransmittingWebSocket({
    webSocketFactory: () => {
      const webSocket = new WebSocket(connectionURL.href)
      webSocket.binaryType = 'arraybuffer'
      return webSocket
    },
  })
}

class RemoteSocket {
  private readonly textEncoder: TextEncoder = new TextEncoder()
  private readonly textDecoder: TextDecoder = new TextDecoder()

  private constructor(private readonly session: Session) {}

  static create(session: Session): RemoteSocket {
    return new RemoteSocket(session)
  }

  ensureXWayland(compositorProxyURL: URL): void {
    const xWaylandBaseURLhref = compositorProxyURL.href

    if (xWaylandProxyStates[xWaylandBaseURLhref] === undefined) {
      xWaylandProxyStates[xWaylandBaseURLhref] = { state: 'pending' }
    }
  }

  onWebSocket(webSocket: WebSocketLike, compositorProxyURL: URL, clientId: string): Promise<Client> {
    return new Promise((resolve, reject) => {
      this.session.logger.info('[WebSocket] - created.')
      let wasOpen = false
      webSocket.addEventListener('close', (event) => {
        if (!wasOpen) {
          reject(new Error(`Failed to connect to application. ${event.reason} ${event.code}`))
        }
      })
      webSocket.addEventListener('open', () => {
        wasOpen = true
        this.session.logger.info('[WebSocket] - open.')

        const client = this.session.display.createClient(clientId)
        client.onClose().then(() => {
          this.session.logger.info('[client] - closed.')
          if (webSocket.readyState === 1 /* OPEN */ || webSocket.readyState === 0 /* CONNECTING */) {
            webSocket.close()
          }
        })
        client.addResourceCreatedListener((resource) => {
          if (resource.id >= 0xff000000 && client.recycledIds.length === 0) {
            this.session.logger.warn('[client] - Ran out of reserved browser resource ids.')
            client.close()
          }
        })

        webSocket.addEventListener('close', () => {
          this.session.logger.info('[WebSocket] - closed.')
          client.close()
        })
        webSocket.addEventListener('error', (event) => this.session.logger.warn(`[WebSocket] - error`, event))

        client.connection.onFlush = (wireMessages: SendMessage[]) =>
          this.flushWireMessages(client, webSocket, wireMessages)

        const oobChannel = RemoteOutOfBandChannel.create(this.session, (sendBuffer) => {
          if (webSocket.readyState === 1) {
            try {
              webSocket.send(sendBuffer)
            } catch (e: any) {
              this.session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
              this.session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
              this.session.logger.error('error object stack: ')
              this.session.logger.error(e.stack)
              client.close()
            }
          }
        })
        this.setupClientOutOfBandHandlers(webSocket, client, oobChannel, compositorProxyURL)

        webSocket.addEventListener('message', (event) => this.handleMessageEvent(client, event, oobChannel))

        client.onClose().then(() => {
          this.session.userShell.events.clientDestroyed?.({
            id: client.id,
          })
        })
        this.session.userShell.events.clientCreated?.({
          id: client.id,
        })

        const protocol = compositorProxyURL.protocol === 'wss:' ? 'https' : 'http'
        const port = compositorProxyURL.port === '' ? '' : `:${compositorProxyURL.port}`
        const basePath = `${protocol}://${compositorProxyURL.hostname}${port}`
        client.userData = {
          encoderApi: new EncoderApi(
            new Configuration({
              basePath,
              headers: {
                ['X-Compositor-Session-Id']: this.session.compositorSessionId,
              },
            }),
          ),
          webfs: createRemoteWebFS(basePath, this.session.compositorSessionId),
          frameCallbackFactory: new ProxyFrameCallbackFactory(),
        }

        resolve(client)
      })
    })
  }

  private setupClientOutOfBandHandlers(
    webSocket: WebSocketLike,
    client: Client,
    outOfBandChannel: RemoteOutOfBandChannel,
    appEndpointURL: URL,
  ) {
    // send out-of-band resource destroy. opcode: 1
    client.addResourceDestroyListener((resource) => {
      outOfBandChannel.send(RemoteOutOfBandSendOpcode.ResourceDestroyed, new Uint32Array([resource.id]).buffer)
    })

    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.BufferSentStarted, (message) => {
      const payload = new Uint32Array(message.buffer, message.byteOffset)
      const surfaceId = payload[0]
      const syncSerial = payload[1]
      const wlSurface = client.connection.wlObjects[surfaceId] as WlSurfaceResource
      const surface = wlSurface.implementation as Surface
      surface.encoderFeedback.bufferSentStartTime(syncSerial, performance.now())
    })

    // listen for buffer creation. opcode: 2
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.BufferCreation, (message) => {
      if (client.connection.closed) {
        return
      }

      const wlBufferResource = new WlBufferResource(client, new Uint32Array(message.buffer, message.byteOffset)[0], 1)
      wlBufferResource.implementation = StreamingBuffer.create(wlBufferResource)
    })

    // listen for buffer contents arriving. opcode: 3
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.BufferContents, (outOfBandMessage) => {
      if (client.connection.closed) {
        return
      }

      const bufferContentsDataView = new DataView(outOfBandMessage.buffer, outOfBandMessage.byteOffset)
      const bufferId = bufferContentsDataView.getUint32(0, true)
      const wlBufferResource = client.connection.wlObjects[bufferId] as WlBufferResource

      // Buffer might be destroyed while waiting for it's content to arrive.
      if (wlBufferResource) {
        const streamingBuffer = wlBufferResource.implementation as StreamingBuffer

        const bufferContents = new Uint8Array(
          outOfBandMessage.buffer,
          outOfBandMessage.byteOffset + Uint32Array.BYTES_PER_ELEMENT,
        )
        streamingBuffer.bufferStream.onBufferContents(bufferContents)
      }
    })

    // listen for web socket creation request. opcode: 5
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.WebSocketCreationRequest, () => {
      if (client.connection.closed) {
        return
      }
      const clientId = randomString()
      this.onWebSocket(createRetransmittingWebSocket(appEndpointURL, clientId), appEndpointURL, clientId)
    })

    // listen for recycled resource ids
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.RecycledResourceIds, (outOfBandMessage) => {
      if (client.connection.closed) {
        return
      }

      const ids = new Uint32Array(outOfBandMessage.buffer, outOfBandMessage.byteOffset)
      client.recycledIds = Array.from(ids)
    })

    // listen for XWayland XWM connection request
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.XWMConnectionRequest, async (outOfBandMessage) => {
      const wmFD = new Uint32Array(outOfBandMessage.buffer, outOfBandMessage.byteOffset)[0]

      const xWaylandBaseURL = new URL(appEndpointURL.href)
      xWaylandBaseURL.searchParams.delete('connectionId')
      const xWaylandBaseURLhref = xWaylandBaseURL.href

      const xWaylandConnection = xWaylandProxyStates[xWaylandBaseURLhref]
      if (xWaylandConnection === undefined) {
        console.error('BUG? Received an XWM message from an unregistered XWayland proxy.')
      } else {
        xWaylandConnection.state = 'open'
        xWaylandConnection.wlClient = client
        xWaylandBaseURL.searchParams.append('xwmFD', `${wmFD}`)
        const xConnection = await XWindowManagerConnection.create(
          this.session,
          createRetransmittingWebSocket(xWaylandBaseURL, randomString()),
        )
        client.onClose().then(() => xConnection.destroy())
        xConnection.onDestroy().then(() => delete xWaylandProxyStates[xWaylandBaseURLhref])
        xWaylandConnection.xConnection = xConnection
        try {
          xWaylandConnection.xwm = await XWindowManager.create(
            this.session,
            xConnection,
            client,
            XWaylandShell.create(this.session),
          )
        } catch (e) {
          console.error('Failed to create X Window Manager.', e)
        }
      }
    })
  }

  private handleMessageEvent(client: Client, event: MessageEventLike, wsOutOfBandChannel: RemoteOutOfBandChannel) {
    if (client.connection.closed) {
      return
    }

    try {
      const arrayBuffer = event.data as ArrayBuffer
      const dataView = new DataView(arrayBuffer)
      const outOfBand = dataView.getUint32(0, true)
      if (outOfBand) {
        wsOutOfBandChannel.message(arrayBuffer)
      } else {
        let offset = 0
        const receiveBuffer = new Uint32Array(arrayBuffer, Uint32Array.BYTES_PER_ELEMENT)
        const fdsInCount = receiveBuffer[offset++]
        const webFDs = new Array<WebFD>(fdsInCount)
        for (let i = 0; i < fdsInCount; i++) {
          const { read, webFd } = this.deserializeWebFD(receiveBuffer.subarray(offset))
          offset += read
          webFDs[i] = webFd
        }
        const buffer = receiveBuffer.subarray(offset)
        client.connection.message({ buffer, fds: webFDs }).catch((e: Error) => {
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

  private flushWireMessages(client: Client, webSocket: WebSocketLike, wireMessages: SendMessage[]) {
    if (client.connection.closed) {
      return
    }

    let messageSize = 1 // +1 for indicator of it's an out of band message
    const serializedWireMessages = wireMessages.map((wireMessage) => {
      let size = 1 // +1 for fd length
      const serializedWebFds: Uint8Array[] = wireMessage.fds.map((webFd: WebFD) => {
        const serializedWebFD = this.textEncoder.encode(JSON.stringify(webFd))
        size += 1 + ((serializedWebFD.byteLength + 3) & ~3) / 4 // +1 for encoded fd length
        return serializedWebFD
      })

      messageSize += size + wireMessage.buffer.byteLength / 4

      return {
        buffer: wireMessage.buffer,
        serializedWebFds,
      }
    })

    const sendBuffer = new Uint32Array(messageSize)
    let offset = 0
    sendBuffer[offset++] = 0 // no out-of-band opcode

    serializedWireMessages.forEach((serializedWireMessage) => {
      sendBuffer[offset++] = serializedWireMessage.serializedWebFds.length
      serializedWireMessage.serializedWebFds.forEach((serializedWebFd) => {
        sendBuffer[offset++] = serializedWebFd.byteLength
        new Uint8Array(sendBuffer.buffer, sendBuffer.byteOffset + offset * Uint32Array.BYTES_PER_ELEMENT).set(
          serializedWebFd,
        )
        // TODO we don't need to pad here as it's already padded?
        offset += ((serializedWebFd.byteLength + 3) & ~3) / 4
      })

      const message = new Uint32Array(serializedWireMessage.buffer)
      sendBuffer.set(message, offset)
      offset += message.length
    })

    if (webSocket.readyState === ReadyState.OPEN) {
      try {
        webSocket.send(sendBuffer.buffer)
      } catch (e: any) {
        this.session.logger.error(e)
        client.close()
      }
    }
  }

  private deserializeWebFD(sourceBuf: Uint32Array): { read: number; webFd: WebFD } {
    const webFdbyteLength = sourceBuf[0]
    const webFdBytes = new Uint8Array(
      sourceBuf.buffer,
      sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT,
      webFdbyteLength,
    )

    const webFdJSON = this.textDecoder.decode(webFdBytes)
    const webFd: WebFD = JSON.parse(webFdJSON)

    return {
      read: 1 + ((webFdbyteLength + 3) & ~3) / 4,
      webFd,
    }
  }
}

export default RemoteSocket
