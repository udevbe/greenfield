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

import { SendMessage, WebFD } from 'westfield-runtime-common'
import { Client, WlBufferResource } from 'westfield-runtime-server'
import { MessageEventLike, RetransmittingWebSocket } from 'retransmitting-websocket'
import RemoteOutOfBandChannel, {
  RemoteOutOfBandListenOpcode,
  RemoteOutOfBandSendOpcode,
} from './RemoteOutOfBandChannel'
import StreamingBuffer from './remotestreaming/StreamingBuffer'
import Session from './Session'
import { XWindowManagerConnection } from './xwayland/XWindowManagerConnection'
import XWaylandShell from './xwayland/XWaylandShell'
import { XWindowManager } from './xwayland/XWindowManager'

type XWaylandConectionState = {
  state: 'pending' | 'open'
  xConnection?: XWindowManagerConnection
  wlClient?: Client
  xwm?: XWindowManager
}

const xWaylandProxyStates: { [key: string]: XWaylandConectionState } = {}

let connectionIdCounter = 0
export function createRetransmittingWebSocket(url: URL): RetransmittingWebSocket {
  const connectionURL = new URL(url.href)
  connectionURL.searchParams.set('connectionId', `${connectionIdCounter++}`)
  const retransmittingWebSocket = new RetransmittingWebSocket({
    webSocketFactory: () => new WebSocket(connectionURL.href),
  })
  return retransmittingWebSocket
}

class RemoteSocket {
  private readonly textEncoder: TextEncoder = new TextEncoder()
  private readonly textDecoder: TextDecoder = new TextDecoder()

  private constructor(private readonly session: Session) {}

  static create(session: Session): RemoteSocket {
    return new RemoteSocket(session)
  }

  ensureXWayland(appEndpointURL: URL): void {
    const xWaylandBaseURLhref = appEndpointURL.href

    if (xWaylandProxyStates[xWaylandBaseURLhref] === undefined) {
      xWaylandProxyStates[xWaylandBaseURLhref] = { state: 'pending' }
    }
  }

  onWebSocket(webSocket: RetransmittingWebSocket): Promise<Client> {
    return new Promise((resolve, reject) => {
      this.session.logger.info('[WebSocket] - created.')

      webSocket.binaryType = 'arraybuffer'
      webSocket.onclose = (event) => {
        reject(new Error(`Failed to connect to application. ${event.reason} ${event.code}`))
      }
      webSocket.onopen = () => {
        this.session.logger.info('[WebSocket] - open.')

        const client = this.session.display.createClient()
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

        webSocket.onclose = () => {
          this.session.logger.info('[WebSocket] - closed.')
          client.close()
        }
        webSocket.onerror = (event) => this.session.logger.warn(`[WebSocket] - error`, event)

        client.connection.onFlush = (wireMessages: SendMessage[]) =>
          this.flushWireMessages(client, webSocket, wireMessages)

        const remoteOutOfBandChannel = RemoteOutOfBandChannel.create(this.session, (sendBuffer) => {
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
        this.setupClientOutOfBandHandlers(webSocket, client, remoteOutOfBandChannel)

        webSocket.onmessage = (event) => this.handleMessageEvent(client, event, remoteOutOfBandChannel)

        client.onClose().then(() => {
          this.session.userShell.events.clientDestroyed?.({
            id: client.id,
          })
        })
        this.session.userShell.events.clientCreated?.({
          id: client.id,
        })
        this.session.registerRemoteClientConnection(client, remoteOutOfBandChannel)
        resolve(client)
      }
    })
  }

  private async getShmTransferable(webFD: WebFD): Promise<ArrayBuffer> {
    // TODO get all contents at once from remote endpoint and put it in an array buffer
    // TODO do this on each invocation
    // return new ArrayBuffer(0)
    throw new Error('TODO. Shm transferable from endpoint not yet implemented.')
  }

  private async closeShmTransferable(webFD: WebFD): Promise<void> {
    // TODO signal the remote end (if any) that it should close the fd
    throw new Error('TODO. Close shm transferable from endpoint not yet implemented.')
  }

  private async getPipeTransferable(webFD: WebFD): Promise<MessagePort> {
    // TODO setup an open connection with the remote endpoint and transfer data on demand
    // const messageChannel = new MessageChannel()
    // TODO use port1 to interface with the remote endpoint
    // TODO only do this once until the messageChannel is closed
    // return messageChannel.port2

    throw new Error('TODO. Pipe transferable from endpoint not yet implemented.')
  }

  private async closePipeTransferable(webFD: WebFD): Promise<void> {
    // TODO signal the remote end (if any) that it should close the fd
    // TODO close the messageChannel object
    throw new Error('TODO. close pipe transferable from endpoint not yet implemented.')
  }

  private setupClientOutOfBandHandlers(
    webSocket: RetransmittingWebSocket,
    client: Client,
    outOfBandChannel: RemoteOutOfBandChannel,
  ) {
    // send out-of-band resource destroy. opcode: 1
    client.addResourceDestroyListener((resource) => {
      outOfBandChannel.send(RemoteOutOfBandSendOpcode.ResourceDestroyed, new Uint32Array([resource.id]).buffer)
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

    // listen for file contents request. opcode: 4
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.FileContents, async (outOfBandMessage) => {
      if (client.connection.closed) {
        return
      }

      const uint32Array = new Uint32Array(outOfBandMessage.buffer, outOfBandMessage.byteOffset)
      const fd = uint32Array[0]
      const webFD = this.session.webFS.getWebFD(fd)
      const transferable = await webFD.getTransferable()

      // Note that after contents have been transmitted, webfd is auto closed.
      if (transferable instanceof ArrayBuffer) {
        const serializedWebFdURL = this.textEncoder.encode(webFD.url.href)
        const webFDByteLength = serializedWebFdURL.byteLength
        const message = new Uint8Array(
          Uint32Array.BYTES_PER_ELEMENT + ((webFDByteLength + 3) & ~3) + transferable.byteLength,
        ) // webFdURL + fileContents
        let byteOffset = 0
        // web fd url length
        new DataView(message.buffer).setUint32(byteOffset, webFDByteLength, true)
        byteOffset += Uint32Array.BYTES_PER_ELEMENT
        // web fd url
        message.set(serializedWebFdURL, byteOffset)
        byteOffset += (webFDByteLength + 3) & ~3
        // fd contents
        message.set(new Uint8Array(transferable), byteOffset)

        // send back file contents. opcode: 4
        outOfBandChannel.send(RemoteOutOfBandSendOpcode.FileContents, message.buffer)
        webFD.close()
      }
    })

    // listen for web socket creation request. opcode: 5
    outOfBandChannel.setListener(RemoteOutOfBandListenOpcode.WebSocketCreationRequest, () => {
      if (client.connection.closed) {
        return
      }
      const appEndpointURL = new URL(webSocket.url)
      this.onWebSocket(createRetransmittingWebSocket(appEndpointURL))
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

      const xWaylandBaseURL = new URL(webSocket.url)
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
          createRetransmittingWebSocket(xWaylandBaseURL),
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
        const webFDs = new Array(fdsInCount)
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

  private flushWireMessages(client: Client, webSocket: RetransmittingWebSocket, wireMessages: SendMessage[]) {
    if (client.connection.closed) {
      return
    }

    let messageSize = 1 // +1 for indicator of it's an out of band message
    const serializedWireMessages = wireMessages.map((wireMessage) => {
      let size = 1 // +1 for fd length
      const serializedWebFds: Uint8Array[] = wireMessage.fds.map((webFd: WebFD) => {
        const serializedWebFD = this.textEncoder.encode(webFd.url.href)
        size += 1 + ((serializedWebFD.byteLength + 3) & ~3) / 4 // +1 for fd url length
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
        offset += ((serializedWebFd.byteLength + 3) & ~3) / 4
      })

      const message = new Uint32Array(serializedWireMessage.buffer)
      sendBuffer.set(message, offset)
      offset += message.length
    })

    if (webSocket.readyState === 1) {
      // 1 === 'open'
      try {
        webSocket.send(sendBuffer.buffer)
      } catch (e: any) {
        this.session.logger.error(e)
        client.close()
      }
    }
  }

  private deserializeWebFD(sourceBuf: Uint32Array): { read: number; webFd: WebFD } {
    // FIXME we only need to handle fetching remote contents if the webfd does not match this compositor
    // If it does match, we simply need to lookup the WebFD from our own WebFS cache, and return that one instead.
    const webFdbyteLength = sourceBuf[0]
    const webFdBytes = new Uint8Array(
      sourceBuf.buffer,
      sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT,
      webFdbyteLength,
    )

    const webFdURL = new URL(this.textDecoder.decode(webFdBytes))
    const fdParam = webFdURL.searchParams.get('fd')
    if (fdParam === null) {
      throw new Error('BUG. WebFD URL does not have fd query param.')
    }
    const fd = Number.parseInt(fdParam)
    const type = webFdURL.searchParams.get('type')

    let onGetTransferable
    let onClose
    switch (type) {
      case 'ArrayBuffer':
        onGetTransferable = (webFD: WebFD) => this.getShmTransferable(webFD)
        onClose = (webFD: WebFD) => this.closeShmTransferable(webFD)
        break
      case 'MessagePort':
        onGetTransferable = (webFD: WebFD) => this.getPipeTransferable(webFD)
        onClose = (webFD: WebFD) => this.closePipeTransferable(webFD)
        break
      // case 3: 'ImageBitmap' can not be transferred to a remote
      default:
        throw new Error(`Unsupported WebFD type: ${type}`)
    }
    return {
      read: 1 + ((webFdbyteLength + 3) & ~3) / 4,
      webFd: new WebFD(fd, type, webFdURL, onGetTransferable, onClose),
    }
  }
}

export default RemoteSocket
