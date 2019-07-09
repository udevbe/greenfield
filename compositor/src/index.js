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

'use strict'

import Session from './Session'
import Compositor from './Compositor'
import pixman from './lib/libpixman-1'
import libxkbcommon from './lib/libxkbcommon'
import Shell from './Shell'
import Seat from './Seat'
import DataDeviceManager from './DataDeviceManager'
import Output from './Output'
import Subcompositor from './Subcompositor'

import './style/greenfield.css'
import XdgWmBase from './XdgWmBase'
import DesktopUserShell from './desktopshell/components/DesktopUserShell.jsx'
import auth from './desktopshell/Auth'
import WebShm from './webshm/WebShm'
import WebGL from './webgl/WebGL'

async function main () {
  try {
    const session = Session.create()
    const seat = Seat.create(session)

    document.oncontextmenu = () => false
    const shellContainer = document.createElement('div')
    shellContainer.setAttribute('id', 'shell-container')
    document.body.appendChild(shellContainer)
    DesktopUserShell.create(seat, session, shellContainer)

    DEBUG && console.log(`Greenfield compositor awaiting login.`)

    await auth.whenLogin()
    const output = Output.create()
    const compositor = Compositor.create(session, seat)
    const dataDeviceManager = DataDeviceManager.create()
    const subcompositor = Subcompositor.create()

    const shell = Shell.create(session)
    const xdgWmBase = XdgWmBase.create(session, seat)

    const webShm = WebShm.create()
    const webGL = WebGL.create(session)

    output.registerGlobal(session.display.registry)
    compositor.registerGlobal(session.display.registry)
    dataDeviceManager.registerGlobal(session.display.registry)
    seat.registerGlobal(session.display.registry)
    shell.registerGlobal(session.display.registry)
    subcompositor.registerGlobal(session.display.registry)

    xdgWmBase.registerGlobal(session.display.registry)

    webShm.registerGlobal(session.display.registry)
    webGL.registerGlobal(session.display.registry)

    DEBUG && console.log(`Greenfield compositor started.`)

    await auth.whenLogout()
    output.unregisterGlobal()
    compositor.unregisterGlobal()
    dataDeviceManager.unregisterGlobal()
    seat.unregisterGlobal()
    shell.unregisterGlobal()
    subcompositor.unregisterGlobal()

    xdgWmBase.unregisterGlobal()

    webShm.unregisterGlobal()
    webGL.unregisterGlobal()

    session.terminate()

    DEBUG && console.log(`Greenfield compositor terminated.`)

    // fire a reload to ensure everything is cleaned up
    window.location.reload()
  } catch (e) {
    console.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
    console.error('error object stack: ')
    console.error(e.stack)
  }
}

/**
 * @param {*}module
 */
function loadNativeModule (module) {
  return new Promise((resolve) => {
    if (module.calledRun) {
      resolve()
    } else {
      module.onRuntimeInitialized = () => {
        resolve()
      }
    }
  })
}

window.onload = async () => {
  // make sure all native modules are ready for use before we start our main flow
  await loadNativeModule(pixman)
  await loadNativeModule(libxkbcommon)
  await main()
}
