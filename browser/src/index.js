'use strict'

import BrowserSession from './BrowserSession'
import wfs from 'westfield-runtime-server'
import ClientConnection from './ClientConnection'
import BrowserCompositor from './BrowserCompositor'
import pixman from './lib/pixman/libpixman-1'

function onBrowserSession (session) {
  const server = new wfs.Server()
  const browserCompositor = BrowserCompositor.create()

  session.onClient = () => {
    ClientConnection.create(server, 'ws://' + window.location.host).then(browserCompositor.onClientConnection).catch((error) => {
      console.log(error) // TODO gracefully handle error
    })
  }
}

function main () {
  BrowserSession.create('ws://' + window.location.host).then(onBrowserSession).catch((error) => {
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
