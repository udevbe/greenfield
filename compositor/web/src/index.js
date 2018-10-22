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

  output.registerGlobal(session.display.registry)
  compositor.registerGlobal(session.display.registry)
  dataDeviceManager.registerGlobal(session.display.registry)
  seat.registerGlobal(session.display.registry)
  shell.registerGlobal(session.display.registry)
  subcompositor.registerGlobal(session.display.registry)

  xdgWmBase.registerGlobal(session.display.registry)

  session.messageHandlers['rtcSocket'] = RtcSocket.create(session)
}

async function main () {
  // show user a warning if they want to close this page
  window.onbeforeunload = (e) => {
    const dialogText = 'dummytext'
    e.returnValue = dialogText
    return dialogText
  }

  const session = await Session.create()
  setup(session)
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

// This adds a zero timeout 'run later' mechanism:
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Reasons_for_delays_longer_than_specified
// Only add setZeroTimeout to the window object, and hide everything else in a closure.
(function () {
  const timeouts = []
  const messageName = 'zero-timeout-message'

  // Like setTimeout, but only takes a function argument.  There's
  // no time argument (always zero) and no arguments (you have to
  // use a closure).
  function setZeroTimeout (fn) {
    timeouts.push(fn)
    window.postMessage(messageName, '*')
  }

  function handleMessage (event) {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation()
      if (timeouts.length > 0) {
        const fn = timeouts.shift()
        fn()
      }
    }
  }

  window.addEventListener('message', handleMessage, true)

  // Add the one thing we want added to the window object.
  window.setZeroTimeout = setZeroTimeout
})()
