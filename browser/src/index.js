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

function main () {
  BrowserSession.create('ws://' + window.location.host + '/greenfield').then(setupGlobals).catch((error) => {
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
