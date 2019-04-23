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
import DesktopUserShell from './desktopshell/DesktopUserShell'
import RtcSocket from './RtcSocket'
import WebShm from './webshm/WebShm'
import WebAppSocket from './WebAppSocket'
import WebAppLauncher from './WebAppLauncher'
import WebGL from './webgl/WebGL'

/**
 * @param {Session}session
 */
async function setup (session) {
  // TODO enable through config
  await session.withRemote(() => { /* TODO retry here */ })

  const output = Output.create()
  const seat = Seat.create(session)
  const compositor = Compositor.create(session, seat)
  const dataDeviceManager = DataDeviceManager.create()
  const subcompositor = Subcompositor.create()

  const desktopUserShell = DesktopUserShell.create(session, seat)

  const shell = Shell.create(session, desktopUserShell)
  const xdgWmBase = XdgWmBase.create(session, desktopUserShell, seat)

  const webShm = WebShm.create()
  const webGL = WebGL.create()

  output.registerGlobal(session.display.registry)
  compositor.registerGlobal(session.display.registry)
  dataDeviceManager.registerGlobal(session.display.registry)
  seat.registerGlobal(session.display.registry)
  shell.registerGlobal(session.display.registry)
  subcompositor.registerGlobal(session.display.registry)

  xdgWmBase.registerGlobal(session.display.registry)

  webShm.registerGlobal(session.display.registry)
  webGL.registerGlobal(session.display.registry)

  // RtcSocket enables native appl-endpoints with remote application to connect
  RtcSocket.create(session)

  // WebAppSocket enables browser local applications running in a web worker to connect
  const webAppSocket = WebAppSocket.create(session)
  const webAppLauncher = WebAppLauncher.create(webAppSocket)

  // [TESTING] immediately launch our web shm demo client
  webAppLauncher.launch('simple.web.shm.js')
  webAppLauncher.launch('simple.web.gl.js')
}

async function main () {
  // show user a warning if they want to close this page
  window.onbeforeunload = (e) => {
    const dialogText = ''
    e.returnValue = dialogText
    return dialogText
  }

  try {
    await setup(Session.create())
    DEBUG && console.log(`Greenfield compositor started.`)
  } catch (e) {
    // TODO notify user(?) & retry setup
    console.error(`Failed to setup compositor session.`, e)
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
