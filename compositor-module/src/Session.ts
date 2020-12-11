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
import Globals from './Globals'
import { CompositorSession } from './index'
import Renderer from './render/Renderer'
import { createUserShellApi, UserShellApi } from './UserShellApi'
import WebFS from './WebFS'

class Session implements CompositorSession{
  readonly display: Display
  readonly compositorSessionId: string
  readonly webFS: WebFS
  readonly globals: Globals
  readonly renderer: Renderer
  readonly userShell: UserShellApi

  static create(): Session {
    const display = new Display()
    const compositorSessionId = this._uuidv4()
    return new Session(display, compositorSessionId)
  }

  private static _uuidv4(): string {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  private constructor(display: Display, compositorSessionId: string) {
    this.display = display
    this.compositorSessionId = compositorSessionId
    this.webFS = WebFS.create(this.compositorSessionId)
    this.globals = Globals.create(this)
    this.renderer = Renderer.create(this)
    this.userShell = createUserShellApi(this)
  }

  terminate() {
    this.globals.unregister()
    Object.values(this.display.clients).forEach(client => client.close())
  }

  flush() {
    this.display.flushClients()
  }
}

export default Session
