'use strict'

import BrowserSession from './BrowserSession'
import BrowserCompositor from './BrowserCompositor'
import pixman from './lib/pixman/libpixman-1'
import BrowserRtcPeerConnection from './BrowserRtcPeerConnection'
import BrowserRtcBufferFactory from './BrowserDcBufferFactory'

function setupGlobals (browserSession) {
  BrowserCompositor.create(browserSession.wfsServer)
  BrowserRtcPeerConnection.create(browserSession.wfsServer)
  BrowserRtcBufferFactory.create(browserSession.wfsServer)
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function main () {
  const sessionId = uuidv4()
  BrowserSession.create(sessionId).then(setupGlobals).catch((error) => {
    console.log(error) // TODO gracefully handle error
  })
}

function loadNativeModule (module) {
  return new Promise((resolve, reject) => {
    if (module.calledRun) {
      resolve()
    } else {
      module.onRuntimeInitialized = () => {
        resolve()
      }
    }
  })
}

window.onload = () => {
  // make sure all native modules are ready for use before we start our main flow
  loadNativeModule(pixman()).then(() => {
    main()
  })
}
