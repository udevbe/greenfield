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
import { CompositorClient, CompositorConfiguration, CompositorSurface } from './index'
import Session from './Session'
import Surface from './Surface'

export interface UserShellApiEvents {
  createApplicationClient?: (applicationClient: CompositorClient) => void
  destroyApplicationClient?: (applicationClient: CompositorClient) => void
  notify?: (variant: string, message: string) => void
  sceneRefresh?: (sceneId: string) => void

  addCompositorSurface?: (compositorSurface: CompositorSurface) => void
  removeCompositorSurface?: (compositorSurface: CompositorSurface) => void

  title?: (compositorSurface: CompositorSurface, title: string) => void
  appId?: (compositorSurface: CompositorSurface, appId: string) => void
}

export interface UserShellApiActions {
  initScene(sceneId: string, canvas: HTMLCanvasElement): void

  refresh(): void

  destroyScene(sceneId: string): void

  setUserConfiguration(userConfiguration: Partial<CompositorConfiguration>): void

  closeClient(applicationClient: Pick<CompositorClient, 'id'>): void

  activateSurface(surface: CompositorSurface): void
}

export interface UserShellApi {
  events: UserShellApiEvents
  actions: UserShellApiActions
}

export function createUserShellApi(session: Session): UserShellApi {
  return {
    events: {},
    actions: {
      activateSurface(compositorSurface: CompositorSurface) {
        const resource = session.display.clients[compositorSurface.client.id].connection.wlObjects[
          compositorSurface.id
        ] as WlSurfaceResource
        const surface = resource.implementation as Surface
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
      closeClient: (applicationClient) => session.display.clients[applicationClient.id].close(),
    },
  }
}
