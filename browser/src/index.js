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
  const desktopUserShell = DesktopUserShell.create(browserSession)

  const browserOutput = BrowserOutput.create()
  const browserSeat = BrowserSeat.create(browserSession, desktopUserShell)
  const browserCompositor = BrowserCompositor.create(browserSession, browserSeat)
  const browserDataDeviceManager = BrowserDataDeviceManager.create()
  const browserSubcompositor = BrowserSubcompositor.create()

  const browserRtcPeerConnectionFactory = BrowserRtcPeerConnectionFactory.create()
  const browserRtcBufferFactory = BrowserRtcBufferFactory.create()

  const browserShell = BrowserShell.create(browserSession, desktopUserShell)
  const browserXdgWmBase = BrowserXdgWmBase.create(browserSession, desktopUserShell)

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

/**
 * @return {Promise<void>}
 */
async function main () {
  const sessionId = uuidv4()
  const browserSession = await BrowserSession.create(sessionId)
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
