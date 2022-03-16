import {
  WebSocketLike,
  ReadyState,
  RetransmittingWebSocketEventMap,
  WebSocketEventListenerMap,
} from 'retransmitting-websocket'
import { WebSocket } from 'uWebSockets.js'

export class UWebSocketLike implements WebSocketLike {
  private listeners: {
    close: WebSocketEventListenerMap['close'][]
    error: WebSocketEventListenerMap['error'][]
    message: WebSocketEventListenerMap['message'][]
    open: WebSocketEventListenerMap['open'][]
  } = {
    close: [],
    error: [],
    message: [],
    open: [],
  }

  readonly binaryType = 'arraybuffer' as const
  readyState = ReadyState.OPEN
  constructor(public readonly uws: WebSocket) {}

  send(data: ArrayBufferLike): void {
    this.uws.send(data, true)
  }

  close(code = 1000, reason = ''): void {
    this.uws.end(code, reason)
  }

  get bufferedAmount(): number {
    return this.uws.getBufferedAmount()
  }

  addEventListener<T extends keyof RetransmittingWebSocketEventMap>(
    name: T,
    eventListener: WebSocketEventListenerMap[T],
  ): void {
    // @ts-ignore
    this.listeners[name].push(eventListener)
  }

  removeEventListener<T extends keyof WebSocketEventListenerMap>(
    name: T,
    eventListener: WebSocketEventListenerMap[T],
  ): void {
    // @ts-ignore
    this.listeners[name] = this.listeners[name].filter(
      (listener: WebSocketEventListenerMap[T]) => listener !== eventListener,
    )
  }

  emit<T extends keyof RetransmittingWebSocketEventMap>(name: T, event: RetransmittingWebSocketEventMap[T]): void {
    // @ts-ignore
    this.listeners[name].forEach((listener) => listener(event))
  }
}
