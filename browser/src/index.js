'use strict'

import BrowserSession from './BrowserSession'
import BrowserCompositor from './BrowserCompositor'
import pixman from './lib/pixman/libpixman-1'

function setupGlobals (browserSession) {
  BrowserCompositor.create(browserSession.wfsServer)
}

function main () {
  BrowserSession.create('ws://' + window.location.host).then(setupGlobals).catch((error) => {
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
      module()
    }
  })
}

window.onload = () => {
  // make sure all native modules are ready for use before we start our main flow
  loadNativeModule(pixman).then(() => {
    main()
  })
}
