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

import { Display, WlSurfaceResource } from 'westfield-runtime-server'
import {
  AxisEvent,
  ButtonEvent,
  CompositorClient,
  CompositorConfiguration,
  CompositorSeatState,
  CompositorSurface,
  CompositorSurfaceState,
  KeyEvent
} from './index'
import Session from './Session'
import Surface from './Surface'
import { instanceOfUserShellSurfaceRole } from './UserShellSurfaceRole'

export interface UserShellApiEvents {
  createApplicationClient?: (applicationClient: CompositorClient) => void
  destroyApplicationClient?: (applicationClient: CompositorClient) => void
  createUserSurface?: (compositorSurface: CompositorSurface, state: CompositorSurfaceState) => void
  notify?: (variant: string, message: string) => void
  updateUserSurface?: (compositorSurface: CompositorSurface, state: CompositorSurfaceState) => void
  destroyUserSurface?: (compositorSurface: CompositorSurface) => void
  updateUserSeat?: (userSeatState: CompositorSeatState) => void
  sceneRefresh?: (sceneId: string) => void
}

export interface UserShellApiInputActions {
  pointerMove(buttonEvent: ButtonEvent): void

  buttonUp(buttonEvent: ButtonEvent): void

  buttonDown(buttonEvent: ButtonEvent): void

  axis(axisEvent: AxisEvent): void

  key(keyEvent: KeyEvent): void
}

export interface UserShellApiActions {
  input: UserShellApiInputActions

  raise(compositorSurface: CompositorSurface, sceneId: string): void

  requestActive(compositorSurface: CompositorSurface): void

  notifyInactive(compositorSurface: CompositorSurface): void

  initScene(sceneId: string, canvas: HTMLCanvasElement): void

  refreshScene(sceneId: string): Promise<void>

  setSceneConfiguration(
    sceneId: string,
    sceneConfig: { width: number; height: number }
  ): void

  destroyScene(sceneId: string): void

  createView(compositorSurface: CompositorSurface, sceneId: string): void

  setKeyboardFocus(compositorSurface: CompositorSurface): void

  setUserConfiguration(userConfiguration: Partial<CompositorConfiguration>): void

  closeClient(applicationClient: Pick<CompositorClient, 'id'>): void
}

export interface UserShellApi {
  events: UserShellApiEvents
  actions: UserShellApiActions
}

function performSurfaceAction<T>(display: Display, compositorSurface: CompositorSurface, surfaceAction: (surface: Surface) => T): T | undefined {
  const compositorSurfaceId = parseInt(compositorSurface.id)
  const wlSurfaceResource = display.clients[compositorSurface.clientId].connection.wlObjects[compositorSurfaceId]
  if (wlSurfaceResource && wlSurfaceResource instanceof WlSurfaceResource) {
    return surfaceAction(wlSurfaceResource.implementation as Surface)
  } else {
    throw new Error('BUG. Compositor surface does not resolve to a valid surface.')
  }
}

export function createUserShellApi(session: Session): UserShellApi {
  return {
    events: {},
    actions: {
      input: {
        pointerMove: (buttonEvent) => {
          session.globals.seat.pointer.handleMouseMove(buttonEvent)
          session.flush()
        },
        buttonUp: (buttonEvent) => {
          session.globals.seat.pointer.handleMouseUp(buttonEvent)
          session.flush()
        },
        buttonDown: (buttonEvent) => {
          session.globals.seat.pointer.handleMouseDown(buttonEvent)
          session.flush()
        },
        axis: (axisEvent) => {
          session.globals.seat.pointer.handleWheel(axisEvent)
          session.flush()
        },
        key: (keyEvent) => {
          session.globals.seat.keyboard.handleKey(keyEvent)
          session.flush()
        }
      },
      raise: (compositorSurface, sceneId) => performSurfaceAction(session.display, compositorSurface, surface => session.renderer.scenes[sceneId].raiseSurface(surface)),
      requestActive: compositorSurface => performSurfaceAction(session.display, compositorSurface, surface => {
        if (surface.role && instanceOfUserShellSurfaceRole(surface.role)) {
          surface.role.requestActive()
        } else {
          throw new Error('BUG. Surface does not have the UserShellSurface role.')
        }
      }),
      notifyInactive: compositorSurface => performSurfaceAction(session.display, compositorSurface, surface => {
        if (surface.role && instanceOfUserShellSurfaceRole(surface.role)) {
          surface.role.notifyInactive()
        } else {
          throw new Error('BUG. Surface does not have the UserShellSurface role.')
        }
      }),
      initScene: (sceneId, canvas) => session.renderer.initScene(sceneId, canvas),
      refreshScene: sceneId => session.renderer.scenes[sceneId].render(),
      setSceneConfiguration: (sceneId, sceneConfig) => {
        session.renderer.scenes[sceneId].updateResolution(sceneConfig.width, sceneConfig.height)
      },
      destroyScene: sceneId => session.renderer.scenes[sceneId].destroy(),
      createView: (compositorSurface, sceneId) => {
        const compositorSurfaceId = parseInt(compositorSurface.id)
        const wlSurfaceResource = session.display.clients[compositorSurface.clientId].connection.wlObjects[compositorSurfaceId]
        if (wlSurfaceResource && wlSurfaceResource instanceof WlSurfaceResource) {
          const surface = wlSurfaceResource.implementation as Surface
          surface.createTopLevelView(session.renderer.scenes[sceneId])
        } else {
          throw new Error('BUG. Compositor surface does not resolve to a valid surface.')
        }
      },
      setKeyboardFocus: compositorSurface => performSurfaceAction(session.display, compositorSurface, surface => session.globals.seat.keyboard.focusGained(surface)),
      setUserConfiguration: userConfiguration => {
        const { pointer, keyboard } = session.globals.seat
        pointer.scrollFactor = userConfiguration.scrollFactor ?? 1
        if (userConfiguration.keyboardLayoutName) {
          const foundNrmlvo = keyboard.nrmlvoEntries.find(nrmlvo => nrmlvo.name === userConfiguration.keyboardLayoutName)
          if (foundNrmlvo) {
            keyboard.updateKeymapFromNames(foundNrmlvo)
          }
        } else {
          keyboard.updateKeymapFromNames(keyboard.defaultNrmlvo)
        }
      },
      closeClient: applicationClient => session.display.clients[applicationClient.id].close()
    }
  }
}
