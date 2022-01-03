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

import { WlSurfaceResource } from 'westfield-runtime-server'
import { addInputOutput } from './browser/input'
import { DesktopSurface } from './Desktop'
import { CompositorClient, CompositorConfiguration, CompositorSurface } from './index'
import Session from './Session'
import Surface from './Surface'

export interface UserShellApiEvents {
  clientCreated?: (applicationClient: CompositorClient) => void
  clientDestroyed?: (applicationClient: CompositorClient) => void
  unresponsive?: (applicationClient: CompositorClient, unresponse: boolean) => void
  notify?: (variant: 'warn' | 'info' | 'error', message: string) => void

  sceneRefresh?: (sceneId: string) => void
  clientSurfaceCreated?: (compositorSurface: CompositorSurface) => void

  clientSurfaceDestroyed?: (compositorSurface: CompositorSurface) => void
  title?: (compositorSurface: CompositorSurface, title: string) => void
  appId?: (compositorSurface: CompositorSurface, appId: string) => void
  active?: (compositorSurface: CompositorSurface, active: boolean) => void
}

export interface UserShellApiActions {
  initScene(sceneId: string, canvas: HTMLCanvasElement): void

  refresh(): void

  destroyScene(sceneId: string): void

  setUserConfiguration(userConfiguration: Partial<CompositorConfiguration>): void

  closeClient(applicationClient: Pick<CompositorClient, 'id'>): void

  activateSurface(compositorSurface: CompositorSurface): void
}

export interface UserShellApi {
  events: UserShellApiEvents
  actions: UserShellApiActions
}

export function toCompositorSurface(desktopSurface: DesktopSurface): CompositorSurface {
  return { id: desktopSurface.surface.resource.id, client: { id: desktopSurface.surface.resource.client.id } }
}

function lookupSurface(session: Session, compositorSurface: CompositorSurface) {
  const resource = session.display.clients[compositorSurface.client.id].connection.wlObjects[
    compositorSurface.id
  ] as WlSurfaceResource
  return resource.implementation as Surface
}

export function createUserShellApi(session: Session): UserShellApi {
  return {
    events: {},
    actions: {
      activateSurface(compositorSurface: CompositorSurface) {
        const surface = lookupSurface(session, compositorSurface)
        surface.role?.desktopSurface?.activate()
      },
      initScene: (sceneId, canvas) => addInputOutput(session, canvas, sceneId),
      refresh: () => {
        session.renderer.render()
      },
      destroyScene: (sceneId) => session.renderer.scenes[sceneId].destroy(),
      setUserConfiguration: (userConfiguration) => {
        const { pointer, keyboard } = session.globals.seat
        pointer.scrollFactor = userConfiguration.scrollFactor ?? pointer.scrollFactor
        if (userConfiguration.keyboardLayoutName) {
          const foundNrmlvo = keyboard.nrmlvoEntries.find(
            (nrmlvo) => nrmlvo.name === userConfiguration.keyboardLayoutName,
          )
          if (foundNrmlvo) {
            session.globals.seat.notifyUpdateKeymap(foundNrmlvo)
          }
        }
      },
      closeClient: (applicationClient) => {
        const client = session.display.clients[applicationClient.id]
        if (client === undefined) {
          throw new Error(`Client with id ${applicationClient.id} does not exist.`)
        }
        client.close()
      },
    },
  }
}
