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
  peerConnectionResetListeners: ((newPeerConnection: RTCPeerConnection) => void)[]
  polite: false
  makingOffer: boolean
  ignoreOffer: boolean
  isSettingRemoteAnswerPending: boolean
}

function createPeerConnection(): RTCPeerConnection {
  return new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  })
}

export function createCompositorProxySession(compositorSessionId: string): CompositorProxySession {
  const peerConnection = createPeerConnection()
  const peerConnectionState: PeerConnectionState = {
    peerConnection,
    peerConnectionResetListeners: [],
    polite: false,
    makingOffer: false,
    ignoreOffer: false,
    isSettingRemoteAnswerPending: false,
  }
  const nativeCompositorSession = createNativeCompositorSession(compositorSessionId, peerConnectionState)
  const xWaylandSession = XWaylandSession.create(nativeCompositorSession)
  xWaylandSession.createXWaylandListenerSocket()

  const compositorProxySession = new CompositorProxySession(
    nativeCompositorSession,
    compositorSessionId,
    xWaylandSession,
    peerConnectionState,
  )
  logger.info(`Session created.`)

  return compositorProxySession
}

export class CompositorProxySession {
  constructor(
    public readonly nativeCompositorSession: NativeCompositorSession,
    public readonly compositorSessionId: string,
    private readonly xWaylandSession: XWaylandSession,
    public readonly peerConnectionState: PeerConnectionState,
  ) {}

  resetPeerConnectionState(): void {
    for (const client of this.nativeCompositorSession.clients) {
      if (client.nativeClientSession.hasCompositorState) {
        client.nativeClientSession.destroy()
      }
    }

    this.peerConnectionState.peerConnection.close()

    const newPeerConnection = createPeerConnection()
    this.peerConnectionState.peerConnection = newPeerConnection
    for (const peerConnectionResetListener of this.peerConnectionState.peerConnectionResetListeners) {
      peerConnectionResetListener(newPeerConnection)
    }
  }
}
