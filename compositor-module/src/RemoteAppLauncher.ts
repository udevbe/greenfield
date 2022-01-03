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

import { Client } from 'westfield-runtime-server'
import { CompositorProxyConnector } from './index'
import RemoteSocket, { createRetransmittingWebSocket } from './RemoteSocket'
import Session from './Session'

export default class RemoteAppLauncher implements CompositorProxyConnector {
  private readonly session: Session
  private readonly remoteSocket: RemoteSocket

  static create(session: Session, remoteSocket: RemoteSocket): RemoteAppLauncher {
    return new RemoteAppLauncher(session, remoteSocket)
  }

  private constructor(session: Session, remoteSocket: RemoteSocket) {
    this.session = session
    this.remoteSocket = remoteSocket
  }

  async connectTo(appEndpointURL: URL): Promise<Client> {
    this.remoteSocket.ensureXWayland(appEndpointURL)
    return this.remoteSocket.onWebSocket(createRetransmittingWebSocket(appEndpointURL))
  }
}
