'use strict'

import BrowserSession from './BrowserSession'
import wfs from 'westfield-runtime-server'
import ClientConnection from './ClientConnection'
import BrowserCompositor from './BrowserCompositor'

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

window.onload = main
