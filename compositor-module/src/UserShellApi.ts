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

import { Display } from 'westfield-runtime-server'
import {
  AxisEvent,
  ButtonEvent,
  CompositorClient,
  CompositorSeatState,
  CompositorSurface,
  CompositorSurfaceState,
  KeyEvent,
  UserConfiguration
} from './index'
import Session from './Session'
import Surface from './Surface'
import { instanceOfUserShellSurfaceRole } from './UserShellSurfaceRole'

export interface UserShellApiEvents {
  createApplicationClient?: (applicationClient: CompositorClient) => void
  destroyApplicationClient?: (applicationClient: CompositorClient) => void
  createUserSurface?: (userSurface: CompositorSurface, state: CompositorSurfaceState) => void
  notify?: (variant: string, message: string) => void
  updateUserSurface?: (userSurface: CompositorSurface, state: CompositorSurfaceState) => void
  destroyUserSurface?: (userSurface: CompositorSurface) => void
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

  raise(userSurface: CompositorSurface, sceneId: string): void

  requestActive(userSurface: CompositorSurface): void

  notifyInactive(userSurface: CompositorSurface): void

  initScene(sceneId: string, canvas: HTMLCanvasElement): void

  refreshScene(sceneId: string): Promise<void>

  setSceneConfiguration(
    sceneId: string,
    sceneConfig: { width: number; height: number }
  ): void

  destroyScene(sceneId: string): void

  createView(userSurface: CompositorSurface, sceneId: string): void

  setKeyboardFocus(userSurface: CompositorSurface): void

  setUserConfiguration(userConfiguration: Partial<UserConfiguration>): void

  closeClient(applicationClient: Pick<CompositorClient, 'id'>): void
}

export interface UserShellApi {
  events: UserShellApiEvents
  actions: UserShellApiActions
}

function performSurfaceAction<T>(display: Display, userSurface: CompositorSurface, surfaceAction: (surface: Surface) => T): T | undefined {
  const wlSurfaceResource = display.clients[userSurface.clientId].connection.wlObjects[userSurface.id]
  if (wlSurfaceResource) {
    return surfaceAction(wlSurfaceResource.implementation)
  } else {
    return undefined
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
      raise: (userSurface, sceneId) => performSurfaceAction(session.display, userSurface, surface => session.renderer.scenes[sceneId].raiseSurface(surface)),
      requestActive: userSurface => performSurfaceAction(session.display, userSurface, surface => {
        if (surface.role && instanceOfUserShellSurfaceRole(surface.role)) {
          surface.role.requestActive()
        } else {
          throw new Error('BUG. Surface does not have the UserShellSurface role.')
        }
      }),
      notifyInactive: userSurface => performSurfaceAction(session.display, userSurface, surface => {
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
      createView: (userSurface, sceneId) => {
        session.display.clients[userSurface.clientId].connection.wlObjects[userSurface.id].implementation.createTopLevelView(session.renderer.scenes[sceneId])
      },
      setKeyboardFocus: userSurface => performSurfaceAction(session.display, userSurface, surface => session.globals.seat.keyboard.focusGained(surface)),
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
