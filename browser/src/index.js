'use strict'

import BrowserSession from './BrowserSession'
import BrowserCompositor from './BrowserCompositor'
import pixman from './lib/libpixman-1'
import libxkbcommon from './lib/libxkbcommon'
import BrowserRtcPeerConnection from './BrowserRtcPeerConnection'
import BrowserRtcBufferFactory from './BrowserDcBufferFactory'
import BrowserShell from './BrowserShell'
import BrowserSeat from './BrowserSeat'

function setupGlobals (browserSession) {
  BrowserSeat.create(browserSession)
  BrowserCompositor.create(browserSession)
  BrowserShell.create(browserSession)

  BrowserRtcPeerConnection.create(browserSession)
  BrowserRtcBufferFactory.create(browserSession)
}

function main () {
  const sessionId = uuidv4()
  BrowserSession.create(sessionId).then(setupGlobals).catch((error) => {
    console.log(error) // TODO gracefully handle error
  })
}

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

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

window.onload = () => {
  // make sure all native modules are ready for use before we start our main flow
  loadNativeModule(pixman()).then(() => {
    return loadNativeModule(libxkbcommon())
  }).then(() => {
    main()
  })
}
