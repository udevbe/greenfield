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

/**
 * @param {Session}session
 */
function setup (session) {
  const output = Output.create()
  const seat = Seat.create(session)
  const compositor = Compositor.create(session, seat)
  const dataDeviceManager = DataDeviceManager.create()
  const subcompositor = Subcompositor.create()

  const desktopUserShell = DesktopUserShell.create(session, seat)

  const shell = Shell.create(session, desktopUserShell)
  const xdgWmBase = XdgWmBase.create(session, desktopUserShell, seat)

  const webShm = WebShm.create(session)

  output.registerGlobal(session.display.registry)
  compositor.registerGlobal(session.display.registry)
  dataDeviceManager.registerGlobal(session.display.registry)
  seat.registerGlobal(session.display.registry)
  shell.registerGlobal(session.display.registry)
  subcompositor.registerGlobal(session.display.registry)

  xdgWmBase.registerGlobal(session.display.registry)

  webShm.registerGlobal(session.display.registry)

  // RtcSocket enables appl-endpoints with remote application to connect
  RtcSocket.create(session)
}

async function main () {
  // show user a warning if they want to close this page
  window.onbeforeunload = (e) => {
    const dialogText = ''
    e.returnValue = dialogText
    return dialogText
  }

  try {
    const session = await Session.create()
    setup(session)
  } catch (e) {
    // TODO notify user & retry
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
