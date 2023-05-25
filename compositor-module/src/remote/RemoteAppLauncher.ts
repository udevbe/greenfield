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

import { AppContext, AppLauncher } from '../index'
import Session from '../Session'
import {
  ARQChannel,
  Channel,
  ChannelDesc,
  ChannelDescriptionType,
  ChannelType,
  FeedbackChannelDesc,
  SimpleChannel,
  WebSocketChannel,
} from './Channel'
import { Client, WlBufferResource } from 'westfield-runtime-server'
import ReconnectingWebSocket from './reconnecting-websocket'
import { FD, SendMessage } from 'westfield-runtime-common'
import RemoteOutOfBandChannel, {
  RemoteOutOfBandListenOpcode,
  RemoteOutOfBandSendOpcode,
} from './RemoteOutOfBandChannel'
import { createClientEncodersFeedback } from './EncoderFeedback'
import { createRemoteInputOutput, isProxyFD } from './RemoteInputOutput'
import { deliverContentToBufferStream } from './BufferStream'
import { XWindowManager } from './xwayland/XWindowManager'
import { XWindowManagerConnection } from './xwayland/XWindowManagerConnection'
import XWaylandShell from './xwayland/XWaylandShell'
import { StreamingBuffer } from './StreamingBuffer'
import { Configuration, EncoderApi } from '../api'

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

const enum SignalingMessageType {
  CONNECT_CHANNEL,
  DISCONNECT_CHANNEL,
  CREATE_NEW_CLIENT,
  APP_TERMINATED,
  KILL_APP,
}

type SignalingMessage =
  | {
      readonly type: SignalingMessageType.CONNECT_CHANNEL
      readonly data: { url: string; desc: ChannelDesc }
    }
  | {
      readonly type: SignalingMessageType.DISCONNECT_CHANNEL
      readonly data: { channelId: string }
    }
  | {
      readonly type: SignalingMessageType.CREATE_NEW_CLIENT
      readonly data: { baseURL: string; signalURL: string; key: string }
    }
  | {
      readonly type: SignalingMessageType.APP_TERMINATED
      readonly data: { exitCode: number } | { signal: string }
    }
  | {
      readonly type: SignalingMessageType.KILL_APP
      readonly data: { signal: 'SIGTERM' }
    }

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }

  return (
    messageObject.type === SignalingMessageType.CONNECT_CHANNEL ||
    messageObject.type === SignalingMessageType.DISCONNECT_CHANNEL ||
    messageObject.type === SignalingMessageType.CREATE_NEW_CLIENT ||
    messageObject.type === SignalingMessageType.APP_TERMINATED
  )
}

export class RemoteAppLauncher implements AppLauncher {
  public readonly type = 'remote'

  static create(session: Session): RemoteAppLauncher {
    return new RemoteAppLauncher(session)
  }

  private constructor(public readonly session: Session) {}

  launch(appURL: URL, onChildAppContext: (childAppContext: AppContext) => void): AppContext {
    const remoteAppContext = new RemoteAppContext(this.session, onChildAppContext)

    try {
      fetch(appURL, {
        method: 'POST',
        headers: {
          'x-compositor-session-id': this.session.compositorSessionId,
        },
      }).then((response) => {
        if (response.ok) {
          return response
            .json()
            .then((proxySessionProps: { baseURL: string; signalURL: string; key: string }) => {
              remoteAppContext.listen(proxySessionProps)
            })
            .catch((e) => {
              remoteAppContext.error(e)
            })
        } else {
          remoteAppContext.error(new Error(response.statusText))
        }
      })
    } catch (e) {
      remoteAppContext.error(e)
    }

    return remoteAppContext
  }
}

class RemoteAppContext implements AppContext {
  onClient = (client: Client): void => {
    /*noop*/
  }

  onStateChange = (state: AppContext['state']): void => {
    /*noop*/
  }

  onError = (error: Error): void => {
    /*noop*/
  }

  key?: string

  onKeyChanged = (remoteIdentity: string): void => {
    /*noop*/
  }

  readonly type = 'remote'

  private signalingSendBuffer: Uint8Array[] = []
  private signalingWebSocket?: ReconnectingWebSocket
  private clientConnections: WebSocketChannel[] = []
  private proxySessionProps?: { baseURL: string; signalURL: string }
  private terminated = false
  private sendKillAppTimer?: ReturnType<typeof setTimeout>

  constructor(
    public readonly session: Session,
    private readonly onChildAppContext: (childAppContext: AppContext) => void,
  ) {}

  close(): void {
    this.sendKillApp()
    if (this.signalingWebSocket?.readyState !== ReconnectingWebSocket.OPEN && !this.terminated) {
      this.error(new Error('Force closing application.'))
    } else {
      this.sendKillAppTimer = setTimeout(() => {
        this.sendKillAppTimer = undefined
        this.error(new Error('Force closing application.'))
      }, 3000)
    }
  }

  error(error: any): void {
    if (this.terminated) {
      throw new Error("BUG. Can't error close, already terminated.")
    }

    if (this.sendKillAppTimer) {
      clearTimeout(this.sendKillAppTimer)
      this.sendKillAppTimer = undefined
    }

    for (const clientConnection of this.clientConnections) {
      clientConnection.close()
    }

    if (this.signalingWebSocket) {
      this.signalingWebSocket.close()
      this.signalingWebSocket = undefined
    }

    this.terminated = true
    // TODO pass on error?
    this.onStateChange('error')
  }

  private onAppTerminated(exitState: { exitCode: number } | { signal: string }) {
    if (this.terminated) {
      throw new Error("BUG. Can't close, already terminated.")
    }

    if (this.sendKillAppTimer) {
      clearTimeout(this.sendKillAppTimer)
      this.sendKillAppTimer = undefined
    }

    if (this.signalingWebSocket) {
      this.signalingWebSocket.close()
      this.signalingWebSocket = undefined
    }

    this.terminated = true

    // TODO pass on termination state?
    this.onStateChange('terminated')
  }

  get state(): AppContext['state'] {
    if (this.terminated) {
      return 'terminated'
    }

    if (this.signalingWebSocket === undefined) {
      return 'connecting'
    }

    switch (this.signalingWebSocket.readyState) {
      case ReconnectingWebSocket.CONNECTING:
        return 'connecting'
      case ReconnectingWebSocket.OPEN:
        return 'open'
      case ReconnectingWebSocket.CLOSED:
        return 'closed'
      default:
        return 'closed'
    }
  }

  private flushCachedSignalingSends() {
    if (this.signalingWebSocket === undefined || this.signalingSendBuffer.length === 0) {
      return
    }
    for (const message of this.signalingSendBuffer) {
      this.signalingWebSocket.send(message)
    }
    this.signalingSendBuffer = []
  }

  listen(proxySessionProps: { baseURL: string; signalURL: string; key: string }) {
    this.proxySessionProps = proxySessionProps
    this.signalingWebSocket = new ReconnectingWebSocket(proxySessionProps.signalURL)
    this.signalingWebSocket.binaryType = 'arraybuffer'

    this.signalingWebSocket.addEventListener('open', (event) => {
      this.onStateChange('open')
    })
    this.signalingWebSocket.addEventListener('close', (event) => {
      this.onStateChange('closed')
    })
    this.signalingWebSocket.addEventListener('error', (event) => {
      this.onError(event.error)
    })

    this.handleProxySessionMessages(this.signalingWebSocket, proxySessionProps)
    this.onKeyChanged(proxySessionProps.key)

    this.flushCachedSignalingSends()
  }

  private handleProxySessionMessages(
    signalingConnection: ReconnectingWebSocket,
    proxySessionProps: {
      baseURL: string
      signalURL: string
      key: string
    },
  ) {
    signalingConnection.onmessage = async (event) => {
      const messageObject = JSON.parse(textDecoder.decode(event.data as ArrayBuffer))
      if (isSignalingMessage(messageObject)) {
        switch (messageObject.type) {
          case SignalingMessageType.CONNECT_CHANNEL: {
            // TODO define a connection timeout
            const webSocket = new ReconnectingWebSocket(messageObject.data.url)
            const desc = messageObject.data.desc
            let channel: WebSocketChannel
            if (desc.channelType === ChannelType.ARQ) {
              channel = new ARQChannel(webSocket, desc)
            } else if (desc.channelType === ChannelType.SIMPLE) {
              channel = new SimpleChannel(webSocket, desc)
            } else {
              throw new Error(`BUG. Unknown channel description: ${JSON.stringify(desc)}`)
            }
            this.clientConnections.push(channel)
            this.onChannel(channel, this.session.compositorSessionId, proxySessionProps)
            break
          }
          case SignalingMessageType.DISCONNECT_CHANNEL: {
            this.clientConnections = this.clientConnections.filter((clientConnection) => {
              if (clientConnection.desc.id === messageObject.data.channelId) {
                clientConnection.webSocket.close(4001)
                return false
              }
              return true
            })
            break
          }
          case SignalingMessageType.CREATE_NEW_CLIENT: {
            const remoteAppContext = new RemoteAppContext(this.session, this.onChildAppContext)
            this.onChildAppContext(remoteAppContext)
            remoteAppContext.listen(messageObject.data)
            break
          }
          case SignalingMessageType.APP_TERMINATED: {
            this.onAppTerminated(messageObject.data)
            break
          }
        }
      } else {
        throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
      }
    }
  }

  private onChannel(
    channel: WebSocketChannel,
    compositorSessionId: string,
    proxySessionProps: {
      baseURL: string
      signalURL: string
      key: string
    },
  ) {
    if (channel.desc.type === ChannelDescriptionType.PROTOCOL) {
      const client = this.session.display.createClient(channel.desc.clientId)
      onProtocolChannel(this.session, channel, proxySessionProps, client, compositorSessionId)
      this.onClient(client)
    } else if (channel.desc.type === ChannelDescriptionType.FRAME) {
      const client = this.session.display.clients[channel.desc.clientId]
      if (client) {
        client.onClose().then(() => channel.close())
        setupFrameDataChannel(client, channel)
      } else {
        channel.close()
      }
    } else if (channel.desc.type === ChannelDescriptionType.XWM) {
      const client = this.session.display.clients[channel.desc.clientId]
      if (client) {
        // TODO associate with proxy connection & cleanup on disconnect?
        client.onClose().then(() => channel.close())
        setupXWM(this.session, client, channel)
      } else {
        channel.close()
      }
    } else if (channel.desc.type === ChannelDescriptionType.FEEDBACK) {
      const feedbackDesc = channel.desc as FeedbackChannelDesc
      const surfaceId = feedbackDesc.surfaceId
      const client = this.session.display.clients[channel.desc.clientId]
      if (client) {
        client.onClose().then(() => channel.close())
        client.userData.clientEncodersFeedback?.addFeedbackChannel(channel, surfaceId)
      } else {
        channel.close()
      }
    }
  }

  private signalingSend(message: Uint8Array) {
    if (this.signalingWebSocket) {
      this.signalingWebSocket.send(message)
    } else {
      this.signalingSendBuffer.push(message)
    }
  }

  private sendKillApp() {
    const pongMessage: SignalingMessage = {
      type: SignalingMessageType.KILL_APP,
      data: { signal: 'SIGTERM' },
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(pongMessage)))
  }
}

function onProtocolChannel(
  session: Session,
  protocolChannel: Channel,
  proxySessionProps: {
    baseURL: string
    signalURL: string
    key: string
  },
  client: Client,
  compositorSessionId: string,
): void {
  session.logger.info('[ProtocolChannel] - created.')
  let wasOpen = protocolChannel.isOpen
  protocolChannel.onClose = () => {
    if (!wasOpen) {
      throw new Error(`Failed to connect to application.`)
    }
  }
  const handleOpenProtocolChannel = () => {
    wasOpen = true
    session.logger.info('[ProtocolChannel] - open.')
    client.onClose().then(() => {
      session.logger.info('[client] - closed.')
      protocolChannel.close()
    })
    client.addResourceCreatedListener((resource) => {
      if (resource.id >= 0xff000000 && client.recycledIds.length === 0) {
        session.logger.warn('[client] - Ran out of reserved browser resource ids.')
        client.close()
      }
    })

    protocolChannel.onClose = () => {
      session.logger.info('[ProtocolChannel] - closed.')
      client.close()
    }
    protocolChannel.onError = (event) => {
      session.logger.warn(`[ProtocolChannel] - error`, event)
    }

    client.connection.onFlush = (wireMessages: SendMessage[]) => {
      flushWireMessages(session, client, protocolChannel, wireMessages)
    }

    const oobChannel = RemoteOutOfBandChannel.create(session, (sendBuffer) => {
      if (protocolChannel.isOpen) {
        try {
          protocolChannel.send(new Uint8Array(sendBuffer))
        } catch (e: any) {
          session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
          session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
          session.logger.error('error object stack: ')
          session.logger.error(e.stack)
          client.close()
        }
      }
    })
    setupClientOutOfBandHandlers(client, oobChannel)

    protocolChannel.onMessage = (event) => handleMessageEvent(session, client, event.buffer, oobChannel)

    client.onClose().then(() => {
      session.userShell.events.clientDestroyed?.({
        id: client.id,
      })
      client.userData.clientEncodersFeedback?.destroy()
    })
    session.userShell.events.clientCreated?.({
      id: client.id,
    })

    const encoderApi = new EncoderApi(
      new Configuration({
        basePath: proxySessionProps.baseURL,
        headers: {
          ['x-compositor-session-id']: compositorSessionId,
        },
      }),
    )
    client.userData = {
      encoderApi,
      clientEncodersFeedback: createClientEncodersFeedback(client.id, encoderApi),
      inputOutput: createRemoteInputOutput(proxySessionProps.baseURL, compositorSessionId),
    }
  }

  if (wasOpen) {
    handleOpenProtocolChannel()
  } else {
    protocolChannel.onOpen = handleOpenProtocolChannel
  }
}

function setupFrameDataChannel(client: Client, frameDataChannel: Channel) {
  frameDataChannel.onMessage = (message) => {
    if (client.connection.closed) {
      return
    }
    deliverContentToBufferStream(client, message.buffer)
  }
}

async function setupXWM(session: Session, client: Client, xwmDataChannel: Channel): Promise<XWindowManager> {
  const xConnection = await XWindowManagerConnection.create(session, xwmDataChannel)
  client.onClose().then(() => xConnection.destroy())
  return XWindowManager.create(session, xConnection, client, XWaylandShell.create(session))
}

function setupClientOutOfBandHandlers(client: Client, outOfBandChannel: RemoteOutOfBandChannel) {
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

function handleMessageEvent(
  session: Session,
  client: Client,
  messageData: ArrayBuffer,
  wsOutOfBandChannel: RemoteOutOfBandChannel,
) {
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
        const { read, fd } = deserializeFD(receiveBuffer.subarray(offset))
        offset += read
        fds[i] = fd
      }
      const buffer = receiveBuffer.subarray(offset)
      client.connection.message({ buffer, fds }).catch((e: Error) => {
        // @ts-ignore
        session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
        session.logger.error('error object stack: ')
        // @ts-ignore
        this.session.logger.error(e.stack)
      })
    }
  } catch (e: any) {
    session.logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
    session.logger.error('error object stack: ')
    session.logger.error(e.stack)
  }
}

function flushWireMessages(session: Session, client: Client, protocolChannel: Channel, wireMessages: SendMessage[]) {
  if (client.connection.closed) {
    return
  }

  let messageSize = 2 // +2 for indicator if it's an out-of-band message & event serial
  const serializedWireMessages = wireMessages.map((wireMessage) => {
    let size = 1 // +1 for fd length
    const serializedFds: Uint8Array[] = wireMessage.fds.map((fd: FD) => {
      if (isProxyFD(fd)) {
        const serializedFD = textEncoder.encode(JSON.stringify(fd))
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
      session.logger.error(e)
      client.close()
    }
  }
}

function deserializeFD(sourceBuf: Uint32Array): { read: number; fd: FD } {
  const fdByteLength = sourceBuf[0]
  const fdBytes = new Uint8Array(sourceBuf.buffer, sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT, fdByteLength)

  const fdJSON = textDecoder.decode(fdBytes)
  const fd: FD = JSON.parse(fdJSON)

  return {
    read: 1 + ((fdByteLength + 3) & ~3) / 4,
    fd,
  }
}
