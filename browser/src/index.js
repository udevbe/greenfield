'use strict'

import BrowserSession from './BrowserSession'
import BrowserCompositor from './BrowserCompositor'
import pixman from './lib/libpixman-1'
import libxkbcommon from './lib/libxkbcommon'
import BrowserRtcPeerConnectionFactory from './BrowserRtcPeerConnectionFactory'
import BrowserRtcBufferFactory from './BrowserRtcBufferFactory'
import BrowserShell from './BrowserShell'
import BrowserSeat from './BrowserSeat'
import BrowserDataDeviceManager from './BrowserDataDeviceManager'
import BrowserOutput from './BrowserOutput'
import BrowserSubcompositor from './BrowserSubcompositor'

import './style/greenfield.css'
import BrowserXdgWmBase from './BrowserXdgWmBase'
import DesktopUserShell from './desktopshell/DesktopUserShell'

/**
 * @param {BrowserSession}browserSession
 */
function setupGlobals (browserSession) {
  const browserOutput = BrowserOutput.create()
  const browserSeat = BrowserSeat.create(browserSession)
  const browserCompositor = BrowserCompositor.create(browserSession, browserSeat)
  const browserDataDeviceManager = BrowserDataDeviceManager.create()
  const browserSubcompositor = BrowserSubcompositor.create()

  const browserRtcPeerConnectionFactory = BrowserRtcPeerConnectionFactory.create()
  const browserRtcBufferFactory = BrowserRtcBufferFactory.create()

  const desktopUserShell = DesktopUserShell.create(browserSession, browserSeat)

  const browserShell = BrowserShell.create(browserSession, desktopUserShell)
  const browserXdgWmBase = BrowserXdgWmBase.create(browserSession, desktopUserShell, browserSeat)

  browserSession.wfsServer.registry.register(browserOutput)
  browserSession.wfsServer.registry.register(browserCompositor)
  browserSession.wfsServer.registry.register(browserDataDeviceManager)
  browserSession.wfsServer.registry.register(browserSeat)
  browserSession.wfsServer.registry.register(browserShell)
  browserSession.wfsServer.registry.register(browserSubcompositor)

  browserSession.wfsServer.registry.register(browserRtcPeerConnectionFactory)
  browserSession.wfsServer.registry.register(browserRtcBufferFactory)

  browserSession.wfsServer.registry.register(browserXdgWmBase)
}

function main () {
  const compositorSessionId = uuidv4()
  const browserSession = BrowserSession.create(compositorSessionId)
  setupGlobals(browserSession)
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

/**
 * @return {string}
 */
function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

window.onload = async () => {
  // make sure all native modules are ready for use before we start our main flow
  await loadNativeModule(pixman)
  await loadNativeModule(libxkbcommon)
  await main()
}

// This adds a zero timeout 'run later' mechanism:
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Reasons_for_delays_longer_than_specified

// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
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
