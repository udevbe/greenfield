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

import { createLogger } from './Logger'

import { createNativeCompositorSession, NativeCompositorSession } from './NativeCompositorSession'
import { XWaylandSession } from './XWaylandSession'
import { RTCPeerConnection } from '@koush/wrtc'

const logger = createLogger('compositor-proxy-session')

export type PeerConnectionState = {
  peerConnection: RTCPeerConnection
  makingOffer: boolean
  ignoreOffer: boolean
  isSettingRemoteAnswerPending: boolean
  // other side has polite = true
  polite: false
}

function createPeerConnectionState(): PeerConnectionState {
  // keep track of some negotiation state to prevent races and errors
  const makingOffer = false
  const ignoreOffer = false
  const isSettingRemoteAnswerPending = false
  // other side has polite = true
  const polite = false
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    iceCandidatePoolSize: 4,
  })

  return {
    peerConnection,
    makingOffer,
    ignoreOffer,
    isSettingRemoteAnswerPending,
    polite,
  }
}

export function createCompositorProxySession(compositorSessionId: string): CompositorProxySession {
  const peerConnectionState = createPeerConnectionState()
  const nativeCompositorSession = createNativeCompositorSession(compositorSessionId, peerConnectionState)
  const xWaylandSession = XWaylandSession.create(nativeCompositorSession)
  xWaylandSession.createXWaylandListenerSocket()

  const compositorProxySession = new CompositorProxySession(
    nativeCompositorSession,
    compositorSessionId,
    xWaylandSession,
    peerConnectionState,
  )
  nativeCompositorSession.onDestroy().then(() => compositorProxySession.destroy())
  logger.info(`Session created.`)

  return compositorProxySession
}

export class CompositorProxySession {
  private destroyResolve?: (value: void | PromiseLike<void>) => void
  private _destroyPromise = new Promise<void>((resolve) => {
    this.destroyResolve = resolve
  })

  constructor(
    public readonly nativeCompositorSession: NativeCompositorSession,
    public readonly compositorSessionId: string,
    private readonly xWaylandSession: XWaylandSession,
    public readonly peerConnectionState: PeerConnectionState,
  ) {}

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    logger.info(`Session destroyed.`)
    this.destroyResolve?.()
  }

  resetPeerConnectionState(): void {
    this.peerConnectionState.peerConnection.close()
    const newPeerConnectionState = createPeerConnectionState()
    this.peerConnectionState.peerConnection = newPeerConnectionState.peerConnection
    this.peerConnectionState.makingOffer = newPeerConnectionState.makingOffer
    this.peerConnectionState.ignoreOffer = newPeerConnectionState.ignoreOffer
    this.peerConnectionState.isSettingRemoteAnswerPending = newPeerConnectionState.isSettingRemoteAnswerPending
    this.peerConnectionState.polite = newPeerConnectionState.polite
  }
}
